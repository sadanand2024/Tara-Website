import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IncorporationJourneyStepper from './IncorporationJourneyStepper';
import { useTheme, useMediaQuery, Paper, Typography, Box, Fade, Container, Grid2, Divider, Stack } from '@mui/material';

const ThirdSection = () => {
  const theme = useTheme();

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
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
        }
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
    <Container>
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

      <Box sx={{ textAlign: 'center', mt: 10, mb: 6 }}>
        <Typography variant="h1" fontWeight={700} gutterBottom>
          Your Incorporation Journey With Tara First
        </Typography>
        <Typography variant="h3" color="text.secondary" gutterBottom>
          Here's how your company goes from an idea to a registered entity — step-by-step with us.
        </Typography>
      </Box>

      <IncorporationJourneyStepper />
    </Container>
  );
};

export default ThirdSection;
