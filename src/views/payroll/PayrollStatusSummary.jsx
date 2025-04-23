import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Stack } from '@mui/material';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import Factory from '@/utils/Factory';
import { useSnackbar } from '@/components/CustomSnackbar';
import MainCard from '@/components/MainCard';

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
const TABLE_HEADERS = ['CTC', 'Status', 'Action'];

export default function PayrollStatusSummary({ payrollId, financialYear }) {
  const [financialYearSummary, setFinancial_year_summary] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const get_financialYearData = async () => {
    setLoading(true);
    let url = `/payroll/payroll_financial-year-summary?payroll_id=${payrollId}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setFinancial_year_summary(Array.isArray(res.data.financial_year_summary) ? res.data.financial_year_summary : []);
    } else {
      showSnackbar(JSON.stringify(res?.data?.error), 'error');
    }
  };

  // useEffect to fetch data based on payrollId and financialYear changes
  useEffect(() => {
    // Only fetch data if both payrollId and financialYear are provided
    if (payrollId && financialYear && financialYearSummary.length === 0) {
      get_financialYearData();
    }
  }, [payrollId, financialYear]); // run when payrollId or financialYear changes

  return (
    <Stack direction="column" spacing={2}>
      <MainCard>
        <TableContainer component={Paper}>
          <Table size="large">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}> </TableCell>
                {MONTHS.map((month) => (
                  <TableCell key={month} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_HEADERS.map((header, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{header}</TableCell>
                  {MONTHS.map((month, colIndex) => {
                    const data = financialYearSummary.find((item) => item.month === month) || {};
                    if (header === 'CTC') {
                      return <TableCell key={colIndex}>{data.ctc || '-'}</TableCell>;
                    } else if (header === 'Status') {
                      return <TableCell key={colIndex}>{data.status || '-'}</TableCell>;
                    } else if (header === 'Action') {
                      return (
                        <TableCell key={colIndex}>
                          {data.action && data.action !== '-' ? (
                            <>
                              <span
                                style={{
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  color: '#007bff',
                                  marginRight: 8
                                }}
                              >
                                View
                              </span>
                              <span
                                style={{
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  color: '#007bff'
                                }}
                              >
                                Download
                              </span>
                            </>
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
      </MainCard>
    </Stack>
  );
}
