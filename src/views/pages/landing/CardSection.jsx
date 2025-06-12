import { Box, Grid, Typography } from '@mui/material';
import Tara from 'assets/images/icons/Tara.svg';
import React from 'react';

const SvgSection = () => (
  <section>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: { xs: 2, sm: 3, md: 8 },
        mt: { xs: 35, sm: 20, md: 15 },
        
        backgroundColor: '#FFFEF3',
      }}
    >
      {/* Heading */}
      <Typography
        textAlign="center"
        
        gutterBottom
        sx={{
          fontFamily: 'Inter',
          fontSize: { xs: '28px', sm: '36px', md: '36px' },
          lineHeight: '130%',
          fontWeight: '700',
          mb: { xs: 2, md: 3 },
          px: { xs: 8, sm: 2 },
          mt: { xs: 8, sm:22, md:22 },
         textAlign: { xs: 'center', sm: 'center', md: 'center' },
        //  whiteSpace: { xs: 'nowrap', md: 'nowrap',lg: 'nowrap'}


        }}
      >
        Simplify Everything,
        <br />
        Finance, Compliance, Documentation.
      </Typography>

      {/* Subtitle */}
     <Typography 
        textAlign="center"
        gutterBottom
        sx={{
          fontFamily: 'Inter',
          fontSize: { xs: '16px', sm: '18px', md: '18px' },
          lineHeight: '28px',
          fontWeight: '500',
          color: 'text.secondary',
          mb: { xs: 4, sm: 6, md:8 },
          mt:{md:-1},
          px: { xs: 2, sm: 3, md: 0 },
          maxWidth: { xs: '100%', sm: '90%', md: '800px' },
          //  whiteSpace: { xs: 'nowrap', md: 'nowrap',lg: 'nowrap'}

        }}
      >
        Tired of juggling multiple vendors and tools?<br/>
        <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
          {' '}With Tara First, you get a unified platform built for individuals, startups, SMEs,
        </Box><br/>
        <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
          {' '} consultants, and enterprises.
        </Box>
      </Typography>

      {/* SVG + Image layout */}
     <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: { xs: '100%', sm: '90%', md: '200%' },
    mt: -6,
  }}
>
  <Box
    sx={{
      mt: { xs: 2, sm: 4, md: 6 },
      px: { xs: 1, sm: 2, md: 0 },
      ml: { xs: 0, sm: 2, md: 3 },
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    }}
  >
    <Box
      component="img"
      src={Tara}
      alt="Tara Logo"
      sx={{
        width: '100%',
        maxWidth: { xs: '600px', sm: '800px', md: '1200px', lg: '1400px' }, // Increased widths
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  </Box>
</Box>
    </Box>
  </section>
);

export default SvgSection;