import React, { useState, useEffect } from 'react';
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Stack,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  alpha,
  Autocomplete,
  TextField
} from '@mui/material';
import { useSelector } from 'store';
import {
  IconClock,
  IconCalendar,
  IconFileText,
  IconReceipt,
  IconChartPie,
  IconCalendarEvent,
  IconCurrencyDollar,
  IconFileDescription,
  IconDownload,
  IconEye,
  IconPlus,
  IconUserPlus,
  IconBookmark,
  IconWallet,
  IconSettings
} from '@tabler/icons-react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TaxTDSInfo from './components/TaxTDSInfo';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { generateFinancialYears } from 'utils/FinancialYearsList';
import CheckinCheckoutComponent from './AttendanceInfo/CheckinCheckoutComponent';
const EmployeePortalDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.accountReducer.user);
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  // Static check-in time to avoid re-renders
  const checkInTime = '09:00 AM';

  const getCurrentFinancialYear = () => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  };

  const years = generateFinancialYears(10);
  const [selectedYear, setSelectedYear] = useState(getCurrentFinancialYear());

  const handleYearChange = (event, newValue) => {
    setSelectedYear(newValue);
  };

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Card
        sx={{
          p: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" color="white" sx={{ fontWeight: 600, mb: 1 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          This portal is only accessible to employees.
        </Typography>
      </Card>
    );
  }

  // Get employee name from the actual user data
  const userName =
    user?.employee?.profile?.first_name && user?.employee?.profile?.last_name
      ? `${user.employee.profile.first_name} ${user.employee.profile.last_name}`.trim()
      : user?.employee?.profile?.first_name || 'Employee';

  // Static date to avoid re-renders
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <MainCard>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Welcome {userName}! 👋
        </Typography>
      </Box>

      <Grid2 container spacing={3}>
        {/* Main Content Area */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          {/* Large Placeholder */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 300,
              border: (theme) => `1.5px solid ${theme.palette.divider}`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
              transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: 'primary.main',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Dashboard Content Area
            </Typography>
          </Paper>

          {/* Bottom Three Cards */}
          <Grid2 container spacing={2}>
            {/* Leave Report Card */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: (theme) => `1.5px solid ${theme.palette.divider}`,
                  boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                  transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                  p: 2.5,
                  height: 200,
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
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  Leave Report
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Casual Leave:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      07
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Earned Leave:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      07
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Leave Without Pay:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      07
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Sick Leave:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      07
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid2>

            {/* People On Leave Card */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: (theme) => `1.5px solid ${theme.palette.divider}`,
                  boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                  transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                  p: 2.5,
                  height: 200,
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
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  People On Leave
                </Typography>
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#fff',
                          color: '#10b981',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {item}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        Anand
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid2>

            {/* Announcements Card */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: (theme) => `1.5px solid ${theme.palette.divider}`,
                  boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                  transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                  p: 2.5,
                  height: 200,
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
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  Announcements
                </Typography>
                <Stack spacing={1}>
                  {[1, 2, 3].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#9b59b6'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Meeting at 4:00 AM
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Right Sidebar */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Checked In Widget */}
            <CheckinCheckoutComponent />

            {/* Quick Access */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: (theme) => `1.5px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                p: 2.5,
                background: 'linear-gradient(135deg, #FFF4E6 0%, #fff 100%)',
                '&:hover': {
                  boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                  borderColor: 'warning.main',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Quick Access
              </Typography>
              <Stack spacing={1.5}>
                {[
                  {
                    title: 'Apply Leave',
                    icon: <IconUserPlus />,
                    color: '#667eea',
                    description: 'Submit new leave request'
                  },
                  {
                    title: 'Booked Leaves',
                    icon: <IconBookmark />,
                    color: '#10b981',
                    description: 'View your leave history'
                  },
                  {
                    title: 'Salary Details',
                    icon: <IconWallet />,
                    color: '#f39c12',
                    description: 'Check salary information'
                  },
                  {
                    title: 'Request Management',
                    icon: <IconSettings />,
                    color: '#9b59b6',
                    description: 'Manage your requests'
                  }
                ].map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: (theme) => `1.5px solid ${theme.palette.divider}`,
                      boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                      '&:hover': {
                        boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                        borderColor: item.color,
                        transform: 'translateY(-2px)',
                        background: 'linear-gradient(135deg, #fff 0%, #f0f8ff 100%)'
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
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          border: `1px solid ${item.color}20`
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
                            color: 'text.primary',
                            mb: 0.5
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <KeyboardArrowRightIcon style={{ color: item.color, fontSize: 28 }} />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid2>
      </Grid2>
    </MainCard>
  );
};

export default EmployeePortalDashboard;
