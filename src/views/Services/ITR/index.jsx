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

const steps = ['Personal Info', 'Income Details', 'Deductions', 'Review & Filing'];

// Add validation schemas
const personalInfoSchema = Yup.object().shape({
  pan: Yup.mixed().required('PAN is required'),
  aadhar: Yup.mixed().required('Aadhaar is required'),
  mobile: Yup.string()
    .required('Mobile is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  first_name: Yup.string().required('First name is required'),
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

export default function ITR() {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const [step, setStep] = React.useState(0);
  const [tasks, setTasks] = React.useState([]);
  const [personalInfo, setPersonalInfo] = React.useState({
    id: null,
    pan: null,
    aadhar: null,
    mobile: '',
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
    as26File: null,
    aisFile: null,
    challans: []
  });
  const [challans, setChallans] = React.useState([]);
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
    salary: { label: 'Salary Income', type: 'salary' },
    house: { label: 'House Property Income', type: 'house' },
    capital: { label: 'Capital Gains Income', type: 'capital' },
    business: { label: 'Business/Professional Income', type: 'business' },
    other: { label: 'Other Income', type: 'other' },
    agriculture: { label: 'Agriculture Income', type: 'agriculture' }
  };

  const { enqueueSnackbar } = useSnackbar();

  const getServiceTasks = async (id) => {
    // const response = await Factory('get', `/servicetasks/service-task/${id}/`);
    const response = await Factory('get', `/income_tax_returns/service-requests-itr/${id}/full-data/`);
    if (response.res.status_cd === 0) {
      setTasks(response.res.data.tasks_data);
      setPersonalInfo(response.res.data.tasks_data['Personal Information'].data);
      setTaxPaidDetails({
        as26File: response.res.data['Tax Paid Details'].data?.form26as_files?.[0] || null,
        aisFile: response.res.data['Tax Paid Details'].data?.ais_files?.[0] || null,
        challans: response.res.data['Tax Paid Details'].data?.advance_tax_files || []
      });
    }
  };

  const getStep1Data = async (step) => {
    const response = await Factory(
      'get',
      `/income_tax_returns/service-request-section-data?service_request_id=${service_id}&section=personal_info`
    );
    if (response.res.status_cd === 0) {
      setTasks(response.res.data.tasks_data);
      setPersonalInfo(response.res.data.tasks_data['Personal Information'].data);
      setTaxPaidDetails({
        as26File: response.res.data['Tax Paid Details'].data?.form26as_files?.[0] || null,
        aisFile: response.res.data['Tax Paid Details'].data?.ais_files?.[0] || null,
        challans: response.res.data['Tax Paid Details'].data?.advance_tax_files || []
      });
    }
  };

  const getStep2Data = async (step) => {
    const response = await Factory(
      'get',
      `/income_tax_returns/service-request-section-data?service_request_id=${service_id}&section=income_details`
    );
    if (response.res.status_cd === 0) {
      console.log(response.res);
    }
  };

  const changeStatus = async (step, status) => {
    // if (step === 'personal_info') {
    // const response = await Factory('post', `/income_tax_returns/service-requests-itr/${service_id}/send-for-review/${step}/`);
    // if (response.res.status_cd === 0) {
    //   enqueueSnackbar('ITR sent for review successfully!', { variant: 'success' });
    // }
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
                    formData.append('status', 'in progress');
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
                    if (type === 'put') formData.append('id', personalInfo.id);
                    const res = await Factory(type, url, formData, {});
                    if (res.res.status_cd === 0) {
                      enqueueSnackbar('Personal Information saved successfully!', {
                        variant: 'success',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' }
                      });
                      console.log(res);
                      console.log(res.res.data);
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
                            value={values.pan ? values.pan.name || values.pan : ''}
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
                            value={values.aadhar ? values.aadhar.name || values.aadhar : ''}
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
                            name="mobile"
                            value={values.mobile || ''}
                            error={Boolean(touched.mobile && errors.mobile)}
                            helperText={<ErrorMessage name="mobile" />}
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
                            if (option.value === 'capital') fieldName = 'capital_income';
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
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => changeStatus('personal_info', 'in progress')}
                          mr={1}
                        >
                          Send for Review
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => changeStatus('personal_info', 'completed')}
                          mr={1}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => changeStatus('personal_info', 'revoked')}
                          mr={1}
                        >
                          Re Work
                        </Button>
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
                    setTaxPaidDetails(values);
                    const formData = new FormData();
                    Object.entries(values).forEach(([key, value]) => {
                      if (key === 'challans' && Array.isArray(value)) {
                        value.forEach((file, idx) => {
                          if (file) formData.append(`challans[${idx}]`, file);
                        });
                      } else if (value instanceof File) {
                        formData.append(key, value);
                      } else {
                        formData.append(key, value ?? '');
                      }
                    });
                    console.log('Form Data:', Object.fromEntries(formData));
                    // try {
                    //   const res = await Factory('post', '/itr/tax-paid', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                    //   if (res.res.status_cd === 0) {
                    //     enqueueSnackbar('Tax paid details saved successfully!', {
                    //       variant: 'success',
                    //       anchorOrigin: { vertical: 'top', horizontal: 'right' }
                    //     });
                    //   } else {
                    //     enqueueSnackbar('Error saving tax paid details.', {
                    //       variant: 'error',
                    //       anchorOrigin: { vertical: 'top', horizontal: 'right' }
                    //     });
                    //   }
                    // } catch (err) {
                    //   enqueueSnackbar('Error saving tax paid details.', {
                    //     variant: 'error',
                    //     anchorOrigin: { vertical: 'top', horizontal: 'right' }
                    //   });
                    // }
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
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={values.as26File ? values.as26File.name : ''}
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
                            value={values.aisFile ? values.aisFile.name : ''}
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
                                if (e.target.files[0]) setFieldValue('challans', [...values.challans, e.target.files[0]]);
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
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => changeStatus('tax_paid_details', 'in progress')}
                          mr={1}
                        >
                          Send for Review
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => changeStatus('tax_paid_details', 'completed')}
                          mr={1}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => changeStatus('tax_paid_details', 'revoked')}
                          mr={1}
                        >
                          Re Work
                        </Button>
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
              {selectedIncomeSections.map((section) => (
                <Accordion key={section}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{incomeAccordionMap[section].label}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <IncomeDetails
                      type={incomeAccordionMap[section].type}
                      fileDialogOpen={fileDialogOpen}
                      setFileDialogOpen={setFileDialogOpen}
                      dialogFilesData={dialogFilesData}
                      setDialogFilesData={setDialogFilesData}
                    />
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
              <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
                <Button variant="outlined" color="primary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              </Box>
              {/* Section 80G - Donations */}
              <Typography variant="h6" mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80G - Donations
              </Typography>
              {donations.map((row, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField size="small" fullWidth label="Name of Donee" />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                      <TextField size="small" fullWidth label="Amount" />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={donationModes}
                        renderInput={(params) => <TextField {...params} label="Mode" />}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input type="file" hidden />
                      </Button>
                    </Grid2>
                    {donations.length > 1 && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                        <IconButton size="small" color="error" onClick={() => setDonations(donations.filter((_, i) => i !== idx))}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid2>
                    )}
                  </Grid2>
                </Paper>
              ))}
              <Box display="flex" justifyContent="flex-end">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setDonations([...donations, { name: '', amount: '', mode: '', receipt: null }])}
                >
                  Add Row
                </Button>
              </Box>

              {/* Section 80E - Interest on Education Loan */}
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80E - Interest on Education Loan
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={educationOfOptions}
                    renderInput={(params) => <TextField {...params} label="Education of" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Borrower Name" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Is it an approved Bank/NBFC?</Typography>
                  <RadioGroup row value={eduLoan.approved}>
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
                  <TextField size="small" fullWidth label="Total savings interest" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Total FD/RD interest (above 60 yrs)" />
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
                    renderInput={(params) => <TextField {...params} label="Nature of Disability" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={disabilitySeverity}
                    renderInput={(params) => <TextField {...params} label="Severity" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Deduction Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Button size="small" variant="contained" component="label">
                    Upload Certificate
                    <input type="file" hidden />
                  </Button>
                </Grid2>
              </Grid2>

              {/* Other Deductions */}
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Other Deductions
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Did you pay Rent without receiving HRA?</Typography>
                  <RadioGroup row value={rentHra.paid}>
                    <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Are you a first time homebuyer?</Typography>
                  <RadioGroup row value={firstHome.isFirst}>
                    <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount of interest paid" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Date of loan sanctioned" type="date" InputLabelProps={{ shrink: true }} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Donation made to political/party (80GGC)?</Typography>
                  <RadioGroup row value={political.donated}>
                    <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
              </Grid2>

              {/* Section 80C - Claim deductions for investments made */}
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80C - Claim deductions for investments made
              </Typography>
              {investments.map((row, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={investmentTypes}
                        renderInput={(params) => <TextField {...params} label="Investment/Payment" />}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField size="small" fullWidth label="Amount" />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input type="file" hidden />
                      </Button>
                    </Grid2>
                    {investments.length > 1 && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                        <IconButton size="small" color="error" onClick={() => setInvestments(investments.filter((_, i) => i !== idx))}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid2>
                    )}
                  </Grid2>
                </Paper>
              ))}
              <Box display="flex" justifyContent="flex-end">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setInvestments([...investments, { type: '', amount: '', doc: null }])}
                >
                  Add Row
                </Button>
              </Box>

              {/* Section 80D - Claim deduction for medical insurance paid */}
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80D - Claim deduction for medical insurance paid
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Self & Family (Non-senior citizen)</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Self (Senior Citizen)</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Parents (Non-senior)</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Parents (Senior)</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Preventive Health Checkup</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Upload premium receipts</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                    <Button size="small" variant="outlined">
                      View
                    </Button>
                    <Button size="small" variant="outlined">
                      Add
                    </Button>
                  </Stack>
                </Grid2>
              </Grid2>
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
