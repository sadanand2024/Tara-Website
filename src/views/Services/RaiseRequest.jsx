import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Stack,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { useSelector } from 'store';
import { useSnackbar } from 'notistack';
import Factory from '../../utils/Factory';
import { useTheme } from '@mui/material/styles';

const RaiseRequest = ({ fields, task_id, details }) => {
  const user = useSelector((state) => state).accountReducer.user;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestType, setRequestType] = useState(fields.length === 0 ? 'Other' : null);
  const [otherRequestType, setOtherRequestType] = useState('');
  const [description, setDescription] = useState('');

  console.log(requestType);
  const handleSubmit = async () => {
    let apiType = 'post';
    const response = await Factory(apiType, '/servicetasks/subtasks/', {
      parent_task: task_id,
      title: requestType === 'Other' ? otherRequestType : requestType,
      description: description
    });
    if (response.res.status_cd === 0) {
      enqueueSnackbar('Request raised successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      reset();
    } else {
      enqueueSnackbar('Request raised failed', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  const fetchRequests = async () => {
    const response = await Factory('get', `/servicetasks/tasks/${task_id}/subtasks/`);
    if (response.res.status_cd === 0) {
      setRequests(response.res.data);
    } else {
      setRequests([]);
      enqueueSnackbar(response.res.message, { variant: 'error' });
    }
  };

  const reset = () => {
    setRequestType(null);
    setOtherRequestType('');
    setDescription('');
    setRequests([]);
    setType(null);
    setOpen(false);
  };
  useEffect(() => {
    if (type === 'view' && task_id && open) {
      fetchRequests();
    }
  }, [type, open, task_id]);

  const handleStatusChange = async (e, id) => {
    const newStatus = e.target.value;
    const response = await Factory('put', `/servicetasks/subtasks/${id}/update/`, {
      status: newStatus
    });
    if (response.res.status_cd === 0) {
      fetchRequests();
      enqueueSnackbar('Status updated successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Status update failed', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => {
          setType('raise');
          setOpen(true);
        }}
      >
        Raise Request
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={() => {
          setType('view');
          setOpen(true);
        }}
      >
        View Requests
      </Button>
      <Dialog open={open} onClose={reset} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ px: 3, py: 0.5 }}>{type === 'raise' ? 'Raise a Request' : 'View Requests'}</DialogTitle>
        <DialogContent sx={{ px: type === 'raise' ? 3 : 0, py: 0, pb: 2 }} dividers>
          {type === 'raise' ? (
            <Box mt={2}>
              {requestType === 'Other' ? (
                <TextField
                  label="Request Type"
                  variant="outlined"
                  fullWidth
                  required
                  value={otherRequestType}
                  onChange={(e) => setOtherRequestType(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Enter request type..."
                />
              ) : (
                <Autocomplete
                  options={[...fields, 'Other']}
                  value={requestType}
                  onChange={(_, value) => setRequestType(value)}
                  renderInput={(params) => <TextField {...params} label="Request Type" variant="outlined" fullWidth required />}
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your request..."
              />
            </Box>
          ) : (
            <>
              {requests.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" height="20vh">
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    No requests for the selected task
                  </Typography>
                </Box>
              )}
              {requests.length > 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ pl: 3 }}>Request Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.map((request) => {
                        let statusColor = theme.palette.error.main;
                        let statusBg = theme.palette.error.lighter || theme.palette.error.light;
                        let statusText = request.status;
                        if (statusText.toLowerCase() === 'pending') {
                          statusColor = theme.palette.warning.main;
                          statusBg = theme.palette.warning.light;
                        } else if (statusText.toLowerCase() === 'completed') {
                          statusColor = theme.palette.success.main;
                          statusBg = theme.palette.success.light;
                        } else if (statusText.toLowerCase() === 'rejected') {
                          statusColor = theme.palette.error.main;
                          statusBg = theme.palette.error.light;
                        }
                        return (
                          <TableRow key={request.id}>
                            <TableCell sx={{ pl: 3 }}>{request.title}</TableCell>
                            <TableCell sx={{ p: 1 }}>{request.description}</TableCell>
                            <TableCell sx={{ p: 1 }}>
                              <Select
                                value={request.status}
                                onChange={(e) => handleStatusChange(e, request.id)}
                                size="small"
                                variant="standard"
                                disabled={false}
                                sx={{
                                  minWidth: 80,
                                  fontWeight: 500,
                                  '.MuiSelect-icon': { color: statusColor },
                                  display: 'inline-block',
                                  px: 1,
                                  py: 0.5,
                                  pt: 1,
                                  borderRadius: 2,
                                  background: statusBg,
                                  color: statusColor
                                }}
                                disableUnderline
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 0, pt: 1 }}>
          <Button onClick={reset} color="error" variant="outlined">
            {type === 'raise' ? 'Cancel' : 'Close'}
          </Button>
          {type === 'raise' && (
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!requestType || !description.trim()}>
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default RaiseRequest;
