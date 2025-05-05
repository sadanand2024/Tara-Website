import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid2, Typography, Card, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconUsers, IconBuildingStore, IconBriefcase, IconStar } from '@tabler/icons-react';

const AudienceCard = ({ title, description, icon: Icon, accentColor }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 5,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(12px)',
        border: `2.5px solid ${accentColor || theme.palette.primary.main}`,
        position: 'relative',
        overflow: 'visible',
        transition: 'transform 0.35s cubic-bezier(.4,2,.6,1), box-shadow 0.35s',
        '&:hover': {
          transform: 'translateY(-16px) scale(1.045)',
          boxShadow: `0 20px 48px 0 ${accentColor || theme.palette.primary.main}33`,
          background: 'rgba(255,255,255,0.85)'
        },
        p: 3,
        mt: 2
      }}
    >
      {/* Accent circle */}
      <Box
        sx={{
          position: 'absolute',
          top: -28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          background: accentColor || theme.palette.primary.main,
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 16px 0 ${accentColor || theme.palette.primary.main}33`,
          transition: 'background 0.3s'
        }}
      >
        <Box
          sx={{
            transition: 'transform 0.4s',
            '&:hover': {
              transform: 'scale(1.18) rotate(-8deg)'
            },
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={36} stroke={2.2} color={'#fff'} />
        </Box>
      </Box>
      <CardContent sx={{ mt: 3 }}>
        <Typography variant="h4" align="center" fontWeight={800} gutterBottom sx={{ letterSpacing: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ minHeight: 60, fontSize: { xs: 15, md: 16 } }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

AudienceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  accentColor: PropTypes.string
};

const accentColors = [
  '#6C63FF', // purple
  '#00BFAE', // teal
  '#FFB300', // amber
  '#FF5C93', // pink
  '#00C9A7', // green
  '#FF8C00' // orange
];

const TargetAudienceSection = ({ data }) => {
  const audiences = data.targetAudience;
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 13 },
        px: 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)'
      }}
    >
      {/* Decorative SVGs */}
      <Box
        sx={{
          position: 'absolute',
          top: -80,
          left: -80,
          zIndex: 0,
          opacity: 0.18
        }}
      >
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="110" cy="110" r="110" fill="#6C63FF" />
        </svg>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          zIndex: 0,
          opacity: 0.13
        }}
      >
        <svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="130" cy="130" r="130" fill="#00BFAE" />
        </svg>
      </Box>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <IconStar size={44} color={theme.palette.secondary.main} style={{ marginBottom: 10 }} />
          <Typography variant="h2" align="center" fontWeight={900} gutterBottom sx={{ letterSpacing: 1.5, fontSize: { xs: 32, md: 44 } }}>
            Who is this for?
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500, fontSize: { xs: 16, md: 18 } }}
          >
            Empowering a diverse range of users
          </Typography>
          <Divider sx={{ width: 90, borderBottomWidth: 4, borderColor: theme.palette.primary.main, mb: 2 }} />
        </Box>
        <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 8, fontWeight: 600, fontSize: { xs: 18, md: 22 } }}>
          {`Discover if ${data.name} is right for you`}
        </Typography>
        <Grid2 container spacing={{ xs: 4, md: 6 }}>
          {audiences.map((audience, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <AudienceCard
                title={audience.title}
                description={audience.description}
                icon={audience.icon || audiences[index % audiences.length].icon}
                accentColor={accentColors[index % accentColors.length]}
              />
            </Grid2>
          ))}
        </Grid2>
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
