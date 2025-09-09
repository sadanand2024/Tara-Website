import React, { useState, useEffect } from 'react';
import { Box, Button, Grid2, Stack, TextField, Typography, Paper } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Autocomplete } from '@mui/material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as Yup from 'yup';
import Factory from 'utils/Factory';

const ApplyLeaveSimple = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [leaveDuration, setLeaveDuration] = useState('full_day');
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  // Sample leave balance data - replace with actual API data
  const [leaveBalance] = useState({
    available: 18,
    applied: 6,
    lop: 2
  });

  // Sample leave types and managers - replace with actual API data
  const [managers, setManagers] = useState([]);

  // Function to check if the leave application is backdated
  const isBackdated = () => {
    if (!formik.values.start_date) return false;

    const today = dayjs().startOf('day');
    const startDate = dayjs(formik.values.start_date).startOf('day');

    return startDate.isBefore(today);
  };

  const formik = useFormik({
    initialValues: {
      employee: '', // optional fallback; we will use logged-in employee id
      leave_type: null, // Changed to null to work with Autocomplete objects
      start_date: null,
      end_date: null,
      reason: '',
      contact_details: '',
      cc_to: [],
      reviewer: null,
      attach_file: null
    },
    validationSchema: Yup.object({
      // employee is auto-set; leave validation off
      leave_type: Yup.object().nullable().required('Leave type is required'),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date().required('End date is required').min(Yup.ref('start_date'), 'End date must be after start date'),
      reason: Yup.string().required('Reason is required'),
      contact_details: Yup.string().required('Contact details are required').min(5, 'Contact details must be at least 5 characters')
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Prefer logged-in employee id
        const employeeId = employeeInfo?.employee_id;

        if (!employeeId) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Employee not found for this account',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
          return;
        }
        formData.append('employee', employeeId);
        formData.append('leave_type', values.leave_type?.id || ''); // Use leave type ID
        formData.append('start_date', dayjs(values.start_date).format('YYYY-MM-DD'));
        formData.append('end_date', dayjs(values.end_date).format('YYYY-MM-DD'));
        formData.append('reason', values.reason);
        formData.append('contact_details', values.contact_details);

        const url = '/payroll/apply/';
        const { res } = await Factory('post', url, formData);

        if (res?.status_cd === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Leave application submitted successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          formik.resetForm();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          const serverMsg =
            res?.data?.data?.non_field_errors?.[0] ||
            res?.data?.data?.detail ||
            res?.data?.data?.message ||
            'Failed to submit leave application';
          dispatch(
            openSnackbar({
              open: true,
              message: serverMsg,
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      } catch (error) {
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
  const getLeaveTypes = async () => {
    const url = `/payroll/leave-types`;
    const { res } = await Factory('get', url, {});

    if (res?.status_cd === 0) {
      const responseData = res?.data || {};
      console.log('Leave Types API Response:', responseData);

      // Extract employee info and leave types from the new response structure
      setEmployeeInfo({
        employee_id: responseData.employee_id,
        employee_name: responseData.employee_name
      });
      setLeaveTypes(responseData.leave_types || []);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch leave types',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setLeaveTypes([]);
    }
  };
  useEffect(() => {
    getLeaveTypes();
  }, []);
  return (
    <Box>
      {/* Backdated Notice - Only show when dates are in the past */}
      {isBackdated() && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#fff3e0', border: '1px solid #ffcc02', borderRadius: 1 }}>
          <Typography variant="body2" color="error" sx={{ fontWeight: 600, mb: 1 }}>
            **Backdated Leave Application
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            You are applying for leave on dates that have already passed. This may require additional approval and could be subject to LOP
            (Loss of Pay) depending on company policy.
          </Typography>
        </Box>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          {/* Left Column - Form Fields */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Grid2 container spacing={2}>
              {/* Date Fields */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={formik.values.start_date}
                    onChange={(value) => formik.setFieldValue('start_date', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: formik.touched.start_date && Boolean(formik.errors.start_date),
                        helperText: formik.touched.start_date && formik.errors.start_date
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    value={formik.values.end_date}
                    onChange={(value) => formik.setFieldValue('end_date', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: formik.touched.end_date && Boolean(formik.errors.end_date),
                        helperText: formik.touched.end_date && formik.errors.end_date
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid2>

              {/* Leave Duration Selection */}
              <Grid2 size={{ xs: 12 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Button
                    variant={leaveDuration === 'full_day' ? 'contained' : 'outlined'}
                    onClick={() => setLeaveDuration('full_day')}
                    startIcon={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: leaveDuration === 'full_day' ? '#1976d2' : 'transparent',
                          border: '2px solid #1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {leaveDuration === 'full_day' && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'white'
                            }}
                          />
                        )}
                      </Box>
                    }
                    sx={{
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      border: leaveDuration === 'full_day' ? 'none' : '1px solid #e0e0e0',
                      color: leaveDuration === 'full_day' ? 'white' : '#666',
                      bgcolor: leaveDuration === 'full_day' ? '#1976d2' : 'white',
                      '&:hover': {
                        bgcolor: leaveDuration === 'full_day' ? '#1565c0' : '#f5f5f5'
                      }
                    }}
                  >
                    Full Day
                  </Button>

                  <Button
                    variant={leaveDuration === 'first_half' ? 'contained' : 'outlined'}
                    onClick={() => setLeaveDuration('first_half')}
                    startIcon={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: leaveDuration === 'first_half' ? '#1976d2' : 'transparent',
                          border: '2px solid #1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {leaveDuration === 'first_half' && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'white'
                            }}
                          />
                        )}
                      </Box>
                    }
                    sx={{
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      border: leaveDuration === 'first_half' ? 'none' : '1px solid #e0e0e0',
                      color: leaveDuration === 'first_half' ? 'white' : '#666',
                      bgcolor: leaveDuration === 'first_half' ? '#1976d2' : 'white',
                      '&:hover': {
                        bgcolor: leaveDuration === 'first_half' ? '#1565c0' : '#f5f5f5'
                      }
                    }}
                  >
                    First Half
                  </Button>

                  <Button
                    variant={leaveDuration === 'second_half' ? 'contained' : 'outlined'}
                    onClick={() => setLeaveDuration('second_half')}
                    startIcon={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: leaveDuration === 'second_half' ? '#1976d2' : 'transparent',
                          border: '2px solid #1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {leaveDuration === 'second_half' && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'white'
                            }}
                          />
                        )}
                      </Box>
                    }
                    sx={{
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      border: leaveDuration === 'second_half' ? 'none' : '1px solid #e0e0e0',
                      color: leaveDuration === 'second_half' ? 'white' : '#666',
                      bgcolor: leaveDuration === 'second_half' ? '#1976d2' : 'white',
                      '&:hover': {
                        bgcolor: leaveDuration === 'second_half' ? '#1565c0' : '#f5f5f5'
                      }
                    }}
                  >
                    Second Half
                  </Button>
                </Stack>
              </Grid2>

              {/* Leave Type and Manager */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={leaveTypes}
                  value={formik.values.leave_type}
                  onChange={(event, value) => {
                    formik.setFieldValue('leave_type', value);
                  }}
                  getOptionLabel={(option) => option?.name_of_leave || ''}
                  getOptionKey={(option) => option?.id || Math.random()}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Leave type"
                      name="leave_type"
                      error={formik.touched.leave_type && Boolean(formik.errors.leave_type)}
                      helperText={formik.touched.leave_type && formik.errors.leave_type}
                    />
                  )}
                  onBlur={() => formik.setFieldTouched('leave_type', true)}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={managers}
                  value={formik.values.manager}
                  onChange={(event, value) => {
                    formik.setFieldValue('manager', value);
                  }}
                  getOptionLabel={(option) => option?.name_of_manager || ''}
                  getOptionKey={(option) => option?.id || Math.random()}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Manager Name"
                      name="manager"
                      error={formik.touched.manager && Boolean(formik.errors.manager)}
                      helperText={formik.touched.manager && formik.errors.manager}
                    />
                  )}
                  onBlur={() => formik.setFieldTouched('manager', true)}
                />
              </Grid2>

              {/* Reason */}
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Reason"
                  name="reason"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  error={formik.touched.reason && Boolean(formik.errors.reason)}
                  helperText={formik.touched.reason && formik.errors.reason}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid2>

              {/* Apply Button */}
              <Grid2 size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                  sx={{
                    bgcolor: '#1976d2',
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {formik.isSubmitting ? 'Applying...' : 'Apply'}
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>

          {/* Right Column - Leave Balance */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              {/* Available Leaves */}
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: '#e3f2fd',
                  border: '1px solid #bbdefb'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Available Leaves
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', mb: 0.5 }}>
                  {leaveBalance.available}
                </Typography>
              </Paper>

              {/* Applied Leaves */}
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: '#f3e5f5',
                  border: '1px solid #ce93d8'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Applied leaves
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#7b1fa2', mb: 0.5 }}>
                  {leaveBalance.applied}
                </Typography>
              </Paper>

              {/* LOP */}
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: '#fff3e0',
                  border: '1px solid #ffcc02'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Lop
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#f57c00', mb: 0.5 }}>
                  {leaveBalance.lop}
                </Typography>
              </Paper>
            </Stack>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
};

export default ApplyLeaveSimple;
