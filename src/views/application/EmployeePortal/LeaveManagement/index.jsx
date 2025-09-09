import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSelector } from 'store';
import ApplyLeaveSimple from './ApplyLeaveSimple';
import MainCard from 'ui-component/cards/MainCard';
import KPICards from './KPICards';
import Factory from 'utils/Factory';

const LeaveManagement = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [applyLeaveDialogOpen, setApplyLeaveDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(''); // 'all', 'applied', 'pending', 'approved', 'rejected'
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Leave type mapping - you might want to fetch this from API or maintain as constants
  const leaveTypeMapping = {
    79: 'Annual Leave',
    81: 'Sick Leave',
    80: 'Casual Leave'
    // Add more mappings as needed
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get leave type name
  const getLeaveTypeName = (leaveTypeId) => {
    return leaveTypeMapping[leaveTypeId] || `Leave Type ${leaveTypeId}`;
  };

  // Helper function to format days with half-day info
  const formatDays = (days, isHalfDay, halfDaySession) => {
    if (isHalfDay && halfDaySession) {
      return `${days} day (${halfDaySession})`;
    }
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };
  const handleOpenApplyLeaveDialog = () => {
    setApplyLeaveDialogOpen(true);
  };

  const handleCloseApplyLeaveDialog = () => {
    setApplyLeaveDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'applied':
        return 'info';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getLeaveRequests = async (status) => {
    try {
      setLoading(true);
      let url = `/payroll/applied-leave-retrieval/?status=${status}`;
      const { res } = await Factory('get', url, {});
      if (res?.status_cd === 0) {
        console.log('Leave Requests API Response:', res?.data.results);
        setLeaveRequests(res?.data.results || []);
      } else {
        console.error('API Error:', res?.message);
        setLeaveRequests([]);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaveRequests(filterStatus);
  }, [filterStatus]);

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
      </Card>
    );
  }
  console.log(leaveRequests);
  return (
    <MainCard>
      <KPICards onApplyLeaveClick={handleOpenApplyLeaveDialog} />

      {/* Filters and Search */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Leave Requests Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          mt: 2,
          minHeight: 300,
          maxHeight: 600,
          overflow: 'auto'
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important',
                backgroundColor: 'primary.main',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }
            }}
          >
            <TableRow>
              <TableCell>
                <Typography fontWeight={600}>Leave Type</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Start Date</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>End Date</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Days</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Reason</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Applied Date</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading leave requests...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : leaveRequests.length > 0 ? (
              leaveRequests.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.leave_type}</TableCell>
                  <TableCell>{item.start_date}</TableCell>
                  <TableCell>{item.end_date}</TableCell>
                  <TableCell>{formatDays(item.requested_days, item.is_half_day, item.half_day_session)}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={item.reason}>
                      {item.reason}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(item.applied_on)}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No leave requests found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filterStatus ? 'Try changing the filter or apply for a new leave' : 'Apply for your first leave request'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Apply Leave Dialog */}
      <Dialog open={applyLeaveDialogOpen} onClose={handleCloseApplyLeaveDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            Apply Leave
          </Typography>
          <IconButton aria-label="close" onClick={handleCloseApplyLeaveDialog} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ApplyLeaveSimple onSuccess={handleCloseApplyLeaveDialog} />
        </DialogContent>
      </Dialog>
    </MainCard>
  );
};

export default LeaveManagement;
