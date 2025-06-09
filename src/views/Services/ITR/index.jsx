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
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import Deductions from './Deductions';
import Factory from 'utils/Factory';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IncomeDetails from './IncomeDetails';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
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
import StepContent from '@mui/material/StepContent';

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

const viewFile = async (url) => {
  const response = await Factory('get', `/docwallet/generate_presigned_url?url=${url}`, {}, {});
  if (response.res.status_cd === 0) {
    let url = response.res.data.url;
    window.open(url, '_blank');
  }
};

// Add validation schemas for Donations, Investments, Mediclaim

export default function ITR() {
  const [reviewAndFiling, setReviewAndFiling] = React.useState({ draft_income_file: null });
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
  const [deductions, setDeductions] = React.useState([]);
  const [eduLoan, setEduLoan] = React.useState({ amount: '', educationOf: '', borrower: '', approved: 'no' });
  const [savings, setSavings] = React.useState({ savings: '', fdrd: '' });
  const [disability, setDisability] = React.useState({ nature: '', severity: '', amount: '', cert: null });
  const [rentHra, setRentHra] = React.useState({ paid: 'no', amount: '' });
  const [firstHome, setFirstHome] = React.useState({ isFirst: 'no', interest: '', date: '' });
  const [political, setPolitical] = React.useState({ donated: 'no', amount: '' });

  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [dialogFilesData, setDialogFilesData] = useState([]);

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

  const addDeduction = async (taskId) => {
    const response = await Factory('post', `/income_tax_returns/deductions/upsert/`, {
      service_request: service_id,
      service_task: taskId,
      status: 'in progress'
    });
    if (response.res.status_cd === 0) {
      getStep3Data();
    } else {
      setDeductions([]);
    }
  };

  const getStep1Data = async () => {
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
        as26File: response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['26AS'].files || [],
        aisFile: response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['AIS'].files || [],
        challans: response.res.data.tasks_data['Tax Paid Details'].data?.documents?.['AdvanceTax'].files || [],
        status: response.res.data.tasks_data['Tax Paid Details']?.data?.status || null,
        reviewer: response.res.data.tasks_data['Tax Paid Details']?.data?.reviewer || null,
        assignee: response.res.data.tasks_data['Tax Paid Details']?.data?.assignee || null
      });
    }
  };

  const getStep2Data = async () => {
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

  const getStep3Data = async () => {
    const response = await Factory(
      'get',
      `/income_tax_returns/service-request-section-data?service_request_id=${service_id}&section=deductions`
    );
    if (response.res.status_cd === 0) {
      setDeductions(response.res.data.tasks_data.Deductions);
      if (response.res.data.tasks_data.Deductions.data === null) addDeduction(response.res.data.tasks_data.Deductions.task_id);
    } else {
      setDeductions([]);
    }
  };

  const getStep4Data = async () => {
    const response = await Factory(
      'get',
      `/income_tax_returns/service-request-section-data?service_request_id=${service_id}&section=review`
    );
    if (response.res.status_cd === 0) {
      setReviewAndFiling(response.res.data.tasks_data['Review Filing Certificate']);
    } else {
      setReviewAndFiling(null);
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
    if (step === 2) getStep3Data(service_id);
    if (step === 3) getStep4Data(service_id);
  }, [step]);

  const handleOpenFileDialog = (files, title) => {
    setFileDialogOpen(true);
  };

  const [reviewStep, setReviewStep] = React.useState(0);
  const reviewSteps = ['Drafting', 'Filing', 'Acknowledgement'];

  useEffect(() => {
    if (reviewAndFiling?.data?.approval_status === 'completed') setReviewStep(2);
    // } else if (reviewAndFiling?.data?.approval_status === 'drafted') {
    //   setReviewStep(0);
    // } else if (reviewAndFiling?.data?.approval_status === 'filed') {
    //   setReviewStep(1);
    // }
  }, [reviewAndFiling]);
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
                          <Button size="small" variant="contained" component="label">
                            Upload
                            <input
                              id="panFileInput"
                              type="file"
                              hidden
                              onChange={(e) => {
                                setFieldValue('pan', e.target.files[0]);
                                setFieldTouched('pan', true, true);
                              }}
                            />
                          </Button>
                          {values.pan && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                              onClick={() => {
                                if (typeof values.pan === 'string') {
                                  viewFile(values.pan);
                                } else {
                                  window.open(URL.createObjectURL(values.pan), '_blank');
                                }
                              }}
                            >
                              View
                            </Button>
                          )}
                          {touched.pan && errors.pan && (
                            <Typography color="error" variant="caption">
                              {errors.pan}
                            </Typography>
                          )}
                        </Grid2>
                        {/* Upload Aadhaar */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Upload Aadhaar</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Button size="small" variant="contained" component="label">
                            Upload
                            <input
                              id="aadhaarFileInput"
                              type="file"
                              hidden
                              onChange={(e) => {
                                setFieldValue('aadhar', e.target.files[0]);
                                setFieldTouched('aadhar', true, true);
                              }}
                            />
                          </Button>
                          {values.aadhar && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                              onClick={() => {
                                if (typeof values.aadhar === 'string') {
                                  viewFile(values.aadhar);
                                } else {
                                  window.open(URL.createObjectURL(values.aadhar), '_blank');
                                }
                              }}
                            >
                              View
                            </Button>
                          )}
                          {touched.aadhar && errors.aadhar && (
                            <Typography color="error" variant="caption">
                              {errors.aadhar}
                            </Typography>
                          )}
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
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button type="submit" variant="contained" color="primary">
                          Save Personal Info
                        </Button>
                        <GetActionButtons
                          type="put"
                          data={personalInfo}
                          status={personalInfo.status}
                          urlEndpoint="personal-information"
                          recId={personalInfo.id}
                          task_id={personalInfo.task_id}
                          service_request={service_id}
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
                    Array.from(values.as26File).forEach((file) => {
                      if (file instanceof File) formData.append('form26as_files', file);
                    });
                    Array.from(values.aisFile).forEach((file) => {
                      if (file instanceof File) formData.append('ais_files', file);
                    });
                    Array.from(values.challans).forEach((file) => {
                      if (file instanceof File) formData.append('advance_tax_files', file);
                    });

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
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Button size="small" variant="contained" component="label">
                            Upload
                            <input
                              id="as26FileInput"
                              type="file"
                              multiple={true}
                              hidden
                              onChange={(e) =>
                                setFieldValue('as26File', values.as26File ? [...values.as26File, ...e.target.files] : e.target.files)
                              }
                            />
                          </Button>
                          {values.as26File && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                              onClick={() => {
                                setFileDialogOpen(true);
                                setDialogFilesData({ files: values.as26File, urlEndpoint: 'tax-paid-details' });
                              }}
                            >
                              View
                            </Button>
                          )}
                          {touched.as26File && errors.as26File && (
                            <Typography color="error" variant="caption">
                              {errors.as26File}
                            </Typography>
                          )}
                        </Grid2>
                        {/* Upload AIS */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Typography>Upload AIS</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                          <Button size="small" variant="contained" component="label">
                            Upload
                            <input
                              id="aisFileInput"
                              type="file"
                              multiple={true}
                              hidden
                              onChange={(e) =>
                                setFieldValue('aisFile', values.aisFile ? [...values.aisFile, ...e.target.files] : e.target.files)
                              }
                            />
                          </Button>
                          {values.aisFile && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                              onClick={() => {
                                setFileDialogOpen(true);
                                setDialogFilesData({ files: values.aisFile, urlEndpoint: 'tax-paid-details' });
                              }}
                            >
                              View
                            </Button>
                          )}
                          {touched.aisFile && errors.aisFile && (
                            <Typography color="error" variant="caption">
                              {errors.aisFile}
                            </Typography>
                          )}
                        </Grid2>
                        {/* Advance tax / Self Assisted Tax Challan */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <Typography>Advance tax / Self Assisted Tax Challan</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <input
                              id="challanInputNew"
                              type="file"
                              hidden
                              multiple={true}
                              onChange={(e) => {
                                if (e.target.files[0])
                                  setFieldValue('challans', values.challans ? [...values.challans, ...e.target.files] : e.target.files);
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
                                setDialogFilesData({ files: values.challans, urlEndpoint: 'tax-paid-details' });
                              }}
                            >
                              View
                            </Button>
                          </Box>
                        </Grid2>
                      </Grid2>
                      <Box display="flex" justifyContent="flex-end" mt={0} gap={1}>
                        <Button type="submit" variant="contained" color="primary">
                          Save Tax Paid Details
                        </Button>
                        <GetActionButtons
                          type="post"
                          data={taxPaidDetails}
                          status={taxPaidDetails.status}
                          urlEndpoint={`/income_tax_returns/tax-paid-details/create-or-update/`}
                          recId={taxPaidDetails.id}
                          service_request={service_id}
                          task_id={taxPaidDetails.task_id}
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
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
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
            <Deductions
              setFileDialogOpen={setFileDialogOpen}
              setDialogFilesData={setDialogFilesData}
              deductions={deductions}
              setDeductions={setDeductions}
              service_id={service_id}
              step={step}
              setStep={setStep}
            />
          )}
          {/* Review & Filing Step */}
          {step === 3 && (
            <Box>
              <Stepper activeStep={reviewStep} orientation="vertical" sx={{ mb: 4 }}>
                {reviewSteps.map((label, idx) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
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
                          <Typography variant="h5" mb={3} sx={{ textDecoration: 'underline' }}>
                            Draft Income Tax Computation
                          </Typography>
                          <Stack direction="row" spacing={2} mb={3}>
                            {console.log(reviewAndFiling)}
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
                                  let type = reviewAndFiling?.data?.id ? 'put' : 'post';
                                  let urlEndpoint = reviewAndFiling?.data?.id
                                    ? `/income_tax_returns/review-filing/${reviewAndFiling?.data?.id}/`
                                    : '/income_tax_returns/review-filing/';
                                  const formData = new FormData();
                                  formData.append('service_request', service_id);
                                  formData.append('service_task', reviewAndFiling.task_id);
                                  formData.append('draft_income_file', e.target.files[0]);
                                  formData.append('approval_status', 'pending');
                                  formData.append('filing_status', 'in progress');
                                  formData.append('status', 'in progress');
                                  const res = await Factory(type, urlEndpoint, formData, {});
                                  if (res.res.status_cd === 0) {
                                    setReviewAndFiling({ ...reviewAndFiling, data: { ...res.res.data } });
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
                            {reviewAndFiling?.data?.draft_income_file && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  if (typeof reviewAndFiling?.data?.draft_income_file === 'string') {
                                    window.open(reviewAndFiling?.data?.draft_income_file, '_blank');
                                  } else if (reviewAndFiling?.data?.draft_income_file) {
                                    window.open(URL.createObjectURL(reviewAndFiling?.data?.draft_income_file), '_blank');
                                  }
                                }}
                              >
                                View
                              </Button>
                            )}
                          </Stack>
                          <Box display="flex" justifyContent="flex-start" gap={1}>
                            <GetActionButtons
                              data={reviewAndFiling}
                              status={reviewAndFiling?.data?.approval_status}
                              recId={reviewAndFiling?.data?.id}
                              task_id={reviewAndFiling?.data?.task_id}
                              service_request={service_id}
                              filingHelper={true}
                              setReviewStep={setReviewStep}
                              step={reviewStep}
                            />
                          </Box>
                          {/* <Button variant="contained" color="primary" onClick={() => setReviewStep(1)} sx={{ mt: 2 }}>
                            Next
                          </Button> */}
                        </Box>
                      )}
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
                                  let type = reviewAndFiling?.data?.id ? 'put' : 'post';
                                  let urlEndpoint = reviewAndFiling?.data?.id
                                    ? `/income_tax_returns/review-filing/${reviewAndFiling?.data?.id}/`
                                    : '/income_tax_returns/review-filing/';
                                  const formData = new FormData();
                                  formData.append('service_request', service_id);
                                  formData.append('service_task', reviewAndFiling.task_id);
                                  formData.append('review_certificate', e.target.files[0]);
                                  formData.append('filing_status', 'in progress');
                                  formData.append('status', 'in progress');
                                  const res = await Factory(type, urlEndpoint, formData, {});
                                  console.log(res.res);
                                  if (res.res.status_cd === 0) {
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
                                  if (typeof reviewAndFiling?.data?.review_certificate === 'string') {
                                    window.open(reviewAndFiling?.data?.review_certificate, '_blank');
                                  } else if (reviewAndFiling?.data?.review_certificate) {
                                    window.open(URL.createObjectURL(reviewAndFiling?.data?.review_certificate), '_blank');
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
                              step={reviewStep}
                            />
                          </Box>
                          {/* <Button variant="contained" color="primary" onClick={() => setReviewStep(1)} sx={{ mt: 2 }}>
                            Next
                          </Button> */}
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
                            <Typography variant="h5" mb={3} sx={{ textDecoration: 'underline' }}>
                              Download Filed Acknowledgement
                            </Typography>
                            <Button variant="outlined" color="secondary" onClick={() => console.log(reviewAndFiling)}>
                              Download
                              <IconButton
                                size="small"
                                color="secondary"
                                sx={{ alignSelf: 'center', '&:hover': { backgroundColor: 'transparent' } }}
                                onClick={() => {
                                  if (reviewAndFiling?.data?.review_certificate) {
                                    window.open(reviewAndFiling?.data?.review_certificate, '_blank');
                                  }
                                }}
                              >
                                <DownloadIcon sx={{ width: { xs: 24, md: 24 }, height: { xs: 24, md: 24 } }} />
                              </IconButton>
                            </Button>
                          </Stack>
                          {/* <Button variant="outlined" color="primary" onClick={() => setReviewStep(1)} sx={{ mt: 2 }}>
                            Back
                          </Button> */}
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
        </Paper>

        <Box display="flex" justifyContent="flex-start" mt={2} gap={2}>
          <Button variant="outlined" color="primary" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        </Box>
      </Box>
      <FileListDialog
        getStep1Data={getStep1Data}
        getStep2Data={getStep2Data}
        getStep3Data={getStep3Data}
        step={step}
        open={fileDialogOpen}
        files={dialogFilesData}
        setFiles={setDialogFilesData}
        onClose={() => setFileDialogOpen(false)}
      />
    </Card>
  );
}
