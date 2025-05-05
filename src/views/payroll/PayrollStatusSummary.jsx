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
  CircularProgress,
  Typography
} from '@mui/material';
import Factory from 'utils/Factory';
import MainCard from '../../ui-component/cards/MainCard';

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
const TABLE_HEADERS = ['CTC', 'Status', 'Action'];

export default function PayrollStatusSummary({ payrollId, financialYear }) {
  const [financialYearSummary, setFinancial_year_summary] = useState([]);
  const [loading, setLoading] = useState(false);

  const get_financialYearData = async () => {
    setLoading(true);
    const url = `/payroll/payroll_financial-year-summary?payroll_id=${payrollId}&financial_year=${financialYear}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setFinancial_year_summary(Array.isArray(res.data.financial_year_summary) ? res.data.financial_year_summary : []);
    } else {
      setFinancial_year_summary([]);
    }
  };

  useEffect(() => {
    if (payrollId && financialYear) {
      get_financialYearData();
    }
  }, [payrollId, financialYear]);

  const handleView = (data) => {
    console.log('View clicked:', data);
  };

  const handleDownload = (data) => {
    console.log('Download clicked:', data);
  };

  return (
    <Stack direction="column" spacing={2}>
      <MainCard>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Payroll Status Summary
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666', whiteSpace: 'nowrap' }}> </TableCell>
                    {MONTHS.map((month) => (
                      <TableCell key={month} align="center" sx={{ fontWeight: 'bold', color: '#666', whiteSpace: 'nowrap' }}>
                        {month}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {TABLE_HEADERS.map((header) => (
                    <TableRow key={header} hover>
                      <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#fafafa' }}>{header}</TableCell>
                      {MONTHS.map((month) => {
                        const data = financialYearSummary.find((item) => item.month?.toLowerCase() === month.toLowerCase()) || {};

                        if (header === 'CTC') {
                          return (
                            <TableCell key={month} align="center">
                              {data.ctc || '-'}
                            </TableCell>
                          );
                        } else if (header === 'Status') {
                          return (
                            <TableCell key={month} align="center">
                              {data.status || '-'}
                            </TableCell>
                          );
                        } else if (header === 'Action') {
                          return (
                            <TableCell key={month} align="center">
                              {data.action && data.action !== '-' ? (
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <span
                                    style={{
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      color: '#1976d2', // Primary color
                                      fontWeight: 500
                                    }}
                                    // onClick={() => handleView(data)}
                                  >
                                    View
                                  </span>
                                </Stack>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          );
                        }
                        return null;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </MainCard>
    </Stack>
  );
}
