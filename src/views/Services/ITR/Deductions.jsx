import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  Grid2,
  Paper,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import Factory from 'utils/Factory';
import { set } from 'lodash-es';
const donationsSchema = Yup.object().shape({
  donations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().nullable(),
      amount: Yup.number().typeError('Amount must be a number').positive('Amount must be positive'),
      mode: Yup.string(),
      file: Yup.mixed()
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

const donationModes = ['Cash', 'Cheque', 'Online Transfer'];
const investmentTypes = ['PPF', 'NSC', 'ELSS', 'Life Insurance', 'Tuition Fees', 'Others'];
const educationOfOptions = ['self', 'spouse', 'children', 'dependent'];
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
const rentHraPaid = ['Yes', 'No'];
const firstHomeIsFirst = ['Yes', 'No'];
const politicalDonated = ['Yes', 'No'];

const Deductions = ({ deductions, setDeductions, service_id, step, setStep, setFileDialogOpen, setDialogFilesData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [investments, setInvestments] = React.useState([{ type: '', amount: '', doc: null }]);
  const [donations, setDonations] = React.useState([{ name: '', amount: '', mode: '', file: null }]);
  const [mediclaim, setMediclaim] = React.useState({
    selfFamily: '',
    selfSenior: '',
    parents: '',
    parentsSenior: '',
    checkup: '',
    receipts: []
  });
  const [section80E, setSection80E] = useState({
    amount: '',
    education_of: '',
    borrower_name: '',
    loan_outstanding_as_on_31st_march: '',
    is_it_approved_bank: 'false',
    other_files: null
  });
  const [section80EE, setSection80EE] = useState({
    amount: '',
    other_files: null
  });
  const [section80EEB, setSection80EEB] = useState({
    other_files: null,
    vehicleRegistrationNumber: ''
  });
  const [otherDeductions, setOtherDeductions] = useState({
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

  useEffect(() => {
    if (deductions.data) {
      setDonations([...deductions.data.section_80g]);
      setSection80E({ ...deductions.data.section_80e });
      setSection80EE({ ...deductions.data.section_80ee });
      setSection80EEB({ ...deductions.data.section_80eeb });
      setOtherDeductions({ ...deductions.data.other_deductions });
    }
  }, [deductions]);

  return (
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
              if (donation.file) {
                formData.append(`donations[${idx}][file]`, donation.file);
              }
            });
            for (let pair of formData.entries()) {
              console.log(pair[0] + ':', pair[1]);
            }
          }}
        >
          {({ values, setFieldValue, errors }) => (
            <Form>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name of Donee</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Receipt</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.donations.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          value={row.name}
                          placeholder="Name of Donee"
                          onChange={(e) => {
                            const newArr = [...values.donations];
                            newArr[idx].name = e.target.value;
                            setFieldValue('donations', newArr);
                          }}
                          error={Boolean(errors.donations?.[idx]?.name)}
                          helperText={errors.donations?.[idx]?.name}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          value={row.amount}
                          placeholder="Amount"
                          onChange={(e) => {
                            const newArr = [...values.donations];
                            newArr[idx].amount = e.target.value;
                            setFieldValue('donations', newArr);
                          }}
                          error={Boolean(errors.donations?.[idx]?.amount)}
                          helperText={errors.donations?.[idx]?.amount}
                        />
                      </TableCell>
                      <TableCell>
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
                          renderInput={(params) => <TextField {...params} placeholder="Mode" />}
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              const newArr = [...values.donations];
                              newArr[idx].file = e.target.files[0];
                              setFieldValue('donations', newArr);
                            }}
                          />
                        </Button>
                        {row.file && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              // Show file dialog or download
                              if (typeof row.file === 'string') {
                                window.open(row.file, '_blank');
                              } else {
                                window.open(URL.createObjectURL(row.file), '_blank');
                              }
                            }}
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                              const formData = new FormData();
                              formData.append('deductions', deductions.data.id);
                              formData.append('name', row.name || '');
                              formData.append('amount', row.amount || '');
                              formData.append('mode', row.mode || '');
                              if (row.file) {
                                if (row.file instanceof File) formData.append('file', row.file);
                              }
                              let type = 'post';
                              let url = `/income_tax_returns/section-80g/add/`;
                              if (row.id) {
                                type = 'put';
                                url = `/income_tax_returns/section-80g/${row.id}/update/`;
                              }
                              const response = await Factory(type, url, formData);
                              if (response.res.status_cd === 0) {
                                enqueueSnackbar(response.res.message, {
                                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                  variant: 'success'
                                });
                              } else {
                                enqueueSnackbar(response.res.message, {
                                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                  variant: 'error'
                                });
                              }
                            }}
                          >
                            Save
                          </Button>
                          {values.donations.length > 1 && (
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
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setFieldValue('donations', [...values.donations, { name: '', amount: '', mode: '', receipt: null }])}
                >
                  Add Row
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Card>

      {/* Section 80E, 80TTA/80TTB, 80U, and Other Deductions Combined */}
      <Formik
        initialValues={section80E}
        enableReinitialize
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.append('deductions', deductions.data.id);
          formData.append('amount', values.amount || '');
          formData.append('education_of', values.education_of || '');
          formData.append('borrower_name', values.borrower_name || '');
          formData.append('is_it_approved_bank', values.is_it_approved_bank || '');
          if (values.other_files) {
            Array.from(values.other_files).forEach((file) => {
              if (file instanceof File) formData.append('other_files', file);
            });
          }
          formData.append('loan_outstanding_as_on_31st_march', values.loan_outstanding_as_on_31st_march || '');
          const response = await Factory('post', `/income_tax_returns/section-80e/`, formData);
          if (response.res.status_cd === 0) {
            enqueueSnackbar('Section 80E saved successfully', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'success'
            });
          } else {
            enqueueSnackbar('Section 80E not saved', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'error'
            });
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80E - Interest on Education Loan
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Amount"
                    type="number"
                    name="amount"
                    value={values.amount}
                    onChange={(e) => setFieldValue('amount', e.target.value)}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={educationOfOptions}
                    getOptionLabel={(option) => option.charAt(0).toUpperCase() + option.slice(1)}
                    value={values.education_of}
                    onChange={(_, v) => setFieldValue('education_of', v)}
                    renderInput={(params) => <TextField {...params} label="Education of" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Borrower Name"
                    name="borrower_name"
                    value={values.borrower_name}
                    onChange={(e) => setFieldValue('borrower_name', e.target.value)}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography>Is it an approved Bank/NBFC?</Typography>
                  <RadioGroup row value={values.is_it_approved_bank} onChange={(_, v) => setFieldValue('is_it_approved_bank', v)}>
                    <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography>Upload sanction letter/interest Certificate/Other documents</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 7 }}>
                  <Box>
                    <Button variant="contained" component="label" size="small">
                      Upload
                      <input type="file" multiple hidden onChange={(e) => setFieldValue('other_files', e.target.files)} />
                    </Button>
                    {values.other_files && (
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        variant="outlined"
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData([values.other_files]);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 5 }}>
                  <Typography>Loan outstanding amount as on 31st March</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 7 }}>
                  <TextField
                    size="small"
                    label="Amount"
                    type="number"
                    name="loan_outstanding_as_on_31st_march"
                    value={values.loan_outstanding_as_on_31st_march}
                    onChange={(e) => setFieldValue('loan_outstanding_as_on_31st_march', e.target.value)}
                  />
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end">
                <Button size="small" variant="contained" color="primary" type="submit">
                  Save 80E
                </Button>
              </Box>
            </Card>
          </Form>
        )}
      </Formik>

      {/* Section 80EE - Interest on Loan Taken for Residential House Property */}
      <Formik
        initialValues={section80EE}
        enableReinitialize
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.append('deductions', deductions.data.id);
          formData.append('amount', values.amount || '');
          if (values.other_files) {
            Array.from(values.other_files).forEach((file) => {
              if (file instanceof File) formData.append('other_files', file);
            });
          }
          setSection80EE(values);
          const response = await Factory('post', `/income_tax_returns/section-80ee/`, formData);
          if (response.res.status_cd === 0) {
            enqueueSnackbar('Section 80EE saved successfully', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'success'
            });
          } else {
            enqueueSnackbar('Section 80EE not saved', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'error'
            });
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80EE - Interest on Loan Taken for Residential House Property
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography>Upload sanction letter/interest Certificate (other documents )</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Button variant="contained" component="label" size="small">
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          const file = e.target.files;
                          if (file) {
                            setFieldValue('other_files', file);
                          }
                        }}
                      />
                    </Button>
                    {values.other_files && (
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        variant="outlined"
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData([values.other_files]);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography>Loan amount outstanding as on 31st march</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    size="small"
                    label="Amount"
                    name="amount"
                    value={values.amount}
                    onChange={(e) => setFieldValue('amount', e.target.value)}
                  />
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end">
                <Button size="small" variant="contained" color="primary" type="submit">
                  Save 80EE
                </Button>
              </Box>
            </Card>
          </Form>
        )}
      </Formik>

      {/* Section 80EEB: Interest paid on purchase of Electric vehicle */}
      <Formik
        initialValues={section80EEB}
        enableReinitialize
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.append('vehicleRegistrationNumber', values.vehicleRegistrationNumber || '');
          formData.append('deductions', deductions.data.id);
          if (values.other_files) {
            Array.from(values.other_files).forEach((file) => {
              if (file instanceof File) formData.append('other_files', file);
            });
          }
          setSection80EEB(values);
          const response = await Factory('post', `/income_tax_returns/section-80ee/`, formData);
          if (response.res.status_cd === 0) {
            enqueueSnackbar('Section 80EEB saved successfully', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'success'
            });
          } else {
            enqueueSnackbar('Section 80EEB not saved', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'error'
            });
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section80 EEB: Interest paid on purchase of Electric vehicle
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography>Upload sanction letter/interest Certificate (other documents )</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Button variant="contained" component="label" size="small">
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFieldValue('other_files', file);
                          }
                        }}
                      />
                    </Button>
                    {values.other_files && (
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        variant="outlined"
                        onClick={() => {
                          if (typeof values.other_files === 'string') {
                            window.open(values.other_files, '_blank');
                          } else {
                            window.open(URL.createObjectURL(values.other_files), '_blank');
                          }
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography>Vehicle Registration Number</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    size="small"
                    label="Vehicle Registration Number"
                    name="vehicleRegistrationNumber"
                    value={values.vehicleRegistrationNumber}
                    onChange={(e) => setFieldValue('vehicleRegistrationNumber', e.target.value)}
                  />
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end">
                <Button size="small" variant="contained" color="primary" type="submit">
                  Save 80EEB
                </Button>
              </Box>
            </Card>
          </Form>
        )}
      </Formik>

      {/* Combine Section 80TTA/80TTB, 80U, and Other deductions into one form */}
      <Formik
        initialValues={otherDeductions}
        enableReinitialize
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.append('savingsInterest', values.savingsInterest || '');
          formData.append('fdInterest', values.fdInterest || '');
          formData.append('disabilityNature', values.disabilityNature || '');
          formData.append('disabilitySeverity', values.disabilitySeverity || '');
          formData.append('disabilityAmount', values.disabilityAmount || '');
          if (values.disabilityCert) {
            formData.append('disabilityCert', values.disabilityCert);
          }
          formData.append('rentHraPaid', values.rentHraPaid || '');
          formData.append('rentHraAmount', values.rentHraAmount || '');
          formData.append('firstHomeIsFirst', values.firstHomeIsFirst || '');
          formData.append('firstHomeInterest', values.firstHomeInterest || '');
          formData.append('firstHomeDate', values.firstHomeDate || '');
          formData.append('politicalDonated', values.politicalDonated || '');
          formData.append('politicalAmount', values.politicalAmount || '');
          for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
          }
          setOtherDeductions(values);
          let type = otherDeductions.id ? 'put' : 'post';
          let url = otherDeductions.id
            ? `/income_tax_returns/section-80ettattbu/${otherDeductions.id}/`
            : '/income_tax_returns/section-80ettattbu/';

          const response = await Factory(type, url, formData);
          if (response.res.status_cd === 0) {
            enqueueSnackbar('Section 80TTA/80TTB saved successfully', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'success'
            });
          } else {
            enqueueSnackbar('Section 80TTA/80TTB not saved', {
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'error'
            });
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
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
                    type="number"
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
                        type="number"
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
                          type="number"
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
                        type="number"
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
                  Save Other Deductions
                </Button>
              </Box>
            </Card>
          </Form>
        )}
      </Formik>

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
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Investment/Payment</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Document</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.investments.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
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
                              placeholder="Investment/Payment"
                              error={Boolean(errors.investments?.[idx]?.type)}
                              helperText={errors.investments?.[idx]?.type}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Amount"
                          type="number"
                          value={row.amount}
                          onChange={(e) => {
                            const newArr = [...values.investments];
                            newArr[idx].amount = e.target.value;
                            setFieldValue('investments', newArr);
                          }}
                          error={Boolean(errors.investments?.[idx]?.amount)}
                          helperText={errors.investments?.[idx]?.amount}
                        />
                      </TableCell>
                      <TableCell>
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
                        {row.doc && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              if (typeof row.doc === 'string') {
                                window.open(row.doc, '_blank');
                              } else {
                                window.open(URL.createObjectURL(row.doc), '_blank');
                              }
                            }}
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              const formData = new FormData();
                              formData.append('type', row.type || '');
                              formData.append('amount', row.amount || '');
                              if (row.doc) {
                                formData.append('doc', row.doc);
                              }
                              for (let pair of formData.entries()) {
                                console.log(pair[0] + ':', pair[1]);
                              }
                            }}
                          >
                            Save
                          </Button>
                          {values.investments.length > 1 && (
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
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
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
                    type="number"
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
                    type="number"
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
                    type="number"
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
                    type="number"
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
                    type="number"
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
      {/*upload loan Sanction document/interest certificate 
upload 
+upload 
*vehicle Registration Number 
Enter 
80DDB: 
Medical treatment of Specified disease 
*Name of Specified disease 
Enter 
*upload medical bills  */}
      <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
        <Formik
          initialValues={{
            specifiedDisease: '',
            medicalBills: null
          }}
          validationSchema={Yup.object().shape({
            specifiedDisease: Yup.string().required('Specified disease name is required'),
            medicalBills: Yup.mixed().required('Medical bills are required')
          })}
          onSubmit={(values) => {
            // Handle form submission
            const formData = new FormData();
            formData.append('specifiedDisease', values.specifiedDisease || '');
            formData.append('deductions', deductions.data.id);
            if (values.medicalBills) {
              formData.append('medicalBills', values.medicalBills);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, handleSubmit }) => (
            <Form>
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section80 DDB: Medical treatment of Specified disease
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography>Name of Specified disease</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Specified Disease"
                    name="specifiedDisease"
                    value={values.specifiedDisease}
                    onChange={(e) => setFieldValue('specifiedDisease', e.target.value)}
                    error={Boolean(touched.specifiedDisease && errors.specifiedDisease)}
                    helperText={touched.specifiedDisease && errors.specifiedDisease}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography>Upload medical bills</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Button variant="contained" component="label" size="small">
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFieldValue('medicalBills', file);
                          }
                        }}
                      />
                    </Button>
                    {values.medicalBills && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {values.medicalBills.name}
                      </Typography>
                    )}
                    {touched.medicalBills && errors.medicalBills && (
                      <Typography variant="caption" color="error">
                        {errors.medicalBills}
                      </Typography>
                    )}
                  </Box>
                </Grid2>
              </Grid2>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save
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
  );
};

export default Deductions;
