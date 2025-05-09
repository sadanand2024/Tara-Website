import React, { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Typography, Grid2 } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MainCard from '../../../ui-component/cards/MainCard';
import Factory from 'utils/Factory';
import dayjs from 'dayjs';
import CustomDatePicker from 'utils/CustomDateInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'ui-component/extended/Modal';

function PaySchedule() {
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
      payroll_start_month: '',
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

    const postData = {
      payroll: payrollId,
      payroll_start_month:
        values.payroll_start_month && dayjs(values.payroll_start_month).isValid()
          ? dayjs(values.payroll_start_month).format('MMMM, YYYY')
          : ''
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
      navigate(-1);
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
        setValues({
          payroll_start_month: scheduleData?.payroll_start_month ? dayjs(scheduleData.payroll_start_month, 'MMMM, YYYY') : '',
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
  console.log(errors);
  return (
    <MainCard
      title="Pay Schedule"
      tagline="Setup your organization before starting payroll"
      secondary={<Stack direction="row" sx={{ gap: 2 }}></Stack>}
    >
      <form onSubmit={handleSubmit}>
        <MainCard sx={{ padding: 2 }}>
          <Typography variant="h4">Select your week off</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Choose your week off days from the calendar
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {weekOffOptions.map((day) => (
              <Card
                key={day.short}
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                  cursor: 'pointer',
                  color: values.weekOff[day.short] ? 'white' : 'inherit',
                  backgroundColor: values.weekOff[day.short] ? '#006397' : 'white'
                }}
                onClick={() => {
                  setFieldValue(`weekOff.${day.short}`, !values.weekOff[day.short]);
                }}
              >
                <Typography>{day.full}</Typography>
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 5 }}>
            <Typography mb={1}>Start your first payroll from</Typography>
            <Grid2 container>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <CustomDatePicker
                  name="payroll_start_month"
                  value={values.payroll_start_month}
                  onChange={(newDate) => {
                    setFieldValue('payroll_start_month', newDate || null);
                  }}
                  onBlur={handleBlur}
                  error={touched.payroll_start_month && Boolean(errors.payroll_start_month)}
                  helperText={touched.payroll_start_month && errors.payroll_start_month}
                />
              </Grid2>
            </Grid2>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                navigate(-1);
              }}
            >
              Back to Dashboard
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </MainCard>
      </form>

      <Modal
        open={openConfirmDialog}
        maxWidth={'sm'}
        title="Confirm Submission"
        showClose={true}
        handleClose={() => {
          resetForm();
          setOpenConfirmDialog(false); // Reset form and close dialog
        }}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button
              onClick={() => {
                resetForm();
                setOpenConfirmDialog(false); // Reset form and close dialog
              }}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Stack>
        }
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
          <Grid2 container spacing={3}>
            <Typography variant="body1">You haven't selected any week off days. Are you sure you want to proceed?</Typography>
          </Grid2>
        </Box>
      </Modal>
    </MainCard>
  );
}

export default PaySchedule;
