import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid2,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Avatar,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MenuItem,
  Checkbox
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import IconSave from '@mui/icons-material/Save';
import IconArrowForward from '@mui/icons-material/ArrowForward';
const steps = [
  { label: 'Enterprise Profile', width: 180 },
  { label: 'Financial + Location Details', width: 220 },
  { label: 'Review, Filing & Certificate', width: 220 }
];

const MSMEDashboard = () => {
  const [step, setStep] = React.useState(0);
  // Additional state for new fields
  const [orgType, setOrgType] = React.useState('');
  const [businessName, setBusinessName] = React.useState('Test');
  const [pan, setPan] = React.useState('');
  const [coi, setCoi] = React.useState('');
  const [aadhaar, setAadhaar] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [uamRegistered, setUamRegistered] = React.useState('yes');
  const [uam, setUam] = React.useState('7-1');
  const [businessCommenced, setBusinessCommenced] = React.useState('yes');
  const [commencementDate, setCommencementDate] = React.useState('8-1');
  const [plantNotApplicable, setPlantNotApplicable] = React.useState(false);

  // Step 3: Review, Filing & Certificate state
  const [reviewStatus, setReviewStatus] = React.useState('in_progress');
  const [reviewComment, setReviewComment] = React.useState('');
  const [filingStatus, setFilingStatus] = React.useState('in_progress');
  const [certificateUploaded, setCertificateUploaded] = React.useState(false);
  // Local state for vertical stepper
  const [verticalStep, setVerticalStep] = React.useState(0);

  // Pass activeStep to stepper
  const activeStep = step;

  // Logic for enabling/disabling
  const reviewDone = reviewStatus === 'done';
  const reviewRequisition = reviewStatus === 'requisition';
  const filingDone = filingStatus === 'done';

  // Allow navigation to steps <= current step + 1
  const handleStepClick = (targetStep) => {
    if (targetStep <= step + 1) setStep(targetStep);
  };

  // Handlers for vertical stepper progression
  const handleProceedToFile = () => {
    setFilingStatus('in_progress');
    setVerticalStep(1);
  };
  const handleUploadCertificate = () => {
    setCertificateUploaded(true);
    setVerticalStep(2);
  };

  // In the MSMEDashboard component, add state for the checkbox

  return (
    <Box sx={{ bgcolor: '#fafbfc', minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Typography variant="h3" mb={1}>
        MSME Registration
      </Typography>
      <Typography variant="caption" color="text.secondary">
        MSME Registration is a process that allows small and medium enterprises (SMEs) to register their business with the Ministry of
        Micro, Small and Medium Enterprises.
      </Typography>
      <Box maxWidth="1100px" mx="auto" sx={{ mt: 2 }}>
        {/* Custom Stepper */}
        <CustomStepper activeStep={activeStep} onStepClick={handleStepClick} />

        {/* Step 1: Enterprise Profile + Business Classification Inputs */}
        {step === 0 && (
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700 }}>
            {/* Task 1: Business Identity */}
            <Typography variant="h4" mb={2}>
              Business Identity
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, fontSize: 15 }}>
              Please provide all info as per your government identity documents (PAN, Aadhaar etc.)
            </Typography>
            <Grid2 container spacing={2} mb={4}>
              {/* 1. Organisation type */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Organisation type *</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <TextField fullWidth size="small" value={orgType} onChange={(e) => setOrgType(e.target.value)} />
              </Grid2>
              {/* 2. Business Name */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Business Name</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <TextField fullWidth size="small" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </Grid2>
              {/* 3. PAN of Business & COI */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">PAN of Business & C.O.I *</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <Button size="small" variant="outlined" color="primary">
                  Upload
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  COI → Certificate of Incorporation
                </Typography>
              </Grid2>
              {/* 4. Aadhaar of authorized signatory */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Aadhaar of authorized signatory *</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <Button size="small" variant="outlined" color="primary" sx={{ height: 40 }}>
                  Upload
                </Button>
              </Grid2>
              {/* 5. Mobile Number */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Mobile Number</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <TextField fullWidth size="small" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </Grid2>
              {/* 6. Email ID */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Email ID</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <TextField fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Grid2>
              {/* 7. UAM Registered */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Are you previously registered under Udyog Aadhaar? (UAM)</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RadioGroup row value={uamRegistered} onChange={(e) => setUamRegistered(e.target.value)}>
                    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                  </RadioGroup>
                  <TextField size="small" value={uam} onChange={(e) => setUam(e.target.value)} label="Enter UAM" sx={{ width: 120 }} />
                </Stack>
              </Grid2>
              {/* 8. Business Commenced */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Has Business Commenced?</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RadioGroup row value={businessCommenced} onChange={(e) => setBusinessCommenced(e.target.value)}>
                    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                  </RadioGroup>
                  <TextField
                    size="small"
                    value={commencementDate}
                    onChange={(e) => setCommencementDate(e.target.value)}
                    label="Date of Commencement"
                    sx={{ width: 180 }}
                  />
                </Stack>
              </Grid2>
            </Grid2>

            {/* Task 2: Business Classification Inputs */}
            <Typography variant="h4" mb={2} mt={4}>
              Business Classification Inputs
            </Typography>
            <Grid2 container spacing={2}>
              {/* 1. Major Activity */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Major Activity</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <RadioGroup row>
                  <FormControlLabel value="manufacturing" control={<Radio color="primary" />} label="Manufacturing" />
                  <FormControlLabel value="service" control={<Radio color="primary" />} label="Service" />
                </RadioGroup>
              </Grid2>
              {/* 2. Nature of Business */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Nature of Business</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <TextField fullWidth size="small" />
              </Grid2>
              {/* 3. NIC Codes */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">NIC Codes</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <Stack direction="row" spacing={2}>
                  <TextField select label="NIC 2 Digit Code" size="small" sx={{ minWidth: 120 }} SelectProps={{ native: true }}>
                    <option value=""> </option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    {/* Add more options as needed */}
                  </TextField>
                  <TextField select label="NIC 4 Digit Code" size="small" sx={{ minWidth: 140 }} SelectProps={{ native: true }}>
                    <option value=""> </option>
                    <option value="1001">1001</option>
                    <option value="1002">1002</option>
                    {/* Add more options as needed */}
                  </TextField>
                  <TextField select label="NIC 5 Digit Code" size="small" sx={{ minWidth: 140 }} SelectProps={{ native: true }}>
                    <option value=""> </option>
                    <option value="10011">10011</option>
                    <option value="10012">10012</option>
                    {/* Add more options as needed */}
                  </TextField>
                </Stack>
              </Grid2>
              {/* 4. Number of persons employed */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                <Typography varient="subtitle1">Number of persons employed</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                <Stack direction="row" spacing={2}>
                  <TextField size="small" label="Male" sx={{ width: 80 }} />
                  <TextField size="small" label="Female" sx={{ width: 80 }} />
                  <TextField size="small" label="Others" sx={{ width: 80 }} />
                  <TextField size="small" label="Total" sx={{ width: 80 }} />
                </Stack>
              </Grid2>
            </Grid2>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Button size="medium" variant="contained" startIcon={<IconSave />} color="primary" onClick={() => setStep(1)}>
                Save & Proceed
              </Button>
              <Button size="medium" variant="contained" color="primary" onClick={() => setStep(1)} endIcon={<IconArrowForward />}>
                Continue
              </Button>
            </Box>
          </Paper>
        )}

        {/* Step 2: Financial + Location Details */}
        {step === 1 && (
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700, mt: 5 }}>
            <FinancialLocationDetails plantNotApplicable={plantNotApplicable} setPlantNotApplicable={setPlantNotApplicable} />
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button size="medium" variant="contained" startIcon={<IconSave />} color="primary" onClick={() => setStep(2)}>
                Save & Continue
              </Button>
            </Box>
          </Paper>
        )}

        {/* Step 3: Review, Filing & Certificate */}
        {step === 2 && (
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 500 }}>
            <Typography variant="h4" mb={3}>
              Review, Filing & Certificate
            </Typography>
            <Stepper orientation="vertical" activeStep={verticalStep}>
              {/* Step 1: Review */}
              <Step>
                <StepLabel>Review</StepLabel>
                <StepContent>
                  <TextField
                    select
                    label="Status"
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    size="small"
                    sx={{ minWidth: 180, mb: 2 }}
                  >
                    <MenuItem value="in_progress">In progress</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                    <MenuItem value="requisition">Requisition</MenuItem>
                  </TextField>
                  {reviewRequisition && (
                    <TextField
                      label="Comment"
                      multiline
                      minRows={2}
                      fullWidth
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  )}
                  <Button size="medium" variant="contained" color="primary" disabled={!reviewDone} onClick={handleProceedToFile}>
                    Proceed to File
                  </Button>
                </StepContent>
              </Step>
              {/* Step 2: Filing */}
              <Step>
                <StepLabel>Filing</StepLabel>
                <StepContent>
                  <TextField
                    select
                    label="Status"
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    size="small"
                    sx={{ minWidth: 180, mb: 2 }}
                    disabled={verticalStep < 1}
                  >
                    <MenuItem value="in_progress">In progress</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </TextField>
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={!filingDone || verticalStep < 1}
                    onClick={handleUploadCertificate}
                  >
                    Upload Certificate
                  </Button>
                </StepContent>
              </Step>
              {/* Step 3: Certificate */}
              <Step>
                <StepLabel>Certificate</StepLabel>
                <StepContent>
                  <Button size="medium" variant="contained" color="primary" disabled={!certificateUploaded || verticalStep < 2}>
                    Download
                  </Button>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

// Update CustomStepper to accept onStepClick
const CustomStepper = ({ activeStep, onStepClick }) => (
  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 4 }}>
    {steps.map((stepObj, idx) => (
      <React.Fragment key={stepObj.label}>
        <Box
          sx={{
            width: stepObj.width,
            px: 1,
            py: 1.2,
            bgcolor: idx === activeStep ? 'primary.main' : '#fff',
            color: idx === activeStep ? '#fff' : 'text.secondary',
            border: idx === activeStep ? 'none' : '1.5px solid #697586',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 14,
            textAlign: 'center',
            transition: 'all 0.2s',
            display: 'inline-block',
            lineHeight: 1.5,
            cursor: 'pointer'
          }}
          onClick={() => onStepClick(idx)}
        >
          {stepObj.label}
        </Box>
        {idx < steps.length - 1 && (
          <Box
            sx={{
              flex: 1,
              height: 2,
              bgcolor: '#e0e3e8',
              mx: 2,
              minWidth: 24
            }}
          />
        )}
      </React.Fragment>
    ))}
  </Box>
);

// Step 2: Financial + Location Details
const FinancialLocationDetails = ({ plantNotApplicable, setPlantNotApplicable }) => {
  // State for radio, checkbox, and file uploads can be added as needed
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700, mt: 5 }}>
      {/* Task 3: Turnover & Investment Declaration */}
      <Typography variant="h4" mb={2}>
        Turnover & Investment Declaration
      </Typography>
      <Grid2 container spacing={2} mb={4}>
        {/* Turnover in INR */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <Typography varient="subtitle1">Turnover in INR</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <Stack direction="row" spacing={2}>
            <TextField size="small" label="Total Annual Turnover" sx={{ minWidth: 160 }} />
            <TextField size="small" label="Export Turnover" sx={{ minWidth: 160 }} />
            <TextField size="small" label="Net Domestic Turnover" sx={{ minWidth: 180 }} />
          </Stack>
        </Grid2>
        {/* Investment in Plant & Machinery */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <Typography varient="subtitle1">Investment in Plant & Machinery</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <TextField fullWidth size="small" />
        </Grid2>
        {/* ITR for previous year */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <Typography varient="subtitle1">Have you filed ITR for previous year?</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <RadioGroup row>
            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
          </RadioGroup>
        </Grid2>
        {/* Registered under GST */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <Typography varient="subtitle1">Are you registered under GST?</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <RadioGroup row>
            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
            <FormControlLabel value="exempted" control={<Radio color="primary" />} label="Exempted" />
          </RadioGroup>
          <Button size="medium" variant="outlined" color="primary">
            Upload GST Certificate
          </Button>
        </Grid2>
      </Grid2>

      {/* Task 4: Registered Address & Units */}
      <Typography variant="h4" mb={2}>
        Registered Address & Units
      </Typography>
      <Grid2 container spacing={2} mb={4}>
        {/* Official address of enterprise */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <Typography varient="subtitle1">Official address of enterprise</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Flat/Door/Block No" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Name of Premise/Building" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Road/Street/Lane" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Village/Town" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="City" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="District" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="State" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Pin Code" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Latitude" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Longitude" />
            </Grid2>
          </Grid2>
        </Grid2>
        {/* Bank statement/Cancelled Cheque */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <Typography varient="subtitle1">Bank statement/Cancelled Cheque</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <Button size="medium" variant="outlined" color="primary">
            Upload
          </Button>
        </Grid2>
        {/* Official address proof */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <Typography varient="subtitle1">Official address proof (Rental agreement/Utility bill)</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <Button size="medium" variant="outlined" color="primary">
            Upload
          </Button>
        </Grid2>
      </Grid2>

      {/* Location of Plant/Unit */}
      <Typography variant="h5" mb={2}>
        Location of Plant/Unit
      </Typography>
      <Grid2 container spacing={2} mb={2}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
          <FormControlLabel
            control={<Checkbox size="small" checked={plantNotApplicable} onChange={(e) => setPlantNotApplicable(e.target.checked)} />}
            label="Location of plant/unit Not Applicable"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}></Grid2>
        {/* Plant/Unit address fields, all disabled if plantNotApplicable is true */}
        <Grid2 size={{ xs: 12, sm: 12 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Unit Name" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Flat/Door/Block No" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Name of Premise/Building" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Village/Town" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Road/Street/Lane" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="City" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="District" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="State" disabled={plantNotApplicable} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" label="Pin Code" disabled={plantNotApplicable} />
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}></Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <Button size="medium" variant="outlined" color="primary" disabled={plantNotApplicable}>
            Add Plant/Unit
          </Button>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

export default MSMEDashboard;
