import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  LinearProgress,
  Button,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Factory from 'utils/Factory';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// MUI Icons for PAYROLL_STEPS
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BadgeIcon from '@mui/icons-material/Badge';
import GavelIcon from '@mui/icons-material/Gavel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventNoteIcon from '@mui/icons-material/EventNote';

// Import all the payroll settings components
import OrganizationDetails from './Organizationdetails';
import WorkLocation from './Worklocation';
import Departments from './Departments';
import Designations from './Designations';
import StatuitoryComponents from './StatuitoryComponents';
import SalaryComponents from './SalaryComponents';
import SalaryTemplateList from './SalaryTemplateList';
import EmployeeMaster from './EmployeeMasterData/Index';
import PaySchedule from './PaySchedule';
import LeaveAttendance from './LeaveAttendance';

const PAYROLL_STEPS = [
  {
    nameKey: 'Business profile',
    path: '/payroll/settings/organization-details',
    dataKey: 'organisation_details',
    component: OrganizationDetails,
    icon: BusinessIcon
  },
  {
    nameKey: 'Set up Work Location',
    path: '/payroll/settings/work-location',
    dataKey: 'work_locations',
    component: WorkLocation,
    icon: LocationOnIcon
  },
  {
    nameKey: 'Set up Departments',
    path: '/payroll/settings/departments',
    dataKey: 'departments',
    component: Departments,
    icon: AccountTreeIcon
  },
  {
    nameKey: 'Set up Designations',
    path: '/payroll/settings/designations',
    dataKey: 'designations',
    component: Designations,
    icon: BadgeIcon
  },
  {
    nameKey: 'Set up Statutory Components',
    path: '/payroll/settings/statutory-components',
    dataKey: 'statutory_component',
    component: StatuitoryComponents,
    icon: GavelIcon
  },
  {
    nameKey: 'Set up Salary Components',
    path: '/payroll/settings/salary-components',
    dataKey: 'salary_component',
    component: SalaryComponents,
    icon: AttachMoneyIcon
  },
  {
    nameKey: 'Set up Salary Template',
    path: '/payroll/settings/salary-template-list',
    dataKey: 'salary_template',
    component: SalaryTemplateList,
    icon: DescriptionIcon
  },
  {
    nameKey: 'Set up Employee Master',
    path: '/payroll/settings/employee-master',
    dataKey: 'employee_master',
    component: EmployeeMaster,
    icon: PeopleIcon
  },
  {
    nameKey: 'Set up Pay & Schedule',
    path: '/payroll/settings/pay-schedule',
    dataKey: 'pay_schedule',
    component: PaySchedule,
    icon: ScheduleIcon
  },
  {
    nameKey: 'Leave & Attendance',
    path: '/payroll/settings/leave-attendance',
    dataKey: 'leave_and_attendance',
    component: LeaveAttendance,
    icon: EventNoteIcon
  }
];

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

// Accessibility props for tabs
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const PayrollSettingsLayout = () => {
  const user = useSelector((state) => state.accountReducer?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const mode = theme.palette.mode;
  const borderRadius = 12;

  const [loading, setLoading] = useState(false);
  const [payrollDetails, setPayrollDetails] = useState({});
  const [steps, setSteps] = useState(PAYROLL_STEPS.map((step) => ({ ...step, completed: false })));
  const [markingComplete, setMarkingComplete] = useState(false);
  const [value, setValue] = useState(0);

  const businessId = user.active_context.business_id;
  const handleBack = () => {
    const prevIndex = value - 1;
    if (prevIndex >= 0) {
      const prevStep = steps[prevIndex];
      if (prevStep) {
        const routeBase = `${prevStep.path}`;
        if (!payrollDetails?.payroll_id && prevStep.nameKey === 'Business profile') {
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
      }
    }
  };
  const handleNext = () => {
    const nextIndex = value + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      if (nextStep) {
        const routeBase = `${nextStep.path}`;
        if (!payrollDetails?.payroll_id && nextStep.nameKey === 'Business profile') {
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
      }
    }
  };
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

  // Update active tab based on current location
  useEffect(() => {
    const currentStepIndex = steps.findIndex((step) => location.pathname === step.path);
    if (currentStepIndex !== -1) {
      setValue(currentStepIndex);
    }
  }, [location.pathname, steps]);

  const handleChange = useCallback(
    (event, newValue) => {
      const step = steps[newValue];
      if (!step) return;

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
    [navigate, payrollDetails, businessId, steps]
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
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '800px',
        overflow: 'hidden'
      }}
    >
      {/* Header at the top */}
      <CardHeader
        title="Payroll Settings"
        // subheader={
        //   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
        //     <LinearProgress
        //       variant="determinate"
        //       value={completionPercentage}
        //       sx={{
        //         width: 200,
        //         height: 8,
        //         borderRadius: 4,
        //         backgroundColor: '#f0f0f0',
        //         '& .MuiLinearProgress-bar': {
        //           borderRadius: 4,
        //           background: 'linear-gradient(45deg, #4A90E2 0%, #357ABD 100%)'
        //         }
        //       }}
        //     />
        //     <Typography variant="h5" sx={{ color: '#666' }}>
        //       {completionPercentage}% Complete
        //     </Typography>
        //   </Box>
        // }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/app/payroll')} size="small">
              Back to Dashboard
            </Button>
          </Box>
        }
      />
      <Divider />

      {/* Main content area: Tabs + TabPanels */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        {/* Tabs section */}
        <Tabs
          value={value}
          onChange={handleChange}
          orientation={isSmallScreen ? 'horizontal' : 'vertical'}
          variant="scrollable"
          sx={{
            minWidth: isSmallScreen ? '100%' : 300,
            borderRight: isSmallScreen ? 'none' : '1px solid',
            borderBottom: isSmallScreen ? '1px solid' : 'none',
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': {
              flexDirection: isSmallScreen ? 'row' : 'column'
            },
            '& button': {
              color: mode === 'dark' ? 'grey.600' : 'grey.900',
              minHeight: 'auto',
              minWidth: isSmallScreen ? 'auto' : '100%',
              py: 1.5,
              px: 1,
              mb: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 1,
              borderRadius: `${borderRadius}px`,
              mx: isSmallScreen ? 0.5 : 0,
              textAlign: 'left'
            },
            '& button.Mui-selected': {
              color: 'primary.main',
              bgcolor: mode === 'dark' ? 'dark.main' : 'primary.light'
            },
            '& button > svg': {
              height: 20,
              width: 20
            },
            '& > div > span': {
              display: 'none'
            },
            padding: 1,
            '& button:hover': {
              backgroundColor: 'primary.light'
            }
          }}
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Tab
                key={index}
                // icon={
                //   <Box
                //     sx={{
                //       width: 24,
                //       height: 24,
                //       borderRadius: '50%',
                //       backgroundColor: step.completed ? '#4CAF50' : value === index ? '#4A90E2' : '#E0E0E0',
                //       display: 'flex',
                //       alignItems: 'center',
                //       justifyContent: 'center',
                //       flexShrink: 0
                //     }}
                //   >
                //     {step.completed ? (
                //       <Typography variant="h6" sx={{ color: '#FFFFFF', fontSize: 18 }}>
                //         ✓
                //       </Typography>
                //     ) : (
                //       <Typography variant="h6" sx={{ color: '#FFFFFF', fontSize: 16 }}>
                //         {index + 1}
                //       </Typography>
                //     )}
                //   </Box>
                // }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, mt: 0.5 }}>
                    <Stack direction="row" spacing={2}>
                      <IconComponent color="primary" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }} noWrap>
                        {step.nameKey}
                      </Typography>
                    </Stack>
                    {step.dataKey === 'statutory_component' && !step.completed && (
                      <Box
                        component="span"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkStatutoryComplete();
                        }}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 'auto',
                          px: 1,
                          py: 0.25,
                          fontSize: '0.65rem',
                          height: 24,
                          border: '1px solid',
                          borderColor: 'primary.main',
                          borderRadius: 1,
                          color: 'primary.main',
                          cursor: markingComplete ? 'not-allowed' : 'pointer',
                          opacity: markingComplete ? 0.6 : 1,
                          '&:hover': {
                            backgroundColor: markingComplete ? 'transparent' : 'primary.main',
                            color: markingComplete ? 'primary.main' : 'white'
                          }
                        }}
                      >
                        {markingComplete ? <CircularProgress size={12} /> : 'Mark Complete'}
                      </Box>
                    )}
                  </Box>
                }
                {...a11yProps(index)}
              />
            );
          })}
        </Tabs>

        {/* TabPanels content section */}
        <Box sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}>
          <CardContent sx={{ p: 0 }}>
            <TabPanel value={value} index={0}>
              <OrganizationDetails handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <WorkLocation handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Departments handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Designations handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <StatuitoryComponents handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <SalaryComponents handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <SalaryTemplateList handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={7}>
              <EmployeeMaster handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={8}>
              <PaySchedule handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
            <TabPanel value={value} index={9}>
              <LeaveAttendance handleBack={handleBack} handleNext={handleNext} />
            </TabPanel>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default PayrollSettingsLayout;
