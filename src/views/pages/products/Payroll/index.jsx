import React from 'react';
import FirstSection from './FirstSection';
import FeatureSection from './FeatureSection';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ThemeMode } from 'config';

const PayrollPage = () => {
  const theme = useTheme();

  return (
    <>
      <FirstSection />
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100' }}>
        <FeatureSection />
      </Box>
    </>
  );
};

export default PayrollPage;
