import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid2, IconButton, Paper, Chip, Stack, Divider } from '@mui/material';
import { useSelector } from 'store';
import { IconChevronLeft, IconChevronRight, IconCalendar, IconUsers, IconFlag, IconHome } from '@tabler/icons-react';
import dayjs from 'dayjs';

const LeaveCalendar = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [currentDate, setCurrentDate] = useState(dayjs('2025-07-01'));

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

  // Mock leave data for July 2025
  const leaveData = {
    '2025-07-04': { type: 'team-leave', count: 2, names: ['John Doe', 'Jane Smith'] },
    '2025-07-05': { type: 'team-leave', count: 1, names: ['Mike Johnson'] },
    '2025-07-15': { type: 'restricted-holiday', name: 'Guru Purnima' },
    '2025-07-26': { type: 'general-holiday', name: 'Independence Day' },
    '2025-07-12': { type: 'personal-leave', name: 'Personal Leave' },
    '2025-07-18': { type: 'sick-leave', name: 'Sick Leave' }
  };

  const getLeaveInfo = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return leaveData[dateStr] || null;
  };

  const getLeaveColor = (type) => {
    switch (type) {
      case 'team-leave':
        return '#1976d2';
      case 'restricted-holiday':
        return '#ed6c02';
      case 'general-holiday':
        return '#d32f2f';
      case 'personal-leave':
        return '#2e7d32';
      case 'sick-leave':
        return '#9c27b0';
      default:
        return '#666';
    }
  };

  const getLeaveIcon = (type) => {
    switch (type) {
      case 'team-leave':
        return IconUsers;
      case 'restricted-holiday':
        return IconFlag;
      case 'general-holiday':
        return IconHome;
      case 'personal-leave':
        return IconCalendar;
      case 'sick-leave':
        return IconCalendar;
      default:
        return IconCalendar;
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const getCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const days = [];
    let currentDay = startDate;

    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, 'day')) {
      days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    return days;
  };

  const isToday = (date) => {
    return dayjs().isSame(date, 'day');
  };

  const isCurrentMonth = (date) => {
    return currentDate.isSame(date, 'month');
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Leave Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          (Same for Team on leave)
        </Typography>
      </Box>

      {/* Calendar Navigation */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <IconButton onClick={handlePreviousMonth} size="large">
              <IconChevronLeft />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {currentDate.format('MMMM YYYY')}
            </Typography>
            <IconButton onClick={handleNextMonth} size="large">
              <IconChevronRight />
            </IconButton>
          </Box>

          {/* Calendar Grid */}
          <Paper sx={{ overflow: 'hidden' }}>
            {/* Week Days Header */}
            <Grid2 container>
              {weekDays.map((day) => (
                <Grid2 key={day} size={1.714} sx={{ bgcolor: 'grey.100' }}>
                  <Box sx={{ p: 2, textAlign: 'center', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {day}
                    </Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>

            {/* Calendar Days */}
            <Grid2 container>
              {calendarDays.map((date, index) => {
                const leaveInfo = getLeaveInfo(date);
                const IconComponent = leaveInfo ? getLeaveIcon(leaveInfo.type) : null;
                const leaveColor = leaveInfo ? getLeaveColor(leaveInfo.type) : null;

                return (
                  <Grid2
                    key={index}
                    size={1.714}
                    sx={{
                      minHeight: 80,
                      borderRight: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                      bgcolor: isToday(date) ? 'primary.50' : 'white',
                      '&:nth-child(7n)': {
                        borderRight: 'none'
                      }
                    }}
                  >
                    <Box sx={{ p: 0.5, height: '100%', position: 'relative' }}>
                      {/* Date Number */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isToday(date) ? 700 : 500,
                          color: isCurrentMonth(date) ? 'text.primary' : 'text.disabled',
                          mb: 0.5
                        }}
                      >
                        {date.format('D')}
                      </Typography>

                      {/* Leave Information */}
                      {leaveInfo && (
                        <Box sx={{ mt: 0.5 }}>
                          {leaveInfo.type === 'team-leave' ? (
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                                <IconComponent size={12} style={{ color: leaveColor, marginRight: 2 }} />
                                <Typography variant="caption" sx={{ color: leaveColor, fontWeight: 600, fontSize: '0.7rem' }}>
                                  {leaveInfo.count} on leave
                                </Typography>
                              </Box>
                              {leaveInfo.names.map((name, idx) => (
                                <Typography key={idx} variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  {name}
                                </Typography>
                              ))}
                            </Box>
                          ) : (
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                                <IconComponent size={12} style={{ color: leaveColor, marginRight: 2 }} />
                                <Typography variant="caption" sx={{ color: leaveColor, fontWeight: 600, fontSize: '0.7rem' }}>
                                  {leaveInfo.name}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Today Indicator */}
                      {isToday(date) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main'
                          }}
                        />
                      )}
                    </Box>
                  </Grid2>
                );
              })}
            </Grid2>
          </Paper>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Legend
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#1976d2',
                    mr: 1
                  }}
                />
                <Typography variant="body2">Team on leave</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 600 }}>
                  3
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#ed6c02',
                    mr: 1
                  }}
                />
                <Typography variant="body2">Restricted Holiday</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 600 }}>
                  1
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#d32f2f',
                    mr: 1
                  }}
                />
                <Typography variant="body2">General Holiday</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 600 }}>
                  1
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#2e7d32',
                    mr: 1
                  }}
                />
                <Typography variant="body2">Personal Leave</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 600 }}>
                  1
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeaveCalendar;
