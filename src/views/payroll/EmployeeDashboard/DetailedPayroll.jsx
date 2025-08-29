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
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import MainCard from '../../../ui-component/cards/MainCard';
import Factory from 'utils/Factory';
let baseURL = import.meta.env.VITE_APP_BASE_URL;

import axios from 'axios';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { useSearchParams } from 'react-router-dom';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
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

// Utility function to format numbers with Indian comma separators
const formatNumberIN = (value) => {
  if (value === null || value === undefined || value === '' || isNaN(Number(value))) return 'NA';
  return Number(value).toLocaleString('en-IN');
};

const DetailedPayroll = ({ payrollId, month }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [detailedSummary, setDetailedSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [financialYear, setFinancialYear] = useState(null);
  const dispatch = useDispatch();
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
      const url = `/payroll/monthly-salary-details-of-employees?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;
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
    let selected_year = financial_year.split('-')[0];
    try {
      const tokens = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `${baseURL}/payroll/employee-monthly-salary-template?employee_id=${employee_id}&month=${month}&financial_year=${financial_year}&year=${selected_year}`,
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
    <MainCard
      title=" "
      action={
        <Tooltip title="Download Detailed Payroll">
          <IconButton
            color="primary"
            onClick={async () => {
              const type = 'xlsx';
              const url = `/payroll/download-salary-report?payroll_id=${payrollId}&month=${month}&financial_year=${financialYear}`;

              const { res, error } = await Factory('get', url, null, {}, { responseType: 'blob' });

              if (error || !res?.data) {
                dispatch(
                  openSnackbar({
                    open: true,
                    message: (error && error.message) || 'Error downloading file',
                    variant: 'alert',
                    alert: { color: 'error' },
                    close: false
                  })
                );
                return;
              }

              const blob = new Blob([res.data], {
                type: type === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });

              const downloadUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.setAttribute('download', `salary-report.${type}`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(downloadUrl);
            }}
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
        </Tooltip>
      }
    >

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
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
                  <EmptyDataPlaceholder title="No Data Found" subtitle="Generate payroll to view data." />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={item.employee_id || index}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.associate_id}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.employee_name}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.department}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.designation}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.total_days_of_month)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.lop)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.paid_days)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.ctc)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.gross_salary)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.earned_salary)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.basic_salary)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.hra)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.special_allowance)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.bonus)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.other_earnings)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.benefits_total)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.total_deductions)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.epf)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.esi)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.pt)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.tds)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.loans_advances)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.other_deductions)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.total_deductions)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumberIN(item.net_salary)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.status}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        textDecoration: 'underline',
                        whiteSpace: 'nowrap',
                        textAlign: 'center'
                      }}
                      onClick={() => {
                        viewPayslip(item.employee, item.month, item.financial_year);
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

      {detailedSummary.length > 0 && (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 2 }}>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} shape="rounded" color="primary" />
        </Stack>
      )}
    </MainCard>
  );
};

export default DetailedPayroll;
