'use client';

import {
  AccessTime,
  Assessment,
  DesignServices,
  EmojiEvents,
  Insights,
  QueryStats,
  Security,
  SupportAgent,
  TrendingUp,
  VerifiedUser,
} from '@mui/icons-material';
import { Box, Typography,Container } from '@mui/material';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const icons = [
  DesignServices,
  VerifiedUser,
  SupportAgent,
  QueryStats,
  Assessment,
  Insights,
  EmojiEvents,
  TrendingUp,
 
  Security,
  AccessTime,
  
  Assessment,
];

const WhyChooseUs = ({ reasons }) => {
  return (
    <Container sx={{mt:5}}>
    <Box mb={10} px={2}>
      <Typography variant="h2" fontWeight={700} textAlign="center" mb={1}>
        Why Choose <Box component="span" color='rgb(33, 172, 223)'>Us</Box>?
      </Typography>
      <Typography variant="subtitle1" textAlign="center" color="text.secondary" mb={5}>
        Get more free slide templates: JustFreeSlide.com
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={4}
      >
        {reasons.map((reason, idx) => {
          const Icon = icons[idx % icons.length];
          return (
            <Fade key={idx} triggerOnce delay={idx * 100}>
              <Box
                sx={{
                  width: 200,
                  height: 160,
                  clipPath:
                    'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.3s ease',
                  padding: 2,
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                  },
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 32, color:'rgb(33, 172, 223)', mb: 1 }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{
                      wordWrap: 'break-word',
                      fontSize: '0.9rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {reason}
                  </Typography>
                </Box>
              </Box>
            </Fade>
          );
        })}
      </Box>
    </Box>
    </Container>
  );
};

export default WhyChooseUs;
