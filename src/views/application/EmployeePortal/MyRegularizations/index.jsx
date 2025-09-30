import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid2,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Tab,
  Tabs,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
// Removed DatePicker imports to use simple date input
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SmallCalendar from './components/SmallCalendar';

// Styled components
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`regularization-tabpanel-${index}`}
    aria-labelledby={`regularization-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
}));

const CompactCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
}));

const MyRegularizations = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isRegularizeMode, setIsRegularizeMode] = useState(false);
  const [exceptionCards, setExceptionCards] = useState([]);
  const [formData, setFormData] = useState({
    employee: 'VINEET PUN... #NL-153',
    shift: 'General Shift',
    fromTime: '10:00',
    toTime: '19:00',
    reason: ''
  });

  // Initialize based on navigation state
  useEffect(() => {
    if (location.state?.mode === 'regularize' && location.state?.exceptionDates) {
      setIsRegularizeMode(true);
      const dates = location.state.exceptionDates.map((dateStr) => new Date(dateStr));
      setSelectedDates(dates);

      // Create exception cards with mock data
      const cards = location.state.exceptionDates.map((dateStr, index) => ({
        id: index,
        date: new Date(dateStr),
        shift: 'General Shift',
        fromTime: '10:00',
        toTime: '19:00',
        reason: 'Exception day - requires regularization'
      }));
      setExceptionCards(cards);
    } else {
      setIsRegularizeMode(false);
      setSelectedDates([]);
      setExceptionCards([]);
    }
  }, [location.state]);

  // Mock data for pending and history
  const pendingRegularizations = [
    {
      id: 1,
      date: '2025-09-26',
      shift: 'General Shift',
      fromTime: '10:00',
      toTime: '19:00',
      reason: 'Medical appointment',
      status: 'Pending',
      submittedOn: '2025-09-25'
    },
    {
      id: 2,
      date: '2025-09-28',
      shift: 'General Shift',
      fromTime: '10:00',
      toTime: '19:00',
      reason: 'Traffic delay',
      status: 'Pending',
      submittedOn: '2025-09-27'
    }
  ];

  const historyRegularizations = [
    {
      id: 1,
      date: '2025-09-20',
      shift: 'General Shift',
      fromTime: '10:00',
      toTime: '19:00',
      reason: 'Personal work',
      status: 'Approved',
      submittedOn: '2025-09-19',
      approvedBy: 'Manager'
    },
    {
      id: 2,
      date: '2025-09-15',
      shift: 'General Shift',
      fromTime: '10:00',
      toTime: '19:00',
      reason: 'Late arrival',
      status: 'Rejected',
      submittedOn: '2025-09-14',
      rejectedBy: 'HR'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateAdd = (date) => {
    if (date) {
      if (!selectedDates.find((d) => d.getTime() === date.getTime())) {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  const handleDateRemove = (dateToRemove) => {
    setSelectedDates(selectedDates.filter((date) => date.getTime() !== dateToRemove.getTime()));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting regularization:', {
      dates: selectedDates,
      ...formData
    });
    // Handle form submission
  };

  const handleCancel = () => {
    setSelectedDates([]);
    setFormData({
      employee: 'Anand',
      shift: 'General Shift',
      fromTime: '10:00',
      toTime: '19:00',
      reason: ''
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Regularizations
      </Typography>

      {/* Tabs */}
      <>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="regularization tabs" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Apply" />
          <Tab label="Pending" />
          <Tab label="History" />
        </Tabs>

        {/* Apply Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid2 container spacing={3}>
            {/* Left Side - Calendar/Exception Info */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <StyledCard>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  {isRegularizeMode ? (
                    /* Regularize Mode - Show Exception Calendar */
                    <>
                      {/* Small Calendar with Exception Dates Pre-selected */}
                      <Box sx={{ mb: 2 }}>
                        <SmallCalendar onDateSelect={handleDateAdd} selectedDates={selectedDates} selectionMode="warning" />
                      </Box>
                      {/* Exception Days Info */}
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'warning.light',
                          borderRadius: 1,
                          color: 'warning.dark',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" align="center">
                          ⚠️ {selectedDates.length} exception days found
                        </Typography>
                        {/* <Button variant="text" size="small" color="primary" sx={{ textTransform: 'none' }}>
                          Quick Add
                        </Button> */}
                      </Box>
                      {/* Exception Dates List */}
                    </>
                  ) : (
                    /* Manual Mode - Show Date Selection */
                    <>
                      <Typography variant="h6" sx={{ mb: 1.5 }}>
                        Select Dates
                      </Typography>

                      {/* Small Calendar */}
                      <Box sx={{ mb: 2 }}>
                        <SmallCalendar onDateSelect={handleDateAdd} selectedDates={selectedDates} selectionMode="primary" />
                      </Box>

                      {/* Selected Dates */}
                      {selectedDates.length > 0 ? (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Selected Dates:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedDates.map((date, index) => (
                              <Chip
                                key={index}
                                label={date.toLocaleDateString()}
                                onDelete={() => handleDateRemove(date)}
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            color: 'text.secondary',
                            backgroundColor: 'grey.50',
                            borderRadius: 1,
                            mb: 2
                          }}
                        >
                          <Typography variant="body2">👆 Click on dates in the calendar above to select them for regularization</Typography>
                        </Box>
                      )}
                    </>
                  )}
                </CardContent>
              </StyledCard>
            </Grid2>

            {/* Right Side - Form */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <StyledCard>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  {/* Employee Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 1.5, width: 32, height: 32 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Anand
                      </Typography>
                    </Box>
                  </Box>

                  {selectedDates.length === 0 && !isRegularizeMode ? (
                    /* Show empty state when no dates selected in manual mode */
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Select date to start regularizing
                      </Typography>
                      <Typography variant="body2">Choose a date from the calendar to create a regularization request</Typography>
                    </Box>
                  ) : (
                    <>
                      {/* Remarks */}
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Remarks"
                        placeholder="Enter your remarks..."
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        sx={{ mb: 2 }}
                        size="small"
                      />

                      {/* Add Button - only show in regularize mode */}
                      {isRegularizeMode && (
                        <Button variant="outlined" startIcon={<AddIcon />} fullWidth sx={{ mb: 2, textTransform: 'none' }} size="small">
                          Add
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </StyledCard>
              <StyledCard>
                <CardContent>
                  {/* Regularization Entries - Scrollable Container */}
                  {selectedDates.length > 0 && (
                    <Box
                      sx={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        mb: 2,
                        pr: 1,
                        '&::-webkit-scrollbar': {
                          width: '6px'
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          borderRadius: '3px',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.3)'
                          }
                        }
                      }}
                    >
                      {selectedDates.map((date, index) => (
                        <CompactCard key={index} sx={{ mb: 1.5 }}>
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
                              <Typography variant="h6" fontSize="1.1rem">
                                {date.getDate()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </Typography>
                            </Box>

                            <FormControl fullWidth sx={{ mb: 1.5 }} size="small">
                              <InputLabel>Shift</InputLabel>
                              <Select value={formData.shift} label="Shift" onChange={(e) => handleInputChange('shift', e.target.value)}>
                                <MenuItem value="General Shift">General Shift</MenuItem>
                                <MenuItem value="Night Shift">Night Shift</MenuItem>
                                <MenuItem value="Morning Shift">Morning Shift</MenuItem>
                              </Select>
                            </FormControl>

                            <Grid2 container spacing={1.5} sx={{ mb: 1.5 }}>
                              <Grid2 size={6}>
                                <TextField
                                  fullWidth
                                  label="From"
                                  type="time"
                                  value={formData.fromTime}
                                  onChange={(e) => handleInputChange('fromTime', e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                  size="small"
                                />
                              </Grid2>
                              <Grid2 size={6}>
                                <TextField
                                  fullWidth
                                  label="To"
                                  type="time"
                                  value={formData.toTime}
                                  onChange={(e) => handleInputChange('toTime', e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                  size="small"
                                />
                              </Grid2>
                            </Grid2>

                            <TextField
                              fullWidth
                              label="Reason"
                              placeholder="Please enter a reason"
                              value={formData.reason}
                              onChange={(e) => handleInputChange('reason', e.target.value)}
                              size="small"
                            />
                          </CardContent>
                        </CompactCard>
                      ))}
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="outlined" onClick={handleCancel} sx={{ textTransform: 'none' }} size="small">
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={selectedDates.length === 0}
                      sx={{ textTransform: 'none' }}
                      size="small"
                    >
                      Submit
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid2>
          </Grid2>
        </TabPanel>

        {/* Pending Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted On</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRegularizations.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.shift}</TableCell>
                    <TableCell>
                      {row.fromTime} - {row.toTime}
                    </TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color="warning" size="small" />
                    </TableCell>
                    <TableCell>{new Date(row.submittedOn).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted On</TableCell>
                  <TableCell>Action By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyRegularizations.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.shift}</TableCell>
                    <TableCell>
                      {row.fromTime} - {row.toTime}
                    </TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={row.status === 'Approved' ? 'success' : 'error'} size="small" />
                    </TableCell>
                    <TableCell>{new Date(row.submittedOn).toLocaleDateString()}</TableCell>
                    <TableCell>{row.approvedBy || row.rejectedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </>
    </Box>
  );
};

export default MyRegularizations;
