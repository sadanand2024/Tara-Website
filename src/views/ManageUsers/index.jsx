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

// project imports
import UserList from './UserList';
import AddUser from './AddUser';
import PermissionsDrawer from './PermissionsDrawer';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Factory from 'utils/Factory';
import { useSelector } from 'store';

// assets
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AddIcon from '@mui/icons-material/Add';

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
      user.permissions.forEach(modulePermission => {
        // Check if module has service_actions array
        if (Array.isArray(modulePermission.service_actions)) {
          // Add each service action to the permissions object
          modulePermission.service_actions.forEach(serviceAction => {
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

  const handleSavePermissions = async () => {
    try {
      // Group permissions by module
      const modulePermissions = masterPermissions.reduce((acc, module) => {
        const moduleServiceActions = Object.entries(selectedPermissions)
          .filter(([key, value]) => value) // Only include selected permissions
          .map(([key, _]) => key) // Get the permission key
          .filter(key => {
            // Check if any service in this module matches the permission key
            return module.features.some(feature => 
              key === `${feature.service}.${feature.action.toLowerCase()}`
            );
          });

        if (moduleServiceActions.length > 0) {
          acc.push({
            module_id: module.module_id,
            service_actions: moduleServiceActions
          });
        }

        return acc;
      }, []);

      console.log('Saving permissions for user:', selectedUser?.user_id, modulePermissions);
      
      // Make API call to save permissions
      const response = await Factory(
        'post',
        `/user_management/user/${selectedUser?.user_id}/permissions`,
        {
          permissions: modulePermissions
        },
        {}
      );

      if (response.res.status_cd === 0) {
        // Show success message or handle success case
        console.log('Permissions saved successfully');
      } else {
        // Handle error case
        console.error('Failed to save permissions:', response.res.status_msg);
      }

      handleClosePermissionDrawer();
    } catch (error) {
      console.error('Error saving permissions:', error);
      // Handle error appropriately
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
      console.log(context_id);
      const response = await Factory('get', `/user_management/context/${context_id}/module-features`, {}, {});
      if (response.res.status_cd === 0) {
        console.log(response.res.data.data);
        setMasterPermissions(response.res.data.data);
      }
    };
    getUsersPermissions();
    getUsers(); // Call getUsers when component mounts
  }, [user.active_context.id]);

  // Add effect to refresh users when page or rowsPerPage changes
  useEffect(() => {
    getUsers();
  }, [page, rowsPerPage]);

  return (
    <MainCard
      title={
        <Grid container spacing={gridSpacing} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h3" sx={{ p: 0 }}>
              List
            </Typography>
          </Grid>
          <Grid>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddDialogOpen} size="small">
                Add User
              </Button>
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
            </Stack>
          </Grid>
        </Grid>
      }
      content={false}
    >
      <UserList
        page={page}
        rowsPerPage={rowsPerPage}
        searchQuery={searchQuery}
        onTotalUsers={handleTotalUsers}
        onOpenPermissions={handleOpenPermissionDrawer}
        loading={loading}
        users={users}
      />
      <Grid sx={{ p: 1.5 }} size={12}>
        <Grid container spacing={gridSpacing} sx={{ justifyContent: 'space-between' }}>
          <Grid>
            <Pagination
              count={Math.ceil(totalUsers / rowsPerPage)}
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
      <AddUser open={openAddDialog} onClose={handleAddDialogClose} user={user} />
      <PermissionsDrawer
        open={openPermissionDrawer}
        onClose={handleClosePermissionDrawer}
        selectedUser={selectedUser}
        selectedPermissions={selectedPermissions}
        onPermissionChange={handlePermissionChange}
        onSave={handleSavePermissions}
        masterPermissions={masterPermissions}
      />
    </MainCard>
  );
}
