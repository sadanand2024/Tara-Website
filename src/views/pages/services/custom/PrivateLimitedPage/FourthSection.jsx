import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IncorporationJourneyStepper from './IncorporationJourneyStepper';
import { useTheme, useMediaQuery, Paper, Typography, Box, Fade, Container, Grid2, Divider, Stack, Button } from '@mui/material';

const ThirdSection = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Get Legally Ready',
      subtitle: 'Ensure your company has all necessary licenses & registrations to go operational',
      items: ['Get GST Registration', 'Professional Tax Registration', 'Shop & Establishment License', 'Udyam / MSME Registration'],
      cta: 'Explore More'
    },
    {
      title: 'Get Financially Operational',
      subtitle: "Your bank account isn't enough. You need books, invoicing, payroll & financial visibility",
      items: ['Virtual CFO', 'Bookkeeping', 'Invoicing', 'Payroll'],
      cta: 'Explore More'
    },
    {
      title: 'Get Recognized',
      subtitle: 'Get recognition to enhance your credibility,  and build trust with partners, clients, and investors.',

      items: ['Startup India DPIIT Registration', 'Trademark Registration', 'Trade License', 'EPF / ESIC Onboarding'],
      cta: 'Explore More'
    }
  ];

  // const SectionCard = ({ title, subtitle, items, cta }) => (
  //   <Paper
  //     elevation={4}
  //     sx={{
  //       p: 3,
  //       borderRadius: 3,
  //       maxWidth: 360,
  //       height: '100%',
  //       background: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.paper,
  //       display: 'flex',
  //       flexDirection: 'column',
  //       justifyContent: 'space-between',
  //       transition: 'all 0.3s ease',
  //       boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  //       '&:hover': {
  //         transform: 'translateY(-8px)',
  //         boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
  //       }
  //     }}
  //   >
  //     <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
  //       {title}
  //     </Typography>
  //     <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ maxWidth: 400 }}>
  //       {subtitle}
  //     </Typography>

  //     <Divider sx={{ mb: 2 }} />
  //     <Stack spacing={1}>
  //       {items.map((item, index) => (
  //         <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
  //           <CheckCircleIcon fontSize="small" color="primary" sx={{ mt: '3px' }} />
  //           <Typography variant="subtitle1" color="text.secondary">
  //             {item}
  //           </Typography>
  //         </Box>
  //       ))}
  //       <Button
  //         variant="contained"
  //         fullWidth
  //         size="large"
  //         sx={{
  //           mt: 3,
  //           fontWeight: 600,
  //           textTransform: 'none',
  //           borderRadius: '10px',
  //           py: 1.25
  //         }}
  //       >
  //         {cta}
  //       </Button>
  //     </Stack>
  //   </Paper>
  // );

  const SectionCard = ({ section }) => (
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
        {section.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ maxWidth: 400 }}>
        {section.subtitle}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1}>
        {section.items.map((item, index) => (
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
          What Next? 🚀 Power Up Your Company
        </Typography>

        <Typography variant="h3" color="text.secondary" gutterBottom>
          Incorporation is just step 1. These next steps are what successful startups never miss.
        </Typography>
      </Box>

      <Grid2 container spacing={4} justifyContent="center" alignItems="stretch">
        {sections.map((section, index) => (
          <Fade in timeout={1000} style={{ transitionDelay: `${index * 200}ms` }} key={index}>
            <Grid2 xs={12} sm={6} md={4} sx={{ height: '100%' }}>
              <SectionCard section={section} />
            </Grid2>
          </Fade>
        ))}
      </Grid2>
    </Container>
  );
};

export default ThirdSection;
