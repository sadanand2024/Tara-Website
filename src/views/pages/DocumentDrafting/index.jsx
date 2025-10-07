import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import React from 'react';
import FinalSection from './DocumentPage/FinalSection';
import HeroSection from './DocumentPage/HeroSection';
import FooterSection from '../landing/FooterSection';

const index = () => {
   const theme = useTheme();
  return (
    <div>
      <HeroSection />
      <Box sx={{ mt: { xs: -5, md: -14 }, position: 'relative', zIndex: 2 }}>
        <FinalSection />
      </Box>
       <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0,textAlign: 'left' }}>
    <FooterSection />
     </Box>
    </div>
  );
}
export default index