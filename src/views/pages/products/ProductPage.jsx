import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import productsData from 'data/productsData';
import ErrorPage from 'views/pages/maintenance/Error';
import { IconArrowRight } from '@tabler/icons-react';
import PricingComponent from './components/ProductsPricingComponent';
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
      <Container sx={{ py: { xs: 4, md: 8, lg: 2 } }}>
        <HeroSection data={productData} />
      </Container>

      {/* First Section */}
      <Box sx={{ bgcolor: 'background.default' }}>
        <FirstSection data={productData} />
      </Box>

      {/* Key Features Section */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <KeyFeaturesSection data={productData} />
      </Box>

      {/* Target Audience Section */}
      <Box sx={{ bgcolor: 'background.default' }}>
        <TargetAudienceSection data={productData} />
      </Box>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ py: { xs: 4, md: 8 } }}>
        <PricingComponent plans={productData.plans} planList={productData.planList} />
      </Box>
    </Box>
  );
};

export default ProductPage;
