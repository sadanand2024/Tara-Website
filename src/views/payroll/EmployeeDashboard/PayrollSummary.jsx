import React, { useState } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Pagination, Button } from '@mui/material';
import MainCard from '../../../ui-component/cards/MainCard';
import Factory from 'utils/Factory';
import { BASE_URL } from '../../../../constants';
import axios from 'axios';

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
  'NP'
];

export default function PayrollSummary({ payrollSummaryData = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(Array.isArray(payrollSummaryData) ? payrollSummaryData.length / rowsPerPage : 0);
  const paginatedData = Array.isArray(payrollSummaryData)
    ? payrollSummaryData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

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
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 10000);
      } else {
        // showSnackbar('Invalid response from server', 'error');
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
      // showSnackbar('Invalid response from server', 'error');
    }
  };

  return (
    <MainCard>
      <Stack direction="column" spacing={2}>
        <TableContainer component={Paper}>
          <Table size="large">
            <TableHead>
              <TableRow>
                {TABLE_HEADERS.map((header) => (
                  <TableCell key={header} sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                    {header}
                  </TableCell>
                ))}
                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length} sx={{ height: 300 }}>
                    No Data
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData?.map((item, index) => (
                  <TableRow key={item.employee || index}>
                    <TableCell>{item.employee_name}</TableCell>
                    <TableCell>{item.gross_salary}</TableCell>
                    <TableCell>{item.paid_days}</TableCell>
                    <TableCell>{item.earned_salary}</TableCell>
                    <TableCell>{item.benefits_total}</TableCell>
                    <TableCell>{item.deductions['Employee Deductions']}</TableCell>
                    <TableCell>{item.deductions['Taxes']}</TableCell>
                    <TableCell>{item.recovery}</TableCell>
                    <TableCell>{item.reimbursement}</TableCell>
                    <TableCell>{item.net_salary}</TableCell>
                    <TableCell
                      style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}
                      onClick={() => {
                        viewPayslip(item.employee_id, item.month, item.financial_year);
                      }}
                    >
                      View / Download
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {payrollSummaryData.length > 0 && (
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ px: { xs: 0.5, sm: 2.5 }, py: 1.5 }}>
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
          </Stack>
        )}
      </Stack>
    </MainCard>
  );
}
