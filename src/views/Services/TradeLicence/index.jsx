import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid2,
  Checkbox,
  Card,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Radio,
  Stack
} from '@mui/material';
import IconSave from '@mui/icons-material/Save';
import IconArrowForward from '@mui/icons-material/ArrowForward';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const steps = [
  { label: 'Applicant & Business Details', width: 200 },
  { label: 'Documents & Declaration', width: 200 },
  { label: 'Review, Filing & Certificate', width: 220 }
];

const typeOfBusinessOptions = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'pvtltd', label: 'Pvt Ltd' }
];
const natureOfBusinessOptions = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'service', label: 'Service' }
];

// Validation schema for the entire first step
const businessDetailsSchema = Yup.object({
  typeOfBusiness: Yup.string().required('Type of Business is required'),
  legalName: Yup.string().required('Legal name is required'),
  panFile: Yup.mixed().required('PAN file is required'),
  natureOfBusiness: Yup.string().required('Nature of Business is required'),
  mobile: Yup.string().required('Mobile Number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  businessName: Yup.string().required('Business Name is required'),
  legalUse: Yup.string().required('Legal Use of Business is required'),
  pan: Yup.string().required('PAN of Business is required'),
  numEmployees: Yup.string().required('Number of Employees is required'),
  flat: Yup.string().required('Flat/Door/Block No is required'),
  premise: Yup.string().required('Premise/Building is required'),
  road: Yup.string().required('Road/Street is required'),
  village: Yup.string().required('Village/Town is required'),
  city: Yup.string().required('City is required'),
  district: Yup.string().required('District is required'),
  state: Yup.string().required('State is required'),
  pin: Yup.string().required('Pin Code is required'),
  tradeDesc: Yup.string().required('Trade Description is required'),
  tradeType: Yup.string().required('Trade Type is required'),
  tradeZone: Yup.string().required('Trade Zone is required'),
  tradeSubType: Yup.string().required('Trade Sub Type is required'),
  bestCity: Yup.string().required('Best Achieved Business City is required'),
  promoters: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Name is required'),
      aadhaarFile: Yup.mixed().required('Aadhaar file is required'),
      panFile: Yup.mixed().required('PAN file is required'),
      photoFile: Yup.mixed().required('Photo is required'),
      mobile: Yup.string()
        .required('Mobile is required')
        .matches(/^\d{10}$/, 'Mobile must be 10 digits'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      sameAsAadhaar: Yup.boolean(),
      address: Yup.string().required('Address is required')
    })
  )
});

function BusinessIdentityStructureSection({ values, errors, touched, handleChange, setFieldValue, handleBlur }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        <span style={{ textDecoration: 'underline' }}>Business identity & structure</span>
      </Typography>
      <Grid2 container spacing={2} alignItems="center">
        {/* Row 1 */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Box display="flex" alignItems="center">
            <Typography>Type of Business</Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={typeOfBusinessOptions.map((opt) => opt.label)}
            value={values.typeOfBusiness}
            onChange={(e, value) => setFieldValue('typeOfBusiness', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                label="Type of Business"
                name="typeOfBusiness"
                error={touched.typeOfBusiness && Boolean(errors.typeOfBusiness)}
                helperText={touched.typeOfBusiness && errors.typeOfBusiness}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Box display="flex" alignItems="center">
            <Typography>Legal name of Business</Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            name="legalName"
            value={values.legalName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.legalName && Boolean(errors.legalName)}
            helperText={touched.legalName && errors.legalName}
          />
        </Grid2>
        {/* Row 2 */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Box display="flex" alignItems="center">
            <Typography>PAN of Business</Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            component="label"
            fullWidth
            error={touched.panFile && Boolean(errors.panFile)}
          >
            Upload
            <input
              type="file"
              hidden
              name="panFile"
              onChange={(e) => setFieldValue('panFile', e.currentTarget.files[0])}
              onBlur={handleBlur}
            />
          </Button>
          {touched.panFile && errors.panFile && (
            <Typography color="error" variant="caption">
              {errors.panFile}
            </Typography>
          )}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Box display="flex" alignItems="center">
            <Typography>Nature of Business</Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={natureOfBusinessOptions.map((opt) => opt.label)}
            value={values.natureOfBusiness}
            onChange={(e, value) => setFieldValue('natureOfBusiness', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                label="Nature of Business"
                name="natureOfBusiness"
                error={touched.natureOfBusiness && Boolean(errors.natureOfBusiness)}
                helperText={touched.natureOfBusiness && errors.natureOfBusiness}
              />
            )}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}

const TradeLicenceRegistration = () => {
  const [step, setStep] = React.useState(0);
  // Step 3: Review, Filing & Certificate state
  const [reviewStatus, setReviewStatus] = React.useState('in_progress');
  const [reviewComment, setReviewComment] = React.useState('');
  const [filingStatus, setFilingStatus] = React.useState('in_progress');
  const [certificateUploaded, setCertificateUploaded] = React.useState(false);
  const [verticalStep, setVerticalStep] = React.useState(0);
  // Declaration checkbox
  const [declared, setDeclared] = React.useState(false);
  // Additional place of business
  const [hasAdditionalPlace, setHasAdditionalPlace] = React.useState(false);

  // Stepper navigation
  const activeStep = step;
  const handleStepClick = (targetStep) => {
    if (targetStep <= step + 1) setStep(targetStep);
  };
  // Vertical stepper logic
  const reviewDone = reviewStatus === 'done';
  const reviewRequisition = reviewStatus === 'requisition';
  const filingDone = filingStatus === 'done';
  const handleProceedToFile = () => {
    setFilingStatus('in_progress');
    setVerticalStep(1);
  };
  const handleUploadCertificate = () => {
    setCertificateUploaded(true);
    setVerticalStep(2);
  };

  // Formik for the entire first step
  const formik = useFormik({
    initialValues: {
      typeOfBusiness: '',
      legalName: '',
      panFile: null,
      natureOfBusiness: '',
      mobile: '',
      email: '',
      businessName: '',
      legalUse: '',
      pan: '',
      numEmployees: '',
      flat: '',
      premise: '',
      road: '',
      village: '',
      city: '',
      district: '',
      state: '',
      pin: '',
      tradeDesc: '',
      tradeType: '',
      tradeZone: '',
      tradeSubType: '',
      bestCity: '',
      applicantName: '',
      designation: '',
      aadhaarFile: null,
      applicantPANFile: null,
      photoFile: null,
      applicantMobile: '',
      applicantEmail: '',
      sameAsAadhaar: true,
      applicantAddress: '',
      promoters: [
        {
          name: '',
          aadhaarFile: null,
          panFile: null,
          photoFile: null,
          mobile: '',
          email: '',
          sameAsAadhaar: true,
          address: ''
        }
      ]
    },
    validationSchema: businessDetailsSchema,
    onSubmit: (values) => {
      setStep(1);
    }
  });

  return (
    <Card sx={{ minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Typography variant="h3" mb={1}>
        Trade Licence Registration
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Register your business for a Trade Licence as required by your local municipal authority.
      </Typography>
      <Box maxWidth="1100px" mx="auto" sx={{ mt: 2 }}>
        <Paper elevation={0} sx={{ bgcolor: '#eef2f6', p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700 }}>
          {/* Stepper */}
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
                  onClick={() => handleStepClick(idx)}
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

          {/* Step 1: Applicant & Business Details */}
          {step === 0 && (
            <form onSubmit={formik.handleSubmit} autoComplete="off">
              {/* Business Identity & Structure Section */}
              <BusinessIdentityStructureSection
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                setFieldValue={formik.setFieldValue}
                handleBlur={formik.handleBlur}
              />
              <Typography variant="h5" fontWeight={700} sx={{ my: 2 }}>
                <span style={{ textDecoration: 'underline' }} mb={1}>
                  Applicant Details
                </span>
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mt={0}>
                {/* Row 1 */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Name"
                    name="applicantName"
                    value={formik.values.applicantName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.applicantName && Boolean(formik.errors.applicantName)}
                    helperText={formik.touched.applicantName && formik.errors.applicantName}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    options={['Director', 'Manager', 'Owner']}
                    value={formik.values.designation || ''}
                    onChange={(e, value) => formik.setFieldValue('designation', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        label="Designation"
                        name="designation"
                        error={formik.touched.designation && Boolean(formik.errors.designation)}
                        helperText={formik.touched.designation && formik.errors.designation}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Aadhaar Upload"
                    name="aadhaarFile"
                    value={formik.values.aadhaarFile ? formik.values.aadhaarFile.name : ''}
                    placeholder="Upload Aadhaar"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById('aadhaarFileInput').click()}
                    error={formik.touched.aadhaarFile && Boolean(formik.errors.aadhaarFile)}
                    helperText={formik.touched.aadhaarFile && formik.errors.aadhaarFile}
                  />
                  <input
                    id="aadhaarFileInput"
                    type="file"
                    hidden
                    name="aadhaarFile"
                    onChange={(e) => formik.setFieldValue('aadhaarFile', e.currentTarget.files[0])}
                    onBlur={formik.handleBlur}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="PAN Upload"
                    name="applicantPANFile"
                    value={formik.values.applicantPANFile ? formik.values.applicantPANFile.name : ''}
                    placeholder="Upload PAN"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById('applicantPANFileInput').click()}
                    error={formik.touched.applicantPANFile && Boolean(formik.errors.applicantPANFile)}
                    helperText={formik.touched.applicantPANFile && formik.errors.applicantPANFile}
                  />
                  <input
                    id="applicantPANFileInput"
                    type="file"
                    hidden
                    name="applicantPANFile"
                    onChange={(e) => formik.setFieldValue('applicantPANFile', e.currentTarget.files[0])}
                    onBlur={formik.handleBlur}
                  />
                </Grid2>
                {/* Row 2 */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Photo Upload"
                    name="photoFile"
                    value={formik.values.photoFile ? formik.values.photoFile.name : ''}
                    placeholder="Upload Photo"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById('photoFileInput').click()}
                    error={formik.touched.photoFile && Boolean(formik.errors.photoFile)}
                    helperText={formik.touched.photoFile && formik.errors.photoFile}
                  />
                  <input
                    id="photoFileInput"
                    type="file"
                    hidden
                    name="photoFile"
                    onChange={(e) => formik.setFieldValue('photoFile', e.currentTarget.files[0])}
                    onBlur={formik.handleBlur}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Mobile"
                    name="applicantMobile"
                    value={formik.values.applicantMobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.applicantMobile && Boolean(formik.errors.applicantMobile)}
                    helperText={formik.touched.applicantMobile && formik.errors.applicantMobile}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    name="applicantEmail"
                    value={formik.values.applicantEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.applicantEmail && Boolean(formik.errors.applicantEmail)}
                    helperText={formik.touched.applicantEmail && formik.errors.applicantEmail}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}></Grid2>
                {/* Residential Address */}
                <Grid2 size={{ xs: 12, mt: 2 }}>
                  <Typography variant="subtitle1">
                    <span style={{ textDecoration: 'underline' }}>Residential Address</span>
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={formik.values.sameAsAadhaar}
                      onChange={(e) => formik.setFieldValue('sameAsAadhaar', e.target.checked)}
                      name="sameAsAadhaar"
                    />
                    <Typography variant="body2" mr={1} width={250}>
                      Same as per aadhaar
                    </Typography>

                    {!formik.values.sameAsAadhaar && (
                      <TextField
                        fullWidth
                        size="small"
                        name="applicantAddress"
                        placeholder="Enter Residential Address"
                        value={formik.values.applicantAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ ml: 1 }}
                        error={formik.touched.applicantAddress && Boolean(formik.errors.applicantAddress)}
                        helperText={formik.touched.applicantAddress && formik.errors.applicantAddress}
                      />
                    )}
                  </Box>
                </Grid2>
              </Grid2>
              {/* Promoter/Signatory Details Section */}
              <Box mt={4}>
                <Typography variant="h5" fontWeight={700} mb={2}>
                  <span style={{ textDecoration: 'underline' }}>Promoter / Signatory Details</span>
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography>No. of Promoters/Directors:</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 32, ml: 2, px: 0 }}
                    onClick={() => {
                      if (formik.values.promoters.length > 1) {
                        formik.setFieldValue('promoters', formik.values.promoters.slice(0, -1));
                      }
                    }}
                  >
                    -
                  </Button>
                  <Typography mx={2}>{formik.values.promoters.length}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 32, px: 0 }}
                    onClick={() => {
                      if (formik.values.promoters.length < 10) {
                        formik.setFieldValue('promoters', [
                          ...formik.values.promoters,
                          {
                            name: '',
                            aadhaarFile: null,
                            panFile: null,
                            photoFile: null,
                            mobile: '',
                            email: '',
                            sameAsAadhaar: true,
                            address: ''
                          }
                        ]);
                      }
                    }}
                  >
                    +
                  </Button>
                </Box>
                <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Name</TableCell>
                        <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Aadhaar</TableCell>
                        <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>PAN</TableCell>
                        <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Photo</TableCell>
                        <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Mobile</TableCell>
                        <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Email</TableCell>
                        <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formik.values.promoters.map((promoter, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2, pl: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Name"
                              name={`promoters[${idx}].name`}
                              value={promoter.name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.promoters?.[idx]?.name && Boolean(formik.errors.promoters?.[idx]?.name)}
                              helperText={
                                formik.touched.promoters?.[idx]?.name && formik.errors.promoters?.[idx]?.name
                                  ? formik.errors.promoters[idx].name
                                  : '\u00A0'
                              }
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Aadhaar Upload"
                              name={`promoters[${idx}].aadhaarFile`}
                              value={promoter.aadhaarFile ? promoter.aadhaarFile.name : ''}
                              placeholder="Upload Aadhaar"
                              InputProps={{ readOnly: true }}
                              onClick={() => document.getElementById(`aadhaarFileInput${idx}`).click()}
                              error={formik.touched.promoters?.[idx]?.aadhaarFile && Boolean(formik.errors.promoters?.[idx]?.aadhaarFile)}
                              helperText={
                                formik.touched.promoters?.[idx]?.aadhaarFile && formik.errors.promoters?.[idx]?.aadhaarFile
                                  ? formik.errors.promoters[idx].aadhaarFile
                                  : '\u00A0'
                              }
                            />
                            <input
                              id={`aadhaarFileInput${idx}`}
                              type="file"
                              hidden
                              name={`promoters[${idx}].aadhaarFile`}
                              onChange={(e) => formik.setFieldValue(`promoters[${idx}].aadhaarFile`, e.currentTarget.files[0])}
                              onBlur={formik.handleBlur}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="PAN Upload"
                              name={`promoters[${idx}].panFile`}
                              value={promoter.panFile ? promoter.panFile.name : ''}
                              placeholder="Upload PAN"
                              InputProps={{ readOnly: true }}
                              onClick={() => document.getElementById(`panFileInput${idx}`).click()}
                              error={formik.touched.promoters?.[idx]?.panFile && Boolean(formik.errors.promoters?.[idx]?.panFile)}
                              helperText={
                                formik.touched.promoters?.[idx]?.panFile && formik.errors.promoters?.[idx]?.panFile
                                  ? formik.errors.promoters[idx].panFile
                                  : '\u00A0'
                              }
                            />
                            <input
                              id={`panFileInput${idx}`}
                              type="file"
                              hidden
                              name={`promoters[${idx}].panFile`}
                              onChange={(e) => formik.setFieldValue(`promoters[${idx}].panFile`, e.currentTarget.files[0])}
                              onBlur={formik.handleBlur}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Photo Upload"
                              name={`promoters[${idx}].photoFile`}
                              value={promoter.photoFile ? promoter.photoFile.name : ''}
                              placeholder="Upload Photo"
                              InputProps={{ readOnly: true }}
                              onClick={() => document.getElementById(`photoFileInput${idx}`).click()}
                              error={formik.touched.promoters?.[idx]?.photoFile && Boolean(formik.errors.promoters?.[idx]?.photoFile)}
                              helperText={
                                formik.touched.promoters?.[idx]?.photoFile && formik.errors.promoters?.[idx]?.photoFile
                                  ? formik.errors.promoters[idx].photoFile
                                  : '\u00A0'
                              }
                            />
                            <input
                              id={`photoFileInput${idx}`}
                              type="file"
                              hidden
                              name={`promoters[${idx}].photoFile`}
                              onChange={(e) => formik.setFieldValue(`promoters[${idx}].photoFile`, e.currentTarget.files[0])}
                              onBlur={formik.handleBlur}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Mobile"
                              name={`promoters[${idx}].mobile`}
                              value={promoter.mobile}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.promoters?.[idx]?.mobile && Boolean(formik.errors.promoters?.[idx]?.mobile)}
                              helperText={
                                formik.touched.promoters?.[idx]?.mobile && formik.errors.promoters?.[idx]?.mobile
                                  ? formik.errors.promoters[idx].mobile
                                  : '\u00A0'
                              }
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Email"
                              name={`promoters[${idx}].email`}
                              value={promoter.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.promoters?.[idx]?.email && Boolean(formik.errors.promoters?.[idx]?.email)}
                              helperText={
                                formik.touched.promoters?.[idx]?.email && formik.errors.promoters?.[idx]?.email
                                  ? formik.errors.promoters[idx].email
                                  : '\u00A0'
                              }
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: 'center',
                              p: 0.5,
                              pt: 2,
                              pr: 2,
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'center',
                              border: 'none'
                            }}
                          >
                            <Stack direction="row" alignItems="flex-start" justifyContent="center">
                              <Tooltip title="Same as per Aadhaar" arrow>
                                <Checkbox
                                  sx={{ p: 0, m: 0, pt: 1 }}
                                  checked={promoter.sameAsAadhaar}
                                  onChange={(e) => formik.setFieldValue(`promoters[${idx}].sameAsAadhaar`, e.target.checked)}
                                  name={`promoters[${idx}].sameAsAadhaar`}
                                />
                              </Tooltip>
                              {promoter.sameAsAadhaar && (
                                <Typography variant="body2" mr={1}>
                                  Same as per aadhaar
                                </Typography>
                              )}
                              {!promoter.sameAsAadhaar && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  name={`promoters[${idx}].address`}
                                  placeholder="Enter Residential Address"
                                  value={promoter.address}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.promoters?.[idx]?.address && Boolean(formik.errors.promoters?.[idx]?.address)}
                                  helperText={
                                    formik.touched.promoters?.[idx]?.address && formik.errors.promoters?.[idx]?.address
                                      ? formik.errors.promoters[idx].address
                                      : '\u00A0'
                                  }
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
              <Box mt={4}>
                <Typography variant="h5" fontWeight={700} mb={2}>
                  <span style={{ textDecoration: 'underline' }}>Business premises, location & proofs</span>
                </Typography>
                <Grid2 container spacing={2} alignItems="center">
                  {/* Trade premises and description */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Autocomplete
                      size="small"
                      options={['Owned', 'Rented', 'Leased']}
                      value={formik.values.tradePremises || ''}
                      onChange={(e, value) => formik.setFieldValue('tradePremises', value)}
                      renderInput={(params) => <TextField {...params} label="Trade premises" size="small" />}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Autocomplete
                      size="small"
                      options={['Retail', 'Wholesale', 'Manufacturing']}
                      value={formik.values.tradeDescription || ''}
                      onChange={(e, value) => formik.setFieldValue('tradeDescription', value)}
                      renderInput={(params) => <TextField {...params} label="Trade description" size="small" />}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={700}>
                      Principal place of business
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Address Line 1"
                      name="addressLine1"
                      value={formik.values.addressLine1 || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Address Line 2"
                      name="addressLine2"
                      value={formik.values.addressLine2 || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City"
                      name="city"
                      value={formik.values.city || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="District"
                      name="district"
                      value={formik.values.district || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="State"
                      name="state"
                      value={formik.values.state || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Pincode"
                      name="pincode"
                      value={formik.values.pincode || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid2>
                  {/* Nature of possession and trade area */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Autocomplete
                      size="small"
                      options={['Self-owned', 'Leased', 'Rented']}
                      value={formik.values.natureOfPossession || ''}
                      onChange={(e, value) => formik.setFieldValue('natureOfPossession', value)}
                      renderInput={(params) => <TextField {...params} label="Nature of possession" size="small" />}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Trade area in Sqfts"
                      name="tradeArea"
                      value={formik.values.tradeArea || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid2>
                  {/* Address proof, Rental Agreement/NOC, Bank Statement/Cancelled Cheque uploads */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Upload Address proof"
                      name="addressProof"
                      value={formik.values.addressProof ? formik.values.addressProof.name : ''}
                      placeholder="Upload Address Proof"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('addressProofInput').click()}
                    />
                    <input
                      id="addressProofInput"
                      type="file"
                      hidden
                      name="addressProof"
                      onChange={(e) => formik.setFieldValue('addressProof', e.currentTarget.files[0])}
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Upload Rental Agreement/NOC"
                      name="rentalAgreement"
                      value={formik.values.rentalAgreement ? formik.values.rentalAgreement.name : ''}
                      placeholder="Upload Rental Agreement/NOC"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('rentalAgreementInput').click()}
                    />
                    <input
                      id="rentalAgreementInput"
                      type="file"
                      hidden
                      name="rentalAgreement"
                      onChange={(e) => formik.setFieldValue('rentalAgreement', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Upload Bank Statement/Cancelled Cheque"
                      name="bankStatement"
                      value={formik.values.bankStatement ? formik.values.bankStatement.name : ''}
                      placeholder="Upload Bank Statement/Cancelled Cheque"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('bankStatementInput').click()}
                    />
                    <input
                      id="bankStatementInput"
                      type="file"
                      hidden
                      name="bankStatement"
                      onChange={(e) => formik.setFieldValue('bankStatement', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  {/* Road type */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 6 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography>Road type:</Typography>
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={formik.values.roadType === 'Single lane'}
                              onChange={() => formik.setFieldValue('roadType', 'Single lane')}
                            />
                          }
                          label="Single lane"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              checked={formik.values.roadType === 'Double lane'}
                              onChange={() => formik.setFieldValue('roadType', 'Double lane')}
                            />
                          }
                          label="Double lane"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              label="More than 2"
                              checked={formik.values.roadType === 'More than 2'}
                              onChange={() => formik.setFieldValue('roadType', 'More than 2')}
                            />
                          }
                          label="More than 2"
                        />
                      </FormGroup>
                    </Box>
                  </Grid2>
                  {/* Additional place of business */}
                  <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                    <Typography>Additional place of business?</Typography>
                    <Checkbox
                      checked={formik.values.hasAdditionalPlace === true}
                      onChange={() => formik.setFieldValue('hasAdditionalPlace', true)}
                    />{' '}
                    Yes
                    <Checkbox
                      checked={formik.values.hasAdditionalPlace === false}
                      onChange={() => formik.setFieldValue('hasAdditionalPlace', false)}
                    />{' '}
                    No
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2} alignItems="center">
                  {formik.values.hasAdditionalPlace === true && (
                    <>
                      <Grid2 size={{ xs: 12 }} mt={2}>
                        <Typography variant="subtitle1" fontWeight={700} mb={0}>
                          <span style={{ textDecoration: 'underline' }}>Additional Place of Business</span>
                        </Typography>
                      </Grid2>
                      {/* Trade premises and description */}
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Autocomplete
                          size="small"
                          options={['Owned', 'Rented', 'Leased']}
                          value={formik.values.additionalTradePremises || ''}
                          onChange={(e, value) => formik.setFieldValue('additionalTradePremises', value)}
                          renderInput={(params) => <TextField {...params} label="Trade premises" size="small" />}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Autocomplete
                          size="small"
                          options={['Retail', 'Wholesale', 'Manufacturing']}
                          value={formik.values.additionalTradeDescription || ''}
                          onChange={(e, value) => formik.setFieldValue('additionalTradeDescription', value)}
                          renderInput={(params) => <TextField {...params} label="Trade description" size="small" />}
                        />
                      </Grid2>
                      {/* Principal place of business */}
                      <Grid2 size={{ xs: 12 }}>
                        <Typography variant="subtitle1" color="text.secondary" fontWeight={700}>
                          Principal place of business
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Address Line 1"
                          name="additionalAddressLine1"
                          value={formik.values.additionalAddressLine1 || ''}
                          onChange={formik.handleChange}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Address Line 2"
                          name="additionalAddressLine2"
                          value={formik.values.additionalAddressLine2 || ''}
                          onChange={formik.handleChange}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="City"
                          name="additionalCity"
                          value={formik.values.additionalCity || ''}
                          onChange={formik.handleChange}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="District"
                          name="additionalDistrict"
                          value={formik.values.additionalDistrict || ''}
                          onChange={formik.handleChange}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="State"
                          name="additionalState"
                          value={formik.values.additionalState || ''}
                          onChange={formik.handleChange}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Pincode"
                          name="additionalPincode"
                          value={formik.values.additionalPincode || ''}
                          onChange={formik.handleChange}
                        />
                      </Grid2>
                      {/* Nature of possession and trade area */}
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Autocomplete
                          size="small"
                          options={['Self-owned', 'Leased', 'Rented']}
                          value={formik.values.additionalNatureOfPossession || ''}
                          onChange={(e, value) => formik.setFieldValue('additionalNatureOfPossession', value)}
                          renderInput={(params) => <TextField {...params} label="Nature of possession" size="small" />}
                        />
                      </Grid2>
                      {/* Address proof, Rental Agreement/NOC, Bank Statement/Cancelled Cheque uploads */}
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Upload Address proof"
                          name="additionalAddressProof"
                          value={formik.values.additionalAddressProof ? formik.values.additionalAddressProof.name : ''}
                          placeholder="Upload Address Proof"
                          InputProps={{ readOnly: true }}
                          onClick={() => document.getElementById('additionalAddressProofInput').click()}
                        />
                        <input
                          id="additionalAddressProofInput"
                          type="file"
                          hidden
                          name="additionalAddressProof"
                          onChange={(e) => formik.setFieldValue('additionalAddressProof', e.currentTarget.files[0])}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Upload Rental Agreement/NOC"
                          name="additionalRentalAgreement"
                          value={formik.values.additionalRentalAgreement ? formik.values.additionalRentalAgreement.name : ''}
                          placeholder="Upload Rental Agreement/NOC"
                          InputProps={{ readOnly: true }}
                          onClick={() => document.getElementById('additionalRentalAgreementInput').click()}
                        />
                        <input
                          id="additionalRentalAgreementInput"
                          type="file"
                          hidden
                          name="additionalRentalAgreement"
                          onChange={(e) => formik.setFieldValue('additionalRentalAgreement', e.currentTarget.files[0])}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Upload Bank Statement/Cancelled Cheque"
                          name="additionalBankStatement"
                          value={formik.values.additionalBankStatement ? formik.values.additionalBankStatement.name : ''}
                          placeholder="Upload Bank Statement/Cancelled Cheque"
                          InputProps={{ readOnly: true }}
                          onClick={() => document.getElementById('additionalBankStatementInput').click()}
                        />
                        <input
                          id="additionalBankStatementInput"
                          type="file"
                          hidden
                          name="additionalBankStatement"
                          onChange={(e) => formik.setFieldValue('additionalBankStatement', e.currentTarget.files[0])}
                        />
                      </Grid2>
                    </>
                  )}
                </Grid2>
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button type="submit" size="medium" variant="contained" startIcon={<IconSave />} color="primary">
                  Save & Continue
                </Button>
              </Box>
            </form>
          )}

          {/* Step 2: Documents & Declaration */}
          {step === 1 && (
            <form autoComplete="off">
              {/* Task 1: Trade License Declaration */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  Trade License Declaration
                </Typography>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Autocomplete
                      size="small"
                      options={['Yes', 'No']}
                      value={formik.values.applyNewTradeLicense || ''}
                      onChange={(e, value) => formik.setFieldValue('applyNewTradeLicense', value)}
                      renderInput={(params) => <TextField {...params} label="Apply for a new trade license" size="small" />}
                    />
                  </Grid2>
                  {formik.values.applyNewTradeLicense === 'No' && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="TIN No"
                          name="tinNo"
                          value={formik.values.tinNo || ''}
                          onChange={formik.handleChange}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Upload Previous Certificate"
                          name="previousCertificate"
                          value={formik.values.previousCertificate ? formik.values.previousCertificate.name : ''}
                          placeholder="Upload Previous Certificate"
                          InputProps={{ readOnly: true }}
                          onClick={() => document.getElementById('previousCertificateInput').click()}
                        />
                        <input
                          id="previousCertificateInput"
                          type="file"
                          hidden
                          name="previousCertificate"
                          onChange={(e) => formik.setFieldValue('previousCertificate', e.currentTarget.files[0])}
                        />
                      </Grid2>
                    </>
                  )}
                </Grid2>
              </Box>
              {/* Task 2: Business Registration Documents */}
              <Box mb={3}>
                <Typography variant="h5" fontWeight={700} mb={1}>
                  Business Registration Documents
                </Typography>
                <Grid2 container spacing={2} alignItems="center">
                  {/* 1. Incorporation certificate / Partnership deed */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>Incorporation certificate / Partnership deed</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="incorporationCertificate"
                      value={formik.values.incorporationCertificate ? formik.values.incorporationCertificate.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('incorporationCertificateInput').click()}
                    />
                    <input
                      id="incorporationCertificateInput"
                      type="file"
                      hidden
                      name="incorporationCertificate"
                      onChange={(e) => formik.setFieldValue('incorporationCertificate', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  {/* 2. Letter of Authorisation / Board resolution */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>Letter of Authorisation / Board resolution</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="authorisationLetter"
                      value={formik.values.authorisationLetter ? formik.values.authorisationLetter.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('authorisationLetterInput').click()}
                    />
                    <input
                      id="authorisationLetterInput"
                      type="file"
                      hidden
                      name="authorisationLetter"
                      onChange={(e) => formik.setFieldValue('authorisationLetter', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  {/* 3. Local language name board photo of business */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>Local language name board photo of business</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="nameBoardPhoto"
                      value={formik.values.nameBoardPhoto ? formik.values.nameBoardPhoto.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('nameBoardPhotoInput').click()}
                    />
                    <input
                      id="nameBoardPhotoInput"
                      type="file"
                      hidden
                      name="nameBoardPhoto"
                      onChange={(e) => formik.setFieldValue('nameBoardPhoto', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  {/* 4. Memorandum of Articles (MOA) */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>
                      Memorandum of Articles (MOA) <span style={{ fontSize: 12, color: '#888' }}>(in case of companies)</span>
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="moa"
                      value={formik.values.moa ? formik.values.moa.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('moaInput').click()}
                    />
                    <input
                      id="moaInput"
                      type="file"
                      hidden
                      name="moa"
                      onChange={(e) => formik.setFieldValue('moa', e.currentTarget.files[0])}
                    />
                  </Grid2>
                </Grid2>
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button size="medium" variant="contained" startIcon={<IconSave />} color="primary" onClick={() => setStep(2)}>
                  Save & Continue
                </Button>
              </Box>
            </form>
          )}

          {/* Step 3: Review, Filing & Certificate */}
          {step === 2 && (
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
                        sx={{ mb: 2, mt: 1 }}
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
                        sx={{ mb: 2, mt: 1 }}
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
                        sx={{ mb: 2, mt: 1 }}
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
                        sx={{ mt: 2 }}
                      >
                        Download
                      </Button>
                    </StepContent>
                  </Step>
                </Stepper>
              </form>
            </Box>
          )}
        </Paper>
      </Box>
    </Card>
  );
};

export default TradeLicenceRegistration;
