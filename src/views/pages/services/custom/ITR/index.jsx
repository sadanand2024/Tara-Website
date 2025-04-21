import React from 'react';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';
import ThirdSection from './ThirdSection';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ThemeMode } from 'config';

const ITRFilingPage = () => {
  const theme = useTheme();

  return (
    <>
      <FirstSection />
      <Box sx={{ py: 12.5 }}>
        <SecondSection />
      </Box>

      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : '#fde9e0' }}>
        <ThirdSection />
      </Box>
    </>
  );
};
export default ITRFilingPage;
