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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  IconCurrencyDollar,
  IconDownload,
  IconEye,
  IconTrendingUp,
  IconTrendingDown,
  IconChartBar,
  IconCalendar
} from '@tabler/icons-react';

const MyEarnings = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const earningsData = [
    {
      id: 1,
      month: 'January 2024',
      basicSalary: 50000,
      hra: 20000,
      da: 15000,
      allowances: 10000,
      bonus: 25000,
      overtime: 5000,
      totalEarnings: 125000,
      deductions: 15000,
      netSalary: 110000
    },
    {
      id: 2,
      month: 'December 2023',
      basicSalary: 50000,
      hra: 20000,
      da: 15000,
      allowances: 10000,
      bonus: 0,
      overtime: 3000,
      totalEarnings: 98000,
      deductions: 15000,
      netSalary: 83000
    },
    {
      id: 3,
      month: 'November 2023',
      basicSalary: 50000,
      hra: 20000,
      da: 15000,
      allowances: 10000,
      bonus: 0,
      overtime: 4000,
      totalEarnings: 99000,
      deductions: 15000,
      netSalary: 84000
    }
  ];

  const yearlyStats = {
    totalEarnings: 322000,
    totalDeductions: 45000,
    netSalary: 277000,
    averageMonthly: 92333,
    growth: 12.5
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Earnings
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Track your salary, bonuses, and earnings over time
      </Typography>

      {/* Earnings Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconCurrencyDollar size={24} color="#1976d2" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Total Earnings
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {formatCurrency(yearlyStats.totalEarnings)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                FY 2024
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Net Salary
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(yearlyStats.netSalary)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                After deductions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Average
              </Typography>
              <Typography variant="h4" color="info.main">
                {formatCurrency(yearlyStats.averageMonthly)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Per month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {yearlyStats.growth >= 0 ? <IconTrendingUp size={24} color="green" /> : <IconTrendingDown size={24} color="red" />}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Growth
                </Typography>
              </Box>
              <Typography variant="h4" color={getGrowthColor(yearlyStats.growth)}>
                {yearlyStats.growth}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                vs last year
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Salary Breakdown Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Salary Breakdown (Current Month)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Basic Salary
                </Typography>
                <Typography variant="h6">{formatCurrency(50000)}</Typography>
                <LinearProgress variant="determinate" value={40} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  HRA
                </Typography>
                <Typography variant="h6">{formatCurrency(20000)}</Typography>
                <LinearProgress variant="determinate" value={16} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  DA
                </Typography>
                <Typography variant="h6">{formatCurrency(15000)}</Typography>
                <LinearProgress variant="determinate" value={12} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Allowances
                </Typography>
                <Typography variant="h6">{formatCurrency(10000)}</Typography>
                <LinearProgress variant="determinate" value={8} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Select Year</InputLabel>
                <Select value={selectedYear} label="Select Year" onChange={(e) => setSelectedYear(e.target.value)}>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" startIcon={<IconDownload />} fullWidth>
                Download Statement
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" startIcon={<IconChartBar />} fullWidth>
                View Analytics
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Earnings Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Earnings Breakdown
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Basic Salary</TableCell>
                  <TableCell align="right">HRA</TableCell>
                  <TableCell align="right">DA</TableCell>
                  <TableCell align="right">Allowances</TableCell>
                  <TableCell align="right">Bonus</TableCell>
                  <TableCell align="right">Overtime</TableCell>
                  <TableCell align="right">Total Earnings</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Net Salary</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {earningsData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell align="right">{formatCurrency(row.basicSalary)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.hra)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.da)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.allowances)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.bonus)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.overtime)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(row.totalEarnings)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(row.deductions)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatCurrency(row.netSalary)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary">
                          <IconEye size={16} />
                        </IconButton>
                      </Tooltip>
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

export default MyEarnings;
