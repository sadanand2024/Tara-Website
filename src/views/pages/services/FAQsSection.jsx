'use client';
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQsSection = ({ faqs }) => {
  return (
    <Box mb={8}>
      <Typography variant="h2" fontWeight={700} textAlign="center" mb={4}>
        FAQs
      </Typography>

      {faqs.map((faq, idx) => (
        <Accordion key={idx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQsSection;
