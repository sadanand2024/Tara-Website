import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
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
  CircularProgress,
  Grid2,
  Stack,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { Close as CloseIcon, History as HistoryIcon, CalendarToday as CalendarIcon, TrendingUp as TrendingIcon } from '@mui/icons-material';
import { useSelector } from 'store';
import ApplyLeaveSimple from './ApplyLeaveSimple';
import MainCard from 'ui-component/cards/MainCard';
import Factory from 'utils/Factory';

const LeaveManagement = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [applyLeaveDialogOpen, setApplyLeaveDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(''); // 'all', 'applied', 'pending', 'approved', 'rejected'
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for My Requests, 1 for Team Requests
  const [leaveSummary, setLeaveSummary] = useState({});
  const [teamSummary, setTeamSummary] = useState({});
  const [holidays, setHolidays] = useState([]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        setLeaveRequests(res?.data.results || []);
      } else {
        setLeaveRequests([]);
      }
    } catch (error) {
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getLeaveSummary = async () => {
    try {
      let url = `/payroll/leave-dashboard-summary/`;
      const { res } = await Factory('get', url, {});
      if (res?.status_cd === 0) {
        setLeaveSummary(res?.data || {});
      }
    } catch (error) {
      console.error('Error fetching leave summary:', error);
    }
  };

  const getTeamSummary = async () => {
    try {
      let url = `/payroll/team-leave-summary/`;
      const { res } = await Factory('get', url, {});
      if (res?.status_cd === 0) {
        setTeamSummary(res?.data || {});
      }
    } catch (error) {
      console.error('Error fetching team summary:', error);
    }
  };

  const getHolidays = async () => {
    try {
      let url = `/payroll/holidays/`;
      const { res } = await Factory('get', url, {});
      if (res?.status_cd === 0) {
        setHolidays(res?.data || []);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  useEffect(() => {
    getLeaveRequests(filterStatus);
    getLeaveSummary();
    getTeamSummary();
    getHolidays();
  }, [filterStatus]);

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
    <MainCard>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1F44' }}>
          Leave Management
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenApplyLeaveDialog}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Apply Leave
        </Button>
      </Box>

      <Grid2 container spacing={3}>
        {/* Left Content Area */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          {/* My Leave Summary Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0A1F44' }}>
              My Leave Summary
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1.5px solid #E5EAF2`,
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                      borderColor: '#667eea',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0A1F44', mb: 1 }}>
                    Casual Leave
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Available: {leaveSummary.casual_available || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booked: {leaveSummary.casual_used || 0}
                  </Typography>
                </Paper>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1.5px solid #E5EAF2`,
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #FFE8E8 0%, #fff 100%)',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                      borderColor: '#ff6b6b',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0A1F44', mb: 1 }}>
                    Sick Leave
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Available: {leaveSummary.sick_available || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booked: {leaveSummary.sick_used || 0}
                  </Typography>
                </Paper>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1.5px solid #E5EAF2`,
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #E6FAF0 0%, #fff 100%)',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                      borderColor: '#10b981',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0A1F44', mb: 1 }}>
                    Pay Leave
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Available: {leaveSummary.pay_available || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booked: {leaveSummary.pay_used || 0}
                  </Typography>
                </Paper>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1.5px solid #E5EAF2`,
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #F0E6FF 0%, #fff 100%)',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                      borderColor: '#9b59b6',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0A1F44', mb: 1 }}>
                    Other Leave
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Available: {leaveSummary.other_available || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booked: {leaveSummary.other_used || 0}
                  </Typography>
                </Paper>
              </Grid2>
            </Grid2>
          </Box>

          {/* My Team Summary Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0A1F44' }}>
              My Team Summary
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1.5px solid #E5EAF2`,
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #FFF4E6 0%, #fff 100%)',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                      borderColor: '#f39c12',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0A1F44', mb: 1 }}>
                    Leave Requests
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1F44' }}>
                    {teamSummary.pending_requests || 0}
                  </Typography>
                </Paper>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1.5px solid #E5EAF2`,
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #E8F5FF 0%, #fff 100%)',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                      borderColor: '#3498db',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0A1F44', mb: 1 }}>
                    On Leave
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1F44' }}>
                    {teamSummary.on_leave || 0}
                  </Typography>
                </Paper>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1.5px solid #E5EAF2`,
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                      borderColor: '#667eea',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0A1F44', mb: 1 }}>
                    Reportees
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1F44' }}>
                    {teamSummary.total_reportees || 0}
                  </Typography>
                </Paper>
              </Grid2>
            </Grid2>
          </Box>

          {/* My Requests / Team Requests Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="My Requests" />
                <Tab label="Team Requests" />
              </Tabs>
            </Box>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1.5px solid #E5EAF2`,
                boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                minHeight: 300,
                overflow: 'hidden'
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    Loading requests...
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
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
                          <Typography fontWeight={600}>Status</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.length > 0 ? (
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
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                              No requests found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        </Grid2>

        {/* Right Sidebar */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} mt={4}>
            {/* Holiday Section */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1.5px solid #E5EAF2`,
                boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                p: 2.5,
                background: 'linear-gradient(135deg, #424242 0%, #616161 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
                Holiday
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Loading requests...
                </Typography>{' '}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Loading requests...
                </Typography>{' '}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Loading requests...
                </Typography>{' '}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Loading requests...
                </Typography>{' '}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  Loading requests...
                </Typography>
              </Stack>
            </Paper>

            {/* Past Leaves Section */}
            <Box>
              <Typography variant="h4" sx={{ mb: 2, color: '#0A1F44' }}>
                Past Leaves
              </Typography>
              <Stack spacing={1.5}>
                {[
                  {
                    title: 'This Month',
                    count: 3,
                    icon: <CalendarIcon />,
                    color: '#667eea',
                    gradient: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
                    borderColor: '#667eea'
                  },
                  {
                    title: 'Last 3 Months',
                    count: 8,
                    icon: <HistoryIcon />,
                    color: '#10b981',
                    gradient: 'linear-gradient(135deg, #E6FAF0 0%, #fff 100%)',
                    borderColor: '#10b981'
                  },
                  {
                    title: 'This Year',
                    count: 15,
                    icon: <TrendingIcon />,
                    color: '#f39c12',
                    gradient: 'linear-gradient(135deg, #FFF4E6 0%, #fff 100%)',
                    borderColor: '#f39c12'
                  }
                ].map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: `1.5px solid #E5EAF2`,
                      boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                      p: 2.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      background: item.gradient,
                      '&:hover': {
                        boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                        borderColor: item.borderColor,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          backgroundColor: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          style: { color: item.color, fontSize: 20 }
                        })}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: '#0A1F44',
                            mb: 0.5
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {item.count} leaves taken
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <Typography color="white" variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                          {item.count}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid2>
      </Grid2>

      {/* Apply Leave Dialog */}
      <ApplyLeaveSimple open={applyLeaveDialogOpen} onSuccess={handleCloseApplyLeaveDialog} />
    </MainCard>
  );
};

export default LeaveManagement;
