import React, { useEffect, useState } from 'react';
import { Box,Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import BusinessIdentityStructureSection from './BusinessIdentityStructureSection';
import PromoterSignatorySection from './PromoterSignatorySection';
import BusinessPremisesSection from './BusinessPremisesSection';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgressComponent from 'utils/CircularProgressComponent';



const StepOne = ({step, setStep}) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');

  const [taskIds, setTaskIds] = useState({
    businessIdentityTaskId: null,
    promoterSignatoryTaskId: null,
    businessPremisesTaskId: null
  });
    const [isLoading, setIsLoading] = useState(true);


  const fetchTaskIds = async () => {
        setIsLoading(true);

    const url = `/labourlicense/service-request-section-data?service_request_id=${service_id}&section=applicant_and_business_info`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0 && res.data?.task_data) {
      setTaskIds({
        businessIdentityTaskId: res.data.task_data["Business Identity Structure"]?.task_id || null,
        promoterSignatoryTaskId: res.data.task_data["Signatory Details"]?.task_id || null,
        businessPremisesTaskId: res.data.task_data["Business Location Proofs"]?.task_id || null
      });

      
    }
        setIsLoading(false);

  };

  useEffect(() => {
    fetchTaskIds();
  }, []);
   if (isLoading) {
    return <CircularProgressComponent isLoading={isLoading} displayContent={'Loading business sections...'} />;
  }

  return (
    <Box>
      <BusinessIdentityStructureSection taskId={taskIds.businessIdentityTaskId} />
      <PromoterSignatorySection taskId={taskIds.promoterSignatoryTaskId} />
      <BusinessPremisesSection taskId={taskIds.businessPremisesTaskId} />

      <Box display="flex" justifyContent="flex-end" mt={-4.5}>
      <Button variant="contained" size="small" color="primary" onClick={() => setStep(step + 1)} endIcon={<ArrowForwardIcon />}>
        Continue
      </Button>
    </Box>
    </Box>
    
  );
};

export default StepOne;
