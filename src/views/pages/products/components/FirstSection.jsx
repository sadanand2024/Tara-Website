import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const FirstSection = ({ data }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, backgroundColor: theme.palette.background.default }}>
      <Container>
        <Grid container spacing={6} direction="column" alignItems="center">
          <Grid item xs={12} sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
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
              {data.name}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              {data.description}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{
                mb: 4,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              {data.longDescription || data.description}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" color="primary" size="large" endIcon={<IconArrowRight />} sx={{ px: 4, py: 1.5 }}>
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate(`/products/${data.id}#pricing`)}
                sx={{
                  px: 4,
                  py: 1.5,
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
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ width: '100%', mt: 4 }}>
            <Box
              component="img"
              src={data.mainImage || data.images?.light[0]}
              alt={data.name}
              sx={{
                width: '100%',
                maxWidth: '800px',
                height: 'auto',
                borderRadius: 24,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
                }
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

FirstSection.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    longDescription: PropTypes.string,
    mainImage: PropTypes.string,
    images: PropTypes.shape({
      light: PropTypes.arrayOf(PropTypes.string),
      dark: PropTypes.arrayOf(PropTypes.string)
    }),
    id: PropTypes.string.isRequired
  }).isRequired
};

export default FirstSection;
