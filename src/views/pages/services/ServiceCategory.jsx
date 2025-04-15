import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import servicesMoreData from 'data/servicesMoreData';
import ErrorPage from 'views/pages/maintenance/Error';

const ServiceCategory = () => {
  const { category } = useParams();
  const categoryData = servicesMoreData[category];

  if (!categoryData) {
    return <ErrorPage />;
  }

  return (
    <Box sx={{ px: 4, mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        {categoryData.title}
      </Typography>
      <Typography variant="body1">Explore more services under this category.</Typography>
      {/* Optionally list all categoryData.pages here */}
    </Box>
  );
};

export default ServiceCategory;
