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

  return colorMap[roleType?.toLowerCase()] || {
    bgcolor: 'info.dark',
    color: '#fff'
  };
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
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;

    return users.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobile_number?.includes(searchQuery)
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
          {searchQuery ? 'No users found matching your search' : 'No users found'}
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
            <TableCell sx={{ p: 1.5 }}>ID</TableCell>
            <TableCell sx={{ p: 1.5 }}>User Profile</TableCell>
            <TableCell sx={{ p: 1.5 }}>Role</TableCell>
            <TableCell sx={{ p: 1.5 }}>Mobile</TableCell>
            <TableCell sx={{ p: 1.5 }}>Added By</TableCell>
            <TableCell sx={{ p: 1.5 }}>Status</TableCell>
            <TableCell align="center" sx={{ pr: 2 }}>
              Permissions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user, index) => (
            <TableRow hover key={user.user_id}>
              <TableCell sx={{ pl: 3 }}>{(page - 1) * rowsPerPage + index + 1}</TableCell>
              <TableCell sx={{ p: 1.8 }}>{user.user_id}</TableCell>
              <TableCell sx={{ p: 1.8 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Avatar
                    color="primary"
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: (theme) => theme.palette.primary.light,
                      color: (theme) => theme.palette.primary.dark
                    }}
                  >
                    {getInitials(user.first_name, user.last_name, user.email)}
                  </Avatar>
                  <Stack>
                    <Typography variant="body1">{getFullName(user.first_name, user.last_name, user.email)}</Typography>
                    <Typography variant="caption" noWrap>
                      {user.email}
                    </Typography>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell>
                {user.role && (
                  <Chip
                    label={user.role.role_name}
                    size="small"
                    sx={{ 
                      height: 20,
                      bgcolor: (theme) => getRoleColor(user.role.role_type).bgcolor,
                      color: getRoleColor(user.role.role_type).color,
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                )}
              </TableCell>
              <TableCell>{user.mobile_number || '-'}</TableCell>
              <TableCell>
                {user.role?.added_by ? (
                  <Stack>
                    <Typography variant="body1">
                      {user.role.added_by.name !== 'Unknown'
                        ? capitalizeFirstLetter(user.role.added_by.name)
                        : getFullName(null, null, user.role.added_by.email)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.role.added_by.email}
                    </Typography>
                  </Stack>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <Stack spacing={0.4} alignItems="flex-start">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: user.status === 'active' ? 'success.darker' : user.status === 'pending' ? 'warning.dark' : 'error.dark',
                        fontWeight: 500
                      }}
                    >
                      {user.status === 'active' ? 'Active' : user.status === 'pending' ? 'Pending Invitation' : 'Inactive'}
                    </Typography>
                    {user.status === 'pending' && (
                      <Tooltip title="User needs to accept the invitation email to activate their account" placement="top">
                        <InfoIcon
                          sx={{
                            fontSize: '1rem',
                            color: 'warning.main',
                            cursor: 'help'
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  {user.status === 'pending' ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontStyle: 'italic',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      Waiting for user to accept invitation
                    </Typography>
                  ) : (
                    <Switch
                      size="small"
                      checked={user.status === 'active'}
                      onChange={() => handleStatusChange(user.user_id, user.status)}
                      color="success"
                      sx={{
                        mt: 0,
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'success.dark',
                          '&:hover': {
                            bgcolor: 'success.lighter'
                          }
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          bgcolor: 'success.light'
                        },
                        '& .MuiSwitch-switchBase': {
                          color: 'error.light',
                          '&:hover': {
                            bgcolor: 'error.lighter'
                          }
                        },
                        '& .MuiSwitch-track': {
                          bgcolor: 'error.light'
                        }
                      }}
                    />
                  )}
                </Stack>
              </TableCell>
              <TableCell align="center" sx={{ pr: 2 }}>
                <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Tooltip placement="top" title="Modify Permissions">
                    <IconButton
                      onClick={() => onOpenPermissions(user)}
                      color="secondary"
                      size="small"
                      sx={{
                        color: 'secondary.dark',
                        '&:hover': {
                          bgcolor: 'secondary.lighter'
                        }
                      }}
                    >
                      <AdminPanelSettingsIcon sx={{ fontSize: '1.8rem' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
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
