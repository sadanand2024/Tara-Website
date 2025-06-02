import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid2,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Radio,
  FormControlLabel,
  Card,
  Paper,
  Autocomplete,
  RadioGroup,
  Stack,
  IconButton
} from '@mui/material';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import GetActionButtons from '../FormHelpers';
import Factory from '../../../utils/Factory';
const docTypes = [
  { key: 'form16', label: 'Form 16' },
  { key: 'payslip', label: 'Payslip' },
  { key: 'bank', label: 'Bank Statement' }
];

const foreignDocTypes = [
  { key: 'foreignSalarySlip', label: 'Foreign Salary Slip' },
  { key: 'foreignBankStmt', label: 'Foreign Bank Statement' },
  { key: 'taxPaidAbroad', label: 'Tax Paid Certificate Abroad' }
];

const SalaryIncome = ({ data, fileDialogOpen, setFileDialogOpen, filesData, setDialogFilesData, service_id }) => {
  const { enqueueSnackbar } = useSnackbar();
  const salary_income = data.find((item) => item.category_name === 'Salary Income');
  const other_income = data.find((item) => item.category_name === 'Other Income');
  const nri_employee_salary = data.find((item) => item.category_name === 'NRI Employee Salary');
  // Validation schemas
  const docsSchema = Yup.object({
    notes: Yup.object({
      form16: Yup.string(),
      payslip: Yup.string(),
      bank: Yup.string()
    })
  });
  const otherIncomeSchema = Yup.object({
    otherIncome: Yup.array().of(
      Yup.object({
        details: Yup.string(),
        amount: Yup.string(),
        file: Yup.mixed(),
        notes: Yup.string()
      })
    )
  });
  const foreignSchema = Yup.object({
    periodFrom: Yup.string(),
    periodTo: Yup.string(),
    country: Yup.string()
  });

  // Initial values
  const docsInitial = {
    docs: {
      form16: salary_income.data.length > 0 ? salary_income.data[0].documents.FORM_16 : [],
      payslip: salary_income.data.length > 0 ? salary_income.data[0].documents.PAYSLIP : [],
      bank: salary_income.data.length > 0 ? salary_income.data[0].documents.BANK_STATEMENT : []
    },
    notes: {
      form16: salary_income.data.length > 0 ? salary_income.data[0].form_16_notes : '',
      payslip: salary_income.data.length > 0 ? salary_income.data[0].payslip_notes : '',
      bank: salary_income.data.length > 0 ? salary_income.data[0].bank_statement_notes : ''
    }
  };
  const otherIncomeInitial = {
    otherIncome:
      other_income.data.length > 0
        ? other_income.data
        : [
            {
              amount: '',
              details: '',
              file: [],
              notes: ''
            }
          ]
  };
  const foreignInitial = {
    foreignDocs: {
      foreignSalarySlip: nri_employee_salary.data.length > 0 ? nri_employee_salary.data[0].foreigner_documents.salary_slip_files.files : [],
      foreignBankStmt:
        nri_employee_salary.data.length > 0 ? nri_employee_salary.data[0].foreigner_documents.bank_statement_files.files : [],
      taxPaidAbroad:
        nri_employee_salary.data.length > 0 ? nri_employee_salary.data[0].foreigner_documents.tax_paid_certificate_board_files.files : []
    },
    periodFrom:
      nri_employee_salary.data.length > 0 && nri_employee_salary.data[0].employment_history.length > 0
        ? nri_employee_salary.data[0].employment_history[0].from_date
        : '',
    periodTo:
      nri_employee_salary.data.length > 0 && nri_employee_salary.data[0].employment_history.length > 0
        ? nri_employee_salary.data[0].employment_history[0].to_date
        : '',
    country:
      nri_employee_salary.data.length > 0 && nri_employee_salary.data[0].employment_history.length > 0
        ? nri_employee_salary.data[0].employment_history[0].country
        : '',
    salaryReceivedIn:
      nri_employee_salary.data.length > 0 && nri_employee_salary.data[0].employment_history.length > 0
        ? nri_employee_salary.data[0].employment_history[0].salary_received
        : ''
  };

  // Section 1: Upload Required Documents
  const docsFormik = useFormik({
    initialValues: docsInitial,
    // validationSchema: docsSchema,
    onSubmit: async (values) => {
      let type = salary_income.data.length > 0 ? 'put' : 'post';
      let url =
        salary_income.data.length > 0
          ? `/income_tax_returns/salary-income/${salary_income.data[0].id}/`
          : '/income_tax_returns/salary-income/';
      let formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', salary_income.task_id);
      if (values.docs.bank && Array.isArray(values.docs.bank)) {
        values.docs.bank.forEach((bank) => {
          if (bank instanceof File) {
            formData.append('bank_statement_files', bank);
          }
        });
      }
      if (values.docs.form16 && Array.isArray(values.docs.form16)) {
        values.docs.form16.forEach((form16) => {
          if (form16 instanceof File) {
            formData.append('form16_files', form16);
          }
        });
      }
      if (values.docs.payslip && Array.isArray(values.docs.payslip)) {
        values.docs.payslip.forEach((payslip) => {
          if (payslip instanceof File) {
            formData.append('payslip_files', payslip);
          }
        });
      }
      formData.append('bank_statement_notes', values.notes.bank);
      formData.append('form_16_notes', values.notes.form16);
      formData.append('payslip_notes', values.notes.payslip);
      formData.append('status', 'in progress');
      const res = await Factory(type, url, formData, {});
      if (res.res.status_cd === 0) {
        enqueueSnackbar('Documents saved successfully!', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        enqueueSnackbar('Error saving documents!', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    }
  });

  // Section 2: Details of any other income you wish to share
  const otherIncomeFormik = useFormik({
    initialValues: otherIncomeInitial,
    // validationSchema: otherIncomeSchema,
    onSubmit: (values) => {
      console.log('Saved Other Income!\n' + JSON.stringify(values, null, 2));
    }
  });

  // Section 3: Foreign/NRI Employment & Salary Details
  const foreignFormik = useFormik({
    initialValues: foreignInitial,
    // validationSchema: foreignSchema,
    onSubmit: async (values) => {
      console.log('Saved Foreign/NRI Employment & Salary Details!\n', values);
      let url = '/income_tax_returns/nri-salary-details/upsert/';
      let employment_history = [
        { from_date: values.periodFrom, to_date: values.periodTo, country: values.country, salary_received: values.salaryReceivedIn }
      ];
      let formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', nri_employee_salary.task_id);
      formData.append('status', 'in progress');
      formData.append('employment_history', JSON.stringify(employment_history));
      if (values.foreignDocs.foreignBankStmt && Array.isArray(values.foreignDocs.foreignBankStmt)) {
        values.foreignDocs.foreignBankStmt.forEach((bank) => {
          if (bank instanceof File) {
            formData.append('bank_statement_files', bank);
          }
        });
      }
      if (values.foreignDocs.taxPaidAbroad && Array.isArray(values.foreignDocs.taxPaidAbroad)) {
        values.foreignDocs.taxPaidAbroad.forEach((tax) => {
          if (tax instanceof File) {
            formData.append('tax_paid_certificate_board_files', tax);
          }
        });
      }
      if (values.foreignDocs.foreignSalarySlip && Array.isArray(values.foreignDocs.foreignSalarySlip)) {
        values.foreignDocs.foreignSalarySlip.forEach((salary) => {
          if (salary instanceof File) {
            formData.append('salary_slip_files', salary);
          }
        });
      }

      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const res = await Factory('post', url, formData, {});
      if (res.res.status_cd === 0) {
        enqueueSnackbar('Foreign/NRI Employment & Salary Details saved successfully!', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        enqueueSnackbar('Error saving Foreign/NRI Employment & Salary Details!', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    }
  });

  return (
    <>
      {/* Section 1: Upload Required Documents */}
      <form onSubmit={docsFormik.handleSubmit} autoComplete="off">
        <Typography variant="h5" mb={2} sx={{ textDecoration: 'underline' }}>
          Upload Required Documents
        </Typography>
        <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Document Type</TableCell>
                <TableCell>Uploads</TableCell>
                <TableCell align="center">Actions</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ alignItems: 'flex-start' }}>
              {docTypes.map((doc) => {
                return (
                  <TableRow key={doc.key} sx={{ height: 50, verticalAlign: 'center' }}>
                    <TableCell>{doc.label}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body2" sx={{ minHeight: 24 }}>
                          {docsFormik.values.docs[doc.key]?.count || 0} file(s)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="contained" component="label" sx={{ mb: 0.5 }}>
                            {docsFormik.values.docs[doc.key]?.length > 0 ? 'Add more' : 'Upload'}
                            <input
                              type="file"
                              hidden
                              multiple={true}
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  docsFormik.setFieldValue(`docs.${doc.key}`, [...docsFormik.values.docs[doc.key], ...e.target.files]);
                                }
                              }}
                            />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 0.5 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              setDialogFilesData(docsFormik.values.docs[doc.key].files);
                            }}
                          >
                            View
                          </Button>
                        </Stack>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={docsFormik.values.notes[doc.key]}
                        onChange={(e) => docsFormik.setFieldValue(`notes.${doc.key}`, e.target.value)}
                        placeholder="Add note"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Save Documents
          </Button>
        </Box>
      </form>
      {/* Section 2: Details of any other income you wish to share */}
      <FormikProvider value={otherIncomeFormik}>
        <form onSubmit={otherIncomeFormik.handleSubmit} autoComplete="off">
          <Typography variant="h5" mt={4} mb={2} sx={{ textDecoration: 'underline' }}>
            Details of any other income you wish to share
          </Typography>
          <FieldArray
            name="otherIncome"
            render={(arrayHelpers) => (
              <>
                <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Details</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell align="center">Document</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {otherIncomeFormik.values.otherIncome.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Details"
                              value={row.details}
                              onChange={(e) => otherIncomeFormik.setFieldValue(`otherIncome[${idx}].details`, e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Amount"
                              type="number"
                              value={row.amount}
                              onChange={(e) => otherIncomeFormik.setFieldValue(`otherIncome[${idx}].amount`, e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Notes"
                              value={row.notes}
                              onChange={(e) => otherIncomeFormik.setFieldValue(`otherIncome[${idx}].notes`, e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="contained" component="label" sx={{ mr: 1 }}>
                              Upload
                              <input
                                type="file"
                                hidden
                                multiple={false}
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    otherIncomeFormik.setFieldValue(`otherIncome[${idx}].file`, e.target.files[0]);
                                  }
                                }}
                              />
                            </Button>
                            {row.file && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setFileDialogOpen(true);
                                  setDialogFilesData([{ url: row.file }]);
                                }}
                              >
                                View
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0}>
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={async () => {
                                  const row = otherIncomeFormik.values.otherIncome[idx];
                                  const formData = new FormData();
                                  formData.append('service_request', service_id);
                                  formData.append('service_task', other_income.task_id);
                                  formData.append('status', 'in progress');
                                  formData.append('details', row.details || '');
                                  formData.append('amount', row.amount || '');
                                  formData.append('notes', row.notes || '');
                                  formData.append('file', row.file);
                                  let type = 'post';
                                  let url = '/income_tax_returns/other-income-details/';
                                  if (row.id) {
                                    type = 'put';
                                    url = `/income_tax_returns/other-income-details/${row.id}/`;
                                  }
                                  const res = await Factory(type, url, formData, {});
                                  if (res.res.status_cd === 0) {
                                    enqueueSnackbar('Other income saved successfully!', {
                                      variant: 'success',
                                      anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                    });
                                  }
                                  // Here you can call your API with formData
                                }}
                              >
                                Save
                              </Button>
                              {otherIncomeFormik.values.otherIncome.length > 1 && (
                                <Button size="small" color="error" onClick={() => arrayHelpers.remove(idx)}>
                                  <DeleteIcon />
                                </Button>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => arrayHelpers.push({ details: '', amount: '', document: null, notes: '' })}
                  >
                    Add row
                  </Button>
                </Box>
              </>
            )}
          />
          {/* <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Save Other Income
            </Button>
          </Box> */}
        </form>
      </FormikProvider>

      {/* Section 3: Foreign/NRI Employment & Salary Details */}
      <form onSubmit={foreignFormik.handleSubmit} autoComplete="off">
        <Typography variant="h5" mt={5} mb={2} sx={{ textDecoration: 'underline' }}>
          Foreign/NRI Employment & Salary Details
        </Typography>
        <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Document Type</TableCell>
                <TableCell>Uploads</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ alignItems: 'flex-start' }}>
              {foreignDocTypes.map((doc) => {
                return (
                  <TableRow key={doc.key} sx={{ height: 50, verticalAlign: 'center' }}>
                    <TableCell>{doc.label}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body2" sx={{ minHeight: 24 }}>
                          {foreignFormik.values.foreignDocs[doc.key]?.length || 0} file(s)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Box>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 0.5 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              setDialogFilesData(foreignFormik.values.foreignDocs[doc.key]);
                            }}
                          >
                            View
                          </Button>
                          <Button size="small" variant="contained" component="label" sx={{ mb: 0.5 }}>
                            {foreignFormik.values.foreignDocs[doc.key]?.length ? 'Add more' : 'Upload'}
                            <input
                              type="file"
                              hidden
                              multiple={true}
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  foreignFormik.setFieldValue(`foreignDocs.${doc.key}`, [
                                    ...foreignFormik.values.foreignDocs[doc.key],
                                    ...Array.from(e.target.files)
                                  ]);
                                }
                              }}
                            />
                          </Button>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box sx={{ p: 2 }}>
            <Grid2 container spacing={2} alignItems="center" mt={2}>
              {/* Period of Employment */}
              <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography>Period of Employment</Typography>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 3, md: 2 }}>
                <TextField
                  size="small"
                  type="date"
                  label="From"
                  fullWidth
                  value={foreignFormik.values.periodFrom}
                  onChange={(e) => foreignFormik.setFieldValue('periodFrom', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 3, md: 2 }}>
                <TextField
                  size="small"
                  type="date"
                  label="To"
                  fullWidth
                  value={foreignFormik.values.periodTo}
                  onChange={(e) => foreignFormik.setFieldValue('periodTo', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
              {/* Country of Employment */}
              <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography>Country of Employment</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={foreignFormik.values.country}
                  onChange={(e) => foreignFormik.setFieldValue('country', e.target.value)}
                />
              </Grid2>
            </Grid2>
            {/* Salary Received In */}
            <Box mt={2} mb={2}>
              <Typography mb={1}>Salary Received In</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={foreignFormik.values.salaryReceivedIn.includes('indian')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      let arr = [...foreignFormik.values.salaryReceivedIn];
                      if (checked) arr.push('indian');
                      else arr = arr.filter((v) => v !== 'indian');
                      foreignFormik.setFieldValue('salaryReceivedIn', arr);
                    }}
                  />
                }
                label="Indian Bank"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={foreignFormik.values.salaryReceivedIn.includes('foreign')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      let arr = [...foreignFormik.values.salaryReceivedIn];
                      if (checked) arr.push('foreign');
                      else arr = arr.filter((v) => v !== 'foreign');
                      foreignFormik.setFieldValue('salaryReceivedIn', arr);
                    }}
                  />
                }
                label="Foreign Bank"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={foreignFormik.values.salaryReceivedIn.includes('both')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      let arr = [...foreignFormik.values.salaryReceivedIn];
                      if (checked) arr.push('both');
                      else arr = arr.filter((v) => v !== 'both');
                      foreignFormik.setFieldValue('salaryReceivedIn', arr);
                    }}
                  />
                }
                label="Both"
              />
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Save Foreign Income
          </Button>
        </Box>
      </form>
    </>
  );
};

const HousePropertyIncome = ({ data, fileDialogOpen, setFileDialogOpen, filesData, setDialogFilesData, service_id }) => {
  data = data[0];
  const { enqueueSnackbar } = useSnackbar();
  const [numProperties, setNumProperties] = React.useState(1);
  const initialProperties = {
    type_of_property: '',
    property_address: {
      address_line1: '',
      address_line2: '',
      state: '',
      pincode: ''
    },
    owned_property: '',
    ownership_percentage: '',
    country: '',
    is_it_property_let_out: '',
    annual_rent_received: '',
    rent_received: '',
    pay_municipal_tax: '',
    municipal_tax_paid: '',
    municipal_tax_receipt: null,
    home_loan_on_property: '',
    interest_during_financial_year: '',
    principal_during_financial_year: '',
    upload_loan_interest_certificate: null,
    loan_statement: null
  };
  const [properties, setProperties] = React.useState(data.data);

  // Add/Remove property handlers
  const handleAddProperty = () => {
    setNumProperties(numProperties + 1);
    setProperties([
      ...properties,
      {
        type_of_property: '',
        property_address: {
          address_line1: '',
          address_line2: '',
          state: '',
          pincode: ''
        },
        owned_property: '',
        ownership_percentage: '',
        country: '',
        is_it_property_let_out: '',
        annual_rent_received: '',
        rent_received: '',
        pay_municipal_tax: '',
        municipal_tax_paid: '',
        municipal_tax_receipt: null,
        home_loan_on_property: '',
        interest_during_financial_year: '',
        principal_during_financial_year: '',
        upload_loan_interest_certificate: null,
        loan_statement: null
      }
    ]);
  };
  const handleRemoveProperty = () => {
    if (numProperties > 1) {
      setNumProperties(numProperties - 1);
      setProperties(properties.slice(0, -1));
    }
  };
  // Handle field change
  const handleChange = (idx, field, value) => {
    const updated = [...properties];
    if (field.startsWith('property_address.')) {
      const addrField = field.split('.')[1];
      updated[idx].property_address = {
        ...updated[idx].property_address,
        [addrField]: value
      };
    } else {
      updated[idx][field] = value;
    }
    setProperties(updated);
  };
  const handleFileChange = (idx, field, file) => {
    const updated = [...properties];
    updated[idx][field] = file;
    setProperties(updated);
  };
  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (properties.length === 0) {
      if (enqueueSnackbar)
        enqueueSnackbar('At least one property is required.', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'error' });
      else alert('At least one property is required.');
      return;
    }
    const formData = new FormData();
    properties.forEach((property, idx) => {
      Object.entries(property).forEach(([key, value]) => {
        if (key === 'property_address') {
          formData.append(`properties[${idx}][${key}]`, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(`properties[${idx}][${key}]`, value);
        } else {
          formData.append(`properties[${idx}][${key}]`, value ?? '');
        }
      });
    });
    if (enqueueSnackbar)
      enqueueSnackbar('House Property Income saved!', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'success' });
    else alert('House Property Income saved!');
    console.log('House Property Income:', properties);
    // To POST: await Factory('post', '/your-endpoint', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  // Add this async function to post a single property
  const postProperty = async (property, idx) => {
    const formData = new FormData();
    formData.append('service_request', service_id);
    formData.append('service_task', data.task_id);
    formData.append('status', 'in progress');

    Object.entries(property).forEach(([key, value]) => {
      if (key === 'property_address') {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (key === 'municipal_tax_receipt' || key === 'loan_statement' || key === 'upload_loan_interest_certificate') {
        if (value && !value?.startsWith('http')) {
          console.log(key, value);
          formData.append(key, value.toString());
        }
      } else {
        formData.append(key, value ?? '');
      }
    });
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    try {
      const res = await Factory('post', '/income_tax_returns/house-property-details/upsert/', formData, {});
      if (res.res.status_cd === 0) {
        if (enqueueSnackbar)
          enqueueSnackbar(`Property ${idx + 1} saved!`, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      } else {
        if (enqueueSnackbar)
          enqueueSnackbar(`Error saving property ${idx + 1}`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    } catch (err) {
      if (enqueueSnackbar)
        enqueueSnackbar(`Error saving property ${idx + 1}`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            Enter House Property Details
          </Typography>
        </Box>
        {properties.map((property, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant="h4" sx={{ textDecoration: 'underline' }} mb={2}>
              Property {idx + 1}
            </Typography>
            {/* Property Overview */}
            <Typography fontWeight={600} mb={1}>
              Property Overview
            </Typography>
            <Grid2 container spacing={2} alignItems="center" mb={2}>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Type of Property</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Self-occupied', 'Let-out', 'Vacant', 'Foreign', 'Deemed let-out']}
                  value={property.type_of_property || ''}
                  onChange={(_, v) => handleChange(idx, 'type_of_property', v || '')}
                  renderInput={(params) => <TextField {...params} placeholder="Select type" />}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Country (if Foreign)</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['India', 'Other']}
                  value={property.country || ''}
                  onChange={(_, v) => handleChange(idx, 'country', v || '')}
                  renderInput={(params) => <TextField {...params} placeholder="Select country" />}
                />
              </Grid2>{' '}
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Property Address</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 9 }}>
                <Grid2 container spacing={1}>
                  <Grid2 size={3}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Line 1"
                      label="Line 1"
                      value={property.property_address?.address_line1 || ''}
                      onChange={(e) => handleChange(idx, 'property_address.address_line1', e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={3}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Line 2"
                      label="Line 2"
                      value={property.property_address?.address_line2 || ''}
                      onChange={(e) => handleChange(idx, 'property_address.address_line2', e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={3}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="State"
                      label="State"
                      value={property.property_address?.state || ''}
                      onChange={(e) => handleChange(idx, 'property_address.state', e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={3}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Pincode"
                      label="Pincode"
                      value={property.property_address?.pincode || ''}
                      onChange={(e) => handleChange(idx, 'property_address.pincode', e.target.value)}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Is it Co-owned Property?</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup row value={property.owned_property || ''} onChange={(_, v) => handleChange(idx, 'owned_property', v)}>
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Ownership Percentage</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  placeholder="%"
                  value={property.ownership_percentage || ''}
                  onChange={(e) => handleChange(idx, 'ownership_percentage', e.target.value)}
                />
              </Grid2>
            </Grid2>
            {/* Income Details */}
            <Typography fontWeight={600} mb={1}>
              Income Details
            </Typography>
            <Grid2 container spacing={2} alignItems="center" mb={2}>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Is this property let-out?</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup
                  row
                  value={property.is_it_property_let_out || ''}
                  onChange={(_, v) => handleChange(idx, 'is_it_property_let_out', v)}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Annual Rent Received</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  placeholder="Amount"
                  value={property.annual_rent_received || ''}
                  onChange={(e) => handleChange(idx, 'annual_rent_received', e.target.value)}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Rent Received In</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Bank', 'Cash']}
                  value={property.rent_received || ''}
                  onChange={(_, v) => handleChange(idx, 'rent_received', v || '')}
                  renderInput={(params) => <TextField {...params} placeholder="Select mode" />}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Did you pay municipal taxes?</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup row value={property.pay_municipal_tax || ''} onChange={(_, v) => handleChange(idx, 'pay_municipal_tax', v)}>
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Municipal tax paid</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  placeholder="Amount"
                  value={property.municipal_tax_paid || ''}
                  onChange={(e) => handleChange(idx, 'municipal_tax_paid', e.target.value)}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Municipal tax receipt</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Button size="small" variant="contained" component="label">
                  Upload
                  <input type="file" hidden onChange={(e) => handleFileChange(idx, 'municipal_tax_receipt', e.target.files[0])} />
                </Button>
                {property.municipal_tax_receipt && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      if (typeof property.municipal_tax_receipt === 'string') {
                        window.open(property.municipal_tax_receipt, '_blank');
                      } else {
                        window.open(URL.createObjectURL(property.municipal_tax_receipt), '_blank');
                      }
                    }}
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                )}
              </Grid2>
            </Grid2>
            {/* Loan Details */}
            <Typography fontWeight={600} mb={1}>
              Loan Details
            </Typography>
            <Grid2 container spacing={2} alignItems="center">
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Home loan on this property?</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup
                  row
                  value={property.home_loan_on_property || ''}
                  onChange={(_, v) => handleChange(idx, 'home_loan_on_property', v)}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Interest paid during the FY</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  placeholder="Amount"
                  value={property.interest_during_financial_year || ''}
                  onChange={(e) => handleChange(idx, 'interest_during_financial_year', e.target.value)}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Principal paid during the FY</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  placeholder="Amount"
                  value={property.principal_during_financial_year || ''}
                  onChange={(e) => handleChange(idx, 'principal_during_financial_year', e.target.value)}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Upload loan interest certificate</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Button size="small" variant="contained" component="label">
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleFileChange(idx, 'upload_loan_interest_certificate', e.target.files[0])}
                  />
                </Button>
                {property.upload_loan_interest_certificate && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      if (typeof property.upload_loan_interest_certificate === 'string') {
                        window.open(property.upload_loan_interest_certificate, '_blank');
                      } else {
                        window.open(URL.createObjectURL(property.upload_loan_interest_certificate), '_blank');
                      }
                    }}
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                )}
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Loan statement</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Button size="small" variant="contained" component="label">
                  Upload
                  <input type="file" hidden onChange={(e) => handleFileChange(idx, 'loan_statement', e.target.files[0])} />
                </Button>

                {property.loan_statement && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      if (typeof property.loan_statement === 'string') {
                        window.open(property.loan_statement, '_blank');
                      } else {
                        window.open(URL.createObjectURL(property.loan_statement), '_blank');
                      }
                    }}
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                )}
              </Grid2>
            </Grid2>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={async () => {
                  await postProperty(properties[idx], idx);
                  console.log('Saved property:', properties[idx]);
                }}
              >
                Save Property
              </Button>

              {numProperties > 1 && (
                <Button size="small" color="error" variant="outlined" onClick={handleRemoveProperty} sx={{ ml: 2 }}>
                  Remove Property
                </Button>
              )}
            </Box>
          </Paper>
        ))}

        <Box display="flex" justifyContent="flex-end" mt={1}>
          {/* <Button type="submit" variant="contained" color="primary">
            Save House Property Income
          </Button> */}
          <GetActionButtons
            data={properties}
            status={properties.status}
            urlEndpoint="personal-information"
            taskId={properties.id}
            setData={setProperties}
          />
        </Box>
      </Box>
    </form>
  );
};

const CapitalGainsIncome = ({ data, fileDialogOpen, setFileDialogOpen, filesData, setDialogFilesData, service_id }) => {
  const initialState = [
    {
      property_type: '',
      date_of_purchase: '',
      purchase_cost: '',
      date_of_sale: '',
      sale_value: '',
      purchase_doc: null,
      sale_doc: null,
      reinvestment_made: 'no',
      reinvestment_details: {
        invested_in: '',
        invest_amount: '',
        invest_date: '',
        reinvestment_details_docs: null
      }
    }
  ];
  let [cg_property_land, setCgPropertyLand] = React.useState(
    data.find((item) => item.category_name === 'Capital Gains Applicable Details') || null
  );
  let [cg_equity_mutual, setCgEquityMutual] = React.useState(
    data.find((item) => item.category_name === 'Capital Gain Equity Mutual Fund') || null
  );
  let [cg_other_sources, setCgOtherSources] = React.useState(
    data.find((item) => item.category_name === 'Capital Gain from Other Sources') || null
  );
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [properties, setProperties] = React.useState(initialState);
  const [numOtherGains, setNumOtherGains] = React.useState(1);
  const enqueueSnackbar = useSnackbar();
  const propertyTypes = ['land', 'plot', 'building'];
  const gainTypes = ['Equity shares', 'Mutual funds', 'Property/Land', 'Foreign equity', 'Others'];
  const eqMfTypes = ['Equity shares', 'Mutual funds (equity)', 'Mutual funds (debt/hybrid)'];
  const investOptions = ['Bonds', 'Property', 'Other'];

  useEffect(() => {
    if (cg_property_land) {
      setSelectedTypes(cg_property_land.data.gains_applicable);
      if (cg_property_land.data.capital_gains_property_details.length > 0)
        setProperties(cg_property_land.data.capital_gains_property_details);
    }
  }, [cg_property_land]);
  return (
    <Box>
      {/* Capital Gains Type Selection */}
      <Box mb={3}>
        <Typography mb={1}>Select the type of Capital Gains applicable:</Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {gainTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={<Checkbox />}
              onChange={async (e) => {
                const isChecked = e.target.checked;
                let __selectedTypes = isChecked ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type);
                setSelectedTypes(__selectedTypes);
                const response = await Factory('post', `/income_tax_returns/capital-gains/upsert/`, {
                  service_request: parseInt(service_id),
                  service_task: cg_property_land.task_id,
                  status: 'in progress',
                  gains_applicable: __selectedTypes
                });
                if (response.res.status_cd === 0) {
                  setSelectedTypes(response.res.data.gains_applicable);
                  if (response.res.data.capital_gains_property_details.length > 0) {
                    setsetCgPropertyLand(response.res.data);
                    setProperties(response.res.data.capital_gains_property_details);
                  } else {
                    setProperties(initialState);
                  }
                }
              }}
              label={type}
            />
          ))}
        </Box>
      </Box>
      {/* Capital Gain from Property/Land */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8fafc' }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          Capital Gain from Property / Land
        </Typography>
        {properties.map((property, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
            <Typography fontWeight={600} mb={1}>
              Capital gain details for property {idx + 1}
            </Typography>
            <Grid2 container spacing={2} alignItems="center" mb={2}>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Property Type</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={propertyTypes}
                  getOptionLabel={(option) => option.charAt(0).toUpperCase() + option.slice(1)}
                  value={property.property_type}
                  onChange={(_, v) => {
                    const updated = [...properties];
                    updated[idx].property_type = v;
                    setProperties(updated);
                  }}
                  renderInput={(params) => <TextField {...params} placeholder="Select type" />}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Date of Purchase</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={property.date_of_purchase}
                  onChange={(e) => {
                    const updated = [...properties];
                    updated[idx].date_of_purchase = e.target.value;
                    setProperties(updated);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Purchase Cost</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Amount"
                  type="number"
                  value={property.purchase_cost}
                  onChange={(e) => {
                    const updated = [...properties];
                    updated[idx].purchase_cost = e.target.value;
                    setProperties(updated);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Date of Sale</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={property.date_of_sale}
                  onChange={(e) => {
                    const updated = [...properties];
                    updated[idx].date_of_sale = e.target.value;
                    setProperties(updated);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Sale Value</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Amount"
                  type="number"
                  value={property.sale_value}
                  onChange={(e) => {
                    const updated = [...properties];
                    updated[idx].sale_value = e.target.value;
                    setProperties(updated);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Upload purchase doc</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Button size="small" variant="contained" component="label" sx={{ mr: 1 }}>
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const updated = [...properties];
                      updated[idx].purchase_doc = e.target.files[0];
                      setProperties(updated);
                    }}
                  />
                </Button>
                {properties[idx].purchase_doc && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setFileDialogOpen(true);
                      setDialogFilesData([...properties[idx].purchase_doc]);
                    }}
                  >
                    View
                  </Button>
                )}
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Upload sale doc</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Button size="small" variant="contained" component="label">
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const updated = [...properties];
                      updated[idx].sale_doc = e.target.files[0];
                      setProperties(updated);
                    }}
                  />
                </Button>
                {properties[idx].sale_doc && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setFileDialogOpen(true);
                      setDialogFilesData([...properties[idx].sale_doc]);
                    }}
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                )}
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Reinvestment made</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup
                  row
                  value={properties[idx].reinvestment_made}
                  onChange={(_, v) => {
                    const arr = [...properties];
                    arr[idx].reinvestment_made = v;
                    setProperties(arr);
                  }}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
            </Grid2>
            {properties[idx].reinvestment_made === 'yes' && (
              <Box mt={2} mb={2}>
                <Typography fontWeight={500} mb={1}>
                  Reinvestment Details
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Invested In</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date of Investment</TableCell>
                      <TableCell>Doc</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={investOptions}
                          value={property?.reinvestment_details?.invested_in}
                          onChange={(_, v) => {
                            const updated = [...properties];
                            console.log(updated[idx]);
                            updated[idx].reinvestment_details.invested_in = v;
                            setProperties(updated);
                          }}
                          renderInput={(params) => <TextField {...params} placeholder="Select" />}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Amount"
                          type="number"
                          value={property?.reinvestment_details?.invest_amount}
                          onChange={(e) => {
                            const updated = [...properties];
                            updated[idx].reinvestment_details.invest_amount = e.target.value;
                            setProperties(updated);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={property?.reinvestment_details?.invest_date}
                          onChange={(e) => {
                            const updated = [...properties];
                            updated[idx].reinvestment_details.invest_date = e.target.value;
                            setProperties(updated);
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
                              const updated = [...properties];
                              updated[idx].reinvestment_details.reinvestment_details_docs = e.target.files[0];
                              setProperties(updated);
                            }}
                          />
                        </Button>
                        {properties[idx].reinvestment_details?.reinvestment_details_docs && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              setDialogFilesData([...properties[idx].reinvestment_details?.reinvestment_details_docs]);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            )}
            <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={async () => {
                  const propertyToSave = properties[idx];
                  const formData = new FormData();
                  formData.append('service_request', service_id);
                  formData.append('service_task', cg_property_land.task_id);
                  formData.append('status', 'in progress');
                  formData.append('reinvestment_details', JSON.stringify(properties[idx].reinvestment_details));
                  formData.append('gains_applicable', selectedTypes);

                  Object.entries(propertyToSave).forEach(([key, value]) => {
                    if (key === 'purchase_doc' || key === 'sale_doc' || (key === 'reinvestment_details_docs' && value)) {
                      Array.from(value).forEach((file) => {
                        if (file instanceof File) {
                          formData.append(key, file);
                        }
                      });
                    }
                  });
                  let type = properties[idx].id ? 'put' : 'post';
                  let url = properties[idx].id
                    ? `/income_tax_returns/capital-gains/update-property/${properties[idx].id}/`
                    : `/income_tax_returns/capital-gains/create-or-update/`;
                  const response = await Factory(type, url, formData);
                  console.log(response);
                  if (response.res.status_cd === 0) {
                    enqueueSnackbar('Property saved successfully', {
                      anchorOrigin: { vertical: 'top', horizontal: 'right' },
                      variant: 'success'
                    });
                  } else {
                    enqueueSnackbar('Error saving property', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'error' });
                  }
                }}
              >
                Save
              </Button>
              {properties.length > 1 && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setProperties(properties.filter((_, i) => i !== idx));
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          </Paper>
        ))}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setProperties([
                ...properties,
                {
                  property_type: '',
                  date_of_purchase: '',
                  purchase_cost: '',
                  date_of_sale: '',
                  sale_value: '',
                  purchase_doc: null,
                  sale_doc: null,
                  reinvestment_made: 'no',
                  reinvestment_details: {
                    invested_in: '',
                    invest_amount: '',
                    invest_date: '',
                    reinvestment_details_docs: null
                  }
                }
              ]);
            }}
          >
            Add Property Sold
          </Button>
        </Box>
        {/* Capital Gain from Equity/Mutual Fund */}
        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          Capital Gain from Equity / Mutual Fund
        </Typography>
        {/* 1. Instrument checkboxes */}
        <Box mb={2}>
          <Typography mb={1}>Which instrument(s) did you sell?</Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {eqMfTypes.map((type) => (
              <FormControlLabel key={type} control={<Checkbox />} label={type} />
            ))}
          </Box>
        </Box>
        {/* 2. File upload for CAMS/Broker statements */}
        <Box mb={2}>
          <Typography mb={1}>Upload CAMS / Broker statements:</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button size="small" variant="contained" component="label">
              Upload
              <input type="file" hidden multiple />
            </Button>
            <Typography variant="body2">0 files</Typography>
            <Button size="small" variant="outlined">
              View
            </Button>
            <Button size="small" variant="outlined">
              Upload
            </Button>
          </Stack>
        </Box>
        {/* 3. Did you sell any foreign shares? */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography mb={1}>Did you sell any foreign shares?</Typography>
          <RadioGroup row>
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>
        </Stack>
        {/* 4. Did you sell any unlisted shares? */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography mb={1}>Did you sell any unlisted shares?</Typography>
          <RadioGroup row>
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>
        </Stack>
        {/* 5. Details of other Capital Gains table (already present) */}
        <Box mb={2}>
          <Typography fontWeight={600} mb={1}>
            Details of other Capital Gains
          </Typography>
          <Paper elevation={2} sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}>Asset Details</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}>Purchase Date</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}>Purchase Value</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}>Sale Date</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}>Sale Value</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}>Doc</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: numOtherGains }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField size="small" fullWidth placeholder="Asset Details" />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" type="date" fullWidth InputLabelProps={{ shrink: true }} placeholder="Purchase Date" />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" fullWidth placeholder="Purchase Value" />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" type="date" fullWidth InputLabelProps={{ shrink: true }} placeholder="Sale Date" />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" fullWidth placeholder="Sale Value" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ p: 0 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input type="file" hidden />
                        </Button>
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={() => setNumOtherGains(numOtherGains + 1)}>
              Add Row
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const sectionPresumptiveData = {
  '44AD': {
    nature: 'Small businesses (Individuals, HUFs, Firms - not LLPs)',
    presumptive_rate: '6% (digital payments) or 8% of turnover',
    presumptive_income: 'Slab rates as per individual / firm'
  },
  '44ADA': {
    nature: 'Professionals (e.g., CA, Doctors, Lawyers, Architects)',
    presumptive_rate: '50% of gross receipts',
    presumptive_income: 'Slab rates as per individual'
  },
  '44AE': {
    nature: 'Goods transport businesses',
    presumptive_rate: 'Fixed amount per vehicle/month',
    presumptive_income: 'Slab rates after presumptive income computed'
  },
  '44BB': {
    nature: 'Non-resident in oil services',
    presumptive_rate: '10% of gross receipts (deemed profit)',
    presumptive_income: 'Flat 10% of gross receipts'
  },
  '44BBB': {
    nature: 'Foreign co. in turnkey power projects',
    presumptive_rate: '10% + surcharge + cess',
    presumptive_income: '10% of gross receipts'
  }
};

const sectionTypes = ['44AD', '44ADA', '44AE', '44BB', '44BBB'];

function transformBusinessApiResponse(apiObj) {
  return {
    id: apiObj.id,
    business_name: apiObj.business_name || '',
    business_type: apiObj.business_type || '',
    opting_for_presumptive_taxation: apiObj.opting_for_presumptive_taxation || 'no',
    gst_registered: apiObj.gst_registered || 'no',
    status: apiObj.status || '',
    service_request: apiObj.service_request,
    service_task: apiObj.service_task,
    assignee: apiObj.assignee,
    reviewer: apiObj.reviewer,
    // Opting data
    section: apiObj.opting_data?.section || '',
    nature: apiObj.opting_data?.nature || '',
    presumptive_rate: apiObj.opting_data?.presumptive_rate || '',
    presumptive_income: apiObj.opting_data?.presumptive_income || '',
    grossturnover_or_receipts: apiObj.opting_data?.grossturnover_or_receipts || '',
    digital_receipts: apiObj.opting_data?.digital_receipts || '',
    // Documents (use first file or array as needed)
    as26File: apiObj.documents?.['26AS']?.files?.[0]?.url || null,
    aisFile: apiObj.documents?.['AIS']?.files?.[0]?.url || null,
    gstReturnsFile: apiObj.documents?.['GST Returns']?.files?.[0]?.url || null,
    bankStatementFile: apiObj.documents?.['Bank Statements']?.files?.[0]?.url || null,
    otherDocsFile: apiObj.documents?.['Other']?.files?.[0]?.url || null
    // Add more fields as needed
  };
}

const BusinessIncome = ({ data, setFileDialogOpen, fileDialogOpen, dialogFilesData, setDialogFilesData, service_id }) => {
  data = data[0];
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSection, setSelectedSection] = React.useState([]);
  const [businessRows, setBusinessRows] = React.useState([]);
  const businessTypes = ['Trading', 'Manufacturing', 'Profession', 'Other'];

  useEffect(() => {
    if (data.data.length > 0) {
      setBusinessRows(data.data.map(transformBusinessApiResponse));
    } else {
      setBusinessRows([
        {
          business_name: '',
          business_type: '',
          grossturnover_or_receipts: '',
          digital_receipts: '',
          netProfit: '',
          section: '',
          nature: '',
          presumptive_rate: '',
          presumptive_income: '',
          bankStatementFile: null,
          as26File: null,
          aisFile: null,
          plFile: null,
          bsFile: null,
          gstReturnsFile: null,
          otherDocsFile: null,
          opting_for_presumptive_taxation: 'no',
          bookMaintained: 'no',
          gst_registered: 'no'
        }
      ]);
    }
  }, [data]);

  const saveBusinessRow = async (idx) => {
    const businessData = {
      ...businessRows[idx],
      opting_for_presumptive_taxation: businessRows[idx]?.opting_for_presumptive_taxation || 'no',
      bookMaintained: businessRows[idx]?.bookMaintained || 'no',
      gst_registered: businessRows[idx]?.gst_registered || 'no',
      selectedSection: selectedSection[idx]
    };
    let opting_data = {
      digital_receipts: businessData.digital_receipts,
      grossturnover_or_receipts: businessData.grossturnover_or_receipts,
      nature: businessData.nature,
      presumptive_income: businessData.presumptive_income,
      presumptive_rate: businessData.presumptive_rate,
      section: businessData.section
    };
    console.log(opting_data);
    const formData = new FormData();
    formData.append('service_request', service_id);
    formData.append('service_task', data.task_id);
    formData.append('status', 'in progress');
    formData.append('opting_data', JSON.stringify(opting_data));
    Object.entries(businessData).forEach(([key, value]) => {
      if (
        key !== 'digital_receipts' &&
        key !== 'grossturnover_or_receipts' &&
        key !== 'nature' &&
        key !== 'presumptive_income' &&
        key !== 'presumptive_rate' &&
        key !== 'section'
      ) {
        if (
          key === 'bankStatementFile' ||
          key === 'as26File' ||
          key === 'aisFile' ||
          key === 'plFile' ||
          key === 'bsFile' ||
          key === 'gstReturnsFile' ||
          key === 'otherDocsFile'
        ) {
          if (value && value.length > 0) {
            Array.from(value).forEach((file) => {
              if (file instanceof File) {
                formData.append(key, file);
              }
            });
          }
        } else {
          if (value) {
            formData.append(key, value);
          }
        }
      }
    });
    let type = businessData.id ? 'put' : 'post';
    let url = '/income_tax_returns/business-professional-income/';
    const res = await Factory(type, url, formData);
    console.log(res);
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Business/Profession Income saved successfully!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } else {
      enqueueSnackbar('Business/Profession Income save failed', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    <Box>
      {Array.from({ length: businessRows.length }).map((_, idx) => {
        const section = selectedSection[idx];
        const sectionData = sectionPresumptiveData[section] || { nature: '', presumptive_rate: '', presumptive_income: '' };
        return (
          <Paper key={idx} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Details of Business {idx + 1}
            </Typography>
            <Grid2 container spacing={2} alignItems="center" mb={2}>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Business Name</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Enter business name"
                  value={businessRows[idx]?.business_name || ''}
                  onChange={(e) => {
                    const updated = [...businessRows];
                    updated[idx].business_name = e.target.value;
                    setBusinessRows(updated);
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Business Type</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={businessTypes}
                  value={businessRows[idx]?.business_type || ''}
                  onChange={(_, v) => {
                    const updated = [...businessRows];
                    updated[idx].business_type = v || '';
                    setBusinessRows(updated);
                  }}
                  renderInput={(params) => <TextField {...params} placeholder="Select type" />}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Opting for presumptive?</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup
                  row
                  value={businessRows[idx]?.opting_for_presumptive_taxation || 'no'}
                  onChange={(_, v) => {
                    const updated = [...businessRows];
                    updated[idx].opting_for_presumptive_taxation = v;
                    setBusinessRows(updated);
                  }}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
            </Grid2>
            {/* If Presumptive = Yes, show left-side fields (4-12) */}
            {businessRows[idx]?.opting_for_presumptive_taxation === 'yes' && (
              <Box mb={2}>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Section/Type of</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Autocomplete
                      size="small"
                      fullWidth
                      options={sectionTypes}
                      value={businessRows[idx]?.section || ''}
                      onChange={(_, v) => {
                        const updated = [...businessRows];
                        updated[idx].section = v || '';
                        updated[idx].presumptive_rate = sectionPresumptiveData[v]?.presumptive_rate || '';
                        updated[idx].presumptive_income = sectionPresumptiveData[v]?.presumptive_income || '';
                        updated[idx].nature = sectionPresumptiveData[v]?.nature || '';
                        setBusinessRows(updated);
                        const arr = [...selectedSection];
                        arr[idx] = v || '';
                        setSelectedSection(arr);
                      }}
                      renderInput={(params) => <TextField {...params} placeholder="Select section/type" />}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Nature</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={businessRows[idx]?.nature || sectionData.nature}
                      placeholder="Nature"
                      InputProps={{ readOnly: true }}
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].nature = e.target.value;
                        setBusinessRows(updated);
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Presumptive Rate</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={businessRows[idx]?.presumptive_rate || sectionData.presumptive_rate}
                      placeholder="Presumptive Rate"
                      InputProps={{ readOnly: true }}
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].presumptive_rate = e.target.value;
                        setBusinessRows(updated);
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Presumptive Income</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={businessRows[idx]?.presumptive_income || sectionData.presumptive_income}
                      placeholder="Presumptive Income"
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].presumptive_income = e.target.value;
                        setBusinessRows(updated);
                      }}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Grossturnover/receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Gross turnover/receipts"
                      value={businessRows[idx]?.grossturnover_or_receipts || ''}
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].grossturnover_or_receipts = e.target.value;
                        setBusinessRows(updated);
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Digital % Receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Digital % Receipts"
                      value={businessRows[idx]?.digital_receipts || ''}
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].digital_receipts = e.target.value;
                        setBusinessRows(updated);
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload Bank Statements</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              const updatedBank = [...businessRows];
                              updatedBank[idx].bankStatementFile = e.target.files;
                              setBusinessRows(updatedBank);
                            }
                          }}
                        />
                      </Button>
                      {businessRows[idx]?.bankStatementFile && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            setFileDialogOpen(true);
                            let file = businessRows[idx].bankStatementFile?.startsWith('http')
                              ? [{ url: businessRows[idx].bankStatementFile }]
                              : [...businessRows[idx].bankStatementFile];
                            setDialogFilesData(file);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload 26AS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const updated = [...businessRows];
                            updated[idx].as26File = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.as26File && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          let file = businessRows[idx].as26File?.startsWith('http')
                            ? [{ url: businessRows[idx].as26File }]
                            : [...businessRows[idx].as26File];
                          setDialogFilesData(file);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload AIS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const updatedAIS = [...businessRows];
                            updatedAIS[idx].aisFile = e.target.files;
                            setBusinessRows(updatedAIS);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.aisFile && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          let file = businessRows[idx].aisFile?.startsWith('http')
                            ? [{ url: businessRows[idx].aisFile }]
                            : [...businessRows[idx].aisFile];
                          setDialogFilesData(file);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Any other relevant docs</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const updatedOtherDocs = [...businessRows];
                            updatedOtherDocs[idx].otherDocsFile = e.target.files;
                            setBusinessRows(updatedOtherDocs);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.otherDocsFile && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          let file = businessRows[idx].otherDocsFile?.startsWith('http')
                            ? [{ url: businessRows[idx].otherDocsFile }]
                            : [...businessRows[idx].otherDocsFile];
                          setDialogFilesData(file);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Grid2>
                </Grid2>
              </Box>
            )}
            {/* If Presumptive = No, show right-side fields */}
            {businessRows[idx]?.opting_for_presumptive_taxation === 'no' && (
              <Box mb={2}>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Gross Turnover</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Gross Turnover"
                      value={businessRows[idx]?.grossturnover_or_receipts || ''}
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].grossturnover_or_receipts = e.target.value;
                        setBusinessRows(updated);
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Digital % Receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Digital % Receipts"
                      value={businessRows[idx]?.digital_receipts || ''}
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].digital_receipts = e.target.value;
                        setBusinessRows(updated);
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Net Profit</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Net Profit"
                      value={businessRows[idx]?.netProfit || ''}
                      onChange={(e) => {
                        const updated = [...businessRows];
                        updated[idx].netProfit = e.target.value;
                        setBusinessRows(updated);
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload Bank Statement</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              const updatedBank = [...businessRows];
                              updatedBank[idx].bankStatementFile = e.target.files;
                              setBusinessRows(updatedBank);
                            }
                          }}
                        />
                      </Button>
                      {businessRows[idx]?.bankStatementFile && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            setFileDialogOpen(true);
                            let file = businessRows[idx].bankStatementFile?.startsWith('http')
                              ? [{ url: businessRows[idx].bankStatementFile }]
                              : [...businessRows[idx].bankStatementFile];
                            setDialogFilesData(file);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Books Maintained?</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 9 }}>
                    <RadioGroup
                      row
                      value={businessRows[idx]?.bookMaintained || 'no'}
                      onChange={(_, v) => {
                        const updated = [...businessRows];
                        updated[idx].bookMaintained = v;
                        setBusinessRows(updated);
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                  </Grid2>
                  {/* If Books Maintained = Yes */}
                  {businessRows[idx]?.bookMaintained === 'yes' && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography>Profit & Loss</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                const updated = [...businessRows];
                                updated[idx].plFile = e.target.files;
                                setBusinessRows(updated);
                              }
                            }}
                          />
                        </Button>
                        {businessRows[idx]?.plFile && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              let file = businessRows[idx].plFile?.startsWith('http')
                                ? [{ url: businessRows[idx].plFile }]
                                : [...businessRows[idx].plFile];
                              setDialogFilesData(file);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography>Balance Sheet</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                const updated = [...businessRows];
                                updated[idx].bsFile = e.target.files;
                                setBusinessRows(updated);
                              }
                            }}
                          />
                        </Button>
                        {businessRows[idx]?.bsFile && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              let file = businessRows[idx].bsFile?.startsWith('http')
                                ? [{ url: businessRows[idx].bsFile }]
                                : [...businessRows[idx].bsFile];
                              setDialogFilesData(file);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </Grid2>
                    </>
                  )}
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>GST Registered?</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <RadioGroup
                      row
                      value={businessRows[idx]?.gst_registered || 'no'}
                      onChange={(_, v) => {
                        const updated = [...businessRows];
                        updated[idx].gst_registered = v;
                        setBusinessRows(updated);
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                  </Grid2>
                  {/* If GST Registered = Yes */}
                  {businessRows[idx]?.gst_registered === 'yes' && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography>GST Returns</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                const updated = [...businessRows];
                                updated[idx].gstReturnsFile = e.target.files;
                                setBusinessRows(updated);
                              }
                            }}
                          />
                        </Button>
                        {businessRows[idx]?.gstReturnsFile && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              let file = businessRows[idx].gstReturnsFile?.startsWith('http')
                                ? [{ url: businessRows[idx].gstReturnsFile }]
                                : [...businessRows[idx].gstReturnsFile];
                              setDialogFilesData(file);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </Grid2>
                    </>
                  )}
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload 26AS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const updated = [...businessRows];
                            updated[idx].as26File = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.as26File && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          let file = businessRows[idx].as26File?.startsWith('http')
                            ? [{ url: businessRows[idx].as26File }]
                            : [...businessRows[idx].as26File];
                          setDialogFilesData(file);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload AIS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const updated = [...businessRows];
                            updated[idx].aisFile = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.aisFile && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          let file = businessRows[idx].aisFile?.startsWith('http')
                            ? [{ url: businessRows[idx].aisFile }]
                            : [...businessRows[idx].aisFile];
                          setDialogFilesData(file);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Any other relevant docs</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const updated = [...businessRows];
                            updated[idx].otherDocsFile = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.otherDocsFile && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          let file = businessRows[idx].otherDocsFile?.startsWith('http')
                            ? [{ url: businessRows[idx].otherDocsFile }]
                            : [...businessRows[idx].otherDocsFile];
                          setDialogFilesData(file);
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Grid2>
                </Grid2>
              </Box>
            )}
            <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                  saveBusinessRow(idx);
                }}
              >
                Save
              </Button>
              {businessRows.length > 1 && (
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    setBusinessRows(businessRows.filter((_, i) => i !== idx));
                    setSelectedSection(selectedSection.filter((_, i) => i !== idx));
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          </Paper>
        );
      })}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setBusinessRows([
              ...businessRows,
              {
                business_name: '',
                business_type: '',
                grossturnover_or_receipts: '',
                digital_receipts: '',
                netProfit: '',
                section: '',
                nature: '',
                presumptive_rate: '',
                presumptive_income: '',
                bankStatementFile: null,
                as26File: null,
                aisFile: null,
                plFile: null,
                bsFile: null,
                gstReturnsFile: null,
                otherDocsFile: null,
                opting_for_presumptive_taxation: 'no',
                bookMaintained: 'no',
                gst_registered: 'no'
              }
            ]);
            setSelectedSection([...selectedSection, '']);
          }}
        >
          Add Business/Profession
        </Button>
      </Box>
    </Box>
  );
};

const interestTypes = ['Savings', 'FD', 'RD', 'NRO', 'NRE', 'Others'];

const relationOptions = ['Relative', 'Non-relative'];

const pensionSources = ['Government', 'Private'];
const foreignIncomeTypes = ['Dividend', 'Interest', 'Others'];
const countryOptions = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];
const currencyOptions = ['INR', 'USD', 'GBP', 'EUR', 'Other'];
const winningsSources = ['Lottery', 'Game Show', 'Others'];

const OtherIncome = ({ data, fileDialogOpen, setFileDialogOpen, filesData, setDialogFilesData, service_id }) => {
  const enqueueSnackbar = useSnackbar();
  const [interest_income, setInterestIncome] = React.useState(data.find((item) => item.category_name === 'Interest Income'));
  const [dividend_income, setDividendIncome] = React.useState(data.find((item) => item.category_name === 'Dividend Income'));
  const [gift_income, setGiftIncome] = React.useState(data.find((item) => item.category_name === 'Gift Income'));
  const [family_income, setFamilyIncome] = React.useState(data.find((item) => item.category_name === 'Family Pension Income'));
  const [foreign_income, setForeignIncome] = React.useState(data.find((item) => item.category_name === 'Foreign Income'));
  const [winning_income, setWinningIncome] = React.useState(data.find((item) => item.category_name === 'Winning Income'));

  const [interestApplicable, setInterestApplicable] = React.useState('Not Applicable');
  const [interestRows, setInterestRows] = React.useState([{ interest_type: '', interest_earned: '', bank_name: '', file: '' }]);
  const [dividendApplicable, setDividendApplicable] = React.useState('Not Applicable');
  const [dividendRows, setDividendRows] = React.useState([{ received_from: '', dividend_received: '', file: '' }]);
  const [giftApplicable, setGiftApplicable] = React.useState('Not Applicable');
  const [giftRows, setGiftRows] = React.useState([
    { amount: '', received_from: '', relation: '', date_received: '', was_it_marriage_related: 'no', file: '' }
  ]);
  const [familyApplicable, setFamilyApplicable] = React.useState('Not Applicable');
  const [familyRows, setFamilyRows] = React.useState([{ amount: '', source: '', file: '' }]);
  const [foreignApplicable, setForeignApplicable] = React.useState('Not Applicable');
  const [foreignRows, setForeignRows] = React.useState([
    { type_of_income: '', country: '', currency: '', amount: '', tax_paid_abroad: 'no', form67_file: '' }
  ]);
  const [winningsApplicable, setWinningsApplicable] = React.useState('Not Applicable');
  const [winningsRows, setWinningsRows] = React.useState([{ source: '', amount: '', file: '' }]);

  useEffect(() => {
    if (interest_income.data.length > 0) {
      setInterestApplicable(interest_income.data[0].interest_income);
      if (interest_income.data[0].documents.length > 0) {
        setInterestRows(interest_income.data[0].documents);
      }
    }
  }, [interest_income]);

  useEffect(() => {
    if (dividend_income.data.length > 0) {
      setDividendApplicable(dividend_income.data[0].dividend_income);
      if (dividend_income.data[0].documents.length > 0) {
        setDividendRows(dividend_income.data[0].documents);
      }
    }
  }, [dividend_income]);

  useEffect(() => {
    if (gift_income.data.length > 0) {
      setGiftApplicable(gift_income.data[0].gift_income);
      if (gift_income.data[0].gift_income_details.length > 0) {
        setGiftRows(
          gift_income.data[0].documents.map((row) => ({
            ...row,
            received_from: row.received_from || '',
            date_received: row.date_received || '',
            was_it_marriage_related: row.was_it_marriage_related || 'no'
          }))
        );
      }
    }
  }, [gift_income]);

  useEffect(() => {
    if (family_income.data.length > 0) {
      setFamilyApplicable(family_income.data[0].family_pension_income);
      if (family_income.data[0].family_pension_income_docs.length > 0) {
        setFamilyRows(family_income.data[0].documents);
      }
    }
  }, [family_income]);

  useEffect(() => {
    if (foreign_income.data.length > 0) {
      setForeignApplicable(foreign_income.data[0].foreign_income);
      if (foreign_income.data[0].foreign_income_docs.length > 0) {
        setForeignRows(
          foreign_income.data[0].documents.map((row) => ({
            ...row,
            type_of_income: row.type_of_income || '',
            tax_paid_abroad: row.tax_paid_abroad || 'no',
            form67_file: row.form67_file || ''
          }))
        );
      }
    }
  }, [foreign_income]);

  useEffect(() => {
    if (winning_income.data.length > 0) {
      setWinningsApplicable(winning_income.data[0].winning_income);
      if (winning_income.data[0].winnings_income_docs.length > 0) {
        setWinningsRows(winning_income.data[0].documents);
      }
    }
  }, [winning_income]);

  const postIncomeApplicability = async (v, urlEndPoint, key, task_id) => {
    const res = await Factory('post', `/income_tax_returns/${urlEndPoint}/upsert/`, {
      service_request: parseInt(service_id),
      service_task: parseInt(task_id),
      [key]: v,
      status: 'in progress'
    });
    if (res.res.status_cd === 0) {
      if (key === 'interest_income') {
        let __interest_income = interest_income;
        __interest_income.data[0] = res.res.data;
        setInterestIncome(__interest_income);
      } else if (key === 'dividend_income') {
        let __dividend_income = dividend_income;
        __dividend_income.data[0] = res.res.data;
        setDividendIncome(__dividend_income);
      } else if (key === 'gift_income') {
        let __gift_income = gift_income;
        __gift_income.data[0] = res.res.data;
        setGiftIncome(__gift_income);
      } else if (key === 'family_pension_income') {
        let __family_income = family_income;
        __family_income.data[0] = res.res.data;
        setFamilyIncome(__family_income);
      } else if (key === 'foreign_income') {
        let __foreign_income = foreign_income;
        __foreign_income.data[0] = res.res.data;
        setForeignIncome(__foreign_income);
      } else if (key === 'winning_income') {
        let __winning_income = winning_income;
        __winning_income.data[0] = res.res.data;
        setWinningIncome(__winning_income);
      }
      return true;
    }
  };

  // Save functions for each section
  const saveInterestRow = async (row, idx) => {
    let type = row.id ? 'put' : 'post';
    let url = row.id ? `/income_tax_returns/interest-income-doc/${row.id}/update/` : `/income_tax_returns/interest-income-doc/add/`;
    let formData = new FormData();
    formData.append('interest_type', row.interest_type);
    formData.append('interest_earned', row.interest_earned);
    formData.append('bank_name', row.bank_name);
    if (row.file instanceof File) {
      formData.append('file', row.file);
    }
    formData.append('interest_income', interest_income.data[0].id);
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Saved successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'success' });
    } else {
      enqueueSnackbar('Error saving ', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'error' });
    }
  };

  const saveDividendRow = async (row, idx) => {
    let type = row.id ? 'put' : 'post';
    let url = row.id
      ? `/income_tax_returns/dividend-income-document/${row.id}/update/`
      : `/income_tax_returns/dividend-income-document/add/`;
    let formData = new FormData();
    formData.append('received_from', row.received_from);
    formData.append('dividend_received', row.dividend_received);
    if (row.file instanceof File) {
      formData.append('file', row.file);
    }
    formData.append('dividend_income', dividend_income.data[0].id);
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Saved successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'success' });
    } else {
      enqueueSnackbar('Error saving', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'error' });
    }
  };

  const saveGiftRow = async (row, idx) => {
    let type = row.id ? 'put' : 'post';
    let url = row.id ? `/income_tax_returns/gift-income-document/${row.id}/update/` : `/income_tax_returns/interest-income-doc/add/`;
    let formData = new FormData();
    formData.append('amount', row.amount);
    formData.append('received_from', row.received_from);
    formData.append('relation', row.relation);
    formData.append('date_received', row.date_received);
    formData.append('was_it_marriage_related', row.was_it_marriage_related);
    if (row.file instanceof File) {
      formData.append('file', row.file);
    }
    formData.append('gift_income', gift_income.data[0].id);
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Saved successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'success' });
    } else {
      enqueueSnackbar('Error saving', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'error' });
    }
  };

  const saveFamilyRow = async (row, idx) => {
    let type = row.id ? 'put' : 'post';
    let url = row.id
      ? `/income_tax_returns/family-pension-income-documents/${row.id}/`
      : `/income_tax_returns/family-pension-income-documents/`;
    let formData = {};
    formData.amount = row.amount;
    formData.source = row.source;
    formData.append('family_pension_income', family_income.data[0].id);

    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Saved successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'success' });
    } else {
      enqueueSnackbar('Error saving', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'error' });
    }
  };

  const saveForeignRow = async (row, idx) => {
    let type = row.id ? 'put' : 'post';
    let url = row.id ? `/income_tax_returns/foreign-income-info/${row.id}/update/` : `/income_tax_returns/foreign-income-info/add/`;
    let formData = new FormData();
    formData.append('type_of_income', row.type_of_income);
    formData.append('country', row.country);
    formData.append('currency', row.currency);
    formData.append('amount', row.amount);
    formData.append('tax_paid_abroad', row.tax_paid_abroad);
    if (row.form67_file instanceof File) {
      formData.append('form67_file', row.form67_file);
    }
    formData.append('foreign_income', foreign_income.data[0].id);
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Saved successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'success' });
    } else {
      enqueueSnackbar('Error saving', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'error' });
    }
  };

  const saveWinningsRow = async (row, idx) => {
    let type = row.id ? 'put' : 'post';
    let url = row.id ? `/income_tax_returns/winning-income-docs/${row.id}/update/` : `/income_tax_returns/winning-income-docs/add/`;
    let formData = new FormData();
    formData.append('source', row.source);
    formData.append('amount', row.amount);
    if (row.file instanceof File) {
      formData.append('file', row.file);
    }
    formData.append('winning_income', winning_income.data[0].id);
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Saved successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'success' });
    } else {
      enqueueSnackbar('Error saving', { anchorOrigin: { vertical: 'top', horizontal: 'right' } }, { variant: 'error' });
    }
  };

  return (
    <Box>
      {/* Interest Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={interestApplicable === 'Applicable' ? 0 : 2}>
        <Typography>Interest Income: </Typography>
        <RadioGroup
          row
          value={interestApplicable}
          onChange={(_, v) => {
            let res = postIncomeApplicability(v, 'interest-income', 'interest_income', interest_income.task_id);
            if (res) setInterestApplicable(v);
          }}
        >
          <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {interestApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Interest Type</TableCell>
                  <TableCell>Interest Earned</TableCell>
                  <TableCell>Bank Name</TableCell>
                  <TableCell align="center">Document</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interestRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={interestTypes}
                        value={row.interest_type}
                        onChange={(_, v) => {
                          const updated = [...interestRows];
                          updated[idx].interest_type = v;
                          setInterestRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Interest Type" />}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Interest Earned"
                        value={row.interest_earned}
                        onChange={(e) => {
                          const updated = [...interestRows];
                          updated[idx].interest_earned = e.target.value;
                          setInterestRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Bank Name"
                        value={row.bank_name}
                        onChange={(e) => {
                          const updated = [...interestRows];
                          updated[idx].bank_name = e.target.value;
                          setInterestRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const updated = [...interestRows];
                              updated[idx].file = e.target.files[0];
                              setInterestRows(updated);
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
                            setFileDialogOpen(true);
                            setDialogFilesData([row.file]);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveInterestRow(row, idx)}>
                          Save
                        </Button>
                        {interestRows.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => setInterestRows(interestRows.filter((_, i) => i !== idx))}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              size="small"
              variant="outlined"
              onClick={() => setInterestRows([...interestRows, { interest_type: '', interest_earned: '', bank_name: '' }])}
            >
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Dividend Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={dividendApplicable === 'Applicable' ? 0 : 2}>
        <Typography>Dividend Income: </Typography>
        <RadioGroup
          row
          value={dividendApplicable}
          onChange={(_, v) => {
            setDividendApplicable(v);
            postIncomeApplicability(v, 'dividend-income', 'dividend_income', dividend_income.task_id);
          }}
        >
          <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {dividendApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Received From</TableCell>
                  <TableCell>Dividend Received</TableCell>
                  <TableCell align="center">Document</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dividendRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Received From"
                        value={row.from}
                        onChange={(e) => {
                          const updated = [...dividendRows];
                          updated[idx].from = e.target.value;
                          setDividendRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Dividend Received"
                        value={row.received}
                        onChange={(e) => {
                          const updated = [...dividendRows];
                          updated[idx].received = e.target.value;
                          setDividendRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const updated = [...dividendRows];
                              updated[idx].file = e.target.files[0];
                              setDividendRows(updated);
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
                            setFileDialogOpen(true);
                            setDialogFilesData([{ url: row.file instanceof File ? URL.createObjectURL(row.file) : row.file }]);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveDividendRow(row, idx)}>
                          Save
                        </Button>
                        {dividendRows.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => setDividendRows(dividendRows.filter((_, i) => i !== idx))}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={() => setDividendRows([...dividendRows, { from: '', received: '' }])}>
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Gift Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={giftApplicable === 'Applicable' ? 0 : 2}>
        <Typography>Gift Income: </Typography>
        <RadioGroup
          row
          value={giftApplicable}
          onChange={(_, v) => {
            setGiftApplicable(v);
            postIncomeApplicability(v, 'gift-income', 'gift_income', gift_income.task_id);
          }}
        >
          <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {giftApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Received From</TableCell>
                  <TableCell>Relation</TableCell>
                  <TableCell>Date Received</TableCell>
                  <TableCell>Marriage?</TableCell>
                  <TableCell align="center">Document</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {giftRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Amount"
                        value={row.amount}
                        onChange={(e) => {
                          const updated = [...giftRows];
                          updated[idx].amount = e.target.value;
                          setGiftRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Received From"
                        value={row.received_from}
                        onChange={(e) => {
                          const updated = [...giftRows];
                          updated[idx].received_from = e.target.value;
                          setGiftRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={relationOptions}
                        value={row.relation}
                        onChange={(_, v) => {
                          const updated = [...giftRows];
                          updated[idx].relation = v;
                          setGiftRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Relation" />}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Date Received"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={row.date_received}
                        onChange={(e) => {
                          const updated = [...giftRows];
                          updated[idx].date_received = e.target.value;
                          setGiftRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <RadioGroup
                        row
                        value={row.was_it_marriage_related}
                        onChange={(_, v) => {
                          const updated = [...giftRows];
                          updated[idx].was_it_marriage_related = v;
                          setGiftRows(updated);
                        }}
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio size="small" checked={row.was_it_marriage_related === 'yes'} />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio size="small" checked={row.was_it_marriage_related === 'no'} />}
                          label="No"
                        />
                      </RadioGroup>
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const updated = [...giftRows];
                              updated[idx].file = e.target.files[0];
                              setGiftRows(updated);
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
                            setFileDialogOpen(true);
                            setDialogFilesData([{ url: row.file instanceof File ? URL.createObjectURL(row.file) : row.file }]);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveGiftRow(row, idx)}>
                          Save
                        </Button>
                        {giftRows.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => setGiftRows(giftRows.filter((_, i) => i !== idx))}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                setGiftRows([
                  ...giftRows,
                  { amount: '', received_from: '', relation: '', date_received: '', was_it_marriage_related: 'no' }
                ])
              }
            >
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Family Pension Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={familyApplicable === 'Applicable' ? 0 : 2}>
        <Typography>Family Pension Income: </Typography>
        <RadioGroup
          row
          value={familyApplicable}
          onChange={(_, v) => {
            setFamilyApplicable(v);
            postIncomeApplicability(v, 'family-pension-income', 'family_pension_income', family_income.task_id);
          }}
        >
          <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {familyApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Amount Received</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="center">Document</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Amount Received"
                        value={row.amount}
                        onChange={(e) => {
                          const updated = [...familyRows];
                          updated[idx].amount = e.target.value;
                          setFamilyRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={pensionSources}
                        value={row.source}
                        onChange={(_, v) => {
                          const updated = [...familyRows];
                          updated[idx].source = v;
                          setFamilyRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Source" />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const updated = [...familyRows];
                              updated[idx].file = e.target.files[0];
                              setFamilyRows(updated);
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
                            setFileDialogOpen(true);
                            setDialogFilesData([{ url: row.file instanceof File ? URL.createObjectURL(row.file) : row.file }]);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveFamilyRow(row, idx)}>
                          Save
                        </Button>
                        {familyRows.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => setFamilyRows(familyRows.filter((_, i) => i !== idx))}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={() => setFamilyRows([...familyRows, { amount: '', source: '' }])}>
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Foreign Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={foreignApplicable === 'Applicable' ? 0 : 2}>
        <Typography>Foreign Income: </Typography>
        <RadioGroup
          row
          value={foreignApplicable}
          onChange={(_, v) => {
            setForeignApplicable(v);
            postIncomeApplicability(v, 'foreign-income', 'foreign_income', foreign_income.task_id);
          }}
        >
          <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {foreignApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ p: 0.5, py: 1, width: '13%' }}>Type of Income</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '20%' }}>Country</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '13%' }}>Currency</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '20%' }}>Amount</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '15%' }}>Tax Paid Abroad?</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '20%' }} align="center">
                    Document
                  </TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, py: 1, width: '20%' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {foreignRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ p: 0.5, py: 1 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={foreignIncomeTypes}
                        value={row.type_of_income}
                        onChange={(_, v) => {
                          const updated = [...foreignRows];
                          updated[idx].type_of_income = v;
                          setForeignRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Type of Income" />}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0.5, py: 1 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={countryOptions}
                        value={row.country}
                        onChange={(_, v) => {
                          const updated = [...foreignRows];
                          updated[idx].country = v;
                          setForeignRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Country" />}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0.5, py: 1 }}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={currencyOptions}
                        value={row.currency}
                        onChange={(_, v) => {
                          const updated = [...foreignRows];
                          updated[idx].currency = v;
                          setForeignRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Currency" />}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0.5, py: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Amount"
                        value={row.amount}
                        onChange={(e) => {
                          const updated = [...foreignRows];
                          updated[idx].amount = e.target.value;
                          setForeignRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0.5, py: 1 }}>
                      <RadioGroup
                        row
                        value={row.tax_paid_abroad}
                        onChange={(_, v) => {
                          const updated = [...foreignRows];
                          updated[idx].tax_paid_abroad = v;
                          setForeignRows(updated);
                        }}
                      >
                        <FormControlLabel
                          value="yes"
                          sx={{ m: 0 }}
                          control={<Radio sx={{ m: 0, px: 0.5 }} size="small" checked={row.tax_paid_abroad === 'yes'} />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          sx={{ m: 0 }}
                          control={<Radio sx={{ m: 0, px: 0.5 }} size="small" checked={row.tax_paid_abroad === 'no'} />}
                          label="No"
                        />
                      </RadioGroup>
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0.5, py: 1 }}>
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const updated = [...foreignRows];
                              updated[idx].form67_file = e.target.files[0];
                              setForeignRows(updated);
                            }
                          }}
                        />
                      </Button>
                      {row.form67_file && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            setFileDialogOpen(true);
                            setDialogFilesData([
                              { url: row.form67_file instanceof File ? URL.createObjectURL(row.form67_file) : row.form67_file }
                            ]);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0.5, py: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveForeignRow(row, idx)}>
                          Save
                        </Button>
                        {foreignRows.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => setForeignRows(foreignRows.filter((_, i) => i !== idx))}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                setForeignRows([
                  ...foreignRows,
                  { type_of_income: '', country: '', currency: '', amount: '', tax_paid_abroad: 'no', form67_file: '' }
                ])
              }
            >
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Winnings/Lottery Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={winningsApplicable === 'Applicable' ? 0 : 2}>
        <Typography>Winnings/Lottery Income: </Typography>
        <RadioGroup
          row
          value={winningsApplicable}
          onChange={(_, v) => {
            setWinningsApplicable(v);
            postIncomeApplicability(v, 'winning-income', 'winning_income', winning_income.task_id);
          }}
        >
          <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {winningsApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Source of Income</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="center">Document</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {winningsRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={winningsSources}
                        value={row.source}
                        onChange={(_, v) => {
                          const updated = [...winningsRows];
                          updated[idx].source = v;
                          setWinningsRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Source of Income" />}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Amount"
                        value={row.amount}
                        onChange={(e) => {
                          const updated = [...winningsRows];
                          updated[idx].amount = e.target.value;
                          setWinningsRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const updated = [...winningsRows];
                              updated[idx].file = e.target.files[0];
                              setWinningsRows(updated);
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
                            setFileDialogOpen(true);
                            setDialogFilesData([{ url: row.file instanceof File ? URL.createObjectURL(row.file) : row.file }]);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveWinningsRow(row, idx)}>
                          Save
                        </Button>
                        {winningsRows.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => setWinningsRows(winningsRows.filter((_, i) => i !== idx))}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={() => setWinningsRows([...winningsRows, { source: '', amount: '' }])}>
              Add Row
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const AgricultureIncome = ({ data, service_id }) => {
  data = data[0];
  const [hasAgriIncome, setHasAgriIncome] = React.useState('Applicable');

  const postIncomeApplicability = async (v) => {
    const res = await Factory('post', `/income_tax_returns/agriculture-income/upsert/`, {
      service_request: parseInt(service_id),
      service_task: parseInt(data.task_id),
      agriculture: v,
      status: 'in progress'
    });
    console.log(res);
    if (res.res.status_cd === 0) {
      return true;
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2} sx={{ textDecoration: 'underline' }}>
        Agricultural Income
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography>Do you have agricultural income during F.Y.?</Typography>
        <RadioGroup
          row
          value={hasAgriIncome}
          onChange={(_, v) => {
            postIncomeApplicability(v);
            setHasAgriIncome(v);
          }}
        >
          <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Yes" />
          <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="No" />
        </RadioGroup>
      </Stack>
      {hasAgriIncome === 'Applicable' && (
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography>If yes, enter net agricultural income earned</Typography>
          <TextField size="small" fullWidth sx={{ maxWidth: 200 }} label="Agricultural Income" />
          <Button size="small" variant="contained" component="label">
            Upload
            <input type="file" hidden />
          </Button>
          <Typography variant="caption">Upload Receipts</Typography>
        </Stack>
      )}
    </Box>
  );
};

const IncomeDetails = ({ data, type, fileDialogOpen, setFileDialogOpen, dialogFilesData, setDialogFilesData, service_id }) => {
  switch (type) {
    case 'salary':
      return (
        <SalaryIncome
          data={data.salary_income}
          fileDialogOpen={fileDialogOpen}
          setFileDialogOpen={setFileDialogOpen}
          filesData={dialogFilesData}
          setDialogFilesData={setDialogFilesData}
          service_id={service_id}
        />
      );
    case 'house':
      return (
        <HousePropertyIncome
          data={data.house_property_income}
          fileDialogOpen={fileDialogOpen}
          setFileDialogOpen={setFileDialogOpen}
          filesData={dialogFilesData}
          setDialogFilesData={setDialogFilesData}
          service_id={service_id}
        />
      );
    case 'capital':
      return (
        <CapitalGainsIncome
          data={data.capital_gains}
          fileDialogOpen={fileDialogOpen}
          setFileDialogOpen={setFileDialogOpen}
          filesData={dialogFilesData}
          setDialogFilesData={setDialogFilesData}
          service_id={service_id}
        />
      );
    case 'business':
      return (
        <BusinessIncome
          data={data.business_income}
          fileDialogOpen={fileDialogOpen}
          setFileDialogOpen={setFileDialogOpen}
          setDialogFilesData={setDialogFilesData}
          filesData={dialogFilesData}
          service_id={service_id}
        />
      );
    case 'other':
      return (
        <OtherIncome
          data={data.other_income}
          fileDialogOpen={fileDialogOpen}
          setFileDialogOpen={setFileDialogOpen}
          filesData={dialogFilesData}
          setDialogFilesData={setDialogFilesData}
          service_id={service_id}
        />
      );
    case 'agriculture':
      return <AgricultureIncome data={data.agriculture_income} service_id={service_id} />;
  }
};

export default IncomeDetails;
