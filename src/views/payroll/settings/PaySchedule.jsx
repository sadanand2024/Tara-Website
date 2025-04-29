'use client';
import React, { useState, useEffect } from 'react';
import { Button, Card, Stack, Box, Typography, Grid2 } from '@mui/material';
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import MainCard from '../../../ui-component/cards/MainCard';
import Factory from 'utils/Factory';
import dayjs from 'dayjs';
import CustomDatePicker from 'utils/CustomDateInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
function PaySchedule() {
  const [payrollId, setPayrollId] = useState(null);
  const [weekOffSelection, setWeekOffSelection] = useState({
    SUN: false,
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: false,
    second_saturday: false,
    fourth_saturday: true,
    '2nd SAT': false,
    '4th SAT': false
  });

  const [dateValue, setDateValue] = useState(dayjs().format('DD-MM-YYYY'));
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pay_schedule_data, setPay_schedule_data] = useState(null);
  const [postType, setPostType] = useState('');

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
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

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const handleDaySelect = (day) => {
    setWeekOffSelection((prevSelection) => ({
      ...prevSelection,
      [day]: !prevSelection[day]
    }));
  };

  const postFetch = async () => {
    const selectedDays = Object.keys(weekOffSelection).filter((day) => weekOffSelection[day]);

    if (selectedDays.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select at least one day for your week off.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }
    if (!dateValue) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select a start month for the payroll.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }
    const postData = {
      payroll: payrollId,
      payroll_start_month: dateValue ? dayjs(dateValue).format('MMMM, YYYY') : ''
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
          message: res?.message || 'Something went wrong. Please try again.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const get_paySchedule_Details = async (id) => {
    const url = `/payroll/pay-schedules?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      const scheduleData = res?.data;
      if (scheduleData) {
        setDateValue(scheduleData?.payroll_start_month ? dayjs(scheduleData.payroll_start_month, 'MMMM, YYYY') : null);

        const updatedSelection = { ...weekOffSelection };

        weekOffOptions.forEach(({ short, full }) => {
          if (short === '2nd SAT') {
            updatedSelection['2nd SAT'] = scheduleData['second_saturday'] || false;
          } else if (short === '4th SAT') {
            updatedSelection['4th SAT'] = scheduleData['fourth_saturday'] || false;
          } else {
            updatedSelection[short] = scheduleData[full.toLowerCase()] || false;
          }
        });

        setWeekOffSelection(updatedSelection);
        setPay_schedule_data(scheduleData);
      }
      setPostType('put');
    } else {
      // Handle error if response is not successful
      // showSnackbar('Failed to fetch pay schedule details.', 'error');
      setPostType('post');
    }
  };

  useEffect(() => {
    if (payrollId) {
      get_paySchedule_Details(payrollId);
    }
  }, [payrollId]);

  return (
    <MainCard
      title="Pay Schedule"
      tagline="Setup your organization before starting payroll"
      secondary={<Stack direction="row" sx={{ gap: 2 }}></Stack>}
    >
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
                color: weekOffSelection[day.short] ? 'white' : 'inherit',
                backgroundColor: weekOffSelection[day.short] ? '#006397' : 'white'
              }}
              onClick={() => handleDaySelect(day.short)}
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
                views={['year', 'month', 'day']}
                value={dateValue ? dayjs(dateValue) : null}
                onChange={(newDate) => {
                  setDateValue(newDate.format('YYYY-MM-DD'));
                }}
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    fontSize: '0.75rem',
                    height: '40px'
                  }
                }}
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
          <Button variant="contained" onClick={postFetch}>
            Save
          </Button>
        </Box>
      </MainCard>
    </MainCard>
  );
}

export default PaySchedule;
