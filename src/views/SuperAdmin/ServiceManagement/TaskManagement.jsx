import React, { useEffect } from 'react';

// material-ui
import MainCard from 'ui-component/cards/MainCard';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';
import Factory from 'utils/Factory';
import ServiceRequests from './TableList';
import { useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { IconSearch } from '@tabler/icons-react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

export default function TaskManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state).accountReducer.user;
  const [tab, setTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [service, setService] = React.useState('');
  const [client, setClient] = React.useState('');
  const [assignee, setAssignee] = React.useState('');
  const [source, setSource] = React.useState('');
  const [reviewer, setReviewer] = React.useState('');
  const [statusFilters, setStatusFilters] = React.useState({
    pending: false,
    inProgress: false,
    sentToReview: false,
    underReview: false,
    requestChanges: false,
    overDue: false,
    completed: false
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event, newValue) => setTab(newValue);
  const handleSearch = (event) => setSearchQuery(event.target.value);
  const handleStatusChange = (event) => {
    setStatusFilters({ ...statusFilters, [event.target.name]: event.target.checked });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <MainCard
        title={
          <Grid container spacing={gridSpacing} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <Typography variant="h3" sx={{ p: 0 }}>
                Task Management
              </Typography>
            </Grid>
            <Grid>
              <Stack direction="row" spacing={2}>
                <OutlinedInput
                  id="input-search-list-style1"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconSearch stroke={1.5} size="16px" />
                    </InputAdornment>
                  }
                  size="small"
                />
                {/* <Button variant="contained" color="primary" size="small">
                  Add Service
                </Button> */}
              </Stack>
            </Grid>
          </Grid>
        }
        content={false}
      >
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ width: '100%', minHeight: 36 }}>
            <Tab
              icon={<AssignmentIcon fontSize="small" />}
              iconPosition="start"
              label="Services"
              sx={{ minHeight: 36, minWidth: 0, p: 2, gap: 0.5 }}
            />
            <Tab
              icon={<TaskIcon fontSize="small" />}
              iconPosition="start"
              label="Tasks"
              sx={{ minHeight: 36, minWidth: 0, p: 2, gap: 0.5 }}
            />
            <Tab
              icon={<PlaylistAddCheckIcon fontSize="small" />}
              iconPosition="start"
              label="Sub Tasks"
              sx={{ minHeight: 36, minWidth: 0, p: 2, gap: 0.5 }}
            />
          </Tabs>
        </Stack>
        <Box sx={{ mt: 2 }}>
          {/* <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs>
              <Select value={category} onChange={(e) => setCategory(e.target.value)} displayEmpty size="small" fullWidth>
                <MenuItem value="">
                  <em>Category</em>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs>
              <Select value={service} onChange={(e) => setService(e.target.value)} displayEmpty size="small" fullWidth>
                <MenuItem value="">
                  <em>Service</em>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs>
              <Select value={client} onChange={(e) => setClient(e.target.value)} displayEmpty size="small" fullWidth>
                <MenuItem value="">
                  <em>Client</em>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs>
              <Select value={assignee} onChange={(e) => setAssignee(e.target.value)} displayEmpty size="small" fullWidth>
                <MenuItem value="">
                  <em>Assignee</em>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs>
              <Select value={source} onChange={(e) => setSource(e.target.value)} displayEmpty size="small" fullWidth>
                <MenuItem value="">
                  <em>Source</em>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs>
              <Select value={reviewer} onChange={(e) => setReviewer(e.target.value)} displayEmpty size="small" fullWidth>
                <MenuItem value="">
                  <em>Reviewer</em>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <FormControlLabel control={<Checkbox checked={statusFilters.pending} onChange={handleStatusChange} name="pending" />} label="Pending" />
                <FormControlLabel control={<Checkbox checked={statusFilters.inProgress} onChange={handleStatusChange} name="inProgress" />} label="In- Progress" />
                <FormControlLabel control={<Checkbox checked={statusFilters.sentToReview} onChange={handleStatusChange} name="sentToReview" />} label="Sent to Review" />
                <FormControlLabel control={<Checkbox checked={statusFilters.underReview} onChange={handleStatusChange} name="underReview" />} label="Under Review" />
                <FormControlLabel control={<Checkbox checked={statusFilters.requestChanges} onChange={handleStatusChange} name="requestChanges" />} label="Request Changes" />
                <FormControlLabel control={<Checkbox checked={statusFilters.overDue} onChange={handleStatusChange} name="overDue" />} label="Over Due" />
                <FormControlLabel control={<Checkbox checked={statusFilters.completed} onChange={handleStatusChange} name="completed" />} label="Completed" />
              </Stack>
            </Grid>
          </Grid> */}
          {tab === 0 && <ServiceRequests searchQuery={searchQuery} assigned={true} />}
          {tab === 1 && (
            <Box sx={{ p: 3, textAlign: 'center', color: 'grey.600' }}>
              <Typography variant="h6">Tasks Table (Coming Soon)</Typography>
            </Box>
          )}
          {tab === 2 && (
            <Box sx={{ p: 3, textAlign: 'center', color: 'grey.600' }}>
              <Typography variant="h6">Sub Tasks Table (Coming Soon)</Typography>
            </Box>
          )}
        </Box>
      </MainCard>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
