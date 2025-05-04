'use client';
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';

const Typewriter = ({ text, speed = 80 }) => {
  const [displayed, setDisplayed] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsTypingDone(false);
  }, [text]);

  useEffect(() => {
    if (text && !isTypingDone) {
      const interval = setInterval(() => {
        setDisplayed((prev) => {
          const next = text.slice(0, prev.length + 1);
          if (next.length === text.length) {
            clearInterval(interval);
            setIsTypingDone(true);
          }
          return next;
        });
      }, speed);
      return () => clearInterval(interval);
    }
  }, [text, isTypingDone, speed]);

  return (
    <Typography
      variant="h1"
      fontWeight={700}
      sx={{
        fontSize: { xs: '1.6rem', sm: '2.2rem', md: '3.2rem' },
        color: 'text.primary',
        textAlign: 'center',
        wordBreak: 'break-word'
      }}
    >
      {displayed}
    </Typography>
  );
};

const HeroWithFinalTouch = ({ data }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 5, md: 12 },
        px: { xs: 1, md: 8 },
        mt: { xs: 1, md: 4 },
        borderRadius: 4,
        background: 'url("/assets/hero-bg.svg") center/cover no-repeat, linear-gradient(to right,rgb(225, 229, 233) 0%,rgb(218, 221, 225) 100%)',
        boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}
    >
      {/* Floating Bubbles */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 120, sm: 180, md: 250 },
          height: { xs: 120, sm: 180, md: 250 },
          top: { xs: -40, md: -80 },
          left: { xs: -40, md: -80 },
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite alternate',
          zIndex: 1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 90, sm: 140, md: 180 },
          height: { xs: 90, sm: 140, md: 180 },
          bottom: { xs: -30, md: -60 },
          right: { xs: -30, md: -60 },
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #76b2fe, #b69efe)',
          opacity: 0.1,
          animation: 'float 8s ease-in-out infinite alternate-reverse',
          zIndex: 1
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Fade cascade damping={0.1} triggerOnce>
          <Typewriter text={data.title} />

          <Typography
            variant="h5"
            color="text.secondary"
            fontWeight={400}
            mt={2}
            mb={4}
            sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}
          >
            {data.subtitle}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            sx={{
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {data.ctas.map((cta, idx) => (
              <Button
                key={idx}
                variant={idx === 0 ? 'contained' : 'outlined'}
                size="large"
                color="primary"
                fullWidth={true}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  minWidth: { xs: '100%', sm: 160 },
                  width: { xs: '100%', sm: 'auto' },
                  textAlign: 'center',
                  transition: '0.3s ease',
                  mb: { xs: 1, sm: 0 },
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: idx === 0 ? '0px 0px 20px 4px rgba(0,123,255,0.3)' : undefined
                  }
                }}
              >
                {cta.label}
              </Button>
            ))}
          </Stack>
        </Fade>
      </Container>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes float {
            from { transform: translateY(0); }
            to { transform: translateY(20px); }
          }
        `}
      </style>
    </Box>
  );
};

export default HeroWithFinalTouch;
