'use client';
import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Paper, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundImage: 'linear-gradient(95deg, #f27121 0%, #e94057 50%, #8a2387 100%)'
  }
}));

const CustomStepIconRoot = styled('div')(() => ({
  backgroundImage: 'linear-gradient(136deg, #f27121 0%, #e94057 50%, #8a2387 100%)',
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,.25)'
}));

function CustomStepIcon({ icon }) {
  return (
    <CustomStepIconRoot>
      <CheckCircleIcon />
    </CustomStepIconRoot>
  );
}

const HowItWorksStepper = ({ steps }) => {
  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: 'background.paper', overflowX: 'auto', mb: 8 }}>
      <Typography variant="h2" fontWeight={700} textAlign="center" gutterBottom>
        How It Works
      </Typography>

      <Stepper alternativeLabel connector={<CustomConnector />} activeStep={steps.length} sx={{ mt: 4 }}>
        {steps.map((step, idx) => (
          <Step key={idx}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Box sx={{ textAlign: 'center', maxWidth: 220, mx: 'auto' }}>
                <Typography variant="h4" fontWeight={600} mb={1}>
                  Step {idx + 1}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {step}
                </Typography>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default HowItWorksStepper;
