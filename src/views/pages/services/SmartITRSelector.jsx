import React from 'react';
import { Box, Paper, Typography, Stack, Button, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Fade } from 'react-awesome-reveal';

const SmartITRSelector = ({ data }) => {
  if (!data) return null;

  return (
    <Fade triggerOnce direction="up">
      <Box sx={{ my: 8 }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            textAlign: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Typography variant="h2" fontWeight={700} gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {data.description}
          </Typography>

          <Stack spacing={1} sx={{ my: 3 }}>
            {data.questions?.map((q, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" color="primary" />
                <Typography variant="body1">{q}</Typography>
              </Box>
            ))}
          </Stack>

          {data.cta && (
            <Button variant="contained" size="large" startIcon={<CheckCircleIcon />} sx={{ mt: 2 }}>
              {data.cta.label}
            </Button>
          )}

          {data.alternativeOption && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {data.alternativeOption.label}
              </Typography>

              <Grid container spacing={1} justifyContent="center">
                {data.alternativeOption.dropdown.map((item, idx) => (
                  <Grid item key={idx}>
                    <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                      {item}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default SmartITRSelector;
