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
import Factory from 'utils/Factory';
import { BASE_URL } from '../../../../constants';
import axios from 'axios';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { useSearchParams } from 'react-router-dom';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
const TABLE_HEADERS = [
  'Employee Id',
  'Name',
  'Department',
  'Designation',
  'Total Days',
  'LOP',
  'Paid Days',
  'CTC',
  'Actual Gross',
  'Earned Gross',
  'Basic',
  'HRA',
  'Special Allowances',
  'Bonus/Incentives',
  'Other Earnings',
  'Total Earnings',
  'Deductions',
  'PF',
  'ESI',
  'PT',
  'TDS',
  'Loans/Advances',
  'Other Deductions',
  'Total Deductions',
  'Net Pay',
  'Status'
];

const DetailedPayroll = ({ payrollId, month }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [detailedSummary, setDetailedSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [financialYear, setFinancialYear] = useState(null);
  useEffect(() => {
    const year = searchParams.get('financialYear');
    if (year) setFinancialYear(year);
  }, [searchParams]);

  const totalPages = Math.ceil(detailedSummary.length / rowsPerPage);
  const paginatedData = detailedSummary.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (_, newPage) => {
    setCurrentPage(newPage);
  };

  const fetchDetailedSummary = async () => {
    try {
      setLoading(true);
      const url = `/payroll/detail_employee_payroll_salary?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;
      const { res } = await Factory('get', url, {});
      if (res.status_cd === 0) {
        const responseData = res.data;
        if (Array.isArray(responseData)) {
          setDetailedSummary(responseData);
        } else {
          console.error('Invalid API response: Expected array, got', typeof responseData);
          setDetailedSummary([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (payrollId && financialYear) fetchDetailedSummary();
  }, [payrollId, financialYear]);

  const viewPayslip = async (employee_id, month, financial_year) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('auth-user'));
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
        console.error('Empty PDF received.');
      }
    } catch (error) {
      console.error('Error fetching payslip:', error);
    }
  };
  return (
    <MainCard title="Detailed Payroll Summary">
      <Stack spacing={3}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table>
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
                    <TableCell>{item.employee}</TableCell>
                    <TableCell>{item.employee_name}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.designation}</TableCell>
                    <TableCell>{item.total_days_of_month}</TableCell>
                    <TableCell>{item.lop}</TableCell>
                    <TableCell>{item.paid_days}</TableCell>
                    <TableCell>{item.ctc}</TableCell>
                    <TableCell>{item.gross_salary}</TableCell>
                    <TableCell>{item.earned_salary}</TableCell>
                    <TableCell>{item.basic_salary}</TableCell>
                    <TableCell>{item.hra}</TableCell>
                    <TableCell>{item.special_allowance}</TableCell>
                    <TableCell>{item.bonus}</TableCell>
                    <TableCell>{item.other_earnings}</TableCell>
                    <TableCell>{item.benefits_total}</TableCell>
                    <TableCell>{item.total_deductions}</TableCell>
                    <TableCell>{item.epf}</TableCell>
                    <TableCell>{item.esi}</TableCell>
                    <TableCell>{item.pt}</TableCell>
                    <TableCell>{item.tds}</TableCell>
                    <TableCell>{item.loans_advances}</TableCell>
                    <TableCell>{item.other_deductions}</TableCell>
                    <TableCell>{item.total_deductions}</TableCell>
                    <TableCell>{item.net_salary}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
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

        {detailedSummary.length > 0 && (
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 2 }}>
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} shape="rounded" color="primary" />
          </Stack>
        )}
      </Stack>
    </MainCard>
  );
};

export default DetailedPayroll;
