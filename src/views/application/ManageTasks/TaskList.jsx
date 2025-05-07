import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project imports
import Factory from 'utils/Factory';

// assets
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleTwoToneIcon from '@mui/icons-material/Check';

// ==============================|| USER LIST ||============================== //

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

const TaskList = ({ page, rowsPerPage, searchQuery, onTotalUsers, onOpenPlans, loading, users }) => {
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
            <TableCell>Payment Status</TableCell>
            <TableCell>Payment Id</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((task, index) => (
            <TableRow
              hover
              key={task.id}
              sx={{
                '& td, & th': {
                  py: 1.5 // increase vertical padding on all cells
                }
              }}
            >
              <TableCell sx={{ pl: 3 }}>{(page - 1) * rowsPerPage + index + 1}</TableCell>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.service_name?.charAt(0).toUpperCase() + task.service_name?.slice(1)}</TableCell>
              <TableCell>
                {task.plan_name ? (
                  task.plan_name?.charAt(0).toUpperCase() + task.plan_name?.slice(1)
                ) : (
                  <Chip label="Pending" color="warning" size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                )}
              </TableCell>
              <TableCell>
                {task.status === 'paid' ? (
                  <Chip
                    label={task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                    icon={<CheckCircleTwoToneIcon />}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                ) : (
                  <Button variant="outlined" color="primary" size="small" onClick={() => onOpenPlans(task)}>
                    Complete Payment
                  </Button>
                )}
              </TableCell>
              <TableCell>{task.payment_order_id || '-'}</TableCell>
              <TableCell>
                <Typography variant="body1" color="text" fontWeight={500}>
                  {task.created_at ? new Date(task.created_at).toLocaleDateString() : '-'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {task.created_at ? new Date(task.created_at).toLocaleTimeString() : '-'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TaskList.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onTotalUsers: PropTypes.func.isRequired,
  onOpenPlans: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired
};

export default TaskList;
