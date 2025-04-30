import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Button, Container, useTheme } from '@mui/material';
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
        fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' }, // 👈 adaptive font size
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
        py: { xs: 6, md: 12 },
        px: { xs: 2, md: 8 },
        mt: { xs: 2, md: 4 },
        borderRadius: 4,
        background: 'linear-gradient(to right, #f5f7fa 0%, #c3cfe2 100%)',
        boxShadow: '0px 6px 20px rgba(0,0,0,0.08)'
      }}
    >
      {/* Floating Bubbles */}
      <Box
        sx={{
          position: 'absolute',
          width: 250,
          height: 250,
          top: -80,
          left: -80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite alternate'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 180,
          height: 180,
          bottom: -60,
          right: -60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #76b2fe, #b69efe)',
          opacity: 0.1,
          animation: 'float 8s ease-in-out infinite alternate-reverse'
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Fade cascade damping={0.1} triggerOnce>
          <Typewriter text={data.title} />

          <Typography variant="h5" color="text.secondary" fontWeight={400} mt={2} mb={4} sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
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
                fullWidth={{ xs: true, sm: false }} // ✅ Full width only on mobile, normal on desktop
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  minWidth: 180,
                  width: { xs: '100%', sm: 'auto' }, // ✅ Force 100% width mobile, normal on desktop
                  textAlign: 'center',
                  transition: '0.3s ease',
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
