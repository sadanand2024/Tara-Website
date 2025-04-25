import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Stack } from '@mui/material';
// import EmptyTable from '@/components/third-party/table/EmptyTable';
import Factory from 'utils/Factory';
// import { useSnackbar } from '@/components/CustomSnackbar';
import MainCard from '../../ui-component/cards/MainCard';

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
const TABLE_HEADERS = ['EPF', 'ESI', 'PT', 'TDS'];

export default function PayrollComplianceSummary({ payrollId, financialYear }) {
  const [financialYearSummary, setFinancial_year_summary] = useState([]);
  const [loading, setLoading] = useState(false);
  // const { showSnackbar } = useSnackbar();

  const get_financialYearData = async (year) => {
    setLoading(true);
    let url = `/payroll/payroll_financial-year-summary?payroll_id=${payrollId}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setFinancial_year_summary(Array.isArray(res.data.financial_year_summary) ? res.data.financial_year_summary : []);
    } else {
      // showSnackbar(JSON.stringify(res?.data?.error), 'error');
    }
  };
  useEffect(() => {
    if (payrollId && financialYear) {
      get_financialYearData();
    }
  }, [payrollId, financialYear]);
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
                    if (header === 'EPF') {
                      return <TableCell key={colIndex}>{data.ctc || '-'}</TableCell>;
                    } else if (header === 'ESI') {
                      return <TableCell key={colIndex}>{data.status || '-'}</TableCell>;
                    } else if (header === 'PT') {
                      return <TableCell key={colIndex}>{data.status || '-'}</TableCell>;
                    } else if (header === 'TDS') {
                      return <TableCell key={colIndex}>{data.status || '-'}</TableCell>;
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
