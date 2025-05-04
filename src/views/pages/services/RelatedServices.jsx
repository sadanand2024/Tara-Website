'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { IconCircleCheck } from '@tabler/icons-react';
import React from 'react';
import { Slide } from 'react-awesome-reveal'; // ✅ Animation

import LayerLeft from 'assets/images/landing/customization-left.png'; // Your actual image path

const RelatedServices = ({ related }) => {
  if (!related || related.length === 0) return null;

  const listSX = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '12px 0',
    fontSize: '1rem',
    color: 'grey.900',
    svg: { color: 'secondary.main', minWidth: 30 }
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 4, md: 8 }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left: Image */}
        <Box sx={{ width: { xs: '100%', md: '40%' }, maxWidth: 500 }}>
          <Stack sx={{ width: '80%', mx: 'auto' }}>
            <CardMedia component="img" image={LayerLeft} alt="Related Services" />
          </Stack>
        </Box>

        {/* Right: Text with Slide-Up Animation */}
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Slide direction="up" triggerOnce>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h1" fontWeight={800} color="text.primary">
                  Related <span style={{ color: '#1976d2' }}>Services</span>
                </Typography>
                <Typography variant="h3" color="text.secondary" mt={2} mb={3}>
                  Explore other services that may benefit you:
                </Typography>
              </Box>

              <Stack spacing={1}>
                {related.map((item, idx) => (
                  <Typography key={idx} sx={listSX}>
                    <IconCircleCheck size={30} />
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Slide>
        </Box>
      </Stack>
    </Container>
  );
};

export default RelatedServices;
