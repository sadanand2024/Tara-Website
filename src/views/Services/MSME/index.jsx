import React, { useState, useEffect } from 'react';
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
  Card,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RaiseRequest from '../RaiseRequest';
import PersonIcon from '@mui/icons-material/Person';
import GetActionButtons from '../FormHelpers';
import IconSave from '@mui/icons-material/Save';
import IconArrowForward from '@mui/icons-material/ArrowForward';
import IconArrowBack from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom';
import Factory from '../../../utils/Factory';
import { useSnackbar } from 'notistack';
const steps = [
  { label: 'Enterprise Profile', width: 180 },
  { label: 'Financial + Location Details', width: 220 },
  { label: 'Review, Filing & Certificate', width: 220 }
];

const entityTypes = [
  'Proprietorship',
  'Partnership Firm',
  'Limited Liability Partnership (LLP)',
  'Private Limited Company (Pvt Ltd)',
  'One Person Company (OPC)',
  'Public Limited Company',
  'Section 8 Company',
  'Hindu Undivided Family (HUF)',
  'Cooperative Society',
  'Trusts & Societies'
];
const businessIdentityInitialValues = {
  id: null,
  organisation_type: '',
  business_name: '',
  pan_of_business_or_COI: '',
  aadhar_of_signatory: '',
  mobile_number: '',
  email_id: '',
  Are_you_previously_registered_UAM: 'yes',
  UAM_number: '',
  has_business_commenced: 'yes',
  date_of_commencement: ''
};

const businessClassificationInitialValues = {
  major_activity: '',
  nature_of_business: '',
  nic_codes: {
    nic2: '',
    nic4: '',
    nic5: ''
  },
  number_of_persons_employed: {
    male: 0,
    female: 0,
    others: 0,
    total: 0
  }
};

const turnoverInvestmentDeclarationInitialValues = {
  id: null,
  turnover_in_inr: {
    totalTurnover: '',
    exportTurnover: '',
    domesticTurnover: ''
  },
  investment_in_plant_and_machinery: '',
  have_you_filed_itr_previous_year: '',
  are_you_registered_under_gst: '',
  gst_certificate: null
};

const addressInitialValues = {
  id: null,
  official_address_of_enterprise: {
    flat: '',
    building: '',
    street: '',
    village: '',
    city: '',
    district: '',
    state: '',
    pin: '',
    lat: '',
    lng: ''
  },
  bank_statement_or_cancelled_cheque: null,
  official_address_of_proof: null,
  location_of_plant_or_unit: []
};
const reviewFilingCertificateInitialValues = {
  reviewStatus: 'in_progress',
  reviewComment: '',
  filingStatus: 'in_progress',
  certificateUploaded: false
};

const viewFile = async (url) => {
  const response = await Factory('get', `/docwallet/generate_presigned_url?url=${url}`, {}, {});
  if (response.res.status_cd === 0) {
    let url = response.res.data.url;
    window.open(url, '_blank');
  }
};

const reviewSteps = ['Drafting', 'Filing', 'Acknowledgement'];

const MSMEDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = React.useState(0);
  const [reviewStep, setReviewStep] = React.useState(0);
  const [sectionData, setSectionData] = React.useState({});
  const [businessIdentityData, setBusinessIdentityData] = React.useState(businessIdentityInitialValues);
  const [businessClassificationData, setBusinessClassificationData] = React.useState(businessClassificationInitialValues);
  const [turnoverInvestmentDeclarationData, setTurnoverInvestmentDeclarationData] = React.useState(
    turnoverInvestmentDeclarationInitialValues
  );
  const [registeredAddressUnitsData, setRegisteredAddressUnitsData] = React.useState(addressInitialValues);
  const [reviewFilingCertificateData, setReviewFilingCertificateData] = React.useState(reviewFilingCertificateInitialValues);
  const [loading, setLoading] = React.useState(false);
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');

  // 1. Business Identity Formik
  const businessIdentityFormik = useFormik({
    initialValues: businessIdentityData,
    validationSchema: Yup.object({
      organisation_type: Yup.string().required('Required'),
      business_name: Yup.string().required('Required'),
      pan_of_business_or_COI: Yup.mixed().required('Required'),
      aadhar_of_signatory: Yup.mixed().required('Required'),
      mobile_number: Yup.string().required('Required'),
      email_id: Yup.string().email('Invalid email_id').required('Required'),
      Are_you_previously_registered_UAM: Yup.string().required('Required'),
      has_business_commenced: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      let url = '/msme/business-identity/';
      let type = 'post';
      if (values.id !== null) {
        url = url + values.id + '/';
        type = 'put';
      }
      const formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', sectionData.tasks['Business Identity'].task_id);
      formData.append('status', 'in progress');
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'pan_of_business_or_COI' || key === 'aadhar_of_signatory') {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else if (value !== null && value !== undefined && !(value instanceof File)) {
          formData.append(key, value);
        }
      });

      const response = await Factory(type, url, formData);
      if (response.res.status_cd === 0) {
        setBusinessIdentityData(response.res);
        enqueueSnackbar('Business Identity Saved', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      } else {
        enqueueSnackbar('Failed to save business identity', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    }
  });

  // 2. Business Classification Inputs Formik
  const businessClassificationFormik = useFormik({
    initialValues: businessClassificationData,
    onSubmit: async (values) => {
      let url = '/msme/business-classification/';
      let type = 'post';
      if (values.id !== null) {
        url = url + values.id + '/';
        type = 'put';
      }
      let __postValues = { ...values };
      __postValues.service_request = service_id;
      __postValues.service_task = sectionData.tasks['Business Classification Inputs'].task_id;
      __postValues.status = 'in progress';
      const response = await Factory(type, url, __postValues);
      if (response.res.status_cd === 0) {
        setBusinessClassificationData(response.res);
        enqueueSnackbar('Business Classification Inputs Saved', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        enqueueSnackbar('Failed to save business classification inputs', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    }
  });

  // 3. Turnover & Investment Declaration Formik
  const turnoverFormik = useFormik({
    initialValues: turnoverInvestmentDeclarationData,
    onSubmit: async (values) => {
      let url = '/msme/turnover-details/';
      let type = 'post';
      if (values.id !== null) {
        url = url + values.id + '/';
        type = 'put';
      }

      const formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', sectionData.tasks['Turnover And InvestmentDeclaration'].task_id);
      formData.append('status', 'in progress');

      Object.entries(values).forEach(([key, value]) => {
        if (key === 'gst_certificate') {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else if (key === 'turnover_in_inr') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined && !(value instanceof File)) {
          formData.append(key, value);
        }
      });

      const response = await Factory(type, url, formData);
      if (response.res.status_cd === 0) {
        setTurnoverInvestmentDeclarationData(response.res);
        enqueueSnackbar('Turnover & Investment Declaration Saved', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        enqueueSnackbar('Failed to save turnover & investment declaration', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    }
  });

  // 4. Registered Address & Units Formik
  const addressFormik = useFormik({
    initialValues: registeredAddressUnitsData,

    onSubmit: async (values) => {
      let url = '/msme/registration-address-details/';
      let type = 'post';
      if (values.id !== null) {
        url = url + values.id + '/';
        type = 'put';
      }
      const formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', sectionData.tasks['Registered Address'].task_id);
      formData.append('status', 'in progress');

      Object.entries(values).forEach(([key, value]) => {
        if (key === 'official_address_of_enterprise') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'bank_statement_or_cancelled_cheque' || key === 'official_address_of_proof') {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else if (value !== null && value !== undefined && !(value instanceof File)) {
          formData.append(key, value);
        }
      });

      const response = await Factory(type, url, formData);
      if (response.res.status_cd === 0) {
        setRegisteredAddressUnitsData(response.res);
        enqueueSnackbar('Registered Address & Units Saved', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        enqueueSnackbar('Failed to save registered address & units', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    }
  });

  // 5. Review, Filing & Certificate Formik
  const reviewFormik = useFormik({
    initialValues: reviewFilingCertificateData,
    validationSchema: Yup.object({
      reviewStatus: Yup.string().required('Required'),
      filingStatus: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      console.log('Review, Filing & Certificate Saved', values);
    }
  });

  // Pass activeStep to stepper
  const activeStep = step;

  // Allow navigation to steps <= current step + 1
  const handleStepClick = (targetStep) => {
    if (targetStep <= step + 1) setStep(targetStep);
  };

  // Handlers for vertical stepper progression
  // const handleProceedToFile = () => {
  //   reviewFormik.setFieldValue('filingStatus', 'in_progress');
  //   reviewFormik.setFieldValue('certificateUploaded', false);
  // };
  // const handleUploadCertificate = () => {
  //   reviewFormik.setFieldValue('certificateUploaded', true);
  // };

  // State for plant/unit not applicable checkbox
  const [plantNotApplicable, setPlantNotApplicable] = useState(false);

  const getStepData = async (step) => {
    let url = `/msme/service-request-section-data?service_request_id=${service_id}&section=`;
    if (step === 0) {
      url = url + 'enterprise_profile_info';
    } else if (step === 1) {
      url = url + 'financial_and_location_info';
    } else if (step === 2) {
      url = url + 'review_filing_certificate';
    }
    const response = await Factory('get', url, {});
    if (response.res.status_cd === 0) {
      setSectionData(response.res.data);
      if (step === 0) {
        if (response.res.data.tasks['Business Identity']?.data !== null) {
          setBusinessIdentityData(response.res.data.tasks['Business Identity'].data);
          businessIdentityFormik.setValues(response.res.data.tasks['Business Identity'].data);
        }
        if (response.res.data.tasks['Business Classification Inputs']?.data !== null) {
          setBusinessClassificationData(response.res.data.tasks['Business Classification Inputs'].data);
          businessClassificationFormik.setValues(response.res.data.tasks['Business Classification Inputs'].data);
        }
      } else if (step === 1) {
        if (response.res.data.tasks['Turnover And InvestmentDeclaration']?.data !== null) {
          setTurnoverInvestmentDeclarationData(response.res.data.tasks['Turnover And InvestmentDeclaration'].data);
          turnoverFormik.setValues(response.res.data.tasks['Turnover And InvestmentDeclaration'].data);
        }
        if (response.res.data.tasks['Registered Address']?.data !== null) {
          setRegisteredAddressUnitsData(response.res.data.tasks['Registered Address'].data);
          addressFormik.setValues(response.res.data.tasks['Registered Address'].data);
        }
      } else if (step === 2) {
        if (response.res.data.tasks['Review Filing Certificate']?.data !== null) {
          setReviewFilingCertificateData(response.res.data.tasks['Review Filing Certificate'].data);
        }
      }
    }
  };

  useEffect(() => {
    if (step === 0 || step === 1 || step === 2) getStepData(step);
  }, [step]);

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
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" mb={2}>
                  Business Identity
                </Typography>
                <RaiseRequest
                  fields={[
                    'Organisation type',
                    'Business name',
                    'PAN of Business & C.O.I',
                    'Aadhaar of authorized signatory',
                    'Mobile Number',
                    'Email',
                    'Are you previously registered under Udyog Aadhaar? (UAM)',
                    'UAM number',
                    'Has Business Commenced?',
                    'Date of commencement'
                  ]}
                  task_id={sectionData?.tasks?.['Business Identity']?.task_id}
                />
              </Box>

              <Typography color="text.secondary" sx={{ mb: 3, fontSize: 15 }}>
                Please provide all info as per your government identity documents (PAN, Aadhaar etc.)
              </Typography>
              <Grid2 container spacing={2} mb={2}>
                {/* 1. Organisation type */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography
                    varient="subtitle1"
                    sx={{
                      color:
                        businessIdentityFormik.errors.organisation_type && businessIdentityFormik.touched.organisation_type
                          ? 'red'
                          : 'inherit'
                    }}
                  >
                    Organisation type
                    <span style={{ color: 'red' }}> *</span>
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={entityTypes}
                    value={businessIdentityFormik.values.organisation_type}
                    onChange={(e, value) => businessIdentityFormik.setFieldValue('organisation_type', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Organisation Type"
                        error={businessIdentityFormik.errors.organisation_type && businessIdentityFormik.touched.organisation_type}
                        touched={businessIdentityFormik.touched.organisation_type}
                        onBlur={() => businessIdentityFormik.setFieldTouched('organisation_type', true)}
                      />
                    )}
                  />
                </Grid2>
                {/* 2. Business Name */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography
                    varient="subtitle1"
                    sx={{
                      color: businessIdentityFormik.errors.business_name && businessIdentityFormik.touched.business_name ? 'red' : 'inherit'
                    }}
                  >
                    Business Name
                    <span style={{ color: 'red' }}> *</span>
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={businessIdentityFormik.values.business_name}
                    onChange={(e) => businessIdentityFormik.setFieldValue('business_name', e.target.value)}
                    error={businessIdentityFormik.errors.business_name && businessIdentityFormik.touched.business_name}
                    touched={businessIdentityFormik.touched.business_name}
                    onBlur={() => businessIdentityFormik.setFieldTouched('business_name', true)}
                  />
                </Grid2>
                {/* 3. PAN of Business & COI */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography
                    varient="subtitle1"
                    sx={{
                      color:
                        businessIdentityFormik.errors.pan_of_business_or_COI && businessIdentityFormik.touched.pan_of_business_or_COI
                          ? 'red'
                          : 'inherit'
                    }}
                  >
                    PAN of Business & C.O.I
                    <span style={{ color: 'red' }}> *</span>
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={1}>
                    <Button fullWidth size="small" variant="contained" onClick={() => document.getElementById('coiInput').click()}>
                      Upload
                    </Button>
                    <input
                      id="coiInput"
                      type="file"
                      hidden
                      onChange={(e) => businessIdentityFormik.setFieldValue('pan_of_business_or_COI', e.target.files[0])}
                      onBlur={() => businessIdentityFormik.setFieldTouched('pan_of_business_or_COI', true)}
                      error={businessIdentityFormik.errors.pan_of_business_or_COI && businessIdentityFormik.touched.pan_of_business_or_COI}
                      touched={businessIdentityFormik.touched.pan_of_business_or_COI}
                    />
                    {businessIdentityFormik.values.pan_of_business_or_COI && (
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          if (businessIdentityFormik.values.pan_of_business_or_COI instanceof File) {
                            const url = URL.createObjectURL(businessIdentityFormik.values.pan_of_business_or_COI);
                            window.open(url, '_blank');
                          } else {
                            viewFile(businessIdentityFormik.values.pan_of_business_or_COI);
                          }
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Stack>
                </Grid2>
                {/* 4. Aadhaar of authorized signatory */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography
                    varient="subtitle1"
                    sx={{
                      color:
                        businessIdentityFormik.errors.pan_of_business_or_COI && businessIdentityFormik.touched.pan_of_business_or_COI
                          ? 'red'
                          : 'inherit'
                    }}
                  >
                    Aadhaar of authorized signatory
                    <span style={{ color: 'red' }}> *</span>
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={1}>
                    <Button fullWidth size="small" variant="contained" onClick={() => document.getElementById('aadhaarInput').click()}>
                      Upload
                    </Button>
                    <input
                      id="aadhaarInput"
                      type="file"
                      hidden
                      onChange={(e) => businessIdentityFormik.setFieldValue('aadhar_of_signatory', e.target.files[0])}
                      onBlur={() => businessIdentityFormik.setFieldTouched('aadhar_of_signatory', true)}
                      error={businessIdentityFormik.errors.aadhar_of_signatory && businessIdentityFormik.touched.aadhar_of_signatory}
                      touched={businessIdentityFormik.touched.aadhar_of_signatory}
                    />
                    {businessIdentityFormik.values.aadhar_of_signatory && (
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          if (businessIdentityFormik.values.aadhar_of_signatory instanceof File) {
                            const url = URL.createObjectURL(businessIdentityFormik.values.aadhar_of_signatory);
                            window.open(url, '_blank');
                          } else {
                            viewFile(businessIdentityFormik.values.aadhar_of_signatory);
                          }
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Stack>
                </Grid2>
                {/* 5. Mobile Number */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography
                    varient="subtitle1"
                    sx={{
                      color: businessIdentityFormik.errors.mobile_number && businessIdentityFormik.touched.mobile_number ? 'red' : 'inherit'
                    }}
                  >
                    Mobile Number
                    <span style={{ color: 'red' }}> *</span>
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={businessIdentityFormik.values.mobile_number}
                    onChange={(e) => businessIdentityFormik.setFieldValue('mobile_number', e.target.value)}
                    error={businessIdentityFormik.errors.mobile_number && businessIdentityFormik.touched.mobile_number}
                    touched={businessIdentityFormik.touched.mobile_number}
                    onBlur={() => businessIdentityFormik.setFieldTouched('mobile_number', true)}
                  />
                </Grid2>
                {/* 6. Email ID */}
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} display="flex" alignItems="center">
                  <Typography
                    varient="subtitle1"
                    sx={{
                      color: businessIdentityFormik.errors.email_id && businessIdentityFormik.touched.email_id ? 'red' : 'inherit'
                    }}
                  >
                    Email ID
                    <span style={{ color: 'red' }}> *</span>
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={businessIdentityFormik.values.email_id}
                    onChange={(e) => businessIdentityFormik.setFieldValue('email_id', e.target.value)}
                    error={businessIdentityFormik.errors.email_id && businessIdentityFormik.touched.email_id}
                    touched={businessIdentityFormik.touched.email_id}
                    onBlur={() => businessIdentityFormik.setFieldTouched('email_id', true)}
                  />
                </Grid2>
                {/* 7. UAM Registered */}
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Are you previously registered under Udyog Aadhaar? (UAM)</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 7 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <RadioGroup
                      row
                      value={businessIdentityFormik.values.Are_you_previously_registered_UAM}
                      sx={{ width: '40%' }}
                      onChange={(e) => businessIdentityFormik.setFieldValue('Are_you_previously_registered_UAM', e.target.value)}
                    >
                      <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                    </RadioGroup>
                    {businessIdentityFormik.values.Are_you_previously_registered_UAM === 'yes' && (
                      <TextField
                        size="small"
                        fullWidth
                        value={businessIdentityFormik.values.UAM_number}
                        onChange={(e) => businessIdentityFormik.setFieldValue('UAM_number', e.target.value)}
                        label="Enter UAM"
                      />
                    )}
                  </Stack>
                </Grid2>
                {/* 8. Business Commenced */}
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }} gap={2} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Has Business Commenced?</Typography>
                  <RadioGroup
                    row
                    value={businessIdentityFormik.values.has_business_commenced}
                    sx={{ width: '40%' }}
                    onChange={(e) => businessIdentityFormik.setFieldValue('has_business_commenced', e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 7 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {businessIdentityFormik.values.has_business_commenced === 'yes' && (
                      <TextField
                        size="small"
                        fullWidth
                        value={businessIdentityFormik.values.date_of_commencement}
                        onChange={(e) => businessIdentityFormik.setFieldValue('date_of_commencement', e.target.value)}
                        type="date"
                        error={businessIdentityFormik.errors.date_of_commencement && businessIdentityFormik.touched.date_of_commencement}
                        touched={businessIdentityFormik.touched.date_of_commencement}
                        onBlur={() => businessIdentityFormik.setFieldTouched('date_of_commencement', true)}
                      />
                    )}
                  </Stack>
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<IconSave />}
                  color="primary"
                  onClick={businessIdentityFormik.handleSubmit}
                >
                  Save Business Identity
                </Button>
                <GetActionButtons
                  type="put"
                  data={sectionData?.tasks?.['Business Identity']}
                  status={sectionData?.tasks?.['Business Identity']?.data?.status}
                  urlEndpoint={`business-identity`}
                  recId={sectionData?.tasks?.['Business Identity']?.data?.id}
                  task_id={sectionData?.tasks?.['Business Identity']?.task_id}
                  service_id={service_id}
                  msme={true}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Task 2: Business Classification Inputs */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" mb={2} mt={2}>
                  Business Classification Inputs
                </Typography>
                <RaiseRequest
                  fields={['Major Activity', 'Nature of Business', 'NIC Codes', 'Number of persons employed']}
                  task_id={sectionData?.tasks?.['Business Classification Inputs']?.task_id}
                />
              </Box>
              <Grid2 container spacing={2}>
                {/* 1. Major Activity */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Major Activity</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                  <RadioGroup
                    row
                    value={businessClassificationFormik.values.major_activity}
                    onChange={(e) => businessClassificationFormik.setFieldValue('major_activity', e.target.value)}
                  >
                    <FormControlLabel value="MANUFACTURING" control={<Radio color="primary" />} label="Manufacturing" />
                    <FormControlLabel value="SERVICE" control={<Radio color="primary" />} label="Service" />
                  </RadioGroup>
                </Grid2>
                {/* 2. Nature of Business */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                  <Typography varient="subtitle1">Nature of Business</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                  <TextField
                    fullWidth
                    size="small"
                    onChange={(e) => businessClassificationFormik.setFieldValue('nature_of_business', e.target.value)}
                    value={businessClassificationFormik.values.nature_of_business}
                  />
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
                        value={businessClassificationFormik.values.nic_codes.nic2}
                        onChange={(e, value) => businessClassificationFormik.setFieldValue('nic_codes.nic2', value || '')}
                        renderInput={(params) => <TextField {...params} label="NIC 2 Digit Code" />}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={['1001', '1002']}
                        value={businessClassificationFormik.values.nic_codes.nic4}
                        onChange={(e, value) => businessClassificationFormik.setFieldValue('nic_codes.nic4', value || '')}
                        renderInput={(params) => <TextField {...params} label="NIC 4 Digit Code" />}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={['10011', '10012']}
                        value={businessClassificationFormik.values.nic_codes.nic5}
                        onChange={(e, value) => businessClassificationFormik.setFieldValue('nic_codes.nic5', value || '')}
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
                      <TextField
                        size="small"
                        label="Male"
                        fullWidth
                        value={businessClassificationFormik.values.number_of_persons_employed.male}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          businessClassificationFormik.setFieldValue('number_of_persons_employed.male', value);
                        }}
                        onBlur={() => {
                          businessClassificationFormik.setFieldValue(
                            'number_of_persons_employed.total',
                            businessClassificationFormik.values.number_of_persons_employed.male +
                              businessClassificationFormik.values.number_of_persons_employed.female +
                              businessClassificationFormik.values.number_of_persons_employed.others
                          );
                        }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 3 }}>
                      <TextField
                        size="small"
                        label="Female"
                        fullWidth
                        value={businessClassificationFormik.values.number_of_persons_employed.female}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          businessClassificationFormik.setFieldValue('number_of_persons_employed.female', value);
                        }}
                        onBlur={() => {
                          businessClassificationFormik.setFieldValue(
                            'number_of_persons_employed.total',
                            businessClassificationFormik.values.number_of_persons_employed.male +
                              businessClassificationFormik.values.number_of_persons_employed.female +
                              businessClassificationFormik.values.number_of_persons_employed.others
                          );
                        }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 3 }}>
                      <TextField
                        size="small"
                        label="Others"
                        fullWidth
                        value={businessClassificationFormik.values.number_of_persons_employed.others}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          businessClassificationFormik.setFieldValue('number_of_persons_employed.others', value);
                        }}
                        onBlur={() => {
                          businessClassificationFormik.setFieldValue(
                            'number_of_persons_employed.total',
                            businessClassificationFormik.values.number_of_persons_employed.male +
                              businessClassificationFormik.values.number_of_persons_employed.female +
                              businessClassificationFormik.values.number_of_persons_employed.others
                          );
                        }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 3 }}>
                      <TextField
                        size="small"
                        label="Total"
                        fullWidth
                        value={businessClassificationFormik.values.number_of_persons_employed.total}
                        disabled
                      />
                    </Grid2>
                  </Stack>
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<IconSave />}
                  color="primary"
                  onClick={businessClassificationFormik.handleSubmit}
                >
                  Save Business Classification
                </Button>
                <GetActionButtons
                  type="put"
                  data={sectionData?.tasks?.['Business Classification Inputs']}
                  status={sectionData?.tasks?.['Business Classification Inputs']?.data?.status}
                  urlEndpoint={`business-classification`}
                  recId={sectionData?.tasks?.['Business Classification Inputs']?.data?.id}
                  task_id={sectionData?.tasks?.['Business Classification Inputs']?.task_id}
                  service_id={service_id}
                  msme={true}
                />
              </Box>
            </>
          )}

          {/* Step 2: Financial + Location Details */}
          {step === 1 && (
            <>
              <FinancialLocationDetails
                plantNotApplicable={plantNotApplicable}
                setPlantNotApplicable={setPlantNotApplicable}
                turnoverFormik={turnoverFormik}
                addressFormik={addressFormik}
                registeredAddressUnitsData={registeredAddressUnitsData}
                setRegisteredAddressUnitsData={setRegisteredAddressUnitsData}
                service_id={service_id}
                sectionData={sectionData}
              />
            </>
          )}

          {/* Step 3: Review, Filing & Certificate */}
          {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
              <Stepper orientation="vertical" activeStep={reviewStep}>
                {reviewSteps.map((label, idx) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {reviewStep === 0 && (
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
                          <Typography variant="h5" mb={3} sx={{ textDecoration: 'underline' }}>
                            Upload Draft for Review
                          </Typography>
                          <Stack direction="row" spacing={2} mb={3}>
                            <Button variant="contained" size="small" onClick={() => document.getElementById('reviewDraftInput').click()}>
                              <input
                                id="reviewDraftInput"
                                type="file"
                                hidden
                                onChange={async (e) => {
                                  let type = reviewFilingCertificateData?.id ? 'put' : 'post';
                                  let urlEndpoint = reviewFilingCertificateData?.id
                                    ? `/msme/review-filing-certificate/${reviewFilingCertificateData?.id}/`
                                    : '/msme/review-filing-certificate/';
                                  const formData = new FormData();
                                  formData.append('service_request', service_id);
                                  formData.append('service_task', sectionData.tasks['Review Filing Certificate'].task_id);
                                  formData.append('draft_income_file', e.target.files[0]);
                                  formData.append('approval_status', 'pending');
                                  formData.append('filing_status', 'in progress');
                                  formData.append('status', 'in progress');
                                  const res = await Factory(type, urlEndpoint, formData, {});
                                  if (res.res.status_cd === 0) {
                                    setReviewFilingCertificateData({ ...reviewFilingCertificateData, data: { ...res.res.data } });
                                    enqueueSnackbar('Draft income tax computation saved successfully!', {
                                      variant: 'success',
                                      anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                    });
                                  } else {
                                    enqueueSnackbar('Error saving draft income tax computation.', {
                                      variant: 'error',
                                      anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                    });
                                  }
                                }}
                              />
                              Upload
                            </Button>
                            {reviewFilingCertificateData?.draft_income_file && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  if (reviewFilingCertificateData?.draft_income_file instanceof File) {
                                    window.open(URL.createObjectURL(reviewFilingCertificateData?.draft_income_file), '_blank');
                                  } else if (typeof reviewFilingCertificateData?.draft_income_file === 'string') {
                                    viewFile(reviewFilingCertificateData?.draft_income_file);
                                  }
                                }}
                              >
                                View
                              </Button>
                            )}
                          </Stack>
                          {console.log('reviewFilingCertificateData: ', reviewFilingCertificateData)}
                          <Box display="flex" justifyContent="flex-start" gap={1}>
                            <GetActionButtons
                              type="put"
                              data={sectionData?.tasks?.['Review Filing Certificate']}
                              status={sectionData?.tasks?.['Review Filing Certificate']?.data?.approval_status}
                              urlEndpoint={`review-filing-certificate`}
                              recId={reviewFilingCertificateData?.id}
                              task_id={sectionData?.tasks?.['Review Filing Certificate']?.task_id}
                              step={reviewStep}
                              filingHelper={true}
                              setReviewStep={setReviewStep}
                              msme={true}
                            />
                          </Box>
                        </Box>
                      )}
                      {reviewStep === 1 && (
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
                          <Typography variant="h5" mb={3} sx={{ textDecoration: 'underline' }}>
                            Upload Filed Acknowledgement
                          </Typography>
                          <Stack direction="row" spacing={2} mb={3}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => document.getElementById('draftIncomeTaxComputationInput').click()}
                            >
                              <input
                                id="draftIncomeTaxComputationInput"
                                type="file"
                                hidden
                                onChange={async (e) => {
                                  let type = reviewFilingCertificateData?.id ? 'put' : 'post';
                                  let urlEndpoint = reviewFilingCertificateData?.id
                                    ? `/msme/review-filing-certificate/${reviewFilingCertificateData?.id}/`
                                    : '/msme/review-filing-certificate/';
                                  const formData = new FormData();
                                  formData.append('service_request', service_id);
                                  formData.append('service_task', sectionData.tasks['Review Filing Certificate'].task_id);
                                  formData.append('review_certificate', e.target.files[0]);
                                  formData.append('filing_status', 'in progress');
                                  formData.append('status', 'in progress');
                                  const res = await Factory(type, urlEndpoint, formData, {});
                                  if (res.res.status_cd === 0) {
                                    console.log('res.res.data: ', res.res.data);
                                    setReviewFilingCertificateData({ ...res.res.data });
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
                            {reviewFilingCertificateData?.review_certificate && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  if (reviewFilingCertificateData?.review_certificate instanceof File) {
                                    window.open(URL.createObjectURL(reviewFilingCertificateData?.review_certificate), '_blank');
                                  } else if (typeof reviewFilingCertificateData?.review_certificate === 'string') {
                                    viewFile(reviewFilingCertificateData?.review_certificate);
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
                              data={sectionData?.tasks?.['Review Filing Certificate']}
                              status={sectionData?.tasks?.['Review Filing Certificate']?.data?.filing_status}
                              urlEndpoint={`review-filing-certificate`}
                              recId={reviewFilingCertificateData?.id}
                              task_id={sectionData?.tasks?.['Review Filing Certificate']?.task_id}
                              step={reviewStep}
                              setReviewStep={setReviewStep}
                              msme={true}
                              filingHelper={true}
                            />
                          </Box>
                        </Box>
                      )}
                      {reviewStep === 2 && (
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
                            <Typography variant="h5" mb={3} sx={{ textDecoration: 'underline' }}>
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
                            >
                              Download
                              <IconButton
                                size="small"
                                color="secondary"
                                sx={{ alignSelf: 'center', '&:hover': { backgroundColor: 'transparent' } }}
                              >
                                <DownloadIcon sx={{ width: { xs: 24, md: 24 }, height: { xs: 24, md: 24 } }} />
                              </IconButton>
                            </Button>
                          </Stack>
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
        </Paper>
        <Box display="flex" justifyContent={step === 1 ? 'space-between' : 'flex-end'} mt={2} gap={1}>
          {step > 0 && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => setStep((prev) => prev - 1)}
              startIcon={<IconArrowBack />}
            >
              Back
            </Button>
          )}
          {step < 2 && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setStep((prev) => prev + 1)}
              endIcon={<IconArrowForward />}
            >
              Continue
            </Button>
          )}
        </Box>
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
const FinancialLocationDetails = ({
  plantNotApplicable,
  setPlantNotApplicable,
  turnoverFormik,
  addressFormik,
  registeredAddressUnitsData,
  setRegisteredAddressUnitsData,
  service_id,
  sectionData
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [plantUnits, setPlantUnits] = React.useState([
    {
      id: null,
      unit_details: {
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

  const savePlantUnits = async (data, idx) => {
    let url = '/msme/location-of-plant-or-unit/';
    let type = 'post';
    let __data = {};
    if (data.id !== null) {
      url = url + data.id + '/';
      type = 'put';
    }
    delete data.id;
    __data.registered_address = registeredAddressUnitsData.id;
    __data.unit_details = data.unit_details;
    const response = await Factory(type, url, __data);
    if (response.res.status_cd === 0) {
      if (type === 'post') {
        let __plantUnits = [...plantUnits];
        __plantUnits[idx] = response.res;
        setPlantUnits(__plantUnits);
      }
      enqueueSnackbar('Plant Unit Details Saved', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Plant Unit Details Not Saved', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  useEffect(() => {
    if (registeredAddressUnitsData?.location_of_plant_or_unit.length > 0) {
      setPlantUnits(registeredAddressUnitsData.location_of_plant_or_unit);
    }
  }, [registeredAddressUnitsData]);

  return (
    <Box>
      {/* Task 3: Turnover & Investment Declaration */}
      <form onSubmit={turnoverFormik.handleSubmit} autoComplete="off">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Turnover & Investment Declaration</Typography>
          <RaiseRequest
            fields={[
              'Turnover in INR',
              'Investment in Plant & Machinery',
              'Have you filed ITR for previous year?',
              'Are you registered under GST?',
              'GST Certificate'
            ]}
            task_id={sectionData?.tasks?.['Turnover And InvestmentDeclaration']?.task_id}
          />
        </Box>
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
                value={turnoverFormik.values.turnover_in_inr.totalTurnover}
                onChange={(e) => {
                  turnoverFormik.setFieldValue('turnover_in_inr.totalTurnover', e.target.value);
                }}
              />
              <TextField
                size="small"
                label="Export Turnover"
                sx={{ minWidth: 160 }}
                name="exportTurnover"
                value={turnoverFormik.values.turnover_in_inr.exportTurnover}
                onChange={(e) => {
                  turnoverFormik.setFieldValue('turnover_in_inr.exportTurnover', e.target.value);
                }}
              />
              <TextField
                size="small"
                label="Net Domestic Turnover"
                sx={{ minWidth: 180 }}
                name="domesticTurnover"
                value={turnoverFormik.values.turnover_in_inr.domesticTurnover}
                onChange={(e) => {
                  turnoverFormik.setFieldValue('turnover_in_inr.domesticTurnover', e.target.value);
                }}
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
              name="investment_in_plant_and_machinery"
              value={turnoverFormik.values.investment_in_plant_and_machinery}
              onChange={(e) => {
                turnoverFormik.setFieldValue('investment_in_plant_and_machinery', e.target.value);
              }}
            />
          </Grid2>
          {/* ITR for previous year */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Have you filed ITR for previous year?</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <RadioGroup
              row
              name="have_you_filed_itr_previous_year"
              value={turnoverFormik.values.have_you_filed_itr_previous_year}
              onChange={turnoverFormik.handleChange}
            >
              <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
            </RadioGroup>
          </Grid2>
          {/* Registered under GST */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Are you registered under GST?</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction="row" spacing={2}>
              <RadioGroup
                row
                name="are_you_registered_under_gst"
                value={turnoverFormik.values.are_you_registered_under_gst}
                onChange={turnoverFormik.handleChange}
              >
                <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                <FormControlLabel value="exempted" control={<Radio color="primary" />} label="Exempted" />
              </RadioGroup>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack direction="row" spacing={2}>
              {turnoverFormik.touched.are_you_registered_under_gst && turnoverFormik.errors.are_you_registered_under_gst && (
                <Typography color="error" variant="caption">
                  {turnoverFormik.errors.are_you_registered_under_gst}
                </Typography>
              )}
              {turnoverFormik.values.are_you_registered_under_gst === 'yes' && (
                <>
                  <input
                    id="gstInput"
                    type="file"
                    hidden
                    onChange={(e) => turnoverFormik.setFieldValue('gst_certificate', e.target.files[0])}
                  />
                  <Button size="small" variant="contained" onClick={() => document.getElementById('gstInput').click()}>
                    Upload GST Certificate
                  </Button>
                  {turnoverFormik.values.gst_certificate && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (turnoverFormik.values.gst_certificate instanceof File) {
                          const url = URL.createObjectURL(turnoverFormik.values.gst_certificate);
                          window.open(url, '_blank');
                        } else {
                          viewFile(turnoverFormik.values.gst_certificate);
                        }
                      }}
                    >
                      View
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </Grid2>
        </Grid2>
        <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
          <Button type="submit" size="medium" variant="contained" color="primary">
            Save Turnover & Investment
          </Button>
          <GetActionButtons
            type="put"
            data={sectionData?.tasks?.['Turnover And InvestmentDeclaration']}
            status={sectionData?.tasks?.['Turnover And InvestmentDeclaration']?.data?.status}
            urlEndpoint={`turnover-details`}
            recId={sectionData?.tasks?.['Turnover And InvestmentDeclaration']?.data?.id}
            task_id={sectionData?.tasks?.['Turnover And InvestmentDeclaration']?.task_id}
            service_id={service_id}
            msme={true}
          />
        </Box>
      </form>
      <Divider sx={{ my: 2 }} />
      {/* Task 4: Registered Address & Units */}
      <form onSubmit={addressFormik.handleSubmit} autoComplete="off">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={2}>
          <Typography variant="h4">Registered Address & Units</Typography>
          <RaiseRequest
            fields={[
              'Official address of enterprise',
              'Bank statement/Cancelled Cheque',
              'Official address proof',
              'Location of the enterprise'
            ]}
            task_id={sectionData?.tasks?.['Registered Address']?.task_id}
          />
        </Box>
        <Grid2 container spacing={2} mb={2}>
          {/* Official address of enterprise */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Official address of enterprise</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Flat/Door/Block No"
                  name="flat"
                  value={addressFormik.values.official_address_of_enterprise.flat}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.flat', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name of Premise/Building"
                  name="building"
                  value={addressFormik.values.official_address_of_enterprise.building}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.building', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Road/Street/Lane"
                  name="street"
                  value={addressFormik.values.official_address_of_enterprise.street}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.street', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Village/Town"
                  name="village"
                  value={addressFormik.values.official_address_of_enterprise.village}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.village', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="City"
                  name="city"
                  value={addressFormik.values.official_address_of_enterprise.city}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.city', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="District"
                  name="district"
                  value={addressFormik.values.official_address_of_enterprise.district}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.district', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="State"
                  name="state"
                  value={addressFormik.values.official_address_of_enterprise.state}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.state', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Pin Code"
                  name="pin"
                  value={addressFormik.values.official_address_of_enterprise.pin}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.pin', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Latitude"
                  name="lat"
                  value={addressFormik.values.official_address_of_enterprise.lat}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.lat', e.target.value);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Longitude"
                  name="lng"
                  value={addressFormik.values.official_address_of_enterprise.lng}
                  onChange={(e) => {
                    addressFormik.setFieldValue('official_address_of_enterprise.lng', e.target.value);
                  }}
                />
              </Grid2>
            </Grid2>
          </Grid2>
          {/* Bank statement/Cancelled Cheque */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Bank statement/Cancelled Cheque</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <Button size="small" variant="contained" color="primary" component="label">
              Upload
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    addressFormik.setFieldValue('bank_statement_or_cancelled_cheque', e.target.files[0]);
                  }
                }}
              />
            </Button>
            {addressFormik.values.bank_statement_or_cancelled_cheque && (
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 2, textTransform: 'none', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                onClick={() => {
                  if (addressFormik.values.bank_statement_or_cancelled_cheque instanceof File) {
                    const url = URL.createObjectURL(addressFormik.values.bank_statement_or_cancelled_cheque);
                    window.open(url, '_blank');
                  } else {
                    viewFile(addressFormik.values.bank_statement_or_cancelled_cheque);
                  }
                }}
              >
                View
              </Button>
            )}
          </Grid2>
          {/* Official address proof */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
            <Typography varient="subtitle1">Official address proof (Rental agreement/Utility bill)</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
            <Button size="small" variant="contained" color="primary" component="label">
              Upload
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    addressFormik.setFieldValue('official_address_of_proof', e.target.files[0]);
                  }
                }}
              />
            </Button>
            {addressFormik.values.official_address_of_proof && (
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 2, textTransform: 'none', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                onClick={() => {
                  if (addressFormik.values.official_address_of_proof instanceof File) {
                    const url = URL.createObjectURL(addressFormik.values.official_address_of_proof);
                    window.open(url, '_blank');
                  } else {
                    viewFile(addressFormik.values.official_address_of_proof);
                  }
                }}
              >
                View
              </Button>
            )}
          </Grid2>
        </Grid2>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" size="small" variant="contained" color="primary">
            Save Registered Address
          </Button>
        </Box>
      </form>

      {/* Location of Plant/Unit */}
      <form autoComplete="off">
        <Stack direction="row" spacing={2} mb={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h4">Location of Plant/Unit</Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={registeredAddressUnitsData.location_of_plant === 'yes'}
                onChange={async (e) => {
                  let url = '/msme/registration-address-details/';
                  let type = 'post';
                  if (registeredAddressUnitsData.id !== null) {
                    url = url + registeredAddressUnitsData.id + '/';
                    type = 'put';
                  }
                  const formData = new FormData();
                  formData.append('service_request', service_id);
                  formData.append('service_task', sectionData.tasks['Registered Address'].task_id);
                  formData.append('status', 'in progress');
                  formData.append('location_of_plant', e.target.checked ? 'yes' : 'no');
                  const response = await Factory(type, url, formData);
                  if (response.res.status_cd === 0) {
                    setRegisteredAddressUnitsData(response.res.data);
                  }
                }}
              />
            }
            label="Location of Plant/Unit Applicable"
          />
        </Stack>

        {registeredAddressUnitsData.location_of_plant === 'yes' &&
          plantUnits.map((unit, idx) => (
            <Box key={idx} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2, bgcolor: '#f8fafc' }}>
              <Typography variant="subtitle1" mb={2}>
                Plant/Unit {idx + 1}
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Unit Name"
                    name="unitName"
                    value={unit?.unit_details?.unitName}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.unitName = e.target.value;
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
                    value={unit?.unit_details?.flat}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.flat = e.target.value;
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
                    value={unit?.unit_details?.building}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.building = e.target.value;
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
                    value={unit?.unit_details?.village}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.village = e.target.value;
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
                    value={unit?.unit_details?.street}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.street = e.target.value;
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
                    value={unit?.unit_details?.city}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.city = e.target.value;
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
                    value={unit?.unit_details?.district}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.district = e.target.value;
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
                    value={unit?.unit_details?.state}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.state = e.target.value;
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
                    value={unit?.unit_details?.pin}
                    onChange={(e) => {
                      const newUnits = [...plantUnits];
                      newUnits[idx].unit_details.pin = e.target.value;
                      setPlantUnits(newUnits);
                    }}
                  />
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button type="button" size="small" variant="contained" color="primary" onClick={() => savePlantUnits(unit, idx)}>
                  Save Plant/Unit Location
                </Button>
              </Box>
            </Box>
          ))}
        {registeredAddressUnitsData.location_of_plant === 'yes' && (
          <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() =>
                setPlantUnits([
                  ...plantUnits,
                  {
                    id: null,
                    unit_details: {
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
                  }
                ])
              }
            >
              Add Plant/Unit
            </Button>
            <GetActionButtons
              type="put"
              data={sectionData?.tasks?.['Registered Address']}
              status={sectionData?.tasks?.['Registered Address']?.data?.status}
              urlEndpoint={`registration-address-details`}
              recId={sectionData?.tasks?.['Registered Address']?.data?.id}
              task_id={sectionData?.tasks?.['Registered Address']?.task_id}
              service_id={service_id}
              msme={true}
            />
          </Box>
        )}
      </form>
    </Box>
  );
};

export default MSMEDashboard;
