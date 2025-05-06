import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import Factory from 'utils/Factory';

// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockCircleIcon from '@mui/icons-material/Block';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleTwoToneIcon from '@mui/icons-material/Check';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InfoIcon from '@mui/icons-material/Info';

// ==============================|| USER LIST ||============================== //

const getRoleColor = (roleType) => {
  // Map of role types to background colors using primary and secondary shades
  const colorMap = {
    owner: {
      bgcolor: 'primary.dark',
      color: '#fff'
    },
    admin: {
      bgcolor: 'primary.main',
      color: '#fff'
    },
    manager: {
      bgcolor: 'secondary.dark',
      color: '#fff'
    },
    supervisor: {
      bgcolor: 'secondary.main',
      color: '#fff'
    },
    staff: {
      bgcolor: 'info.dark',
      color: '#fff'
    },
    user: {
      bgcolor: 'info.main',
      color: '#fff'
    }
  };

  return (
    colorMap[roleType?.toLowerCase()] || {
      bgcolor: 'info.dark',
      color: '#fff'
    }
  );
};

const getInitials = (first_name, last_name, email) => {
  if (first_name && last_name) {
    return `${first_name[0]}${last_name[0]}`.toUpperCase();
  }
  return email ? email[0].toUpperCase() : 'U';
};

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getFullName = (first_name, last_name, email) => {
  if (first_name && last_name) {
    return `${capitalizeFirstLetter(first_name)} ${capitalizeFirstLetter(last_name)}`;
  }
  if (email) {
    const name = email.split('@')[0];
    return capitalizeFirstLetter(name.replace(/[._]/g, ' '));
  }
  return 'Unknown User';
};

const UserList = ({ page, rowsPerPage, searchQuery, onTotalUsers, onOpenPermissions, loading, users }) => {
  console.log(users);
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(
      (task) =>
        task.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.plan_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  React.useEffect(() => {
    onTotalUsers(filteredUsers.length);
  }, [filteredUsers, onTotalUsers]);

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await Factory('put', `/user_management/team/member/${userId}/status/`, { status: newStatus }, {});
      if (response.res.status_cd === 0) {
        // The parent component should handle refreshing the user list
        console.log('Status updated successfully');
      } else {
        console.error('Failed to update status:', response.res.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!filteredUsers.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          flexDirection: 'column',
          gap: 2
        }}
      >
        <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary">
          {searchQuery ? 'No tasks found matching your search' : 'No tasks found'}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 3 }}>S.No</TableCell>
            <TableCell>Task ID</TableCell>
            <TableCell>Service Name</TableCell>
            <TableCell>Plan Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((task, index) => (
            <TableRow hover key={task.id}>
              <TableCell sx={{ pl: 3 }}>{(page - 1) * rowsPerPage + index + 1}</TableCell>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.service_name}</TableCell>
              <TableCell>{task.plan_name}</TableCell>
              <TableCell>
                {task.status === 'paid' ? (
                  <Chip
                    label={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                ) : (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={() => onOpenPermissions(task)}
                  >
                    Complete Payment
                  </Button>
                )}
              </TableCell>
              <TableCell>{task.created_at ? new Date(task.created_at).toLocaleString() : '-'}</TableCell>
              <TableCell>{task.updated_at ? new Date(task.updated_at).toLocaleString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

UserList.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onTotalUsers: PropTypes.func.isRequired,
  onOpenPermissions: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired
};

export default UserList;
