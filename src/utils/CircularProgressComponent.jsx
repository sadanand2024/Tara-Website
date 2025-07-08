import React from 'react';
import { Box, CircularProgress as MuiCircularProgress, Typography } from '@mui/material';

const CircularProgressComponent = ({ isLoading , displayContent}) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <MuiCircularProgress size={50} />
      <Typography variant="h5" color="text.secondary">
        {displayContent}
      </Typography>
    </Box>
  );
};

export default CircularProgressComponent;
