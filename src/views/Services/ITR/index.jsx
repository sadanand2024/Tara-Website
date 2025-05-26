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
  Stack
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

const steps = ['Personal Info', 'Income Details', 'Deductions', 'Review & Filing'];

// Add validation schemas
const personalInfoSchema = Yup.object().shape({
  panFile: Yup.mixed().required('PAN is required'),
  aadhaarFile: Yup.mixed().required('Aadhaar is required'),
  mobile: Yup.string().required('Mobile is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  firstName: Yup.string().required('First name is required'),
  gender: Yup.string().required('Gender is required'),
  resStatus: Yup.string().required('Residential status is required')
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
    panFile: null,
    aadhaarFile: null,
    mobile: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    resStatus: ''
  });
  const [as26File, setAs26File] = React.useState(null);
  const [aisFile, setAisFile] = React.useState(null);
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

  const getServiceTasks = async (id) => {
    const response = await Factory('get', `/servicetasks/service-task/${id}/`);
    if (response.res.status_cd === 0) {
      console.log(response.res.data);
      setTasks(response.res.data);
    }
  };

  useEffect(() => {
    if (service_id) {
      // const fetchITRDetails = async () => {
      //   const response = await Factory('get', `/itr/details?service_id=${service_id}`);
      //   if (response.res.status_cd === 0) {
      //     if (response.res.data.personal_info) {
      //       setPersonalInfo(response.res.data.personal_info);
      //       if (personalInfoFormikRef.current) {
      //         personalInfoFormikRef.current.setValues(response.res.data.personal_info);
      //       }
      //     }
      //     if (response.res.data.tax_paid) {
      //       setAs26File(response.res.data.tax_paid.as26File || null);
      //       setAisFile(response.res.data.tax_paid.aisFile || null);
      //       setChallans(response.res.data.tax_paid.challans || []);
      //       if (taxPaidFormikRef.current) {
      //         taxPaidFormikRef.current.setValues({
      //           as26File: response.res.data.tax_paid.as26File || null,
      //           aisFile: response.res.data.tax_paid.aisFile || null,
      //           challans: response.res.data.tax_paid.challans || []
      //         });
      //       }
      //     }
      //   }
      // };
      getServiceTasks(service_id);
      // fetchITRDetails();
    }
  }, [service_id]);

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
              {/* Personal Info Formik */}
              <Formik
                innerRef={personalInfoFormikRef}
                initialValues={personalInfo}
                validationSchema={personalInfoSchema}
                enableReinitialize
                onSubmit={async (values) => {
                  setPersonalInfo(values);
                  // Convert values to FormData
                  const formData = new FormData();
                  Object.entries(values).forEach(([key, value]) => {
                    if (value instanceof File) {
                      formData.append(key, value);
                    } else {
                      formData.append(key, value ?? '');
                    }
                  });
                  // POST API call for personal info
                  try {
                    const res = await Factory('post', '/itr/personal-info', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    if (res.res.status_cd === 0) {
                      alert('Personal info saved successfully!');
                    } else {
                      alert('Error saving personal info.');
                    }
                  } catch (err) {
                    alert('Error saving personal info.');
                  }
                }}
              >
                {({ setFieldValue, values, errors, touched }) => (
                  <Form>
                    <Typography variant="h5" fontWeight={700} mb={2}>
                      <span style={{ textDecoration: 'underline' }}>Personal Information</span>
                    </Typography>
                    <Grid2 container spacing={2} alignItems="center">
                      {/* Upload PAN */}
                      <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography>Upload PAN</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          value={values.panFile ? values.panFile.name : ''}
                          placeholder="Upload PAN"
                          InputProps={{ readOnly: true }}
                          onClick={() => document.getElementById('panFileInput').click()}
                          error={Boolean(touched.panFile && errors.panFile)}
                          helperText={touched.panFile && errors.panFile ? errors.panFile : ' '}
                        />
                        <input id="panFileInput" type="file" hidden onChange={(e) => setFieldValue('panFile', e.target.files[0])} />
                      </Grid2>
                      {/* Upload Aadhaar */}
                      <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography>Upload Aadhaar</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          value={values.aadhaarFile ? values.aadhaarFile.name : ''}
                          placeholder="Upload Aadhaar"
                          InputProps={{ readOnly: true }}
                          onClick={() => document.getElementById('aadhaarFileInput').click()}
                          error={Boolean(touched.aadhaarFile && errors.aadhaarFile)}
                          helperText={touched.aadhaarFile && errors.aadhaarFile ? errors.aadhaarFile : ' '}
                        />
                        <input id="aadhaarFileInput" type="file" hidden onChange={(e) => setFieldValue('aadhaarFile', e.target.files[0])} />
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
                            name="firstName"
                            placeholder="First"
                            error={Boolean(touched.firstName && errors.firstName)}
                            helperText={<ErrorMessage name="firstName" />}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Field as={TextField} size="small" fullWidth name="middleName" placeholder="Middle" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Field as={TextField} size="small" fullWidth name="lastName" placeholder="Last" />
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
                          value={values.resStatus}
                          onChange={(e, value) => setFieldValue('resStatus', value || '')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select status"
                              error={Boolean(touched.resStatus && errors.resStatus)}
                              helperText={touched.resStatus && errors.resStatus ? errors.resStatus : ' '}
                            />
                          )}
                        />
                      </Grid2>
                    </Grid2>
                    <Box display="flex" justifyContent="flex-end">
                      <Button type="submit" variant="contained" color="primary">
                        Save Personal Info
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>

              {/* Tax Paid Details Formik */}
              <Formik
                innerRef={taxPaidFormikRef}
                initialValues={{
                  as26File: as26File,
                  aisFile: aisFile,
                  challans: challans
                }}
                validationSchema={taxPaidSchema}
                enableReinitialize
                onSubmit={async (values) => {
                  setAs26File(values.as26File);
                  setAisFile(values.aisFile);
                  setChallans(values.challans);
                  // Convert values to FormData
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
                  // POST API call for tax paid details
                  try {
                    const res = await Factory('post', '/itr/tax-paid', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                    if (res.res.status_cd === 0) {
                      alert('Tax paid details saved successfully!');
                    } else {
                      alert('Error saving tax paid details.');
                    }
                  } catch (err) {
                    alert('Error saving tax paid details.');
                  }
                }}
              >
                {({ setFieldValue, values, errors, touched }) => (
                  <Form>
                    <Typography variant="h5" fontWeight={700} mt={5} mb={2}>
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
                        {values.challans.map((file, idx) => (
                          <Box key={idx} display="flex" alignItems="center" mb={1} gap={1}>
                            <TextField
                              size="small"
                              fullWidth
                              value={file ? file.name : ''}
                              placeholder="Upload Challan"
                              InputProps={{ readOnly: true }}
                              onClick={() => document.getElementById(`challanInput${idx}`).click()}
                            />
                            <input
                              id={`challanInput${idx}`}
                              type="file"
                              hidden
                              onChange={(e) => {
                                const newFiles = [...values.challans];
                                newFiles[idx] = e.target.files[0];
                                setFieldValue('challans', newFiles);
                              }}
                            />
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={!file}
                              onClick={() => file && window.open(URL.createObjectURL(file), '_blank')}
                            >
                              View
                            </Button>
                          </Box>
                        ))}
                        <Box display="flex" alignItems="center" gap={1}>
                          <TextField
                            size="small"
                            fullWidth
                            value={''}
                            placeholder="Upload Challan"
                            InputProps={{ readOnly: true }}
                            onClick={() => document.getElementById('challanInputNew').click()}
                          />
                          <input
                            id="challanInputNew"
                            type="file"
                            hidden
                            onChange={(e) => {
                              if (e.target.files[0]) setFieldValue('challans', [...values.challans, e.target.files[0]]);
                            }}
                          />
                          <Button size="small" variant="outlined" disabled>
                            View
                          </Button>
                          <Button size="small" variant="contained" onClick={() => document.getElementById('challanInputNew').click()}>
                            Add
                          </Button>
                        </Box>
                      </Grid2>
                    </Grid2>
                    <Box display="flex" justifyContent="flex-end">
                      <Button type="submit" variant="contained" color="primary">
                        Save Tax Paid Details
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          )}

          {/* Step 2: Income Details Accordions */}
          {step === 1 && (
            <Box>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Salary Income</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <IncomeDetails
                    type="salary"
                    fileDialogOpen={fileDialogOpen}
                    setFileDialogOpen={setFileDialogOpen}
                    dialogFilesData={dialogFilesData}
                    setDialogFilesData={setDialogFilesData}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>House Property Income</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <IncomeDetails
                    type="house"
                    fileDialogOpen={fileDialogOpen}
                    setFileDialogOpen={setFileDialogOpen}
                    dialogFilesData={dialogFilesData}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Capital Gains</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <IncomeDetails
                    type="capital"
                    fileDialogOpen={fileDialogOpen}
                    setFileDialogOpen={setFileDialogOpen}
                    dialogFilesData={dialogFilesData}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Business/Professional Income</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <IncomeDetails
                    type="business"
                    fileDialogOpen={fileDialogOpen}
                    setFileDialogOpen={setFileDialogOpen}
                    dialogFilesData={dialogFilesData}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Other Income</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <IncomeDetails
                    type="other"
                    fileDialogOpen={fileDialogOpen}
                    setFileDialogOpen={setFileDialogOpen}
                    dialogFilesData={dialogFilesData}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Agriculture Income</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <IncomeDetails
                    type="agriculture"
                    fileDialogOpen={fileDialogOpen}
                    setFileDialogOpen={setFileDialogOpen}
                    dialogFilesData={dialogFilesData}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {/* Deductions Step */}
          {step === 2 && (
            <Box>
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
