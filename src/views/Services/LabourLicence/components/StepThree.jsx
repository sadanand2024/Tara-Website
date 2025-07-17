import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, CircularProgress, Stack, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import GetActionButtons from '../../FormHelpers';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StepThree = ({step, setStep}) => {
  const [searchParams] = useSearchParams();
  const [reviewAndFiling, setReviewAndFiling] = useState({
    task_id: null,
    draft_filing_certificate: null
  });
  const service_id = searchParams.get('service_id');
  const [reviewStep, setReviewStep] = useState(0);
  const [loadingStep4, setLoadingStep4] = useState(false);

  const reviewSteps = ['Draft TradeLicence', 'Upload Filed Acknowledgement', 'Download Filed Acknowledgement'];

  const viewFile = async (url) => {
    const response = await Factory('get', `/docwallet/generate_presigned_url?url=${url}`, {}, {});
    if (response.res.status_cd === 0) {
      let url = response.res.data.url;
      window.open(url, '_blank');
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchReviewAndFilingData = async () => {
      try {
        setLoadingStep4(true);
        const res = await Factory(
          'get',
          `/labourlicense/service-request-section-data?service_request_id=${service_id}&section=review`,
        );

        if (res?.res?.status_cd === 0) {
          const taskData = res?.res?.data?.task_data;
          const reviewSection = taskData?.['Review Filing Certificate'];

          setReviewAndFiling({
            ...reviewSection,
            task_id: reviewSection?.task_id || null,
            data: reviewSection?.data || {}
          });
        
        } else {
          enqueueSnackbar('Failed to fetch Review & Filing Certificate data.', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' }
          });
        }
      } catch (error) {
        enqueueSnackbar('Something went wrong while fetching the data.', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } finally {
        setLoadingStep4(false);
      }
    };

    fetchReviewAndFilingData();
  }, [service_id, setReviewAndFiling]);

  return (
    <Box>
      {loadingStep4 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh" bgcolor="white">
          <CircularProgress />
        </Box>
      ) : (
        <Stepper activeStep={reviewStep} orientation="vertical" sx={{ mb: 4 }}>
          {reviewSteps.map((label, idx) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {/* Step 1: Draft GST Computation */}
                {idx === 0 && (
                  <Box
                    sx={{
                      p: 4,
                      pr: 10,
                      boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)',
                      bgcolor: 'white',
                      width: 'fit-content',
                      borderRadius: 2,
                      mb: 1
                    }}
                  >
                    <Typography variant="subtitle1" mb={3} sx={{ textDecoration: 'underline' }}>
                      Draft LabourLicence 
                    </Typography>
                    <Stack direction="row" spacing={2} mb={3}>
                      <Button variant="contained" size="small" onClick={() => document.getElementById('draftGstComputationInput').click()}>
                        <input
                          id="draftGstComputationInput"
                          type="file"
                          hidden
                          onChange={async (e) => {
                            setReviewAndFiling((prev) => ({
                              ...prev,
                              task_id: reviewAndFiling?.task_id || null,
                              data: {
                                ...prev.data,
                                draft_filing_certificate: e.target.files[0] || null
                              }
                            }));
                        
                            const task_id = reviewAndFiling.task_id;

                            let type = reviewAndFiling?.data?.id ? 'put' : 'post';
                            let urlEndpoint = reviewAndFiling?.data?.id
                              ? `/labourlicense/review-filing/${reviewAndFiling?.data?.id}/`
                              : '/labourlicense/review-filing/';

                            const formData = new FormData();
                            formData.append('service_request', service_id);
                            formData.append('service_task', task_id);
                            formData.append('draft_filing_certificate', e.target.files[0]);
                            formData.append('approval_status', 'pending');
                            formData.append('filing_status', 'in progress');
                            formData.append('status', 'in progress');

                            const res = await Factory(type, urlEndpoint, formData, {});
                            if (res?.res?.status_cd === 0) {
                              
                              enqueueSnackbar('Draft labourLicence computation saved successfully!', {
                                variant: 'success',
                                anchorOrigin: { vertical: 'top', horizontal: 'right' }
                              });
                            } else {
                              enqueueSnackbar('Error saving draft Labour computation.', {
                                variant: 'error',
                                anchorOrigin: { vertical: 'top', horizontal: 'right' }
                              });
                            }
                          }}
                        />
                        Upload
                      </Button>
                    
                      {reviewAndFiling?.data?.draft_filing_certificate && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            if (reviewAndFiling?.data?.draft_filing_certificate instanceof File) {
                              window.open(URL.createObjectURL(reviewAndFiling?.data?.draft_filing_certificate), '_blank');
                            } else if (typeof reviewAndFiling?.data?.draft_filing_certificate === 'string') {
                              viewFile(reviewAndFiling?.data?.draft_filing_certificate);
                            }
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Stack>
                  
                    <Box display="flex" justifyContent="flex-start" gap={1}>
                      <GetActionButtons
                        type="put"
                        urlEndpoint="review-filing"
                        recId={reviewAndFiling?.data?.id}
                        status={reviewAndFiling?.data?.approval_status}
                        data={reviewAndFiling}
                        service_request={service_id}
                        task_id={reviewAndFiling.task_id}
                        urlKey="labourlicense"
                        urlBool={true}
                        filingHelper={true}
                        step={reviewStep}
                        setReviewStep={setReviewStep}
                      />
                    </Box>
                  </Box>
                )}

                {/* Step 2: Upload Filed Acknowledgement */}
                {idx === 1 && (
                  <Box
                    sx={{
                      p: 4,
                      pr: 10,
                      boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)',
                      bgcolor: 'white',
                      width: 'fit-content',
                      borderRadius: 2,
                      mb: 1
                    }}
                  >
                    <Typography variant="subtitle1" mb={3} sx={{ textDecoration: 'underline' }}>
                      Upload Filed Acknowledgement
                    </Typography>
                    <Stack direction="row" spacing={2} mb={3}>
                      <Button variant="contained" size="small" onClick={() => document.getElementById('filedAcknowledgementInput').click()}>
                        <input
                          id="filedAcknowledgementInput"
                          type="file"
                          hidden
                          onChange={async (e) => {
                            setReviewAndFiling((prev) => ({
                              ...prev,
                              task_id: reviewAndFiling?.task_id || null,
                              data: {
                                ...prev.data,
                                review_certificate: e.target.files[0] || null
                              }
                            }));
                            let type = reviewAndFiling?.data?.id ? 'put' : 'post';
                            let urlEndpoint = reviewAndFiling?.data?.id
                              ? `/labourlicense/review-filing/${reviewAndFiling?.data?.id}/`
                              : '/labourlicense/review-filing/';

                            const formData = new FormData();
                            formData.append('service_request', service_id);
                            formData.append('service_task', reviewAndFiling.task_id);
                            formData.append('review_certificate', e.target.files[0]);
                            formData.append('filing_status', 'in progress');
                            formData.append('status', 'in progress');

                            const res = await Factory(type, urlEndpoint, formData, {});
                            if (res?.res?.status_cd === 0) {
                              setReviewAndFiling({ ...reviewAndFiling, data: { ...res.res.data } });
                              enqueueSnackbar('Filed acknowledgement saved successfully!', {
                                variant: 'success',
                                anchorOrigin: { vertical: 'top', horizontal: 'right' }
                              });
                            } else {
                              enqueueSnackbar('Error saving filed acknowledgement.', {
                                variant: 'error',
                                anchorOrigin: { vertical: 'top', horizontal: 'right' }
                              });
                            }
                          }}
                        />
                        Upload
                      </Button>
                      {reviewAndFiling?.data?.review_certificate && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            if (reviewAndFiling?.data?.review_certificate instanceof File) {
                              window.open(URL.createObjectURL(reviewAndFiling?.data?.review_certificate), '_blank');
                            } else if (typeof reviewAndFiling?.data?.review_certificate === 'string') {
                              viewFile(reviewAndFiling?.data?.review_certificate);
                            }
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Stack>
                    <Box display="flex" justifyContent="flex-start" gap={1}>
                      <GetActionButtons
                        type="put"
                        data={reviewAndFiling}
                        status={reviewAndFiling?.data?.filing_status}
                        urlEndpoint="review-filing"
                        recId={reviewAndFiling?.data?.id}
                        task_id={reviewAndFiling?.task_id}
                        service_request={service_id}
                        filingHelper={true}
                        setReviewStep={setReviewStep}
                        urlKey="labourlicense"
                        urlBool={true}
                        step={reviewStep}
                      />
                    </Box>
                  </Box>
                )}
                {idx === 2 && (
                  <Box
                    sx={{
                      p: 4,
                      pr: 8,
                      boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)',
                      bgcolor: 'white',
                      width: 'fit-content',
                      borderRadius: 2,
                      mb: 1
                    }}
                  >
                    <Stack direction="column" spacing={1}>
                      <Typography variant="subtitle1" mb={3} sx={{ textDecoration: 'underline' }}>
                        Download Filed Acknowledgement
                      </Typography>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          if (reviewAndFiling?.data?.review_certificate) {
                            viewFile(reviewAndFiling?.data?.review_certificate);
                          }
                        }}
                        startIcon={
                            <DownloadIcon sx={{ width: { xs: 24, md: 24 }, height: { xs: 24, md: 24 } }} />
                          }
                      >
                        Download
                        {/* <IconButton
                          size="small"
                          color="secondary"
                          sx={{ alignSelf: 'center', '&:hover': { backgroundColor: 'transparent' } }}
                        >
                        
                          <DownloadIcon sx={{ width: { xs: 24, md: 24 }, height: { xs: 24, md: 24 } }} />
                        </IconButton> */}
                      </Button>
                    </Stack>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      )}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="outlined" size="small" onClick={() => setStep(step - 1)} startIcon={<ArrowBackIcon />}> 
          Back
        </Button>
        {/* <Button variant="contained" color="primary"  onClick={() => setStep(step + 1)}>
          Continue
        </Button> */}
      </Box>
    </Box>
    
  );
};

export default StepThree;
