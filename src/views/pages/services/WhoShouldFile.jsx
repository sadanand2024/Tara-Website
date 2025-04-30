import React from 'react';
import { Box, Typography, Paper, Stack, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Fade } from 'react-awesome-reveal';

const WhoShouldFile = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mb: 10 }}>
      <Fade triggerOnce cascade damping={0.15}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h1" fontWeight={700} gutterBottom>
            Who Should File?
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Not sure if you should file? See if you fall under these categories:
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {items.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: 1.5,
                  borderRadius: 3,
                  backgroundColor: 'background.paper',
                  transition: '0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CheckCircleIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  {item}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Fade>
    </Box>
  );
};

export default WhoShouldFile;
