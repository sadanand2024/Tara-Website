import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { IconSearch, IconFilter } from '@tabler/icons-react';

const AttendanceMasterTab = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock attendance master data for multiple employees
  const attendanceMasterData = [
    {
      id: 1,
      employeeName: 'Harshit Patel',
      presentCount: 2,
      attendance: {
        '01': 'P',
        '02': 'H',
        '03': 'P',
        '04': '',
        '05': '',
        '06': '',
        '07': '',
        '08': '',
        '09': '',
        10: '',
        11: ''
      }
    },
    {
      id: 2,
      employeeName: 'Vijay',
      presentCount: 1,
      attendance: {
        '01': 'L',
        '02': 'L',
        '03': '',
        '04': '',
        '05': '',
        '06': '',
        '07': '',
        '08': '',
        '09': '',
        10: '',
        11: ''
      }
    },
    {
      id: 3,
      employeeName: 'P. Madhu',
      presentCount: 2,
      attendance: {
        '01': 'P',
        '02': 'H',
        '03': 'P',
        '04': '',
        '05': '',
        '06': '',
        '07': '',
        '08': '',
        '09': '',
        10: '',
        11: ''
      }
    },
    {
      id: 4,
      employeeName: 'S. Rani Reddy',
      presentCount: 2,
      attendance: {
        '01': 'P',
        '02': 'H',
        '03': 'P',
        '04': '',
        '05': '',
        '06': '',
        '07': '',
        '08': '',
        '09': '',
        10: '',
        11: ''
      }
    }
  ];

  const daysOfWeek = [
    { day: '01', name: 'Tue' },
    { day: '02', name: 'Wed' },
    { day: '03', name: 'Thu' },
    { day: '04', name: 'Fri' },
    { day: '05', name: 'Sat' },
    { day: '06', name: 'Sun' },
    { day: '07', name: 'Mon' },
    { day: '08', name: 'Tue' },
    { day: '09', name: 'Wed' },
    { day: '10', name: 'Thu' },
    { day: '11', name: 'Fri' }
  ];

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'P':
        return 'success';
      case 'L':
        return 'error';
      case 'H':
        return 'warning';
      case 'A':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredEmployees = attendanceMasterData.filter((employee) =>
    employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Enter Emp Name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size={20} />
              </InputAdornment>
            )
          }}
        />
        <IconButton sx={{ border: '1px solid #ddd', p: 1 }}>
          <IconFilter size={20} />
        </IconButton>
      </Box>

      {/* Summary Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
          Summary {'>'}
        </Typography>
      </Box>

      {/* Attendance Master Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textDecoration: 'underline' }}>
            Attendance
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', minWidth: 150 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'center' }}>P</TableCell>
                  {daysOfWeek.map((day) => (
                    <TableCell key={day.day} sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'center', minWidth: 60 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {day.day}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {day.name}
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {employee.employeeName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {employee.presentCount}
                      </Typography>
                    </TableCell>
                    {daysOfWeek.map((day) => (
                      <TableCell key={day.day} sx={{ textAlign: 'center' }}>
                        {employee.attendance[day.day] && (
                          <Chip
                            label={employee.attendance[day.day]}
                            color={getAttendanceStatusColor(employee.attendance[day.day])}
                            size="small"
                            sx={{ minWidth: 30, height: 24 }}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceMasterTab;
