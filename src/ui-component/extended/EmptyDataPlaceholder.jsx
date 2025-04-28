import React from 'react';
import { Box, Typography } from '@mui/material';
import EmptyData from 'assets/images/maintenance/EmptyData.svg'; // imported as normal image

const EmptyDataPlaceholder = ({ title = 'No Data Found', subtitle = 'There is no content to display.' }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" textAlign="center" p={2}>
      <Box
        component="img"
        src={EmptyData}
        alt="No Data"
        sx={{
          maxWidth: '350px', // ✅ Limit image size
          width: '100%', // ✅ Let it resize inside table
          height: 'auto',
          mb: 1
        }}
      />
      <Typography variant="h5" color="textPrimary" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyDataPlaceholder;
