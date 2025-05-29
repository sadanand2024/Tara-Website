import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import heroPerson from 'assets/images/landing/hero-person.png';
import { useNavigate, useSearchParams } from 'react-router-dom';

import React from 'react';
import { Fade } from 'react-awesome-reveal';

const HeroWithImage = ({ data }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const service_id = searchParams.get('id');
  const service_type = searchParams.get('type');
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 4, sm: 6, md: 8, lg: 10 },
        mt: { xs:10, sm: 2, md: 4, lg: -5 },
        borderRadius: { xs: 2, sm: 3, md: 4 },
        background: 'white',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, sm: 4, md: 6, lg: 8 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ 
            flex: 1, 
            textAlign: { xs: 'center', md: 'left' },
            width: { xs: '100%', md: '50%' }
          }}>
            <Fade cascade damping={0.1} triggerOnce>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '44px' },
                  lineHeight: { xs: '1.3', sm: '1.4', md: '1.5', lg: '54px' },
                  letterSpacing: '0%',
                  color: 'text.primary',
                  textAlign: { xs: 'center', md: 'left' },
                  wordBreak: 'break-word',
                  mb: { xs: 3, sm: 4, md: 6, lg:2 }
                }}
              >
                {data.title}
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem', lg: '20px' },
                  lineHeight: { xs: '1.4', sm: '1.5', md: '1.6', lg: '29px' },
                  letterSpacing: '0%',
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 4, sm: 6, md: 8, lg: 4 }
                }}
              >
                {data.subtitle}
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                alignItems={{ xs: 'stretch', sm: 'center', md: 'flex-start' }}
                sx={{ width: '100%' }}
              >
                {data.ctas.map((cta, idx) => (
                  <Button
                    key={idx}
                    variant={idx === 0 ? 'contained' : 'outlined'}
                    size="large"
                    color="primary"
                    onClick={() => {
                      if (idx === 0) {
                        navigate(`/register?id=${service_id}&context=${service_type}&type=service`);
                      } else if (cta.label === "Talk to Tax Expert") {
                        navigate(`/book-consultation?id=${service_id}&context=${service_type}&type=service`);
                      } else {
                        navigate('/pages/contact-us');
                      }
                    }}
                    sx={{
                      fontWeight: 500,
                      px: { xs: 2, sm: 3, md: 4 },
                      py: { xs: 1, sm: 1.5 },
                      minWidth: { xs: '100%', sm: 160, md: 180 },
                      height: { xs: 40, sm: 44, md: 48 },
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {cta.label}
                  </Button>
                ))}
              </Stack>
            </Fade>
          </Box>

          <Box
            sx={{
              position: 'relative',
              width: { xs: '80%', sm: '80%', md: '50%', lg: 420 },
              height: { xs: 250, sm: 300, md: 350, lg: 400 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: { xs: 4, sm: 6, md: 0 }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: { xs: '50%', sm: '75%', md: '80%' },
                height: { xs: '70%', sm: '75%', md: '80%' },
                borderRadius: '50%',
                background: theme.palette.primary.dark,
                zIndex: 1,
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                zIndex: 2,
                top: { xs: '-5%', sm: '-8%', md: '-10%' },
                left: { xs: '-5%', sm: '-8%', md: '-10%' },
                transform: 'rotate(45deg)',
                opacity: 0.5
              }}
            />

            <Box
              sx={{
                // position: 'relative',
                width: { xs: '85%', sm: '90%',lg:399 },
                height: '100%',
                borderRadius: '0%',
                overflow: 'hidden',
                zIndex: 3,
                
              }}
            >
              <img
                src={heroPerson}
                alt="Person Filing Tax Return"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroWithImage;
