import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PublicIcon from '@mui/icons-material/Public';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
  const theme = useTheme();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState('calendar'); // 'calendar' or 'details'

  // Form state for details step
  const [form, setForm] = useState({ name: '', email: '', notes: '' });
  const [errors, setErrors] = useState({});

  const days = daysInMonth(month, year);
  const selectedDateObj = new Date(year, month, selectedDate);
  const timeSlots = generateTimeSlots(selectedDateObj);

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
    if (Object.keys(newErrors).length === 0) {
      // Submit form or show success
      // ...
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4
      }}
    >
      <Card sx={{ display: 'flex', minHeight: 650, borderRadius: 3, overflow: 'hidden', boxShadow: 2, width: 1050, position: 'relative' }}>
        {/* Left Panel */}
        <Box
          sx={{
            width: 340,
            bgcolor: theme.palette.background.paper,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: `1px solid ${theme.palette.divider}`
          }}
        >
          {/* Back button for details step */}
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
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, fontSize: 16, color: theme.palette.text.secondary }}>
              Tara First
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary, fontSize: 28 }}>
              30 Minute Meeting
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, mb: 2, fontWeight: 500 }}>
              <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 16, color: theme.palette.text.secondary }}>
                30 min
              </Typography>
            </Box>
            {step === 'details' && selectedTime && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, mb: 2, mt: 2 }}>
                  <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 16, color: theme.palette.text.secondary }}>
                    {getTimeRange(selectedTime)},{' '}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, mb: 2 }}>
                  <CalendarTodayIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 16, color: theme.palette.text.secondary }}>
                    {selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, mb: 2 }}>
                  <PublicIcon sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, fontSize: 15 }}>
                    India Standard Time
                  </Typography>
                </Box>
              </>
            )}
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pb: 2, pt: 0 }}>
            <Button
              variant="text"
              size="small"
              sx={{ color: theme.palette.primary.main, fontWeight: 500, textTransform: 'none', fontSize: 15 }}
            >
              Cookie settings
            </Button>
            <Button
              variant="text"
              size="small"
              sx={{ color: theme.palette.text.secondary, fontWeight: 500, textTransform: 'none', fontSize: 15 }}
            >
              Report abuse
            </Button>
          </Box>
        </Box>
        {/* Right Panel */}
        {step === 'calendar' ? (
          <Box sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.paper }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', p: 0 }}
            >
              {/* Calendar and Time */}
              <Box sx={{ flex: 1, px: 5, pt: 5, pb: 0, minWidth: 370 }}>
                <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.primary, fontSize: 22 }}>
                  Select a Date & Time
                </Typography>
                {/* Calendar Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: theme.palette.background.default, border: `1px solid ${theme.palette.divider}`, width: 32, height: 32 }}
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
                    sx={{ bgcolor: theme.palette.background.default, border: `1px solid ${theme.palette.divider}`, width: 32, height: 32 }}
                    onClick={handleNextMonth}
                  >
                    <ArrowForwardIosIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 0.5 }}>
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                    <Typography
                      key={d}
                      variant="caption"
                      sx={{ width: 36, textAlign: 'center', color: theme.palette.text.secondary, fontWeight: 600, fontSize: 14 }}
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
                          minWidth: 36,
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          fontWeight: 700,
                          bgcolor: isSelected ? theme.palette.primary.main : 'none',
                          color: isSelected ? '#fff' : disabled ? theme.palette.text.secondary : theme.palette.text.secondary,
                          border: isSelected ? `1.5px solid ${theme.palette.primary.main}` : 'none',
                          boxShadow: isSelected ? 2 : 0,
                          mb: 0.5,
                          fontSize: 16,
                          position: 'relative',
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
                {/* Time zone */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1, ml: 0.5 }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, ml: 1, fontSize: 15 }}>
                    India Standard Time ({today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })})
                  </Typography>
                </Box>
              </Box>
              {/* Time slots */}
              <Box sx={{ minWidth: 260, flex: 1, pt: 5, pr: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.primary, fontSize: 16, textAlign: 'center' }}>
                  {selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    maxHeight: 540,
                    overflowY: 'auto',
                    pr: 1,
                    alignItems: 'center'
                  }}
                >
                  {timeSlots.length === 0 && (
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center', mt: 4 }}>
                      No available time slots for this day.
                    </Typography>
                  )}
                  {timeSlots.map((slot) => (
                    <Box key={slot} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Button
                        variant={selectedTime === slot ? 'contained' : 'outlined'}
                        color={selectedTime === slot ? 'inherit' : 'primary'}
                        sx={{
                          width: selectedTime === slot ? 96 : 200,
                          bgcolor: selectedTime === slot ? theme.palette.primary.dark : theme.palette.background.paper,
                          color: selectedTime === slot ? '#fff' : theme.palette.primary.main,
                          fontWeight: 700,
                          borderColor: selectedTime === slot ? theme.palette.primary.dark : theme.palette.primary.main,
                          fontSize: 14,
                          py: 1.5,
                          boxShadow: selectedTime === slot ? 2 : 0,
                          textTransform: 'none',
                          justifyContent: 'center',
                          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            bgcolor: selectedTime === slot ? theme.palette.primary.dark : theme.palette.primary.main,
                            color: '#fff'
                          }
                        }}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                      {/* Animated Next button */}
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
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          // Details Form Step
          <Box sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.paper }}>
            <Box sx={{ px: 6, pt: 6, pb: 0, maxWidth: 600, mx: 'auto', width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary, fontSize: 22 }}>
                Enter Details
              </Typography>
              <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Typography variant="subtitle1" sx={{ textAlign: 'left', fontWeight: 700, mb: 0.5, color: theme.palette.text.primary }}>
                  Name *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  inputProps={{ style: { fontSize: 16 } }}
                  value={form.name}
                  onChange={handleFormChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <Typography variant="subtitle1" sx={{ textAlign: 'left', fontWeight: 700, mb: 0.5, color: theme.palette.text.primary }}>
                  Email *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  inputProps={{ style: { fontSize: 16 } }}
                  value={form.email}
                  onChange={handleFormChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <Typography variant="subtitle1" sx={{ textAlign: 'left', fontWeight: 700, mb: 0.5, color: theme.palette.text.primary }}>
                  Please share anything that will help prepare for our meeting.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  sx={{ mb: 2 }}
                  inputProps={{ style: { fontSize: 16 } }}
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
                  sx={{ mt: 2, borderRadius: 8, fontWeight: 700, fontSize: 18, px: 4, py: 1.5, textTransform: 'none', boxShadow: 2 }}
                  fullWidth={false}
                  type="submit"
                >
                  Schedule Event
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default BookConsultationPage;
