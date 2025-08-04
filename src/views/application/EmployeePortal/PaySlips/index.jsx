import {
  Autocomplete,
  Box,
  CircularProgress,
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
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import { generateFinancialYears } from 'utils/FinancialYearsList';
import MainCard from '../../../../ui-component/cards/MainCard';
import Factory from 'utils/factory';

const PaySlips = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paySlips, setPaySlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);

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

  // const fetchPaySlips = async (financialYear) => {
  //   try {
  //     setLoading(true);
  //     // Replace this block with real API call
  //     setTimeout(() => {
  //       setPaySlips([
  //         {
  //           id: 1,
  //           month: 'January 2024',
  //           gross_pay: '25555swdefgrthyjukil',
  //           deductions: '2222',
  //           income: '23333789456123654788888',
  //           net_pay: '23333',
  //           download_url: '#'
  //         },
  //         {
  //           id: 2,
  //           month: 'February 2024',
  //           gross_pay: '27500',
  //           deductions: '2500asdfghjklasdfghj',
  //           income: '25000',
  //           net_pay: '25000014785296325478888',
  //           download_url: '#'
  //         }
  //       ]);
  //       setLoading(false);
  //     }, 1000);
  //   } catch (error) {
  //     console.error('Error fetching pay slips:', error);
  //     setLoading(false);
  //   }
  // };
  const fetchPaySlips = async (financialYear) => {
    try {
      setLoading(true);

      const { res } = await Factory('get', `/payroll/employee-payslips-by-financial-year/?financial_year=${financialYear}`, {});

      if (res?.status_cd === 0 && Array.isArray(res?.data)) {
        setPaySlips(res.data);
      } else {
        setPaySlips([]);
      }
    } catch (error) {
      console.error('Error fetching pay slips:', error);
      setPaySlips([]);
    } finally {
      setLoading(false);
    }
  };

  const viewPayslip = async (employee_id, month, financial_year) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `${baseURL}/payroll/employee-monthly-salary-template?employee_id=${employee_id}&month=${month}&financial_year=${financial_year}&year=${new Date().getFullYear()}`,
        {
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
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
    } catch (error) {
      console.error('Error fetching payslip:', error);
    }
  };

  return (
    <MainCard>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary' }}>
            Select Financial Year
          </Typography>
          <Autocomplete
            options={financialYearOptions}
            value={selectedFinancialYear}
            onChange={handleFinancialYearChange}
            disableClearable
            sx={{ minWidth: 200, maxWidth: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Financial Year"
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    fontWeight: 500
                  }
                }}
              />
            )}
          />
        </Stack>
      </Stack>

      {/* Pay Slips Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, mt: 4 }}>
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
              <TableCell>Pay Period</TableCell>
              <TableCell>Gross Pay</TableCell>
              <TableCell>Deductions</TableCell>
              <TableCell>Income Tax (TDS)</TableCell>
              <TableCell>Net Pay</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ height: 300 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ height: 300 }}>
                  <EmptyDataPlaceholder title="No Pay Slips Found" subtitle="Select a financial year to view your pay slips." />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((paySlip) => (
                <TableRow key={paySlip.id}>
                  <TableCell>{paySlip.month}</TableCell>
                  <TableCell>{paySlip.gross_pay}</TableCell>
                  <TableCell>{paySlip.deductions}</TableCell>
                  <TableCell>{paySlip.income}</TableCell>
                  <TableCell>{paySlip.net_pay}</TableCell>
                  {/* <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        textDecoration: 'underline',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => downloadPaySlip(paySlip.download_url)}
                    >
                      Download
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        textDecoration: 'underline',
                        whiteSpace: 'nowrap',
                        textAlign: 'left'
                      }}
                      onClick={() => {
                        viewPayslip(paySlip.employee, paySlip.month, selectedFinancialYear);
                      }}
                    >
                      View / Download
                    </Typography>
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
    </MainCard>
  );
};

export default PaySlips;
