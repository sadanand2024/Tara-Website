import { Box, Typography } from '@mui/material';
import Company1 from 'assets/images/company/Company1.png';
import React from 'react';

const HeroSection = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 8 }, background: '#fff', width: '100%' }}>
    <Typography variant="h1" align="center" fontWeight={700} mb={2}sx={{mt:6}}>
    We're Redefining Financial Simplicity
    </Typography>
    <Typography
      variant="h4"
      align="center"
      color="text.secondary"
      mb={5}
      sx={{ maxWidth: 700, mx: 'auto' }}
    >
      Tara First empowers individuals and businesses to take control of their finances through a unified platform that combines expert support, modern tools, and automated compliance — making finance stress-free and streamlined.
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
      <Box
        component="img"
        src={Company1}
        alt="About Tara First"
        sx={{
          width: '100%',
          maxWidth: 1000,
          height:400,
          objectFit: 'cover',
          borderRadius: 6,
          boxShadow: 3,
        }}
      />
    </Box>
  </Box>
);
  
}

export default HeroSection