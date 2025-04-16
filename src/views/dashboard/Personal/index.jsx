import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
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

export default function Personal() {
  const services = [
    { title: 'Active Services', count: '3', icon: <DescriptionIcon fontSize="large" /> },
    { title: 'Tasks Pending', count: '2', icon: <TaskIcon fontSize="large" /> },
    { title: 'Docs Uploaded', count: '7', icon: <UpdateIcon fontSize="large" /> },
    { title: 'Due Soon', count: '1', icon: <EventIcon fontSize="large" /> }
  ];

  const taraAssistButtons = [
    { title: 'Upload Notice', icon: <UploadFileIcon /> },
    { title: 'Ask a Question', icon: <QuestionAnswerIcon /> },
    { title: 'Schedule a Call', icon: <EventNoteIcon /> },
    { title: 'Chat with Expert', icon: <SupportAgentIcon /> }
  ];

  const taraAssistCards = [
    { title: 'New Service', icon: <AddCircleOutlineIcon /> },
    { title: 'Create Task', icon: <AssignmentIcon /> },
    { title: 'Draft a Doc', icon: <DescriptionOutlinedIcon /> },
    { title: 'Upload Document', icon: <UploadFileIcon /> },
    { title: 'Check Loan Eligibility', icon: <AccountBalanceIcon /> }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Greeting Section */}
      <Typography variant="h1" sx={{ color: 'secondary.main', mb: 1 }}>
        Hello Ratan!
      </Typography>
      <Typography variant="h4" sx={{ color: 'text.secondary', mb: 4 }}>
        Let's stay on top of your finances!
      </Typography>

      {/* Services Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {services.map((service, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                textAlign: 'center',
                height: '100%',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(111, 66, 193, 0.2)',
                boxShadow: 'none',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(111, 66, 193, 0.15)',
                  borderColor: 'secondary.main',
                  '& .icon-box': {
                    transform: 'scale(1.1)',
                    color: 'secondary.dark'
                  },
                  '& .count-text': {
                    color: 'secondary.main'
                  }
                }
              }}
            >
              <CardContent>
                <Box
                  className="icon-box"
                  sx={{
                    color: 'secondary.main',
                    mb: 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {service.icon}
                </Box>
                <Typography
                  className="count-text"
                  variant="h3"
                  sx={{
                    mb: 1,
                    fontWeight: 'bold',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {service.count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ITR Filing Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant="h3">Complete your ITR filing for FY: 2024-25</Typography>
          <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
            Start Filing
          </Button>
          <Button variant="outlined" color="secondary">
            Talk to Expert
          </Button>
        </Stack>
      </Box>

      {/* TARA Assist Section */}
      <Box>
        <Typography variant="h3" color={'text.primary'} sx={{ mb: 2 }}>
          TARA ASSIST: Your Go-to Help Hub
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Confused about tax rules? Got a GST/Tax notice? Need an expert advice? TARA ASSIST is here
        </Typography>

        {/* TARA Assist Action Buttons - First Row */}
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {taraAssistButtons.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={action.icon}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 1,
                    px: 3,
                    py: 1.5,
                    width: '100%',
                    bgcolor: 'secondary["800"]',
                    borderColor: 'rgba(111, 66, 193, 0.2)',
                    color: 'secondary.main',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'secondary.main',
                      color: 'white',
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  {action.title}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* TARA Assist Cards - Second Row */}
          <Grid container spacing={2}>
            {taraAssistCards.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(111, 66, 193, 0.2)',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(111, 66, 193, 0.15)',
                      borderColor: 'secondary.main',
                      '& .icon-box': {
                        transform: 'scale(1.1)',
                        color: 'secondary.dark'
                      },
                      '& .count-text': {
                        color: 'secondary.main'
                      }
                    }
                  }}
                >
                  <CardContent>
                    <Box
                      className="icon-box"
                      sx={{
                        color: 'secondary.main',
                        mb: 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography
                      className="title-text"
                      sx={{
                        fontSize: '0.9rem',
                        color: 'text.secondary',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
