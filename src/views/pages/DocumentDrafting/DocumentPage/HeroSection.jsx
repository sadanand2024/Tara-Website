import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import React from 'react';

// image from your assets
import HeroIllustration from 'assets/images/landing/DocumentDrafting.png';

const HeroSection = () => {
  const [category, setCategory] = React.useState('');

  return (
    <Box
      sx={{
        bgcolor: '#D8EDFF',
        color: 'text.primary',
        // comfortable vertical rhythm across breakpoints
        py: { xs: 6, sm: 8, md: 12 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          // reduce top margin on small, keep subtle offset on large
          mt: { xs: 1, sm: 2, md: 1 },
        }}
      >
        <Grid2
          container
          spacing={{ xs: 4, sm: 6, md: 8 }}
          alignItems="center"
        >
          {/* Text */}
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              // center on small screens
              textAlign: { xs: 'center', md: 'left' },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography
                component="h1"
                // fluid, accessible, and wraps naturally
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.15,
                  mt: { xs:8, sm: 6 },
                  // fluid font sizes using clamp
                  fontSize: {
                    xs: 'clamp(28px, 6vw, 36px)',
                    sm: 'clamp(34px, 5vw, 42px)',
                    md: 'clamp(38px, 3.8vw, 48px)',
                  },
                }}
              >
                Legal Docs, Forms & Contracts
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#64748B',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  // fluid body size
                  fontSize: {
                    xs: 'clamp(14px, 3.6vw, 16px)',
                    sm: 'clamp(15px, 2.2vw, 18px)',
                    md: 'clamp(16px, 1.4vw, 20px)',
                  },
                  // center on mobile, left on md+
                  textAlign: { xs: 'center', md: 'left' },
                  // keep a nice measure on wide screens
                  maxWidth: { xs: '100%', sm: 560, md: 520 },
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                Make your contracts and docs in minutes
              </Typography>
            </Box>
          </Grid2>

          {/* Illustration */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
              }}
            >
              <Box
                component="img"
                src={HeroIllustration}
                alt="Document templates illustration"
                loading="lazy"
                // help the browser pick correct intrinsic size
                sizes="(max-width: 900px) 100vw, 720px"
                sx={{
                  width: '100%',
                  maxWidth: { xs: 520, sm: 640, md: 720 },
                  height: 'auto',
                  borderRadius: 2,
                  // prevent overflow on tiny devices
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default HeroSection;
