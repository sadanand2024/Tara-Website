import { useNavigate } from 'react-router-dom';
import { months } from 'utils/MonthsList';

import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useSelector } from 'react-redux';
import Factory from 'utils/Factory';
import { useState, useEffect } from 'react';
import CustomAutocomplete from 'utils/CustomAutocomplete';
// import { useSelector } from 'store';
import PayrollSummaryGrid from './PayrollSummaryGrid';
import { ServicesData } from './data';

// @project
import PayrollStatusSummary from './PayrollStatusSummary';
import PayrollComplianceSummary from './PayrollComplianceSummary';

import PayrollMonthwise from './PayrollMonthwise';
import { Button, Stack, Typography, Grid2, TextField, Chip, CircularProgress } from '@mui/material';
import { IconSparkles, IconSettings2 } from '@tabler/icons-react';

import { generateFinancialYears } from 'utils/FinancialYearsList';
import MainCard from '../../ui-component/cards/MainCard';
/***************************  ANALYTICS - OVERVIEW  ***************************/

const PayrollDashboard = () => {
  // const { userData } = useCurrentUser();
  const navigate = useNavigate();
  const user = useSelector((state) => state.accountReducer.user);
  const businessId = user.active_context.business_id;
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthWiseData, setMonthWiseData] = useState(null);

  // Separate loading states to prevent blinking
  const [initialLoading, setInitialLoading] = useState(true);
  const [monthDataLoading, setMonthDataLoading] = useState(false);
  const [salaryCalculationLoading, setSalaryCalculationLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const [businessDetails, setBusinessDetails] = useState({});
  const [financialYear, setFinancialYear] = useState(null);

  const financialYearOptions = generateFinancialYears();

  const get_payrollMonthData = async (monthNumber) => {
    if (!monthNumber) return;
    setMonthDataLoading(true);
    const url = `/payroll/payroll-summary-view?payroll_id=${businessDetails?.payroll_id}&month=${monthNumber}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setMonthDataLoading(false);
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

  const calculate_employee_monthly_salary_status = async (payrollId) => {
    setSalaryCalculationLoading(true);
    const url = `/payroll/calculate-employee-monthly-salary?payroll_id=${payrollId}&month=${selectedMonth}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      if (res.data?.message === 'Salary processing will be initiated between the 26th and 30th of the month.') {
        dispatch(
          openSnackbar({
            open: true,
            message: res.data.message,
            variant: 'alert',
            alert: { color: 'info' },
            close: false
          })
        );
        setMonthWiseData(null); // Clear the data to hide the component
      } else {
        // setMonthWiseData(res.data);
        get_payrollMonthData(selectedMonth);
      }
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.error) || 'An error occurred',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setSalaryCalculationLoading(false);
  };

  const getData = async (id) => {
    setInitialLoading(true);
    const url = `/payroll/payroll-setup-status?business_id=${id}`;
    const { res, error } = await Factory('get', url, {});

    if (res?.status_cd === 0) {
      if (res.data.payroll_setup === false) {
        navigate('/app/payroll/settings?payroll_setup=false');
        setInitialLoading(false);
      } else {
        setBusinessDetails(res?.data);
        setInitialLoading(false);
        // Don't call calculate_employee_monthly_salary_status here, let the useEffect handle it
      }
    } else {
      setBusinessDetails({});
      setInitialLoading(false);
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.error) || 'An error occurred',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const refreshEmployees_on_payroll = async () => {
    setRefreshLoading(true);
    const url = `/payroll/detail_employee_payroll_salary?payroll_id=${businessDetails?.payroll_id}&month=${selectedMonth}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 0) {
      get_payrollMonthData(selectedMonth);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Employees on your payroll have been refreshed',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.error) || 'An error occurred',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setRefreshLoading(false);
  };

  useEffect(() => {
    // if (user?.user?.registration_completed === 'False') {
    //   // navigate('/payrollsetup/payroll_business_profileSetup');
    //   navigate('/app/payroll/settings');
    // } else {
    //   getData(user.id);
    // }
    getData(businessId);
  }, [user.active_context]);

  useEffect(() => {
    const getCurrentFinancialYear = () => {
      const today = new Date();
      const month = today.getMonth() + 1; // 1-based month
      const year = today.getFullYear();

      const fyStart = month >= 4 ? year : year - 1; // April is the cutoff
      const fyEnd = fyStart + 1; // last 2 digits of next year

      // % 100
      return `${fyStart}-${String(fyEnd).padStart(2, '0')}`;
    };
    setFinancialYear(getCurrentFinancialYear());
  }, []);

  useEffect(() => {
    if (financialYear && businessDetails?.payroll_id && !initialLoading) {
      calculate_employee_monthly_salary_status(businessDetails.payroll_id);
    }
  }, [financialYear, businessDetails?.payroll_id, initialLoading]);

  // Show loading only during initial load
  if (initialLoading) {
    return (
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <MainCard
      title={`Payroll for ${businessDetails?.nameOfBusiness}`}
      secondary={
        <Stack direction="row" sx={{ gap: 2 }}>
          <CustomAutocomplete
            options={financialYearOptions}
            value={financialYear}
            onChange={(e, val) => {
              setFinancialYear(val);
            }}
            sx={{ minWidth: 200, maxWidth: 200 }}
            renderInput={(params) => <TextField {...params} placeholder="Select Financial Year" />}
          />

          <Button
            variant="contained"
            onClick={() => {
              navigate(`/payroll/settings/add-employee?payrollid=${businessDetails?.payroll_id}`);
            }}
            startIcon={<IconSparkles size={16} />}
          >
            Add Employee
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (businessDetails?.payroll_id) {
                navigate(`/app/payroll/settings?payrollid=${businessDetails.payroll_id}`);
              } else {
                navigate('/app/payroll/settings');
              }
            }}
            startIcon={<IconSettings2 size={18} />}
          >
            Payroll Settings
          </Button>
        </Stack>
      }
    >
      <Grid2 container spacing={{ xs: 2, md: 3 }}>
        <Grid2 size={{ xs: 12 }}>
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
                        size="small"
                        onClick={() => {
                          if (businessDetails?.payroll_id) {
                            navigate(
                              `/payroll/employee-dashboard?payrollid=${businessDetails?.payroll_id}&month=${selectedMonth}&financialYear=${financialYear}&monthwisedata=${encodeURIComponent(JSON.stringify(monthWiseData))}`
                            );
                          }
                        }}
                      >
                        Resume Payroll
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          refreshEmployees_on_payroll();
                        }}
                        disabled={refreshLoading}
                      >
                        {refreshLoading ? 'Refreshing...' : 'Refresh Employees on Your Payroll'}
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Show loading for month data */}
                {monthDataLoading ? (
                  <Stack alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Loading month data...
                    </Typography>
                  </Stack>
                ) : salaryCalculationLoading ? (
                  <Stack alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Calculating salary status...
                    </Typography>
                  </Stack>
                ) : monthWiseData ? (
                  <PayrollSummaryGrid data={monthWiseData} config={ServicesData} />
                ) : (
                  <Typography variant="h4" align="center" sx={{ mt: 4 }}>
                    Detailed salary calculations are available only between the 26th and 30th of each month. Please select a previous month
                    to view the details.
                  </Typography>
                )}
              </Stack>
            </MainCard>
          </Stack>
          {/* <PayrollMonthwise payrollId={businessDetails?.payroll_id} financialYear={financialYear} /> */}
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <PayrollStatusSummary
            payrollId={businessDetails?.payroll_id}
            financialYear={financialYear}
            monthWiseData={monthWiseData}
            selectedMonth={selectedMonth}
            businessDetails={businessDetails}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          {/* <PayrollComplianceSummary payrollId={businessDetails?.payroll_id} financialYear={financialYear} /> */}
        </Grid2>
      </Grid2>
    </MainCard>
  );
};
export default PayrollDashboard;
