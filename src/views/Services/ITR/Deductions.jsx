import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import GetActionButtons from '../FormHelpers';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

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
import RaiseRequest from '../RaiseRequest';
const viewFile = async (url) => {
  const response = await Factory('get', `/docwallet/generate_presigned_url?url=${url}`, {}, {});
  if (response.res.status_cd === 0) {
    let url = response.res.data.url;
    window.open(url, '_blank');
  }
};

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
    self_family_non_senior_citizen: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    self_senior_citizen: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    parents_non_senior_citizen: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    parents_senior_citizen: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    preventive_health_checkup: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').notRequired(),
    file: Yup.array().notRequired()
  })
  .test('at-least-one', 'At least one amount is required', (values) => {
    return (
      values.self_family_non_senior_citizen ||
      values.self_senior_citizen ||
      values.parents_non_senior_citizen ||
      values.parents_senior_citizen ||
      values.preventive_health_checkup
    );
  });

const donationModes = ['Cash', 'Cheque', 'Online Transfer'];
const investmentTypes = ['PPF', 'NSC', 'ELSS', 'Life Insurance', 'Tuition Fees', 'Others'];
const educationOfOptions = ['self', 'spouse', 'children', 'dependent'];
const nature_of_disability = [
  'Blindness',
  'Deaf and Dumb',
  'Low Vision',
  'Leprosy Cured',
  'Hearing Impairment',
  'Locomotor Disability',
  'Mental Illness',
  'Mental Retardation',
  'Multiple Disabilities',
  'others'
];
const severity = ['40-80%', '>80%'];
const pay_rent_without_recieving_hra = ['Yes', 'No'];
const are_you_first_time_homebuyer = ['Yes', 'No'];
const donation_made_to_political_party = ['Yes', 'No'];

const Deductions = ({ deductions, setDeductions, service_id, step, setStep, setFileDialogOpen, setDialogFilesData }) => {
  const initialData = {
    section_80e: {
      amount: '',
      education_of: '',
      borrower_name: '',
      loan_outstanding_as_on_31st_march: '',
      is_it_approved_bank: 'false',
      other_files: null,
      document_files: { other_files: { files: [] } }
    },
    section_80ee: {
      loan_outstanding_as_on_31st_march: '',
      document_files: { other_files: { files: [] } }
    },
    section_80eeb: {
      vehicle_registration_number: '',
      documents: { other_files: { files: [] } }
    }
  };
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const [investments, setInvestments] = React.useState([{ investment: '', amount: '', file: null }]);
  const [donations, setDonations] = React.useState([{ name: '', amount: '', mode: '', file: null }]);
  const [mediclaim, setMediclaim] = React.useState({
    self_family_non_senior_citizen: '',
    self_senior_citizen: '',
    parents_non_senior_citizen: '',
    parents_senior_citizen: '',
    preventive_health_checkup: '',
    file: []
  });
  const [section80E, setSection80E] = useState(initialData.section_80e);
  const [section80EE, setSection80EE] = useState(initialData.section_80ee);
  const [section80EEB, setSection80EEB] = useState(initialData.section_80eeb);
  const [otherDeductions, setOtherDeductions] = useState({
    total_saving_interest: '',
    total_fd_interest: '',
    nature_of_disability: '',
    severity: '',
    deduction_amount: '',
    deduction_file: null,
    pay_rent_without_recieving_hra: 'false',
    pay_rent_amount: '',
    are_you_first_time_homebuyer: 'false',
    amount_of_interest_paid: '',
    date_of_loan_sanctioned: '',
    donation_made_to_political_party: 'false',
    donation_amount: ''
  });

  const [section80DDB, setSection80DDB] = useState({
    name_of_disease: '',
    files: []
  });

  useEffect(() => {
    if (deductions?.data) {
      if (deductions?.data?.section_80g?.length > 0) {
        setDonations([...deductions?.data?.section_80g]);
      }
      if (deductions?.data?.section_80e !== null) {
        setSection80E({
          ...deductions?.data?.section_80e,
          education_of: deductions?.data?.section_80e?.education_of ?? '',
          is_it_approved_bank: (deductions?.data?.section_80e?.is_it_approved_bank ?? 'false').toString()
        });
      }
      if (deductions?.data?.section_80ee?.length > 0) {
        setSection80EE({
          ...deductions?.data?.section_80ee[0]
        });
      }
      if (deductions?.data?.section_80eeb !== null) {
        setSection80EEB({
          ...deductions?.data?.section_80eeb
        });
      }
      if (deductions?.data?.section_80ettattbu !== null) {
        setOtherDeductions({
          ...deductions?.data?.section_80ettattbu,
          nature_of_disability: deductions?.data?.section_80ettattbu?.nature_of_disability ?? '',
          severity: deductions?.data?.section_80ettattbu?.severity ?? '',
          pay_rent_without_recieving_hra: deductions?.data?.section_80ettattbu?.pay_rent_without_recieving_hra ?? 'false',
          are_you_first_time_homebuyer: deductions?.data?.section_80ettattbu?.are_you_first_time_homebuyer ?? 'false',
          donation_made_to_political_party: deductions?.data?.section_80ettattbu?.donation_made_to_political_party ?? 'false'
        });
      }

      if (deductions?.data?.section_80c?.length > 0) {
        setInvestments([...deductions?.data?.section_80c]);
      }
      if (deductions?.data?.section_80d !== null) {
        setMediclaim({
          ...deductions?.data?.section_80d,
          file: deductions?.data?.section_80d?.section_80d_documents
        });
      }
      if (deductions?.data?.section_80ddb !== null) {
        setSection80DDB({
          ...deductions?.data?.section_80ddb,
          files: deductions?.data?.section_80ddb?.documents
        });
      }
    }
  }, [deductions]);
   if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Section 80G - Donations */}
      <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography variant="h5" mb={2} sx={{ textDecoration: 'underline' }}>
            Section 80G - Deduction for Donations made
          </Typography>
        </Stack>
        <Formik initialValues={{ donations }} enableReinitialize validationSchema={donationsSchema}>
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
                            sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
                           sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
                           sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
                             sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
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
                                viewFile(row.file, '_blank');
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
                              setIsLoading(true);
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
                                if (type === 'post') {
                                  let __donations = donations;
                                  __donations[idx] = response.res.data;
                                  setDonations([...__donations]);
                                  setFieldValue('donations', [...__donations]);
                                }
                                enqueueSnackbar('Saved Successfully', {
                                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                  variant: 'success'
                                });
                              } else {
                                enqueueSnackbar('Error saving data', {
                                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                  variant: 'error'
                                });
                              }
                              setIsLoading(false);
                            }}
                          >
                            Save
                          </Button>
                          {values?.donations?.length > 1 && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={async () => {
                                const response = await Factory('delete', `/income_tax_returns/section-80g/${row.id}/delete/`);
                                if (response.res.status_cd === 0) {
                                  const newArr = values.donations.filter((_, i) => i !== idx);
                                  setFieldValue('donations', newArr);
                                  enqueueSnackbar('Donation deleted successfully', {
                                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                    variant: 'success'
                                  });
                                } else {
                                  enqueueSnackbar('Error deleting data', {
                                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                    variant: 'error'
                                  });
                                }
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
        initialValues={{
          ...section80E,
          education_of: section80E.education_of ?? '',
          is_it_approved_bank: section80E.is_it_approved_bank ?? 'false'
        }}
        enableReinitialize
        onSubmit={async (values) => {
          setIsLoading(true);
          const formData = new FormData();
          formData.append('deductions', deductions.data.id);
          formData.append('amount', values.amount || '');
          formData.append('education_of', values.education_of || '');
          formData.append('borrower_name', values.borrower_name || '');
          formData.append('is_it_approved_bank', values.is_it_approved_bank || '');
          if (values.document_files.other_files.files) {
            Array.from(values.document_files.other_files.files).forEach((file) => {
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
          setIsLoading(false);
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
                  <Typography variant="subtitle1">Loan Amount <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Loan Amount"
                    type="number"
                    name="amount"
                    value={values.amount}
                    onChange={(e) => setFieldValue('amount', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Typography variant="subtitle1">Education of  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={educationOfOptions}
                    getOptionLabel={(option) => option.charAt(0).toUpperCase() + option.slice(1)}
                    value={values.education_of ?? ''}
                    onChange={(_, v) => setFieldValue('education_of', v)}
                    renderInput={(params) => <TextField {...params} placeholder="Education of" />}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Typography variant="subtitle1">Borrower Name  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Borrower Name"
                    name="borrower_name"
                    value={values.borrower_name}
                    onChange={(e) => setFieldValue('borrower_name', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle1">Is it an approved Bank/NBFC?  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <RadioGroup row value={values.is_it_approved_bank} onChange={(_, v) => setFieldValue('is_it_approved_bank', v)}>
                    <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography variant="subtitle1">Upload sanction letter/interest Certificate/Other documents <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 7 }}>
                  <Box>
                    <Button variant="contained" component="label" size="small">
                      Upload
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                          setFieldValue('document_files.other_files.files', [
                            ...e.target.files,
                            ...values.document_files.other_files.files
                          ]);
                        }}
                      />
                    </Button>
                    {values?.document_files?.other_files.files.length > 0 && (
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        variant="outlined"
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({
                            files: values.document_files.other_files.files || values.document_files.other_files,
                            urlEndpoint: 'section-80e'
                          });
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 5 }}>
                  <Typography variant="subtitle1">Loan outstanding amount as on 31st March  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 7 }}>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Loan outstanding amount as on 31st March"
                    name="loan_outstanding_as_on_31st_march"
                    value={values.loan_outstanding_as_on_31st_march}
                    onChange={(e) => setFieldValue('loan_outstanding_as_on_31st_march', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
        initialValues={{
          ...section80EE,
          loan_outstanding_as_on_31st_march: section80EE.loan_outstanding_as_on_31st_march ?? ''
        }}
        enableReinitialize
        onSubmit={async (values) => {
          setIsLoading(true);
          const formData = new FormData();
          formData.append('deductions', deductions.data.id);
          formData.append('loan_outstanding_as_on_31st_march', values.loan_outstanding_as_on_31st_march || '');
          if (values.document_files.other_files.files) {
            Array.from(values.document_files.other_files.files).forEach((file) => {
              if (file instanceof File) formData.append('other_files', file);
            });
          }
          setSection80EE(values);
          const response = await Factory('post', `/income_tax_returns/section-80ee/upsert/`, formData);
          if (response.res.status_cd === 0) {
            // setSection80EE([response.res.data.data]);
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
          setIsLoading(false);
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
                  <Typography variant="subtitle1">Upload sanction letter/interest Certificate ( other documents )  <span style={{ color: 'red' }}> *</span></Typography>
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
                            setFieldValue('document_files.other_files.files', [...file, ...values.document_files.other_files.files]);
                          }
                        }}
                      />
                    </Button>
                    {console.log(values?.document_files?.other_files?.files)}
                    {values?.document_files?.other_files?.files.length > 0 && (
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        variant="outlined"
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({
                            files: values?.document_files?.other_files?.files,
                            urlEndpoint: 'section-80ee',
                            removeFunction: (file) => {
                              let updated = [...values.document_files.other_files.files];
                              updated.splice(updated.indexOf(file), 1);
                              setFieldValue('document_files.other_files.files', updated);

                              setSection80EE({
                                ...section80EE,
                                document_files: {
                                  ...section80EE.document_files,
                                  other_files: { ...section80EE.document_files.other_files, files: updated }
                                }
                              });
                            }
                          });
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography variant="subtitle1">Loan amount outstanding as on 31st march  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    size="small"
                    label="Amount"
                    name="loan_outstanding_as_on_31st_march"
                    value={values.loan_outstanding_as_on_31st_march}
                    onChange={(e) => setFieldValue('loan_outstanding_as_on_31st_march', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
        initialValues={{
          ...section80EEB,
          vehicle_registration_number: section80EEB.vehicle_registration_number ?? ''
        }}
        enableReinitialize
        onSubmit={async (values) => {
          setIsLoading(true);
          const formData = new FormData();
          formData.append('vehicle_registration_number', values.vehicle_registration_number || '');
          formData.append('deductions', deductions.data.id);
          if (values.documents.other_files.files) {
            Array.from(values.documents.other_files.files).forEach((file) => {
              if (file instanceof File) formData.append('other_files', file);
            });
          }
          setSection80EEB(values);
          const response = await Factory('post', `/income_tax_returns/section-80eeb/upsert/`, formData);
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
          setIsLoading(false);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80EEB: Interest paid on purchase of Electric vehicle
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography variant="subtitle1">Upload sanction letter/interest Certificate (other documents ) <span style={{ color: 'red' }}> *</span></Typography>
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
                            setFieldValue('documents.other_files.files', [...file, ...values.documents.other_files.files]);
                          }
                        }}
                      />
                    </Button>
                    {values.documents.other_files.files.length > 0 && (
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        variant="outlined"
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({
                            files: values.documents.other_files.files,
                            urlEndpoint: 'section-80eeb'
                          });
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography variant="subtitle1">Vehicle Registration Number  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    size="small"
                    label="Vehicle Registration Number"
                    name="vehicle_registration_number"
                    value={values.vehicle_registration_number}
                    onChange={(e) => setFieldValue('vehicle_registration_number', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
        initialValues={{
          ...otherDeductions,
          nature_of_disability: otherDeductions.nature_of_disability ?? '',
          severity: otherDeductions.severity ?? '',
          pay_rent_without_recieving_hra: otherDeductions.pay_rent_without_recieving_hra ?? 'false',
          are_you_first_time_homebuyer: otherDeductions.are_you_first_time_homebuyer ?? 'false',
          donation_made_to_political_party: otherDeductions.donation_made_to_political_party ?? 'false'
        }}
        enableReinitialize
        onSubmit={async (values) => {
          setIsLoading(true);
          const formData = new FormData();
          formData.append('deductions', deductions.data.id);
          formData.append('total_saving_interest', values.total_saving_interest || '');
          formData.append('total_fd_interest', values.total_fd_interest || '');
          formData.append('nature_of_disability', values.nature_of_disability || '');
          formData.append('severity', values.severity || '');
          formData.append('deduction_amount', values.deduction_amount || '');
          if (values.deduction_file) {
            if (values.deduction_file instanceof File) formData.append('deduction_file', values.deduction_file);
          }
          formData.append('pay_rent_without_recieving_hra', values.pay_rent_without_recieving_hra || 'false');
          formData.append('pay_rent_amount', values.pay_rent_amount || '');
          formData.append('are_you_first_time_homebuyer', values.are_you_first_time_homebuyer || 'false');
          formData.append('amount_of_interest_paid', values.amount_of_interest_paid || '');
          formData.append('date_of_loan_sanctioned', values.date_of_loan_sanctioned || '');
          formData.append('donation_made_to_political_party', values.donation_made_to_political_party || '');
          formData.append('donation_amount', values.donation_amount || '');
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
          setIsLoading(false);
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
                    name="total_saving_interest"
                    value={values.total_saving_interest}
                    onChange={(e) => setFieldValue('total_saving_interest', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Total FD/RD interest (above 60 yrs)"
                    name="total_fd_interest"
                    value={values.total_fd_interest}
                    onChange={(e) => setFieldValue('total_fd_interest', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
                    options={nature_of_disability}
                    value={values.nature_of_disability ?? ''}
                    onChange={(_, v) => setFieldValue('nature_of_disability', v)}
                    renderInput={(params) => <TextField {...params} label="Nature of Disability" />}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={severity}
                    value={values.severity ?? ''}
                    onChange={(_, v) => setFieldValue('severity', v)}
                    renderInput={(params) => <TextField {...params} label="Severity" />}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Deduction Amount"
                    type="number"
                    name="deduction_amount"
                    value={values.deduction_amount}
                    onChange={(e) => setFieldValue('deduction_amount', e.target.value)}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button size="small" variant="contained" sx={{ mr: 1 }} component="label">
                    Upload Certificate
                    <input type="file" hidden onChange={(e) => setFieldValue('deduction_file', e.target.files[0])} />
                  </Button>
                  {values.deduction_file && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (values.deduction_file instanceof File) {
                          window.open(URL.createObjectURL(values.deduction_file), '_blank');
                        } else {
                          viewFile(values.deduction_file);
                        }
                      }}
                    >
                      View
                    </Button>
                  )}
                </Grid2>
              </Grid2>

              {/* Other Deductions */}
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Other deductions
              </Typography>
              {/* Did you pay Rent without receiving HRA? */}
              <Grid2 container alignItems="center" spacing={2} mb={3}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle1">Did you pay Rent without receiving HRA?  <span style={{ color: 'red' }}> *</span></Typography>
                  <RadioGroup
                    row
                    value={values.pay_rent_without_recieving_hra}
                    onChange={(_, v) => setFieldValue('pay_rent_without_recieving_hra', v)}
                  >
                    <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 8 }}>
                  {values.pay_rent_without_recieving_hra === true && (
                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                      <Typography>Amount</Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={values.pay_rent_amount}
                        onChange={(e) => setFieldValue('pay_rent_amount', e.target.value)}
                        sx={{ maxWidth: 200 }}
                      />
                    </Box>
                  )}
                </Grid2>
              </Grid2>
              {/* Are you a first time homebuyer? */}
              <Grid2 container alignItems="center" spacing={2} mb={3}>
                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <Typography variant="subtitle1">Are you a first time homebuyer?  <span style={{ color: 'red' }}> *</span></Typography>
                  <RadioGroup
                    row
                    value={values.are_you_first_time_homebuyer}
                    onChange={(_, v) => setFieldValue('are_you_first_time_homebuyer', v)}
                  >
                    <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                {values.are_you_first_time_homebuyer === true && (
                  <>
                    <Grid2 size={{ xs: 12, sm: 4.5 }}>
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Typography variant="subtitle1">Amount of interest paid</Typography>
                        <TextField
                          size="small"
                          type="number"
                          value={values.amount_of_interest_paid}
                          onChange={(e) => setFieldValue('amount_of_interest_paid', e.target.value)}
                          // sx={{ maxWidth: 200 }}
                           sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                        />
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4.5 }}>
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Typography variant="subtitle1">Date of Loan Sanctioned</Typography>
                        <TextField
                          size="small"
                          type="date"
                          value={values.date_of_loan_sanctioned}
                          onChange={(e) => setFieldValue('date_of_loan_sanctioned', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          // sx={{ maxWidth: 200 }}
                           sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                        />
                      </Box>
                    </Grid2>
                  </>
                )}
              </Grid2>

              {/* Donations made to political/party (80GGC)? */}
              <Grid2 container alignItems="center" spacing={2} mb={3}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle1">Donations made to political/rural i&d org?  <span style={{ color: 'red' }}> *</span></Typography>
                  <RadioGroup
                    row
                    value={values.donation_made_to_political_party}
                    onChange={(_, v) => setFieldValue('donation_made_to_political_party', v)}
                  >
                    <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 8 }}>
                  {values.donation_made_to_political_party === true && (
                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                      <Typography variant="subtitle1">Amount</Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={values.donation_amount}
                        onChange={(e) => setFieldValue('donation_amount', e.target.value)}
                        // sx={{ maxWidth: 200 }}
                         sx={{
                                  width: '20%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
        <Formik initialValues={{ investments }} enableReinitialize validationSchema={investmentsSchema}>
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
                          value={row?.investment}
                          onChange={(_, v) => {
                            const newArr = [...values.investments];
                            newArr[idx].investment = v;
                            setFieldValue('investments', newArr);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Investment/Payment"
                              error={Boolean(errors.investments?.[idx]?.investment)}
                              helperText={errors.investments?.[idx]?.investment}
                               sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
                          value={row?.amount}
                          onChange={(e) => {
                            const newArr = [...values.investments];
                            newArr[idx].amount = e.target.value;
                            setFieldValue('investments', newArr);
                          }}
                          error={Boolean(errors.investments?.[idx]?.amount)}
                          helperText={errors.investments?.[idx]?.amount}
                           sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
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
                              // newArr[idx].file = e.target.files[0];
                              newArr[idx].documents = [e.target.files[0]];
                              setFieldValue('investments', newArr);
                            }}
                          />
                        </Button>
                        {row?.documents?.length > 0 && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              if (row?.documents[0] instanceof File) {
                                window.open(URL.createObjectURL(row?.documents[0]), '_blank');
                              } else {
                                viewFile(row?.documents[0].file_url);
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
                              setIsLoading(true);
                              const formData = new FormData();
                              formData.append('deductions', deductions.data.id || '');
                              formData.append('investment', row.investment || '');
                              formData.append('amount', row.amount || '');
                              if (row?.documents && row.documents[0] instanceof File) {
                                formData.append('file', row.documents[0]);
                              }

                              let type = row.id ? 'put' : 'post';
                              let url = row.id ? `/income_tax_returns/section-80c/${row.id}/` : `/income_tax_returns/section-80c/`;
                              const response = await Factory(type, url, formData);
                              if (response.res.status_cd === 0) {
                                if (type === 'post') {
                                  let __investments = investments;
                                  __investments[idx] = response.res;
                                  setInvestments([...__investments]);
                                  setFieldValue('investments', [...__investments]);
                                }
                                enqueueSnackbar('Saved Successfully', {
                                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                  variant: 'success'
                                });
                              } else {
                                enqueueSnackbar('Error saving data', {
                                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                  variant: 'error'
                                });
                              }
                              setIsLoading(false);
                            }}
                          >
                            Save
                          </Button>
                          {values?.investments?.length > 1 && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                const newArr = values?.investments?.filter((_, i) => i !== idx);
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
          onSubmit={async (values) => {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('deductions', deductions.data.id || '');
            formData.append('self_family_non_senior_citizen', values.self_family_non_senior_citizen || '');
            formData.append('self_senior_citizen', values.self_senior_citizen || '');
            formData.append('parents_non_senior_citizen', values.parents_non_senior_citizen || '');
            formData.append('parents_senior_citizen', values.parents_senior_citizen || '');
            formData.append('preventive_health_checkup', values.preventive_health_checkup || '');
            if (Array.isArray(values.file)) {
              values.file.forEach((file, idx) => {
                if (file instanceof File) formData.append('files', file);
              });
            }
            let url = `/income_tax_returns/section-80d/full/`;
            const response = await Factory('post', url, formData);
            if (response.res.status_cd === 0) {
              enqueueSnackbar('Saved Successfully', {
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'success'
              });
            } else {
              enqueueSnackbar('Error saving data', {
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'error'
              });
            }
            setIsLoading(false);
          }}
        >
          {({ values, setFieldValue, errors }) => (
            <Form>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle1">Self & Family (Non-senior citizen)  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Amount"
                    type="number"
                    value={values.self_family_non_senior_citizen}
                    onChange={(e) => setFieldValue('self_family_non_senior_citizen', e.target.value)}
                    error={Boolean(errors.self_family_non_senior_citizen)}
                    helperText={errors.self_family_non_senior_citizen}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle1">Self (Senior Citizen)  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Amount"
                    type="number"
                    value={values.self_senior_citizen}
                    onChange={(e) => setFieldValue('self_senior_citizen', e.target.value)}
                    error={Boolean(errors.self_senior_citizen)}
                    helperText={errors.self_senior_citizen}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle1">Parents (Non-senior)  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Amount"
                    type="number"
                    value={values.parents_non_senior_citizen}
                    onChange={(e) => setFieldValue('parents_non_senior_citizen', e.target.value)}
                    error={Boolean(errors.parents_non_senior_citizen)}
                    helperText={errors.parents_non_senior_citizen}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle1">Parents (Senior)  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Amount"
                    type="number"
                    value={values.parents_senior_citizen}
                    onChange={(e) => setFieldValue('parents_senior_citizen', e.target.value)}
                    error={Boolean(errors.parents_senior_citizen)}
                    helperText={errors.parents_senior_citizen}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle1">Preventive Health Checkup  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Amount"
                    type="number"
                    value={values.preventive_health_checkup}
                    onChange={(e) => setFieldValue('preventive_health_checkup', e.target.value)}
                    error={Boolean(errors.preventive_health_checkup)}
                    helperText={errors.preventive_health_checkup}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle1">Upload premium receipts  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => setFieldValue('file', [...(values.file || []), ...e.target.files])}
                      />
                    </Button>
                    {values.file && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: values.file, urlEndpoint: 'section-80d' });
                        }}
                      >
                        View
                      </Button>
                    )}
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
      {/* 80DDB: Medical treatment of Specified disease */}
      <Card sx={{ mb: 3, p: { xs: 2, sm: 3 } }}>
        <Formik
          initialValues={section80DDB}
          enableReinitialize
          validationSchema={Yup.object().shape({
            name_of_disease: Yup.string().required('Specified disease name is required'),
            files: Yup.mixed().required('Medical bills are required')
          })}
          onSubmit={async (values) => {
            setIsLoading(true);
            // Handle form submission
            const formData = new FormData();
            formData.append('deductions', deductions.data.id);
            formData.append('name_of_disease', values.name_of_disease || '');
            Array.from(values.files).forEach((file) => {
              if (file instanceof File) formData.append('files', file);
            });

            const response = await Factory('post', `/income_tax_returns/section-80ddb/upsert/`, formData);
            if (response.res.status_cd === 0) {
              enqueueSnackbar('Saved Successfully', {
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'success'
              });
            } else {
              enqueueSnackbar('Error saving data', {
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'error'
              });
            }
            setIsLoading(false);
          }}
        >
          {({ values, errors, touched, setFieldValue, handleSubmit }) => (
            <Form>
              <Typography variant="h5" mt={0} mb={2} sx={{ textDecoration: 'underline' }}>
                Section 80DDB: Medical treatment of Specified disease
              </Typography>
              <Grid2 container spacing={2} alignItems="center" mb={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography variant="subtitle1">Name of Specified disease  <span style={{ color: 'red' }}> *</span></Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Specified Disease"
                    name="name_of_disease"
                    value={values.name_of_disease}
                    onChange={(e) => setFieldValue('name_of_disease', e.target.value)}
                    error={Boolean(touched.name_of_disease && errors.name_of_disease)}
                    helperText={touched.name_of_disease && errors.name_of_disease}
                     sx={{
                                  width: '100%',
                                   '& .MuiInputBase-input': {
                                     color: 'grey.600'
                                     }
                                   }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 5 }}>
                  <Typography variant="subtitle1">Upload medical bills  <span style={{ color: 'red' }}> *</span></Typography>
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
                            setFieldValue('files', [...values.files, ...file]);
                          }
                        }}
                      />
                    </Button>
                    {values.files && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: values.files, urlEndpoint: 'section-80ddb' });
                        }}
                        sx={{ ml: 1 }}
                      >
                        View
                      </Button>
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
        <Stack direction="row" spacing={1}>
          <RaiseRequest fields={[]} task_id={deductions?.task_id} />

          <GetActionButtons
            type="post"
            urlEndpoint="/income_tax_returns/deductions/upsert/"
            status={deductions?.data?.status}
            data={deductions}
            service_request={service_id}
            task_id={deductions?.task_id}
          />
          <Button variant="contained" color="primary" onClick={() => setStep(step + 1)}>
            Continue
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Deductions;
