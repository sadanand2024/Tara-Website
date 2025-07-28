import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { IconClock } from '@tabler/icons-react';

const PendingLeaves = () => {
  // Mock data for pending leaves
  const pendingLeaves = [
    {
      id: 1,
      leaveType: 'Casual Leave',
      fromDate: '2024-06-15',
      toDate: '2024-06-16',
      days: 2,
      reason: 'Personal',
      status: 'Pending',
      appliedOn: '2024-06-10',
      approver: 'D. Vijay Kumar'
    },
    {
      id: 2,
      leaveType: 'Sick Leave',
      fromDate: '2024-06-20',
      toDate: '2024-06-21',
      days: 2,
      reason: 'Medical',
      status: 'Under Review',
      appliedOn: '2024-06-12',
      approver: 'John Doe'
    },
    {
      id: 3,
      leaveType: 'Annual Leave',
      fromDate: '2024-07-01',
      toDate: '2024-07-05',
      days: 5,
      reason: 'Travel',
      status: 'Pending',
      appliedOn: '2024-06-08',
      approver: 'Jane Smith'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Under Review':
        return 'info';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconClock size={24} style={{ marginRight: 8 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Pending Leave Requests
          </Typography>
        </Box>

        {pendingLeaves.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No pending leave requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All your leave requests have been processed
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date Range</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Days</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Applied On</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Approver</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingLeaves.map((leave) => (
                  <TableRow key={leave.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {leave.leaveType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {leave.days} day{leave.days > 1 ? 's' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{leave.reason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={leave.status} color={getStatusColor(leave.status)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(leave.appliedOn)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">{leave.approver}</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingLeaves;
