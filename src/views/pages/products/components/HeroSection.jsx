import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeMode } from 'config';

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 16,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={5} direction="column" alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h2" color="primary" align="center" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 4 }}>
            {data.description}
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                size="large"
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate(`/register?id=${moduleId}&context=${context}&type=${type}`)}
              >
                {data.primaryCTA || `Get Started with ${data.name} for Free`}
              </Button>
            </Grid>
            {data.secondaryCTA && (
              <Grid item>
                <Button size="large" variant="outlined" color="secondary">
                  {data.secondaryCTA}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', sm: '80%', md: '60%' },
              mx: 'auto',
              minHeight: { xs: 220, sm: 320, md: 400 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
              borderRadius: 3,
              boxShadow: 3,
              overflow: 'hidden'
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
                    height: { xs: 220, sm: 320, md: 400 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1
                  }}
                >
                  <StyledImage src={src} alt={`${data.name} Screenshot ${index + 1}`} />
                </Box>
              ))}
            </Carousel>
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
    secondaryCTA: PropTypes.string
  }).isRequired
};

export default HeroSection;
