import React from 'react';
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
  Chip
} from '@mui/material';
import { IconClock, IconCalendar, IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';

const AttendanceInfoTab = () => {
  // Mock attendance data for individual employee
  const attendanceData = [
    {
      id: 1,
      date: 'Mon July 10th',
      inTime: '9:30 AM',
      outTime: '6:00 PM',
      hours: '8.50hrs',
      status: 'Present'
    },
    {
      id: 2,
      date: 'Tue July 11th',
      inTime: '9:15 AM',
      outTime: '6:30 PM',
      hours: '9.25hrs',
      status: 'Present'
    },
    {
      id: 3,
      date: 'Wed July 12th',
      inTime: '9:45 AM',
      outTime: '5:45 PM',
      hours: '8.00hrs',
      status: 'Present'
    },
    {
      id: 4,
      date: 'Thu July 13th',
      inTime: '10:00 AM',
      outTime: '6:15 PM',
      hours: '8.25hrs',
      status: 'Late'
    },
    {
      id: 5,
      date: 'Fri July 14th',
      inTime: '9:20 AM',
      outTime: '6:45 PM',
      hours: '9.42hrs',
      status: 'Present'
    }
  ];

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
    const totalHours = attendanceData.reduce((sum, record) => {
      const hours = parseFloat(record.hours.replace('hrs', ''));
      return sum + hours;
    }, 0);
    const avgHours = totalHours / attendanceData.length;
    const hours = Math.floor(avgHours);
    const minutes = Math.round((avgHours - hours) * 60);
    return `${hours}hr ${minutes}mins`;
  };

  const calculateAverageActualHours = () => {
    const totalHours = attendanceData.reduce((sum, record) => {
      const hours = parseFloat(record.hours.replace('hrs', ''));
      return sum + hours;
    }, 0);
    const avgHours = totalHours / attendanceData.length;
    const hours = Math.floor(avgHours);
    const minutes = Math.round((avgHours - hours) * 60);
    return `${hours}hrs ${minutes}m`;
  };

  const getPenaltyDays = () => {
    return attendanceData.filter((record) => record.status === 'Late' || record.status === 'Absent').length;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, textDecoration: 'underline' }}>
          Attendance info
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
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>In time</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>out time</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Hours</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record) => {
                  const StatusIcon = getStatusIcon(record.status);

                  return (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {record.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{record.inTime}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{record.outTime}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {record.hours}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StatusIcon size={16} style={{ color: '#666' }} />
                          <Chip label={record.status} color={getStatusColor(record.status)} size="small" variant="outlined" />
                        </Box>
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

      {/* Additional Statistics */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Monthly Summary
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {attendanceData.filter((r) => r.status === 'Present').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present Days
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {attendanceData.filter((r) => r.status === 'Late').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Late Days
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {attendanceData.filter((r) => r.status === 'Absent').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent Days
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {attendanceData.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Days
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceInfoTab;
