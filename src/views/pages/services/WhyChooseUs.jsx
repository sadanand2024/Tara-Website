'use client';
import React from 'react';
import { Box, Typography, Paper, Stack, Grid2 } from '@mui/material';
import { Fade } from 'react-awesome-reveal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const WhyChooseUs = ({ reasons }) => {
  return (
    <Box mb={8}>
      <Typography variant="h2" fontWeight={700} textAlign="center" mb={4}>
        Why Choose Us?
      </Typography>

      <Grid2 container spacing={4}>
        {reasons.map((reason, idx) => (
          <Grid2 key={idx} xs={12} sm={6} md={4}>
            <Fade triggerOnce delay={idx * 100}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                <Stack direction="row" spacing={1}>
                  <CheckCircleIcon color="primary" sx={{ mt: '3px' }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    {reason}
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default WhyChooseUs;
