import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete
} from '@mui/material';
import { IconClock, IconCalendar, IconCheck, IconX, IconAlertTriangle, IconMapPin, IconEdit } from '@tabler/icons-react';
import Factory from 'utils/Factory';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { generateYears } from 'utils/YearsList';
import PunchInOutCard from './PunchInOutCard';
import MainCard from 'ui-component/cards/MainCard';
import WebSocketStatus from './WebSocketStatus';
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
  const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [editForm, setEditForm] = useState({
    status: '',
    checkIn: '',
    checkOut: '',
    remarks: ''
  });

  // State for month and year selection
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate attendance data for the current month
  useEffect(() => {
    getAttendanceReport();
  }, [selectedMonth, selectedYear]);

  const getAttendanceReport = async () => {
    try {
      let url = `/payroll/monthly-report/?month=${selectedMonth}&year=${selectedYear}`;
      const { res } = await Factory('get', url, {});
      if (res.status_cd === 0 && res.data && res.data.report) {
        // Transform API response to match our attendance data structure
        const transformedData = transformMonthlyReportToAttendanceData(res.data.report);
        setAttendanceData(transformedData);
      } else {
        // If API fails, fall back to generated data
        generateFallbackData();
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      // Fall back to generated data on error
      generateFallbackData();
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
          checkOutLocation: null
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return IconCheck;
      case 'Late':
        return IconAlertTriangle;
      case 'Absent':
        return IconX;
      case 'Half Day':
        return IconClock;
      default:
        return IconClock;
    }
  };

  const calculateAverageWorkHours = () => {
    const presentRecords = attendanceData.filter(
      (record) => record.status === 'Present' && record.totalHours && record.totalHours !== '0:00:00'
    );
    if (presentRecords.length === 0) return '0hr 0mins';

    const totalMinutes = presentRecords.reduce((sum, record) => {
      // Parse total_hours from API (format: "1:26:27" or "5 days, 0:53:14")
      const timeStr = record.totalHours;
      if (timeStr.includes('days')) {
        // Handle format like "5 days, 0:53:14"
        const parts = timeStr.split(', ');
        const days = parseInt(parts[0].split(' ')[0]) || 0;
        const timeParts = parts[1] ? parts[1].split(':') : ['0', '0', '0'];
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        return days * 24 * 60 + hours * 60 + minutes;
      } else {
        // Handle format like "1:26:27"
        const timeParts = timeStr.split(':');
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        return hours * 60 + minutes;
      }
    }, 0);

    const avgMinutes = totalMinutes / presentRecords.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    return `${hours}hr ${minutes}mins`;
  };

  const calculateAverageActualHours = () => {
    const presentRecords = attendanceData.filter(
      (record) => record.status === 'Present' && record.totalHours && record.totalHours !== '0:00:00'
    );
    if (presentRecords.length === 0) return '0hrs 0m';

    const totalMinutes = presentRecords.reduce((sum, record) => {
      // Parse total_hours from API (format: "1:26:27" or "5 days, 0:53:14")
      const timeStr = record.totalHours;
      if (timeStr.includes('days')) {
        // Handle format like "5 days, 0:53:14"
        const parts = timeStr.split(', ');
        const days = parseInt(parts[0].split(' ')[0]) || 0;
        const timeParts = parts[1] ? parts[1].split(':') : ['0', '0', '0'];
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        return days * 24 * 60 + hours * 60 + minutes;
      } else {
        // Handle format like "1:26:27"
        const timeParts = timeStr.split(':');
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        return hours * 60 + minutes;
      }
    }, 0);

    const avgMinutes = totalMinutes / presentRecords.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    return `${hours}hrs ${minutes}m`;
  };

  const getPenaltyDays = () => {
    return attendanceData.filter((record) => record.status === 'Late' || record.status === 'Absent').length;
  };

  const getTotalPresentDays = () => {
    return attendanceData.filter((record) => record.status === 'Present').length;
  };

  return (
    <MainCard>
      {/* <WebSocketStatus /> */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your current attendance and usage
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <PunchInOutCard onAttendanceUpdate={handleAttendanceUpdate} />
      </Box>
      {/* Attendance Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Attendance
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            To update your attendance data, please click on the edit button next to each date.
          </Typography>
        </Box>

        {/* Month and Year Selection */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Autocomplete
            sx={{ minWidth: 200 }}
            size="small"
            value={monthOptions.find((option) => option.value === selectedMonth)}
            onChange={(event, newValue) => setSelectedMonth(newValue.value)}
            options={monthOptions}
            renderInput={(params) => <TextField {...params} label="Month" />}
          />

          <Autocomplete
            sx={{ minWidth: 200 }}
            size="small"
            value={selectedYear.toString()}
            onChange={(event, newValue) => setSelectedYear(parseInt(newValue))}
            options={yearOptions.map((year) => year.toString())}
            renderInput={(params) => <TextField {...params} label="Financial Year" />}
            disableClearable
          />
        </Box>
      </Box>
      {/* Attendance Table */}
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: 1,
          overflowX: 'auto'
        }}
      >
        <Table size="small">
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important'
              }
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((record) => {
              const StatusIcon = getStatusIcon(record.status);
              const isToday = record.date === new Date().toLocaleDateString('en-GB').split('/').reverse().join('/');

              return (
                <TableRow
                  key={record.id}
                  hover
                  sx={{
                    bgcolor: isToday ? 'primary.50' : 'inherit',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {record.date}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {record.dayName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {record.status === '-' ? (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        -
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StatusIcon size={16} style={{ color: '#666' }} />
                        <Chip label={record.status} color={getStatusColor(record.status)} size="small" variant="outlined" />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkIn === '-' ? (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        -
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {record.checkInLocation && <IconMapPin size={14} style={{ color: '#1976d2' }} />}
                        <Typography variant="body2">{record.checkIn}</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: record.checkOut === '-' ? 'text.secondary' : 'text.primary' }}>
                      {record.checkOut}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: record.duration === '-' ? 'text.secondary' : 'text.primary' }}
                    >
                      {record.duration}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {record.remarks}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(record)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'primary.50' }
                      }}
                    >
                      <IconEdit size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Summary Boxes */}
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ bgcolor: 'primary.50', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <IconClock size={32} style={{ color: '#1976d2', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                {calculateAverageWorkHours()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Avg work hrs
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ bgcolor: 'success.50', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <IconCalendar size={32} style={{ color: '#2e7d32', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                {calculateAverageActualHours()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Avg Actual Hrs
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ bgcolor: 'warning.50', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <IconAlertTriangle size={32} style={{ color: '#ed6c02', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                {getPenaltyDays()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Penalty Days
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
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
    </MainCard>
  );
};

export default AttendanceInfoTab;
