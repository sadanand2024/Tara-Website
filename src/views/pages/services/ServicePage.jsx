import { Container } from '@mui/material';
import servicesData from 'data/servicesData';
import React from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from 'views/pages/maintenance/Error';
import DocumentsRequired from './DocumentsRequired';
import FAQsSection from './FAQsSection';
import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import HowItWorksStepper from './HowItWorksStepper';
import PricingPlans from './PricingPlans';
import WhatsIncluded from './WhatsIncluded';
import WhoShouldFile from './WhoShouldFile';
import WhyChooseUs from './WhyChooseUs';
import StickyFooterCTA from './StickyFooterCTA';
import PrivateLimitedPage from './custom/PrivateLimitedPage';
const ServicePage = () => {
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
    <Container maxWidth={true} sx={{ mb: 3 }}>
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        {/* Always render Hero if present */}
        {pageData.heroSection && <HeroSection data={pageData.heroSection} />}

        {(pageData.whoIsThisFor || pageData.relatedServices) && (
          <WhoShouldFile items={pageData.whoIsThisFor} related={pageData.relatedServices} />
        )}
        {/* {pageData.smartITRSelector && <SmartITRSelector data={pageData.smartITRSelector} />} */}
        {pageData.pricing && <PricingPlans data={pageData.pricing} />}
        {pageData.whatsIncluded && <WhatsIncluded items={pageData.whatsIncluded} />}
        {pageData.documentsRequired && <DocumentsRequired documents={pageData.documentsRequired} />}

        {pageData.whyChooseUs && <WhyChooseUs reasons={pageData.whyChooseUs} />}

        {pageData.howItWorks && <HowItWorksStepper steps={pageData.howItWorks} />}

        {pageData.faqs && <FAQsSection faqs={pageData.faqs} />}

        {pageData.stickyFooterCta && <StickyFooterCTA data={pageData.stickyFooterCta} />}
      </Container>

      <FooterSection />
    </Container>
  );
};

export default ServicePage;
