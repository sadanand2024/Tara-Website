import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Paper, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- Custom Styled Connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundImage: 'linear-gradient(95deg, #2196F3 0%, #21CBF3 50%, #1DE9B6 100%)'
  }
}));

// --- Custom Step Icon
const CustomStepIconRoot = styled('div')(() => ({
  backgroundImage: 'linear-gradient(136deg, #2196F3 0%, #21CBF3 50%, #1DE9B6 100%)',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  transition: 'all 0.3s ease-in-out'
}));

function CustomStepIcon(props) {
  const { active, completed, icon, className } = props;
  const icons = {
    1: <AssignmentIcon />,
    2: <UploadFileIcon />,
    3: <DoneOutlineIcon />,
    4: <PaymentIcon />,
    5: <CheckCircleIcon />
  };

  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </CustomStepIconRoot>
  );
}

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

      <Stepper alternativeLabel connector={<CustomConnector />} activeStep={1} sx={{ mt: 4 }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Box sx={{ textAlign: 'center', maxWidth: 200, mx: 'auto' }}>
                <Typography variant="h5" fontWeight={600} mb={1}>
                  Step {index + 1}
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

export default HowItWorksSection;
