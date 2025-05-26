import React from 'react';
import { Box } from '@mui/material';
import BusinessIdentityStructureSection from './BusinessIdentityStructureSection';
import PromoterSignatorySection from './PromoterSignatorySection';
import BusinessPremisesSection from './BusinessPremisesSection';

const StepOne = ({}) => {
  return (
    <Box>
      <BusinessIdentityStructureSection />
      <PromoterSignatorySection />
      <BusinessPremisesSection />
    </Box>
  );
};

export default StepOne;
