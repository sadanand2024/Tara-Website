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
  Paper
} from '@mui/material';
import { useSelector } from 'store';
import {
  IconSearch,
  IconHelp,
  IconBell,
  IconArrowRight,
  IconClock,
  IconCalendar,
  IconFileText,
  IconReceipt,
  IconChartPie,
  IconUser,
  IconHome,
  IconCalendarEvent,
  IconCurrencyDollar,
  IconFileDescription
} from '@tabler/icons-react';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EmployeePortalDashboard = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Mock data - in real app, this would come from API
  const userName = user?.employee?.full_name || 'Srinivas';
  const currentDate = currentTime.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTimeString = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Earnings breakdown data
  const earningsData = [
    { name: 'Basic', value: 40000, color: '#8884d8' },
    { name: 'Allowances', value: 15000, color: '#82ca9d' },
    { name: 'Other Benefits', value: 5000, color: '#ffc658' }
  ];

  const upcomingHolidays = [
    { date: '30th July, 2025', type: 'Independence Day' },
    { date: '25th August, 2025', type: 'Raksha Bandhan' },
    { date: '31st August, 2025', type: 'Ganesh Chaturthi' }
  ];

  const quickAccessItems = ['Payslip', 'IT Statement', 'Loan Statement', 'YTD Reports', 'Form 16'];

  const earningsBreakdown = ['Basic', 'Allowances', 'Gross pay', 'Deductions', 'Other Benefits', 'My monthly CTC'];

  return (
    <Box sx={{ p: 1 }}>
      {/* Welcome Message */}
      <Card sx={{ mb: 3, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
          Hello, {userName}!
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1rem', mt: 1, fontWeight: 400 }}>
          Your gateway to attendance, leaves, updates, and more - because every moment at work matters. Let's make today count!
        </Typography>
      </Card>

      <Grid2 container spacing={3}>
        {/* My To-Dos */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  My To-Dos
                </Typography>
                <IconArrowRight />
              </Box>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="• update kyc info" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                  <IconArrowRight size={16} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid2>

        {/* Current Shift/Time Card */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card
            sx={{ height: '100%', background: 'linear-gradient(135deg,rgb(107, 126, 211) 0%,rgb(219, 138, 149) 100%)', color: 'white' }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Current Shift/Time Card
              </Typography>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                {currentDate}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {currentDay} | Morning shift
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, fontFamily: 'monospace' }}>
                {currentTimeString} HRS
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Sign in
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* Track */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Track
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      5
                    </Typography>
                    <Typography variant="body2">Claims</Typography>
                  </Paper>
                </Grid2>
                <Grid2 size={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      3
                    </Typography>
                    <Typography variant="body2">Leaves</Typography>
                  </Paper>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        {/* Upcoming Holidays */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Upcoming Holidays
                </Typography>
                <IconArrowRight />
              </Box>
              <List dense>
                {upcomingHolidays.map((holiday, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText primary={`${holiday.date} - ${holiday.type}`} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>

        {/* Quick Access */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Quick Access
                </Typography>
                <IconArrowRight />
              </Box>
              <List dense>
                {quickAccessItems.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText primary={item} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>

        {/* My Earnings Breakdown */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  My Earnings Breakdown
                </Typography>
                <IconArrowRight />
              </Box>
              <Grid2 container spacing={2}>
                <Grid2 size={8}>
                  <List dense>
                    {earningsBreakdown.map((item, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText primary={item} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                      </ListItem>
                    ))}
                  </List>
                </Grid2>
                <Grid2 size={4}>
                  <Box sx={{ width: '100%', height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ₹60,000
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total CTC
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        {/* IT Declarations & POI */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                IT Declarations & POI
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Declarations window is open till 31st Aug 2025. Please submit your IT declarations and proof of investments.
              </Typography>
              <Button variant="contained" color="warning">
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* My Attendance History */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  My Attendance History
                </Typography>
                <IconArrowRight />
              </Box>
              <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Click to view detailed history
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Leave Management */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Leave Management
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Leave Balance" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                  <IconArrowRight size={16} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Apply for leave" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                  <IconArrowRight size={16} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Leave requests" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                  <IconArrowRight size={16} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default EmployeePortalDashboard;
