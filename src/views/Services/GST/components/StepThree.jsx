import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Stepper, Step, StepLabel, StepContent, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

const StepThree = () => {
  const dispatch = useDispatch();
  const [verticalStep, setVerticalStep] = useState(0);
  const formik = useFormik({
    initialValues: {
      id: '',
      review_certificate: '',
      filing_status: '',
      approval_status: ''
    },
    validationSchema: Yup.object({
      review_certificate: Yup.string().required('Review status is required'),
      filing_status: Yup.string().required('Filing status is required'),
      approval_status: Yup.string().required('Approval status is required')
    }),
    onSubmit: async (values) => {
      let url = values.id ? `/gst/gst-review-filing-certificate/${values.id}/` : `/gst/gst-review-filing-certificate/`;
      let formData = new FormData();
      formData.append('service_request', 32);
      formData.append('service_task', 10);
      formData.append('review_certificate', values.review_certificate);
      formData.append('filing_status', values.filing_status);
      formData.append('approval_status', values.approval_status);

      const { res } = await Factory(values.id ? 'put' : 'post', url, formData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: values.id ? 'Review, Filing & Certificate updated successfully' : 'Review, Filing & Certificate saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getReviewFiling();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Review, Filing & Certificate not saved',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });
  const getReviewFiling = async () => {
    const url = `/gst/gst-review-filing-certificate/by-service-request/?service_request_id=32`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      formik.setValues(res.data);
    }
  };
  useEffect(() => {
    getReviewFiling();
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
      <form autoComplete="off">
        <Typography variant="h4" mb={3}>
          Review, Filing & Certificate
        </Typography>
        <Stepper orientation="vertical" activeStep={verticalStep} sx={{ background: 'transparent' }}>
          {/* Step 1: Review */}
          <Step>
            <StepLabel>Review</StepLabel>
            <StepContent>
              <TextField
                select
                fullWidth
                size="small"
                label="Review"
                name="review_certificate"
                value={formik.values.review_certificate || ''}
                onChange={formik.handleChange}
                sx={{ mr: 2, mb: 2 }}
              >
                <MenuItem value="in_progress">In progress</MenuItem>
                <MenuItem value="re_submission">Re-submission</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </TextField>
              <Button variant="contained" size="small" color="primary" onClick={() => setVerticalStep(1)} sx={{ mt: 1 }}>
                Next
              </Button>
            </StepContent>
          </Step>
          {/* Step 2: Filing */}
          <Step>
            <StepLabel>Filing</StepLabel>
            <StepContent>
              <TextField
                select
                fullWidth
                size="small"
                label="Filing"
                name="filing_status"
                value={formik.values.filing_status || ''}
                onChange={formik.handleChange}
                sx={{ mr: 2, mb: 2 }}
              >
                <MenuItem value="in_progress">In progress</MenuItem>
                <MenuItem value="resubmission">Resubmission</MenuItem>
                <MenuItem value="filed">Filed</MenuItem>
              </TextField>
              <Button variant="contained" size="small" color="primary" onClick={() => setVerticalStep(2)} sx={{ mt: 1 }}>
                Next
              </Button>
            </StepContent>
          </Step>
          {/* Step 3: Approval */}
          <Step>
            <StepLabel>Approval</StepLabel>
            <StepContent>
              <TextField
                select
                fullWidth
                size="small"
                label="Approval"
                name="approval_status"
                value={formik.values.approval_status || ''}
                onChange={formik.handleChange}
                sx={{ mr: 2, mb: 2 }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="resubmission">Resubmission</MenuItem>
                <MenuItem value="reject">Reject</MenuItem>
                <MenuItem value="approval">Approval</MenuItem>
              </TextField>
              <Button variant="contained" size="small" color="primary" onClick={() => setVerticalStep(3)} sx={{ mt: 1 }}>
                Next
              </Button>
            </StepContent>
          </Step>
          {/* Step 4: Certificate */}
          <Step>
            <StepLabel>Certificate</StepLabel>
            <StepContent>
              <Button
                variant="contained"
                size="small"
                color="primary"
                disabled={formik.values.approval_status !== 'approval'}
                sx={{ mt: 2, mb: 2 }}
              >
                Download
              </Button>
            </StepContent>
          </Step>
        </Stepper>
      </form>
    </Box>
  );
};

export default StepThree;
