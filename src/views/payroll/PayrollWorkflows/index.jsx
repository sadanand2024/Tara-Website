'use client';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Typography, Stack, Avatar, Button, Paper } from '@mui/material';
import { IconBolt } from '@tabler/icons-react';
import MainCard from '../../../ui-component/cards/MainCard';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router';
import NewJoiners from './NewJoiners';
import Exits from './Exits';
import Attendance from './Attendance';
import LoansAndAdvances from './LoansAndAdvances';
import BonusAndIncentives from './BonusAndIncentives';
import SalaryRevisions from './SalaryRevisions';
import OtherDeductions from './OtherDeductions';
import Factory from 'utils/Factory';

// TabPanel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
    {value === index && <Box sx={{ pt: 2.5 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

// Custom Hook for Payroll Data
const usePayrollData = (payrollId) => {
  const [loading, setLoading] = useState(false);
  const [employeeMasterData, setEmployeeMasterData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchEmployeeMasterData = async () => {
    setLoading(true);
    const url = `/payroll/employees?payroll_id=${payrollId}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setEmployeeMasterData(res.data);
    } else {
      setEmployeeMasterData([]);
      // showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    const url = `/payroll/employee_attendance_current_month_automate?payroll_id=${payrollId}`;
    const { res, error } = await Factory('post', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setAttendanceData(res.data || []);
    } else {
      // showSnackbar(JSON.stringify(res.data?.data || error), 'error');
    }
  };

  useEffect(() => {
    if (payrollId) fetchEmployeeMasterData();
  }, [payrollId]);

  return { loading, employeeMasterData, attendanceData, fetchAttendanceData };
};

// Main Component
const PayrollWorkflows = ({ type }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const payrollId = searchParams.get('payrollid');

  const { loading, employeeMasterData, attendanceData, fetchAttendanceData } = usePayrollData(payrollId);

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
        label: 'Bonus & Incentives',
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
        label: 'Salary Revisions',
        component: SalaryRevisions,
        fields: [
          { name: 'employee', label: 'Employee Name' },
          { name: 'department', label: 'Department' },
          { name: 'designation', label: 'Designation' },
          { name: 'current_ctc', label: 'Current CTC' },
          { name: 'created_on', label: 'last Revison' },
          { name: 'revised_ctc', label: '	Revised CTC' }
        ]
      },
      { label: 'Other Deductions', component: OtherDeductions, fields: [] }
    ],
    []
  );

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const handleButtonClick = () => {
    if (tabs[activeTab].label === 'Attendance') {
      fetchAttendanceData();
    } else if (tabs[activeTab].label === 'New Joiners') {
      navigate(`/payroll/settings/add-employee?payrollid=${payrollId}`);
    } else {
      setOpenDialog(true);
    }
  };

  const renderButtonLabel = () => (tabs[activeTab].label === 'Attendance' ? 'Generate Attendance' : `Add ${tabs[activeTab].label}`);
  useEffect(() => {
    const tabValue = searchParams.get('tabValue');
    if (tabValue) setActiveTab(Number(tabValue));
  }, [searchParams]);

  return (
    <MainCard
      title="Employee Dashboard"
      tagline="Payroll Workflow"
      secondary={
        <Stack direction="row" sx={{ gap: 2 }}>
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
          border: '1px solid #e0e0e0'
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
                  <Avatar variant="rounded" sx={{ mr: 1, bgcolor: 'grey.300', width: 32, height: 30 }}>
                    <IconBolt color={theme.palette.text.primary} />
                  </Avatar>
                  <Typography variant="subtitle1">{tab.label}</Typography>
                </Stack>
              }
              value={index}
              sx={{ fontSize: '1rem', textTransform: 'none', p: 1, py: 2 }}
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
              employeeMasterData={employeeMasterData}
              attendanceData={tab.label === 'Attendance' ? attendanceData : undefined}
              fetchAttendanceData={tab.label === 'Attendance' ? fetchAttendanceData : undefined}
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
