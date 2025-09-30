import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Switch,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { generateYears } from 'utils/YearsList';
import PunchInOutCard from './PunchInOutCard';
import MainCard from 'ui-component/cards/MainCard';
import AttendanceTableView from './AttendanceTableView';
import AttendanceCalendarView from './AttendanceCalendarView';
const monthOptions = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 }
];
const AttendanceInfoTab = () => {
  const dispatch = useDispatch();
  const yearOptions = generateYears();
  // State for attendance data
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceDataLoading, setAttendanceDataLoading] = useState(false);
  const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  // State for month and year selection
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State for view toggle
  const [isCalendarView, setIsCalendarView] = useState(false);
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  // Generate attendance data for the current month
  useEffect(() => {
    getAttendanceReport();
  }, [selectedMonth, selectedYear]);

  const getAttendanceReport = async () => {
    try {
      setAttendanceDataLoading(true);
      let url = `/payroll/monthly-report/?month=${selectedMonth}&year=${selectedYear}`;
      const { res } = await Factory('get', url, {});
      if (res.status_cd === 0 && res.data && res.data.report) {
        // Transform API response to match our attendance data structure
        const transformedData = transformMonthlyReportToAttendanceData(res.data.report);
        setAttendanceData(transformedData);
        setAttendanceDataLoading(false);
      } else {
        // If API fails, fall back to generated data
        generateFallbackData();
        setAttendanceDataLoading(false);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      // Fall back to generated data on error
      generateFallbackData();
      setAttendanceDataLoading(false);
    }
  };

  const transformMonthlyReportToAttendanceData = (reportData) => {
    return reportData.map((dayReport, index) => {
      const dateParts = dayReport.date.split('-');
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const year = parseInt(dateParts[2]);

      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

      let status = dayReport.status;
      let checkIn = '-';
      let checkOut = '-';
      let duration = '-';
      let checkInLocation = null;
      let checkOutLocation = null;

      // Process sessions if available
      if (dayReport.sessions && dayReport.sessions.length > 0) {
        const firstSession = dayReport.sessions[0];
        const lastSession = dayReport.sessions[dayReport.sessions.length - 1];

        if (firstSession.check_in && firstSession.check_in !== '-') {
          checkIn = firstSession.check_in.substring(0, 5); // Extract HH:MM from HH:MM:SS
        }

        if (lastSession.check_out && lastSession.check_out !== '-') {
          checkOut = lastSession.check_out.substring(0, 5); // Extract HH:MM from HH:MM:SS
        }

        // Calculate duration if both check-in and check-out exist
        if (checkIn !== '-' && checkOut !== '-') {
          duration = calculateDuration(checkIn, checkOut);
        } else if (dayReport.total_hours && dayReport.total_hours !== '0:00:00') {
          // Use total_hours from API if available
          const timeParts = dayReport.total_hours.split(':');
          if (timeParts.length >= 2) {
            duration = `${timeParts[0]}:${timeParts[1]}`;
          }
        }
      }

      return {
        id: index + 1,
        date: formattedDate,
        dayName: dayOfWeek,
        status: status,
        checkIn: checkIn,
        checkOut: checkOut,
        duration: duration,
        remarks: '-',
        checkInLocation: checkInLocation,
        checkOutLocation: checkOutLocation,
        sessions: dayReport.sessions || [],
        totalHours: dayReport.total_hours || '0:00:00',
        sessionCount: dayReport.session_count || 0
      };
    });
  };

  const generateFallbackData = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const monthlyData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = `${day.toString().padStart(2, '0')}/${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`;

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        monthlyData.push({
          id: day,
          date: formattedDate,
          dayName: dayOfWeek,
          status: '-',
          checkIn: '-',
          checkOut: '-',
          duration: '-',
          remarks: '-',
          checkInLocation: null,
          checkOutLocation: null,
          totalHours: '0:00:00',
          netHours: '-',
          grossHours: '-'
        });
      }
    }

    setAttendanceData(monthlyData);
  };

  // Handle punch in/out updates
  const handleAttendanceUpdate = async (type, time, location = null) => {
    try {
      // Refresh the attendance data to get the latest information
      await getAttendanceReport();

      // Show success message
      const message = type === 'checkIn' ? 'Successfully checked in!' : 'Successfully checked out!';
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(message),
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } catch (error) {
      console.error('Error updating attendance:', error);
      const message = type === 'checkIn' ? 'Failed to check in' : 'Failed to check out';
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(message),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const calculateDuration = (checkIn, checkOut) => {
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);

    let totalMinutes = outHour * 60 + outMin - (inHour * 60 + inMin);

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours if check-out is next day
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Edit functionality
  const handleEditClick = (record) => {
    setEditingRecord(record);
    setSelectedSessions(record.sessions || []);
    setSessionsDialogOpen(true);
  };

  const handleSessionsClose = () => {
    setSessionsDialogOpen(false);
    setEditingRecord(null);
    setSelectedSessions([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Late':
        return 'warning';
      case 'Absent':
        return 'error';
      case 'Half Day':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <PunchInOutCard onAttendanceUpdate={handleAttendanceUpdate} />
      </Box>
      {/* Attendance Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2
        }}
      >
        {/* Month and Year Selection */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: { xs: '100%', md: 'auto' },
            m: 2
          }}
        >
          <Autocomplete
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
            size="small"
            value={monthOptions.find((option) => option.value === selectedMonth)}
            onChange={(event, newValue) => setSelectedMonth(newValue.value)}
            options={monthOptions}
            renderInput={(params) => <TextField {...params} label="Month" />}
          />

          <Autocomplete
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
            size="small"
            value={selectedYear.toString()}
            onChange={(event, newValue) => setSelectedYear(parseInt(newValue))}
            options={yearOptions.map((year) => year.toString())}
            renderInput={(params) => <TextField {...params} label="Financial Year" />}
            disableClearable
          />
        </Box>

        {/* Calendar Mode Switch */}
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <FormGroup>
            <FormControlLabel control={<Switch onChange={(e) => setIsCalendarView(e.target.checked)} />} label="Calendar Mode" />
          </FormGroup>
        </Box>
      </Box>

      {/* Conditional Rendering: Table or Calendar View */}
      {isCalendarView ? (
        <AttendanceCalendarView
          attendanceData={attendanceData}
          attendanceDataLoading={attendanceDataLoading}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          calculateDuration={calculateDuration}
          onDateSelect={handleDateSelect}
        />
      ) : (
        /* Attendance Table */
        <AttendanceTableView
          attendanceData={attendanceData}
          handleEditClick={handleEditClick}
          attendanceDataLoading={attendanceDataLoading}
        />
      )}
      {/* Sessions Dialog */}
      <Dialog
        open={sessionsDialogOpen}
        onClose={handleSessionsClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)' // Soft shadow for depth
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Attendance Sessions
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            for {editingRecord?.date} ({editingRecord?.dayName})
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Summary Information */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'grey.50',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: getStatusColor(editingRecord?.status) === 'success' ? 'success.darker' : 'text.primary'
                  }}
                >
                  {editingRecord?.status || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Sessions
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {editingRecord?.sessionCount || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Hours
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {editingRecord?.totalHours || '0:00:00'}
                </Typography>
              </Box>
            </Box>

            {/* Sessions Table */}
            {selectedSessions.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Session</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Check In</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Check Out</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSessions.map((session, index) => {
                      const checkIn = session.check_in ? session.check_in.substring(0, 5) : '-';
                      const checkOut = session.check_out ? session.check_out.substring(0, 5) : '-';
                      const duration = checkIn !== '-' && checkOut !== '-' ? calculateDuration(checkIn, checkOut) : '-';

                      return (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: checkIn === '-' ? 'text.secondary' : 'text.primary',
                                transition: 'color 0.3s ease',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              {checkIn}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: checkOut === '-' ? 'text.secondary' : 'text.primary',
                                transition: 'color 0.3s ease',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              {checkOut}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: duration === '-' ? 'text.secondary' : 'text.primary',
                                transition: 'color 0.3s ease',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              {duration}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No sessions found for this date
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleSessionsClose}
            variant="outlined"
            color="secondary"
            sx={{
              fontWeight: 600,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttendanceInfoTab;
