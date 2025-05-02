import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FirstSection = ({ data }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.light}20 0%, transparent 50%)`,
          zIndex: 0
        }
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} direction="column" alignItems="center">
          <Grid item xs={12} sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Typography
                variant="h1"
                color="primary"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                {data.name}
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  mb: 3,
                  fontWeight: 500
                }}
              >
                {data.description}
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: '1.1rem',
                  lineHeight: 1.8
                }}
              >
                {data.longDescription || data.description}
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<IconArrowRight />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: `0 4px 14px 0 ${theme.palette.primary.main}40`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px 0 ${theme.palette.primary.main}60`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
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
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      backgroundColor: `${theme.palette.primary.main}10`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  View Plans
                </Button>
              </Stack>
            </motion.div>
          </Grid>
          <Grid item xs={12} sx={{ width: '100%', mt: 6 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.8 }}>
              <Box
                component="img"
                src={data.mainImage || data.images?.light[0]}
                alt={data.name}
                sx={{
                  width: '100%',
                  maxWidth: '800px',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px) scale(1.02)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
                  }
                }}
              />
            </motion.div>
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
