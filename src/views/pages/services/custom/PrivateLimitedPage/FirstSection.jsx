import React from 'react';
import { Box, Button, CardMedia, Container, Grid2, Link, Stack, Typography, Paper, Divider } from '@mui/material';
import { IconCircleCheck } from '@tabler/icons-react';
import LayerRight from 'assets/images/landing/customization-right.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FirstSection = () => {
  const listSX = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    py: 0.5,
    fontSize: '1rem',
    color: 'grey.900',
    svg: { color: 'secondary.main' }
  };

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
        'Personalized Compliance Checklist',
        'Documents stored in your document wallet'
      ]
    },
    {
      title: 'Add-on Value & Expert Support',
      items: [
        'Dedicated Relationship Manager',
        'Phone, Email & Chat Support',
        'Name Suggestion & Validation Help',
        'Free Business Structure Advice',
        'Free Document Storage',
        'Priority Turnaround Option'
      ]
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
    <Container sx={{ py: 10 }}>
      <Grid2 container spacing={8} alignItems="center">
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h1" fontWeight={700} gutterBottom>
              Start Your Business the Right Way
            </Typography>
            <Typography variant="h3" color="text.secondary" gutterBottom>
              Private Limited Company Registration – Fast, Easy, Transparent!
            </Typography>
          </Box>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <Box sx={listSX}>
              <IconCircleCheck size={20} /> End-to-end company registration support
            </Box>
            <Box sx={listSX}>
              <IconCircleCheck size={20} /> PAN, TAN, MOA, AOA, DSC, DIN & more included
            </Box>
            <Box sx={listSX}>
              <IconCircleCheck size={20} /> Submit your application in 3 working days
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" size="large">
              Get Started
            </Button>
            <Button variant="outlined" color="primary" size="large">
              Talk to Expert
            </Button>
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <CardMedia component="img" image={LayerRight} alt="Private Limited" sx={{ width: '50%', mx: 'auto' }} />
        </Grid2>
      </Grid2>

      <Box sx={{ textAlign: 'center', mt: 10, mb: 6 }}>
        <Typography variant="h1" fontWeight={700} gutterBottom>
          What's Included in the Service?
        </Typography>
        <Typography variant="h3" color="text.secondary" maxWidth={700} mx="auto">
          We don’t just register companies — we help you build a strong foundation with complete documentation, compliance, and dedicated
          support.
        </Typography>
      </Box>

      <Grid2 container spacing={4}>
        {sections.map((section, index) => (
          <Grid2 size={{ xs: 12, md: 4 }} key={index}>
            <SectionCard title={section.title} items={section.items} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default FirstSection;
