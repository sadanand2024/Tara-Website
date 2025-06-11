import React, { useEffect, useState } from 'react';
import { Card, Typography, Box, Paper } from '@mui/material';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
const steps = [
  { label: 'Business Details', width: 200 },
  { label: 'Director/Promoter Details', width: 200 },
  { label: 'Review, Filing & Certificate', width: 220 }
];

const GstRegistration = () => {
  const [step, setStep] = React.useState(0);
  const activeStep = step;
  const handleStepClick = (targetStep) => {
    if (targetStep <= step + 1) setStep(targetStep);
  };

  return (
    <Card sx={{ minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Typography variant="h3" mb={1}>
        Gst Registration
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Register your business for a Gst Registration as required by your local municipal authority.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Paper elevation={0} sx={{ bgcolor: '#eef2f6', p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700 }}>
          {/* Stepper */}
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 4 }}>
            {steps.map((stepObj, idx) => (
              <React.Fragment key={stepObj.label}>
                <Box
                  sx={{
                    width: stepObj.width,
                    px: 1,
                    py: 1.2,
                    bgcolor: idx === activeStep ? 'primary.main' : '#fff',
                    color: idx === activeStep ? '#fff' : 'text.secondary',
                    border: idx === activeStep ? 'none' : '1.5px solid #697586',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    display: 'inline-block',
                    lineHeight: 1.5,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleStepClick(idx)}
                >
                  {stepObj.label}
                </Box>
                {idx < steps.length - 1 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      bgcolor: '#e0e3e8',
                      minWidth: 24
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>

          {step === 0 && <StepOne />}

          {step === 1 && <StepTwo />}

          {step === 2 && <StepThree />}
        </Paper>
      </Box>
      
    </Card>
  );
};

export default GstRegistration;
