'use client';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import { useSnackbar } from '@/components/CustomSnackbar';
import { Typography } from '@mui/material';
import PayrollSummary from './PayrollSummary';
import MainCard from '@/components/MainCard';
import PayrollStatusSummary from './PayrollStatusSummary';
export default function Services({ financial_year_summary }) {
  return (
    <Stack sx={{ gap: 4 }}>
      <PayrollSummary />
    </Stack>
  );
}
