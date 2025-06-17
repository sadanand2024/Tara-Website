import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Factory from 'utils/Factory';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const SubTasks = ({ searchQuery, assigned }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchSubTasks = async () => {
    try {
      const response = await Factory('get', '/servicetasks/subtasks-list/', {
        search: searchQuery,
        assigned: assigned
      });
      if (response.res.status_cd === 0) {
        setSubTasks(response.res.data);
      } else {
        enqueueSnackbar(response.res.message, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching sub tasks:', error);
      enqueueSnackbar('Failed to fetch sub tasks', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubTasks();
  }, [searchQuery, assigned]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );

  const handleStatusChange = async (e, id) => {
    const newStatus = e.target.value;
    const response = await Factory('put', `/servicetasks/subtasks/${id}/update/`, {
      status: newStatus
    });
    if (response.res.status_cd === 0) {
      console.log(response.res.data);
      fetchSubTasks();
      enqueueSnackbar('Status updated successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Status update failed', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subTasks.map((task) => {
            let statusColor = theme.palette.error.main;
            let statusBg = theme.palette.error.lighter || theme.palette.error.light;
            let statusText = task.status;
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
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell align="center">
                  {new Date(task.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e, task.id)}
                    size="small"
                    variant="standard"
                    sx={{
                      minWidth: 80,
                      fontWeight: 500,
                      '.MuiSelect-icon': { color: statusColor },
                      display: 'inline-block',
                      pr: 2,
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
                <TableCell align="center">
                  <IconButton onClick={() => console.log(task)} color="error" variant="outlined" sx={{ borderRadius: 2 }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubTasks;
