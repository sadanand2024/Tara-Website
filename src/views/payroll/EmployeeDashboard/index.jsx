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
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const PRODUCTS_DATA = [
  { title: 'New Joiners', href: '/payroll-workflows', icon: <PersonAddIcon />, color: '#4CAF50' },
  { title: 'Exits', href: '/payroll-workflows', icon: <ExitToAppIcon />, color: '#F44336' },
  { title: 'Attendance', href: '/payroll-workflows', icon: <EventNoteIcon />, color: '#2196F3' },
  { title: 'Loans & Advances', href: '/payroll-workflows', icon: <AccountBalanceWalletIcon />, color: '#FF9800' },
  { title: 'Variable Bonus', href: '/payroll-workflows', icon: <EmojiEventsIcon />, color: '#9C27B0' },
  { title: 'Adhoc Bonus & Incentives', href: '/payroll-workflows', icon: <EmojiEventsIcon />, color: '#E91E63' },
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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [doneStatus, setDoneStatus] = useState(Array(PRODUCTS_DATA.length).fill(false));
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(null);
  const [skipConfirm, setSkipConfirm] = useState(false);

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
  }, [searchParams, selectedMonth]);

  useEffect(() => {
    const year = searchParams.get('financialYear');
    if (year) setFinancialYear(year);
  }, [searchParams]);

  const workflowFieldMap = [
    'new_joinees',
    'exits',
    'attendance',
    'loans_and_advances', // If/when available in API, else will be undefined
    'bonuses',
    'adhoc_bonus', // New field for Adhoc Bonus & Incentives
    'salary_revision',
    'tds'
  ];

  const getworkFlowStatusData = async () => {
    if (!payrollId || !selectedMonth || !financialYear) return;
    let url = `/app/payroll/payroll-workflows/detail-or-create/?payroll=${payrollId}&month=${selectedMonth}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      const data = res.data;
      // console.log(data);
      const newDoneStatus = workflowFieldMap.map((field) => data[field] === 'completed');
      setDoneStatus([...newDoneStatus, { id: data.id }]);
    }
  };
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
    getworkFlowStatusData();
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
    navigate(`/app/payroll${href}?payrollid=${payrollId}&tabValue=${index}&month=${month}&financial_year=${financialYear}`);
  };

  const putStatusApicall = async (index, status) => {
    const field = workflowFieldMap[index];
    if (!field || !payrollId) return;
    const objWithId = doneStatus.find((item) => typeof item === 'object' && item !== null && 'id' in item);
    const url = `/app/payroll/payroll-workflows/${objWithId?.id}/update/`;
    const payload = {
      payroll: payrollId,
      month: selectedMonth,
      financial_year: financialYear,
      [field]: status
    };
    const { res } = await Factory('put', url, payload);
    if (res?.status_cd === 0) {
      getworkFlowStatusData();
    }
  };

  const handleWorkClick = (href, index) => {
    // Navigate to workflow (existing logic)
    handleCardClick(href, index);
  };

  const handleMarkAsDoneClick = (index) => {
    if (skipConfirm) {
      handleConfirmYes(index);
    } else {
      setDialogIndex(index);
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmYes = async (index, status) => {
    setConfirmDialogOpen(false);
    await putStatusApicall(index, status);
    setDoneStatus((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const handleConfirmNo = () => {
    setConfirmDialogOpen(false);
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
          <Typography
            variant="h4"
            sx={{
              color: 'primary.main'
            }}
          >{`Monthly Payroll Dashboard of `}</Typography>
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
            <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
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
                      {/* Background Icon Overlay */}
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

                      {/* Content Section with flexGrow */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
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

                      <Divider sx={{ my: 1.5 }} />

                      {/* Bottom Action Section */}
                      {doneStatus[index] ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              putStatusApicall(index, 'in progress');
                              handleCardClick(item.href, index);
                            }}
                          >
                            Edit
                          </Button>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={doneStatus[index]}
                                size="medium"
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsDoneClick(index);
                                }}
                                color="success"
                                sx={{
                                  color: (theme) => theme.palette.success.darker,
                                  '&.Mui-checked': {
                                    color: (theme) => theme.palette.success.darker
                                  }
                                }}
                              />
                            }
                            label="Done"
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWorkClick(item.href, index);
                            }}
                          >
                            Work on it
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{
                              color: (theme) => theme.palette.success.darker,
                              '&.Mui-checked': {
                                color: (theme) => theme.palette.success.darker
                              }
                            }}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsDoneClick(index);
                            }}
                            disabled={doneStatus[index]}
                          >
                            Mark as Done
                          </Button>
                        </Box>
                      )}
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmNo} aria-labelledby="confirm-done-dialog-title">
        <DialogTitle id="confirm-done-dialog-title">
          {' '}
          Are you sure you want to mark this as <strong>Done</strong>?
        </DialogTitle>

        <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleConfirmYes(dialogIndex, 'completed')}>
            Yes
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleConfirmNo}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
