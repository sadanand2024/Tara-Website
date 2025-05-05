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
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Factory from 'utils/Factory';
import { useSelector } from 'store';

// ==============================|| MANAGE USERS ||============================== //

export default function ManageUsers() {
  const user = useSelector((state) => state).accountReducer.user;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openPermissionDrawer, setOpenPermissionDrawer] = React.useState(false);
  const [selectedPermissions, setSelectedPermissions] = React.useState({});
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [masterPermissions, setMasterPermissions] = React.useState([]);
  const [users, setUsers] = React.useState([]);
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
    setTotalUsers(total);
  };

  const handleOpenPermissionDrawer = (user) => {
    setSelectedUser(user);
    const permissionsObject = {};

    // Check if user has permissions array
    if (Array.isArray(user.permissions)) {
      // Iterate through each module's permissions
      user.permissions.forEach((modulePermission) => {
        // Check if module has service_actions array
        if (Array.isArray(modulePermission.service_actions)) {
          // Add each service action to the permissions object
          modulePermission.service_actions.forEach((serviceAction) => {
            permissionsObject[serviceAction] = true;
          });
        }
      });
    }

    setSelectedPermissions(permissionsObject);
    setOpenPermissionDrawer(true);
  };

  const handleClosePermissionDrawer = () => {
    setOpenPermissionDrawer(false);
    setSelectedUser(null);
    setSelectedPermissions({});
  };

  const handlePermissionChange = (permissionId, checked) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: checked
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

  const handleSavePermissions = async () => {
    try {
      // Group permissions by module
      const modulePermissions = masterPermissions.reduce((acc, module) => {
        const moduleServiceActions = Object.entries(selectedPermissions)
          .filter(([key, value]) => value)
          .map(([key, _]) => key)
          .filter((key) => {
            return module.features.some((feature) => key === `${feature.service}.${feature.action.toLowerCase()}`);
          });

        acc.push({
          module: module.module_id,
          actions: [...moduleServiceActions]
        });

        return acc;
      }, []);

      const response = await Factory(
        'put',
        `/user_management/user-feature-permissions/user-context-role/${selectedUser?.role.user_context_role_id}/bulk-update/`,
        modulePermissions,
        {}
      );

      if (response.res.status_cd === 0) {
        showSnackbar('Permissions updated successfully');
        getUsers();
      } else {
        showSnackbar(response.res.status_msg || 'Failed to update permissions', 'error');
      }

      handleClosePermissionDrawer();
    } catch (error) {
      console.error('Error saving permissions:', error);
      showSnackbar('Failed to update permissions. Please try again.', 'error');
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await Factory('get', `/user_management/context/users?context_id=${user.active_context.id}`, {}, {});
      if (response.res.status_cd === 0) {
        setUsers(response.res.data.users);
        setTotalUsers(response.res.data.total || response.res.data.users.length);
      } else {
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const context_id = user.active_context.id;
    const getUsersPermissions = async () => {
      const response = await Factory('get', `/user_management/context/${context_id}/module-features`, {}, {});
      if (response.res.status_cd === 0) {
        setMasterPermissions(response.res.data.data);
      }
    };
    getUsersPermissions();
    getUsers(); // Call getUsers when component mounts
  }, [user.active_context.id]);

  // Add effect to refresh users when page or rowsPerPage changes

  return <h1>My Services</h1>;
}
