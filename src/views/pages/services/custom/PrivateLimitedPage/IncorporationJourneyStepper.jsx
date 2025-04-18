import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Paper, Grid, StepConnector, stepConnectorClasses } from '@mui/material';
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
    backgroundImage: 'linear-gradient(95deg, #f27121 0%, #e94057 50%, #8a2387 100%)' // 👈 always applied
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
    label: 'Day 1',
    sub: 'You Provide - We Approve',
    description: 'Kick Start - Share basic details, upload documents, we verify and prep everything'
  },
  {
    label: 'Day 2-3',
    sub: 'Your Brand - officially Approved',
    description: 'Name Approval - Name application submitted, resubmission if needed, expert help if rejected'
  },
  {
    label: 'Day 4-5',
    sub: 'MOA, AOA & Filing',
    description: 'MOA & AOA drafted, SPICe+ Part B, AGILE PRO, DIR-2 prepared, filed with MCA'
  },
  {
    label: 'Day 6',
    sub: 'MCA Reviews & Certificates',
    description: 'MCA reviews, certifies & processes via ROC — tracked in real time'
  },
  {
    label: 'Day 7',
    sub: 'You are Incorporated',
    description: 'COI issued, PAN & TAN received — you’re ready to roll'
  }
];

export default function IncorporationJourneyStepper() {
  return (
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
        7 Days to Incorporation 🚀
      </Typography>

      <Stepper alternativeLabel connector={<CustomConnector />} activeStep={1} sx={{ mt: 4 }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Box sx={{ textAlign: 'center', maxWidth: 200, mx: 'auto' }}>
                <Typography variant="h4" fontWeight={600} mb={1}>
                  {step.label}
                </Typography>
                <Typography variant="h5" color="text.secondary" fontWeight={500} mb={1}>
                  {step.sub}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}
