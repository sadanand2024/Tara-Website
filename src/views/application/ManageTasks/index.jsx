import React, { useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// project imports
import TaskList from './TaskList';
import AddUser from './AddUser';
import PlanDrawer from './PlanDrawer';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Factory from 'utils/Factory';
import { useSelector } from 'store';

// assets
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AddIcon from '@mui/icons-material/Add';

// ==============================|| MANAGE USERS ||============================== //

export default function ManageTasks() {
  const user = useSelector((state) => state).accountReducer.user;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalTasks, setTotalTasks] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openPlanDrawer, setOpenPlanDrawer] = React.useState(false);
  const [selectedPlans, setSelectedPlans] = React.useState({});
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [masterPlans, setMasterPlans] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(value);
    setPage(1);
    handleClose();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleTotalUsers = (total) => {
    setTotalTasks(total);
  };

  const handleOpenPlanDrawer = (service_request) => {
    setSelectedTask(service_request);
    setOpenPlanDrawer(true);
  };

  const handleClosePlanDrawer = () => {
    setOpenPlanDrawer(false);
    setSelectedTask(null);
    setSelectedPlans({});
  };

  const handlePlanChange = (PlanId, checked) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [PlanId]: checked
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSavePlans = async () => {
    //   try {
    //     // Group Plans by module
    //     const modulePlans = masterPlans.reduce((acc, module) => {
    //       const moduleServiceActions = Object.entries(selectedPlans)
    //         .filter(([key, value]) => value)
    //         .map(([key, _]) => key)
    //         .filter((key) => {
    //           return module.features.some((feature) => key === `${feature.service}.${feature.action.toLowerCase()}`);
    //         });
    //       acc.push({
    //         module: module.module_id,
    //         actions: [...moduleServiceActions]
    //       });
    //       return acc;
    //     }, []);
    //     const response = await Factory(
    //       'put',
    //       `/user_management/user-feature-Plans/user-context-role/${selectedTask?.role.user_context_role_id}/bulk-update/`,
    //       modulePlans,
    //       {}
    //     );
    //     if (response.res.status_cd === 0) {
    //       showSnackbar('Task Plans updated successfully');
    //       getTasks();
    //     } else {
    //       showSnackbar(response.res.status_msg || 'Failed to update task Plans', 'error');
    //     }
    //     handleClosePlanDrawer();
    //   } catch (error) {
    //     console.error('Error saving Plans:', error);
    //     showSnackbar('Failed to update task Plans. Please try again.', 'error');
    //   }
  };

  const getTasks = async () => {
    try {
      setLoading(true);
      const response = await Factory('get', `/user_management/context-service-requests/${user.active_context.id}/`, {}, {});
      if (response.res.status_cd === 0) {
        console.log(response.res.data);
        setTasks(response.res.data);
        setTotalTasks(response.res.data.total || response.res.data.length);
      } else {
        console.log('1');
        setTasks([]);
        setTotalTasks(0);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setTotalTasks(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
    //   const context_id = user.active_context.id;
    //   const getUsersPlans = async () => {
    //     const response = await Factory('get', `/user_management/context/${context_id}/module-features`, {}, {});
    //     if (response.res.status_cd === 0) {
    //       setMasterPlans(response.res.data.data);
    //     }
    //   };
    //   getUsersPlans();
    //   getTasks(); // Call getTasks when component mounts
  }, [user.active_context.id]);

  // Add effect to refresh users when page or rowsPerPage changes

  return (
    <>
      <MainCard
        title={
          <Grid container spacing={gridSpacing} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <Typography variant="h3" sx={{ p: 0 }}>
                Task List
              </Typography>
            </Grid>
            <Grid></Grid>
          </Grid>
        }
        content={false}
      >
        <TaskList
          page={page}
          rowsPerPage={rowsPerPage}
          searchQuery={searchQuery}
          onTotalUsers={handleTotalUsers}
          onOpenPlans={handleOpenPlanDrawer}
          loading={loading}
          users={tasks}
        />
        <Grid sx={{ p: 1.5 }} size={12}>
          <Grid container spacing={gridSpacing} sx={{ justifyContent: 'space-between' }}>
            <Grid>
              <Pagination
                count={Math.ceil(totalTasks / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                shape="rounded"
              />
            </Grid>
            <Grid>
              <Button size="large" sx={{ color: 'grey.900' }} color="secondary" endIcon={<ExpandMoreRoundedIcon />} onClick={handleClick}>
                {rowsPerPage} Rows
              </Button>
              <Menu
                id="menu-user-list-style1"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
              >
                <MenuItem onClick={() => handleChangeRowsPerPage(10)}>10 Rows</MenuItem>
                <MenuItem onClick={() => handleChangeRowsPerPage(20)}>20 Rows</MenuItem>
                <MenuItem onClick={() => handleChangeRowsPerPage(30)}>30 Rows</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
        {/* <AddUser open={openAddDialog} onClose={handleAddDialogClose} user={user} getTasks={getTasks} /> */}
        <PlanDrawer
          type="service"
          moduleId={selectedTask?.service}
          open={openPlanDrawer}
          onClose={handleClosePlanDrawer}
          selectedTask={selectedTask}
          selectedPlans={selectedPlans}
          onPlanChange={handlePlanChange}
          onSave={handleSavePlans}
          masterPlans={masterPlans}
        />
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
