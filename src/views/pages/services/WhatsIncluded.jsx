import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import React from 'react';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SecurityIcon from '@mui/icons-material/Security';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const WhatsIncluded = ({ title = "What's Included", items }) => {
  const iconList = [
    { icon: <SecurityIcon />, color: '#d32f2f', gradient: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)' },
    { icon: <IntegrationInstructionsIcon />, color: '#1976d2', gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' },
    { icon: <SmartToyIcon />, color: '#7b1fa2', gradient: 'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)' },
    { icon: <SupportAgentIcon />, color: '#388e3c', gradient: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)' },
    { icon: <CloudDoneIcon />, color: '#0288d1', gradient: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)' },
    { icon: <AutoGraphIcon />, color: '#fbc02d', gradient: 'linear-gradient(135deg, #fbc02d 0%, #f9a825 100%)' },
    { icon: <TaskAltIcon />, color: '#512da8', gradient: 'linear-gradient(135deg, #512da8 0%, #4527a0 100%)' },
    { icon: <CheckCircleIcon />, color: '#ff5722', gradient: 'linear-gradient(135deg, #ff5722 0%, #f4511e 100%)' },
    { icon: <SupportAgentIcon />, color: '#388e3c', gradient: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)' },

  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 5 } }}>
      <Fade triggerOnce direction="up">
        <Typography
          variant="h2"
          fontWeight={700}
          textAlign="center"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mb: { xs: 4, md: 6 },
            background: 'linear-gradient(45deg,  #512da8 0%,  #512da8 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {title}
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 2, md: 3 }}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          {items.map((label, idx) => (
            <Box
              key={idx}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 24px)' },
                minWidth: { xs: '100%', sm: '300px', md: '300px' },
                maxWidth: { xs: '100%', sm: '400px', md: '400px' }
              }}
            >
              <Fade triggerOnce delay={idx * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    height: 180,
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${iconList[idx % iconList.length].color}`,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      '& .icon-container': {
                        transform: 'scale(1.1)',
                      },
                      '& .gradient-overlay': {
                        opacity: 0.1,
                      }
                    }
                  }}
                >
                  <Box
                    className="gradient-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: iconList[idx].gradient,
                      opacity: 0.05,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                  <Box
                    className="icon-container"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: iconList[idx].gradient,
                      mb: 2,
                      transition: 'transform 0.3s ease',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      
                    }}
                  >
                    {React.cloneElement(iconList[idx].icon, {
                      sx: {
                        fontSize: 28,
                        color: 'white'
                      }
                    })}
                  </Box>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    textAlign="center"
                    sx={{
                      color: 'text.primary',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.4,
                      maxWidth: '90%',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {label}
                  </Typography>
                </Paper>
              </Fade>
            </Box>
          ))}
        </Stack>
      </Fade>
    </Container>
  );
};

export default WhatsIncluded;
