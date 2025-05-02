import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import productsData from 'data/productsData';
import ErrorPage from 'views/pages/maintenance/Error';
import { IconArrowRight } from '@tabler/icons-react';

// Import common components
import HeroSection from './components/HeroSection';
import KeyFeaturesSection from './components/KeyFeaturesSection';
import FirstSection from './components/FirstSection';
import TargetAudienceSection from './components/TargetAudienceSection';

const ProductPage = () => {
  const { category } = useParams();
  const productData = productsData[category];
  console.log(productData);
  if (!productData) {
    return <ErrorPage />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <HeroSection data={productData} />
      </Container>

      {/* First Section */}
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container sx={{ py: { xs: 4, md: 8 } }}>
          <FirstSection data={productData} />
        </Container>
      </Box>

      {/* Key Features Section */}
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <KeyFeaturesSection data={productData} />
      </Container>

      {/* Target Audience Section */}
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container sx={{ py: { xs: 4, md: 8 } }}>
          <TargetAudienceSection data={productData} />
        </Container>
      </Box>
    </Box>
  );
};

export default ProductPage;
