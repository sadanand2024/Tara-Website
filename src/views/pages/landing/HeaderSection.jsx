import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Icon1 from 'assets/images/icons/Icon1.svg';
import Icon2 from 'assets/images/icons/Icon2.svg';
import Icon3 from 'assets/images/icons/Icon3.svg';

// third party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

import { ThemeDirection, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import BgDark from 'assets/images/landing/bg-hero-block-dark.png';
import BgLight from 'assets/images/landing/bg-hero-block-light.png';
import dashboard from 'assets/images/landing/Invoicedashboard.png';

// styles
const HeaderImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  borderRadius: 20,
}));

const HeaderAnimationImage = styled('img')({
  maxWidth: '100%',
  filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))'
});

// ==============================|| LANDING - HEADER PAGE ||============================== //

export default function HeaderSection() {
  const { mode, themeDirection } = useConfig();

  const headerSX = { fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '2.5rem' } };

  const HeaderAnimationImagememo = useMemo(
    () => (
      <HeaderAnimationImage
        src={mode === ThemeMode.DARK ? BgDark : BgLight}
        alt="Berry"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          filter: 'none',
          bottom: { md: 0 },
          right: 0,
          width: '50%',
          transformOrigin: '50% 50%',
          transform: themeDirection === ThemeDirection.RTL ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      />
    ),
    [themeDirection, mode]
  );

  return (
    <Container sx={{ 
      height: { xs: 'auto', md: '100vh' }, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      py: { xs: 4, md: 0 },
      mt: { xs: -5, sm: -8, md: -10 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Grid
        container
        spacing={{ xs: 3, sm: 4, md: 2 }}
        sx={{
          justifyContent: { xs: 'center', md: 'space-between' },
          alignItems: { xs: 'center', md: 'flex-start' },
          mt: { xs: 3, sm: 5, md: 18.75 },
          mb: { xs: 3, sm: 4, md: 10 },
        }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mt: { xs: 2, sm: 3, md: 5 } }}>
            <Grid size={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
              >
                <Box sx={{ 
                  mt: { xs: 2, sm: 4, md: 6 },
                  display: 'flex',
                  flexDirection: 'column', 
                  alignItems: { xs: 'center', sm: 'center', md: 'flex-start' },
                  textAlign: { xs: 'center', sm: 'center', md: 'left' },
                  gap: { xs: 0.5, md: 1 },
                }}>
                  <Typography 
                    variant="h1"
                    sx={{ 
                      ...headerSX, 
                      fontWeight: 700,
                      lineHeight: 1.0,
                      display: 'block',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      whiteSpace: { xs: 'normal', md: 'nowrap' }
                    }}
                  >
                    Unified Software for
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      ...headerSX,
                      fontWeight: 700,
                      lineHeight: 1.0,
                      display: 'block',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      whiteSpace: { xs: 'normal', md: 'nowrap' }
                    }}
                  >
                    Invoicing, Payroll, ITR, GST,
                  </Typography>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      ...headerSX, 
                      fontWeight: 700,
                      lineHeight: 1,
                      display: 'block',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      whiteSpace: { xs: 'normal', md: 'nowrap' }
                    }}
                  >
                    Accounting & More
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            <Grid sx={{ mt: { xs: 0, md: -2.5 }, textAlign: { xs: 'center', sm: 'center', md: 'left' } }} size={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mt: { xs: 1, sm: 1.5, md: 2 }, 
                    textAlign: { xs: 'center', sm: 'center', md: 'left' }, 
                    color: 'text.secondary', 
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    mb: { xs: 2, sm: 2.5, md: 3 }, 
                    lineHeight: 1.4,
                    fontWeight: 400,
                    px: { xs: 1, sm: 2, md: 0 }
                  }}
                >
                  No more juggling tools—just one simple platform.A complete 
                  <br className="hidden md:block" />
                  financial suite for all your Business + Personal finance needs.
                </Typography>
              </motion.div>
            </Grid>

            <Grid size={12} sx={{ mt: { xs: 2, sm: 3, md: 0 } }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.6 }}
              >
                <Stack 
                  direction={{ xs: 'row', sm: 'row' }} 
                  spacing={{ xs: 2, sm: 4 }} 
                  sx={{ 
                    alignItems: 'center', 
                    justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' }, 
                    mb: { xs: 3, sm: 4, md: 5 },
                    mt: { xs: -2, sm: -3, md: -4 }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img src={Icon1} alt="Integration Icon" style={{ width: '30.81px', height: '32.3px' }} />
                    <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>Integration</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img src={Icon2} alt="Automation Icon" style={{ width: '30.81px', height: '32.3px' }} />
                    <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>Automation</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img src={Icon3} alt="Simple Icon" style={{ width: '30.81px', height: '32.3px' }} />

                    <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>Simple</Typography>
                  </Box>
                </Stack>
              </motion.div>
            </Grid>

            <Grid size={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
              >
                <Grid 
                  container 
                  spacing={2} 
                  sx={{ 
                    justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' }, 
                    mb: { xs: 3, sm: 4, md: 5 },
                    mt: { xs: -2, sm: -3, md: -4 }
                  }}
                >
                  <Grid>
                    <AnimateButton>
                      <Button
                        component={RouterLink}
                        to="/register"
                        size="large"
                        variant="contained"
                        color="primary"
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        Get started for free
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid>
                    <AnimateButton>
                      <Button
                        size="large"
                        variant="contained"
                        color="white"
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                      >
                        View Live Demo
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 8}} sx={{ mb: { xs: 3, sm: 4, md: 15 } }}>
          <Box
            sx={{
              position: 'relative',
              mt: { xs: 4, sm: 5, md: 6.75 },
              zIndex: 9,
              width: '100%',
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'center', md: 'flex-end' },
              alignItems: 'center',
              ml: { xs: 0, sm: 0, md: 35 },
            }}
          >
            <HeaderImage 
              src={dashboard} 
              alt="Tara" 
              sx={{
                width: { xs: '100%', sm: '90%', md: '100%' },
                maxWidth: '100%',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}