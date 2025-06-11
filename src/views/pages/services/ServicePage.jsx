import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import servicesData from 'data/servicesData';
import React from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from 'views/pages/maintenance/Error';
import FooterSection from '../landing/FooterSection';
import DocumentsRequired from './DocumentsRequired';
// import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import HowItWorksStepper from './HowItWorksStepper';
import PricingPlans from './PricingPlans';
import RelatedServices from './RelatedServices';
import WhatsIncluded from './WhatsIncluded';
import WhyChooseUs from './WhyChooseUs';
import PrivateLimitedPage from './custom/PrivateLimitedPage';
const ServicePage = () => {
   const theme = useTheme();
  const { category, slug } = useParams();
  const categoryData = servicesData[category];
  const pageData = categoryData?.pages[slug];

  if (!categoryData || !pageData) {
    return <ErrorPage />;
  }
  if (pageData?.customComponent === 'PrivateLimitedPage') {
    return <PrivateLimitedPage />;
  }
  return (
    <Box maxWidth={true} sx={{ mb: 3 }}>
      {/* <Container sx={{ py: { xs: 4, md: 8 } }}> */}
        {/* Always render Hero if present */}
        {pageData.heroSection && <HeroSection data={pageData.heroSection} />}

        {/* {(pageData.whoIsThisFor || pageData.relatedServices) && (
          <WhoShouldFile items={pageData.whoIsThisFor} related={pageData.relatedServices} />
        )} */}
        {/* {pageData.smartITRSelector && <SmartITRSelector data={pageData.smartITRSelector} />} */}
        <Box sx={{ py:12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', background: 'linear-gradient(270.18deg, rgba(184, 198, 255, 0.5) 0.15%, #FDFDFF 99.85%)' }}>

        {pageData.pricing && <PricingPlans data={pageData.pricing} />}
        </Box>
        {pageData.whatsIncluded && <WhatsIncluded items={pageData.whatsIncluded} />}
        <Box sx={{ py:1, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', background: 'linear-gradient(270.18deg, rgba(184, 198, 255, 0.5) 0.15%, #FDFDFF 99.85%)',mt:10 }}>

        {pageData.documentsRequired && <DocumentsRequired documents={pageData.documentsRequired} />}
        </Box>

       

        {pageData.howItWorks && <HowItWorksStepper steps={pageData.howItWorks} />}
        {pageData.whyChooseUs && <WhyChooseUs reasons={pageData.whyChooseUs} />}
        <Box sx={{ py:12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', background: 'linear-gradient(270.18deg, rgba(184, 198, 255, 0.5) 0.15%, #FDFDFF 99.85%)' }}>

        {pageData.relatedServices && <RelatedServices related={pageData.relatedServices} />}
       </Box>

        {/* {pageData.faqs && <FAQsSection faqs={pageData.faqs} />} */}

        {/* {pageData.stickyFooterCta && <StickyFooterCTA data={pageData.stickyFooterCta} />} */}
      {/* </Container> */}

      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0,textAlign: 'left' }}>
          <FooterSection />
          </Box>
    </Box>
  );
};

export default ServicePage;
