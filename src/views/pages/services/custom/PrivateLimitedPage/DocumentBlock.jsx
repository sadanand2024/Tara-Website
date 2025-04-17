import React from 'react';
import { Box, Container, Grid2, Typography, Stack, Paper, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FirstSection = () => {
  const sections = [
    {
      title: 'For Directors',
      items: [
        'PAN Card',
        'Aadhaar Card',
        'Passport size photo',
        'Mobile number and email',
        'DSC (if already obtained)',
        'Affidavit (auto generated)',
        'Voter ID / Passport / Driving License',
        'Latest utility bill or bank statement'
      ]
    },
    {
      title: 'For Registered Office',
      items: [
        'Electricity bill / Water bill / Gas bill',
        'Rental Agreement (if rented)',
        'NOC from owner',
        'Sale deed / Property deed (in case of own property)'
      ]
    },
    {
      title: 'For Foreign Directors (if any)',
      items: ['Passport (notarized)', 'Address proof (Apostilled Bank Statement / Utility Bill)']
    }
  ];

  const SectionCard = ({ title, items }) => (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1}>
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <CheckCircleIcon fontSize="small" color="primary" sx={{ mt: '3px' }} />
            <Typography variant="subtitle1" color="text.secondary">
              {item}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );

  return (
    <Container sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h1" fontWeight={700} gutterBottom>
          Documents Required
        </Typography>
        <Typography variant="h3" color="text.secondary" gutterBottom>
          Before we begin your registration process, make sure you have the following documents ready. Don’t worry — we’ll walk you through
          everything.
        </Typography>
      </Box>

      <Grid2 container spacing={4} justifyContent="center">
        {sections.map((section, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <SectionCard title={section.title} items={section.items} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default FirstSection;
