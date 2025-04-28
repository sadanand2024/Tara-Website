'use client';
import React from 'react';
import { Box, Typography, Stack, Chip, Paper, Fade } from '@mui/material';

const RelatedServices = ({ related }) => {
  if (!related || related.length === 0) return null;

  return (
    <Fade in timeout={700}>
      <Box sx={{ my: 8 }}>
        {/* Title */}
        <Typography variant="h2" fontWeight={700} textAlign="center" gutterBottom>
          Related Services
        </Typography>

        {/* Beautiful Background Box */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.95) 100%)',
            backdropFilter: 'blur(6px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" justifyContent="center">
            {related.map((service, idx) => (
              <Chip
                key={idx}
                label={service}
                clickable
                variant="filled"
                color="primary"
                sx={{
                  fontSize: '1rem',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: 'primary.light',
                  color: 'primary.dark',
                  fontWeight: 600,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
                    transform: 'translateY(-3px)'
                  }
                }}
              />
            ))}
          </Stack>
        </Paper>
      </Box>
    </Fade>
  );
};

export default RelatedServices;
