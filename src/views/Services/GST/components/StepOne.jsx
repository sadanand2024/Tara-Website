import React from 'react';
import { Box ,Button} from '@mui/material';
import BasicBusinessInfo from './BasicBusinessInfo';
import RegistrationInfo from './RegistrationInfo';
import PrincipalOfBusiness from './PrinicipalOfBusiness';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



const StepOne = ({step, setStep}) => {
  return (
    <>  
    <Box>
      
        <BasicBusinessInfo />
        <RegistrationInfo />
        <PrincipalOfBusiness/>
     
    </Box>
     <Box display="flex" justifyContent="flex-end" mt={2}>
      <Button variant="contained" size="small" color="primary" onClick={() => setStep(step + 1)} endIcon={<ArrowForwardIcon />}>
        Continue
      </Button>
    </Box>
    </>
  );
};

export default StepOne;
