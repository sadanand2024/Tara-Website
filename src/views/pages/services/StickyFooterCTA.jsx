'use client';
import React from 'react';
import { Box, Typography, Stack, Button, Paper } from '@mui/material';

const StickyFooterCTA = ({ data }) => {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'background.paper',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        mt: 4
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography variant="h5" fontWeight={600}>
          {data.text}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          {data.buttons.map((btn, idx) => (
            <Button key={idx} variant="contained" size="large">
              {btn.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default StickyFooterCTA;
