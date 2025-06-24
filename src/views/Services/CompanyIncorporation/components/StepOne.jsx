import React, { useEffect, useState } from 'react';
import { Box,Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ProposalCompanyDetails from './ProposalCompanyDetails';
import RegisteredOfficeAddressDetails from './RegisteredOfficeAddressDetails';
import AuthorisedPaidupShareCapital from './AuthorisedPaidupShareCapital';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StepOne = ({ step, setStep }) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');

  const [taskIds, setTaskIds] = useState({
    proposalCompanyTaskId: null,
    registeredOfficeTaskId: null,
    authorisedCapitalTaskId: null
  });

  const fetchTaskIds = async () => {
    if (!service_id) {
      return;
    }

    const url = `/companyincorporation/service-request-section-data?service_request_id=${service_id}&section=proposed_company_details`;
    
    try {
      const { res } = await Factory('get', url);
      if (res.status_cd === 0 && res.data?.task_data) {
        const data = res.data.task_data;
        setTaskIds({
          proposalCompanyTaskId: data["Proposed Company Details"]?.task_id || null,
          registeredOfficeTaskId: data["Registered Office Address"]?.task_id || null,
          authorisedCapitalTaskId: data["Authorized PaidUp Share Capital"]?.task_id || null
        });
      } else {
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchTaskIds();
  }, [service_id]);

  return (
    <Box>
      <ProposalCompanyDetails taskId={taskIds.proposalCompanyTaskId} />
      <RegisteredOfficeAddressDetails taskId={taskIds.registeredOfficeTaskId} />
      <AuthorisedPaidupShareCapital taskId={taskIds.authorisedCapitalTaskId} />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />}onClick={() => setStep(step + 1)}>
          Continue
        </Button>
    </Box>
    </Box>
  );
};

export default StepOne;
