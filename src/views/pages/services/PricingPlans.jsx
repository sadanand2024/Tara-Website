'use client';
import React from 'react';
import { Box, Paper, Typography, Stack, Grid, Divider, Button } from '@mui/material';
import { Fade } from 'react-awesome-reveal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PricingPlans = ({ data }) => {
  if (!data) return null;

  return (
    <Fade triggerOnce direction="up">
      <Box sx={{ mb: 8 }}>
        {/* Section Title */}
        <Typography variant="h2" fontWeight={700} textAlign="center" mb={2}>
          {data.title}
        </Typography>

        {/* Plans Grid */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {data.plans?.map((plan, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Stack spacing={1} alignItems="center" mb={2}>
                  <Typography variant="h4" fontWeight={700}>
                    {plan.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {plan.bestFor}
                  </Typography>
                </Stack>

                <Typography variant="h2" color="primary" fontWeight={700} mb={2}>
                  {plan.price}
                </Typography>

                <Button variant="contained" fullWidth sx={{ mt: 'auto' }}>
                  Get Started
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Note Section */}
        {data.note && (
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={4}>
            {data.note}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default PricingPlans;
