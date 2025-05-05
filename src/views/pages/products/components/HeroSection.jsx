import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, useTheme, Button, Stack, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeMode } from 'config';
import FirstSection from './FirstSection';
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
                variant="h4"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}
              >
                {data.description}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/register?id=${moduleId}&context=${context}&type=${type}`)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
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
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/products/plans?id=${data.id}`)}
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
