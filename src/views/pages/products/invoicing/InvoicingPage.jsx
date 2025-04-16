import React from 'react';
import { Box, Typography } from '@mui/material';

const InvoicingPage = () => {
  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: { xs: 4, md: 6 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Invoicing Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Create and send invoices, manage payments, and track receivables easily.
      </Typography>
    </Box>
  );
};

export default InvoicingPage;
