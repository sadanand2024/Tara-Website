import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Divider, FormControl, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { IconChevronDown, IconDownload } from '@tabler/icons-react';
import { useSelector } from 'store';

const PaySlips = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [selectedMonth, setSelectedMonth] = useState('July 2025');

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

  const [paySlipData, setPaySlipData] = useState({
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
});



  const employeeFields = [
    { name: 'employeeNo', label: 'Employee No/ID' },
    { name: 'name', label: 'Name' },
    { name: 'bank', label: 'Bank' },
    { name: 'accountNo', label: 'A/C No' },
    { name: 'joiningDate', label: 'Joining Date' },
    { name: 'pfNo', label: 'PF No' }
  ];

  const earningsFields = [
    { name: 'basic', label: 'Basic' },
    { name: 'hra', label: 'HRA' },
    { name: 'conveyance', label: 'Conveyance' },
    { name: 'specialAllowance', label: 'Special Allowance' }
  ];

  const deductionsFields = [
    { name: 'esi', label: 'ESI' },
    { name: 'pf', label: 'PF' },
    { name: 'tds', label: 'TDS' },
    { name: 'pt', label: 'PT' },
    { name: 'loanRepayment', label: 'Loan Repayment' }
  ];

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

  const calculateTotalEarnings = () => Object.values(paySlipData.earnings).reduce((sum, amount) => sum + amount, 0);

  const calculateTotalDeductions = () => Object.values(paySlipData.deductions).reduce((sum, amount) => sum + amount, 0);

  const calculateNetPay = () => calculateTotalEarnings() - calculateTotalDeductions();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  const handleChange = (section, field, value) => {
    setPaySlipData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
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

  const renderReadOnlyFields = (fields, data) =>
    fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {field.label}
        </Typography>
        <TextField
          value={data[field.name]}
          fullWidth
          size="small"
          onChange={(e) => handleChange('employeeDetails', field.name, e.target.value)}
          // InputProps={{ readOnly: true }}
          sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
        />
      </Grid2>
    ));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
          Pay Slip
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              IconComponent={IconChevronDown}
              sx={{ '& .MuiSelect-select': { display: 'flex', alignItems:'center', gap: 1 } }}
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

      {/* Content */}
      <Card sx={{ p: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Employee Details */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
              Employee Details
            </Typography>
            <Grid2 container spacing={2}>
              {renderReadOnlyFields(employeeFields, paySlipData.employeeDetails)}
            </Grid2>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Earnings and Deductions */}
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                Earnings
              </Typography>
              <Stack spacing={2}>
                {earningsFields.map((field) => (
                  <Box key={field.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{field.label}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(paySlipData.earnings[field.name])}
                    </Typography>
                  </Box>
                ))}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {formatCurrency(calculateTotalEarnings())}
                  </Typography>
                </Box>
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                Deductions
              </Typography>
              <Stack spacing={2}>
                {deductionsFields.map((field) => (
                  <Box key={field.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{field.label}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(paySlipData.deductions[field.name])}
                    </Typography>
                  </Box>
                ))}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {formatCurrency(calculateTotalDeductions())}
                  </Typography>
                </Box>
              </Stack>
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 3 }} />

          {/* Net Pay */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Net Pay for {selectedMonth}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>
              {formatCurrency(calculateNetPay())}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Rupees {numberToWords(calculateNetPay())} Only
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaySlips;
