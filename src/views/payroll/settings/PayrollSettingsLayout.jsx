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
  useTheme,
  Chip,
  Autocomplete,
  TextField
} from '@mui/material';
import Factory from 'utils/Factory';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from 'ui-component/extended/SearchBar';

// Remove MUI Icons for PAYROLL_STEPS
// import BusinessIcon from '@mui/icons-material/Business';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import AccountTreeIcon from '@mui/icons-material/AccountTree';
// import BadgeIcon from '@mui/icons-material/Badge';
// import GavelIcon from '@mui/icons-material/Gavel';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import DescriptionIcon from '@mui/icons-material/Description';
// import PeopleIcon from '@mui/icons-material/People';
// import ScheduleIcon from '@mui/icons-material/Schedule';
// import EventNoteIcon from '@mui/icons-material/EventNote';
import {
  IconBuilding,
  IconMapPin,
  IconGitBranch,
  IconIdBadge,
  IconGavel,
  IconCurrencyDollar,
  IconFileDescription,
  IconUsers,
  IconCalendarTime,
  IconCalendarEvent
} from '@tabler/icons-react';

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
import SalaryTemplate from './SalaryTemplate';
import AddEmployee from './EmployeeMasterData/AddEmployee';

// Update PAYROLL_STEPS to use Tabler Icons
const PAYROLL_STEPS = [
  {
    nameKey: 'Business profile',
    path: '/app/payroll/settings/organization-details',
    dataKey: 'organisation_details',
    component: OrganizationDetails,
    icon: IconBuilding,
    title: 'Business Profile',
    // subtitle: 'Manage your business profile for invoice generation and business operations',
    secondaryAction: null
  },
  {
    nameKey: 'Set up Work Location',
    path: '/app/payroll/settings/work-location',
    dataKey: 'work_locations',
    component: WorkLocation,
    icon: IconMapPin,
    title: 'Work Locations',
    // subtitle: 'Manage your work locations for seamless operations',
    secondaryAction: 'workLocation' // Special identifier for work location actions
  },
  {
    nameKey: 'Set up Departments',
    path: '/app/payroll/settings/departments',
    dataKey: 'departments',
    component: Departments,
    icon: IconGitBranch,
    title: 'Departments',
    // subtitle: 'Manage your departments for seamless operations',
    secondaryAction: 'departments' // Special identifier for departments actions
  },
  {
    nameKey: 'Set up Designations',
    path: '/app/payroll/settings/designations',
    dataKey: 'designations',
    component: Designations,
    icon: IconIdBadge,
    title: 'Designations',
    // subtitle: 'Manage your designations',
    secondaryAction: 'designations' // Special identifier for designations actions
  },
  {
    nameKey: 'Set up Statutory Components',
    path: '/app/payroll/settings/statutory-components',
    dataKey: 'statutory_component',
    component: StatuitoryComponents,
    icon: IconGavel,
    title: 'Statutory Components',
    // subtitle: 'Manage statutory components',
    secondaryAction: null
  },
  {
    nameKey: 'Set up Salary Components',
    path: '/app/payroll/settings/salary-components',
    dataKey: 'salary_component',
    component: SalaryComponents,
    icon: IconCurrencyDollar,
    title: 'Salary Components',
    // subtitle: 'Manage your Salary Components for seamless operations',
    secondaryAction: 'salaryComponents' // Special identifier for salary components actions
  },
  {
    nameKey: 'Set up Salary Template',
    path: '/app/payroll/settings/salary-template-list',
    dataKey: 'salary_template',
    component: SalaryTemplateList,
    icon: IconFileDescription,
    title: 'Salary Templates',
    // subtitle: 'Manage your Salary Templates for seamless operations',
    secondaryAction: 'salaryTemplates' // Special identifier for salary templates actions
  },
  {
    nameKey: 'Set up Employee Master',
    path: '/app/payroll/settings/employee-master',
    dataKey: 'employee_master',
    component: EmployeeMaster,
    icon: IconUsers,
    title: 'Employee Master Data',
    // subtitle: 'Manage your Employee Master Data for seamless operations',
    secondaryAction: 'employeeMaster' // Special identifier for employee master actions
  },
  {
    nameKey: 'Set up Pay & Schedule',
    path: '/app/payroll/settings/pay-schedule',
    dataKey: 'pay_schedule',
    component: PaySchedule,
    icon: IconCalendarTime,
    title: 'Pay Schedule',
    // subtitle: 'Manage Pay Schedule seamless operations',
    secondaryAction: null
  },
  {
    nameKey: 'Leave & Attendance',
    path: '/app/payroll/settings/leave-attendance',
    dataKey: 'leave_and_attendance',
    component: LeaveAttendance,
    icon: IconCalendarEvent,
    title: 'Leave & Attendance',
    // subtitle: 'Manage Leave & Attendance for seamless operations',
    secondaryAction: 'leaveAttendance' // Special identifier for leave attendance actions
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

  // State for work location specific actions
  const [workLocationSearchQuery, setWorkLocationSearchQuery] = useState('');
  const [workLocationOpenDialog, setWorkLocationOpenDialog] = useState(false);

  // State for departments specific actions
  const [departmentsSearchQuery, setDepartmentsSearchQuery] = useState('');
  const [departmentsOpenDialog, setDepartmentsOpenDialog] = useState(false);
  const [departmentsBulkDialog, setDepartmentsBulkDialog] = useState(false);

  // State for designations specific actions
  const [designationsSearchQuery, setDesignationsSearchQuery] = useState('');
  const [designationsOpenDialog, setDesignationsOpenDialog] = useState(false);
  const [designationsBulkDialog, setDesignationsBulkDialog] = useState(false);

  // State for salary components specific actions
  const [salaryComponentsOpenDialog, setSalaryComponentsOpenDialog] = useState(false);
  const [salaryComponentsActiveTab, setSalaryComponentsActiveTab] = useState(0);

  // State for salary templates specific actions
  const [salaryTemplatesSearchQuery, setSalaryTemplatesSearchQuery] = useState('');

  // State for employee master specific actions
  const [employeeMasterSearchQuery, setEmployeeMasterSearchQuery] = useState('');
  const [employeeMasterOpenDialog, setEmployeeMasterOpenDialog] = useState(false);
  const [employeeMasterBulkDialog, setEmployeeMasterBulkDialog] = useState(false);

  // State for leave attendance specific actions
  const [leaveAttendanceActiveTab, setLeaveAttendanceActiveTab] = useState(0);
  const [leaveAttendanceLeaveType, setLeaveAttendanceLeaveType] = useState('All');

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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // or 'auto'
  }, [value]);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const currentStep = steps[value];
  const renderSecondaryAction = () => {
    if (currentStep?.secondaryAction === 'workLocation') {
      return (
        <Stack direction="row" spacing={2} alignItems="center">
          <SearchBar
            placeholder="Search work location..."
            value={workLocationSearchQuery}
            onChange={(e) => {
              setWorkLocationSearchQuery(e.target.value);
            }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setWorkLocationOpenDialog(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Add Work Location
          </Button>
        </Stack>
      );
    }

    if (currentStep?.secondaryAction === 'departments') {
      return (
        <Stack direction="row" spacing={2} alignItems="center">
          <SearchBar
            placeholder="Search department..."
            value={departmentsSearchQuery}
            onChange={(e) => {
              setDepartmentsSearchQuery(e.target.value);
            }}
          />
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => setDepartmentsBulkDialog(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Bulk Upload
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setDepartmentsOpenDialog(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Add Department
          </Button>
        </Stack>
      );
    }

    if (currentStep?.secondaryAction === 'designations') {
      return (
        <Stack direction="row" spacing={2} alignItems="center">
          <SearchBar
            placeholder="Search designation..."
            value={designationsSearchQuery}
            onChange={(e) => {
              setDesignationsSearchQuery(e.target.value);
            }}
          />
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => setDesignationsBulkDialog(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Bulk Upload
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setDesignationsOpenDialog(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Add Designation
          </Button>
        </Stack>
      );
    }

    if (currentStep?.secondaryAction === 'salaryComponents') {
      // Show Add Component button for both Earnings tab (index 0) and Deductions tab (index 1)
      if (salaryComponentsActiveTab === 0 || salaryComponentsActiveTab === 1) {
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setSalaryComponentsOpenDialog(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              Add Component
            </Button>
          </Stack>
        );
      }
      return null;
    }

    if (currentStep?.secondaryAction === 'salaryTemplates') {
      // Check if user is editing or creating a new template
      const params = new URLSearchParams(location.search);
      const action = params.get('action');
      const templateId = params.get('template_id');

      // Only show search and create button if not editing or creating
      if (!action && !templateId) {
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <SearchBar
              placeholder="Search template..."
              value={salaryTemplatesSearchQuery}
              onChange={(e) => {
                setSalaryTemplatesSearchQuery(e.target.value);
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                const params = new URLSearchParams(location.search);
                params.set('action', 'new');
                navigate({ search: params.toString() });
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              Create New Template
            </Button>
          </Stack>
        );
      }

      return null;
    }

    if (currentStep?.secondaryAction === 'employeeMaster') {
      // Check if user is editing or adding a new employee
      const params = new URLSearchParams(location.search);
      const action = params.get('action');
      const employeeId = params.get('employee_id');

      // Only show search and buttons if not editing or adding
      if (!action && !employeeId) {
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <SearchBar
              placeholder="Search employee..."
              value={employeeMasterSearchQuery}
              onChange={(e) => {
                setEmployeeMasterSearchQuery(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => setEmployeeMasterBulkDialog(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              Bulk Upload
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                const params = new URLSearchParams(location.search);
                params.set('action', 'add');
                navigate({ search: params.toString() });
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              Add Employee
            </Button>
          </Stack>
        );
      }

      return null;
    }

    if (currentStep?.secondaryAction === 'leaveAttendance') {
      return (
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Leave Type Filter for Leave Management tab */}
          {leaveAttendanceActiveTab === 1 && (
            <Autocomplete
              value={leaveAttendanceLeaveType}
              onChange={(_, val) => setLeaveAttendanceLeaveType(val)}
              options={['All', 'Paid', 'UnPaid']}
              sx={{ minWidth: 150 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="Leave Type" />}
            />
          )}
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              // Trigger add dialog for the current tab
              if (leaveAttendanceActiveTab === 0) {
                // Trigger holiday add dialog
                if (window.triggerHolidayAddDialog) {
                  window.triggerHolidayAddDialog();
                }
              } else {
                // Trigger leave add dialog
                if (window.triggerLeaveAddDialog) {
                  window.triggerLeaveAddDialog();
                }
              }
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            Add {leaveAttendanceActiveTab === 0 ? 'Holiday' : 'Leave'}
          </Button>
        </Stack>
      );
    }

    return null;
  };

  // Custom handleNext for Holiday Management tab
  const handleHolidayNext = () => {
    if (leaveAttendanceActiveTab === 0) {
      // If on Holiday Management tab, go to Leave Management tab
      handleNext();
    } else {
      // If on Leave Management tab, navigate to /app/payroll
      navigate('/app/payroll');
    }
  };

  // Custom handleBack for tab navigation
  const handleHolidayBack = () => {
    if (leaveAttendanceActiveTab === 1) {
      // If on Leave Management tab, go back to Holiday Management tab
      handleBack();
    } else {
      // If on Holiday Management tab, use the original handleBack
      handleBack();
    }
  };

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
      {/* Main content area: Tabs + TabPanels */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        {/* Left Sidebar with Settings Title and Tabs */}
        <Box
          sx={{
            width: isSmallScreen ? '100%' : 300,
            borderRight: isSmallScreen ? 'none' : '1px solid',
            borderBottom: isSmallScreen ? '1px solid' : 'none',
            borderColor: 'divider',
            backgroundColor: mode === 'dark' ? 'background.default' : 'grey.50',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Settings Title */}
          <Box
            sx={{
              p: 2.5
              // borderBottom: '1px solid', borderColor: 'divider'
            }}
          >
            <Typography variant="h4" color="text.primary">
              Payroll Settings
            </Typography>
          </Box>

          {/* Tabs section */}
          <Tabs
            value={value}
            onChange={handleChange}
            orientation={isSmallScreen ? 'horizontal' : 'vertical'}
            variant="scrollable"
            sx={{
              flexGrow: 1,
              '& .MuiTabs-flexContainer': {
                flexDirection: isSmallScreen ? 'row' : 'column'
              },
              '& button': {
                color: mode === 'dark' ? 'grey.600' : 'grey.900',
                minHeight: 'auto',
                minWidth: isSmallScreen ? 'auto' : '100%',
                py: 1,
                px: 1,
                mb: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1,
                borderRadius: `${borderRadius}px`,
                mx: isSmallScreen ? 0.5 : 0,
                textAlign: 'left',
                whiteSpace: 'nowrap'
              },
              '& button.Mui-selected': {
                color: 'primary.main',
                bgcolor: mode === 'dark' ? 'dark.main' : 'primary.light'
              },
              '& button > svg': {
                height: 18,
                width: 18
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
                  icon={IconComponent ? <IconComponent /> : null}
                  sx={{
                    mt: 0.2,
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'primary.light'
                    }
                  }}
                  label={step.nameKey}
                  {...a11yProps(index)}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Right Panel with Current Step Header and Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Current Step Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" fontWeight={600} color="text.primary">
                  {currentStep?.title || 'Payroll Settings'}
                </Typography>
                {/* <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  {currentStep?.subtitle}
                </Typography> */}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {renderSecondaryAction()}
                <Button
                  startIcon={<ArrowBackIcon />}
                  variant="outlined"
                  onClick={() => navigate('/app/payroll')}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </Box>
          </Box>

          {/* TabPanels content section */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <TabPanel value={value} index={0}>
                <OrganizationDetails
                  handleBack={handleBack}
                  handleNext={handleNext}
                  searchQuery={workLocationSearchQuery}
                  openDialog={workLocationOpenDialog}
                  setOpenDialog={setWorkLocationOpenDialog}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <WorkLocation
                  handleBack={handleBack}
                  handleNext={handleNext}
                  searchQuery={workLocationSearchQuery}
                  openDialog={workLocationOpenDialog}
                  setOpenDialog={setWorkLocationOpenDialog}
                />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Departments
                  handleBack={handleBack}
                  handleNext={handleNext}
                  searchQuery={departmentsSearchQuery}
                  openDialog={departmentsOpenDialog}
                  setOpenDialog={setDepartmentsOpenDialog}
                  openBulkDialog={departmentsBulkDialog}
                  setOpenBulkDialog={setDepartmentsBulkDialog}
                />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Designations
                  handleBack={handleBack}
                  handleNext={handleNext}
                  searchQuery={designationsSearchQuery}
                  openDialog={designationsOpenDialog}
                  setOpenDialog={setDesignationsOpenDialog}
                  openBulkDialog={designationsBulkDialog}
                  setOpenBulkDialog={setDesignationsBulkDialog}
                />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <StatuitoryComponents handleBackTab={handleBack} handleNextTab={handleNext} />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <SalaryComponents
                  handleBack={handleBack}
                  handleNext={handleNext}
                  openDialog={salaryComponentsOpenDialog}
                  setOpenDialog={setSalaryComponentsOpenDialog}
                  activeTab={salaryComponentsActiveTab}
                  setActiveTab={setSalaryComponentsActiveTab}
                />
              </TabPanel>
              <TabPanel value={value} index={6}>
                {/* Conditional rendering for create/edit form */}
                {(() => {
                  const params = new URLSearchParams(location.search);
                  const action = params.get('action');
                  const templateId = params.get('template_id');
                  if (action === 'new' || templateId) {
                    return <SalaryTemplate />;
                  }
                  return <SalaryTemplateList handleBack={handleBack} handleNext={handleNext} searchQuery={salaryTemplatesSearchQuery} />;
                })()}
              </TabPanel>
              <TabPanel value={value} index={7}>
                {/* Conditional rendering for add/edit employee */}
                {(() => {
                  const params = new URLSearchParams(location.search);
                  const action = params.get('action');
                  const employeeId = params.get('employee_id');
                  if (action === 'add' || employeeId) {
                    return <AddEmployee />;
                  }
                  return (
                    <EmployeeMaster
                      handleBack={handleBack}
                      handleNext={handleNext}
                      searchQuery={employeeMasterSearchQuery}
                      openDialog={employeeMasterOpenDialog}
                      setOpenDialog={setEmployeeMasterOpenDialog}
                      openBulkDialog={employeeMasterBulkDialog}
                      setOpenBulkDialog={setEmployeeMasterBulkDialog}
                    />
                  );
                })()}
              </TabPanel>
              <TabPanel value={value} index={8}>
                <PaySchedule handleBack={handleBack} handleNext={handleNext} />
              </TabPanel>
              <TabPanel value={value} index={9}>
                <LeaveAttendance
                  handleBack={handleHolidayBack}
                  handleNext={handleHolidayNext}
                  activeTab={leaveAttendanceActiveTab}
                  setActiveTab={setLeaveAttendanceActiveTab}
                  leaveType={leaveAttendanceLeaveType}
                  setLeaveType={setLeaveAttendanceLeaveType}
                  onAddHoliday={() => {}}
                  onAddLeave={() => {}}
                />
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default PayrollSettingsLayout;
