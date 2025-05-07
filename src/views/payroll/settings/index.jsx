import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import MainCard from '../../../ui-component/cards/MainCard';
import { Box, Stack, Typography, LinearProgress, Button, Grid2, CircularProgress, IconButton } from '@mui/material';
import Factory from 'utils/Factory';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PAYROLL_STEPS = [
  { nameKey: 'Business profile', path: '/payroll/settings/organization-details', dataKey: 'organisation_details' },
  { nameKey: 'Set up Work Location', path: '/payroll/settings/work-location', dataKey: 'work_locations' },
  { nameKey: 'Set up Departments', path: '/payroll/settings/departments', dataKey: 'departments' },
  { nameKey: 'Set up Designations', path: '/payroll/settings/designations', dataKey: 'designations' },
  { nameKey: 'Set up Statutory Components', path: '/payroll/settings/statutory-components', dataKey: 'statutory_component' },
  { nameKey: 'Set up Salary Components', path: '/payroll/settings/salary-components', dataKey: 'salary_component' },
  { nameKey: 'Set up Salary Template', path: '/payroll/settings/salary-template-list', dataKey: 'salary_template' },
  { nameKey: 'Set up Employee Master', path: '/payroll/settings/employee-master', dataKey: 'employee_master' },
  { nameKey: 'Set up Pay & Schedule', path: '/payroll/settings/pay-schedule', dataKey: 'pay_schedule' },
  { nameKey: 'Leave & Attendance', path: '/payroll/settings/leave-attendance', dataKey: 'leave_and_attendance' }
];

const PayrollSetup = () => {
  const user = useSelector((state) => state.accountReducer?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse search params manually
  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params;
  }, [location.search]);

  const [loading, setLoading] = useState(false);
  const [payrollDetails, setPayrollDetails] = useState({});
  const [steps, setSteps] = useState(PAYROLL_STEPS.map((step) => ({ ...step, completed: false })));
  const [markingComplete, setMarkingComplete] = useState(false);

  const businessId = user.active_context.business_id;

  const hasFetched = React.useRef(false);

  const fetchPayrollDetails = useCallback(async () => {
    if (!businessId) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Business ID not found',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    setLoading(true);
    try {
      const url = `/payroll/business-payroll/${businessId}/`;
      const { res, error } = await Factory('get', url, {});

      if (error) {
        throw new Error(error);
      }

      if (res.status_cd === 0) {
        setPayrollDetails((prev) => ({ ...prev, ...res.data }));

        // Update steps completion status
        setSteps((prevSteps) =>
          prevSteps.map((step) => ({
            ...step,
            completed: res.data[step.dataKey] || false
          }))
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.data?.data || 'Failed to fetch payroll details',
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
          message: error.message || 'An error occurred while fetching payroll details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId && !hasFetched.current) {
      hasFetched.current = true;
      fetchPayrollDetails();
    }
  }, [businessId, fetchPayrollDetails]);

  const handleStepClick = useCallback(
    (step) => {
      const routeBase = `${step.path}`;

      if (!payrollDetails?.payroll_id && step.nameKey === 'Business profile') {
        navigate(`${routeBase}?business-id=${businessId}`);
      } else if (payrollDetails?.payroll_id) {
        navigate(`${routeBase}?payrollid=${payrollDetails.payroll_id}`);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Payroll ID not available. Please complete the previous steps first.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    },
    [navigate, payrollDetails, businessId]
  );

  const completionPercentage = useMemo(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  }, [steps]);

  // Handler for marking Statutory Components as complete
  const handleMarkStatutoryComplete = async () => {
    if (!payrollDetails?.payroll_id) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Payroll ID not available. Please complete the previous steps first.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }
    setMarkingComplete(true);
    try {
      // Example API endpoint, adjust as needed
      const url = `/payroll/orgs/${payrollDetails.payroll_id}/`;
      let payload = {
        statutory_component: true
      };
      const { res, error } = await Factory('put', url, payload);
      if (error || res.status_cd !== 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.data?.data || error || 'Failed to mark as complete',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      } else {
        // Update the step as completed
        setSteps((prevSteps) => prevSteps.map((step) => (step.dataKey === 'statutory_component' ? { ...step, completed: false } : step)));
        dispatch(
          openSnackbar({
            open: true,
            message: 'Marked as complete!',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        fetchPayrollDetails();
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'An error occurred',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" textAlign="center" sx={{ mb: 1 }}>
          Welcome {user.active_context.name}
        </Typography>
        <Typography variant="h4" textAlign="center" sx={{ color: 'text.disabled' }}>
          Set up your organization before starting payroll
        </Typography>
      </Box>

      <Grid2 container spacing={{ xs: 2, sm: 3 }}>
        <Grid2 size={12}>
          <MainCard
            sx={{
              maxWidth: 800,
              margin: '0 auto',
              padding: 0,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Box
              sx={{
                backgroundColor: '#4A90E2',
                borderRadius: 2,
                p: 2
              }}
            >
              <Stack direction="row" sx={{ position: 'relative', zIndex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 500, mb: 1 }}>
                    Get started with Payroll
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Complete the following steps to have a hassle-free payroll experience
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '200px' }}>
                  <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#fff'
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#fff', whiteSpace: 'nowrap' }}>
                    {completionPercentage}%{' '}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction="column" spacing={2} sx={{ p: 1 }}>
              {steps.map((step, index) => (
                <StepItem
                  key={step.path}
                  step={step}
                  index={index}
                  onClick={() => handleStepClick(step)}
                  onMarkStatutoryComplete={step.dataKey === 'statutory_component' ? handleMarkStatutoryComplete : undefined}
                  markingComplete={markingComplete && step.dataKey === 'statutory_component'}
                />
              ))}
            </Stack>
          </MainCard>
        </Grid2>
      </Grid2>
    </Box>
  );
};

const StepItem = React.memo(({ step, index, onClick, onMarkStatutoryComplete, markingComplete }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      p: 1,
      borderRadius: 2,
      backgroundColor: step.completed ? '#F9F9F9' : '#FFFFFF',
      boxShadow: step.completed ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: '#F1F1F1'
      }
    }}
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: step.completed ? '#4A90E2' : '#E0E0E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {step.completed && (
          <Typography variant="h6" sx={{ color: '#FFFFFF', fontSize: 16 }}>
            ✓
          </Typography>
        )}
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 500, color: step.completed ? '#7D7D7D' : '#4A4A4A' }}>
        {index + 1}. {step.nameKey}
      </Typography>
    </Stack>
    <Stack direction="row" spacing={1}>
      {step.completed ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            onClick={onClick}
            sx={{
              color: '#4CAF50',
              fontWeight: 500,
              border: '1px solid #4CAF50',
              pr: 0.5
            }}
            endIcon={
              <IconButton
                size="small"
                sx={{
                  color: '#4CAF50',
                  p: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                  }
                }}
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            }
          >
            Completed
          </Button>
        </Stack>
      ) : (
        <Button
          variant="outlined"
          sx={{
            color: '#4A90E2',
            fontWeight: 400,
            border: '1px solid #4A90E2'
          }}
          onClick={onClick}
        >
          Complete Now
        </Button>
      )}
      {/* Show Mark as Complete only for Statutory Components step when not completed */}
      {onMarkStatutoryComplete && !step.completed && (
        <Button variant="contained" onClick={onMarkStatutoryComplete} disabled={markingComplete}>
          {markingComplete ? <CircularProgress size={20} color="inherit" /> : 'Mark as Complete'}
        </Button>
      )}
    </Stack>
  </Stack>
));

StepItem.displayName = 'StepItem';

export default PayrollSetup;
