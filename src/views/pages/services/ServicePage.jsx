import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import servicesData from 'data/servicesData';
import ErrorPage from 'views/pages/maintenance/Error';

import HeroSection from './HeroSection';
import WhoShouldFile from './WhoShouldFile';
import SmartITRSelector from './SmartITRSelector'; // Only render if exists
import PricingPlans from './PricingPlans';
import WhatsIncluded from './WhatsIncluded';
import DocumentsRequired from './DocumentsRequired';
import HowItWorksStepper from './HowItWorksStepper';
import WhyChooseUs from './WhyChooseUs';
import FAQsSection from './FAQsSection';
import RelatedServices from './RelatedServices';
import StickyFooterCTA from './StickyFooterCTA';

const ServicePage = () => {
  const { category, slug } = useParams();
  const categoryData = servicesData[category];
  const pageData = categoryData?.pages[slug];

  if (!categoryData || !pageData) {
    return <ErrorPage />;
  }
  return (
    <Container sx={{ py: { xs: 4, md: 8 } }}>
      {/* Always render Hero if present */}
      {pageData.heroSection && <HeroSection data={pageData.heroSection} />}

      {pageData.whoIsThisFor && <WhoShouldFile items={pageData.whoIsThisFor} />}
      {pageData.smartITRSelector && <SmartITRSelector data={pageData.smartITRSelector} />}
      {pageData.pricing && <PricingPlans data={pageData.pricing} />}
      {pageData.whatsIncluded && <WhatsIncluded items={pageData.whatsIncluded} />}
      {pageData.documentsRequired && <DocumentsRequired documents={pageData.documentsRequired} />}
      {pageData.howItWorks && <HowItWorksStepper steps={pageData.howItWorks} />}
      {pageData.whyChooseUs && <WhyChooseUs reasons={pageData.whyChooseUs} />}
      {pageData.pricing && <PricingPlans data={pageData.pricing} />}

      {pageData.faqs && <FAQsSection faqs={pageData.faqs} />}
      {pageData.relatedServices && <RelatedServices related={pageData.relatedServices} />}
      {pageData.stickyFooterCta && <StickyFooterCTA data={pageData.stickyFooterCta} />}
    </Container>
  );
};

export default ServicePage;
