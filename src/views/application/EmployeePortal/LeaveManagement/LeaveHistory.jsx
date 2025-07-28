import React, { useState } from 'react';
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
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2
} from '@mui/material';
import { IconHistory, IconSearch } from '@tabler/icons-react';

const LeaveHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for leave history
  const leaveHistory = [
    {
      id: 1,
      leaveType: 'Casual Leave',
      fromDate: '2024-05-15',
      toDate: '2024-05-16',
      days: 2,
      reason: 'Personal',
      status: 'Approved',
      appliedOn: '2024-05-10',
      approvedOn: '2024-05-12',
      approver: 'D. Vijay Kumar',
      comments: 'Approved as requested'
    },
    {
      id: 2,
      leaveType: 'Sick Leave',
      fromDate: '2024-04-20',
      toDate: '2024-04-21',
      days: 2,
      reason: 'Medical',
      status: 'Approved',
      appliedOn: '2024-04-18',
      approvedOn: '2024-04-19',
      approver: 'John Doe',
      comments: 'Get well soon'
    },
    {
      id: 3,
      leaveType: 'Annual Leave',
      fromDate: '2024-03-01',
      toDate: '2024-03-05',
      days: 5,
      reason: 'Travel',
      status: 'Rejected',
      appliedOn: '2024-02-25',
      approvedOn: '2024-02-28',
      approver: 'Jane Smith',
      comments: 'Project deadline conflicts'
    },
    {
      id: 4,
      leaveType: 'Casual Leave',
      fromDate: '2024-02-10',
      toDate: '2024-02-10',
      days: 1,
      reason: 'Personal',
      status: 'Approved',
      appliedOn: '2024-02-08',
      approvedOn: '2024-02-09',
      approver: 'D. Vijay Kumar',
      comments: 'Approved'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Pending':
        return 'warning';
      case 'Under Review':
        return 'info';
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

  // Filter data based on search term and status
  const filteredHistory = leaveHistory.filter((leave) => {
    const matchesSearch =
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.approver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconHistory size={24} style={{ marginRight: 8 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Leave History
          </Typography>
        </Box>

        {/* Filters */}
        <Grid2 container spacing={2} sx={{ mb: 3 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Search by leave type, reason, or approver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <IconSearch size={20} style={{ marginRight: 8 }} />
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>

        {filteredHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No leave history found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria' : "You haven't applied for any leaves yet"}
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
                  <TableCell sx={{ fontWeight: 600 }}>Approved On</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Approver</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map((leave) => (
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
                      <Typography variant="body2">{leave.approvedOn ? formatDate(leave.approvedOn) : '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">{leave.approver}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 150 }}>
                        {leave.comments || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Summary */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Total Records: {filteredHistory.length} | Approved: {filteredHistory.filter((l) => l.status === 'Approved').length} | Rejected:{' '}
            {filteredHistory.filter((l) => l.status === 'Rejected').length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeaveHistory;
