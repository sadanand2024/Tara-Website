import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { months } from 'utils/MonthsList';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import { ServicesData } from './data';
import Factory from 'utils/Factory';
import { Box, Button, Paper, Divider, Chip, Typography } from '@mui/material';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import MainCard from '../../ui-component/cards/MainCard';
import PayrollSummaryGrid from './PayrollSummaryGrid';
export default function PayrollMonthwise({ payrollId, financialYear }) {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthWiseData, setMonthWiseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleMonthChange = (event, newValue) => {
    if (!newValue || newValue === 'Please select') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select a month',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    const monthIndex = months.indexOf(newValue); // 0-based index
    setSelectedMonth(monthIndex + 1); // Store 1-based month number

    get_payrollMonthData(monthIndex + 1); // API expects 1-based month number
  };
  const detail_employee_payroll_salary = async (monthNumber) => {
    if (!monthNumber) return;
    setLoading(true);
    const url = `/payroll/detail_employee_payroll_salary?payroll_id=${payrollId}&month=${monthNumber}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    console.log(res);
    // if (res?.status_cd === 0) {
    //   setMonthWiseData(res.data);
    // } else {
    //   dispatch(
    //     openSnackbar({
    //       open: true,
    //       message: JSON.stringify(res?.data?.error),
    //       variant: 'alert',
    //       alert: { color: 'error' },
    //       close: false
    //     })
    //   );
    // }
  };
  const get_payrollMonthData = async (monthNumber) => {
    if (!monthNumber) return;
    setLoading(true);
    const url = `/payroll/payroll-summary-view?payroll_id=${payrollId}&month=${monthNumber}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setMonthWiseData(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  useEffect(() => {
    if (payrollId && financialYear) {
      get_payrollMonthData(selectedMonth); // JS Date month is 0-indexed
      // detail_employee_payroll_salary(selectedMonth); // JS Date month is 0-indexed
    }
  }, [payrollId, financialYear]);
  return (
    <Stack sx={{ gap: 4 }}>
      <MainCard>
        <Stack sx={{ gap: 3 }}>
          <Stack direction="row" sx={{ gap: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                Payroll for the Month of
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <CustomAutocomplete
                  value={months[selectedMonth - 1]}
                  onChange={handleMonthChange}
                  options={['Please select', ...months]}
                  placeholder="Select Month"
                  size="small"
                  sx={{
                    minWidth: 180,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      backgroundColor: 'background.paper'
                    }
                  }}
                />

                <Chip variant="outlined" label="In Progress" color="warning" sx={{ fontWeight: 500 }} />

                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => {
                    if (payrollId) {
                      navigate(`/payroll/employee-dashboard?payrollid=${payrollId}&month=${selectedMonth}&financialYear=${financialYear}`);
                    }
                  }}
                >
                  Resume Payroll
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <PayrollSummaryGrid data={monthWiseData} config={ServicesData} />
        </Stack>
      </MainCard>
    </Stack>
  );
}
