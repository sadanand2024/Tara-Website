import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Paper, StepConnector, stepConnectorClasses, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundImage: 'linear-gradient(95deg, #f27121 0%, #e94057 50%, #8a2387 100%)'
  }
}));

const CustomStepIconRoot = styled('div')(() => ({
  backgroundImage: 'linear-gradient(136deg, #f27121 0%, #e94057 50%, #8a2387 100%)',
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
    1: <AccountCircleIcon />,
    2: <BusinessIcon />,
    3: <InsertDriveFileIcon />,
    4: <GavelIcon />,
    5: <CheckCircleIcon />
  };

  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </CustomStepIconRoot>
  );
}

const steps = [
  {
    label: 'Select file type'
  },
  {
    label: 'Confirm via smart quiz'
  },
  {
    label: 'Upload documents'
  },
  {
    label: 'Filing completed',
    sub: 'MCA Reviews & Certificates',
    description: 'MCA reviews, certifies, and processes via ROC — tracked in real-time'
  },
  {
    label: 'ITR-V acknowledgment done'
  }
];

export default function IncorporationJourneyStepper() {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h1" fontWeight={700} gutterBottom>
          Here's what we'll need from you
        </Typography>

        <Typography variant="h3" color="text.secondary" gutterBottom>
          We'll show a checklist of documents based on the selected ITR variant code
        </Typography>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          overflowX: 'auto'
        }}
      >
        <Typography variant="h2" fontWeight={700} textAlign="center" gutterBottom>
          How it Works ? 🚀
        </Typography>

        <Stepper alternativeLabel connector={<CustomConnector />} activeStep={1} sx={{ mt: 4 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Box sx={{ textAlign: 'center', maxWidth: 200, mx: 'auto' }}>
                  <Typography variant="h4" fontWeight={600} mb={1}>
                    {step.label}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
}
