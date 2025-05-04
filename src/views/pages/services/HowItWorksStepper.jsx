'use client';

import {
  Box,
  Container,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import React from 'react';

const HowItWorksStepper = ({ steps }) => {
  const theme = useTheme();

  const CustomConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      borderRadius: 1,
      backgroundImage: `linear-gradient(95deg, ${theme.palette.secondary.main} 0%, #8a2387 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      '&::after': {
        content: '""',
        width: 0,
        height: 0,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderLeft: '12px solid',
        borderLeftColor: theme.palette.secondary.main,
        marginLeft: 'auto'
      }
    }
  }));

  const CustomStepIconRoot = styled('div')(() => ({
    backgroundImage: `linear-gradient(136deg, ${theme.palette.secondary.main} 0%, #8a2387 100%)`,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,.25)'
  }));

  function CustomStepIcon(props) {
    const { icon } = props;
    return (
      <CustomStepIconRoot>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
          {icon}
        </Typography>
      </CustomStepIconRoot>
    );
  }

  return (
    <Container>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight={700}
        sx={{
          fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
          mb: 2
        }}
      >
        How It Works
      </Typography>

      <Stepper
        alternativeLabel
        connector={<CustomConnector />}
        activeStep={steps.length}
        sx={{
          mt: 4,
          px: { xs: 1, sm: 2 },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
          overflowX: { xs: 'auto', md: 'unset' },
          '& .MuiStepLabel-label': {
            typography: { xs: 'body2', sm: 'subtitle1' }
          }
        }}
      >
        {steps.map((step, idx) => (
          <Step key={idx}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Box sx={{ textAlign: 'center', maxWidth: { xs: 160, sm: 220 }, mx: 'auto' }}>
                <Typography variant="h5" color="text.secondary">
                  {step}
                </Typography>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Container>
  );
};

export default HowItWorksStepper;
