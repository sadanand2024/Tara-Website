import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Card,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';

const AttendanceCalendarView = ({ attendanceData, attendanceDataLoading, onDateSelect }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const SidebarCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }));

  // 👉 Select today's record when data loads
  useEffect(() => {
    if (attendanceData && attendanceData.length > 0) {
      const todayStr = new Date().toLocaleDateString('en-GB').split('/').join('/'); // dd/mm/yyyy
      const todayRecord = attendanceData.find((item) => item.date === todayStr);
      if (todayRecord) {
        setSelectedRecord(todayRecord);
      }
    }
  }, [attendanceData]);

  const handleDateClick = (clickInfo) => {
    const clickedDate = clickInfo.dateStr.split('-').reverse().join('/'); // yyyy-mm-dd → dd/mm/yyyy
    const record = attendanceData.find((item) => item.date === clickedDate);
    setSelectedRecord(record || null);

    if (onDateSelect) {
      onDateSelect(clickedDate);
    }
  };

  // Convert data to FullCalendar events
  const events = attendanceData.map((item) => {
    let bgColor, textColor;

    switch (item.status) {
      case 'Present':
        bgColor = '#d0f0c0';
        textColor = '#2e7d32';
        break;
      case 'Absent':
        bgColor = '#ffcdd2';
        textColor = '#c62828';
        break;
      case 'Late':
        bgColor = '#fff3e0';
        textColor = '#ef6c00';
        break;
      case 'Half Day':
        bgColor = '#bbdefb';
        textColor = '#1565c0';
        break;
      case 'Holiday':
        bgColor = '#e0e0e0';
        textColor = '#616161';
        break;
      default:
        bgColor = '#f5f5f5';
        textColor = '#333';
    }

    return {
      title: item.status,
      date: item.date.split('/').reverse().join('-'),
      backgroundColor: bgColor,
      borderColor: bgColor,
      textColor: textColor
    };
  });

  if (attendanceDataLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading attendance data...
        </Typography>
      </Box>
    );
  }

  return (
    <Grid2 container spacing={2}>
      {/* Calendar Section */}
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <div className="fc-medium">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="70vh"
              events={events}
              selectable={true}
              editable={false}
              dateClick={handleDateClick}
              headerToolbar={{
                // left: 'prev',
                center: 'title',
                // right: 'next',
                end: 'today'
              }}
            />
          </div>
        </Paper>
      </Grid2>

      {/* Sidebar Section */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <SidebarCard>
          {selectedRecord ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  {selectedRecord.date} ({selectedRecord.dayName})
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={selectedRecord.status}
                    color={
                      selectedRecord.status === 'Present'
                        ? 'success'
                        : selectedRecord.status === 'Late'
                          ? 'warning'
                          : selectedRecord.status === 'Absent'
                            ? 'error'
                            : selectedRecord.status === 'Half Day'
                              ? 'info'
                              : 'default'
                    }
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Status */}

              {/* Remarks */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Remarks
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {selectedRecord.remarks || '-'}
                </Typography>
              </Box>

              {/* Session History */}
              <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                Session History ({selectedRecord.sessionCount})
              </Typography>
              {selectedRecord.sessions && selectedRecord.sessions.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Check-in</b>
                        </TableCell>
                        <TableCell>
                          <b>Check-out</b>
                        </TableCell>
                        <TableCell>
                          <b>Location</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRecord.sessions.map((session, index) => (
                        <TableRow key={index}>
                          <TableCell>{session.check_in}</TableCell>
                          <TableCell>{session.check_out && session.check_out !== '-' ? session.check_out : '—'}</TableCell>
                          <TableCell>{session.location || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No sessions available
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Click a date to view details
            </Typography>
          )}
        </SidebarCard>
      </Grid2>
    </Grid2>
  );
};

export default AttendanceCalendarView;
