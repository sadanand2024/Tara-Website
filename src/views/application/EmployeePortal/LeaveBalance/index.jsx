import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid2, Button, Stack, Chip, Divider } from '@mui/material';
import { useSelector } from 'store';
import { IconCalendar, IconClock, IconUser, IconFileText, IconArrowRight } from '@tabler/icons-react';
import Factory from 'utils/Factory';

const LeaveBalance = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Icon mapping for leave types
  const getIconForLeaveType = (leaveTypeName) => {
    switch (leaveTypeName.toLowerCase()) {
      case 'earned leaves':
        return IconCalendar;
      case 'casual leaves':
        return IconUser;
      case 'sick leaves':
        return IconFileText;
      case 'loss of pay':
        return IconClock;
      default:
        return IconCalendar;
    }
  };

  // Color mapping for leave types
  const getColorForLeaveType = (leaveTypeName) => {
    switch (leaveTypeName.toLowerCase()) {
      case 'earned leaves':
        return 'secondary';
      case 'casual leaves':
        return 'info';
      case 'sick leaves':
        return 'warning';
      case 'loss of pay':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getColorByType = (color) => {
    switch (color) {
      case 'primary':
        return '#1976d2';
      case 'success':
        return '#2e7d32';
      case 'info':
        return '#0288d1';
      case 'warning':
        return '#ed6c02';
      case 'secondary':
        return '#9c27b0';
      case 'error':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  const handleViewDetails = (leaveType) => {
    console.log(`View details for ${leaveType}`);
    // Here you would typically navigate to a detailed view or open a modal
  };

  const getLeaveBalance = async () => {
    try {
      setLoading(true);
      let url = '/payroll/my-leave-balances/';
      const { res } = await Factory('get', url, {});

      // Transform API data to match component structure
      const transformedData = res.data.map((item) => ({
        id: item.id,
        title: item.leave_type_name,
        granted: item.leave_entitled,
        balance: item.leave_remaining,
        used: item.leave_used,
        icon: getIconForLeaveType(item.leave_type_name),
        color: getColorForLeaveType(item.leave_type_name),
        hasDetails: item.leave_entitled > 0 // Show details if there are leaves granted
      }));

      setLeaveBalances(transformedData);
    } catch (error) {
      console.error('Error fetching leave balances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaveBalance();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading leave balances...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Leave Balances
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your current leave balances and usage
        </Typography>
      </Box>

      {/* Leave Balance Cards */}
      <Grid2 container spacing={3}>
        {leaveBalances.map((leave) => {
          const IconComponent = leave.icon;
          const color = getColorByType(leave.color);

          return (
            <Grid2 key={leave.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: `${color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <IconComponent size={20} style={{ color: color }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {leave.title}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Balance Information */}
                  <Stack spacing={2}>
                    <Stack spacing={2} direction="row" justifyContent="space-between">
                      <Box>
                        <Typography variant="h5" color="text.secondary">
                          Granted
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: color }}>
                          {leave.granted}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Balance
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {leave.balance}
                        </Typography>
                      </Box>

                      {leave.used > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Used
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {leave.used}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    {/* Progress Bar for used leaves */}
                    {leave.granted > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Usage
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round((leave.used / leave.granted) * 100)}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 4,
                            bgcolor: 'grey.200',
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(leave.used / leave.granted) * 100}%`,
                              height: '100%',
                              bgcolor: color,
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Stack>

                  {/* View Details Button */}
                  {leave.hasDetails && (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleViewDetails(leave.id)}
                        sx={{
                          textDecoration: 'underline',
                          color: color,
                          '&:hover': {
                            textDecoration: 'underline',
                            bgcolor: `${color}10`
                          }
                        }}
                        endIcon={<IconArrowRight size={16} />}
                      >
                        view details
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>

      {/* Summary Section */}
      <Card sx={{ mt: 4, bgcolor: 'grey.50' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Summary
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {leaveBalances.reduce((sum, leave) => sum + leave.granted, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Days Granted
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {leaveBalances.reduce((sum, leave) => sum + leave.balance, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Days Available
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {leaveBalances.reduce((sum, leave) => sum + leave.used, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Days Used
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeaveBalance;
