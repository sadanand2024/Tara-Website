import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';

const SalaryYTDReportsTab = () => {
  // Mock YTD data for Salary Reports
  const salaryYtdData = {
    income: {
      basic: {
        total: 320000,
        monthly: { 'Apr-25': 80000, 'May-25': 80000, 'Jun-25': 80000, 'Jul-25': 80000 }
      },
      hra: {
        total: 128000,
        monthly: { 'Apr-25': 32000, 'May-25': 32000, 'Jun-25': 32000, 'Jul-25': 32000 }
      },
      conveyance: {
        total: 6400,
        monthly: { 'Apr-25': 1600, 'May-25': 1600, 'Jun-25': 1600, 'Jul-25': 1600 }
      },
      specialAllowance: {
        total: 153600,
        monthly: { 'Apr-25': 38400, 'May-25': 38400, 'Jun-25': 38400, 'Jul-25': 38400 }
      }
    },
    deductions: {
      pf: {
        total: 38400,
        monthly: { 'Apr-25': 9600, 'May-25': 9600, 'Jun-25': 9600, 'Jul-25': 9600 }
      },
      tds: {
        total: 32000,
        monthly: { 'Apr-25': 8000, 'May-25': 8000, 'Jun-25': 8000, 'Jul-25': 8000 }
      },
      pt: {
        total: 800,
        monthly: { 'Apr-25': 200, 'May-25': 200, 'Jun-25': 200, 'Jul-25': 200 }
      }
    }
  };

  const months = ['Apr-25', 'May-25', 'Jun-25', 'Jul-25'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotalIncome = () => {
    return Object.values(salaryYtdData.income).reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotalDeductions = () => {
    return Object.values(salaryYtdData.deductions).reduce((sum, item) => sum + item.total, 0);
  };

  const calculateNetPay = () => {
    return calculateTotalIncome() - calculateTotalDeductions();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textDecoration: 'underline' }}>
            YTD Reports
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
            YTD Statement
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value="Salary YTD Report"
              displayEmpty
              IconComponent={IconChevronDown}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              <MenuItem value="Salary YTD Report">Salary YTD Report</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<IconDownload size={20} />} sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
            Download
          </Button>
        </Box>
      </Box>

      {/* Salary YTD Statement Content */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
            Salary YTD Report
          </Typography>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', minWidth: 120 }}>YTD Summary</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', minWidth: 150 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'right', minWidth: 120 }}>Total (₹)</TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'right', minWidth: 100 }}>
                      {month}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Income Section */}
                <TableRow sx={{ bgcolor: 'success.50' }}>
                  <TableCell colSpan={7}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      ▼ Income
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Basic */}
                <TableRow hover>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Basic
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(salaryYtdData.income.basic.total)}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salaryYtdData.income.basic.monthly[month])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* HRA */}
                <TableRow hover>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      HRA
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(salaryYtdData.income.hra.total)}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salaryYtdData.income.hra.monthly[month])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Conveyance */}
                <TableRow hover>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Conveyance
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(salaryYtdData.income.conveyance.total)}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salaryYtdData.income.conveyance.monthly[month])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Special Allowance */}
                <TableRow hover>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Spl. Allowance
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(salaryYtdData.income.specialAllowance.total)}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salaryYtdData.income.specialAllowance.monthly[month])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Gross Total */}
                <TableRow sx={{ bgcolor: 'success.100' }}>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      Gross
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {formatCurrency(calculateTotalIncome())}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {formatCurrency(calculateTotalIncome() / 4)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Deduction Section */}
                <TableRow sx={{ bgcolor: 'error.50' }}>
                  <TableCell colSpan={7}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main' }}>
                      ▼ Deduction
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* PF */}
                <TableRow hover>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      PF
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(salaryYtdData.deductions.pf.total)}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salaryYtdData.deductions.pf.monthly[month])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* TDS */}
                <TableRow hover>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Income tax (TDS)
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(salaryYtdData.deductions.tds.total)}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salaryYtdData.deductions.tds.monthly[month])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* PT */}
                <TableRow hover>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      PT
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(salaryYtdData.deductions.pt.total)}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salaryYtdData.deductions.pt.monthly[month])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Total Deductions */}
                <TableRow sx={{ bgcolor: 'error.100' }}>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      Total Ded
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {formatCurrency(calculateTotalDeductions())}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {formatCurrency(calculateTotalDeductions() / 4)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Net Pay */}
                <TableRow sx={{ bgcolor: 'primary.50' }}>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Net Pay
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {formatCurrency(calculateNetPay())}
                    </Typography>
                  </TableCell>
                  {months.map((month) => (
                    <TableCell key={month} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCurrency(calculateNetPay() / 4)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Cards */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Summary
            </Typography>
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
              <Card sx={{ minWidth: 200, bgcolor: 'success.50' }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatCurrency(calculateTotalIncome())}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Income
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 200, bgcolor: 'error.50' }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {formatCurrency(calculateTotalDeductions())}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Deductions
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 200, bgcolor: 'primary.50' }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(calculateNetPay())}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Net Pay
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalaryYTDReportsTab;
