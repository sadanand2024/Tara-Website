
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const StickyFooterCTA = ({ data }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 'auto',
        zIndex: 999,
        backgroundColor: '#fff',
        borderTop: '1px solid #ddd',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
        py: 1
      }}
    >
      <Container maxWidth="md">
        <Fade cascade direction="up" damping={0.1} triggerOnce>
          <Stack
            spacing={1}
            alignItems="center"
            textAlign="center"
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                color: 'text.primary',
                mb: 0.5
              }}
            >
              {data.text}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="stretch"
              width="100%"
            >
              {data.buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? 'contained' : 'outlined'}
                  fullWidth
                  size="size"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow:
                        idx === 0
                          ? '0px 0px 16px 4px rgba(0,123,255,0.2)'
                          : undefined
                    }
                  }}
                >
                  {btn.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Fade>
      </Container>
    </Box>
  );
};

export default StickyFooterCTA;
