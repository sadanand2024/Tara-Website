import React, { useState } from 'react';
import { Box, Grid2, Card, CardContent, Typography, Button, Chip, Divider, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import Calender from '../components/Calender';
import MainCard from 'ui-component/cards/MainCard';
import { IconUserPlus, IconBookmark, IconWallet, IconSettings } from '@tabler/icons-react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckinCheckoutComponent from './CheckinCheckoutComponent';

// Styled components
const StatsCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  height: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(1)
}));

const SidebarCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}));

const AttendanceInfo = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  // Mock attendance data for different dates
  const mockAttendanceData = {
    '2025-09-01': {
      firstIn: '09:15',
      lastOut: '18:30',
      lateIn: '15 min',
      earlyOut: '-',
      totalWorkHrs: '8.5',
      breakHrs: '1.0',
      status: 'Present',
      remarks: 'On time'
    },
    '2025-09-02': {
      firstIn: '09:45',
      lastOut: '19:00',
      lateIn: '45 min',
      earlyOut: '-',
      totalWorkHrs: '8.2',
      breakHrs: '1.0',
      status: 'Late',
      remarks: 'Traffic delay'
    },
    '2025-09-03': {
      firstIn: '10:00',
      lastOut: '17:45',
      lateIn: '1 hr',
      earlyOut: '1.25 hr',
      totalWorkHrs: '6.8',
      breakHrs: '1.0',
      status: 'Half Day',
      remarks: 'Medical appointment'
    },
    '2025-09-04': {
      firstIn: '-',
      lastOut: '-',
      lateIn: '-',
      earlyOut: '-',
      totalWorkHrs: '0',
      breakHrs: '0',
      status: 'Absent',
      remarks: 'Sick leave'
    },
    '2025-09-05': {
      firstIn: '09:00',
      lastOut: '18:15',
      lateIn: '-',
      earlyOut: '-',
      totalWorkHrs: '8.25',
      breakHrs: '1.0',
      status: 'Present',
      remarks: 'Good performance'
    }
  };

  // Get attendance data for selected date or show default
  const getAttendanceData = () => {
    if (!selectedDate) {
      return {
        firstIn: '-',
        lastOut: '-',
        lateIn: '-',
        earlyOut: '-',
        totalWorkHrs: '-',
        breakHrs: '-',
        status: 'No Date Selected',
        remarks: 'Please select a date'
      };
    }

    return (
      mockAttendanceData[selectedDate] || {
        firstIn: '-',
        lastOut: '-',
        lateIn: '-',
        earlyOut: '-',
        totalWorkHrs: '-',
        breakHrs: '-',
        status: 'No Data',
        remarks: 'No attendance data available'
      }
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Mock exception dates that need regularization
  const exceptionDates = ['2025-09-26', '2025-09-28', '2025-09-29', '2025-10-01', '2025-10-02'];

  const handleRegularizeClick = () => {
    // Navigate with exception dates to pre-populate
    navigate('/app/employee-portal/my-regularizations', {
      state: {
        exceptionDates: exceptionDates,
        mode: 'regularize'
      }
    });
  };

  const handleMyRegularizationsClick = () => {
    // Navigate without exception dates for manual mode
    navigate('/app/employee-portal/my-regularizations', {
      state: {
        mode: 'manual'
      }
    });
  };

  const attendanceData = getAttendanceData();
  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'No date selected';
  let kpiCardsData = [
    {
      title: 'AVG. WORK HRS',
      value: 12
    },

    {
      title: 'AVG. ACTUAL WORK HRS',
      value: 12
    },

    {
      title: 'PENALTY DAYS',
      value: 1
    }
  ];
  return (
    <Box>
      <Typography variant="h3" sx={{ m: 2 }}>
        Attendance Info
      </Typography>
      <HeaderSection>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InfoIcon color="warning" />
          <Typography variant="body2" color="text.secondary">
            10 exception day(s)
          </Typography>
          <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }} onClick={handleRegularizeClick}>
            Regularize
          </Button>
        </Box>
        <Button variant="contained" color="primary" sx={{ textTransform: 'none' }} onClick={handleMyRegularizationsClick}>
          My Regularizations
        </Button>
      </HeaderSection>

      <Grid2 container spacing={1}>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Grid2 container spacing={2} sx={{ mb: 3 }}>
            {kpiCardsData.map((item) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
                <StatsCard>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Calender onDateSelect={handleDateSelect} />
          </Paper>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          {/* Right Sidebar */}
          <Stack spacing={3}>
            {/* Checked In Widget */}
            <CheckinCheckoutComponent />
            {/* Quick Access */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1.5px solid #E5EAF2`,
                boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                p: 2.5,
                background: 'linear-gradient(135deg, #FFF4E6 0%, #fff 100%)',
                '&:hover': {
                  boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                  borderColor: '#f39c12',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0A1F44' }}>
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
                      border: `1.5px solid #E5EAF2`,
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
                            color: '#0A1F44',
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
          {/* <SidebarCard>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedDate ? new Date(selectedDate).getDate() : '-'}
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">General Shift(GEN)</Typography>
                <Typography variant="body2">General Scheme</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Shift: 10:00 to 19:00
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attendance Scheme
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedDateFormatted}
            </Typography>

            <Grid2 container spacing={1} sx={{ mb: 2 }}>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  First In
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {attendanceData.firstIn}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Last Out
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {attendanceData.lastOut}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Late In
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: attendanceData.lateIn !== '-' ? 'error.main' : 'inherit' }}>
                  {attendanceData.lateIn}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Early Out
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: attendanceData.earlyOut !== '-' ? 'error.main' : 'inherit' }}>
                  {attendanceData.earlyOut}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Work Hrs
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {attendanceData.totalWorkHrs}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Break Hrs
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {attendanceData.breakHrs}
                </Typography>
              </Grid2>
            </Grid2>
          </SidebarCard> */}

          {/* <SidebarCard>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Status Details
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={attendanceData.status}
                  color={
                    attendanceData.status === 'Present'
                      ? 'success'
                      : attendanceData.status === 'Late'
                        ? 'warning'
                        : attendanceData.status === 'Absent'
                          ? 'error'
                          : attendanceData.status === 'Half Day'
                            ? 'info'
                            : 'default'
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Remarks
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {attendanceData.remarks}
                </Typography>
              </Grid2>
            </Grid2>
          </SidebarCard> */}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AttendanceInfo;
