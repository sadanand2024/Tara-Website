import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as TablerIcons from '@tabler/icons-react';

// Accent gradients palette for cards
const ACCENT_GRADIENTS = [
  'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'
];

const FeatureCard = ({ title, description, icon, accentIndex }) => {
  const theme = useTheme();
  const Icon = TablerIcons[icon] || TablerIcons.IconStars;
  const accentGradient = ACCENT_GRADIENTS[accentIndex % ACCENT_GRADIENTS.length];

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        borderTop: `4px solid transparent`,
        transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s, border-top 0.3s',
        p: 2,
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.25)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'scale(1.055) translateY(-10px)',
          boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.28)',
          borderTop: `4px solid #fff`
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: accentGradient,
          borderRadius: '4px 4px 0 0',
          zIndex: 1
        }
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
        <Box
          sx={{
            mb: 3,
            mt: 1,
            width: 68,
            height: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: accentGradient,
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            position: 'relative',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: `0 0 0 8px ${theme.palette.primary.light}, 0 4px 24px 0 rgba(0,0,0,0.10)`
            }
          }}
        >
          <Icon size={34} stroke={2} color={theme.palette.common.white} />
        </Box>
        <Typography variant="h5" fontWeight={700} align="center" gutterBottom sx={{ color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 1, px: 1 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  accentIndex: PropTypes.number.isRequired
};

const KeyFeaturesSection = ({ data }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: { xs: 2, md: 5 },
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden',
        background: {
          xs: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)',
          md: 'linear-gradient(120deg, #f8fafc 60%, #a5b4fc 100%)'
        },
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(270deg, #ffecd2 0%, #fcb69f 50%, #a1c4fd 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 16s ease infinite',
          opacity: 0.35,
          zIndex: 0
        },
        '@keyframes gradientBG': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #ee0979, #ff6a00, #43cea2, #185a9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            letterSpacing: 1.5
          }}
        >
          {data.featuresTitle || 'Key Features'}
        </Typography>
        <Typography variant="h2" align="center" color="text.secondary" sx={{ mb: 7 }}>
          {data.featuresSubtitle || `Everything you need in ${data.name}`}
        </Typography>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {data.features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} accentIndex={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

KeyFeaturesSection.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    featuresTitle: PropTypes.string,
    featuresSubtitle: PropTypes.string,
    features: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default KeyFeaturesSection;
