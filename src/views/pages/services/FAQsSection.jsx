
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
  useTheme
} from '@mui/material';
import React from 'react';
import { Fade } from 'react-awesome-reveal'; 

const FAQsSection = ({ faqs }) => {
  const theme = useTheme();

  return (
    <Fade direction="up" cascade damping={0.1} triggerOnce>
      <Container sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 0 } }}>
        {/* FAQ Header */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <HelpOutlineIcon sx={{ fontSize: { xs: 40, md: 48 }, color: '#FF5A5F', mb: 1 }} />
          <Typography
            variant="h3"
            fontWeight={700}
            fontFamily="'Georgia', serif"
            textAlign="center"
            mb={1}
            sx={{ color: '#1c1c1e' }}
          >
            FAQ
          </Typography>
          <Typography
            variant="body1"
            fontSize="1.1rem"
            textAlign="center"
            mb={4}
            color="text.secondary"
            maxWidth="600px"
          >
            Great answers are kind of our thing! Here are some answers to frequently asked questions to help you get started.
          </Typography>
        </Box>
        <Box maxWidth="720px" width="100%" sx={{ mx: 'auto', px: { xs: 0, sm: 2 } }}>
          {faqs.map((faq, idx) => (
            <Fade key={idx} direction="up" triggerOnce delay={idx * 100}>
              <Accordion
                elevation={0}
                disableGutters
                square
                sx={{
                  mb: 2,
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#6b7280' }} />}
                  sx={{ px: 3, py: 2 }}
                >
                  <Typography fontWeight={600} fontSize="1.05rem">
                    {faq.question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, pb: 2, pt: 0 }}>
                  <Typography color="text.secondary" fontSize="0.95rem">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Fade>
          ))}
        </Box>
      </Container>
    </Fade>
  );
};

export default FAQsSection;
