import { Box, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Icon1 from 'assets/images/icons/WhyShouldUse/icon1.svg';
import Icon2 from 'assets/images/icons/WhyShouldUse/icon2.svg';
import Icon3 from 'assets/images/icons/WhyShouldUse/icon3.svg';
import Icon4 from 'assets/images/icons/WhyShouldUse/icon4.svg';
import Icon5 from 'assets/images/icons/WhyShouldUse/icon5.svg';
import Icon6 from 'assets/images/icons/WhyShouldUse/icon6.svg';

import React from 'react';
import { Fade } from 'react-awesome-reveal';

const icons = [
  Icon1,
  Icon2,
  Icon3,
  Icon4,
  Icon5,
  Icon6,
];

const WhyChooseUs = ({ reasons }) => {
  return (
    <Container sx={{ py: { xs: 6, md: 8 }, textAlign: 'center',mt:{xs:0,md:0,lg:0} }}>
      <Typography 
        variant="h2" 
        fontWeight={700} 
        mb={1} 
        sx={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 600,
          fontSize: '38px',
          lineHeight: '100%',
          letterSpacing: '0px',
          color: '#000'
        }}
      >
        Why Choose Us?
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {reasons.map((reason, idx) => {
          const IconSrc = icons[idx % icons.length];
          return (
            <Grid size={{xs:12,sm:6,md:4}} key={idx} sx={{ mt: { xs: 0, md: 0, lg: 4 } }}>
              <Fade triggerOnce delay={idx * 100}>
                <Paper
                  elevation={1}
                  sx={{
                    width: { xs: '100%', sm: 374 },
                    maxWidth: 374,
                    height: { xs: 'auto', sm: 180 },
                    minHeight: { xs: 160, sm: 180 },
                    borderRadius: '12px',
                    padding: { xs: '24px 16px', sm: '32px 20px' },
                    gap: '16px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 4px 12px -2px #0042D11A',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textAlign: 'center',
                    transition: '0.3s ease',
                    margin: { xs: '0 auto', sm: 0 },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <img src={IconSrc} alt={`Icon ${idx + 1}`} style={{ width: '48px', height: '48px' }} />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: { xs: '17px', sm: '19px' },
                      fontWeight: 500,
                      lineHeight: { xs: '24px', sm: '26px' },
                      letterSpacing: '0px',
                      color: '#001033',
                      textAlign: 'center',
                    }}
                  >
                    {reason}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default WhyChooseUs;
