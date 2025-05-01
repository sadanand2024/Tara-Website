import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Pagination,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import MainCard from '../../../ui-component/cards/MainCard';
import { BASE_URL } from '../../../../constants';
import axios from 'axios';
import Factory from 'utils/Factory';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const TABLE_HEADERS = [
  'Employee',
  'Gross',
  'Paid Days',
  'Earned Gross',
  'Benefits',
  'Deductions',
  'Taxes',
  'Recovery',
  'Reimbursement',
  'Net Pay'
];

const PayrollSummary = ({ payrollId, month, financialYear }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [payrollSummaryData, setPayrollSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(Array.isArray(payrollSummaryData) ? payrollSummaryData.length / rowsPerPage : 0);
  const dispatch = useDispatch();
  const paginatedData = Array.isArray(payrollSummaryData)
    ? payrollSummaryData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const viewPayslip = async (employee_id, month, financial_year) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `${BASE_URL}/payroll/employee-monthly-salary-template?employee_id=${employee_id}&month=${month}&financial_year=${financial_year}&year=${new Date().getFullYear()}`,
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
        dispatch(
          openSnackbar({
            open: true,
            message: 'Empty PDF received.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error fetching payslip PDF.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const fetchPayrollSummary = async () => {
    setLoading(true);
    const url = `/payroll/calculate-employee-monthly-salary?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 0) {
      setPayrollSummaryData(res.data || []);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }

    setLoading(false);
  };
  useEffect(() => {
    if (payrollId && financialYear) fetchPayrollSummary();
  }, [payrollId, financialYear]);
  return (
    <MainCard title="Payroll Summary">
      <Stack spacing={3}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {TABLE_HEADERS.map((header, idx) => (
                  <TableCell key={idx} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {header}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length + 1} align="center" sx={{ height: 300 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length + 1} align="center" sx={{ height: 300 }}>
                    <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding a new record." />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.employee_id || index}>
                    <TableCell>{item.employee_name || '-'}</TableCell>
                    <TableCell>{item.gross_salary || '-'}</TableCell>
                    <TableCell>{item.paid_days || '-'}</TableCell>
                    <TableCell>{item.earned_salary || '-'}</TableCell>
                    <TableCell>{item.benefits_total || '-'}</TableCell>
                    <TableCell>{item.deductions?.['Employee Deductions'] ?? '-'}</TableCell>
                    <TableCell>{item.deductions?.['Taxes'] ?? '-'}</TableCell>
                    <TableCell>{item.recovery || '-'}</TableCell>
                    <TableCell>{item.reimbursement || '-'}</TableCell>
                    <TableCell>{item.net_salary || '-'}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          color: 'primary.main'
                        }}
                        onClick={() => viewPayslip(item.employee_id, item.month, item.financial_year)}
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

        {payrollSummaryData.length > 0 && (
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 2 }}>
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} shape="rounded" color="primary" />
          </Stack>
        )}
      </Stack>
    </MainCard>
  );
};

export default PayrollSummary;
