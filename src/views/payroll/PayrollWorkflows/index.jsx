import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CoPresentOutlined from '@mui/icons-material/CoPresentOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Avatar, Box, Button, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import SearchBar from 'ui-component/extended/SearchBar';
import Factory from 'utils/Factory';
import MainCard from '../../../ui-component/cards/MainCard';
import AdhocBonus from './AdhocBonus';
import Attendance from './Attendance';
import BonusAndIncentives from './BonusAndIncentives';
import Exits from './Exits';
import LoansAndAdvances from './LoansAndAdvances';
import NewJoiners from './NewJoiners';
import SalaryRevisions from './SalaryRevisions';
import Tds from './Tds';
// TabPanel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
    {value === index && <Box sx={{ pt: 0 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const PayrollWorkflows = ({ type }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employeeMasterData, setEmployeeMasterData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [exitsData, setExitsData] = useState([]);
  const [loansData, setLoansData] = useState([]);
  const [bonusData, setBonusData] = useState([]);
  const [adhocBonusData, setAdhocBonusData] = useState([]);
  const [salaryRevisionData, setSalaryRevisionData] = useState([]);
  const [tdsData, setTdsData] = useState([]);
  const dispatch = useDispatch();
  const payrollId = searchParams.get('payrollid');
  const month = searchParams.get('month');
  const financialYear = searchParams.get('financial_year');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch functions for each tab
  const fetchEmployeeMasterData = async () => {
    setLoading(true);
    const url = `/payroll/employees?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setEmployeeMasterData(res.data);
    } else {
      setEmployeeMasterData([]);
    }
  };

  const refreshEmployees_on_payroll = async () => {
    if (!payrollId || !financialYear || !month) return;
    const url = `/payroll/detail_employee_payroll_salary?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 0) {
      if (res.data.message === 'Salary processing will be initiated between the 26th and 30th of the month.') {
        dispatch(
          openSnackbar({
            open: true,
            message: res.data.message,
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        return;
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
  };
  const getAttandanceData = async () => {
    if (!payrollId || !financialYear || !month) return;
    setLoading(true);
    const url = `/payroll/employee_attendance_filtered?payroll_id=${payrollId}&financial_year=${financialYear}&month=${month}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setAttendanceData(res.data || []);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.message),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const generateAttandance = async () => {
    if (!payrollId || !financialYear || !month) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select payroll ID, financial year, and month',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }
    setLoading(true);
    const url = `/payroll/employee_attendance_current_month_automate?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;
    const { res } = await Factory('post', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Attendance generated successfully!',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      // Refresh attendance data after generation
      getAttandanceData();
      // refreshEmployees_on_payroll();
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: res?.data?.message || res?.data?.data || res?.message || 'Failed to generate attendance',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const fetchExitsData = async () => {
    setLoading(true);
    const url = `/payroll/payroll-exit-settlement?payroll_id=${payrollId}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setExitsData(res.data || []);
    } else {
      setExitsData([]);
    }
  };

  const fetchLoansData = async () => {
    setLoading(true);
    const url = `/payroll/payroll-advance-summary?payroll_id=${payrollId}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setLoansData(res.data || []);
    } else {
      setLoansData([]);
    }
  };

  const fetchBonusData = async () => {
    setLoading(true);
    const url = `/payroll/bonus-incentives/by-payroll-month?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}&type=variable`;

    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setBonusData(res.data || []);
    } else {
      setBonusData([]);
    }
  };
  const getMonthName = (monthNum) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const index = parseInt(monthNum, 10) - 1;
    return monthNames[index] || '';
  };

  const fetchAdhocBonusData = async () => {
    setLoading(true);
    const url = `/payroll/bonus-incentives/by-payroll-month?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}&type=adhoc`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setAdhocBonusData(res.data || []);
    } else {
      setAdhocBonusData([]);
    }
  };

  const fetchSalaryRevisionData = async () => {
    setLoading(true);
    const year = financialYear ? financialYear.split('-')[0] : '';
    const url = `/payroll/salary-revision?payroll_id=${payrollId}&month=${month}&year=${year}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setSalaryRevisionData(res.data || []);
    } else {
      setSalaryRevisionData([]);
    }
  };

  const fetchTdsData = async () => {
    setLoading(true);
    const url = `/payroll/employee-tds?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setTdsData(res.data || []);
    } else {
      setTdsData([]);
    }
  };

  // Fetch data when tab or dependencies change
  useEffect(() => {
    if (!payrollId) return;
    if (activeTab === 0) fetchEmployeeMasterData();
    else if (activeTab === 1) fetchExitsData();
    else if (activeTab === 2) getAttandanceData();
    else if (activeTab === 3) fetchLoansData();
    else if (activeTab === 4) fetchBonusData();
    else if (activeTab === 5) fetchAdhocBonusData();
    else if (activeTab === 6) fetchSalaryRevisionData();
    else if (activeTab === 7) fetchTdsData();
    // eslint-disable-next-line
  }, [activeTab, payrollId, month, financialYear]);

  // Tab Configuration
  const tabs = useMemo(
    () => [
      { label: 'New Joiners', component: NewJoiners, fields: [] },
      {
        label: 'Exits',
        component: Exits,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'department', label: 'Department' },
          { name: 'designation', label: 'Designation' },
          { name: 'doe', label: 'Exit Date' },
          { name: 'exit_reason', label: 'Reason for Exit' },
          { name: 'notes', label: 'Notes' }
        ]
      },
      {
        label: 'Attendance',
        component: Attendance,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'financial_year', label: 'Financial Year' },
          { name: 'month', label: 'Month' },
          { name: 'total_days_of_month', label: 'Total Days of Month' },
          { name: 'holidays', label: 'Holidays' },
          { name: 'week_offs', label: 'Week Offs' },
          { name: 'present_days', label: 'Present Days' },
          { name: 'balance_days', label: 'Balance Days' },
          { name: 'casual_leaves', label: 'Casual Leaves' },
          { name: 'sick_leaves', label: 'Sick Leaves' },
          { name: 'earned_leaves', label: 'Earned Leaves' },
          { name: 'loss_of_pay', label: 'Loss of Pay' }
        ]
      },
      {
        label: 'Loans & Advances',
        component: LoansAndAdvances,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'department', label: 'Department' },
          { name: 'designation', label: 'Designation' },
          { name: 'loan_type', label: 'Loan Type' },
          { name: 'amount', label: 'Amount' },
          { name: 'no_of_months', label: 'No of Months' },
          { name: 'start_month', label: 'Start Month' }
        ]
      },
      {
        label: 'Variable Bonus',
        component: BonusAndIncentives,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'department', label: 'Department' },
          { name: 'designation', label: 'Designation' },
          { name: 'bonus_type', label: 'Bonus Type' },
          { name: 'amount', label: 'Amount' },
          { name: 'month', label: 'Month' },
          { name: 'financial_year', label: 'Financial Year' }
        ]
      },
      {
        label: 'Adhoc Bonus & Incentives',
        component: AdhocBonus,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'department', label: 'Department' },
          { name: 'designation', label: 'Designation' },
          { name: 'bonus_type', label: 'Bonus Type' },
          { name: 'amount', label: 'Amount' },
          { name: 'month', label: 'Month' },
          { name: 'financial_year', label: 'Financial Year' }
        ]
      },
      {
        label: 'Salary Revisions',
        component: SalaryRevisions,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'department', label: 'Department' },
          { name: 'designation', label: 'Designation' },
          { name: 'current_ctc', label: 'Current CTC' },
          { name: 'last_revision', label: 'Last Revision' },
          { name: 'revised_ctc', label: 'Revised CTC' }
        ]
      },
      {
        label: 'Tds',
        component: Tds,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'pan', label: 'Pan' },
          { name: 'regime', label: 'Regime' },
          { name: 'annual_tds', label: 'Annual Est' },
          // { name: 'annual_tax_libility', label: 'Annual Tax Libility' },
          { name: 'tds', label: 'TDS(Month)' },
          { name: 'tds_ytd', label: 'TDS YTD' }
        ]
      }
      // { label: 'Other Deductions', component: OtherDeductions, fields: [] }
    ],
    []
  );

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const handleButtonClick = () => {
    if (tabs[activeTab].label === 'Attendance') {
      generateAttandance();
    } else if (tabs[activeTab].label === 'New Joiners') {
      // navigate(`/app/payroll/settings/add-employee?payrollid=${payrollId}`);
      navigate(`/app/payroll/settings/employee-master?payrollid=${payrollId}&action=add&tabValue=0`);
    } else {
      setOpenDialog(true);
    }
  };

  const renderButtonLabel = () => (tabs[activeTab].label === 'Attendance' ? 'Generate Attendance' : `Add ${tabs[activeTab].label}`);
  useEffect(() => {
    const tabValue = searchParams.get('tabValue');
    if (tabValue) setActiveTab(Number(tabValue));
  }, [searchParams]);
  useEffect(() => {
    if (payrollId) {
      fetchEmployeeMasterData();
    }
  }, [payrollId]);

  const tabIcons = [
    PersonAddIcon, // New Joiners
    LogoutIcon, // Exits
    CoPresentOutlined, // Attendance
    AccountBalanceWalletIcon, // Loans & Advances
    EmojiEventsIcon, // Variable Bonus
    EmojiEventsIcon, // Adhoc Bonus & Incentives
    TrendingUpIcon, // Salary Revisions
    RemoveCircleOutlineIcon // TDS
  ];

  // Filtering logic for each tab
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();
    const tabLabel = tabs[activeTab].label;
    if (tabLabel === 'New Joiners') {
      return employeeMasterData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.first_name || '').toLowerCase().includes(query) ||
          (item.last_name || '').toLowerCase().includes(query) ||
          (item.department_name || '').toLowerCase().includes(query) ||
          (item.designation_name || '').toLowerCase().includes(query)
      );
    } else if (tabLabel === 'Attendance') {
      return attendanceData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.employee_name || '').toLowerCase().includes(query) ||
          (item.department || '').toLowerCase().includes(query) ||
          (item.designation || '').toLowerCase().includes(query)
      );
    } else if (tabLabel === 'Exits') {
      return exitsData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.employee_name || '').toLowerCase().includes(query) ||
          (item.department || '').toLowerCase().includes(query) ||
          (item.designation || '').toLowerCase().includes(query) ||
          (item.exit_date || '').toLowerCase().includes(query)
      );
    } else if (tabLabel === 'Loans & Advances') {
      return loansData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.employee_name || '').toLowerCase().includes(query) ||
          (item.department || '').toLowerCase().includes(query) ||
          (item.designation || '').toLowerCase().includes(query) ||
          (item.loan_type || '').toLowerCase().includes(query)
      );
    } else if (tabLabel === 'Variable Bonus') {
      return bonusData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.employee_name || '').toLowerCase().includes(query) ||
          (item.department || '').toLowerCase().includes(query) ||
          (item.designation || '').toLowerCase().includes(query) ||
          (item.bonus_type || '').toLowerCase().includes(query)
      );
    } else if (tabLabel === 'Adhoc Bonus & Incentives') {
      return adhocBonusData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.employee_name || '').toLowerCase().includes(query) ||
          (item.department || '').toLowerCase().includes(query) ||
          (item.designation || '').toLowerCase().includes(query) ||
          (item.type || '').toLowerCase().includes(query)
      );
    } else if (tabLabel === 'Salary Revisions') {
      return salaryRevisionData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.employee_name || '').toLowerCase().includes(query) ||
          (item.department || '').toLowerCase().includes(query) ||
          (item.designation || '').toLowerCase().includes(query)
      );
    } else if (tabLabel === 'Tds') {
      return tdsData.filter(
        (item) =>
          (item.associate_id || '').toLowerCase().includes(query) ||
          (item.employee_name || '').toLowerCase().includes(query) ||
          (item.pan || '').toLowerCase().includes(query) ||
          (item.regime || '').toLowerCase().includes(query)
      );
    }
    return undefined;
  };

  return (
    <MainCard
      // title="Employee Dashboard for  "
      // title={`Employee Dashboard for ${month || ''}`}
      title={`Employee Dashboard for ${getMonthName(month) || ''}`}
      tagline="Payroll Workflow"
      secondary={
        <Stack direction="row" sx={{ gap: 2 }}>
          <SearchBar
            placeholder={`Search ${tabs[activeTab].label}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="primary"
            onClick={() => navigate('/app/payroll?month=' + month + '&financial_year=' + financialYear)}
          >
            Back to dashboard
          </Button>
          <Button variant="contained" color="primary" onClick={handleButtonClick}>
            {renderButtonLabel()}
          </Button>
        </Stack>
      }
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          pb: 2
        }}
      >
        <Tabs
          variant="fullWidth"
          scrollButtons={true}
          value={activeTab}
          sx={{ borderBottom: '1px solid #e9e9e9' }}
          onChange={handleTabChange}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={`tab-${index}`}
              label={
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <Avatar variant="rounded" sx={{ mr: 1, bgcolor: 'primary.light', width: 36, height: 36 }}>
                    {tabIcons[index] && React.createElement(tabIcons[index], { color: theme.palette.text.primary })}
                  </Avatar>
                  <Typography variant="subtitle1">{tab.label}</Typography>
                </Stack>
              }
              value={index}
              sx={{ fontSize: '1rem', textTransform: 'none', p: 1, py: '14px' }}
            />
          ))}
        </Tabs>

        {tabs.map((tab, index) => (
          <TabPanel key={`panel-${index}`} value={activeTab} index={index}>
            <tab.component
              from={tab.label}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              fields={tab.fields}
              loading={loading}
              filteredData={getFilteredData()}
              employeeMasterData={employeeMasterData}
              fetchData={
                tab.label === 'Exits'
                  ? fetchExitsData
                  : tab.label === 'Adhoc Bonus & Incentives'
                    ? fetchAdhocBonusData
                    : tab.label === 'Variable Bonus'
                      ? fetchBonusData
                      : undefined
              }
              fetchAttendance={tab.label === 'Attendance' ? getAttandanceData : undefined}
              attendanceData={tab.label === 'Attendance' ? getFilteredData() : undefined}
              handleBack={() => setActiveTab((prev) => prev - 1)}
              handleNext={() => setActiveTab((prev) => prev + 1)}
            />
          </TabPanel>
        ))}
      </Paper>
    </MainCard>
  );
};

PayrollWorkflows.propTypes = {
  type: PropTypes.any
};

export default PayrollWorkflows;
