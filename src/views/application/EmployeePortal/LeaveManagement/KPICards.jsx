import React, { useEffect, useState } from 'react';
import { Grid2, Stack, Typography, Box, Paper, Avatar, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  EventNote as ApplyLeaveIcon,
  Policy as PolicyIcon,
  CheckCircle as ApprovalIcon,
  AccountBalance as EncashIcon,
  CalendarToday as TotalLeavesIcon,
  RemoveCircle as UsedLeavesIcon,
  AddCircle as RemainingLeavesIcon,
  HourglassEmpty as PendingIcon,
  Today as ThisMonthIcon,
  Group as TeamIcon
} from '@mui/icons-material';
import Factory from 'utils/Factory';

const KPICards = ({ onApplyLeaveClick }) => {
  const navigate = useNavigate();
  const [leaveSummaryData, setLeaveSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Template data structure with styling
  const getLeaveDataTemplate = (apiData) => [
    {
      title: 'Total Leaves',
      value: apiData?.total_leaves?.toString() || '0',
      subtitle: 'Annual allocation',
      icon: <TotalLeavesIcon />,
      gradient: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
      iconColor: '#667eea',
      borderColor: '#667eea'
    },
    {
      title: 'Used Leaves',
      value: apiData?.used_leaves?.toString() || '0',
      subtitle: 'This year',
      icon: <UsedLeavesIcon />,
      gradient: 'linear-gradient(135deg, #FFE8E8 0%, #fff 100%)',
      iconColor: '#ff6b6b',
      borderColor: '#ff6b6b'
    },
    {
      title: 'Remaining Leaves',
      value: apiData?.remaining_leaves?.toString() || '0',
      subtitle: 'Available',
      icon: <RemainingLeavesIcon />,
      gradient: 'linear-gradient(135deg, #E6FAF0 0%, #fff 100%)',
      iconColor: '#10b981',
      borderColor: '#10b981'
    },
    {
      title: 'Pending Approvals',
      value: apiData?.pending_approvals?.toString() || '0',
      subtitle: 'Awaiting approval',
      icon: <PendingIcon />,
      gradient: 'linear-gradient(135deg, #FFF4E6 0%, #fff 100%)',
      iconColor: '#f39c12',
      borderColor: '#f39c12'
    },
    {
      title: 'This Month',
      value: apiData?.this_month?.toString() || '0',
      subtitle: 'Leaves taken',
      icon: <ThisMonthIcon />,
      gradient: 'linear-gradient(135deg, #F0E6FF 0%, #fff 100%)',
      iconColor: '#9b59b6',
      borderColor: '#9b59b6'
    },
    {
      title: 'Team on Leave',
      value: apiData?.team_on_leave?.toString() || '0',
      subtitle: 'Currently away',
      icon: <TeamIcon />,
      gradient: 'linear-gradient(135deg, #E8F5FF 0%, #fff 100%)',
      iconColor: '#3498db',
      borderColor: '#3498db'
    }
  ];

  const quickActions = [
    {
      title: 'Apply Leave',
      subtitle: 'Submit new leave request',
      icon: <ApplyLeaveIcon />,
      action: onApplyLeaveClick
    },
    {
      title: 'Leave Policy',
      subtitle: 'View company policy',
      icon: <PolicyIcon />,
      action: () => navigate('/app/employee-portal/leave-management/policy')
    },
    {
      title: 'Attendance Approval',
      subtitle: 'Approve team attendance',
      icon: <ApprovalIcon />,
      action: () => navigate('/app/employee-portal/attendance-approval')
    },
    {
      title: 'Encash Leave',
      subtitle: 'Convert leaves to cash',
      icon: <EncashIcon />,
      action: () => console.log('Encash Leave clicked')
    }
  ];
  const getLeaveSummaryData = async () => {
    setLoading(true);
    let url = `/payroll/leave-dashboard-summary/`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      const formattedData = getLeaveDataTemplate(res?.data);
      setLeaveSummaryData(formattedData);
      setLoading(false);
    } else {
      console.error('API Error:', res?.message);
      // Set default data in case of error
      setLeaveSummaryData(getLeaveDataTemplate({}));
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaveSummaryData();
  }, []);
  return (
    <Box sx={{ mb: 3 }}>
      <Grid2 container spacing={3}>
        {/* Leaves Summary Section */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Leaves Summary
          </Typography>
          {loading ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} align="center">
                Loading leave summary...
              </Typography>
            </Box>
          ) : (
            <Grid2 container spacing={2}>
              {leaveSummaryData.map((item, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      minHeight: { xs: 140, sm: 160 },
                      height: '100%',
                      width: '100%',
                      border: `1.5px solid #E5EAF2`,
                      boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                      transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                      p: { xs: 2, sm: 2.5 },
                      display: 'flex',
                      flexDirection: 'column',
                      background: item.gradient,
                      '&:hover': {
                        boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                        borderColor: item.borderColor,
                        background: item.gradient,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {/* Header Section: Icon and Title */}
                    <Box display="flex" alignItems="center" gap={1.5} sx={{ minHeight: 40 }}>
                      <Avatar
                        variant="circular"
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          style: { color: item.iconColor, fontSize: 20 }
                        })}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          color: '#0A1F44',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          lineHeight: 1.2,
                          flex: 1
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>

                    {/* Content Section: Subtitle and Value */}
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        mt: 1
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '1rem', sm: '1rem' },
                          mb: { xs: 1, sm: 1.5 },
                          lineHeight: 1.3
                        }}
                      >
                        {item.subtitle}
                      </Typography>

                      <Typography
                        variant="h1"
                        sx={{
                          color: '#0A1F44',
                          lineHeight: 1,
                          mb: 0
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid2>
              ))}
            </Grid2>
          )}
        </Grid2>

        {/* Quick Actions Section */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Stack spacing={1.5}>
              {quickActions.map((action, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  onClick={action.action}
                  sx={{
                    p: 1.8,
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      borderColor: '#1976d2',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      variant="circular"
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {React.cloneElement(action.icon, {
                        style: { color: action.iconColor, fontSize: 30 }
                      })}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: '#333',
                          fontSize: '0.875rem',
                          mb: 0.25
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#666',
                          fontSize: '0.75rem',
                          lineHeight: 1.2
                        }}
                      >
                        {action.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default KPICards;
