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
  TextareaAutosize
} from '@mui/material';
import { IconClock, IconCalendar, IconCheck, IconX, IconAlertTriangle, IconMapPin, IconEdit } from '@tabler/icons-react';
import PunchInOutCard from './PunchInOutCard';

const AttendanceInfoTab = () => {
  // State for attendance data
  const [attendanceData, setAttendanceData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    checkIn: '',
    checkOut: '',
    remarks: ''
  });

  // Generate attendance data for the current month
  useEffect(() => {
    generateMonthlyAttendanceData();
  }, []);

  const generateMonthlyAttendanceData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthlyData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;

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
  const handleAttendanceUpdate = (type, time, location = null) => {
    const today = new Date();
    const todayFormatted = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    setAttendanceData((prevData) =>
      prevData.map((record) => {
        if (record.date === todayFormatted) {
          if (type === 'checkIn') {
            return {
              ...record,
              status: 'Present',
              checkIn: time,
              checkInLocation: location,
              duration: record.checkOut !== '-' ? calculateDuration(time, record.checkOut) : '-'
            };
          } else if (type === 'checkOut') {
            return {
              ...record,
              checkOut: time,
              checkOutLocation: location,
              duration: record.checkIn !== '-' ? calculateDuration(record.checkIn, time) : '-'
            };
          }
        }
        return record;
      })
    );
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
    setEditForm({
      status: record.status === '-' ? 'Present' : record.status,
      checkIn: record.checkIn === '-' ? '' : record.checkIn,
      checkOut: record.checkOut === '-' ? '' : record.checkOut,
      remarks: record.remarks === '-' ? '' : record.remarks
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    setAttendanceData((prevData) =>
      prevData.map((record) => {
        if (record.id === editingRecord.id) {
          const duration = editForm.checkIn && editForm.checkOut ? calculateDuration(editForm.checkIn, editForm.checkOut) : '-';

          return {
            ...record,
            status: editForm.status,
            checkIn: editForm.checkIn || '-',
            checkOut: editForm.checkOut || '-',
            duration: duration,
            remarks: editForm.remarks || '-'
          };
        }
        return record;
      })
    );

    setEditDialogOpen(false);
    setEditingRecord(null);
    setEditForm({ status: '', checkIn: '', checkOut: '', remarks: '' });
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingRecord(null);
    setEditForm({ status: '', checkIn: '', checkOut: '', remarks: '' });
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
    const presentRecords = attendanceData.filter((record) => record.status === 'Present' && record.duration !== '-');
    if (presentRecords.length === 0) return '0hr 0mins';

    const totalMinutes = presentRecords.reduce((sum, record) => {
      const [hours, minutes] = record.duration.split(':').map(Number);
      return sum + (hours * 60 + minutes);
    }, 0);

    const avgMinutes = totalMinutes / presentRecords.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    return `${hours}hr ${minutes}mins`;
  };

  const calculateAverageActualHours = () => {
    const presentRecords = attendanceData.filter((record) => record.status === 'Present' && record.duration !== '-');
    if (presentRecords.length === 0) return '0hrs 0m';

    const totalMinutes = presentRecords.reduce((sum, record) => {
      const [hours, minutes] = record.duration.split(':').map(Number);
      return sum + (hours * 60 + minutes);
    }, 0);

    const avgMinutes = totalMinutes / presentRecords.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    return `${hours}hrs ${minutes}m`;
  };

  const getPenaltyDays = () => {
    return attendanceData.filter((record) => record.status === 'Late' || record.status === 'Absent').length;
  };

  return (
    <Box>
      {/* Punch In/Out Card */}
      <Box sx={{ mb: 4 }}>
        <PunchInOutCard onAttendanceUpdate={handleAttendanceUpdate} />
      </Box>

      {/* Attendance Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Attendance
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          To update your attendance data, please click on the edit button next to each date.
        </Typography>
      </Box>

      {/* Attendance Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Check In</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Check Out</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Edit</TableCell>
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
        </CardContent>
      </Card>

      {/* Summary Boxes */}
      <Grid2 container spacing={3}>
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

      {/* Edit Attendance Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Attendance
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            for {editingRecord?.date}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} label="Status">
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Half Day">Half Day</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Check In"
              placeholder="hh:mm"
              value={editForm.checkIn}
              onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
              fullWidth
            />

            <TextField
              label="Check Out"
              placeholder="hh:mm"
              value={editForm.checkOut}
              onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
              fullWidth
            />

            <TextField
              label="Remarks"
              placeholder="(optional)"
              value={editForm.remarks}
              onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleEditCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceInfoTab;
