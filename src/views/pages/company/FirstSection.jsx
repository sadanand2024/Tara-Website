import { Box, Typography } from '@mui/material';
import Company1 from 'assets/images/company/Company1.png';
import React from 'react';

const FirstSection = () => (
  <Box sx={{ py: 8, px: { xs: 2, md: 8 }, background: '#fff', width: '100%' }}>
    <Typography variant="h1" align="center" fontWeight={700} mb={2}sx={{mt:6}}>
      About Tara First
    </Typography>
    <Typography
      variant="h4"
      align="center"
      color="text.secondary"
      mb={5}
      sx={{ maxWidth: 700, mx: 'auto' }}
    >
      Tara First is building the future of financial infrastructure for businesses and professionals.
      We blend technology and expertise to simplify services like incorporation, compliance, payroll, and invoicing—all in one unified platform.
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
      <Box
        component="img"
        src={Company1}
        alt="About Tara First"
        sx={{
          width: '100%',
          maxWidth: 1200,
          height:350,
          objectFit: 'cover',
          borderRadius: 6,
          boxShadow: 3,
        }}
      />
    </Box>
  </Box>
);

export default FirstSection;
