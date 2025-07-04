import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import MainCard from '../../../ui-component/cards/MainCard';
import PayrollSummary from './PayrollSummary';
import DetailedPayroll from './DetailedPayroll';
import Grid2 from '@mui/material/Grid2';
import { Box, Typography, Paper, Divider, alpha, Tabs, Tab, CircularProgress, Alert, Button, Stack } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import UpdateIcon from '@mui/icons-material/Update';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { months } from 'utils/MonthsList';
import ComplianceSummary from './ComplianceSummary';
import PayrollSummaryGrid from '../PayrollSummaryGrid';
import { ServicesData } from '../data';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmployeeBulkUploadDialog from '../../../ui-component/extended/EmployeeBulkUploadDialog';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';

const PRODUCTS_DATA = [
  { title: 'New Joiners', href: '/payroll-workflows', icon: <PersonAddIcon />, color: '#4CAF50' },
  { title: 'Exits', href: '/payroll-workflows', icon: <ExitToAppIcon />, color: '#F44336' },
  { title: 'Attendance', href: '/payroll-workflows', icon: <EventNoteIcon />, color: '#2196F3' },
  { title: 'Loans & Advances', href: '/payroll-workflows', icon: <AccountBalanceWalletIcon />, color: '#FF9800' },
  { title: 'Bonus & Incentives', href: '/payroll-workflows', icon: <EmojiEventsIcon />, color: '#9C27B0' },
  { title: 'Salary Revisions', href: '/payroll-workflows', icon: <UpdateIcon />, color: '#009688' },
  { title: 'TDS', href: '/payroll-workflows', icon: <ReceiptIcon />, color: '#673AB7' }
];

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
    {value === index && children}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

export default function Index() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [payrollId, setPayrollId] = useState(null);
  const [month, setMonth] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [monthWiseData, setMonthWiseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleTabChange = (_event, newTabIndex) => setActiveTab(newTabIndex);

  useEffect(() => {
    const tabValue = searchParams.get('tabvalue');
    if (tabValue) setActiveTab(Number(tabValue));
  }, [searchParams]);

  // Accessibility props for tabs
  const a11yProps = (index) => ({
    value: index,
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  // Tab labels
  const tabLabels = [
    'Payroll Summary',
    'Detailed Payroll'
    // 'Compliance Summary'
  ];

  // Sync payrollId from search params
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  // Sync month from search params
  useEffect(() => {
    const monthParam = searchParams.get('month');
    if (monthParam) {
      setMonth(monthParam);
      setSelectedMonth(Number(monthParam));
    }
  }, [searchParams]);

  useEffect(() => {
    const year = searchParams.get('financialYear');
    if (year) setFinancialYear(year);
  }, [searchParams]);

  // Fetch month summary data when month or financialYear changes
  useEffect(() => {
    const fetchMonthSummary = async () => {
      if (payrollId && selectedMonth && financialYear) {
        setLoading(true);
        setError(null);
        const url = `/payroll/payroll-summary-view?payroll_id=${payrollId}&month=${selectedMonth}&financial_year=${financialYear}`;
        const { res } = await Factory('get', url, {});
        if (res?.status_cd === 0) {
          setMonthWiseData(res.data);
        } else {
          setError('Failed to fetch month summary');
          setMonthWiseData(null);
        }
      }
      setLoading(false);
    };
    fetchMonthSummary();
  }, [payrollId, selectedMonth, financialYear]);

  // Month change handler
  const handleMonthChange = (_event, newValue) => {
    if (!newValue || newValue === 'Please select') return;
    const monthIndex = months.indexOf(newValue); // 0-based
    setSelectedMonth(monthIndex + 1);
    // Update URL params for consistency
    const params = new URLSearchParams(searchParams);
    params.set('month', monthIndex + 1);
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleCardClick = (href, index) => {
    navigate(`/payroll${href}?payrollid=${payrollId}&tabValue=${index}&month=${month}&financial_year=${financialYear}`);
  };

  const fetchEmployees = async () => {
    // Implementation of fetchEmployees function
  };

  const closeBulkDialog = () => {
    setOpenBulkDialog(false);
  };
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h5" color="text.secondary">
          Loading Payroll Summary...
        </Typography>
      </Box>
    );
  }
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {`Monthly Payroll Dashboard of `}
          </Typography>
          <CustomAutocomplete
            value={selectedMonth ? months[selectedMonth - 1] : ''}
            onChange={handleMonthChange}
            label="Select Month"
            options={[...months]}
            placeholder="Select Month"
            size="small"
            sx={{ minWidth: 180 }}
          />
        </Box>
      }
      tagline="Explore your monthly payroll details"
      // sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', p: { xs: 2, md: 4 }, borderRadius: 4 }}
      secondary={
        <Button startIcon={<ArrowBackIcon />} variant="outlined" color="primary" size="small" onClick={() => navigate('/app/payroll')}>
          Go to Payroll Dashboard
        </Button>
      }
    >
      <Box>
        <Grid2 container spacing={{ xs: 2, md: 3 }}>
          <Grid2 size={12}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5, minHeight: 180 }}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3, background: '#f9fafb' }}>
                  <CircularProgress />
                </Paper>
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5, minHeight: 180 }}>
                <Alert severity="error" sx={{ mb: 2, p: 3, borderRadius: 2, background: '#fff3f3' }}>
                  {error}
                </Alert>
              </Box>
            ) : (
              <PayrollSummaryGrid data={monthWiseData} config={ServicesData} />
            )}
          </Grid2>
          <Grid2 size={12}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, letterSpacing: 0.5 }}>
              Payroll Workflows
            </Typography>
            <Grid2 container spacing={2}>
              {PRODUCTS_DATA.map((item, index) => (
                <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    elevation={4}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
                      border: '1px solid',
                      borderColor: 'divider',
                      background: `linear-gradient(120deg, ${item.color}11 0%, #fff 100%)`,
                      boxShadow: '0 2px 12px 0 rgba(60,72,88,0.07)',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.03)',
                        boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.primary.main, 0.18)}`,
                        borderColor: 'primary.main',
                        cursor: 'pointer',
                        background: `linear-gradient(120deg, ${item.color}22 0%, #f5f7fa 100%)`
                      }
                    }}
                    onClick={() => handleCardClick(item.href, index)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        p: 2.5,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '100px',
                          height: '100px',
                          opacity: 0.12,
                          transform: 'translate(30%, -30%) rotate(30deg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1.5
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            bgcolor: alpha(item.color, 0.13),
                            color: item.color,
                            mr: 1.5,
                            fontSize: 28
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="700"
                          sx={{
                            color: 'text.primary',
                            fontSize: '1.05rem',
                            letterSpacing: 0.2
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.85rem',
                          lineHeight: 1.5
                        }}
                      >
                        Manage {item.title.toLowerCase()} related payroll processes and workflows
                      </Typography>
                    </Box>
                  </Paper>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
          <Grid2 size={12} sx={{ mt: 3, mb: 1 }}>
            <Divider />
          </Grid2>
          <Stack direction="row" sx={{ gap: 2, mb: 2 }}>
            <Button startIcon={<ArrowBackIcon />} variant="outlined" color="primary" size="large" onClick={() => navigate(-1)}>
              Back to Payroll Dashboard
            </Button>
          </Stack>
          <Grid2 size={12}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 0 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Statutory Components Tabs"
                TabIndicatorProps={{ sx: { backgroundColor: 'primary.main', height: 4, borderRadius: 2 } }}
                sx={{
                  '& .MuiTab-root': { fontWeight: 600, fontSize: '1rem', textTransform: 'none', minWidth: 120 },
                  '& .Mui-selected': { color: 'primary.main' },
                  mb: 1
                }}
              >
                {tabLabels.map((label, index) => (
                  <Tab key={index} label={label} {...a11yProps(index)} />
                ))}
              </Tabs>
            </Box>
          </Grid2>
          <Grid2 size={12}>
            <TabPanel value={activeTab} index={0}>
              <PayrollSummary payrollId={payrollId} month={month} financialYear={financialYear} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <DetailedPayroll payrollId={payrollId} month={month} financialYear={financialYear} />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <ComplianceSummary payrollId={payrollId} month={month} financialYear={financialYear} />
            </TabPanel>
          </Grid2>
        </Grid2>
      </Box>
      <EmployeeBulkUploadDialog
        open={openBulkDialog}
        handleClose={closeBulkDialog}
        getData={fetchEmployees}
        payrollid={payrollId}
        type="Employees"
        bulkUploadUrl="/payroll/employees/upload/"
        xlsxTemplateUrl={`/payroll/download-template/${payrollId}/`}
      />
    </MainCard>
  );
}
