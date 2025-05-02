import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconUsers, IconBuildingStore, IconBriefcase } from '@tabler/icons-react';

const AudienceCard = ({ title, description, icon: Icon }) => {
  const theme = useTheme();

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

AudienceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired
};

const defaultAudiences = [
  {
    title: 'Small Businesses',
    description: 'Perfect for startups and small businesses looking to streamline their operations',
    icon: IconBuildingStore
  },
  {
    title: 'Enterprises',
    description: 'Scalable solutions for large organizations with complex requirements',
    icon: IconBriefcase
  },
  {
    title: 'Professionals',
    description: 'Ideal for freelancers and independent professionals managing their business',
    icon: IconUsers
  }
];

const TargetAudienceSection = ({ data }) => {
  const audiences = data.targetAudience || defaultAudiences;

  return (
    <Box sx={{ py: 8, backgroundColor: (theme) => theme.palette.background.default }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Who is this for?
        </Typography>
        <Typography variant="h4" align="center" color="textSecondary" sx={{ mb: 6 }}>
          {`Discover if ${data.name} is right for you`}
        </Typography>
        <Grid container spacing={4}>
          {audiences.map((audience, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AudienceCard
                title={audience.title}
                description={audience.description}
                icon={audience.icon || defaultAudiences[index % defaultAudiences.length].icon}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

TargetAudienceSection.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    targetAudience: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.elementType
      })
    )
  }).isRequired
};

export default TargetAudienceSection;
