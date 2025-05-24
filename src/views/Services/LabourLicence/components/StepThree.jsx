import React from 'react';
import { Box, Typography, TextField, Button, Stepper, Step, StepLabel, StepContent, MenuItem } from '@mui/material';

const StepThree = ({ formik, verticalStep, setVerticalStep }) => {
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
                name="reviewStatus"
                value={formik.values.reviewStatus || ''}
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
                name="filingStatus"
                value={formik.values.filingStatus || ''}
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
                name="approvalStatus"
                value={formik.values.approvalStatus || ''}
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
                disabled={formik.values.approvalStatus !== 'approval'}
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
