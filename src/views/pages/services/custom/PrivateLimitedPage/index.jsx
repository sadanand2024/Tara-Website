import React from 'react';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';
import ThirdSection from './ThirdSection';
import FourthSection from './FourthSection';
import FAQs from './FAQs';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ThemeMode } from 'config';

const PrivateLimitedPage = () => {
  const theme = useTheme();

  return (
    <>
      <FirstSection />
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100' }}>
        <SecondSection />
      </Box>
      <Box sx={{ py: 12.5 }}>
        <ThirdSection />
      </Box>
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100' }}>
        <FAQs />
      </Box>
      <Box sx={{ py: 12.5 }}>
        <FourthSection />
      </Box>
    </>
  );
};

export default PrivateLimitedPage;
