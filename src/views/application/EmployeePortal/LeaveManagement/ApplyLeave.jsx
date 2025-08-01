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
  Autocomplete,
  Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AttachFile, Add, KeyboardArrowDown } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Factory from 'utils/Factory';
import MainCard from 'ui-component/cards/MainCard';
import { useSelector, useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const ApplyLeave = () => {
  const [selectedCC, setSelectedCC] = useState('');

  // Mock data
  const leaveTypes = ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'];

  const ccOptions = [
    { id: 1, name: 'D. Vijay Kumar', avatar: '/src/assets/images/users/avatar-1.png' },
    { id: 2, name: 'John Doe', avatar: '/src/assets/images/users/avatar-2.png' },
    { id: 3, name: 'Jane Smith', avatar: '/src/assets/images/users/avatar-3.png' }
  ];

  const reviewerOptions = [
    { id: 1, name: 'Manager A', avatar: '/src/assets/images/users/avatar-1.png' },
    { id: 2, name: 'Manager B', avatar: '/src/assets/images/users/avatar-2.png' },
    { id: 3, name: 'Manager C', avatar: '/src/assets/images/users/avatar-3.png' }
  ];

  const reasonTypes = ['Personal', 'Medical', 'Family Emergency', 'Travel', 'Other'];

  const handleAddCC = () => {
    if (selectedCC && !formik.values.cc_to.find((cc) => cc.id === selectedCC)) {
      const ccPerson = ccOptions.find((cc) => cc.id === selectedCC);
      if (ccPerson) {
        formik.setFieldValue('cc_to', [...formik.values.cc_to, ccPerson]);
        setSelectedCC('');
      }
    }
  };

  const handleRemoveCC = (ccId) => {
    formik.setFieldValue(
      'cc_to',
      formik.values.cc_to.filter((cc) => cc.id !== ccId)
    );
  };

  const calculateLeaveDays = () => {
    if (formik.values.start_date && formik.values.end_date) {
      const from = dayjs(formik.values.start_date);
      const to = dayjs(formik.values.end_date);
      return to.diff(from, 'day') + 1;
    }
    return 0;
  };

  const formik = useFormik({
    initialValues: {
      employee: '', // This should be populated with current employee data
      leave_type: '',
      start_date: null,
      end_date: null,
      reason: '',
      contact_details: '',
      cc_to: [],
      reviewer: null,
      attach_file: null
    },
    validationSchema: Yup.object({
      employee: Yup.string().required('Employee is required'),
      leave_type: Yup.string().required('Leave type is required'),
      start_date: Yup.date().required('Start date is required').min(new Date(), 'Start date cannot be in the past'),
      end_date: Yup.date().required('End date is required').min(Yup.ref('start_date'), 'End date must be after start date'),
      reason: Yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters'),
      contact_details: Yup.string().required('Contact details are required').min(5, 'Contact details must be at least 5 characters'),
      cc_to: Yup.array().min(1, 'At least one CC recipient is required'),
      reviewer: Yup.object().required('Reviewer is required'),
      attach_file: Yup.mixed().required('Attached file is required')
    }),
    onSubmit: async (values) => {
      try {
        // Create FormData object
        const formData = new FormData();

        // Add all form fields to FormData
        formData.append('employee', values.employee);
        formData.append('leave_type', values.leave_type);
        formData.append('start_date', dayjs(values.start_date).format('YYYY-MM-DD'));
        formData.append('end_date', dayjs(values.end_date).format('YYYY-MM-DD'));
        formData.append('reason', values.reason);
        formData.append('contact_details', values.contact_details);
        formData.append('reviewer', values.reviewer.id);

        // Add multiple cc_to values
        values.cc_to.forEach((cc, index) => {
          formData.append('cc_to', cc.id);
        });

        // Add file
        if (values.attach_file) {
          formData.append('attach_file', values.attach_file);
        }

        const url = '/payroll/apply/';
        const { res } = await Factory('post', url, formData);

        console.log('API Response:', res.data);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Leave application submitted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );

        // Reset form on success
        formik.resetForm();
      } catch (error) {
        console.error('Error submitting leave application:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to submit leave application',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const handleCancel = () => {
    formik.resetForm();
  };

  return (
    <MainCard title="Applying for leave">
      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          {/* Left Column - Form Fields */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Grid2 container spacing={3}>
              {/* Employee and Leave Type - Row 1 */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Employee"
                  value={formik.values.employee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="employee"
                  error={formik.touched.employee && Boolean(formik.errors.employee)}
                  helperText={formik.touched.employee && formik.errors.employee}
                  // disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={leaveTypes}
                  value={formik.values.leave_type}
                  onChange={(event, newValue) => formik.setFieldValue('leave_type', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Leave type"
                      size="small"
                      error={formik.touched.leave_type && Boolean(formik.errors.leave_type)}
                      helperText={formik.touched.leave_type && formik.errors.leave_type}
                    />
                  )}
                />
              </Grid2>

              {/* Date Range - Row 2 */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small' } }}
                    value={formik.values.start_date}
                    onChange={(newValue) => formik.setFieldValue('start_date', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                        helperText={formik.touched.start_date && formik.errors.start_date}
                      />
                    )}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small' } }}
                    value={formik.values.end_date}
                    onChange={(newValue) => formik.setFieldValue('end_date', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                        helperText={formik.touched.end_date && formik.errors.end_date}
                      />
                    )}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid2>

              {/* Reason and Contact Details - Row 3 */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={reasonTypes}
                  value={formik.values.reason}
                  onChange={(event, newValue) => formik.setFieldValue('reason', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Reason"
                      size="small"
                      error={formik.touched.reason && Boolean(formik.errors.reason)}
                      helperText={formik.touched.reason && formik.errors.reason}
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Contact Details"
                  value={formik.values.contact_details}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="contact_details"
                  error={formik.touched.contact_details && Boolean(formik.errors.contact_details)}
                  helperText={formik.touched.contact_details && formik.errors.contact_details}
                />
              </Grid2>

              {/* Reviewer and Attach File - Row 4 */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={reviewerOptions}
                  getOptionLabel={(option) => option.name}
                  value={formik.values.reviewer}
                  onChange={(event, newValue) => formik.setFieldValue('reviewer', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Reviewer"
                      size="small"
                      error={formik.touched.reviewer && Boolean(formik.errors.reviewer)}
                      helperText={formik.touched.reviewer && formik.errors.reviewer}
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box>
                  <input
                    accept="image/*,.pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      formik.setFieldValue('attach_file', file);
                    }}
                  />
                  <label htmlFor="file-upload">
                    <Button component="span" startIcon={<AttachFile />} variant="outlined" fullWidth>
                      Attach file
                    </Button>
                  </label>
                  {formik.values.attach_file && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Selected: {formik.values.attach_file.name}
                    </Typography>
                  )}
                  {formik.touched.attach_file && formik.errors.attach_file && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {formik.errors.attach_file}
                    </Typography>
                  )}
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Autocomplete
                      options={ccOptions}
                      getOptionLabel={(option) => option.name}
                      value={selectedCC}
                      onChange={(event, newValue) => setSelectedCC(newValue ? newValue.id : '')}
                      renderInput={(params) => <TextField {...params} label="CC to" size="small" />}
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton
                      onClick={handleAddCC}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        flexShrink: 0
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  {/* Selected CC People */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formik.values.cc_to.map((cc) => (
                      <Chip
                        key={cc.id}
                        avatar={<Avatar src={cc.avatar} />}
                        label={cc.name}
                        onDelete={() => handleRemoveCC(cc.id)}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  {formik.touched.cc_to && formik.errors.cc_to && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {formik.errors.cc_to}
                    </Typography>
                  )}
                </Box>
              </Grid2>
            </Grid2>
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
          <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </MainCard>
  );
};

export default ApplyLeave;
