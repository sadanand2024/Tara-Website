import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import productsData from 'data/productsData';
import { useParams } from 'react-router-dom';
import ErrorPage from 'views/pages/maintenance/Error';
import PricingComponent from './components/ProductsPricingComponent';
// Import common components
import FooterSection from '../landing/FooterSection';
import FirstSection from './components/FirstSection';
import HeroSection from './components/HeroSection';
import KeyFeaturesSection from './components/KeyFeaturesSection';
import TargetAudienceSection from './components/TargetAudienceSection';


const ProductPage = () => {
  const theme = useTheme();
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
       <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0,textAlign: 'left' }}>
              <FooterSection />
            </Box>
      
    </Box>
  );
};

export default ProductPage;
