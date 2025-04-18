import React from 'react';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';
import DocumentBlock from './DocumentBlock';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ThemeMode } from 'config';

const PrivateLimitedPage = () => {
  const theme = useTheme();

  return (
    <>
      <FirstSection />
      <Box sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : '#fde9e0' }}>
        <SecondSection />
      </Box>
      <Box sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100' }}>
        <DocumentBlock />
      </Box>
    </>
  );
};

export default PrivateLimitedPage;
