import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, useTheme, Button, Stack, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeMode } from 'config';

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 24,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
  }
}));

const PreviewImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 12,
  opacity: 0.5,
  transition: 'all 0.3s ease',
  '&:hover': {
    opacity: 0.8
  }
}));

const HeroSection = ({ data }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const moduleId = searchParams.get('id');
  const type = searchParams.get('type');
  const context = searchParams.get('context');

  const images = theme.palette.mode === ThemeMode.DARK ? data.images.dark : data.images.light;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
      <Grid container spacing={6} direction="column" alignItems="center">
        <Grid item xs={12} sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          <Fade in timeout={1000}>
            <Stack spacing={3}>
              <Typography
                variant="h1"
                color="primary"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {data.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}
              >
                {data.description}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => navigate(`/register?id=${moduleId}&context=${context}&type=${type}`)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 25px ${theme.palette.primary.main}60`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {data.primaryCTA || `Get Started with ${data.name} for Free`}
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/products/${data.id}#pricing`)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  View Plans
                </Button>
                {data.secondaryCTA && (
                  <Button
                    size="large"
                    variant="outlined"
                    color="secondary"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {data.secondaryCTA}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Fade>
        </Grid>

        <Grid item xs={12} sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              minHeight: { xs: 300, md: 500 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Carousel
              animation="slide"
              autoPlay
              interval={3000}
              cycleNavigation
              navButtonsAlwaysVisible
              sx={{
                width: '100%',
                '& .MuiIconButton-root': {
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }
                }
              }}
            >
              {images.map((src, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: 500 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                  }}
                >
                  <StyledImage src={src} alt={`${data.name} Screenshot ${index + 1}`} />
                </Box>
              ))}
            </Carousel>
          </Box>

          {/* Preview Images */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              mt: 2,
              px: 2,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 8
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.mode === ThemeMode.DARK ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: 4
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.primary.main,
                borderRadius: 4
              }
            }}
          >
            {images.map((src, index) => (
              <Box
                key={index}
                sx={{
                  width: 120,
                  height: 80,
                  flexShrink: 0,
                  cursor: 'pointer',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 12,
                    border: `2px solid ${theme.palette.primary.main}`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover::after': {
                    opacity: 1
                  }
                }}
              >
                <PreviewImage src={src} alt={`${data.name} Preview ${index + 1}`} />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

HeroSection.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.shape({
      light: PropTypes.arrayOf(PropTypes.string).isRequired,
      dark: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    primaryCTA: PropTypes.string,
    secondaryCTA: PropTypes.string,
    id: PropTypes.string.isRequired
  }).isRequired
};

export default HeroSection;
