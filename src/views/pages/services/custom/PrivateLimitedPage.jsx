import React from 'react';
import { Box, Typography, Button, Grid, Paper, Divider, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SectionCard = ({ title, items }) => (
  <Paper elevation={4} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Stack spacing={1}>
      {items.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'start' }}>
          <CheckCircleIcon fontSize="small" color="primary" sx={{ mt: 0.5, mr: 1 }} />
          <Typography variant="body2" color="text.primary">
            {item}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Paper>
);

const PrivateLimitedPage = () => {
  const sections = [
    {
      title: 'Incorporation Essentials',
      items: [
        'Company Name approval filing',
        'DIN for 2 directors',
        '2 Class-III DSCs',
        'MOA + AOA Drafting',
        'SPICe+ form filing',
        'PAN & TAN',
        'Certificate of Incorporation'
      ]
    },
    {
      title: 'Documents & Deliverables',
      items: [
        'Digital Incorporation Kit',
        'Company Master Data profile',
        'Board Resolution Templates',
        'Personalized Compliance Checklist (Post Incorporation)',
        'All documents securely stored in your document wallet'
      ]
    },
    {
      title: 'Add-on Value & Expert Support',
      items: [
        'Dedicated Relationship Manager',
        'Phone, Email & Chat Support',
        'Name Suggestion & Validation Assistance',
        'Free Business Structure Advice',
        'Free Document Storage (Doc Wallet)',
        'Priority Turnaround Option'
      ]
    }
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: { xs: 4, md: 6 }, backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: 'primary.light',
          p: { xs: 3, md: 6 },
          borderRadius: 3,
          textAlign: 'center',
          mb: 8
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Start Your Business the Right Way
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Private Limited Company Registration – Fast, Easy, Transparent!
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mt: 2 }}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Company registration with professional guidance end-to-end
          <br />
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> PAN, TAN, MOA, AOA, DSC, DIN, Certificate of incorporation included
          <br />
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Get your application submitted within 3 working days
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
          <Button variant="outlined" color="primary" size="large">
            Talk to Expert
          </Button>
        </Stack>
        <Typography variant="body2" color="primary" sx={{ mt: 3, textDecoration: 'underline', cursor: 'pointer' }}>
          View Documents Required
        </Typography>
      </Box>

      {/* What's Included Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          What's included in the service?
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth="md" mx="auto">
          We don't just register companies. We help you build a strong business foundation. Here's everything you get when you choose TARA
          FIRST.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={4} key={index}>
            <SectionCard title={section.title} items={section.items} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PrivateLimitedPage;
