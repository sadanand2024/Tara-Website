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
const TABLE_HEADERS = ['EPF', 'ESI', 'PT', 'TDS'];

export default function PayrollComplianceSummary({ payrollId, financialYear }) {
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

  const getComplianceValue = (data, header) => {
    if (!data) return '-';
    switch (header) {
      case 'EPF':
        return data.epf || '-';
      case 'ESI':
        return data.esi || '-';
      case 'PT':
        return data.pt || '-';
      case 'TDS':
        return data.tds || '-';
      default:
        return '-';
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <MainCard>
        <>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Payroll Compliance Summary
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
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fafafa', whiteSpace: 'nowrap' }}>{header}</TableCell>
                    {MONTHS.map((month) => {
                      const data = financialYearSummary.find((item) => item.month?.toLowerCase() === month.toLowerCase()) || {};
                      return (
                        <TableCell key={month} align="center">
                          {getComplianceValue(data, header)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </MainCard>
    </Stack>
  );
}
