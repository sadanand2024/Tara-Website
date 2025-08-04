import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { IconCalculator, IconDownload, IconEye } from '@tabler/icons-react';

const TaxTDS = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');

  const taxData = [
    {
      id: 1,
      financialYear: '2024-25',
      totalEarnings: 850000,
      totalDeductions: 150000,
      taxableIncome: 700000,
      taxAmount: 45000,
      tdsDeducted: 42000,
      balanceTax: 3000,
      status: 'Pending'
    },
    {
      id: 2,
      financialYear: '2023-24',
      totalEarnings: 780000,
      totalDeductions: 120000,
      taxableIncome: 660000,
      taxAmount: 38000,
      tdsDeducted: 38000,
      balanceTax: 0,
      status: 'Completed'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Tax & TDS
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        View and manage your tax deductions and TDS information
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconCalculator size={24} color="#1976d2" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Current Year Tax
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {formatCurrency(45000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                FY 2024-25
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                TDS Deducted
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(42000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                93.3% of total tax
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Balance Tax
              </Typography>
              <Typography variant="h4" color="warning.main">
                {formatCurrency(3000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                To be paid
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Taxable Income
              </Typography>
              <Typography variant="h4" color="info.main">
                {formatCurrency(700000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                After deductions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Financial Year</InputLabel>
                <Select value={selectedYear} label="Financial Year" onChange={(e) => setSelectedYear(e.target.value)}>
                  <MenuItem value="2024-25">2024-25</MenuItem>
                  <MenuItem value="2023-24">2023-24</MenuItem>
                  <MenuItem value="2022-23">2022-23</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" startIcon={<IconDownload />} fullWidth>
                Download Tax Summary
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" startIcon={<IconEye />} fullWidth>
                View Detailed Breakdown
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tax Details Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tax Details
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Financial Year</TableCell>
                  <TableCell align="right">Total Earnings</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Taxable Income</TableCell>
                  <TableCell align="right">Tax Amount</TableCell>
                  <TableCell align="right">TDS Deducted</TableCell>
                  <TableCell align="right">Balance Tax</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.financialYear}</TableCell>
                    <TableCell align="right">{formatCurrency(row.totalEarnings)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.totalDeductions)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.taxableIncome)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.taxAmount)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.tdsDeducted)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.balanceTax)}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.status} color={row.status === 'Completed' ? 'success' : 'warning'} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaxTDS;
