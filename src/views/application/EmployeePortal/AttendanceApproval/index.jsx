import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
  Divider,
  Tooltip,
  Autocomplete
} from '@mui/material';
import {
  IconClock,
  IconCheck,
  IconX,
  IconEye,
  IconCalendar,
  IconUser,
  IconAlertCircle,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus
} from '@tabler/icons-react';
import { useSelector } from 'store';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const AttendanceApproval = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRequestType, setFilterRequestType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  // Mock data for attendance records requiring approval (Enhanced based on Zoho People)
  const mockAttendanceData = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      date: '2024-01-15',
      checkIn: '09:15 AM',
      checkOut: '06:30 PM',
      grossHours: 9.25,
      netHours: 8.25,
      breakTime: 1.0,
      overtime: 0.25,
      status: 'pending',
      reason: 'Late arrival due to traffic',
      manager: 'Sarah Wilson',
      department: 'Engineering',
      workingDays: 22,
      presentDays: 20,
      attendancePercentage: 90.9,
      requestType: 'regularization', // New field based on Zoho
      breakDetails: [{ startTime: '12:00 PM', endTime: '01:00 PM', duration: 60, type: 'lunch' }],
      location: 'Office',
      deviceInfo: 'Mobile App',
      ipAddress: '192.168.1.100',
      submittedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      date: '2024-01-15',
      checkIn: '08:45 AM',
      checkOut: '07:15 PM',
      grossHours: 10.5,
      netHours: 9.5,
      breakTime: 1.0,
      overtime: 1.5,
      status: 'pending',
      reason: 'Overtime for project deadline',
      manager: 'Mike Johnson',
      department: 'Marketing',
      workingDays: 22,
      presentDays: 21,
      attendancePercentage: 95.5,
      requestType: 'overtime',
      breakDetails: [{ startTime: '12:00 PM', endTime: '01:00 PM', duration: 60, type: 'lunch' }],
      location: 'Office',
      deviceInfo: 'Web Portal',
      ipAddress: '192.168.1.101',
      submittedAt: '2024-01-15T19:30:00Z'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Bob Wilson',
      date: '2024-01-14',
      checkIn: '09:30 AM',
      checkOut: '05:45 PM',
      grossHours: 8.25,
      netHours: 7.25,
      breakTime: 1.0,
      overtime: 0,
      status: 'pending',
      reason: 'Early departure for personal work',
      manager: 'Lisa Brown',
      department: 'HR',
      workingDays: 22,
      presentDays: 19,
      attendancePercentage: 86.4,
      requestType: 'permission',
      breakDetails: [{ startTime: '12:00 PM', endTime: '01:00 PM', duration: 60, type: 'lunch' }],
      location: 'Office',
      deviceInfo: 'Biometric',
      ipAddress: '192.168.1.102',
      submittedAt: '2024-01-14T17:50:00Z'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'Alice Johnson',
      date: '2024-01-13',
      checkIn: '08:00 AM',
      checkOut: '06:00 PM',
      grossHours: 10.0,
      netHours: 9.0,
      breakTime: 1.0,
      overtime: 1.0,
      status: 'approved',
      reason: 'Regular overtime',
      manager: 'Tom Davis',
      department: 'Finance',
      workingDays: 22,
      presentDays: 22,
      attendancePercentage: 100,
      requestType: 'overtime',
      breakDetails: [{ startTime: '12:00 PM', endTime: '01:00 PM', duration: 60, type: 'lunch' }],
      location: 'Office',
      deviceInfo: 'Web Portal',
      ipAddress: '192.168.1.103',
      submittedAt: '2024-01-13T18:15:00Z',
      approvedBy: 'Tom Davis',
      approvedAt: '2024-01-13T18:30:00Z'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      employeeName: 'Charlie Brown',
      date: '2024-01-12',
      checkIn: '10:00 AM',
      checkOut: '06:00 PM',
      grossHours: 8.0,
      netHours: 7.0,
      breakTime: 1.0,
      overtime: 0,
      status: 'rejected',
      reason: 'Late arrival without prior notice',
      manager: 'Emma Wilson',
      department: 'Operations',
      workingDays: 22,
      presentDays: 18,
      attendancePercentage: 81.8,
      requestType: 'regularization',
      breakDetails: [{ startTime: '12:00 PM', endTime: '01:00 PM', duration: 60, type: 'lunch' }],
      location: 'Office',
      deviceInfo: 'Mobile App',
      ipAddress: '192.168.1.104',
      submittedAt: '2024-01-12T10:15:00Z',
      rejectedBy: 'Emma Wilson',
      rejectedAt: '2024-01-12T10:30:00Z',
      rejectionReason: 'No prior notification provided'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      employeeName: 'David Lee',
      date: '2024-01-16',
      checkIn: '09:00 AM',
      checkOut: '05:00 PM',
      grossHours: 8.0,
      netHours: 8.0,
      breakTime: 0,
      overtime: 0,
      status: 'pending',
      reason: 'Working from client site',
      manager: 'Sarah Wilson',
      department: 'Engineering',
      workingDays: 22,
      presentDays: 21,
      attendancePercentage: 95.5,
      requestType: 'on_duty',
      breakDetails: [],
      location: 'Client Site - ABC Corp',
      deviceInfo: 'Mobile App',
      ipAddress: '203.0.113.1',
      submittedAt: '2024-01-16T09:15:00Z'
    }
  ];

  // KPI Data
  const kpiData = {
    totalPending: mockAttendanceData.filter((record) => record.status === 'pending').length,
    totalApproved: mockAttendanceData.filter((record) => record.status === 'approved').length,
    totalRejected: mockAttendanceData.filter((record) => record.status === 'rejected').length,
    averageAttendance: 90.2,
    totalOvertimeHours: 12.5,
    averageWorkingHours: 8.3
  };

  useEffect(() => {
    setAttendanceRecords(mockAttendanceData);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <IconCheck size={16} />;
      case 'pending':
        return <IconClock size={16} />;
      case 'rejected':
        return <IconX size={16} />;
      default:
        return <IconMinus size={16} />;
    }
  };

  const getRequestTypeColor = (requestType) => {
    switch (requestType) {
      case 'regularization':
        return 'primary';
      case 'overtime':
        return 'warning';
      case 'permission':
        return 'info';
      case 'on_duty':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRequestTypeLabel = (requestType) => {
    switch (requestType) {
      case 'regularization':
        return 'Regularization';
      case 'overtime':
        return 'Overtime';
      case 'permission':
        return 'Permission';
      case 'on_duty':
        return 'On Duty';
      default:
        return 'Unknown';
    }
  };

  const handleApprove = (record) => {
    setSelectedRecord(record);
    setApprovalDialogOpen(true);
  };

  const handleReject = (record) => {
    setSelectedRecord(record);
    setApprovalDialogOpen(true);
  };

  const handleApprovalAction = (action) => {
    if (selectedRecord) {
      const updatedRecords = attendanceRecords.map((record) => (record.id === selectedRecord.id ? { ...record, status: action } : record));
      setAttendanceRecords(updatedRecords);

      dispatch(
        openSnackbar({
          open: true,
          message: `Attendance ${action} successfully`,
          variant: 'alert',
          alert: { color: action === 'approved' ? 'success' : 'error' },
          close: false
        })
      );
    }
    setApprovalDialogOpen(false);
    setSelectedRecord(null);
  };

  const formatTime = (time) => {
    return time || '-';
  };

  const formatHours = (hours) => {
    return hours ? `${hours}h` : '-';
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const statusMatch = !filterStatus || record.status === filterStatus;
    const typeMatch = !filterRequestType || record.requestType === filterRequestType;
    const deptMatch = !filterDepartment || record.department === filterDepartment;
    return statusMatch && typeMatch && deptMatch;
  });

  const handleBulkApprove = () => {
    const updatedRecords = attendanceRecords.map((record) =>
      selectedRecords.includes(record.id) ? { ...record, status: 'approved' } : record
    );
    setAttendanceRecords(updatedRecords);
    setSelectedRecords([]);

    dispatch(
      openSnackbar({
        open: true,
        message: `${selectedRecords.length} attendance records approved successfully`,
        variant: 'alert',
        alert: { color: 'success' },
        close: false
      })
    );
  };

  const handleBulkReject = () => {
    const updatedRecords = attendanceRecords.map((record) =>
      selectedRecords.includes(record.id) ? { ...record, status: 'rejected' } : record
    );
    setAttendanceRecords(updatedRecords);
    setSelectedRecords([]);

    dispatch(
      openSnackbar({
        open: true,
        message: `${selectedRecords.length} attendance records rejected`,
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      })
    );
  };

  const handleSelectRecord = (recordId) => {
    setSelectedRecords((prev) => (prev.includes(recordId) ? prev.filter((id) => id !== recordId) : [...prev, recordId]));
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map((record) => record.id));
    }
  };

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

  return (
    <MainCard title="Attendance Approval" subtitle="Review and approve employee attendance records">
      {/* KPI Cards */}
      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFF3E0 0%, #fff 100%)',
              border: '1px solid #FFB74D'
            }}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#FF9800', mx: 'auto', mb: 1 }}>
                <IconClock size={24} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#E65100' }}>
                {kpiData.totalPending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approval
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #E8F5E8 0%, #fff 100%)',
              border: '1px solid #4CAF50'
            }}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#4CAF50', mx: 'auto', mb: 1 }}>
                <IconCheck size={24} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                {kpiData.totalApproved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFEBEE 0%, #fff 100%)',
              border: '1px solid #F44336'
            }}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#F44336', mx: 'auto', mb: 1 }}>
                <IconX size={24} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#C62828' }}>
                {kpiData.totalRejected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #E3F2FD 0%, #fff 100%)',
              border: '1px solid #2196F3'
            }}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#2196F3', mx: 'auto', mb: 1 }}>
                <IconTrendingUp size={24} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1565C0' }}>
                {kpiData.averageAttendance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Attendance
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #F3E5F5 0%, #fff 100%)',
              border: '1px solid #9C27B0'
            }}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#9C27B0', mx: 'auto', mb: 1 }}>
                <IconClock size={24} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#6A1B9A' }}>
                {kpiData.totalOvertimeHours}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Overtime
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Enhanced Filters based on Zoho People */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Autocomplete
          options={['', 'pending', 'approved', 'rejected']}
          value={filterStatus}
          onChange={(e, val) => setFilterStatus(val || '')}
          getOptionLabel={(option) => (option === '' ? 'All Status' : option)}
          renderInput={(params) => <TextField {...params} label="Status" size="small" />}
          sx={{ width: 150 }}
        />
        <Autocomplete
          options={['', 'regularization', 'overtime', 'permission', 'on_duty']}
          value={filterRequestType}
          onChange={(e, val) => setFilterRequestType(val || '')}
          getOptionLabel={(option) => (option === '' ? 'All Types' : getRequestTypeLabel(option))}
          renderInput={(params) => <TextField {...params} label="Request Type" size="small" />}
          sx={{ width: 150 }}
        />
        <Autocomplete
          options={['', 'Engineering', 'Marketing', 'HR', 'Finance', 'Operations']}
          value={filterDepartment}
          onChange={(e, val) => setFilterDepartment(val || '')}
          getOptionLabel={(option) => (option === '' ? 'All Departments' : option)}
          renderInput={(params) => <TextField {...params} label="Department" size="small" />}
          sx={{ width: 150 }}
        />
      </Box>

      {/* Bulk Actions */}
      {selectedRecords.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {selectedRecords.length} record(s) selected
          </Typography>
          <Button variant="contained" color="success" size="small" onClick={handleBulkApprove} startIcon={<IconCheck size={16} />}>
            Bulk Approve
          </Button>
          <Button variant="outlined" color="error" size="small" onClick={handleBulkReject} startIcon={<IconX size={16} />}>
            Bulk Reject
          </Button>
          <Button variant="text" size="small" onClick={() => setSelectedRecords([])}>
            Clear Selection
          </Button>
        </Box>
      )}

      {/* Attendance Records Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main', width: 50 }}>
                <input
                  type="checkbox"
                  checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                  onChange={handleSelectAll}
                  style={{ transform: 'scale(1.2)' }}
                />
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Employee</Typography>
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Request Type</Typography>
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Date</Typography>
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Check In/Out</Typography>
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Gross/Net Hours</Typography>
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Location</Typography>
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Status</Typography>
              </TableCell>
              <TableCell sx={{ color: '#ffffff !important', backgroundColor: 'primary.main' }}>
                <Typography fontWeight={600}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <IconUser size={16} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {record.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.employeeId} • {record.department}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{new Date(record.date).toLocaleDateString('en-IN')}</Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {formatTime(record.checkIn)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(record.checkOut)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {formatHours(record.grossHours)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Net: {formatHours(record.netHours)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={formatHours(record.overtime)}
                    size="small"
                    color={record.overtime > 0 ? 'warning' : 'default'}
                    variant={record.overtime > 0 ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap title={record.reason}>
                    {record.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(record.status)}
                    label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {record.status === 'pending' && (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Approve">
                        <IconButton size="small" color="success" onClick={() => handleApprove(record)}>
                          <IconCheck size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" color="error" onClick={() => handleReject(record)}>
                          <IconX size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                  {record.status !== 'pending' && (
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <IconEye size={16} />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedRecord?.status === 'pending' ? 'Approve/Reject Attendance' : 'Attendance Details'}</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ pt: 1 }}>
              <Grid2 container spacing={2}>
                <Grid2 size={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedRecord.employeeName} ({selectedRecord.employeeId})
                  </Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">{new Date(selectedRecord.date).toLocaleDateString('en-IN')}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1">{selectedRecord.department}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Check In
                  </Typography>
                  <Typography variant="body1">{selectedRecord.checkIn}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Check Out
                  </Typography>
                  <Typography variant="body1">{selectedRecord.checkOut}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gross Hours
                  </Typography>
                  <Typography variant="body1">{selectedRecord.grossHours}h</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Net Hours
                  </Typography>
                  <Typography variant="body1">{selectedRecord.netHours}h</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Overtime
                  </Typography>
                  <Typography variant="body1">{selectedRecord.overtime}h</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="body2" color="text.secondary">
                    Break Time
                  </Typography>
                  <Typography variant="body1">{selectedRecord.breakTime}h</Typography>
                </Grid2>
                <Grid2 size={12}>
                  <Typography variant="body2" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography variant="body1">{selectedRecord.reason}</Typography>
                </Grid2>
              </Grid2>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
          {selectedRecord?.status === 'pending' && (
            <>
              <Button color="error" variant="outlined" onClick={() => handleApprovalAction('rejected')}>
                Reject
              </Button>
              <Button color="success" variant="contained" onClick={() => handleApprovalAction('approved')}>
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default AttendanceApproval;
