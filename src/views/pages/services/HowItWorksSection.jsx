import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

const HowItWorksSection = ({ steps = [] }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        overflowX: 'auto',
        mt: 6
      }}
    >
      <Typography variant="h2" fontWeight={700} textAlign="center" gutterBottom>
        How It Works 🚀
      </Typography>

      <Grid container spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={2.4}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '15px solid transparent',
                    borderBottom: '15px solid transparent',
                    borderLeft: '15px solid',
                    borderLeftColor: 'primary.main',
                    zIndex: 1
                  }
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Step {index + 1}
                </Typography>
                <Typography variant="body2">
                  {step}
                </Typography>
              </Box>
            </Grid>
            {index < steps.length - 1 && (
              <Grid item xs={12} sm="auto" sx={{ display: { xs: 'none', sm: 'block' } }}>
                <ArrowForwardIosIcon sx={{ color: 'primary.main' }} />
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Paper>
  );
};

export default HowItWorksSection;
