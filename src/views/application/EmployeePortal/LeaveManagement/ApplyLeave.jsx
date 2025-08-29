import {
  Box,
  Button,
  Card,
  Grid2,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import Factory from 'utils/Factory';
import * as Yup from 'yup';


const ApplyLeave = () => {
  const [selectedCC, setSelectedCC] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((s) => s.accountReducer.user);

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
      employee: '', // optional fallback; we will use logged-in employee id
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
      // employee is auto-set; leave validation off
      leave_type: Yup.string().required('Leave type is required'),
      start_date: Yup.date().required('Start date is required').min(new Date(), 'Start date cannot be in the past'),
      end_date: Yup.date().required('End date is required').min(Yup.ref('start_date'), 'End date must be after start date'),
      reason: Yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters'),
      contact_details: Yup.string().required('Contact details are required').min(5, 'Contact details must be at least 5 characters')
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Prefer logged-in employee id
        const employeeId = user?.employee?.id ?? user?.id ?? null;

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
        formData.append('leave_type', values.leave_type);
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
              {/* Employee field hidden; using logged-in employee id */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Leave type"
                  name="leave_type"
                  value={formik.values.leave_type}
                  onChange={formik.handleChange}
                  error={formik.touched.leave_type && Boolean(formik.errors.leave_type)}
                  helperText={formik.touched.leave_type && formik.errors.leave_type}
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
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid2>

              {/* Reason and Contact Details - Row 3 */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Reason"
                  name="reason"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  error={formik.touched.reason && Boolean(formik.errors.reason)}
                  helperText={formik.touched.reason && formik.errors.reason}
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
              {/* omitted */}
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
