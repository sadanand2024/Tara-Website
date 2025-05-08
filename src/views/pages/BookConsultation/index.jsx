import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
// Common styles
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    py: 4,
    px: { xs: 2, sm: 4 },
    mt: { xs: 4, sm: 0 }
  },
  card: {
    display: 'flex',
    minHeight: { xs: 'auto', md: 650 },
    maxHeight: { xs: 'none', md: '90vh' },
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: 2,
    width: '100%',
    maxWidth: 1050,
    position: 'relative',
    flexDirection: { xs: 'column', md: 'row' }
  },
  leftPanel: {
    width: { xs: '100%', md: 340 },
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: { xs: 'none', md: '1px solid #e1e1e1' },
    borderBottom: { xs: '1px solid #e1e1e1', md: 'none' }
  },
  rightPanel: {
    flex: 1,
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    minHeight: { xs: 500, md: 650 }
  },
  calendarSection: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'flex-start' },
    width: '100%'
  },
  calendarWrapper: {
    flex: { xs: '0 0 auto', sm: 1 },
    px: { xs: 3, sm: 5 },
    pt: { xs: 3, sm: 5 },
    minWidth: { sm: 370 }
  },
  timeSlotsWrapper: {
    minWidth: { xs: '100%', sm: 260 },
    flex: { xs: '0 0 auto', sm: 1 },
    pt: { xs: 3, sm: 5 },
    px: { xs: 3, sm: 0 },
    pr: { sm: 4 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: { xs: '100%', sm: 'auto' }
  },
  timeSlotsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    maxHeight: { xs: '50vh', sm: 540 },
    overflowY: 'auto',
    pr: 1,
    alignItems: 'center',
    pb: { xs: 4, sm: 2 },
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '3px'
    }
  },
  iconText: {
    display: 'flex',
    alignItems: 'center',
    mb: 2
  },
  icon: {
    fontSize: 20,
    mr: 1
  },
  textField: {
    mb: 2,
    '& .MuiInputBase-input': {
      fontSize: 16
    }
  },
  calendarButton: {
    minWidth: 36,
    width: 36,
    height: 36,
    borderRadius: '50%',

    mb: 0.5,
    fontSize: 16,
    position: 'relative'
  },
  timeSlotButton: {
    py: 1.5,

    fontSize: 14,
    textTransform: 'none',
    justifyContent: 'center',
    transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Helper to generate time slots
function generateTimeSlots(date) {
  const slots = [];
  const start = new Date(date);
  start.setHours(10, 30, 0, 0); // 10:30 AM
  const end = new Date(date);
  end.setHours(18, 0, 0, 0); // 6:00 PM
  const now = new Date();
  while (start <= end) {
    // If today, only show future slots
    if (date.toDateString() !== now.toDateString() || start.getTime() > now.getTime()) {
      const hour = start.getHours();
      const min = start.getMinutes();
      let displayHour = hour % 12 === 0 ? 12 : hour % 12;
      let ampm = hour < 12 ? 'AM' : 'PM';
      const label = `${displayHour}:${min.toString().padStart(2, '0')}${ampm.toUpperCase()}`;
      slots.push(label);
    }
    start.setMinutes(start.getMinutes() + 30);
  }
  return slots;
}

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const BookConsultationPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState('calendar'); // 'calendar' or 'details'

  // Form state for details step
  const [form, setForm] = useState({ name: '', email: '', mobile_number: '', notes: '' });
  const [errors, setErrors] = useState({});

  const days = daysInMonth(month, year);
  const selectedDateObj = new Date(year, month, selectedDate);
  const timeSlots = generateTimeSlots(selectedDateObj);

  const handleReset = () => {
    setStep('calendar');
    setSelectedDate(today.getDate());
    setSelectedTime('');
    setForm({ name: '', email: '', mobile_number: '', notes: '' });
    setErrors({});
  };

  // Calendar navigation
  const handlePrevMonth = () => {
    if (month > today.getMonth() || year > today.getFullYear()) {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else {
        setMonth((m) => m - 1);
      }
      setSelectedDate(1);
      setSelectedTime('');
    }
  };
  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(1);
    setSelectedTime('');
  };

  // Helper to check if a date is in the past
  const isPastDate = (day) => {
    const date = new Date(year, month, day);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  // Helper to get the next time slot (for display in left panel)
  function getTimeRange(selectedTime) {
    if (!selectedTime) return '';
    const [h, m, ampm] = selectedTime.match(/(\d+):(\d+)(AM|PM)/i).slice(1);
    let hour = parseInt(h, 10);
    let minute = parseInt(m, 10);
    let isPM = ampm === 'PM';
    let start = new Date(selectedDateObj);
    start.setHours(isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour, minute, 0, 0);
    let end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    const format = (d) => {
      let h = d.getHours();
      let m = d.getMinutes();
      let ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 === 0 ? 12 : h % 12;
      return `${h}:${m.toString().padStart(2, '0')}${ampm}`;
    };
    return `${format(start)} - ${format(end)}`;
  }

  // Validation helpers
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!form.mobile_number.trim() || form.mobile_number.length !== 10) newErrors.mobile_number = 'Mobile Number is required.';
    return newErrors;
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    // Format the date to YYYY-MM-DD
    const formattedDate = selectedDateObj.toISOString().split('T')[0];

    let data = {
      name: form.name,
      email: form.email,
      mobile_number: form.mobile_number,
      message: form.notes,
      date: formattedDate,
      time: selectedTime
    };

    if (Object.keys(newErrors).length === 0) {
      console.log('Submitting data:', data);
      const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/user_management/consultation`;
      axios
        .post(apiUrl, data)
        .then((response) => {
          console.log(response);
          enqueueSnackbar('Consultation booked successfully!', {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            autoHideDuration: 3000
          });
          handleReset();
        })
        .catch((error) => {
          enqueueSnackbar('Error booking consultation!', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            autoHideDuration: 3000
          });
        });
    }
  };

  const renderLeftPanel = () => (
    <Box
      sx={{
        ...styles.leftPanel,
        bgcolor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        display: { xs: step === 'calendar' ? 'none' : 'flex', md: 'flex' },
        position: 'relative'
      }}
    >
      {step === 'details' && (
        <IconButton
          onClick={() => setStep('calendar')}
          sx={{
            position: 'absolute',
            top: 24,
            left: 24,
            zIndex: 2,
            bgcolor: theme.palette.background.paper,
            boxShadow: 1,
            mb: 2,
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': { bgcolor: theme.palette.action.hover }
          }}
          aria-label="Back"
          size="small"
        >
          <ArrowBackIosNewIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        </IconButton>
      )}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            fontWeight: 700,
            fontSize: { xs: 24 },
            color: { xs: theme.palette.text.primary },
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Tara First
        </Typography>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            mt: { xs: 0, sm: 5 },
            color: theme.palette.text.primary,
            fontSize: { xs: 24, md: 28 },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          30 Minute Meeting
        </Typography>
        {step === 'details' && selectedTime && (
          <>
            {/* Mobile view - Compact format */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ fontSize: 14, color: theme.palette.text.secondary }}>
                {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} •{' '}
                {getTimeRange(selectedTime)} • IST
              </Typography>
            </Box>

            {/* Desktop view - Detailed format */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ ...styles.iconText, mt: 2 }}>
                <AccessTimeIcon sx={{ ...styles.icon, color: theme.palette.text.secondary }} />
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: 14, md: 16 }, color: theme.palette.text.secondary }}>
                  {getTimeRange(selectedTime)}
                </Typography>
              </Box>
              <Box sx={styles.iconText}>
                <CalendarTodayIcon sx={{ ...styles.icon, color: theme.palette.text.secondary }} />
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: 14, md: 16 }, color: theme.palette.text.secondary }}>
                  {selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </Typography>
              </Box>
              <Box sx={styles.iconText}>
                <PublicIcon sx={{ ...styles.icon, color: theme.palette.text.secondary }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, fontSize: { xs: 14, md: 16 } }}>
                  India Standard Time
                </Typography>
              </Box>
            </Box>
          </>
        )}
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            px: 3,
            pb: 2,
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Button
            variant="text"
            size="small"
            component={Link}
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Terms & Conditions
          </Button>
          <Button
            variant="text"
            size="small"
            component={Link}
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Privacy Policy
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const renderCalendarView = () => (
    <Box sx={styles.rightPanel}>
      <Box sx={styles.calendarSection}>
        {/* Calendar Section */}
        <Box sx={styles.calendarWrapper}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.primary, fontSize: { xs: 20, sm: 22 } }}>
            Select a Date and Time
          </Typography>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <IconButton
              size="small"
              sx={{
                bgcolor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                width: 32,
                height: 32
              }}
              onClick={handlePrevMonth}
              disabled={month === today.getMonth() && year === today.getFullYear()}
            >
              <ArrowBackIosNewIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
            </IconButton>
            <Typography variant="subtitle1" sx={{ mx: 2, fontWeight: 600, color: theme.palette.text.primary, fontSize: 18 }}>
              {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
            </Typography>
            <IconButton
              size="small"
              sx={{
                bgcolor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                width: 32,
                height: 32
              }}
              onClick={handleNextMonth}
            >
              <ArrowForwardIosIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
            </IconButton>
          </Box>
          {/* Calendar Days */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 0.5 }}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
              <Typography
                key={d}
                variant="caption"
                sx={{
                  width: { xs: 32, sm: 36 },
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  fontSize: { xs: 12, sm: 14 }
                }}
              >
                {d}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, px: 0.5 }}>
            {[...Array(days)].map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDate;
              const disabled = isPastDate(day);
              return (
                <Button
                  key={day}
                  variant={isSelected ? 'contained' : disabled ? 'text' : 'outlined'}
                  color={isSelected ? 'primary' : 'inherit'}
                  disabled={disabled}
                  sx={{
                    ...styles.calendarButton,
                    bgcolor: isSelected ? theme.palette.primary.main : 'none',
                    color: isSelected ? '#fff' : disabled ? theme.palette.text.secondary : theme.palette.text.secondary,
                    border: isSelected ? `1.5px solid ${theme.palette.primary.main}` : 'none',
                    boxShadow: isSelected ? 2 : 0,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1
                  }}
                  onClick={() => !disabled && setSelectedDate(day)}
                >
                  {day}
                </Button>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, mt: 1 }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, fontSize: { xs: 13, sm: 15 } }}>
              India Standard Time ({today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })})
            </Typography>
          </Box>
        </Box>
        {/* Time Slots */}
        <Box sx={styles.timeSlotsWrapper}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: theme.palette.text.primary,
              fontSize: { xs: 14, sm: 16 },
              textAlign: 'center',
              position: 'sticky',
              top: 0,
              bgcolor: theme.palette.background.paper,
              zIndex: 1,
              py: 1
            }}
          >
            {selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
          <Box sx={styles.timeSlotsList}>
            {timeSlots.length === 0 ? (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center', mt: 4 }}>
                No available time slots for this day.
              </Typography>
            ) : (
              timeSlots.map((slot) => (
                <Box
                  key={slot}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '100%'
                  }}
                >
                  <Button
                    variant={selectedTime === slot ? 'contained' : 'outlined'}
                    color={selectedTime === slot ? 'inherit' : 'primary'}
                    sx={{
                      ...styles.timeSlotButton,
                      width: selectedTime === slot ? 96 : 200,
                      bgcolor: selectedTime === slot ? theme.palette.primary.dark : theme.palette.background.paper,
                      color: selectedTime === slot ? '#fff' : theme.palette.primary.main,
                      borderColor: selectedTime === slot ? theme.palette.primary.dark : theme.palette.primary.main,
                      boxShadow: selectedTime === slot ? 2 : 0,
                      '&:hover': {
                        bgcolor: selectedTime === slot ? theme.palette.primary.dark : theme.palette.primary.main,
                        color: '#fff'
                      }
                    }}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                  <Box
                    sx={{
                      display: 'inline-block',
                      overflow: 'hidden',
                      width: selectedTime === slot ? 96 : 0,
                      ml: selectedTime === slot ? 1 : 0,
                      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      verticalAlign: 'middle'
                    }}
                  >
                    {selectedTime === slot && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          fontSize: 14,
                          width: 96,
                          py: 1.5,
                          borderRadius: 2,
                          boxShadow: 2,
                          bgcolor: '#444d56',
                          textTransform: 'none',
                          minWidth: 0,
                          transition: 'background 0.2s, color 0.2s'
                        }}
                        onClick={() => setStep('details')}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderDetailsForm = () => (
    <Box sx={styles.rightPanel}>
      <Box sx={{ px: { xs: 2, sm: 6 }, pt: { xs: 2, sm: 6 }, pb: 0, maxWidth: 600, width: '100%' }}>
        <Typography variant="h6" sx={{ mb: { xs: 1, sm: 3 }, color: theme.palette.text.primary, fontSize: { xs: 16, sm: 22 } }}>
          Enter Details
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Typography variant="subtitle1" sx={{ textAlign: 'left', mb: 0.5, color: theme.palette.text.primary }}>
            Name&nbsp;
            <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            size="small"
            sx={styles.textField}
            value={form.name}
            onChange={handleFormChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
          <Typography variant="subtitle1" sx={{ textAlign: 'left', mb: 0.5, color: theme.palette.text.primary }}>
            Mobile Number&nbsp;
            <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            size="small"
            sx={styles.textField}
            value={form.mobile_number}
            onChange={handleFormChange('mobile_number')}
            error={!!errors.mobile_number}
            helperText={errors.mobile_number}
          />
          <Typography variant="subtitle1" sx={{ textAlign: 'left', mb: 0.5, color: theme.palette.text.primary }}>
            Email&nbsp;
            <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            size="small"
            sx={styles.textField}
            value={form.email}
            onChange={handleFormChange('email')}
            error={!!errors.email}
            helperText={errors.email}
          />
          <Typography variant="subtitle1" sx={{ textAlign: 'left', mb: 0.5, color: theme.palette.text.primary }}>
            Please share anything that will help prepare for our meeting.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={{ xs: 2, sm: 3 }}
            sx={styles.textField}
            value={form.notes}
            onChange={handleFormChange('notes')}
          />
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
            By proceeding, you confirm that you have read and agree to{' '}
            <Box component="span" sx={{ color: theme.palette.primary.main, cursor: 'pointer', textDecoration: 'underline' }}>
              Calendly's Terms of Use
            </Box>{' '}
            and{' '}
            <Box component="span" sx={{ color: theme.palette.primary.main, cursor: 'pointer', textDecoration: 'underline' }}>
              Privacy Notice
            </Box>
            .
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              borderRadius: 8,
              fontSize: { xs: 16, sm: 18 },
              px: { xs: 2, sm: 4 },
              py: { xs: 0.8, sm: 1.5 },
              textTransform: 'none',
              boxShadow: 2
            }}
            fullWidth={false}
            type="submit"
          >
            Schedule Event
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ ...styles.pageWrapper, bgcolor: theme.palette.background.default }}>
      <Card sx={styles.card}>
        {renderLeftPanel()}
        {step === 'calendar' ? renderCalendarView() : renderDetailsForm()}
      </Card>
    </Box>
  );
};

export default BookConsultationPage;
