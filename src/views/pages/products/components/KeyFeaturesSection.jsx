import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as TablerIcons from '@tabler/icons-react';

const FeatureCard = ({ title, description, icon }) => {
  const theme = useTheme();
  const Icon = TablerIcons[icon] || TablerIcons.IconStars;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Icon size={40} stroke={1.5} color={theme.palette.primary.main} />
        </Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

const KeyFeaturesSection = ({ data }) => {
  return (
    <Box sx={{ py: 8, backgroundColor: (theme) => theme.palette.background.default }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          {data.featuresTitle || 'Key Features'}
        </Typography>
        <Typography variant="h4" align="center" color="textSecondary" sx={{ mb: 6 }}>
          {data.featuresSubtitle || `Everything you need in ${data.name}`}
        </Typography>
        <Grid container spacing={4}>
          {data.features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} />
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
