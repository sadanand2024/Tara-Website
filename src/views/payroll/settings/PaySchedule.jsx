import React, { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Typography, Grid2, TextField } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Factory from 'utils/Factory';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'ui-component/extended/Modal';

function PaySchedule({ handleBack, handleNext }) {
  const [payrollId, setPayrollId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pay_schedule_data, setPay_schedule_data] = useState(null);
  const [postType, setPostType] = useState('');
  const weekOffOptions = [
    { short: 'SUN', full: 'Sunday' },
    { short: 'MON', full: 'Monday' },
    { short: 'TUE', full: 'Tuesday' },
    { short: 'WED', full: 'Wednesday' },
    { short: 'THU', full: 'Thursday' },
    { short: 'FRI', full: 'Friday' },
    { short: 'SAT', full: 'Saturday' },
    { short: '2nd SAT', full: '2nd Saturday' },
    { short: '4th SAT', full: '4th Saturday' }
  ];

  const formik = useFormik({
    initialValues: {
      payroll_start_month: null,
      weekOff: {
        SUN: false,
        MON: false,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        second_saturday: false,
        fourth_saturday: false,
        '2nd SAT': false,
        '4th SAT': false
      }
    },
    validationSchema: Yup.object({
      payroll_start_month: Yup.mixed().when('weekOff', {
        is: (weekOff) => Object.values(weekOff).some((day) => day === true),
        then: (schema) =>
          schema.test('is-valid-date', 'Payroll start month is required when week off is selected', function (value) {
            return value && dayjs(value).isValid();
          }),
        otherwise: (schema) => schema.nullable()
      }),
      weekOff: Yup.object().nullable()
    }),
    onSubmit: async (values) => {
      const selectedDays = Object.keys(values.weekOff).filter((day) => values.weekOff[day]);

      if (selectedDays.length === 0) {
        setFormData(values);
        setOpenConfirmDialog(true);
        return;
      }
      await submitForm(values);
    }
  });

  const submitForm = async (values) => {
    const selectedDays = Object.keys(values.weekOff).filter((day) => values.weekOff[day]);

    // Convert the dayjs object to the required format for API
    let formattedDate = '';
    if (values.payroll_start_month && dayjs(values.payroll_start_month).isValid()) {
      formattedDate = dayjs(values.payroll_start_month).format('MMMM, YYYY');
    }

    const postData = {
      payroll: payrollId,
      payroll_start_month: formattedDate
    };

    const dayMapping = {
      SUN: 'sunday',
      MON: 'monday',
      TUE: 'tuesday',
      WED: 'wednesday',
      THU: 'thursday',
      FRI: 'friday',
      SAT: 'saturday',
      '2nd SAT': 'second_saturday',
      '4th SAT': 'fourth_saturday'
    };

    // For PUT requests, explicitly set all days to false first
    if (postType === 'put') {
      Object.values(dayMapping).forEach((day) => {
        postData[day] = false;
      });
    }

    // Then set selected days to true
    selectedDays.forEach((day) => {
      postData[dayMapping[day]] = true;
    });

    const url = postType === 'put' ? `/payroll/pay-schedules/${pay_schedule_data.id}` : `/payroll/pay-schedules`;
    const { res, error } = await Factory(postType, url, postData);

    if (res?.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: postType === 'put' ? 'Data Updated successfully!' : 'Data saved successfully!',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data) || 'Something went wrong. Please try again.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const handleConfirmSubmit = () => {
    setOpenConfirmDialog(false);
    submitForm(formData);
  };

  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const get_paySchedule_Details = async (id) => {
    const url = `/payroll/pay-schedules?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      const scheduleData = res?.data;
      if (scheduleData) {
        // Convert the date string to a dayjs object for DatePicker
        let monthValue = null;
        if (scheduleData?.payroll_start_month) {
          // Parse the date string and convert to dayjs object
          const parsedDate = dayjs(scheduleData.payroll_start_month, 'MMMM, YYYY');
          if (parsedDate.isValid()) {
            monthValue = parsedDate;
          }
        }

        setValues({
          payroll_start_month: monthValue,
          weekOff: {
            SUN: scheduleData.sunday || false,
            MON: scheduleData.monday || false,
            TUE: scheduleData.tuesday || false,
            WED: scheduleData.wednesday || false,
            THU: scheduleData.thursday || false,
            FRI: scheduleData.friday || false,
            SAT: scheduleData.saturday || false,
            '2nd SAT': scheduleData.second_saturday || false,
            '4th SAT': scheduleData.fourth_saturday || false,
            second_saturday: scheduleData.second_saturday || false,
            fourth_saturday: scheduleData.fourth_saturday || false
          }
        });
        setPay_schedule_data(scheduleData);
      }
      setPostType('put');
    } else {
      setPostType('post');
    }
  };

  useEffect(() => {
    if (payrollId) {
      get_paySchedule_Details(payrollId);
    }
  }, [payrollId]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5">Select your week off</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Choose your week off days from the calendar
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {weekOffOptions.map((day) => (
              <Card
                key={day.short}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: values.weekOff[day.short] ? '2px solid' : '1px solid',
                  borderColor: values.weekOff[day.short] ? 'primary.main' : 'divider',
                  backgroundColor: values.weekOff[day.short] ? 'primary.light' : 'background.paper',
                  minWidth: 120,
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light'
                  }
                }}
                onClick={() => setFieldValue(`weekOff.${day.short}`, !values.weekOff[day.short])}
              >
                <Typography variant="h6" fontWeight="bold" color={values.weekOff[day.short] ? 'primary.main' : 'text.primary'}>
                  {day.short}
                </Typography>
                <Typography variant="body2" color={values.weekOff[day.short] ? 'primary.main' : 'text.secondary'}>
                  {day.full}
                </Typography>
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Start your first payroll from
            </Typography>
            <DatePicker
              views={['month', 'year']}
              value={values.payroll_start_month}
              onChange={(newValue) => setFieldValue('payroll_start_month', newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  error: touched.payroll_start_month && Boolean(errors.payroll_start_month),
                  helperText: touched.payroll_start_month && errors.payroll_start_month,
                  sx: { width: '300px' }
                }
              }}
            />
          </Box>

          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
            <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={() => handleSubmit(values)}>
                Save
              </Button>
              <Button type="button" variant="contained" onClick={() => handleNext()}>
                Next
              </Button>
            </Box>
          </Stack>
        </form>

        <Modal
          open={openConfirmDialog}
          handleClose={() => setOpenConfirmDialog(false)}
          title="Confirm Submission"
          footer={
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => setOpenConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleConfirmSubmit}>
                Confirm
              </Button>
            </Stack>
          }
        >
          <Typography>Are you sure you want to submit without selecting any week off days?</Typography>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}

export default PaySchedule;
