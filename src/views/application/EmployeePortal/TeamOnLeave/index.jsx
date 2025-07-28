import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  IconButton,
  Paper,
  Chip,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { useSelector } from 'store';
import { IconChevronLeft, IconChevronRight, IconCalendar, IconUsers, IconFlag, IconHome, IconUser } from '@tabler/icons-react';
import dayjs from 'dayjs';

const TeamOnLeave = () => {
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

  // Mock team leave data for July 2025
  const teamLeaveData = {
    '2025-07-04': [
      {
        id: 1,
        name: 'John Doe',
        avatar: '/src/assets/images/users/avatar-1.png',
        leaveType: 'Casual Leave',
        department: 'Engineering'
      },
      {
        id: 2,
        name: 'Jane Smith',
        avatar: '/src/assets/images/users/avatar-2.png',
        leaveType: 'Sick Leave',
        department: 'Marketing'
      }
    ],
    '2025-07-05': [
      {
        id: 3,
        name: 'Mike Johnson',
        avatar: '/src/assets/images/users/avatar-3.png',
        leaveType: 'Annual Leave',
        department: 'Sales'
      }
    ],
    '2025-07-12': [
      {
        id: 4,
        name: 'Sarah Wilson',
        avatar: '/src/assets/images/users/avatar-4.png',
        leaveType: 'Personal Leave',
        department: 'HR'
      }
    ],
    '2025-07-18': [
      {
        id: 5,
        name: 'David Brown',
        avatar: '/src/assets/images/users/avatar-5.png',
        leaveType: 'Sick Leave',
        department: 'Engineering'
      }
    ],
    '2025-07-25': [
      {
        id: 6,
        name: 'Emily Davis',
        avatar: '/src/assets/images/users/avatar-6.png',
        leaveType: 'Casual Leave',
        department: 'Design'
      },
      {
        id: 7,
        name: 'Tom Wilson',
        avatar: '/src/assets/images/users/avatar-7.png',
        leaveType: 'Annual Leave',
        department: 'Finance'
      }
    ]
  };

  const getTeamLeaveInfo = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return teamLeaveData[dateStr] || [];
  };

  const getLeaveColor = (leaveType) => {
    switch (leaveType) {
      case 'Casual Leave':
        return '#1976d2';
      case 'Sick Leave':
        return '#d32f2f';
      case 'Annual Leave':
        return '#2e7d32';
      case 'Personal Leave':
        return '#ed6c02';
      default:
        return '#666';
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

  // Get total team members on leave this month
  const getTotalTeamOnLeave = () => {
    return Object.values(teamLeaveData).flat().length;
  };

  // Get unique team members
  const getUniqueTeamMembers = () => {
    const allMembers = Object.values(teamLeaveData).flat();
    const uniqueMembers = [];
    const seenIds = new Set();

    allMembers.forEach((member) => {
      if (!seenIds.has(member.id)) {
        seenIds.add(member.id);
        uniqueMembers.push(member);
      }
    });

    return uniqueMembers;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Team on Leave
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calendar view of team members who are on leave
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'primary.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconUsers size={32} style={{ color: '#1976d2', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {getTotalTeamOnLeave()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Leave Days
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'success.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconUser size={32} style={{ color: '#2e7d32', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {getUniqueTeamMembers().length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team Members on Leave
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'warning.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconCalendar size={32} style={{ color: '#ed6c02', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {Object.keys(teamLeaveData).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days with Leave
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'info.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconUsers size={32} style={{ color: '#0288d1', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                15
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Team Size
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

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
                const teamLeaves = getTeamLeaveInfo(date);
                const hasLeaves = teamLeaves.length > 0;

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

                      {/* Team Leave Information */}
                      {hasLeaves && (
                        <Box sx={{ mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                            <IconUsers size={12} style={{ color: '#1976d2', marginRight: 2 }} />
                            <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.7rem' }}>
                              {teamLeaves.length} on leave
                            </Typography>
                          </Box>
                          {teamLeaves.slice(0, 2).map((member, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                              <Avatar src={member.avatar} sx={{ width: 14, height: 14, mr: 0.5 }} />
                              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                                {member.name}
                              </Typography>
                            </Box>
                          ))}
                          {teamLeaves.length > 2 && (
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                              +{teamLeaves.length - 2} more
                            </Typography>
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

      {/* Team Members List */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Team Members on Leave This Month
          </Typography>
          <List>
            {getUniqueTeamMembers().map((member) => (
              <ListItem key={member.id} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar src={member.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {member.department}
                      </Typography>
                      <Chip
                        label={member.leaveType}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: `${getLeaveColor(member.leaveType)}20`,
                          color: getLeaveColor(member.leaveType),
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamOnLeave;
