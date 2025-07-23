import React from 'react';
import { Grid2, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Avatar, Stack, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { useSelector } from 'store';

const EmployeePortalDashboard = () => {
  const user = useSelector((state) => state.accountReducer.user);

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

  // Use real employee data from user object
  const userName = user?.employee?.full_name || 'Employee';
  const associateId = user?.employee?.associate_id || '';
  const attendanceStatus = 'Present';
  const lastSalaryCredit = '2024-05-31';
  const leaveBalance = '12 days';
  const announcements = ['Company picnic on June 15th!', 'Submit Q2 goals by June 10th.', 'New health insurance plan available.'];

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ width: 56, height: 56 }} src="/src/assets/images/users/avatar-1.png" alt={userName} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Welcome, {userName}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {associateId && `ID: ${associateId}`} • Here is your dashboard overview.
          </Typography>
        </Box>
      </Stack>
      <Grid2 container spacing={3}>
        {/* Attendance Status - Calendar View */}
        <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📅 Today's Attendance Status
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  defaultValue={dayjs()}
                  views={['day']}
                  sx={{
                    width: '100%',
                    bgcolor: '#fff',
                    borderRadius: 3,
                    boxShadow: 'none',
                    border: 'none',
                    p: 0,
                    m: 0,
                    minWidth: 0,
                    maxWidth: 'none',
                    '& .MuiPickersCalendarHeader-root': {
                      bgcolor: 'primary.main',
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                      color: '#fff',
                      minHeight: 48,
                      mb: 0,
                      px: 2,
                      py: 1,
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18,
                        letterSpacing: 0.5
                      },
                      '& .MuiPickersArrowSwitcher-root button': {
                        color: '#fff'
                      }
                    },
                    '& .MuiPickersSlideTransition-root': {
                      minHeight: 220
                    },
                    '& .MuiPickersDay-root': {
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: 16,
                      borderRadius: 2,
                      transition: 'none',
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    },
                    '& .Mui-selected': {
                      bgcolor: 'primary.main !important',
                      color: '#fff !important',
                      fontWeight: 700
                    },
                    '& .MuiPickersDay-today': {
                      border: 'none',
                      color: 'primary.main',
                      fontWeight: 700,
                      bgcolor: 'transparent'
                    },
                    '& .MuiPickersCalendarHeader-labelContainer': {
                      justifyContent: 'center'
                    },
                    '& .MuiPickersDay-root.Mui-disabled': {
                      color: 'grey.300'
                    },
                    '& .MuiDayCalendar-weekDayLabel': {
                      color: 'text.primary',
                      fontWeight: 700,
                      fontSize: 15
                    }
                  }}
                />
              </LocalizationProvider>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Punch In
              </Button>
            </CardContent>
          </Card>
        </Grid2>
        {/* Last Salary Credit */}
        <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💰 Last Salary Credit
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {lastSalaryCredit}
            </Typography>
            <Button variant="contained" color="info">
              View Payslip
            </Button>
          </CardContent>
        </Grid2>
        {/* Leave Balance */}
        <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
          <Typography variant="h6" gutterBottom>
            🌴 Leave Balance
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {leaveBalance}
          </Typography>
          <Button variant="contained" color="secondary">
            Apply Leave
          </Button>
        </Grid2>
        {/* Company Announcements */}
        <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
          <Typography variant="h6" gutterBottom>
            🆕 Company Announcements
          </Typography>
          <List dense sx={{ mb: 2 }}>
            {announcements.map((announcement, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={announcement} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="success">
            See All Announcements
          </Button>
        </Grid2>
      </Grid2>
    </Card>
  );
};

export default EmployeePortalDashboard;
