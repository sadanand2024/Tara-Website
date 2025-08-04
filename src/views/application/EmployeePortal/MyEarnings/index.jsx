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

const MyEarnings = () => {
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
  };

  const handleMonthChange = (event, newValue) => {
    if (newValue) {
      setSelectedMonth(newValue);
      getSalaryBreakdown(selectedYear, newValue);
    }
  };

  const handleYearChange = (event, newValue) => {
    if (newValue) {
      setSelectedYear(newValue);
      getSalaryBreakdown(newValue, selectedMonth);
    }
  };

  const getSalaryBreakdown = async (financialYear, month = selectedMonth) => {
    setLoading(true);
    let url = `/payroll/employee-ytd-details/?financial_year=${financialYear}&month=${months.indexOf(month) + 1}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setSalaryData(res.data);
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
                {selectedMonth} {selectedYear}
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
    if (!salaryData || !salaryData.earnings || !salaryData.deductions) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography variant="body1" color="textSecondary" component="div">
            No PF data available
          </Typography>
        </Box>
      );
    }

    const { earnings, deductions } = salaryData;

    // Find EPF from deductions
    const epfDeduction = deductions.find((d) => d.component_name.toLowerCase().includes('epf'));
    const epfAmount = epfDeduction ? epfDeduction.month_data : 0;
    const epfYtd = epfDeduction ? epfDeduction.ytd : 0;

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
                {selectedMonth} {selectedYear}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                YTD
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Employee EPF Contribution</TableCell>
              <TableCell align="center">{formatCurrency(epfAmount)}</TableCell>
              <TableCell align="center">{formatCurrency(epfYtd)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Employer EPF Contribution</TableCell>
              <TableCell align="center">{formatCurrency(epfAmount)}</TableCell>
              <TableCell align="center">{formatCurrency(epfYtd)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Total EPF</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {formatCurrency(epfAmount * 2)}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {formatCurrency(epfYtd * 2)}
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
      <Tabs value={breakdownType} onChange={handleTabChange} sx={{}}>
        <Tab label="Salary Breakdown" />
        <Tab label="PF Breakdown" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : breakdownType === 0 ? (
        renderSalaryBreakdown()
      ) : (
        renderPFBreakdown()
      )}
    </MainCard>
  );
};

export default MyEarnings;
