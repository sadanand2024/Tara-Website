import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import {Button} from '@mui/material';

import ApplicantDetails from './ApplicantDetails';
import BusinessIdentityStructureSection from './BusinessIdentityStructureSection';
import PromoterSignatorySection from './PromoterSignatorySection';
import BusinessPremisesSection from './BusinessPremisesSection';

const StepOne = ({step, setStep}) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');

  const [taskIds, setTaskIds] = useState({
    applicantDetailsTaskId: null,
    businessIdentityTaskId: null,
    promoterSignatoryTaskId: null,
    businessPremisesTaskId: null
  });

  const [loading, setLoading] = useState(true);

  const fetchTaskIds = async () => {
    const url = `/tradelicense/service-request-section-data?service_request_id=${service_id}&section=applicant_and_business_info`;
    const { res } = await Factory('get', url);

    if (res.status_cd === 0 && res.data?.tasks) {
      const taskData = res.data.tasks;
  

      setTaskIds({
        applicantDetailsTaskId:res.data.tasks['Applicant Details']?.task_id || null,
        businessIdentityTaskId: res.data.tasks['Business Identity']?.task_id || null,
        promoterSignatoryTaskId: res.data.tasks['Signatory Details']?.task_id || null,
        businessPremisesTaskId:res.data.tasks['Business Location']?.task_id || null
      });
       
     
    }

    setLoading(false);
  };

  // useEffect(() => {
  //   if (service_id) {
  //     fetchTaskIds();
  //   }
  // }, [service_id]);
    useEffect(() => {
      fetchTaskIds();
    }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
<BusinessIdentityStructureSection 
  taskId={taskIds.businessIdentityTaskId} 
  applicantTaskId={taskIds.applicantDetailsTaskId} 
/>      {/* <ApplicantDetails taskId={taskIds.applicantDetailsTaskId} /> */}
      {/* <BusinessIdentityStructureSection taskId={taskIds.businessIdentityTaskId} /> */}
      <PromoterSignatorySection taskId={taskIds.promoterSignatoryTaskId} />
      <BusinessPremisesSection taskId={taskIds.businessPremisesTaskId} />
        <Box display="flex" justifyContent="flex-end" mt={3}>
      <Button variant="contained" color="primary" onClick={() => setStep(step + 1)}>
        Continue
      </Button>
    </Box>
    </Box>
  );
};

export default StepOne;
