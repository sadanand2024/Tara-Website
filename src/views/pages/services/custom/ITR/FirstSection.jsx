import React, { useState } from 'react';
import { Box, Button, CardMedia, Container, Grid2, Stack, Typography, Paper, Divider, FormControlLabel, Checkbox } from '@mui/material';
import { IconCircleCheck } from '@tabler/icons-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LayerRight from 'assets/images/landing/customization-right.png';

const FirstSection = () => {
  const [selectedSources, setSelectedSources] = useState([]);

  const handleToggle = (title) => {
    setSelectedSources((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]));
  };

  const listSX = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    py: 0.5,
    fontSize: '1rem',
    color: 'grey.900',
    svg: { color: 'secondary.main' }
  };

  const incomeSources = [
    {
      title: 'Salaried Individual',
      description: 'Form 16, salary income, standard deduction'
    },
    {
      title: 'Freelancer/Business owner',
      description: 'Income from profession & business (Not Company)'
    },
    {
      title: 'Capital Gains',
      description: 'Stock shares, mutual funds, property, crypto'
    },
    {
      title: 'NRI / Foreign Income',
      description: 'Earn income abroad, foreign assets, foreign accounts'
    },
    {
      title: 'House Property',
      description: 'Earned rent, or owned multiple properties'
    },
    {
      title: 'Company / LLP / Trust / Firm / Society',
      description: 'Filing on behalf of Pvt Ltd, LLP, Trust, Firm, Society'
    }
  ];

  return (
    <Container sx={{ py: 10 }}>
      <Grid2 container spacing={8} alignItems="center">
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h1" fontWeight={700} gutterBottom>
              File your Income Tax Return Online – Fast, Accurate & CA-verified
            </Typography>
            <Typography variant="h3" color="text.secondary" gutterBottom>
              Whether you are salaried, business, or an NRI – we have got the right filing for you!
            </Typography>
          </Box>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <Box sx={listSX}>
              <IconCircleCheck size={20} /> CA verified filing
            </Box>
            <Box sx={listSX}>
              <IconCircleCheck size={20} /> Track status live
            </Box>
            <Box sx={listSX}>
              <IconCircleCheck size={20} /> Auto-fetch from 26AS, AIS
            </Box>
            <Box sx={listSX}>
              <IconCircleCheck size={20} /> Affordable, transparent pricing
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" size="large">
              Start Filing Now
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
          Tell us about your income sources
        </Typography>

        <Typography variant="h3" color="text.secondary" gutterBottom>
          (You can select multiple options)
        </Typography>
      </Box>

      <Grid2 container spacing={3}>
        {incomeSources.map((source, index) => {
          const isSelected = selectedSources.includes(source.title);

          return (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                elevation={isSelected ? 6 : 2}
                onClick={() => handleToggle(source.title)}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #1976d2' : '1px solid #eee',
                  backgroundColor: isSelected ? 'primary.light' : 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <FormControlLabel
                  control={<Checkbox checked={isSelected} onChange={() => handleToggle(source.title)} color="primary" />}
                  label={
                    <Box>
                      <Typography variant="h5" fontWeight={600}>
                        {source.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {source.description}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid2>
          );
        })}
      </Grid2>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 6, textAlign: 'center' }}
      >
        <Typography variant="h4" color="text.secondary">
          Not sure which income sources to pick? Let us guide you with a few simple questions.
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
          <Button variant="outlined" size="large" color="primary">
            Help Me Choose
          </Button>
          <Button variant="contained" size="large" color="primary">
            Continue
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default FirstSection;
