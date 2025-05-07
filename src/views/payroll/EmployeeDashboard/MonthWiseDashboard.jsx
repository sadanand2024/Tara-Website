// @mui
import { useState, useEffect, useCallback } from 'react';

import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { Box, Button, Paper, Divider, Chip, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
//react

// @project
import MainCard from '../../../ui-component/cards/MainCard';
import Factory from 'utils/Factory';

const ServicesData = [
  {
    id: 1,
    title: 'CTC',
    key: 'total_ctc'
  },

  {
    id: 2,
    title: 'Benefits',
    key: 'total_ctc'
  },
  {
    id: 3,
    title: 'Gross',
    key: 'gross'
  },
  {
    id: 4,
    title: 'Net',
    key: 'total_deductions'
  },
  {
    id: 5,
    title: 'Statuitory Deductions',
    key: 'net_pay'
  },
  {
    id: 6,
    title: 'Professional Tax',
    key: 'epf_total'
  },
  {
    id: 7,
    title: 'TDS',
    key: 'esi_total'
  },
  {
    id: 8,
    title: 'Others',
    key: 'pt_total'
  },
  {
    id: 8,
    title: 'Month Start',
    key: 'tds_total'
  },
  {
    id: 8,
    title: 'New',
    key: 'tds_total'
  },
  {
    id: 8,
    title: 'Exit',
    key: 'tds_total'
  },
  {
    id: 8,
    title: 'Month End',
    key: 'tds_total'
  }
  // { title: 'New Joinees', key: 'total_new_joinees' },
  // { title: 'Exits', key: 'total_exits' }
];
export default function OverviewCard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // JS Date month is 0-indexed, so we add 1 to get the correct month number
  const [monthWiseData, setMonthWiseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (val) => {
    navigate(`corporate-admin/${val}`);
  };
  const searchParams = useSearchParams();

  const [payrollId, setPayrollId] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);
  useEffect(() => {
    const financialYear = searchParams.get('financialYear');
    if (financialYear) setFinancialYear(financialYear);
  }, [searchParams]);
  const get_payrollMonthData = async (monthNumber) => {
    if (!monthNumber) return;

    setLoading(true);
    const url = `/payroll/payroll-summary-view?payroll_id=${payrollId}&month=${monthNumber}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    console.log(res.data);
    if (res?.status_cd === 0) {
      setMonthWiseData(res.data);
    } else {
      // showSnackbar(JSON.stringify(res?.data?.error), 'error');
    }
  };

  useEffect(() => {
    if (payrollId && financialYear) {
      get_payrollMonthData(selectedMonth); // JS Date month is 0-indexed
    }
  }, [payrollId, financialYear]);

  return (
    <MainCard>
      <Grid2
        container
        spacing={2}
        sx={{
          borderRadius: 4
        }}
      >
        {ServicesData.map((card, idx) => (
          <Grid2 key={idx} size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: 'primary.main'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main'
                    }}
                  >
                    {monthWiseData ? (monthWiseData[card.key] ?? 0) : 0}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  textAlign="center"
                  sx={{
                    color: 'text.primary',
                    fontSize: '0.95rem',
                    mr: 4
                  }}
                >
                  {card.title}
                </Typography>
              </Box>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </MainCard>
  );
}
