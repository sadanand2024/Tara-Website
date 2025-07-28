import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Grid2,
  Stack,
  IconButton,
  Autocomplete
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AttachFile, Add, KeyboardArrowDown } from '@mui/icons-material';
import dayjs from 'dayjs';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: null,
    toDate: null,
    ccTo: [],
    contactDetails: '',
    reason: '',
    attachedFile: null
  });

  const [selectedCC, setSelectedCC] = useState('');

  // Mock data
  const leaveTypes = ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'];

  const ccOptions = [
    { id: 1, name: 'D. Vijay Kumar', avatar: '/src/assets/images/users/avatar-1.png' },
    { id: 2, name: 'John Doe', avatar: '/src/assets/images/users/avatar-2.png' },
    { id: 3, name: 'Jane Smith', avatar: '/src/assets/images/users/avatar-3.png' }
  ];

  const reasonTypes = ['Personal', 'Medical', 'Family Emergency', 'Travel', 'Other'];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCC = () => {
    if (selectedCC && !formData.ccTo.find((cc) => cc.id === selectedCC)) {
      const ccPerson = ccOptions.find((cc) => cc.id === selectedCC);
      if (ccPerson) {
        setFormData((prev) => ({
          ...prev,
          ccTo: [...prev.ccTo, ccPerson]
        }));
        setSelectedCC('');
      }
    }
  };

  const handleRemoveCC = (ccId) => {
    setFormData((prev) => ({
      ...prev,
      ccTo: prev.ccTo.filter((cc) => cc.id !== ccId)
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachedFile: file
      }));
    }
  };

  const calculateLeaveDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = dayjs(formData.fromDate);
      const to = dayjs(formData.toDate);
      return to.diff(from, 'day') + 1;
    }
    return 0;
  };

  const handleSubmit = () => {
    console.log('Leave application submitted:', formData);
    // Here you would typically send the data to your API
  };

  const handleCancel = () => {
    setFormData({
      leaveType: '',
      fromDate: null,
      toDate: null,
      ccTo: [],
      contactDetails: '',
      reason: '',
      attachedFile: null
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Applying for leave
        </Typography>

        <Grid2 container spacing={3}>
          {/* Left Column - Form Fields */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {/* Leave Type */}
              <FormControl fullWidth>
                <InputLabel>Leave type</InputLabel>
                <Select
                  value={formData.leaveType}
                  label="Leave type"
                  onChange={(e) => handleInputChange('leaveType', e.target.value)}
                  endAdornment={<KeyboardArrowDown />}
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Date Range */}
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="from Date"
                      value={formData.fromDate}
                      onChange={(newValue) => handleInputChange('fromDate', newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid2>
                <Grid2 size={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="To Date"
                      value={formData.toDate}
                      onChange={(newValue) => handleInputChange('toDate', newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid2>
              </Grid2>

              {/* CC To */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  cc to
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Autocomplete
                    options={ccOptions}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="CC to" />}
                  />
                  <IconButton
                    onClick={handleAddCC}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>
                {/* Selected CC People */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.ccTo.map((cc) => (
                    <Chip
                      key={cc.id}
                      avatar={<Avatar src={cc.avatar} />}
                      label={cc.name}
                      onDelete={() => handleRemoveCC(cc.id)}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              {/* Contact Details */}
              <TextField
                fullWidth
                label="Contact Details"
                value={formData.contactDetails}
                onChange={(e) => handleInputChange('contactDetails', e.target.value)}
                multiline
                rows={2}
              />

              {/* Reason */}
              <FormControl fullWidth>
                <InputLabel>Reason</InputLabel>
                <Select
                  value={formData.reason}
                  label="Reason"
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  endAdornment={<KeyboardArrowDown />}
                >
                  {reasonTypes.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Attach File */}
              <Box>
                <input
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button component="span" startIcon={<AttachFile />} variant="outlined">
                    Attach file
                  </Button>
                </label>
                {formData.attachedFile && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Selected: {formData.attachedFile.name}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid2>

          {/* Right Column - Leave Summary */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Leave Summary
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Balance
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    22 days
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Applying for
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {calculateLeaveDays()} days
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid2>
        </Grid2>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApplyLeave;
