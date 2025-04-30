import React from 'react';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Fade } from 'react-awesome-reveal';

const WhatsIncluded = ({ title = "What's Included", items }) => {
  return (
    <Box mb={8}>
      <Typography variant="h2" fontWeight={700} textAlign="center" mb={4}>
        {title}
      </Typography>

      <Grid2 container spacing={4}>
        {items.map((item, idx) => (
          <Grid2 key={idx} xs={12} sm={6} md={4}>
            <Fade triggerOnce delay={idx * 100}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5
                }}
              >
                <CheckCircleIcon color="primary" sx={{ mt: '3px' }} />
                <Typography variant="subtitle1" color="text.secondary">
                  {item}
                </Typography>
              </Paper>
            </Fade>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default WhatsIncluded;
