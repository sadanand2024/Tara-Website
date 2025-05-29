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
      top: 22,
      left: 'calc(-50% + 34px)',
      right: 'calc(50% + 42px)',
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
      border: '2px solid #99B9FF',
      backgroundColor: 'transparent',
      borderRadius: 1,
      display: 'flex',
      alignItems: 'center',
      marginTop: '15px',
      justifyContent: 'flex-end',
      // width: '113px', // Remove fixed width to allow dynamic stretching
      // transform: 'rotate(0.33deg)', // Keep or remove rotation as needed, removing for now as it might interfere
      // Add arrow styling
      '&::after': {
        content: '""',
        width: 0,
        height: 0,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: '10px solid',
        borderLeftColor: '#99B9FF',
        marginLeft: 'auto',
        marginRight: '-10px',
        marginTop: '1px',
      }
    }
  }));

  const CustomStepIconRoot = styled('div')(() => ({
    backgroundColor: '#0042D1',
    color: '#fff',
    width: 71,
    height: 71,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'none',
    border: '1px solid #0042D1'
  }));

  function CustomStepIcon(props) {
    const { icon } = props;
    return (
      <CustomStepIconRoot>
        <Typography 
          variant="h6" 
          sx={{
            color: '#fff', 
            fontWeight: 500,
            fontSize: '30px', // Updated font size
            lineHeight: '100%', // Updated line height
            letterSpacing: '0px', // Updated letter spacing
            fontFamily: 'Manrope, sans-serif', // Updated font family
          }}
        >
          {icon}
        </Typography>
      </CustomStepIconRoot>
    );
  }

  return (
    <Container sx={{ py: { xs: 6, md: 8 }, textAlign: 'center' }}>
      <Typography
        variant="h2" // Changed to h2 for title
        textAlign="center"
        fontWeight={700}
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Adjusted font size
          mb: 6, // Increased bottom margin
          color: '#000', // Black color for title
          // fontSize: '38px',
          
          fontFamily: 'Manrope, sans-serif', // Specified font family
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
          px: { xs: 0, sm: 0 }, // Keep horizontal padding removed as intended
          backgroundColor: 'transparent',
          borderRadius: 0,
          overflowX: { xs: 'auto', md: 'unset' },
          '& .MuiStepLabel-label': {
            typography: { xs: 'body2', sm: 'subtitle1' },
            mt: 2,
          },
          '& .MuiStepConnector-root': {
          },
          '& .MuiStep-root': {
          },
        }}
      >
        {steps.map((step, idx) => (
          <Step key={idx}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Box sx={{ textAlign: 'center', maxWidth: { xs: 120, sm: 150 }, mx: 'auto' }}> {/* Adjusted max width */}
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    // background: '#0D141C',
                  }}
                >
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