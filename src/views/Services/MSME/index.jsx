import React, { useState } from 'react';
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
  Checkbox,
  Autocomplete,
  Card
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import IconSave from '@mui/icons-material/Save';
import IconArrowForward from '@mui/icons-material/ArrowForward';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
  const [nic2, setNic2] = React.useState('');
  const [nic4, setNic4] = React.useState('');
  const [nic5, setNic5] = React.useState('');

  return (
    <Card sx={{ minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Typography variant="h3">MSME Registration</Typography>
      <Typography variant="caption" color="text.secondary">
        MSME Registration is a process that allows small and medium enterprises (SMEs) to register their business with the Ministry of
        Micro, Small and Medium Enterprises.
      </Typography>
      <Box maxWidth="1100px" mx="auto" sx={{ mt: 2 }}>
        {/* Custom Stepper */}
        <Paper elevation={0} sx={{ bgcolor: '#eef2f6', p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700 }}>
          <CustomStepper activeStep={activeStep} onStepClick={handleStepClick} />

          {/* Step 1: Enterprise Profile + Business Classification Inputs */}
          {step === 0 && (
            <>
              {/* Task 1: Business Identity */}
              <Typography variant="h4" mb={2}>
                Business Identity
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, fontSize: 15 }}>
                Please provide all info as per your government identity documents (PAN, Aadhaar etc.)
              </Typography>
              <Grid2 container spacing={2} mb={4}>
                {/* 1. Organisation type */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Organisation type *</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth size="small" value={orgType} onChange={(e) => setOrgType(e.target.value)} />
                </Grid2>
                {/* 2. Business Name */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Business Name</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth size="small" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </Grid2>
                {/* 3. PAN of Business & COI */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">PAN of Business & C.O.I *</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label=""
                    value={coi ? coi.name || coi : ''}
                    placeholder="Upload"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById('coiInput').click()}
                  />
                  <input id="coiInput" type="file" hidden onChange={(e) => setCoi(e.target.files[0])} />
                </Grid2>
                {/* 4. Aadhaar of authorized signatory */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Aadhaar of authorized signatory *</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label=""
                    value={aadhaar ? aadhaar.name || aadhaar : ''}
                    placeholder="Upload"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById('aadhaarInput').click()}
                  />
                  <input id="aadhaarInput" type="file" hidden onChange={(e) => setAadhaar(e.target.files[0])} />
                </Grid2>
                {/* 5. Mobile Number */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Mobile Number</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth size="small" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </Grid2>
                {/* 6. Email ID */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Email ID</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Grid2>
                {/* 7. UAM Registered */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Are you previously registered under Udyog Aadhaar? (UAM)</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <RadioGroup row value={uamRegistered} sx={{ width: '40%' }} onChange={(e) => setUamRegistered(e.target.value)}>
                      <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                    </RadioGroup>
                    {uamRegistered === 'yes' && (
                      <TextField size="small" fullWidth value={uam} onChange={(e) => setUam(e.target.value)} label="Enter UAM" />
                    )}
                  </Stack>
                </Grid2>
                {/* 8. Business Commenced */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Has Business Commenced?</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <RadioGroup row value={businessCommenced} sx={{ width: '40%' }} onChange={(e) => setBusinessCommenced(e.target.value)}>
                      <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                    </RadioGroup>
                    {businessCommenced === 'yes' && (
                      <TextField
                        size="small"
                        fullWidth
                        value={commencementDate}
                        onChange={(e) => setCommencementDate(e.target.value)}
                        label="Date of Commencement"
                      />
                    )}
                  </Stack>
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                <Button
                  size="medium"
                  variant="contained"
                  startIcon={<IconSave />}
                  color="primary"
                  onClick={() => {
                    console.log('Business Identity Saved', {
                      orgType,
                      businessName,
                      pan,
                      coi,
                      aadhaar,
                      mobile,
                      email,
                      uamRegistered,
                      uam,
                      businessCommenced,
                      commencementDate
                    });
                  }}
                >
                  Save Business Identity
                </Button>
              </Box>

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
                    <Grid2 size={{ xs: 4 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={['01', '02']}
                        value={nic2}
                        onChange={(e, value) => setNic2(value || '')}
                        renderInput={(params) => <TextField {...params} label="NIC 2 Digit Code" />}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={['1001', '1002']}
                        value={nic4}
                        onChange={(e, value) => setNic4(value || '')}
                        renderInput={(params) => <TextField {...params} label="NIC 4 Digit Code" />}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={['10011', '10012']}
                        value={nic5}
                        onChange={(e, value) => setNic5(value || '')}
                        renderInput={(params) => <TextField {...params} label="NIC 5 Digit Code" />}
                      />
                    </Grid2>
                  </Stack>
                </Grid2>
                {/* 4. Number of persons employed */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Number of persons employed</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                  <Stack direction="row" spacing={2}>
                    <Grid2 size={{ xs: 3 }}>
                      <TextField size="small" label="Male" fullWidth />
                    </Grid2>
                    <Grid2 size={{ xs: 3 }}>
                      <TextField size="small" label="Female" fullWidth />
                    </Grid2>
                    <Grid2 size={{ xs: 3 }}>
                      <TextField size="small" label="Others" fullWidth />
                    </Grid2>
                    <Grid2 size={{ xs: 3 }}>
                      <TextField size="small" label="Total" fullWidth />
                    </Grid2>
                  </Stack>
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                <Button
                  size="medium"
                  variant="contained"
                  startIcon={<IconSave />}
                  color="primary"
                  onClick={() => {
                    console.log('Business Classification Inputs Saved', {
                      // Add relevant state variables for this section
                      // Example:
                      // majorActivity, natureOfBusiness, nic2, nic4, nic5, personsEmployed, etc.
                      nic2,
                      nic4,
                      nic5
                    });
                  }}
                >
                  Save Business Classification
                </Button>

                <Button size="medium" variant="contained" color="primary" onClick={() => setStep(1)} endIcon={<IconArrowForward />}>
                  Continue
                </Button>
              </Box>
            </>
          )}

          {/* Step 2: Financial + Location Details */}
          {step === 1 && (
            <>
              <FinancialLocationDetails plantNotApplicable={plantNotApplicable} setPlantNotApplicable={setPlantNotApplicable} />
              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button size="medium" variant="contained" startIcon={<IconSave />} color="primary" onClick={() => setStep(2)}>
                  Save & Continue
                </Button>
              </Box>
            </>
          )}

          {/* Step 3: Review, Filing & Certificate */}
          {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
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
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      sx={{ ml: 2 }}
                      disabled={!reviewDone}
                      onClick={handleProceedToFile}
                    >
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
                      sx={{ ml: 2 }}
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
                    <Button
                      size="medium"
                      variant="contained"
                      sx={{ ml: 2 }}
                      color="primary"
                      disabled={!certificateUploaded || verticalStep < 2}
                    >
                      Download
                    </Button>
                  </StepContent>
                </Step>
              </Stepper>
            </Box>
          )}
        </Paper>
      </Box>
    </Card>
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

  // Formik for Turnover & Investment Declaration
  const turnoverFormik = useFormik({
    initialValues: {
      totalTurnover: '',
      exportTurnover: '',
      domesticTurnover: '',
      investment: '',
      itrFiled: '',
      gstStatus: '',
      gstCertificate: null
    },
    validationSchema: Yup.object({
      totalTurnover: Yup.string().required('Required'),
      exportTurnover: Yup.string().required('Required'),
      domesticTurnover: Yup.string().required('Required'),
      investment: Yup.string().required('Required'),
      itrFiled: Yup.string().required('Required'),
      gstStatus: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      console.log('Turnover & Investment Declaration Saved', values);
    }
  });

  // Formik for Registered Address & Units
  const addressFormik = useFormik({
    initialValues: {
      flat: '',
      building: '',
      street: '',
      village: '',
      city: '',
      district: '',
      state: '',
      pin: '',
      lat: '',
      lng: '',
      bankProof: null,
      addressProof: null
    },
    validationSchema: Yup.object({
      flat: Yup.string().required('Required'),
      building: Yup.string().required('Required'),
      street: Yup.string().required('Required'),
      village: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      district: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      pin: Yup.string().required('Required'),
      lat: Yup.string().required('Required'),
      lng: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      console.log('Registered Address & Units Saved', values);
    }
  });

  // Save handler for all plant units
  async function handleSavePlantUnits(e) {
    e.preventDefault();
    if (plantNotApplicable) {
      console.log('Location of Plant/Unit Not Applicable');
      return;
    }
    const valid = await validateAllUnits();
    if (valid) {
      console.log('Location of Plant/Unit Saved', plantUnits);
    } else {
      alert('Please fill all required fields for each plant/unit.');
    }
  }

  const [plantUnits, setPlantUnits] = React.useState([
    {
      unitName: '',
      flat: '',
      building: '',
      village: '',
      street: '',
      city: '',
      district: '',
      state: '',
      pin: ''
    }
  ]);

  // Validation schema for a single plant/unit
  const plantUnitSchema = Yup.object({
    unitName: Yup.string().required('Required'),
    flat: Yup.string().required('Required'),
    building: Yup.string().required('Required'),
    village: Yup.string().required('Required'),
    street: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    district: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    pin: Yup.string().required('Required')
  });

  // Validate all plant units
  const validateAllUnits = async () => {
    let isValid = true;
    for (let i = 0; i < plantUnits.length; i++) {
      try {
        await plantUnitSchema.validate(plantUnits[i], { abortEarly: false });
      } catch (err) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  return (
    <Box>
      {/* Task 3: Turnover & Investment Declaration */}
      <form onSubmit={turnoverFormik.handleSubmit} autoComplete="off">
        <Typography variant="h4" mb={2}>
          Turnover & Investment Declaration
        </Typography>
        <Grid2 container spacing={2} mb={2}>
          {/* Turnover in INR */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Turnover in INR</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                label="Total Annual Turnover"
                sx={{ minWidth: 160 }}
                name="totalTurnover"
                value={turnoverFormik.values.totalTurnover}
                onChange={turnoverFormik.handleChange}
                error={turnoverFormik.touched.totalTurnover && Boolean(turnoverFormik.errors.totalTurnover)}
                helperText={turnoverFormik.touched.totalTurnover && turnoverFormik.errors.totalTurnover}
              />
              <TextField
                size="small"
                label="Export Turnover"
                sx={{ minWidth: 160 }}
                name="exportTurnover"
                value={turnoverFormik.values.exportTurnover}
                onChange={turnoverFormik.handleChange}
                error={turnoverFormik.touched.exportTurnover && Boolean(turnoverFormik.errors.exportTurnover)}
                helperText={turnoverFormik.touched.exportTurnover && turnoverFormik.errors.exportTurnover}
              />
              <TextField
                size="small"
                label="Net Domestic Turnover"
                sx={{ minWidth: 180 }}
                name="domesticTurnover"
                value={turnoverFormik.values.domesticTurnover}
                onChange={turnoverFormik.handleChange}
                error={turnoverFormik.touched.domesticTurnover && Boolean(turnoverFormik.errors.domesticTurnover)}
                helperText={turnoverFormik.touched.domesticTurnover && turnoverFormik.errors.domesticTurnover}
              />
            </Stack>
          </Grid2>
          {/* Investment in Plant & Machinery */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Investment in Plant & Machinery</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <TextField
              fullWidth
              size="small"
              name="investment"
              value={turnoverFormik.values.investment}
              onChange={turnoverFormik.handleChange}
              error={turnoverFormik.touched.investment && Boolean(turnoverFormik.errors.investment)}
              helperText={turnoverFormik.touched.investment && turnoverFormik.errors.investment}
            />
          </Grid2>
          {/* ITR for previous year */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Have you filed ITR for previous year?</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <RadioGroup row name="itrFiled" value={turnoverFormik.values.itrFiled} onChange={turnoverFormik.handleChange}>
              <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
            </RadioGroup>
            {turnoverFormik.touched.itrFiled && turnoverFormik.errors.itrFiled && (
              <Typography color="error" variant="caption">
                {turnoverFormik.errors.itrFiled}
              </Typography>
            )}
          </Grid2>
          {/* Registered under GST */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Are you registered under GST?</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <RadioGroup row name="gstStatus" value={turnoverFormik.values.gstStatus} onChange={turnoverFormik.handleChange}>
              <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
              <FormControlLabel value="exempted" control={<Radio color="primary" />} label="Exempted" />
            </RadioGroup>
            {turnoverFormik.touched.gstStatus && turnoverFormik.errors.gstStatus && (
              <Typography color="error" variant="caption">
                {turnoverFormik.errors.gstStatus}
              </Typography>
            )}
            <Button size="medium" variant="outlined" color="primary" component="label">
              Upload GST Certificate
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    turnoverFormik.setFieldValue('gstCertificate', e.target.files[0]);
                  }
                }}
              />
            </Button>
            {turnoverFormik.values.gstCertificate && (
              <Button
                variant="outlined"
                size="medium"
                disabled
                sx={{ ml: 2, textTransform: 'none', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {turnoverFormik.values.gstCertificate.name.length > 20
                  ? turnoverFormik.values.gstCertificate.name.slice(0, 20) + '...'
                  : turnoverFormik.values.gstCertificate.name}
              </Button>
            )}
          </Grid2>
        </Grid2>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" size="medium" variant="contained" color="primary">
            Save Turnover & Investment
          </Button>
        </Box>
      </form>

      {/* Task 4: Registered Address & Units */}
      <form onSubmit={addressFormik.handleSubmit} autoComplete="off">
        <Typography variant="h4" mb={2} mt={4}>
          Registered Address & Units
        </Typography>
        <Grid2 container spacing={2} mb={2}>
          {/* Official address of enterprise */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Official address of enterprise</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Flat/Door/Block No"
                  name="flat"
                  value={addressFormik.values.flat}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.flat && Boolean(addressFormik.errors.flat)}
                  helperText={addressFormik.touched.flat && addressFormik.errors.flat}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name of Premise/Building"
                  name="building"
                  value={addressFormik.values.building}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.building && Boolean(addressFormik.errors.building)}
                  helperText={addressFormik.touched.building && addressFormik.errors.building}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Road/Street/Lane"
                  name="street"
                  value={addressFormik.values.street}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.street && Boolean(addressFormik.errors.street)}
                  helperText={addressFormik.touched.street && addressFormik.errors.street}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Village/Town"
                  name="village"
                  value={addressFormik.values.village}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.village && Boolean(addressFormik.errors.village)}
                  helperText={addressFormik.touched.village && addressFormik.errors.village}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="City"
                  name="city"
                  value={addressFormik.values.city}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.city && Boolean(addressFormik.errors.city)}
                  helperText={addressFormik.touched.city && addressFormik.errors.city}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="District"
                  name="district"
                  value={addressFormik.values.district}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.district && Boolean(addressFormik.errors.district)}
                  helperText={addressFormik.touched.district && addressFormik.errors.district}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="State"
                  name="state"
                  value={addressFormik.values.state}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.state && Boolean(addressFormik.errors.state)}
                  helperText={addressFormik.touched.state && addressFormik.errors.state}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Pin Code"
                  name="pin"
                  value={addressFormik.values.pin}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.pin && Boolean(addressFormik.errors.pin)}
                  helperText={addressFormik.touched.pin && addressFormik.errors.pin}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Latitude"
                  name="lat"
                  value={addressFormik.values.lat}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.lat && Boolean(addressFormik.errors.lat)}
                  helperText={addressFormik.touched.lat && addressFormik.errors.lat}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Longitude"
                  name="lng"
                  value={addressFormik.values.lng}
                  onChange={addressFormik.handleChange}
                  error={addressFormik.touched.lng && Boolean(addressFormik.errors.lng)}
                  helperText={addressFormik.touched.lng && addressFormik.errors.lng}
                />
              </Grid2>
            </Grid2>
          </Grid2>
          {/* Bank statement/Cancelled Cheque */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Bank statement/Cancelled Cheque</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <Button size="medium" variant="outlined" color="primary" component="label">
              Upload
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    addressFormik.setFieldValue('bankProof', e.target.files[0]);
                  }
                }}
              />
            </Button>
            {addressFormik.values.bankProof && (
              <Button
                variant="outlined"
                size="medium"
                disabled
                sx={{ ml: 2, textTransform: 'none', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {addressFormik.values.bankProof.name.length > 20
                  ? addressFormik.values.bankProof.name.slice(0, 20) + '...'
                  : addressFormik.values.bankProof.name}
              </Button>
            )}
          </Grid2>
          {/* Official address proof */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Official address proof (Rental agreement/Utility bill)</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <Button size="medium" variant="outlined" color="primary" component="label">
              Upload
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    addressFormik.setFieldValue('addressProof', e.target.files[0]);
                  }
                }}
              />
            </Button>
            {addressFormik.values.addressProof && (
              <Button
                variant="outlined"
                size="medium"
                disabled
                sx={{ ml: 2, textTransform: 'none', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {addressFormik.values.addressProof.name.length > 20
                  ? addressFormik.values.addressProof.name.slice(0, 20) + '...'
                  : addressFormik.values.addressProof.name}
              </Button>
            )}
          </Grid2>
        </Grid2>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" size="medium" variant="contained" color="primary">
            Save Registered Address
          </Button>
        </Box>
      </form>

      {/* Location of Plant/Unit */}
      <form onSubmit={handleSavePlantUnits} autoComplete="off">
        <Typography variant="h5" mb={2} mt={4}>
          Location of Plant/Unit
        </Typography>
        <Grid2 container spacing={2} mb={2}>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={plantNotApplicable}
                  onChange={(e) => {
                    setPlantNotApplicable(e.target.checked);
                  }}
                />
              }
              label="Location of plant/unit Not Applicable"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}></Grid2>
        </Grid2>
        {!plantNotApplicable && plantUnits.map((unit, idx) => (
          <Box key={idx} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2, bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle1" mb={2}>Plant/Unit {idx + 1}</Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Unit Name"
                  name="unitName"
                  value={unit.unitName}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].unitName = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Flat/Door/Block No"
                  name="flat"
                  value={unit.flat}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].flat = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name of Premise/Building"
                  name="building"
                  value={unit.building}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].building = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Village/Town"
                  name="village"
                  value={unit.village}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].village = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Road/Street/Lane"
                  name="street"
                  value={unit.street}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].street = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="City"
                  name="city"
                  value={unit.city}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].city = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="District"
                  name="district"
                  value={unit.district}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].district = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="State"
                  name="state"
                  value={unit.state}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].state = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Pin Code"
                  name="pin"
                  value={unit.pin}
                  onChange={e => {
                    const newUnits = [...plantUnits];
                    newUnits[idx].pin = e.target.value;
                    setPlantUnits(newUnits);
                  }}
                />
              </Grid2>
            </Grid2>
          </Box>
        ))}
        {!plantNotApplicable && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              size="medium"
              variant="outlined"
              color="primary"
              onClick={() => setPlantUnits([...plantUnits, {
                unitName: '',
                flat: '',
                building: '',
                village: '',
                street: '',
                city: '',
                district: '',
                state: '',
                pin: ''
              }])}
            >
              Add Plant/Unit
            </Button>
          </Box>
        )}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" size="medium" variant="contained" color="primary">
            Save Plant/Unit Location
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MSMEDashboard;
