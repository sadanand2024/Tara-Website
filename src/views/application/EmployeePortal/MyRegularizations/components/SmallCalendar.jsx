import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 300,
  margin: '0 auto'
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2)
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(0.5)
}));

const CalendarDay = styled(Button)(({ theme, isSelected, isToday, isOtherMonth, selectionMode = 'primary' }) => ({
  minWidth: 32,
  height: 32,
  padding: 0,
  fontSize: '0.75rem',
  borderRadius: '50%',
  color: isOtherMonth ? theme.palette.text.disabled : theme.palette.text.primary,
  backgroundColor: isSelected
    ? selectionMode === 'warning'
      ? theme.palette.warning.main
      : theme.palette.primary.main
    : isToday
      ? theme.palette.primary.light
      : 'transparent',
  '&:hover': {
    backgroundColor: isSelected
      ? selectionMode === 'warning'
        ? theme.palette.warning.dark
        : theme.palette.primary.dark
      : theme.palette.action.hover
  },
  ...(isSelected && {
    color: selectionMode === 'warning' ? theme.palette.warning.contrastText : theme.palette.primary.contrastText,
    fontWeight: 'bold'
  }),
  ...(isToday &&
    !isSelected && {
      border: `1px solid ${theme.palette.primary.main}`,
      fontWeight: 'bold'
    })
}));

const DayHeader = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: theme.spacing(0.5, 0),
  minWidth: 32
}));

const SmallCalendar = ({ onDateSelect, selectedDates = [], selectionMode = 'primary' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of the month and how many days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get days from previous month to fill the first week
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };

  const isDateSelected = (date) => {
    return selectedDates.some((selectedDate) => selectedDate.getTime() === date.getTime());
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Generate calendar days
  const calendarDays = [];

  // Previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i);
    calendarDays.push(
      <CalendarDay
        key={`prev-${daysInPrevMonth - i}`}
        isOtherMonth={true}
        selectionMode={selectionMode}
        onClick={() => handleDateClick(date)}
      >
        {daysInPrevMonth - i}
      </CalendarDay>
    );
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const selected = isDateSelected(date);
    const todayFlag = isToday(date);

    calendarDays.push(
      <CalendarDay key={day} isSelected={selected} isToday={todayFlag} selectionMode={selectionMode} onClick={() => handleDateClick(date)}>
        {day}
      </CalendarDay>
    );
  }

  // Next month days to fill the last week
  const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days = 42
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear, currentMonth + 1, day);
    calendarDays.push(
      <CalendarDay key={`next-${day}`} isOtherMonth={true} selectionMode={selectionMode} onClick={() => handleDateClick(date)}>
        {day}
      </CalendarDay>
    );
  }

  return (
    <CalendarContainer elevation={2}>
      {/* Calendar Header */}
      <CalendarHeader>
        <IconButton size="small" onClick={() => navigateMonth(-1)}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight="bold">
          {monthNames[currentMonth]} {currentYear}
        </Typography>
        <IconButton size="small" onClick={() => navigateMonth(1)}>
          <ChevronRightIcon />
        </IconButton>
      </CalendarHeader>

      {/* Day Headers */}
      <CalendarGrid>
        {dayNames.map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
      </CalendarGrid>

      {/* Calendar Days */}
      <CalendarGrid>{calendarDays}</CalendarGrid>
    </CalendarContainer>
  );
};

export default SmallCalendar;
