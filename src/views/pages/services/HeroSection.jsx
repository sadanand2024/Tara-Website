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
        mt: { xs: 6, sm: 8, md:1 },
        borderRadius: { xs: 2, sm: 3, md: 4 },
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Text Content */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Fade cascade damping={0.1} triggerOnce>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '44px' },
                  lineHeight: { xs: 1.3, sm: 1.4, md: 1.5, lg: '54px' },
                  mb: { xs: 2, sm: 3, md: 4 },
                }}
              >
                {data.title}
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '20px' },
                  lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
                  mb: { xs: 3, sm: 4, md: 5 },
                }}
              >
                {data.subtitle}
              </Typography>

              <Stack
                direction={{ xs: 'row', sm: 'row' }}
                spacing={2}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
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
                      } else if (cta.label === 'Talk to Tax Expert') {
                        navigate(`/book-consultation?id=${service_id}&context=${service_type}&type=service`);
                      } else {
                        navigate('/pages/contact-us');
                      }
                    }}
                    sx={{
                      px: 3,
                      minWidth: 160,
                      height: 48,
                      textAlign: 'center',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {cta.label}
                  </Button>
                ))}
              </Stack>
            </Fade>
          </Box>

          {/* Image Section */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              width: '100%',
              maxWidth: { xs: 300, sm: 350, md: 400 },
              height: { xs: 250, sm: 300, md: 400 },
              mx: 'auto',
              mt: { xs: 4, md: 0 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Circle */}
            <Box
              sx={{
                position: 'absolute',
                width: '90%',
                height: '90%',
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.light,
                opacity: 0.2,
                zIndex: 1,
              }}
            />

            {/* Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                zIndex: 2,
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <img
                src={heroPerson}
                alt="Person Filing Tax Return"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
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
