import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Chip
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import Factory from 'utils/Factory';
import { generateFinancialYears } from 'utils/FinancialYearsList';
import MainCard from '../../../../ui-component/cards/MainCard';
let baseURL = import.meta.env.VITE_APP_BASE_URL;

const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return month < 4 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
};

const getCurrentMonth = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[new Date().getMonth()];
};

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const PaySlips = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paySlips, setPaySlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const navigate = useNavigate();

  const financialYearOptions = generateFinancialYears(10);

  useEffect(() => {
    const year = searchParams.get('financialYear');
    if (year) {
      setSelectedFinancialYear(year);
      fetchPaySlips(year);
    }
  }, [searchParams]);

  const totalPages = Math.ceil(paySlips.length / rowsPerPage);
  const paginatedData = paySlips.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (_, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFinancialYearChange = (event, newValue) => {
    setSelectedFinancialYear(newValue);
    const params = new URLSearchParams(searchParams);
    if (newValue) {
      params.set('financialYear', newValue);
    } else {
      params.delete('financialYear');
    }
    window.history.replaceState(null, '', `?${params.toString()}`);

    if (newValue) fetchPaySlips(newValue);
  };

  const handleMonthChange = (event, newValue) => {
    setSelectedMonth(newValue);
  };

  // Mock data for summary cards - in real implementation, this would come from API
  const getCurrentMonthSummary = () => {
    return {
      basic: 45000,
      hra: 5000,
      otherAllowances: 5000,
      grossEarnings: 55000,
      employeePF: 1000,
      hraDeduction: 3000,
      otherDeductions: 500,
      grossDeductions: 4500,
      netPay: 51000,
      payDay: '30 Sep'
    };
  };

  const getTillDateSummary = () => {
    return {
      grossEarnings: 444000,
      employeePF: 10800,
      esi: 0,
      professionalTax: 1200,
      tds: 17400,
      netPay: 414000,
      period: 'Apr- Sep 2025'
    };
  };

  const getSmallCardsData = () => {
    return {
      pfThisMonth: 1000,
      tdsThisMonth: 1000,
      reimbursementPending: 1000,
      leaveWithoutPay: 2
    };
  };

  const fetchPaySlips = async (financialYear) => {
    setLoading(true);

    const { res } = await Factory('get', `/payroll/employee-payslips-by-financial-year/?financial_year=${financialYear}`, {});

    if (res?.status_cd === 0 && Array.isArray(res.data)) {
      // Transform data to expected frontend shape
      const formatted = res.data.map((item) => ({
        id: item.id,
        employee: item.employee,
        month_year: item.month_year,
        month: item.month,
        financial_year: item.financial_year,
        gross_salary: item.gross_salary,
        deduction: item.deduction,
        tds: item.tds,
        net_salary: item.net_salary
      }));
      setPaySlips(formatted);
    } else {
      setPaySlips([]);
    }
    setLoading(false);
  };

  const viewPayslip = async (employee_id, month, financial_year) => {
    const tokens = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(
      `${baseURL}/payroll/employee-monthly-salary-template?employee_id=${employee_id}&month=${month}&financial_year=${financial_year}&year=${new Date().getFullYear()}`,
      {
        responseType: 'arraybuffer'
      }
    );
    if (response.data.byteLength > 0) {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
      console.error('Empty PDF received.');
    }
  };
  useEffect(() => {
    const year = searchParams.get('financialYear') || getCurrentFinancialYear();
    setSelectedFinancialYear(year);
    fetchPaySlips(year);
  }, []);

  const currentMonthData = getCurrentMonthSummary();
  const tillDateData = getTillDateSummary();
  const smallCardsData = getSmallCardsData();

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      {/* Top Filter Section */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
          <Autocomplete
            options={financialYearOptions}
            value={selectedFinancialYear}
            onChange={handleFinancialYearChange}
            disableClearable
            sx={{ minWidth: 180 }}
            renderInput={(params) => <TextField {...params} placeholder="Year" size="small" sx={{}} />}
          />
          <Autocomplete
            options={monthOptions}
            value={selectedMonth}
            onChange={handleMonthChange}
            disableClearable
            sx={{ minWidth: 180 }}
            renderInput={(params) => <TextField {...params} placeholder="Month" size="small" sx={{}} />}
          />
          <Button
            variant="outlined"
            sx={{
              color: '#2c3e50',
              textTransform: 'none',
              minWidth: 140,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View Form 16
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              minWidth: 160,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Download Payslip
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards Section */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* This Month Summary Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h3" sx={{}}>
                    This Month Summary
                  </Typography>
                  <Chip
                    label={`Pay day: ${currentMonthData.payDay}`}
                    size="small"
                    sx={{
                      fontWeight: 600
                    }}
                  />
                </Stack>

                <Grid container spacing={3}>
                  {/* Earnings Column */}
                  <Grid item xs={6}>
                    <Box sx={{}}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 700,

                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        💰 Earnings
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2">Basic</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{currentMonthData.basic?.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#374151' }}>
                            HRA
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{currentMonthData.hra?.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#374151' }}>
                            Other Allowances
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{currentMonthData.otherAllowances?.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            borderTop: '2px solid rgba(34, 197, 94, 0.3)',
                            pt: 2,
                            mt: 2
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Gross Earnings
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            ₹{currentMonthData.grossEarnings.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Deductions Column */}
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 700,
                          color: '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        📉 Deductions
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#374151' }}>
                            Employee PF
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{currentMonthData.employeePF.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#374151' }}>
                            HRA
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{currentMonthData.hraDeduction.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#374151' }}>
                            Other Allowances
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{currentMonthData.otherDeductions.toLocaleString()}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            borderTop: '2px solid rgba(239, 68, 68, 0.3)',
                            pt: 2,
                            mt: 2
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Gross Deductions
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            ₹{currentMonthData.grossDeductions.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                {/* Net Pay */}
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      💳 Net Pay
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      ₹{currentMonthData.netPay.toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Till Date Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h3">Till Date</Typography>
                  <Chip
                    label={tillDateData.period}
                    size="small"
                    sx={{
                      fontWeight: 600
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        Gross Earnings
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{tillDateData.grossEarnings.toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        Employee PF
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{tillDateData.employeePF.toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        ESI(if Applicable)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{tillDateData.esi.toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        Professional Tax
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{tillDateData.professionalTax.toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        TDS
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{tillDateData.tds.toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        borderTop: '2px solid rgba(245, 158, 11, 0.3)',
                        pt: 2,
                        mt: 2
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#d97706' }}>
                        Net Pay
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#d97706' }}>
                        ₹{tillDateData.netPay.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Small Cards Row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      🏦 PF (This Month)
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      ₹{smallCardsData.pfThisMonth.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      📊 TDS (This Month)
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,

                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      ₹{smallCardsData.tdsThisMonth.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      💰 Reimbursement Pending
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,

                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      ₹{smallCardsData.reimbursementPending.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      🏖️ Leave without Pay
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {smallCardsData.leaveWithoutPay} days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Payslip History Section */}
        <Card sx={{ backgroundColor: '#fafafa' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Payslip History (FY)
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
              <Table size="small">
                <TableHead
                  sx={{
                    backgroundColor: '#e0e0e0',
                    '& .MuiTableCell-root': {
                      color: 'text.primary',
                      fontWeight: 600
                    }
                  }}
                >
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Gross (₹)</TableCell>
                    <TableCell>Deductions (₹)</TableCell>
                    <TableCell>Net (₹)</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ height: 300 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ height: 300 }}>
                        <EmptyDataPlaceholder title="No Pay Slips Found" subtitle="Select a financial year to view your pay slips." />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((paySlip) => (
                      <TableRow key={paySlip.id}>
                        <TableCell>{paySlip.month_year}</TableCell>
                        <TableCell>{paySlip.gross_salary}</TableCell>
                        <TableCell>{paySlip.deduction}</TableCell>
                        <TableCell>{paySlip.net_salary}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              backgroundColor: '#e0e0e0',
                              border: 'none',
                              color: 'text.primary',
                              textTransform: 'none',
                              '&:hover': {
                                backgroundColor: '#d0d0d0'
                              }
                            }}
                            onClick={() => viewPayslip(paySlip.employee, paySlip.month, paySlip.financial_year)}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {paySlips.length > 0 && (
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 2 }}>
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} shape="rounded" color="primary" />
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PaySlips;
