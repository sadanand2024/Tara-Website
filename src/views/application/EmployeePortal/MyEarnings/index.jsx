import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tabs,
  Tab,
  TextField,
  Autocomplete,
  Stack,
  CircularProgress
} from '@mui/material';
import { IconDownload, IconEye, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import MainCard from '../../../../ui-component/cards/MainCard';
import { generateFinancialYears } from '../../../../utils/FinancialYearsList';
import Factory from 'utils/Factory';
import { months } from 'utils/MonthsList';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
const MyEarnings = () => {
  const dispatch = useDispatch();
  // Get current month and year
  const getCurrentMonth = () => {
    return months[new Date().getMonth()];
  };

  const getCurrentFinancialYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    // Financial year starts from April (month 4)
    if (currentMonth >= 4) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentFinancialYear());
  const [breakdownType, setBreakdownType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [salaryData, setSalaryData] = useState(null);
  const [pfData, setPfData] = useState(null);

  const years = generateFinancialYears(10);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleTabChange = (event, newValue) => {
    setBreakdownType(newValue);
    if (newValue === 1 && !pfData) {
      getPFBreakdown(selectedYear, selectedMonth);
    }
  };

  const handleMonthChange = (event, newValue) => {
    if (newValue) {
      setSelectedMonth(newValue);
      getSalaryBreakdown(selectedYear, newValue);
      if (breakdownType === 1) {
        getPFBreakdown(selectedYear, newValue);
      }
    }
  };

  const handleYearChange = (event, newValue) => {
    if (newValue) {
      setSelectedYear(newValue);
      getSalaryBreakdown(newValue, selectedMonth);
      if (breakdownType === 1) {
        getPFBreakdown(newValue, selectedMonth);
      }
    }
  };

  const getSalaryBreakdown = async (financialYear, month = selectedMonth) => {
    setLoading(true);
    let url = `/payroll/employee-ytd-details/?financial_year=${financialYear}&month=${months.indexOf(month) + 1}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setSalaryData(res.data);
    } else {
      setSalaryData(null);
      dispatch(
        openSnackbar({
          open: true,
          message: res.data.data.error,
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setLoading(false);
  };

  const getPFBreakdown = async (financialYear, month = selectedMonth) => {
    setLoading(true);
    let url = `/payroll/pf-breakdown/?financial_year=${financialYear}&month=${months.indexOf(month) + 1}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setPfData(res.data);
    } else {
      setPfData(null);
      dispatch(
        openSnackbar({
          open: true,
          message: res.data.data.error,
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    getSalaryBreakdown(selectedYear, selectedMonth);
  }, []);

  const renderSalaryBreakdown = () => {
    if (!salaryData || !salaryData.earnings || !salaryData.deductions) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography variant="body1" color="textSecondary" component="div">
            No salary data available
          </Typography>
        </Box>
      );
    }

    const { earnings, deductions, gross_income, net_salary, deduction_total } = salaryData;

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important'
              }
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Monthly Breakdown
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                YTD
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Income Section */}
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell colSpan={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }} component="div">
                    Earnings
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>

            {/* Dynamic Earnings */}
            {earnings.map((earning, index) => (
              <TableRow key={index}>
                <TableCell sx={{ pl: 4 }}>{earning.component_name}</TableCell>
                <TableCell align="center">{formatCurrency(earning.month_data)}</TableCell>
                <TableCell align="center">{formatCurrency(earning.ytd)}</TableCell>
              </TableRow>
            ))}

            <TableRow sx={{ borderTop: '2px solid #e0e0e0' }}>
              <TableCell sx={{ pl: 4, fontWeight: 'bold' }}>Gross</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(gross_income.month_data)}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(gross_income.ytd)}
              </TableCell>
            </TableRow>

            {/* Deductions Section */}
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell colSpan={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }} component="div">
                    Deductions
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>

            {/* Dynamic Deductions */}
            {deductions.map((deduction, index) => (
              <TableRow key={index}>
                <TableCell sx={{ pl: 4 }}>{deduction.component_name}</TableCell>
                <TableCell align="center">{formatCurrency(deduction.month_data)}</TableCell>
                <TableCell align="center">{formatCurrency(deduction.ytd)}</TableCell>
              </TableRow>
            ))}

            <TableRow sx={{ borderTop: '2px solid #e0e0e0' }}>
              <TableCell sx={{ pl: 4, fontWeight: 'bold' }}>Total Deductions</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(deduction_total.month_data)}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(deduction_total.ytd)}
              </TableCell>
            </TableRow>

            {/* Net Salary */}
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Net Salary</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(net_salary.month_data)}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(net_salary.ytd)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderPFBreakdown = () => {
    if (!pfData) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography variant="body1" color="textSecondary" component="div">
            No PF data available
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important'
              }
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Monthly Breakdown
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                YTD
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Employee PF Contribution */}
            <TableRow>
              <TableCell>Employee PF Contribution</TableCell>
              <TableCell align="center">{formatCurrency(pfData.employee_pf?.month_data || 0)}</TableCell>
              <TableCell align="center">{formatCurrency(pfData.employee_pf?.ytd || 0)}</TableCell>
            </TableRow>

            {/* Employer PF Contribution */}
            <TableRow>
              <TableCell>Employer PF Contribution</TableCell>
              <TableCell align="center">{formatCurrency(pfData.employer_pf?.month_data || 0)}</TableCell>
              <TableCell align="center">{formatCurrency(pfData.employer_pf?.ytd || 0)}</TableCell>
            </TableRow>

            {/* Total PF */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total PF</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(pfData.total_pf?.month_data || 0)}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(pfData.total_pf?.ytd || 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <MainCard
      title="My Earnings"
      subtitle="View and download your monthly payslips with complete salary and tax details."
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            value={selectedYear}
            onChange={handleYearChange}
            options={years}
            renderInput={(params) => <TextField {...params} label="Financial Year" size="small" sx={{ minWidth: 200 }} />}
          />
          <Autocomplete
            value={selectedMonth}
            onChange={handleMonthChange}
            options={months}
            renderInput={(params) => <TextField {...params} label="Month" size="small" sx={{ minWidth: 200 }} />}
          />
        </Stack>
      }
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          minHeight: { xs: 800, md: 400 },
          width: '100%',
          mx: 'auto',
          overflow: 'hidden'
        }}
      >
        {/* Tabs always centered, search bar right, responsive */}
        <Tabs
          value={breakdownType}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-flexContainer': {
              borderBottom: '1px solid',
              borderColor: 'grey.300',
              backgroundColor: 'background.paper'
            },
            '& .MuiTab-root': {
              minHeight: '48px',
              minWidth: '140px',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              color: 'text.secondary',
              borderBottom: '2px solid transparent',
              '&.Mui-selected': {
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                fontWeight: 600
              },
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent'
              }
            },
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          <Tab label="Salary Breakdown" />
          <Tab label="PF Breakdown" />
        </Tabs>

        <Box sx={{ p: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : breakdownType === 0 ? (
            renderSalaryBreakdown()
          ) : (
            renderPFBreakdown()
          )}
        </Box>
      </Paper>
    </MainCard>
  );
};

export default MyEarnings;
