import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { IconClock, IconCheck, IconX, IconAlertTriangle, IconMapPin } from '@tabler/icons-react';

const AttendanceTableView = ({ attendanceData, handleEditClick, attendanceDataLoading }) => {
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

  if (attendanceDataLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // spinner + text vertically
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200 // adjust based on your layout
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
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: 2,
        minHeight: 300,
        maxHeight: 600,
        overflowY: 'auto'
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
        <TableHead
          sx={{
            backgroundColor: 'primary.main',
            '& .MuiTableCell-root': {
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem'
            }
          }}
        >
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>First Check In</TableCell>
            <TableCell>Last Check Out</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell align="center">Action</TableCell>
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
                  '&:hover': { bgcolor: 'grey.100' },
                  '& .MuiTableCell-root': {
                    py: 1.5,
                    fontSize: '0.85rem'
                  }
                }}
              >
                {/* Date */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {record.date}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {record.dayName}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {record.status === '-' ? (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StatusIcon size={16} style={{ color: '#666' }} />
                      <Chip
                        label={record.status}
                        color={getStatusColor(record.status)}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  )}
                </TableCell>

                {/* First Check In */}
                <TableCell>
                  {record.checkIn === '-' ? (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {record.checkInLocation && <IconMapPin size={14} style={{ color: '#1976d2' }} />}
                      <Typography variant="body2">{record.checkIn}</Typography>
                    </Box>
                  )}
                </TableCell>

                {/* Last Check Out */}
                <TableCell>
                  <Typography variant="body2" color={record.checkOut === '-' ? 'text.secondary' : 'text.primary'}>
                    {record.checkOut}
                  </Typography>
                </TableCell>

                {/* Duration */}
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: record.duration === '-' ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {record.duration}
                  </Typography>
                </TableCell>

                {/* Remarks */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {record.remarks || '-'}
                  </Typography>
                </TableCell>

                {/* Action */}
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEditClick(record)}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  >
                    View History
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTableView;
