import React from 'react';
import { Box } from '@mui/material';
import BasicBusinessInfo from './BasicBusinessInfo';
import RegistrationInfo from './RegistrationInfo';
import PrincipalOfBusiness from './PrinicipalOfBusiness';



const StepOne = ({}) => {
  return (
    <Box>
      
        <BasicBusinessInfo />
        <RegistrationInfo />
        <PrincipalOfBusiness/>
    </Box>
  );
};

export default StepOne;
