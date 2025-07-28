import React, { useState } from 'react';
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
  Button,
  Stack,
  Divider,
  TextField,
  Grid2,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { useSelector } from 'store';
import { IconDownload, IconChevronDown, IconCalculator } from '@tabler/icons-react';

const ITStatements = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [expandedItems, setExpandedItems] = useState(['A', 'B', 'C', 'D', 'F', 'G', 'I']);

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

  // Mock IT Statement data
  const itStatementData = {
    summary: {
      totalTaxDue: 151790,
      tdsPerMonth: 25266,
      remainingMonths: 6
    },
    breakdown: {
      A: {
        title: 'Income',
        amount: 960000,
        details: [
          { item: 'Basic Salary', amount: 480000 },
          { item: 'HRA', amount: 192000 },
          { item: 'Special Allowance', amount: 240000 },
          { item: 'Conveyance', amount: 9600 },
          { item: 'Medical Allowance', amount: 15000 },
          { item: 'Other Allowances', amount: 23400 }
        ]
      },
      B: {
        title: 'Deductions',
        amount: 115200,
        details: [
          { item: 'PF Contribution', amount: 57600 },
          { item: 'Professional Tax', amount: 2400 },
          { item: 'Other Deductions', amount: 55200 }
        ]
      },
      C: {
        title: 'Perquisites',
        amount: 45000,
        details: [
          { item: 'Rent Free Accommodation', amount: 30000 },
          { item: 'Car Facility', amount: 15000 }
        ]
      },
      D: {
        title: 'Income Excluded from tax',
        amount: 25000,
        details: [
          { item: 'LTA', amount: 15000 },
          { item: 'Medical Reimbursement', amount: 10000 }
        ]
      },
      F: {
        title: 'Exemption u/s 10',
        amount: 180000,
        details: [
          { item: 'HRA Exemption', amount: 120000 },
          { item: 'LTA Exemption', amount: 15000 },
          { item: 'Medical Exemption', amount: 15000 },
          { item: 'Other Exemptions', amount: 30000 }
        ]
      },
      G: {
        title: 'Income from previous employer',
        amount: 120000,
        details: [{ item: 'Previous Employer Salary', amount: 120000 }]
      },
      I: {
        title: 'Deduction u/s 16',
        amount: 50000,
        details: [{ item: 'Standard Deduction', amount: 50000 }]
      }
    },
    section80Deductions: {
      total: 150000,
      details: [
        { item: 'Section 80C (PF, ELSS, etc.)', amount: 100000 },
        { item: 'Section 80D (Health Insurance)', amount: 25000 },
        { item: 'Section 80G (Donations)', amount: 10000 },
        { item: 'Section 80TTA (Interest Income)', amount: 10000 },
        { item: 'Other Deductions', amount: 5000 }
      ]
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateGrossSalary = () => {
    return itStatementData.breakdown.A.amount - itStatementData.breakdown.B.amount;
  };

  const calculateIncomeAfterExemption = () => {
    const grossSalary = calculateGrossSalary();
    return grossSalary - itStatementData.breakdown.F.amount + itStatementData.breakdown.G.amount;
  };

  const calculateTaxableIncome = () => {
    const incomeAfterExemption = calculateIncomeAfterExemption();
    return incomeAfterExemption - itStatementData.breakdown.I.amount;
  };

  const calculateNetTaxableIncome = () => {
    const taxableIncome = calculateTaxableIncome();
    return taxableIncome - itStatementData.section80Deductions.total;
  };

  const handleAccordionChange = (item) => (event, isExpanded) => {
    if (isExpanded) {
      setExpandedItems([...expandedItems, item]);
    } else {
      setExpandedItems(expandedItems.filter((i) => i !== item));
    }
  };

  const renderAccordionItem = (key, data) => (
    <Accordion
      key={key}
      expanded={expandedItems.includes(key)}
      onChange={handleAccordionChange(key)}
      sx={{
        mb: 1,
        '&:before': { display: 'none' },
        boxShadow: 'none',
        border: '1px solid #e0e0e0'
      }}
    >
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        sx={{
          bgcolor: key === 'A' ? 'success.50' : key === 'B' ? 'error.50' : 'grey.50',
          '& .MuiAccordionSummary-content': {
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {key}. {data.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, color: key === 'A' ? 'success.main' : key === 'B' ? 'error.main' : 'text.primary' }}
        >
          {formatCurrency(data.amount)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: 'white' }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.details.map((detail, index) => (
                <TableRow key={index} hover>
                  <TableCell>{detail.item}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(detail.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textDecoration: 'underline' }}>
            IT Statement
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
            Income Tax Calculation
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<IconDownload size={20} />} sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
          Download
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'error.50' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                {formatCurrency(itStatementData.summary.totalTaxDue)}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Total Tax Due (₹)
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'warning.50' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                {formatCurrency(itStatementData.summary.tdsPerMonth)}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                TDS Per Month (₹)
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'info.50' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                {itStatementData.summary.remainingMonths}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Remaining Months
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Main Content */}
      <Grid2 container spacing={3}>
        {/* Left Column - Income Breakdown */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
                  Income & Deduction Breakdown
                </Typography>
                <Chip icon={<IconCalculator size={16} />} label="Expand All" variant="outlined" color="primary" />
              </Box>

              {/* Accordion Items */}
              {renderAccordionItem('A', itStatementData.breakdown.A)}
              {renderAccordionItem('B', itStatementData.breakdown.B)}
              {renderAccordionItem('C', itStatementData.breakdown.C)}
              {renderAccordionItem('D', itStatementData.breakdown.D)}

              {/* E. Gross Salary */}
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: 'success.100',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    E. Gross Salary
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatCurrency(calculateGrossSalary())}
                  </Typography>
                </Box>
              </Box>

              {renderAccordionItem('F', itStatementData.breakdown.F)}
              {renderAccordionItem('G', itStatementData.breakdown.G)}

              {/* H. Income after Exemption */}
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: 'primary.50',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    H. Income after Exemption (E - F + G)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(calculateIncomeAfterExemption())}
                  </Typography>
                </Box>
              </Box>

              {renderAccordionItem('I', itStatementData.breakdown.I)}

              {/* J. Income chargeable under Salaries */}
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: 'secondary.50',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    J. Income chargeable under "Salaries" (H - I)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    {formatCurrency(calculateTaxableIncome())}
                  </Typography>
                </Box>
              </Box>

              {/* Section 80 Deductions */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                  Less: Deduction under Section 80
                </Typography>
                <Accordion
                  expanded={expandedItems.includes('section80')}
                  onChange={handleAccordionChange('section80')}
                  sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    sx={{
                      bgcolor: 'warning.50',
                      '& .MuiAccordionSummary-content': {
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Section 80 Deductions
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {formatCurrency(itStatementData.section80Deductions.total)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: 'white' }}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Section</TableCell>
                            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Amount (₹)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {itStatementData.section80Deductions.details.map((detail, index) => (
                            <TableRow key={index} hover>
                              <TableCell>{detail.item}</TableCell>
                              <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(detail.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Final Net Taxable Income */}
              <Box
                sx={{
                  p: 3,
                  mt: 3,
                  bgcolor: 'primary.100',
                  border: '2px solid #1976d2',
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  Net Taxable Salary Income
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'underline double' }}>
                  {formatCurrency(calculateNetTaxableIncome())}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Right Column - Value Summary */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                Value Summary (₹)
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Gross Salary
                  </Typography>
                  <TextField
                    value={formatCurrency(calculateGrossSalary())}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'success.50', fontWeight: 600 } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Exemptions
                  </Typography>
                  <TextField
                    value={formatCurrency(itStatementData.breakdown.F.amount)}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'info.50', fontWeight: 600 } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Standard Deduction
                  </Typography>
                  <TextField
                    value={formatCurrency(itStatementData.breakdown.I.amount)}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'warning.50', fontWeight: 600 } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Section 80 Deductions
                  </Typography>
                  <TextField
                    value={formatCurrency(itStatementData.section80Deductions.total)}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'error.50', fontWeight: 600 } }}
                  />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    Net Taxable Income
                  </Typography>
                  <TextField
                    value={formatCurrency(calculateNetTaxableIncome())}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{
                      '& .MuiInputBase-input': {
                        bgcolor: 'primary.50',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ITStatements;
