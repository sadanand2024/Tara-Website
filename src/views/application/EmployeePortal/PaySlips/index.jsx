import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid2, FormControl, Select, MenuItem, Button, Divider, Stack, TextField } from '@mui/material';
import { useSelector } from 'store';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';

const PaySlips = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [selectedMonth, setSelectedMonth] = useState('July 2025');

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
      </Box>
    );
  }

  // Mock pay slip data
  const paySlipData = {
    employeeDetails: {
      employeeNo: 'EMP001',
      name: 'John Doe',
      bank: 'HDFC Bank',
      accountNo: '1234567890',
      joiningDate: '15-01-2023',
      pfNo: 'PF123456789'
    },
    earnings: {
      basic: 80000,
      hra: 32000,
      conveyance: 1600,
      specialAllowance: 38400
    },
    deductions: {
      esi: 0,
      pf: 9600,
      tds: 8000,
      pt: 200,
      loanRepayment: 5000
    }
  };

  const calculateTotalEarnings = () => {
    return Object.values(paySlipData.earnings).reduce((sum, amount) => sum + amount, 0);
  };

  const calculateTotalDeductions = () => {
    return Object.values(paySlipData.deductions).reduce((sum, amount) => sum + amount, 0);
  };

  const calculateNetPay = () => {
    return calculateTotalEarnings() - calculateTotalDeductions();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + numberToWords(num % 100) : '');
    if (num < 100000)
      return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000)
      return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const months = [
    'January 2025',
    'February 2025',
    'March 2025',
    'April 2025',
    'May 2025',
    'June 2025',
    'July 2025',
    'August 2025',
    'September 2025',
    'October 2025',
    'November 2025',
    'December 2025'
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Download and Month Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
          Pay Slip
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
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
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<IconDownload size={20} />} sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
            Download
          </Button>
        </Box>
      </Box>

      {/* Pay Slip Content */}
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Employee Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
              Employee Details
            </Typography>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Employee No/ID
                    </Typography>
                    <TextField
                      value={paySlipData.employeeDetails.employeeNo}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Name
                    </Typography>
                    <TextField
                      value={paySlipData.employeeDetails.name}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Bank
                    </Typography>
                    <TextField
                      value={paySlipData.employeeDetails.bank}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                    />
                  </Box>
                </Stack>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Alc NO
                    </Typography>
                    <TextField
                      value={paySlipData.employeeDetails.accountNo}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Joining Date
                    </Typography>
                    <TextField
                      value={paySlipData.employeeDetails.joiningDate}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      PF No
                    </Typography>
                    <TextField
                      value={paySlipData.employeeDetails.pfNo}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                    />
                  </Box>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Earnings and Deductions Section */}
          <Grid2 container spacing={4}>
            {/* Earnings Section */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                Earnings
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textDecoration: 'underline' }}>
                  Amount (₹)
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Basic</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.earnings.basic)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">HRA</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.earnings.hra)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Conveyance</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.earnings.conveyance)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Special Allowance</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.earnings.specialAllowance)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {formatCurrency(calculateTotalEarnings())}
                  </Typography>
                </Box>
              </Stack>
            </Grid2>

            {/* Deductions Section */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                Deductions
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textDecoration: 'underline' }}>
                  Amount
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">ESI</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.deductions.esi)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">PF</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.deductions.pf)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">TDS</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.deductions.tds)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">PT</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.deductions.pt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Loan Repayment</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(paySlipData.deductions.loanRepayment)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {formatCurrency(calculateTotalDeductions())}
                  </Typography>
                </Box>
              </Stack>
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Net Pay Section */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Net Pay for {selectedMonth}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
              {formatCurrency(calculateNetPay())}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Rupees {numberToWords(calculateNetPay())} Only
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaySlips;
