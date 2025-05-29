import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid2,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Checkbox
} from '@mui/material';
import Factory from 'utils/Factory';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IncomeDetails from './IncomeDetails';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useSearchParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FileListDialog from './FileListDialog';
import { useSnackbar } from 'notistack';
import GetActionButtons from '../FormHelpers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import Avatar from '@mui/material/Avatar';

const steps = ['Personal Info', 'Income Details', 'Deductions', 'Review & Filing'];

const getFileName = (file) => {
  if (typeof file === 'string' && file.startsWith('http')) {
    return file.split('/').pop();
  }
  return file.name;
};
// Add validation schemas
const personalInfoSchema = Yup.object().shape({
  pan: Yup.mixed().required('PAN is required'),
  aadhar: Yup.mixed().required('Aadhaar is required'),
  mobile_number: Yup.string()
    .required('Mobile is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  first_name: Yup.string().nullable(),
  middle_name: Yup.string(),
  last_name: Yup.string().required('Last name is required'),
  gender: Yup.string().required('Gender is required'),
  residentail_status: Yup.string().required('Residential status is required'),
  status: Yup.string(),
  non_resident_indian: Yup.string().nullable(),
  salary_income: Yup.string().nullable(),
  other_income: Yup.string().nullable(),
  foreign_income: Yup.string().nullable(),
  house_property_income: Yup.string().nullable(),
  interest_income: Yup.string().nullable(),
  dividend_income: Yup.string().nullable(),
  gift_income: Yup.string().nullable(),
  family_pension_income: Yup.string().nullable(),
  agriculture_income: Yup.string().nullable(),
  winning_income: Yup.string().nullable(),
  service_request: Yup.number().nullable(),
  service_task: Yup.number().nullable(),
  assignee: Yup.number().nullable(),
  reviewer: Yup.number().nullable()
});
const taxPaidSchema = Yup.object().shape({
  as26File: Yup.mixed().required('26AS is required'),
  aisFile: Yup.mixed().required('AIS is required')
});

// Add validation schemas for Donations, Investments, Mediclaim
const donationsSchema = Yup.object().shape({
  donations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().nullable(),
      amount: Yup.number().typeError('Amount must be a number').positive('Amount must be positive'),
      mode: Yup.string(),
      receipt: Yup.mixed()
    })
  )
});

const investmentsSchema = Yup.object().shape({
  investments: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().nullable(),
      amount: Yup.number().typeError('Amount must be a number').positive('Amount must be positive'),
      doc: Yup.mixed()
    })
  )
});

const mediclaimSchema = Yup.object()
  .shape({
    selfFamily: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    selfSenior: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    parents: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    parentsSenior: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    checkup: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    receipts: Yup.array().notRequired()
  })
  .test('at-least-one', 'At least one amount is required', (values) => {
    return values.selfFamily || values.selfSenior || values.parents || values.parentsSenior || values.checkup;
  });

export default function ITR() {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const [step, setStep] = React.useState(0);
  const [tasks, setTasks] = React.useState([]);
  const [personalInfo, setPersonalInfo] = React.useState({
    id: null,
    pan: null,
    aadhar: null,
    mobile_number: '',
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    residentail_status: '',
    status: '',
    non_resident_indian: null,
    salary_income: null,
    other_income: null,
    foreign_income: null,
    house_property_income: null,
    interest_income: null,
    dividend_income: null,
    gift_income: null,
    family_pension_income: null,
    agriculture_income: null,
    winning_income: null,
    service_request: null,
    service_task: null,
    assignee: null,
    reviewer: null
  });
  const [taxPaidDetails, setTaxPaidDetails] = useState({
    id: null,
    task_id: null,
    as26File: null,
    aisFile: null,
    challans: []
  });
  const [incomeDetails, setIncomeDetails] = React.useState([]);
  const [donations, setDonations] = React.useState([{ name: '', amount: '', mode: '', receipt: null }]);
  const [eduLoan, setEduLoan] = React.useState({ amount: '', educationOf: '', borrower: '', approved: 'no' });
  const [savings, setSavings] = React.useState({ savings: '', fdrd: '' });
  const [disability, setDisability] = React.useState({ nature: '', severity: '', amount: '', cert: null });
  const [rentHra, setRentHra] = React.useState({ paid: 'no', amount: '' });
  const [firstHome, setFirstHome] = React.useState({ isFirst: 'no', interest: '', date: '' });
  const [political, setPolitical] = React.useState({ donated: 'no', amount: '' });
  const donationModes = ['Cash', 'Cheque', 'Bank'];
  const educationOfOptions = ['Self', 'Spouse', 'Children', 'Dependent'];
  const disabilityNature = [
    'Blindness',
    'Low vision',
    'Leprosy-cured',
    'Hearing impairment',
    'Locomotor disability',
    'Mental illness',
    'Others'
  ];
  const disabilitySeverity = ['40%-80%', '>80%'];
  const [investments, setInvestments] = React.useState([{ type: '', amount: '', doc: null }]);
  const [mediclaim, setMediclaim] = React.useState({
    selfFamily: '',
    selfSenior: '',
    parents: '',
    parentsSenior: '',
    checkup: '',
    receipts: []
  });
  const investmentTypes = ['PPF', 'NSC', 'ELSS', 'Life Insurance', 'Tuition Fees', 'Others'];
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [dialogFilesData, setDialogFilesData] = useState([]);
  const [otherDeductions, setOtherDeductions] = useState({
    eduLoanAmount: '',
    eduLoanEducationOf: '',
    eduLoanBorrower: '',
    eduLoanApproved: 'no',
    savingsInterest: '',
    fdInterest: '',
    disabilityNature: '',
    disabilitySeverity: '',
    disabilityAmount: '',
    disabilityCert: null,
    rentHraPaid: 'no',
    rentHraAmount: '',
    firstHomeIsFirst: 'no',
    firstHomeInterest: '',
    firstHomeDate: '',
    politicalDonated: 'no',
    politicalAmount: ''
  });

  const personalInfoFormikRef = useRef();
  const taxPaidFormikRef = useRef();

  const incomeSectionOptions = [
    { label: 'Salary Income', value: 'salary' },
    { label: 'House Property Income', value: 'house' },
    { label: 'Capital Gains Income', value: 'capital' },
    { label: 'Business/Professional Income', value: 'business' },
    { label: 'Other Income', value: 'other' },
    { label: 'Agriculture Income', value: 'agriculture' }
  ];
  const [selectedIncomeSections, setSelectedIncomeSections] = useState(['salary', 'house', 'capital', 'business', 'other', 'agriculture']);

  // Map for accordion titles and types
  const incomeAccordionMap = {
    salary_income: {
      label: 'Salary Income',
      type: 'salary',
      icon: (
        <Avatar sx={{ bgcolor: '#f1f1f1', width: 32, height: 32, mr: 1 }}>
          <AttachMoneyIcon />
        </Avatar>
      )
    },
    house_property_income: {
      label: 'House Property Income',
      type: 'house',
      icon: (
        <Avatar sx={{ bgcolor: '#f1f1f1', width: 32, height: 32, mr: 1 }}>
          <HomeIcon />
        </Avatar>
      )
    },
    capital_gains: {
      label: 'Capital Gains Income',
      type: 'capital',
      icon: (
        <Avatar sx={{ bgcolor: '#f1f1f1', width: 32, height: 32, mr: 1 }}>
          <TrendingUpIcon />
        </Avatar>
      )
    },
    business_income: {
      label: 'Business/Professional Income',
      type: 'business',
      icon: (
        <Avatar sx={{ bgcolor: '#f1f1f1', width: 32, height: 32, mr: 1 }}>
          <BusinessCenterIcon />
        </Avatar>
      )
    },
    other_income: {
      label: 'Other Income',
      type: 'other',
      icon: (
        <Avatar sx={{ bgcolor: '#f1f1f1', width: 32, height: 32, mr: 1 }}>
          <AccountBalanceWalletIcon />
        </Avatar>
      )
    },
    agriculture_income: {
      label: 'Agriculture Income',
      type: 'agriculture',
      icon: (
        <Avatar sx={{ bgcolor: '#f1f1f1', width: 32, height: 32, mr: 1 }}>
          <AgricultureIcon />
        </Avatar>
      )
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  const getStep1Data = async (step) => {
    const response = await Factory(
      'get',
      `/income_tax_returns/service-request-section-data?service_request_id=${service_id}&section=personal_info`
    );
    if (response.res.status_cd === 0) {
      setTasks(response.res.data.tasks_data);
      setPersonalInfo(response.res.data.tasks_data['Personal Information'].data);
      setTaxPaidDetails({
        task_id: response.res.data.tasks_data['Tax Paid Details'].task_id || null,
        id: response.res.data.tasks_data['Tax Paid Details'].data?.id || null,
        as26File: {
          name:
            response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['26AS'].files?.length > 0
              ? response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['26AS'].files[0].url
              : null
        },
        aisFile: {
          name:
            response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['AIS'].files?.length > 0
              ? response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['AIS'].files[0].url
              : null
        },
        challans: response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['AdvanceTax'].files || []
      });
    }
  };

  const getStep2Data = async (step) => {
    const response = await Factory(
      'get',
      `/income_tax_returns/service-request-section-data?service_request_id=${service_id}&section=income_details`
    );
    if (response.res.status_cd === 0) {
      setIncomeDetails(response.res.data.tasks_data);
    } else {
      setIncomeDetails([]);
    }
  };

  // useEffect(() => {
  //   if (service_id) {
  //     getServiceTasks(service_id);
  //     // fetchITRDetails();
  //   }
  // }, [service_id]);

  useEffect(() => {
    if (step === 0) getStep1Data(service_id);
    if (step === 1) getStep2Data(service_id);
  }, [step]);

  const handleOpenFileDialog = (files, title) => {
    setFileDialogOpen(true);
  };

  return (
    <Card sx={{ minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Typography variant="h3" mb={0.5}>
        Income Tax Return (ITR)
      </Typography>
      <Typography variant="caption" color="text.secondary">
        File your ITR in a few easy steps.
      </Typography>
      <Box maxWidth="1100px" mx="auto" sx={{ mt: 2 }}>
        <Paper elevation={0} sx={{ bgcolor: '#eef2f6', p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700 }}>
          {/* Stepper */}
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 4 }}>
            {steps.map((label, idx) => (
              <React.Fragment key={label}>
                <Box
                  sx={{
                    width: 220,
                    px: 1,
                    py: 1.2,
                    bgcolor: idx === step ? 'primary.main' : '#fff',
                    color: idx === step ? '#fff' : 'text.secondary',
                    border: idx === step ? 'none' : '1.5px solid #697586',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 16,
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    display: 'inline-block',
                    lineHeight: 1.5,
                    cursor: 'pointer'
                  }}
                  onClick={() => setStep(idx)}
                >
                  {label}
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
          {/* Step 1: Personal Info */}
          {step === 0 && (
            <Box>
              {/* Personal Info Card */}
              <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" fontWeight={700} mb={2}>
                  <span style={{ textDecoration: 'underline' }}>Personal Information</span>
                </Typography>
                <Formik
                  innerRef={personalInfoFormikRef}
                  initialValues={personalInfo}
                  validationSchema={personalInfoSchema}
                  enableReinitialize
                  onSubmit={async (values) => {
                    let type;
                    let url = `/income_tax_returns/personal-information/`;
                    if (personalInfo.id) {
                      type = 'put';
                      url = url + `${personalInfo.id}/`;
                    } else {
                      type = 'post';
                    }
                    const formData = new FormData();
                    Object.entries(values).forEach(([key, value]) => {
                      if (key === 'pan' || key === 'aadhar') {
                        if (value instanceof File) {
                          formData.append(key, value);
                        }
                        // If value is a string (URL), do not append
                      } else {
                        formData.append(key, value ?? '');
                      }
                    });
                    formData.append('status', 'in progress');
                    if (type === 'put') formData.append('id', personalInfo.id);
                    const res = await Factory(type, url, formData, {});
                    if (res.res.status_cd === 0) {
                      enqueueSnackbar('Personal Information saved successfully!', {
                        variant: 'success',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' }
                      });
                      setPersonalInfo(res.res.data);
                    } else {
                      enqueueSnackbar('Error saving personal info.', {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' }
                      });
                      console.log('Error saving personal info.');
                    }
                  }}
                >
                  {({ setFieldValue, setFieldTouched, setTouched, values, errors, touched, handleSubmit }) => (
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setTouched(
                          Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
                          true
                        );
                        handleSubmit(e);
                      }}
                    >
                      <Grid2 container spacing={2} alignItems="center">
                        {/* Upload PAN */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Upload PAN</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={values.pan ? getFileName(values.pan) : ''}
                            placeholder="Upload PAN"
                            InputProps={{ readOnly: true }}
                            onClick={() => document.getElementById('panFileInput').click()}
                            error={Boolean(touched.pan && errors.pan)}
                            helperText={touched.pan && errors.pan ? errors.pan : ' '}
                          />
                          <input
                            id="panFileInput"
                            type="file"
                            hidden
                            onChange={(e) => {
                              setFieldValue('pan', e.target.files[0]);
                              setFieldTouched('pan', true, true);
                            }}
                          />
                        </Grid2>
                        {/* Upload Aadhaar */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Upload Aadhaar</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={values.aadhar ? getFileName(values.aadhar) : ''}
                            placeholder="Upload Aadhaar"
                            InputProps={{ readOnly: true }}
                            onClick={() => document.getElementById('aadhaarFileInput').click()}
                            error={Boolean(touched.aadhar && errors.aadhar)}
                            helperText={touched.aadhar && errors.aadhar ? errors.aadhar : ' '}
                          />
                          <input
                            id="aadhaarFileInput"
                            type="file"
                            hidden
                            onChange={(e) => {
                              setFieldValue('aadhar', e.target.files[0]);
                              setFieldTouched('aadhar', true, true);
                            }}
                          />
                        </Grid2>
                        {/* Mobile number */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Mobile number</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Field
                            as={TextField}
                            size="small"
                            fullWidth
                            name="mobile_number"
                            value={values.mobile_number || ''}
                            error={Boolean(touched.mobile_number && errors.mobile_number)}
                            helperText={<ErrorMessage name="mobile_number" />}
                          />
                        </Grid2>
                        {/* Email Id */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Email Id</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Field
                            as={TextField}
                            size="small"
                            fullWidth
                            name="email"
                            value={values.email || ''}
                            error={Boolean(touched.email && errors.email)}
                            helperText={<ErrorMessage name="email" />}
                          />
                        </Grid2>
                        {/* Name (3 fields) */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Name</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} container spacing={1}>
                          <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Field
                              as={TextField}
                              size="small"
                              fullWidth
                              name="first_name"
                              placeholder="First"
                              value={values.first_name || ''}
                              error={Boolean(touched.first_name && errors.first_name)}
                              helperText={<ErrorMessage name="first_name" />}
                            />
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Field
                              as={TextField}
                              size="small"
                              fullWidth
                              name="middle_name"
                              placeholder="Middle"
                              value={values.middle_name || ''}
                            />
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Field
                              as={TextField}
                              size="small"
                              fullWidth
                              name="last_name"
                              placeholder="Last"
                              value={values.last_name || ''}
                            />
                          </Grid2>
                        </Grid2>
                        {/* Gender */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Gender</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <RadioGroup row value={values.gender} onChange={(e) => setFieldValue('gender', e.target.value)}>
                            <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                            <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                          </RadioGroup>
                          {touched.gender && errors.gender && (
                            <Typography color="error" variant="caption">
                              {errors.gender}
                            </Typography>
                          )}
                        </Grid2>
                        {/* Residential Status */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Residential Status</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Autocomplete
                            size="small"
                            fullWidth
                            options={['Resident', 'Non-Resident', 'Resident but Not Ordinarily Resident']}
                            value={values.residentail_status || ''}
                            onChange={(e, value) => setFieldValue('residentail_status', value || '')}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select status"
                                error={Boolean(touched.residentail_status && errors.residentail_status)}
                                helperText={touched.residentail_status && errors.residentail_status ? errors.residentail_status : ' '}
                              />
                            )}
                          />
                        </Grid2>
                      </Grid2>
                      {/* Income Details Section Checkboxes */}
                      <Box mt={4} mb={2}>
                        <Typography variant="h5" fontWeight={700} mb={0.5}>
                          <span style={{ textDecoration: 'underline' }}>Income Details</span>
                        </Typography>
                        <Typography variant="caption" mb={2}>
                          Select the income sections you want to include in the ITR.
                        </Typography>
                        <Grid2 container alignItems="center">
                          {incomeSectionOptions.map((option) => {
                            // Map to correct backend field names
                            let fieldName = option.value + '_income';
                            if (option.value === 'house') fieldName = 'house_property_income';
                            if (option.value === 'capital') fieldName = 'capital_gains';
                            if (option.value === 'nri') fieldName = 'non_resident_indian';
                            return (
                              <Grid2 size={{ xs: 6, sm: 4, md: 3 }} key={option.value}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values[fieldName] === 'yes'}
                                      onChange={(e) => setFieldValue(fieldName, e.target.checked ? 'yes' : null)}
                                    />
                                  }
                                  label={option.label}
                                />
                              </Grid2>
                            );
                          })}
                        </Grid2>
                      </Box>
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button type="submit" variant="contained" color="primary">
                          Save Personal Info
                        </Button>
                        <GetActionButtons
                          data={personalInfo}
                          status={personalInfo.status}
                          urlEndpoint="personal-information"
                          taskId={personalInfo.id}
                          setData={setPersonalInfo}
                        />
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Card>
              {/* Tax Paid Details Card */}
              <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
                <Formik
                  innerRef={taxPaidFormikRef}
                  initialValues={taxPaidDetails}
                  enableReinitialize
                  onSubmit={async (values) => {
                    const formData = new FormData();
                    setTaxPaidDetails(values);
                    formData.append('service_request', service_id);
                    formData.append('service_task', taxPaidDetails.task_id);
                    formData.append('status', 'in progress');
                    if (values.as26File && values.as26File instanceof File) {
                      formData.append('form26as_files', values.as26File);
                    }
                    if (values.aisFile && values.aisFile instanceof File) {
                      formData.append('ais_files', values.aisFile);
                    }
                    if (values.challans && Array.isArray(values.challans)) {
                      values.challans.forEach((challan) => {
                        if (challan instanceof File) {
                          formData.append('advance_tax_files', challan);
                        }
                      });
                    }
                    try {
                      const res = await Factory('post', '/income_tax_returns/tax-paid-details/create-or-update/', formData, {});
                      if (res.res.status_cd === 0) {
                        enqueueSnackbar('Tax paid details saved successfully!', {
                          variant: 'success',
                          anchorOrigin: { vertical: 'top', horizontal: 'right' }
                        });
                      } else {
                        enqueueSnackbar('Error saving tax paid details.', {
                          variant: 'error',
                          anchorOrigin: { vertical: 'top', horizontal: 'right' }
                        });
                      }
                    } catch (err) {
                      enqueueSnackbar('Error saving tax paid details.', {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' }
                      });
                    }
                  }}
                >
                  {({ setFieldValue, values, errors, touched }) => (
                    <Form>
                      <Typography variant="h5" fontWeight={700} mb={2}>
                        <span style={{ textDecoration: 'underline' }}>Tax Paid Details</span>
                      </Typography>
                      <Grid2 container spacing={2} alignItems="center">
                        {/* Upload 26AS */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Upload 26AS</Typography>
                        </Grid2>
                        {console.log(values.as26File)}
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={values.as26File ? getFileName(values.as26File) : ''}
                            placeholder="Upload 26AS"
                            InputProps={{ readOnly: true }}
                            onClick={() => document.getElementById('as26FileInput').click()}
                            error={Boolean(touched.as26File && errors.as26File)}
                            helperText={touched.as26File && errors.as26File ? errors.as26File : ' '}
                          />
                          <input id="as26FileInput" type="file" hidden onChange={(e) => setFieldValue('as26File', e.target.files[0])} />
                        </Grid2>
                        {/* Upload AIS */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Upload AIS</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={values.aisFile ? getFileName(values.aisFile) : ''}
                            placeholder="Upload AIS"
                            InputProps={{ readOnly: true }}
                            onClick={() => document.getElementById('aisFileInput').click()}
                            error={Boolean(touched.aisFile && errors.aisFile)}
                            helperText={touched.aisFile && errors.aisFile ? errors.aisFile : ' '}
                          />
                          <input id="aisFileInput" type="file" hidden onChange={(e) => setFieldValue('aisFile', e.target.files[0])} />
                        </Grid2>
                        {/* Advance tax / Self Assisted Tax Challan */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Advance tax / Self Assisted Tax Challan</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <input
                              id="challanInputNew"
                              type="file"
                              hidden
                              multiple={true}
                              onChange={(e) => {
                                if (e.target.files[0]) setFieldValue('challans', [...values.challans, ...e.target.files]);
                              }}
                            />
                            <Button size="small" variant="contained" onClick={() => document.getElementById('challanInputNew').click()}>
                              Upload
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setFileDialogOpen(true);
                                setDialogFilesData(values.challans);
                              }}
                            >
                              View
                            </Button>
                          </Box>
                        </Grid2>
                      </Grid2>
                      <Box display="flex" justifyContent="flex-end" mt={0} gap={2}>
                        <Button type="submit" variant="contained" color="primary">
                          Save Tax Paid Details
                        </Button>
                        <GetActionButtons
                          data={taxPaidDetails}
                          status={taxPaidDetails.status}
                          urlEndpoint="taxPaid"
                          taskId={taxPaidDetails.task_id}
                        />
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Card>
              <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
                {/* No Back button on first step */}
                <Button variant="contained" color="primary" onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 2: Income Details Accordions */}
          {step === 1 && (
            <Box>
              {Object.keys(incomeDetails).map((section) => (
                <Accordion key={section}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center">
                      {incomeAccordionMap[section].icon}
                      <Typography variant="h4" sx={{ fontWeight: 300 }}>
                        {incomeAccordionMap[section].label}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0'}}>
                      <IncomeDetails
                        service_id={service_id}
                        data={incomeDetails}
                        setData={setIncomeDetails}
                        type={incomeAccordionMap[section].type}
                        fileDialogOpen={fileDialogOpen}
                        setFileDialogOpen={setFileDialogOpen}
                        dialogFilesData={dialogFilesData}
                        setDialogFilesData={setDialogFilesData}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Box display="flex" justifyContent="space-between" mt={4} gap={2}>
                <Button variant="outlined" color="primary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {/* Deductions Step */}
          {step === 2 && (
            <Box>
              {/* Section 80G - Donations */}
              <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" mb={2} sx={{ textDecoration: 'underline' }}>
                  Section 80G - Deduction for Donations made
                </Typography>
                <Formik
                  initialValues={{ donations }}
                  enableReinitialize
                  validationSchema={donationsSchema}
                  onSubmit={(values) => {
                    const formData = new FormData();
                    values.donations.forEach((donation, idx) => {
                      formData.append(`donations[${idx}][name]`, donation.name || '');
                      formData.append(`donations[${idx}][amount]`, donation.amount || '');
                      formData.append(`donations[${idx}][mode]`, donation.mode || '');
                      if (donation.receipt) {
                        formData.append(`donations[${idx}][receipt]`, donation.receipt);
                      }
                    });
                    for (let pair of formData.entries()) {
                      console.log(pair[0] + ':', pair[1]);
                    }
                  }}
                >
                  {({ values, setFieldValue, errors }) => (
                    <Form>
                      {values.donations.map((row, idx) => (
                        <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                          <Grid2 container spacing={2} alignItems="center">
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                              <TextField
                                size="small"
                                fullWidth
                                label="Name of Donee"
                                value={row.name}
                                onChange={(e) => {
                                  const newArr = [...values.donations];
                                  newArr[idx].name = e.target.value;
                                  setFieldValue('donations', newArr);
                                }}
                                error={Boolean(errors.donations?.[idx]?.name)}
                                helperText={errors.donations?.[idx]?.name}
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                              <TextField
                                size="small"
                                fullWidth
                                label="Amount"
                                value={row.amount}
                                onChange={(e) => {
                                  const newArr = [...values.donations];
                                  newArr[idx].amount = e.target.value;
                                  setFieldValue('donations', newArr);
                                }}
                                error={Boolean(errors.donations?.[idx]?.amount)}
                                helperText={errors.donations?.[idx]?.amount}
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                              <Autocomplete
                                size="small"
                                fullWidth
                                options={donationModes}
                                value={row.mode}
                                onChange={(_, v) => {
                                  const newArr = [...values.donations];
                                  newArr[idx].mode = v;
                                  setFieldValue('donations', newArr);
                                }}
                                renderInput={(params) => <TextField {...params} label="Mode" />}
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                              <Button size="small" variant="contained" component="label">
                                Upload
                                <input
                                  type="file"
                                  hidden
                                  onChange={(e) => {
                                    const newArr = [...values.donations];
                                    newArr[idx].receipt = e.target.files[0];
                                    setFieldValue('donations', newArr);
                                  }}
                                />
                              </Button>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 1 }} display="flex" justifyContent="flex-end">
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  const formData = new FormData();
                                  formData.append('name', row.name || '');
                                  formData.append('amount', row.amount || '');
                                  formData.append('mode', row.mode || '');
                                  if (row.receipt) {
                                    formData.append('receipt', row.receipt);
                                  }
                                  for (let pair of formData.entries()) {
                                    console.log(pair[0] + ':', pair[1]);
                                  }
                                }}
                              >
                                Save
                              </Button>
                            </Grid2>
                            {values.donations.length > 1 && (
                              <Grid2 size={{ xs: 12, sm: 6, md: 1 }} display="flex" justifyContent="flex-end">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const newArr = values.donations.filter((_, i) => i !== idx);
                                    setFieldValue('donations', newArr);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid2>
                            )}
                          </Grid2>
                        </Paper>
                      ))}
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            setFieldValue('donations', [...values.donations, { name: '', amount: '', mode: '', receipt: null }])
                          }
                        >
                          Add Row
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Card>

              {/* Section 80E, 80TTA/80TTB, 80U, and Other Deductions Combined */}
              <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
                <Formik
                  initialValues={otherDeductions}
                  enableReinitialize
                  onSubmit={async (values) => {
                    setOtherDeductions(values);
                    // TODO: Save logic for all combined deductions here
                  }}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      {/* Section 80E - Interest on Education Loan */}
                      <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                        Section 80E - Interest on Education Loan
                      </Typography>
                      <Grid2 container spacing={2} alignItems="center" mb={2}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Amount"
                            name="eduLoanAmount"
                            value={values.eduLoanAmount}
                            onChange={(e) => setFieldValue('eduLoanAmount', e.target.value)}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                          <Autocomplete
                            size="small"
                            fullWidth
                            options={educationOfOptions}
                            value={values.eduLoanEducationOf}
                            onChange={(_, v) => setFieldValue('eduLoanEducationOf', v)}
                            renderInput={(params) => <TextField {...params} label="Education of" />}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Borrower Name"
                            name="eduLoanBorrower"
                            value={values.eduLoanBorrower}
                            onChange={(e) => setFieldValue('eduLoanBorrower', e.target.value)}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Is it an approved Bank/NBFC?</Typography>
                          <RadioGroup row value={values.eduLoanApproved} onChange={(_, v) => setFieldValue('eduLoanApproved', v)}>
                            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                          </RadioGroup>
                        </Grid2>
                      </Grid2>

                      {/* Section 80TTA/80TTB - Interest on Savings */}
                      <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                        Section 80TTA/80TTB - Interest on Savings
                      </Typography>
                      <Grid2 container spacing={2} alignItems="center" mb={2}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Total savings interest"
                            name="savingsInterest"
                            value={values.savingsInterest}
                            onChange={(e) => setFieldValue('savingsInterest', e.target.value)}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Total FD/RD interest (above 60 yrs)"
                            name="fdInterest"
                            value={values.fdInterest}
                            onChange={(e) => setFieldValue('fdInterest', e.target.value)}
                          />
                        </Grid2>
                      </Grid2>

                      {/* Section 80U - Person with Disability */}
                      <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                        Section 80U - Person with Disability
                      </Typography>
                      <Grid2 container spacing={2} alignItems="center" mb={2}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                          <Autocomplete
                            size="small"
                            fullWidth
                            options={disabilityNature}
                            value={values.disabilityNature}
                            onChange={(_, v) => setFieldValue('disabilityNature', v)}
                            renderInput={(params) => <TextField {...params} label="Nature of Disability" />}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Autocomplete
                            size="small"
                            fullWidth
                            options={disabilitySeverity}
                            value={values.disabilitySeverity}
                            onChange={(_, v) => setFieldValue('disabilitySeverity', v)}
                            renderInput={(params) => <TextField {...params} label="Severity" />}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Deduction Amount"
                            name="disabilityAmount"
                            value={values.disabilityAmount}
                            onChange={(e) => setFieldValue('disabilityAmount', e.target.value)}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Button size="small" variant="contained" component="label">
                            Upload Certificate
                            <input type="file" hidden onChange={(e) => setFieldValue('disabilityCert', e.target.files[0])} />
                          </Button>
                        </Grid2>
                      </Grid2>

                      {/* Other Deductions */}
                      <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                        Other deductions
                      </Typography>
                      {/* Did you pay Rent without receiving HRA? */}
                      <Grid2 container alignItems="center" spacing={2} mb={3}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography>Did you pay Rent without receiving HRA?</Typography>
                          <RadioGroup row value={values.rentHraPaid} onChange={(_, v) => setFieldValue('rentHraPaid', v)}>
                            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                          </RadioGroup>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 8 }}>
                          {values.rentHraPaid === 'yes' && (
                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                              <Typography>Amount</Typography>
                              <TextField
                                size="small"
                                value={values.rentHraAmount}
                                onChange={(e) => setFieldValue('rentHraAmount', e.target.value)}
                                sx={{ maxWidth: 200 }}
                              />
                            </Box>
                          )}
                        </Grid2>
                      </Grid2>
                      {/* Are you a first time homebuyer? */}
                      <Grid2 container alignItems="center" spacing={2} mb={3}>
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <Typography>Are you a first time homebuyer?</Typography>
                          <RadioGroup row value={values.firstHomeIsFirst} onChange={(_, v) => setFieldValue('firstHomeIsFirst', v)}>
                            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                          </RadioGroup>
                        </Grid2>
                        {values.firstHomeIsFirst === 'yes' && (
                          <>
                            <Grid2 size={{ xs: 12, sm: 4.5 }}>
                              <Box display="flex" alignItems="center" gap={2} mt={1}>
                                <Typography>Amount of interest paid</Typography>
                                <TextField
                                  size="small"
                                  value={values.firstHomeInterest}
                                  onChange={(e) => setFieldValue('firstHomeInterest', e.target.value)}
                                  sx={{ maxWidth: 200 }}
                                />
                              </Box>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4.5 }}>
                              <Box display="flex" alignItems="center" gap={2} mt={1}>
                                <Typography>Date of Loan Sanctioned</Typography>
                                <TextField
                                  size="small"
                                  type="date"
                                  value={values.firstHomeDate}
                                  onChange={(e) => setFieldValue('firstHomeDate', e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ maxWidth: 200 }}
                                />
                              </Box>
                            </Grid2>
                          </>
                        )}
                      </Grid2>
                      {/* Donations made to political/party (80GGC)? */}
                      <Grid2 container alignItems="center" spacing={2} mb={3}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography>Donations made to political/rural i&d org?</Typography>
                          <RadioGroup row value={values.politicalDonated} onChange={(_, v) => setFieldValue('politicalDonated', v)}>
                            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                          </RadioGroup>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 8 }}>
                          {values.politicalDonated === 'yes' && (
                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                              <Typography>Amount</Typography>
                              <TextField
                                size="small"
                                value={values.politicalAmount}
                                onChange={(e) => setFieldValue('politicalAmount', e.target.value)}
                                sx={{ maxWidth: 200 }}
                              />
                            </Box>
                          )}
                        </Grid2>
                      </Grid2>
                      <Box display="flex" justifyContent="flex-end">
                        <Button size="small" variant="contained" color="primary" type="submit">
                          Save All Deductions
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Card>

              {/* Section 80C - Claim deductions for investments made */}
              <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                  Section 80C - Claim deductions for investments made
                </Typography>
                <Formik
                  initialValues={{ investments }}
                  enableReinitialize
                  validationSchema={investmentsSchema}
                  onSubmit={(values) => {
                    const formData = new FormData();
                    values.investments.forEach((investment, idx) => {
                      formData.append(`investments[${idx}][type]`, investment.type || '');
                      formData.append(`investments[${idx}][amount]`, investment.amount || '');
                      if (investment.doc) {
                        formData.append(`investments[${idx}][doc]`, investment.doc);
                      }
                    });
                    for (let pair of formData.entries()) {
                      console.log(pair[0] + ':', pair[1]);
                    }
                  }}
                >
                  {({ values, setFieldValue, errors }) => (
                    <Form>
                      {values.investments.map((row, idx) => (
                        <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                          <Grid2 container spacing={2} alignItems="center">
                            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                              <Autocomplete
                                size="small"
                                fullWidth
                                options={investmentTypes}
                                value={row.type}
                                onChange={(_, v) => {
                                  const newArr = [...values.investments];
                                  newArr[idx].type = v;
                                  setFieldValue('investments', newArr);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Investment/Payment"
                                    error={Boolean(errors.investments?.[idx]?.type)}
                                    helperText={errors.investments?.[idx]?.type}
                                  />
                                )}
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                              <TextField
                                size="small"
                                fullWidth
                                label="Amount"
                                value={row.amount}
                                onChange={(e) => {
                                  const newArr = [...values.investments];
                                  newArr[idx].amount = e.target.value;
                                  setFieldValue('investments', newArr);
                                }}
                                error={Boolean(errors.investments?.[idx]?.amount)}
                                helperText={errors.investments?.[idx]?.amount}
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                              <Button size="small" variant="contained" component="label">
                                Upload
                                <input
                                  type="file"
                                  hidden
                                  onChange={(e) => {
                                    const newArr = [...values.investments];
                                    newArr[idx].doc = e.target.files[0];
                                    setFieldValue('investments', newArr);
                                  }}
                                />
                              </Button>
                            </Grid2>
                            {values.investments.length > 1 && (
                              <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const newArr = values.investments.filter((_, i) => i !== idx);
                                    setFieldValue('investments', newArr);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid2>
                            )}
                          </Grid2>
                        </Paper>
                      ))}
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setFieldValue('investments', [...values.investments, { type: '', amount: '', doc: null }])}
                        >
                          Add Row
                        </Button>
                        <Button size="small" variant="contained" color="primary" type="submit">
                          Save Investments
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Card>

              {/* Section 80D - Claim deduction for medical insurance paid */}
              <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                  Section 80D - Claim deduction for medical insurance paid
                </Typography>
                <Formik
                  initialValues={mediclaim}
                  enableReinitialize
                  validationSchema={mediclaimSchema}
                  onSubmit={(values) => {
                    const formData = new FormData();
                    formData.append('selfFamily', values.selfFamily || '');
                    formData.append('selfSenior', values.selfSenior || '');
                    formData.append('parents', values.parents || '');
                    formData.append('parentsSenior', values.parentsSenior || '');
                    formData.append('checkup', values.checkup || '');
                    if (Array.isArray(values.receipts)) {
                      values.receipts.forEach((file, idx) => {
                        if (file) formData.append(`receipts[${idx}]`, file);
                      });
                    }
                    for (let pair of formData.entries()) {
                      console.log(pair[0] + ':', pair[1]);
                    }
                  }}
                >
                  {({ values, setFieldValue, errors }) => (
                    <Form>
                      <Grid2 container spacing={2} alignItems="center" mb={2}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Self & Family (Non-senior citizen)</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Amount"
                            value={values.selfFamily}
                            onChange={(e) => setFieldValue('selfFamily', e.target.value)}
                            error={Boolean(errors.selfFamily)}
                            helperText={errors.selfFamily}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Self (Senior Citizen)</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Amount"
                            value={values.selfSenior}
                            onChange={(e) => setFieldValue('selfSenior', e.target.value)}
                            error={Boolean(errors.selfSenior)}
                            helperText={errors.selfSenior}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Parents (Non-senior)</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Amount"
                            value={values.parents}
                            onChange={(e) => setFieldValue('parents', e.target.value)}
                            error={Boolean(errors.parents)}
                            helperText={errors.parents}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Parents (Senior)</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Amount"
                            value={values.parentsSenior}
                            onChange={(e) => setFieldValue('parentsSenior', e.target.value)}
                            error={Boolean(errors.parentsSenior)}
                            helperText={errors.parentsSenior}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Preventive Health Checkup</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Amount"
                            value={values.checkup}
                            onChange={(e) => setFieldValue('checkup', e.target.value)}
                            error={Boolean(errors.checkup)}
                            helperText={errors.checkup}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Upload premium receipts</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button size="small" variant="contained" component="label">
                              Upload
                              <input
                                type="file"
                                hidden
                                onChange={(e) => setFieldValue('receipts', [...(values.receipts || []), e.target.files[0]])}
                              />
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setFileDialogOpen(true);
                                setDialogFilesData(values.receipts);
                              }}
                            >
                              View
                            </Button>
                          </Stack>
                        </Grid2>
                      </Grid2>
                      <Box display="flex" justifyContent="flex-end">
                        <Button size="small" variant="contained" color="primary" type="submit">
                          Save Mediclaim
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Card>

              <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
                <Button variant="outlined" color="primary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {/* Review & Filing Step */}
          {step === 3 && (
            <Box>
              <Box display="flex" justifyContent="flex-start" mt={2} gap={2}>
                <Button variant="outlined" color="primary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              </Box>
              <Typography variant="h5" mb={3} sx={{ textDecoration: 'underline' }}>
                Draft Income Tax Computation
              </Typography>
              <Stack direction="row" spacing={2} mb={3}>
                <Button variant="outlined">View</Button>
                <Button variant="contained">Upload</Button>
              </Stack>

              <Typography variant="h5" mb={2} sx={{ textDecoration: 'underline' }}>
                Approval / Workflow
              </Typography>
              <Stack direction="row" spacing={2} mb={3}>
                <Button variant="outlined">View</Button>
                <Button variant="contained" color="success">
                  Approve
                </Button>
                <Button variant="contained" color="warning">
                  Rework
                </Button>
              </Stack>

              <Typography variant="h5" mb={2} sx={{ textDecoration: 'underline' }}>
                Proceed to Filing
              </Typography>
              <Stack direction="row" spacing={2} mb={2}>
                <Button variant="outlined">View</Button>
                <Button variant="contained" color="primary">
                  Proceed to File
                </Button>
              </Stack>
              <Box mb={4}>
                <Typography mb={1}>Mode of e-verification?</Typography>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Aadhaar OTP', 'Net Banking', 'DSC', 'EVC']}
                  renderInput={(params) => <TextField {...params} placeholder="Select mode" />}
                  sx={{ maxWidth: 300 }}
                />
              </Box>

              <Stack direction="row" spacing={6} mt={4}>
                <Paper elevation={2} sx={{ p: 3, minWidth: 120, textAlign: 'center', bgcolor: '#f8fafc' }}>
                  <Typography variant="h6">Filing</Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 3, minWidth: 120, textAlign: 'center', bgcolor: '#f8fafc' }}>
                  <Typography variant="h6">Ack</Typography>
                </Paper>
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>
      <FileListDialog
        open={fileDialogOpen}
        files={dialogFilesData}
        setFiles={setDialogFilesData}
        onClose={() => setFileDialogOpen(false)}
      />
    </Card>
  );
}
