import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

// image from our assets
import HeroIllustration from 'assets/images/landing/DocumentDrafting.png';
const headerSX = { fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '2.5rem' } };

const HeroSection = () => {
  return (
    <Box sx={{ bgcolor: 'common.white', color: 'text.primary', py: { xs: 8, md:14.5 } }}>
      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, sm: 3, md: 1, lg: 1 } // adjusts margin-top based on screen size
        }}
      >
        <Grid2 container spacing={6} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ maxWidth: 600, textAlign: 'left', mb: 10 }}>
              <Fade cascade direction="up" triggerOnce delay={100}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    ...headerSX,
                    fontWeight: 600,
                    lineHeight: '50px',
                    display: 'block',

                    fontSize: { xs: '2rem', sm: '42px', md: '42px', lg: '42px' },
                    whiteSpace: { xs: 'normal', md: 'nowrap', lg: 'nowrap' }
                  }}
                >
                  Templates for Startup
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    ...headerSX,
                    fontWeight: 600,
                    lineHeight: '50px',
                    display: 'block',
                    mt: 2,
                    fontSize: { xs: '2rem', sm: '42px', md: '42px', lg: '42px' },
                    whiteSpace: { xs: 'normal', md: 'nowrap', lg: 'nowrap' }
                  }}
                >
                  Founders
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: { xs: 1, sm: 1.5, md: 2 },
                    textAlign: { xs: 'center', sm: 'center', md: 'left' },
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    // mb: { xs: 2, sm: 2.5, md: 3 },
                    // lineHeight: 0.5,
                    fontStyle: 'Inter',
                    // ml: { xs:'flex-start', sm:'flex-start', md:'flex-start', lg:'flex-start'},

                    fontWeight: 500
                    // px: { xs: 1, sm: 2, md: 0 }
                    // whiteSpace: { xs: 'nowrap', md: 'nowrap' }
                  }}
                >
                  A collection of ready-to-use. 
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: { xs: 1, sm: 1.5, md: 2 },
                    textAlign: { xs: 'center', sm: 'center', md: 'left' },
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    // mb: { xs: 2, sm: 2.5, md: 3 },
                    // lineHeight: 0.5,
                    fontStyle: 'Inter',
                    // ml: { xs:'flex-start', sm:'flex-start', md:'flex-start', lg:'flex-start'},

                    fontWeight: 500
                    // px: { xs: 1, sm: 2, md: 0 }
                    // whiteSpace: { xs: 'nowrap', md: 'nowrap' }
                  }}
                >
                Customisable templates for business.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: { xs: 1, sm: 1.5, md: 2 },
                    textAlign: { xs: 'center', sm: 'center', md: 'left' },
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    // mb: { xs: 2, sm: 2.5, md: 3 },
                    // lineHeight: 0.5,
                    fontStyle: 'Inter',
                    // ml: { xs:'flex-start', sm:'flex-start', md:'flex-start', lg:'flex-start'},

                    fontWeight: 500
                    // px: { xs: 1, sm: 2, md: 0 }
                    // whiteSpace: { xs: 'nowrap', md: 'nowrap' }
                  }}
                >
                  Prebuilt templates for compliance.                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: { xs: 1, sm: 1.5, md: 2 },
                    textAlign: { xs: 'center', sm: 'center', md: 'left' },
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    // mb: { xs: 2, sm: 2.5, md: 3 },
                    // lineHeight: 0.5,
                    fontStyle: 'Inter',
                    // ml: { xs:'flex-start', sm:'flex-start', md:'flex-start', lg:'flex-start'},

                    fontWeight: 500
                    // px: { xs: 1, sm: 2, md: 0 }
                    // whiteSpace: { xs: 'nowrap', md: 'nowrap' }
                  }}
                >
                  Standardised HR Legal templates.
                </Typography>
                 <Typography
                  variant="body1"
                  sx={{
                    mt: { xs: 1, sm: 1.5, md: 2 },
                    textAlign: { xs: 'center', sm: 'center', md: 'left' },
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    // mb: { xs: 2, sm: 2.5, md: 3 },
                    // lineHeight: 0.5,
                    fontStyle: 'Inter',
                    // ml: { xs:'flex-start', sm:'flex-start', md:'flex-start', lg:'flex-start'},

                    fontWeight: 500
                    // px: { xs: 1, sm: 2, md: 0 }
                    // whiteSpace: { xs: 'nowrap', md: 'nowrap' }
                  }}
                >
                  Templates you can customise
                </Typography>
              </Fade>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end', } }}>
              <Fade cascade direction="down" triggerOnce delay={100}>
                <img
                  src={HeroIllustration}
                  alt="Document templates illustration"
                  style={{
                    width: '100%',
                    maxWidth: 520,
                    borderRadius: 2,
                    height: 'auto'
                  }}
                />
              </Fade>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default HeroSection;
