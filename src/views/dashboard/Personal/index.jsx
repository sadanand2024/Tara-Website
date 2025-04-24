import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, alpha } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

// Icons
import DescriptionIcon from '@mui/icons-material/Description';
import TaskIcon from '@mui/icons-material/Task';
import UpdateIcon from '@mui/icons-material/Update';
import EventIcon from '@mui/icons-material/Event';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Convert makeStyles to styled components

const GreetingSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative'
}));

const Heading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1)
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  border: '1px solid',
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    '& .icon-box': {
      transform: 'scale(1.1) translateY(-2px)'
    },
    '& .count-text': {
      color: 'inherit'
    },
    '&::after': {
      transform: 'translateY(0)'
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    transform: 'translateY(4px)',
    transition: 'transform 0.3s ease'
  }
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'all 0.3s ease'
}));

const CountText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  transition: 'color 0.3s ease'
}));

const ItrSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2, 3, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
  border: '1px solid',
  borderColor: alpha(theme.palette.secondary.main, 0.1)
}));

const TaraSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: alpha(theme.palette.secondary.main, 0.04),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2
}));

const AssistButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  borderWidth: 2,
  textAlign: 'left',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}));

const AssistCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  border: '1px solid',
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    '& .icon-box': {
      transform: 'scale(1.1)'
    }
  }
}));

const ButtonIcon = styled(Box)(({ theme }) => ({
  fontSize: 28,
  display: 'flex',
  alignItems: 'center'
}));

export default function Personal() {
  const services = [
    {
      title: 'Active Services',
      count: '3',
      icon: <DescriptionIcon fontSize="large" />,
      color: 'primary'
    },
    {
      title: 'Tasks Pending',
      count: '2',
      icon: <TaskIcon fontSize="large" />,
      color: 'warning'
    },
    {
      title: 'Docs Uploaded',
      count: '7',
      icon: <UpdateIcon fontSize="large" />,
      color: 'info'
    },
    {
      title: 'Due Soon',
      count: '1',
      icon: <EventIcon fontSize="large" />,
      color: 'error'
    }
  ];

  const taraAssistButtons = [
    { title: 'Upload Notice', icon: <UploadFileIcon fontSize="large" />, description: 'Share your tax notices for expert review' },
    { title: 'Ask a Question', icon: <QuestionAnswerIcon fontSize="large" />, description: 'Get answers to your tax queries' },
    { title: 'Schedule a Call', icon: <EventNoteIcon fontSize="large" />, description: 'Book a consultation with our experts' },
    { title: 'Chat with Expert', icon: <SupportAgentIcon fontSize="large" />, description: 'Real-time support from tax professionals' }
  ];

  const taraAssistCards = [
    { title: 'New Service', icon: <AddCircleOutlineIcon fontSize="medium" />, description: 'Start a new tax service' },
    { title: 'Create Task', icon: <AssignmentIcon fontSize="medium" />, description: 'Set up reminders and tasks' },
    { title: 'Draft a Doc', icon: <DescriptionOutlinedIcon fontSize="medium" />, description: 'Create tax-related documents' },
    { title: 'Upload Document', icon: <UploadFileIcon fontSize="medium" />, description: 'Share your tax documents' },
    { title: 'Check Loan Eligibility', icon: <AccountBalanceIcon fontSize="medium" />, description: 'Quick loan eligibility check' }
  ];

  return (
    <Box>
      <GreetingSection>
        <Heading variant="h1" color="secondary.main">
          Hello Ratan!
        </Heading>
        <Typography variant="h4" color="text.secondary">
          Let's stay on top of your finances!
        </Typography>
      </GreetingSection>

      {/* Services Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {services.map((service, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <ServiceCard
              sx={{
                borderColor: (theme) => alpha(theme.palette[service.color].main, 0.2),
                boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette[service.color].main, 0.1)}`,
                '&:hover': {
                  boxShadow: (theme) => `0 12px 32px ${alpha(theme.palette[service.color].main, 0.2)}`
                },
                '&::after': {
                  bgcolor: `${service.color}.main`
                }
              }}
            >
              <CardContentStyled>
                <Stack spacing={2} direction="row" sx={{ px: 4 }} alignItems="center" justifyContent="space-between">
                  <IconBox
                    className="icon-box"
                    sx={{
                      color: (theme) => alpha(theme.palette[service.color].main, 0.8),
                      bgcolor: (theme) => alpha(theme.palette[service.color].main, 0.1)
                    }}
                  >
                    {service.icon}
                  </IconBox>
                  <Stack spacing={0.5} direction="column" alignItems="center">
                    <CountText className="count-text" variant="h2" sx={{ color: (theme) => alpha(theme.palette[service.color].main, 0.8) }}>
                      {service.count}
                    </CountText>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      {service.title}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContentStyled>
            </ServiceCard>
          </Grid>
        ))}
      </Grid>

      {/* ITR Filing Section */}
      <ItrSection>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          <Typography variant="h3" color="text.primary">
            Complete your ITR filing for FY: 2024-25
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Start Filing
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ px: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600, borderWidth: 2 }}
            >
              Talk to Expert
            </Button>
          </Stack>
        </Stack>
      </ItrSection>

      {/* TARA Assist Section */}
      <TaraSection>
        <Heading variant="h3" color="text.primary">
          TARA ASSIST: Your Go-to Help Hub
        </Heading>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Confused about tax rules? Got a GST/Tax notice? Need expert advice? TARA ASSIST is here
        </Typography>

        <Stack spacing={4}>
          {/* TARA Assist Action Buttons */}
          <Grid container spacing={3}>
            {taraAssistButtons.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <AssistButton
                  variant="outlined"
                  color="secondary"
                  startIcon={<ButtonIcon>{action.icon}</ButtonIcon>}
                  sx={{
                    borderColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
                    bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.02),
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.05)
                    }
                  }}
                >
                  <Stack alignItems="flex-start">
                    <Typography color="text.primary" fontWeight={600} sx={{ textTransform: 'none', mb: 0.5 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'none', textAlign: 'left' }}>
                      {action.description}
                    </Typography>
                  </Stack>
                </AssistButton>
              </Grid>
            ))}
          </Grid>

          {/* TARA Assist Cards */}
          <Grid container spacing={3}>
            {taraAssistCards.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
                <AssistCard
                  sx={{
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      boxShadow: (theme) => `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <CardContentStyled>
                    <Stack spacing={2} alignItems="center">
                      <IconBox
                        className="icon-box"
                        sx={{
                          color: 'primary.main',
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        {action.icon}
                      </IconBox>
                      <Stack spacing={0.5} alignItems="center">
                        <Typography color="text.primary" fontWeight={600}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" align="center">
                          {action.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContentStyled>
                </AssistCard>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </TaraSection>
    </Box>
  );
}
