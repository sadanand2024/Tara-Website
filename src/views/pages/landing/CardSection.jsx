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
        padding: { xs: 2, sm: 3, md: 4 },
        mt: { xs: 35, sm: 20, md: 30 },
        backgroundColor: '#FFFEF3',
      }}
    >
      {/* Heading */}
      <Typography
        textAlign="center"
        gutterBottom
        sx={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: { xs: '28px', sm: '36px', md: '45px' },
          lineHeight: '130%',
          fontWeight: 'bold',
          mb: { xs: 2, md: 3 },
          px: { xs: 8, sm: 2 },
          mt: { xs: 8, sm:22, md:15 },
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
          fontFamily: 'Inter, sans-serif',
          fontSize: { xs: '16px', sm: '18px', md: '20px' },
          lineHeight: '150%',
          fontWeight: '500',
          color: 'text.secondary',
          mb: { xs: 4, sm: 6, md:8 },
          mt:{md:-1},
          px: { xs: 2, sm: 3, md: 0 },
          maxWidth: { xs: '100%', sm: '90%', md: '800px' }
        }}
      >
        Tired of juggling multiple vendors and tools?
        <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
          {' '}With Tara First, you get a unified platform built for individuals, startups, SMEs,
        </Box>
        <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
          {' '}consultants, and enterprises.
        </Box>
      </Typography>

      {/* SVG + Image layout */}
      <Grid
        container
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '90%', md: '1200px' }
        }}
      >
        <Grid 
          item 
          xs={12} 
          sm={10} 
          md={8} 
          display="flex" 
          justifyContent="center" 
          sx={{ 
            mt: { xs: 2, sm: 4, md: 6 },
            px: { xs: 1, sm: 2, md: 0 },
            ml: { xs: 0, sm: 2, md: 3 },
          }}
        >
          {/* Tara SVG */}
          <Box
            component="img"
            src={Tara}
            alt="Tara Logo"
            sx={{
              width: '200%',
              maxWidth: { xs: '480px', sm: '600px', md: '800px', lg: '1000px' },
              height: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </Grid>
      </Grid>
    </Box>
  </section>
);

export default SvgSection;