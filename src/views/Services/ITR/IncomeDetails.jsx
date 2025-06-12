import React, { useEffect, useState } from 'react';
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
  IconButton,
  FormControl
} from '@mui/material';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import GetActionButtons from '../FormHelpers';
import Factory from '../../../utils/Factory';
import RaiseRequest from '../RaiseRequest';
const viewFile = async (url) => {
  const response = await Factory('get', `/docwallet/generate_presigned_url?url=${url}`, {}, {});
  if (response.res.status_cd === 0) {
    let url = response.res.data.url;
    window.open(url, '_blank');
  }
};

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
  const [salary_income, setSalaryIncome] = useState(data.find((item) => item.category_name === 'Salary Income'));
  const [other_income, setOtherIncome] = useState(data.find((item) => item.category_name === 'Other Income'));
  const [nri_employee_salary, setForeignIncome] = useState(data.find((item) => item.category_name === 'NRI Employee Salary'));
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
      form16: salary_income?.data?.length > 0 ? salary_income?.data[0]?.documents?.FORM_16 : [],
      payslip: salary_income?.data?.length > 0 ? salary_income?.data[0]?.documents?.PAYSLIP : [],
      bank: salary_income?.data?.length > 0 ? salary_income?.data[0]?.documents?.BANK_STATEMENT : []
    },
    notes: {
      form16: salary_income?.data?.length > 0 ? salary_income?.data[0]?.form_16_notes : '',
      payslip: salary_income?.data?.length > 0 ? salary_income?.data[0]?.payslip_notes : '',
      bank: salary_income?.data?.length > 0 ? salary_income?.data[0]?.bank_statement_notes : ''
    }
  };
  const otherIncomeInitial = {
    otherIncome:
      other_income?.data?.length > 0 && other_income?.data[0]?.other_income_info.length > 0
        ? other_income?.data[0]?.other_income_info
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
      foreignSalarySlip: nri_employee_salary?.data?.length > 0 ? nri_employee_salary?.data[0]?.foreigner_documents?.salary_slip_files : [],
      foreignBankStmt: nri_employee_salary?.data?.length > 0 ? nri_employee_salary?.data[0]?.foreigner_documents?.bank_statement_files : [],
      taxPaidAbroad:
        nri_employee_salary?.data?.length > 0 ? nri_employee_salary?.data[0]?.foreigner_documents?.tax_paid_certificate_board_files : []
    },
    periodFrom:
      nri_employee_salary?.data?.length > 0 && nri_employee_salary?.data[0]?.employment_history?.length > 0
        ? nri_employee_salary?.data[0]?.employment_history[0]?.from_date
        : '',
    periodTo:
      nri_employee_salary?.data?.length > 0 && nri_employee_salary?.data[0]?.employment_history?.length > 0
        ? nri_employee_salary?.data[0]?.employment_history[0]?.to_date
        : '',
    country:
      nri_employee_salary?.data?.length > 0 && nri_employee_salary?.data[0]?.employment_history?.length > 0
        ? nri_employee_salary?.data[0]?.employment_history[0]?.country
        : '',
    salaryReceivedIn:
      nri_employee_salary?.data?.length > 0 && nri_employee_salary?.data[0]?.employment_history?.length > 0
        ? nri_employee_salary?.data[0]?.employment_history[0]?.salary_received
        : ''
  };

  // Section 1: Upload Required Documents
  const docsFormik = useFormik({
    initialValues: docsInitial,
    enableReinitialize: true,
    // validationSchema: docsSchema,
    onSubmit: async (values) => {
      let type = salary_income?.data?.length > 0 ? 'put' : 'post';
      let url =
        salary_income?.data?.length > 0
          ? `/income_tax_returns/salary-income/${salary_income?.data[0]?.id}/`
          : '/income_tax_returns/salary-income/';
      let formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', salary_income?.task_id);
      if (values.docs.bank.files && Array.isArray(values.docs.bank.files)) {
        values.docs.bank.files.forEach((bank) => {
          if (bank instanceof File) {
            formData.append('bank_statement_files', bank);
          }
        });
      }
      if (values.docs.form16.files && Array.isArray(values.docs.form16.files)) {
        values.docs.form16.files.forEach((form16) => {
          if (form16 instanceof File) {
            formData.append('form16_files', form16);
          }
        });
      }
      if (values.docs.payslip.files && Array.isArray(values.docs.payslip.files)) {
        values.docs.payslip.files.forEach((payslip) => {
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
        setSalaryIncome((prev) => ({ ...prev, data: [res.res] }));
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
    enableReinitialize: true
    // validationSchema: otherIncomeSchema,
  });

  // Section 3: Foreign/NRI Employment & Salary Details
  const foreignFormik = useFormik({
    initialValues: foreignInitial,
    enableReinitialize: true,
    // validationSchema: foreignSchema,
    onSubmit: async (values) => {
      let url = '/income_tax_returns/nri-salary-details/upsert/';
      let employment_history = [
        { from_date: values.periodFrom, to_date: values.periodTo, country: values.country, salary_received: values.salaryReceivedIn }
      ];
      let formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', nri_employee_salary.task_id);
      formData.append('status', 'in progress');
      formData.append('employment_history', JSON.stringify(employment_history));
      if (values.foreignDocs.foreignBankStmt.files && Array.isArray(values.foreignDocs.foreignBankStmt.files)) {
        values.foreignDocs.foreignBankStmt.files.forEach((bank) => {
          if (bank instanceof File) {
            formData.append('bank_statement_files', bank);
          }
        });
      }
      if (values.foreignDocs.taxPaidAbroad.files && Array.isArray(values.foreignDocs.taxPaidAbroad.files)) {
        values.foreignDocs.taxPaidAbroad.files.forEach((tax) => {
          if (tax instanceof File) {
            formData.append('tax_paid_certificate_board_files', tax);
          }
        });
      }
      if (values.foreignDocs.foreignSalarySlip.files && Array.isArray(values.foreignDocs.foreignSalarySlip.files)) {
        values.foreignDocs.foreignSalarySlip.files.forEach((salary) => {
          if (salary instanceof File) {
            formData.append('salary_slip_files', salary);
          }
        });
      }

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

  const removeRow = async (idx, recId) => {
    const res = await Factory('delete', `/income_tax_returns/other-income-details/${recId}/delete`, {}, {});
    if (res.res.status_cd === 0) {
      otherIncomeFormik.setFieldValue(
        `otherIncome`,
        otherIncomeFormik.values.otherIncome.filter((_, i) => i !== idx)
      );
      enqueueSnackbar('Other income deleted successfully!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } else {
      enqueueSnackbar('Error deleting other income!', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    <>
      {/* Section 1: Upload Required Documents */}
      <form onSubmit={docsFormik.handleSubmit} autoComplete="off">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
            Upload Required Documents
          </Typography>
          <RaiseRequest fields={['Form 16', 'Payslip', 'Bank Statement']} task_id={salary_income?.task_id} />
        </Stack>
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
              {docTypes?.map((doc) => {
                return (
                  <TableRow key={doc.key} sx={{ height: 50, verticalAlign: 'center' }}>
                    <TableCell>{doc.label}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body2" sx={{ minHeight: 24 }}>
                          {docsFormik.values.docs[doc.key]?.files?.length || 0} file(s)
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
                                if (e.target.files) {
                                  docsFormik.setFieldValue(`docs.${doc.key}.files`, [
                                    ...(docsFormik.values.docs[doc.key]?.files || []),
                                    ...e.target.files
                                  ]);
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
                              setDialogFilesData({
                                files: docsFormik.values.docs[doc.key]?.files || [],
                                urlEndpoint: 'salary-documents'
                              });
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

        <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
          <Button type="submit" variant="contained" color="primary">
            Save Documents
          </Button>
          <GetActionButtons
            type="put"
            data={salary_income}
            status={salary_income?.data[0]?.status}
            urlEndpoint={`salary-income`}
            service_request={service_id}
            recId={salary_income?.data[0]?.id}
            setData={setSalaryIncome}
            task_id={salary_income?.task_id}
          />
        </Box>
      </form>
      {/* Section 2: Details of any other income you wish to share */}
      <FormikProvider value={otherIncomeFormik}>
        <form onSubmit={otherIncomeFormik.handleSubmit} autoComplete="off">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
            <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
              Details of any other income you wish to share
            </Typography>
            <RaiseRequest fields={[]} task_id={other_income?.task_id} />
          </Stack>
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
                      {otherIncomeFormik.values.otherIncome?.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Details"
                              value={row?.details}
                              onChange={(e) => otherIncomeFormik.setFieldValue(`otherIncome[${idx}].details`, e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Amount"
                              type="number"
                              value={row?.amount}
                              onChange={(e) => otherIncomeFormik.setFieldValue(`otherIncome[${idx}].amount`, e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Notes"
                              value={row?.notes}
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
                                  if (row.file instanceof File) {
                                    window.open(URL.createObjectURL(row.file), '_blank');
                                  } else {
                                    viewFile(row.file);
                                  }
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
                                  if (other_income.data[0].other_income_info[idx])
                                    formData.append('id', other_income.data[0].other_income_info[idx].id);
                                  if (row.file && row.file instanceof File) formData.append('file', row.file);
                                  let type = 'post';
                                  let url = '/income_tax_returns/other-income-details/';
                                  const res = await Factory(type, url, formData, {});
                                  if (res.res.status_cd === 0) {
                                    setOtherIncome((prev) => ({ ...prev, data: [res.res] }));
                                    enqueueSnackbar('Other income saved successfully!', {
                                      variant: 'success',
                                      anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                    });
                                  }
                                }}
                              >
                                Save
                              </Button>
                              {otherIncomeFormik?.values?.otherIncome?.length > 1 && (
                                <Button size="small" color="error" onClick={() => removeRow(idx, row.id)}>
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
                <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => arrayHelpers.push({ details: '', amount: '', document: null, notes: '' })}
                  >
                    Add row
                  </Button>
                  <GetActionButtons
                    type="post"
                    data={other_income}
                    status={other_income?.data[0]?.status}
                    urlEndpoint={`/income_tax_returns/other-income-details/`}
                    service_request={service_id}
                    task_id={other_income?.task_id}
                    recId={other_income?.data[0]?.id}
                  />
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
          <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
            Foreign/NRI Employment & Salary Details
          </Typography>
          <RaiseRequest
            fields={['Foreign Salary Slip', 'Foreign Bank Statement', 'Tax Paid Abroad Certificate']}
            task_id={nri_employee_salary?.task_id}
          />
        </Stack>
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
              {foreignDocTypes?.map((doc) => {
                return (
                  <TableRow key={doc.key} sx={{ height: 50, verticalAlign: 'center' }}>
                    <TableCell>{doc.label}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body2" sx={{ minHeight: 24 }}>
                          {foreignFormik.values.foreignDocs[doc.key]?.files?.length || 0} file(s)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Button size="small" variant="contained" component="label" sx={{ mb: 0.5 }}>
                          Upload
                          <input
                            type="file"
                            hidden
                            multiple={true}
                            onChange={(e) => {
                              if (e.target.files) {
                                foreignFormik.setFieldValue(`foreignDocs.${doc.key}.files`, [
                                  ...(foreignFormik.values.foreignDocs[doc.key]?.files || []),
                                  ...e.target.files
                                ]);
                              }
                            }}
                          />
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mb: 0.5 }}
                          onClick={() => {
                            setFileDialogOpen(true);
                            setDialogFilesData({
                              files: foreignFormik.values.foreignDocs[doc.key]?.files || [],
                              urlEndpoint: 'nri-salary-details'
                            });
                          }}
                        >
                          View
                        </Button>
                      </Stack>
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
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Salary Received In
              </Typography>
              <RadioGroup
                row
                name="salaryReceivedIn"
                value={foreignFormik.values.salaryReceivedIn || ''}
                onChange={(e) => foreignFormik.setFieldValue('salaryReceivedIn', e.target.value)}
              >
                <FormControlLabel value="india" control={<Radio size="small" />} label="India" />
                <FormControlLabel value="foreign" control={<Radio size="small" />} label="Foreign" />
                <FormControlLabel value="both" control={<Radio size="small" />} label="Both" />
                {/* Add more options as needed */}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
          <Button type="submit" variant="contained" color="primary">
            Save Foreign Income
          </Button>
          <GetActionButtons
            type="post"
            data={nri_employee_salary}
            status={nri_employee_salary?.data[0]?.status}
            urlEndpoint={`/income_tax_returns/nri-salary-details/upsert/`}
            service_request={service_id}
            task_id={nri_employee_salary?.task_id}
            recId={nri_employee_salary?.data[0]?.id}
          />
        </Box>
      </form>
    </>
  );
};

const HousePropertyIncome = ({ data, fileDialogOpen, setFileDialogOpen, filesData, setDialogFilesData, service_id }) => {
  let _wholeData = data[0];
  data = data[0]?.data[0]?.property_info;
  const { enqueueSnackbar } = useSnackbar();
  const [numProperties, setNumProperties] = React.useState(data?.length > 0 ? data?.length : 1);
  const initialProperties = {
    id: null,
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
  const [properties, setProperties] = React.useState(data?.length > 0 ? data : [initialProperties]);

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
        owned_property: false,
        ownership_percentage: '',
        country: '',
        is_it_property_let_out: false,
        annual_rent_received: '',
        rent_received: '',
        pay_municipal_tax: false,
        municipal_tax_paid: '',
        municipal_tax_receipt: null,
        home_loan_on_property: false,
        interest_during_financial_year: '',
        principal_during_financial_year: '',
        upload_loan_interest_certificate: null,
        loan_statement: null
      }
    ]);
  };
  const removeProperty = async (property, idx) => {
    const res = await Factory('delete', `/income_tax_returns/house-property-details/${property.id}/delete`, {}, {});
    if (res.res.status_cd === 0) {
      let __properties = [...properties];
      __properties.splice(idx, 1);
      setProperties(__properties);
      setNumProperties(numProperties - 1);
      enqueueSnackbar('Property deleted successfully!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } else {
      enqueueSnackbar('Error deleting property!', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
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

  // Add this async function to post a single property
  const postProperty = async (property, idx) => {
    const formData = new FormData();
    formData.append('service_request', service_id);
    formData.append('service_task', _wholeData.task_id);
    formData.append('status', 'in progress');

    Object.entries(property).forEach(([key, value]) => {
      if (!value) return;
      if (key === 'property_address') {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (key === 'municipal_tax_receipt' || key === 'loan_statement' || key === 'upload_loan_interest_certificate') {
        if (value && !value?.startsWith('http')) {
          formData.append(key, value.toString());
        }
      } else {
        formData.append(key, value ?? '');
      }
    });

    try {
      const res = await Factory('post', '/income_tax_returns/house-property-details/upsert/', formData, {});
      if (res.res?.status_cd === 0) {
        if (res.res?.data?.property_info) setProperties(res.res?.data?.property_info);
        enqueueSnackbar(`Property ${idx + 1} saved!`, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      } else {
        enqueueSnackbar(`Error saving property ${idx + 1}`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    } catch (err) {
      if (enqueueSnackbar)
        enqueueSnackbar(`Error saving property ${idx + 1}`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  return (
    <form>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            Enter House Property Details
          </Typography>
          <RaiseRequest
            fields={[
              'Type of Property',
              'Country (if Foreign)',
              'Property Address',
              'Is it Co-owned Property?',
              'Ownership Percentage',
              'Is it let-out?',
              'Annual Rent Received',
              'Rent Received In',
              'Did you pay municipal taxes?',
              'Municipal tax paid',
              'Municipal tax receipt',
              'Home loan on this property?',
              'Interest paid during the FY',
              'Principal paid during the FY',
              'Loan interest certificate',
              'Loan statement'
            ]}
            task_id={_wholeData.task_id}
          />
        </Stack>
        {properties?.map((property, idx) => (
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
                  <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
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
                  <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
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
                  <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
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
                        viewFile(property.municipal_tax_receipt);
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
                  <FormControlLabel value={true} control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio size="small" />} label="No" />
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
                        viewFile(property.upload_loan_interest_certificate);
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
                        viewFile(property.loan_statement);
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
                }}
              >
                Save Property
              </Button>

              {numProperties > 1 && (
                <Button size="small" color="error" variant="outlined" onClick={() => removeProperty(properties[idx], idx)} sx={{ ml: 2 }}>
                  Remove Property
                </Button>
              )}
            </Box>
          </Paper>
        ))}

        <Box display="flex" justifyContent="flex-end" mt={1} gap={2}>
          <Button type="button" variant="outlined" size="small" color="primary" onClick={handleAddProperty}>
            Add Property
          </Button>
          <GetActionButtons
            type="post"
            data={_wholeData?.data[0]}
            service_request={service_id}
            status={_wholeData?.data[0]?.status}
            urlEndpoint="/income_tax_returns/house-property-details/upsert/"
            task_id={_wholeData?.task_id}
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
      reinvestment_details_docs: null,
      reinvestment_details: {
        invested_in: '',
        invest_amount: '',
        invest_date: ''
      }
    }
  ];
  let [cg_property_land, setCgPropertyLand] = React.useState(
    data.find((item) => item.category_name === 'Capital Gains Applicable Details') || null
  );
  let [cg_equity_mutual, setCgEquityMutual] = React.useState(
    data.find((item) => item.category_name === 'Capital Gains Equity Mutual Fund') || null
  );
  let [cg_other_sources, setCgOtherSources] = React.useState(data.find((item) => item.category_name === 'Other Capital Gains') || null);
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [properties, setProperties] = React.useState(initialState);
  const [numOtherGains, setNumOtherGains] = React.useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const propertyTypes = ['land', 'plot', 'building'];
  const gainTypes = ['Equity shares', 'Mutual funds', 'Property/Land', 'Foreign equity', 'Others'];
  const eqMfTypes = ['Equity shares', 'Mutual funds (equity)', 'Mutual funds (debt/hybrid)'];
  const investOptions = ['Bonds', 'Property', 'Other'];
  const [otherGainsRows, setOtherGainsRows] = React.useState([
    {
      asset_details: '',
      purchase_date: '',
      purchase_value: '',
      sale_date: '',
      sale_value: '',
      documents: null
    }
  ]);

  useEffect(() => {
    if (cg_property_land) {
      setSelectedTypes(cg_property_land?.data?.gains_applicable || []);
      if (cg_property_land?.data?.capital_gains_property_details?.length > 0)
        setProperties(cg_property_land?.data?.capital_gains_property_details);
    }
  }, [cg_property_land]);

  useEffect(() => {
    if (cg_other_sources && cg_other_sources?.data?.length > 0 && cg_other_sources?.data[0]?.other_capital_gain_info.length > 0)
      setOtherGainsRows(cg_other_sources?.data[0]?.other_capital_gain_info);
    else
      setOtherGainsRows([
        {
          asset_details: '',
          purchase_date: '',
          purchase_value: '',
          sale_date: '',
          sale_value: '',
          documents: null
        }
      ]);
  }, [cg_other_sources]);

  useEffect(() => {
    if (otherGainsRows?.length === 0) {
      setOtherGainsRows([
        {
          asset_details: '',
          purchase_date: '',
          purchase_value: '',
          sale_date: '',
          sale_value: '',
          documents: null
        }
      ]);
    }
  }, [otherGainsRows]);

  const removeProperty = async (property) => {
    const response = await Factory('delete', `/income_tax_returns/capital-gains/delete-property/${property.id}/`);
    if (response.res.status_cd === 0) {
      let __properties = [...properties];
      __properties.splice(__properties.indexOf(property), 1);
      setProperties(__properties);
      enqueueSnackbar('Property removed successfully', {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'success'
      });
    } else {
      enqueueSnackbar('Error removing property', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'error' });
    }
  };

  // State for CAMS/Broker statements form
  const [equity_mutual_fund_type, setEquityMutualFundType] = React.useState([]);
  const [camsFiles, setCamsFiles] = React.useState([]);
  const [soldForeignShares, setSoldForeignShares] = React.useState('no');
  const [soldUnlistedShares, setSoldUnlistedShares] = React.useState('no');

  useEffect(() => {
    if (cg_equity_mutual) {
      setEquityMutualFundType(cg_equity_mutual?.data?.equity_mutual_fund_type || []);
      setCamsFiles(cg_equity_mutual?.data?.documents || []);
      setSoldForeignShares(cg_equity_mutual?.data?.sell_any_foreign_sales || 'no');
      setSoldUnlistedShares(cg_equity_mutual?.data?.sell_any_unlisted_sales || 'no');
    }
  }, [cg_equity_mutual]);

  const handleCamsInstrumentChange = (type) => (e) => {
    let __equity_mutual_fund_type = equity_mutual_fund_type;
    if (equity_mutual_fund_type.length === 0) {
      __equity_mutual_fund_type = [type];
    } else {
      __equity_mutual_fund_type = e.target.checked ? [...equity_mutual_fund_type, type] : equity_mutual_fund_type.filter((t) => t !== type);
    }
    setEquityMutualFundType(__equity_mutual_fund_type);
  };

  const handleCamsFilesChange = (e) => {
    setCamsFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleCamsSave = async () => {
    const formData = new FormData();
    formData.append('service_request', service_id);
    formData.append('service_task', cg_equity_mutual.task_id);
    formData.append('status', 'in progress');
    formData.append('equity_mutual_fund_type', JSON.stringify(equity_mutual_fund_type));
    camsFiles.forEach((file) => {
      if (file instanceof File) formData.append('documents', file);
    });
    formData.append('sell_any_foreign_sales', soldForeignShares);
    formData.append('sell_any_unlisted_sales', soldUnlistedShares);

    const response = await Factory('post', `/income_tax_returns/capital-gains/equity-mutual-fund/submit/`, formData);
    if (response.res.status_cd === 0) {
      enqueueSnackbar('Equity Mutual Fund Income submitted successfully', {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'success'
      });
    } else {
      enqueueSnackbar('Error submitting Equity Mutual Fund Income', {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'error'
      });
    }
  };

  return (
    <Box>
      {/* Capital Gains Type Selection */}
      <Box mb={3}>
        <Typography mb={1}>Select the type of Capital Gains applicable:</Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {gainTypes?.map((type) => (
            <FormControlLabel
              key={type}
              control={<Checkbox checked={selectedTypes?.includes(type)} />}
              onChange={async (e) => {
                const isChecked = e.target.checked;
                let __selectedTypes = selectedTypes;
                if (selectedTypes.length === 0) {
                  __selectedTypes = [type];
                } else {
                  __selectedTypes = isChecked ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type);
                }
                const response = await Factory('post', `/income_tax_returns/capital-gains/upsert/`, {
                  service_request: parseInt(service_id),
                  service_task: cg_property_land.task_id,
                  status: 'in progress',
                  gains_applicable: __selectedTypes
                });
                if (response.res.status_cd === 0) {
                  setSelectedTypes(response.res.data.gains_applicable);
                  if (response.res.data.capital_gains_property_details?.length > 0) {
                    setCgPropertyLand((prev) => ({ ...prev, data: response.res.data }));
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            Capital Gain from Property / Land
          </Typography>
          <RaiseRequest
            fields={[
              'Property Type',
              'Date of Purchase',
              'Purchase Cost',
              'Date of Sale',
              'Sale Value',
              'Upload purchase doc',
              'Upload sale doc',
              'Reinvestment made',
              'Invested In',
              'Invest Amount',
              'Invest Date',
              'Upload reinvestment details doc'
            ]}
            task_id={cg_property_land?.task_id}
          />
        </Stack>
        {properties?.map((property, idx) => (
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
                      if (typeof properties[idx].purchase_doc === 'string') {
                        viewFile(properties[idx].purchase_doc);
                      } else {
                        window.open(URL.createObjectURL(properties[idx].purchase_doc), '_blank');
                      }
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
                      if (typeof properties[idx].sale_doc === 'string') {
                        viewFile(properties[idx].sale_doc);
                      } else {
                        window.open(URL.createObjectURL(properties[idx].sale_doc), '_blank');
                      }
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
                              updated[idx].reinvestment_details_docs = e.target.files[0];
                              setProperties(updated);
                            }}
                          />
                        </Button>
                        {properties[idx].reinvestment_details_docs && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              if (typeof properties[idx].reinvestment_details_docs === 'string') {
                                viewFile(properties[idx].reinvestment_details_docs);
                              } else {
                                window.open(URL.createObjectURL(properties[idx].reinvestment_details_docs), '_blank');
                              }
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
                  formData.append('capital_gains_applicable', cg_property_land.data.id);
                  formData.append('reinvestment_made', properties[idx].reinvestment_made);
                  formData.append('status', 'in progress');
                  formData.append('gains_applicable', selectedTypes);

                  Object.entries(propertyToSave).forEach(([key, value]) => {
                    if (value) {
                      if (key === 'purchase_doc' || key === 'sale_doc' || key === 'reinvestment_details_docs') {
                        if (value instanceof File) {
                          formData.append(key, value);
                        }
                      } else {
                        if (key === 'reinvestment_details') {
                          if (properties[idx].reinvestment_made === 'yes') formData.append(key, JSON.stringify(value));
                        } else {
                          formData.append(key, value);
                        }
                      }
                    }
                  });

                  let type = properties[idx].id ? 'put' : 'post';
                  let url = properties[idx].id
                    ? `/income_tax_returns/capital-gains/update-property/${properties[idx].id}/`
                    : `/income_tax_returns/capital-gains/add-property/`;
                  const response = await Factory(type, url, formData);
                  if (response.res.status_cd === 0) {
                    if (type === 'post') {
                      let __properties = [...properties];
                      __properties[idx] = response.res.data;
                      setProperties(__properties);
                    }
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
              {properties?.length > 1 && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    removeProperty(properties[idx]);
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          </Paper>
        ))}
        <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
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
                  reinvestment_details_docs: null,
                  reinvestment_details: {
                    invested_in: '',
                    invest_amount: '',
                    invest_date: ''
                  }
                }
              ]);
            }}
          >
            Add Property Sold
          </Button>
          <GetActionButtons
            type="post"
            data={cg_property_land?.data}
            status={cg_property_land?.data?.status}
            urlEndpoint={`/income_tax_returns/capital-gains/upsert/`}
            recId={cg_property_land?.data?.id}
            service_request={service_id}
            task_id={cg_property_land?.task_id}
            setData={setProperties}
          />
        </Box>
        {/* Capital Gain from Equity/Mutual Fund */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} mt={4}>
          <Typography variant="subtitle1" fontWeight={700}>
            Capital Gain from Equity / Mutual Fund
          </Typography>
          <RaiseRequest
            fields={['Instrument', 'CAMS/Broker statements', 'Did you sell any foreign shares?', 'Did you sell any unlisted shares?']}
            task_id={cg_equity_mutual?.task_id}
          />
        </Stack>
        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          {/* 1. Instrument checkboxes */}
          <Box mb={2}>
            <Typography mb={1}>Which instrument(s) did you sell?</Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {eqMfTypes?.map((type) => (
                <FormControlLabel
                  key={type}
                  control={<Checkbox checked={equity_mutual_fund_type?.includes(type)} onChange={handleCamsInstrumentChange(type)} />}
                  label={type}
                />
              ))}
            </Box>
          </Box>
          {/* 2. File upload for CAMS/Broker statements */}
          <Box mb={2}>
            <Typography mb={1}>Upload CAMS / Broker statements:</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button size="small" variant="contained" component="label">
                Upload
                <input type="file" hidden multiple onChange={handleCamsFilesChange} />
              </Button>
              <Typography variant="body2">{camsFiles?.length} file(s) selected</Typography>
              {camsFiles?.length > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setFileDialogOpen(true);
                    setDialogFilesData({
                      files: camsFiles,
                      urlEndpoint: 'capital-gains-equity-mutual-fund'
                    });
                  }}
                >
                  View
                </Button>
              )}
            </Stack>
          </Box>
          {/* 3. Did you sell any foreign shares? */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography mb={1}>Did you sell any foreign shares?</Typography>
            <RadioGroup row value={soldForeignShares} onChange={(_, v) => setSoldForeignShares(v)}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </Stack>
          {/* 4. Did you sell any unlisted shares? */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography mb={1}>Did you sell any unlisted shares?</Typography>
            <RadioGroup row value={soldUnlistedShares} onChange={(_, v) => setSoldUnlistedShares(v)}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }} spacing={1} mb={2}>
            <Button size="small" variant="contained" onClick={handleCamsSave}>
              Save
            </Button>
            <GetActionButtons
              type="post"
              data={cg_equity_mutual?.data}
              status={cg_equity_mutual?.data?.status}
              urlEndpoint={`/income_tax_returns/capital-gains/equity-mutual-fund/submit/`}
              recId={cg_equity_mutual?.data?.id}
              service_request={service_id}
              task_id={cg_equity_mutual?.task_id}
            />
          </Stack>
        </Paper>
        {/* 5. Details of other Capital Gains table (already present) */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} mt={3}>
          <Typography variant="subtitle1" fontWeight={700}>
            Details of other Capital Gains
          </Typography>
          <RaiseRequest
            fields={['Asset Details', 'Purchase Date', 'Purchase Value', 'Sale Date', 'Sale Value', 'Upload doc']}
            task_id={cg_other_sources?.task_id}
          />
        </Stack>
        <Box mb={2}>
          <Paper elevation={2} sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important', width: '15%' }}>Asset Details</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important', width: '15%' }}>Purchase Date</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important', width: '15%' }}>Purchase Value</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important', width: '13%' }}>Sale Date</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important', width: '14%' }}>Sale Value</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important', width: '15%' }}>Doc</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important', width: '15%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otherGainsRows?.map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ px: 0.5, py: 1, pl: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Asset Details"
                        value={otherGainsRows?.[idx]?.asset_details || ''}
                        onChange={(e) => {
                          const updated = [...(otherGainsRows || [])];
                          if (!updated[idx]) updated[idx] = {};
                          updated[idx].asset_details = e.target.value;
                          setOtherGainsRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 0.5, py: 1 }}>
                      <TextField
                        size="small"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        placeholder="Purchase Date"
                        value={otherGainsRows?.[idx]?.purchase_date || ''}
                        onChange={(e) => {
                          const updated = [...(otherGainsRows || [])];
                          if (!updated[idx]) updated[idx] = {};
                          updated[idx].purchase_date = e.target.value;
                          setOtherGainsRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 0.5, py: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Purchase Value"
                        value={otherGainsRows?.[idx]?.purchase_value || ''}
                        onChange={(e) => {
                          const updated = [...(otherGainsRows || [])];
                          if (!updated[idx]) updated[idx] = {};
                          updated[idx].purchase_value = e.target.value;
                          setOtherGainsRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 0.5, py: 1 }}>
                      <TextField
                        size="small"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        placeholder="Sale Date"
                        value={otherGainsRows?.[idx]?.sale_date || ''}
                        onChange={(e) => {
                          const updated = [...(otherGainsRows || [])];
                          if (!updated[idx]) updated[idx] = {};
                          updated[idx].sale_date = e.target.value;
                          setOtherGainsRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 0.5, py: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Sale Value"
                        value={otherGainsRows?.[idx]?.sale_value || ''}
                        onChange={(e) => {
                          const updated = [...(otherGainsRows || [])];
                          if (!updated[idx]) updated[idx] = {};
                          updated[idx].sale_value = e.target.value;
                          setOtherGainsRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 0.5, py: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ p: 0 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input
                            type="file"
                            hidden
                            multiple={true}
                            onChange={(e) => {
                              const updated = [...otherGainsRows];
                              updated[idx].documents = e.target.files;
                              setOtherGainsRows(updated);
                            }}
                          />
                        </Button>
                        {otherGainsRows?.[idx]?.documents && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setFileDialogOpen(true);
                              setDialogFilesData({ files: [...otherGainsRows?.[idx]?.documents], urlEndpoint: 'other-capital-gains' });
                            }}
                          >
                            View
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ px: 0.5, py: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          const row = otherGainsRows?.[idx] || {};
                          const formData = new FormData();
                          formData.append('service_request', service_id);
                          formData.append('service_task', cg_other_sources.task_id);
                          formData.append('status', 'in progress');
                          formData.append('asset_details', row.asset_details || '');
                          formData.append('purchase_date', row.purchase_date || '');
                          if (row.id) formData.append('id', row.id);
                          formData.append('purchase_value', row.purchase_value || '');
                          formData.append('sale_date', row.sale_date || '');
                          formData.append('sale_value', row.sale_value || '');
                          if (row.documents && row.documents?.length > 0) {
                            Array.from(row.documents).forEach((file) => {
                              if (file instanceof File) formData.append('documents', file);
                            });
                          }
                          const response = await Factory('post', `/income_tax_returns/other-capital-gains/with-files/`, formData);
                          if (response.res.status_cd === 0) {
                            setOtherGainsRows(response.res.data.data.other_capital_gain_info);
                            enqueueSnackbar('Other Capital Gains submitted successfully', {
                              anchorOrigin: { vertical: 'top', horizontal: 'right' },
                              variant: 'success'
                            });
                          } else {
                            enqueueSnackbar('Error submitting Other Capital Gains', {
                              anchorOrigin: { vertical: 'top', horizontal: 'right' },
                              variant: 'error'
                            });
                          }
                        }}
                      >
                        Save
                      </Button>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={async () => {
                          const res = await Factory(
                            'delete',
                            `/income_tax_returns/other-capital-gains/delete/${otherGainsRows?.[idx].id}/`,
                            {}
                          );
                          if (res.res.status_cd === 0) {
                            const updated = [...otherGainsRows];
                            updated.splice(idx, 1);
                            setOtherGainsRows(updated);
                            enqueueSnackbar('Other Capital Gains deleted successfully', {
                              anchorOrigin: { vertical: 'top', horizontal: 'right' },
                              variant: 'success'
                            });
                          } else {
                            enqueueSnackbar('Error deleting Other Capital Gains', {
                              anchorOrigin: { vertical: 'top', horizontal: 'right' },
                              variant: 'error'
                            });
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                setOtherGainsRows([
                  ...otherGainsRows,
                  {
                    asset_details: '',
                    purchase_date: '',
                    purchase_value: '',
                    sale_date: '',
                    sale_value: '',
                    documents: null
                  }
                ])
              }
            >
              Add Row
            </Button>
            <GetActionButtons
              type="post"
              data={cg_other_sources}
              status={cg_other_sources?.data[0]?.status}
              urlEndpoint={`/income_tax_returns/other-capital-gains/with-files/`}
              recId={cg_other_sources?.data[0]?.id}
              service_request={service_id}
              task_id={cg_other_sources?.task_id}
            />
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
    status: apiObj?.status || '',
    service_request: apiObj?.service_request,
    service_task: apiObj?.service_task,
    assignee: apiObj?.assignee,
    reviewer: apiObj?.reviewer,
    // Opting data
    section: apiObj?.opting_data?.section || '',
    nature: apiObj?.opting_data?.nature || '',
    presumptive_rate: apiObj?.opting_data?.presumptive_rate || '',
    presumptive_income: apiObj?.opting_data?.presumptive_income || '',
    grossturnover_or_receipts: apiObj.opting_data?.grossturnover_or_receipts || '',
    digital_receipts: apiObj.opting_data?.digital_receipts || '',
    // Documents (use first file or array as needed)
    form26as_files: apiObj.documents?.['26AS']?.files || null,
    ais_files: apiObj.documents?.['AIS']?.files || null,
    gst_returns_files: apiObj.documents?.['GST Returns']?.files || null,
    bank_statements_files: apiObj.documents?.['Bank Statements']?.files || null,
    other_files: apiObj.documents?.['Other']?.files || null
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
    if (data?.data?.length > 0 && data?.data[0]?.business_professional_income_info?.length > 0) {
      setBusinessRows(data.data[0].business_professional_income_info.map(transformBusinessApiResponse));
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
          bank_statements_files: null,
          form26as_files: null,
          ais_files: null,
          profit_loss_statement_files: null,
          balance_sheet_files: null,
          gst_returns_files: null,
          other_files: null,
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
          key === 'bank_statements_files' ||
          key === 'form26as_files' ||
          key === 'ais_files' ||
          key === 'profit_loss_statement_files' ||
          key === 'balance_sheet_files' ||
          key === 'gst_returns_files' ||
          key === 'other_files'
        ) {
          if (value && value?.length > 0) {
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
    let type = 'post';
    let url = '/income_tax_returns/business-professional-income/';
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      setBusinessRows(res.res.id.business_professional_income_info.map(transformBusinessApiResponse));
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

  const removeBusinessIncome = async (row, idx) => {
    const res = await Factory('delete', `/income_tax_returns/business-professional-income/${row.id}/delete/`, {});

    if (res.res.status_cd === 0) {
      let updated = [...businessRows];
      updated.splice(idx, 1);
      setBusinessRows(updated);
      let updatedSection = [...selectedSection];
      updatedSection.splice(idx, 1);
      setSelectedSection(updatedSection);
      enqueueSnackbar('Business/Profession Income deleted successfully!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } else {
      enqueueSnackbar('Business/Profession Income delete failed', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }} spacing={2} alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          Business/Professional Income:
        </Typography>
        <RaiseRequest
          fields={[
            'Business Name',
            'Business Type',
            'Opting for presumptive?',
            'Section/Type of',
            'Nature',
            'Presumptive Rate',
            'Presumptive Income',
            'Bank Statements',
            'Form 26AS',
            'AIS',
            'Profit & Loss Statement',
            'Balance Sheet',
            'GST Returns',
            'Gross Turnover',
            'Digital Percentage Receipts',
            'Net Profit'
          ]}
          task_id={data.task_id}
        />
      </Stack>
      {Array.from({ length: businessRows?.length }).map((_, idx) => {
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
                    <Typography>Digital Percentage Receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Digital Percentage Receipts"
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
                              updatedBank[idx].bank_statements_files = e.target.files;
                              setBusinessRows(updatedBank);
                            }
                          }}
                        />
                      </Button>
                      {businessRows[idx]?.bank_statements_files && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            setFileDialogOpen(true);
                            setDialogFilesData({
                              files: [...businessRows[idx].bank_statements_files],
                              urlEndpoint: 'business-professional-income'
                            });
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
                            updated[idx].form26as_files = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.form26as_files && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: [...businessRows[idx].form26as_files], urlEndpoint: 'business-professional-income' });
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
                            updatedAIS[idx].ais_files = e.target.files;
                            setBusinessRows(updatedAIS);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.ais_files && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: [...businessRows[idx].ais_files], urlEndpoint: 'business-professional-income' });
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
                            updatedOtherDocs[idx].other_files = e.target.files;
                            setBusinessRows(updatedOtherDocs);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.other_files && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: [...businessRows[idx].other_files], urlEndpoint: 'business-professional-income' });
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
                    <Typography>Digital Percentage Receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Digital Percentage Receipts"
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
                              updatedBank[idx].bank_statements_files = e.target.files;
                              setBusinessRows(updatedBank);
                            }
                          }}
                        />
                      </Button>
                      {businessRows[idx]?.bank_statements_files && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            setFileDialogOpen(true);
                            setDialogFilesData({
                              files: [...businessRows[idx].bank_statements_files],
                              urlEndpoint: 'business-professional-income'
                            });
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
                                updated[idx].profit_loss_statement_files = e.target.files;
                                setBusinessRows(updated);
                              }
                            }}
                          />
                        </Button>
                        {businessRows[idx]?.profit_loss_statement_files && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              setDialogFilesData({
                                files: [...businessRows[idx].profit_loss_statement_files],
                                urlEndpoint: 'business-professional-income'
                              });
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
                                updated[idx].balance_sheet_files = e.target.files;
                                setBusinessRows(updated);
                              }
                            }}
                          />
                        </Button>
                        {businessRows[idx]?.balance_sheet_files && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              setDialogFilesData({
                                files: [...businessRows[idx].balance_sheet_files],
                                urlEndpoint: 'business-professional-income'
                              });
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
                                updated[idx].gst_returns_files = e.target.files;
                                setBusinessRows(updated);
                              }
                            }}
                          />
                        </Button>
                        {businessRows[idx]?.gst_returns_files && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              setFileDialogOpen(true);
                              setDialogFilesData({
                                files: [...businessRows[idx].gst_returns_files],
                                urlEndpoint: 'business-professional-income'
                              });
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
                            updated[idx].form26as_files = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.form26as_files && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: [...businessRows[idx].form26as_files], urlEndpoint: 'business-professional-income' });
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
                            updated[idx].ais_files = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.ais_files && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: [...businessRows[idx].ais_files], urlEndpoint: 'business-professional-income' });
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
                            updated[idx].other_files = e.target.files;
                            setBusinessRows(updated);
                          }
                        }}
                      />
                    </Button>
                    {businessRows[idx]?.other_files && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setFileDialogOpen(true);
                          setDialogFilesData({ files: [...businessRows[idx].other_files], urlEndpoint: 'business-professional-income' });
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
              {businessRows?.length > 1 && (
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    removeBusinessIncome(businessRows[idx], idx);
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          </Paper>
        );
      })}
      <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
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
                bank_statements_files: null,
                form26as_files: null,
                ais_files: null,
                profit_loss_statement_files: null,
                balance_sheet_files: null,
                gst_returns_files: null,
                other_files: null,
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
        <GetActionButtons
          type="post"
          urlEndpoint="/income_tax_returns/business-professional-income/"
          status={data?.data[0]?.status}
          data={data}
          service_request={service_id}
          task_id={data?.task_id}
        />
      </Box>
    </Box>
  );
};

const interestTypes = ['Savings Account', 'Recurring Deposit', 'NRO Account', 'NRE Account', 'Fixed Deposit', 'Other'];

const relationOptions = ['Relative', 'Non Relative'];

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
  const { enqueueSnackbar } = useSnackbar();
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
    { amount: '', received_from: '', relation: '', date_received: '', was_it_marriage_related: 'No', file: '' }
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
    if (interest_income?.data?.length > 0) {
      setInterestApplicable(interest_income?.data[0]?.interest_income);
      if (interest_income?.data[0]?.documents?.length > 0) {
        setInterestRows(interest_income?.data[0]?.documents);
      }
    }
  }, [interest_income]);

  useEffect(() => {
    if (dividend_income?.data?.length > 0) {
      setDividendApplicable(dividend_income?.data[0]?.dividend_income);
      if (dividend_income?.data[0]?.documents?.length > 0) {
        setDividendRows(dividend_income?.data[0]?.documents);
      }
    }
  }, [dividend_income]);

  useEffect(() => {
    if (gift_income?.data?.length > 0) {
      setGiftApplicable(gift_income?.data[0]?.gift_income);
      if (gift_income?.data[0]?.gift_income_details?.length > 0) {
        setGiftRows(gift_income?.data[0]?.gift_income_details);
      }
    }
  }, [gift_income]);

  useEffect(() => {
    if (family_income?.data?.length > 0) {
      setFamilyApplicable(family_income?.data[0]?.family_pension_income);
      if (family_income?.data[0]?.family_pension_income_docs?.length > 0) {
        setFamilyRows(family_income?.data[0]?.family_pension_income_docs);
      }
    }
  }, [family_income]);

  useEffect(() => {
    if (foreign_income?.data?.length > 0) {
      setForeignApplicable(foreign_income?.data[0]?.foreign_income);
      if (foreign_income?.data[0]?.foreign_income_docs?.length > 0) {
        setForeignRows(foreign_income?.data[0]?.foreign_income_docs);
      }
    }
  }, [foreign_income]);

  useEffect(() => {
    if (winning_income?.data?.length > 0) {
      setWinningsApplicable(winning_income?.data[0]?.winning_income);
      if (winning_income?.data[0]?.winnings_income_docs?.length > 0) {
        setWinningsRows(winning_income?.data[0]?.winnings_income_docs);
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
      if (type === 'post') {
        let __interest_rows = JSON.parse(JSON.stringify(interestRows));
        __interest_rows[idx] = res.res.data;
        setInterestRows(__interest_rows);
      }
      enqueueSnackbar('Saved successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Error saving ', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
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
      if (type === 'post') {
        let __dividend_rows = JSON.parse(JSON.stringify(dividendRows));
        __dividend_rows[idx] = res.res.data;
        setDividendRows(__dividend_rows);
      }
      enqueueSnackbar('Saved successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Error saving', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  const saveGiftRow = async (row, idx) => {
    let type = row.id ? 'put' : 'post';
    let url = row.id ? `/income_tax_returns/gift-income-document/${row.id}/update/` : `/income_tax_returns/gift-income-document/add/`;
    let formData = new FormData();
    formData.append('amount', row.amount);
    formData.append('received_from', row.received_from);
    formData.append('relation', row.relation);
    formData.append('date_received', row.date_received);
    formData.append('was_it_marriage_related', row.was_it_marriage_related);
    formData.append('gift_income', gift_income.data[0].id);
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      if (type === 'post') {
        let __gift_rows = JSON.parse(JSON.stringify(giftRows));
        __gift_rows[idx] = res.res.data;
        setGiftRows(__gift_rows);
      }
      enqueueSnackbar('Saved successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Error saving', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
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
    formData.family_pension = family_income.data[0].id;

    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      if (type === 'post') {
        let __family_rows = JSON.parse(JSON.stringify(familyRows));
        __family_rows[idx] = res.res.data;
        setFamilyRows(__family_rows);
      }
      enqueueSnackbar('Saved successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Error saving', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
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
      if (type === 'post') {
        let __foreign_rows = JSON.parse(JSON.stringify(foreignRows));
        __foreign_rows[idx] = res.res.data;
        setForeignRows(__foreign_rows);
      }
      enqueueSnackbar('Saved successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Error saving', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
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
      if (type === 'post') {
        let __winnings_rows = JSON.parse(JSON.stringify(winningsRows));
        __winnings_rows[idx] = res.res.data;
        setWinningsRows(__winnings_rows);
      }
      enqueueSnackbar('Saved successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Error saving', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  const removeRow = async (id, type, idx) => {
    const res = await Factory('delete', `/income_tax_returns/${type}/${id}/delete/`);
    if (res.res.status_cd === 0) {
      switch (type) {
        case 'interest-income-doc':
          let __interest_rows = JSON.parse(JSON.stringify(interestRows));
          __interest_rows.splice(idx, 1);
          setInterestRows(__interest_rows);
          break;
        case 'dividend-income-document':
          let __dividend_rows = JSON.parse(JSON.stringify(dividendRows));
          __dividend_rows.splice(idx, 1);
          setDividendRows(__dividend_rows);
          break;
        case 'gift-income-document':
          let __gift_rows = JSON.parse(JSON.stringify(giftRows));
          __gift_rows.splice(idx, 1);
          setGiftRows(__gift_rows);
          break;
        case 'family-pension-income-documents/files':
          let __family_rows = JSON.parse(JSON.stringify(familyRows));
          __family_rows.splice(idx, 1);
          setFamilyRows(__family_rows);
          break;
        case 'foreign-income-info':
          let __foreign_rows = JSON.parse(JSON.stringify(foreignRows));
          __foreign_rows.splice(idx, 1);
          setForeignRows(__foreign_rows);
          break;
        case 'winning-income-docs':
          let __winnings_rows = JSON.parse(JSON.stringify(winningsRows));
          __winnings_rows.splice(idx, 1);
          setWinningsRows(__winnings_rows);
          break;
      }
      enqueueSnackbar('Deleted successfully!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } else {
      enqueueSnackbar('Error deleting', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };
  return (
    <Box>
      {/* Interest Income Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: interestApplicable === 'Applicable' ? 1 : 2, justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
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
        <RaiseRequest fields={[]} task_id={interest_income.task_id} />
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
                {interestRows?.map((row, idx) => (
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
                            if (row.file instanceof File) {
                              window.open(URL.createObjectURL(row.file), '_blank');
                            } else {
                              viewFile(row.file);
                            }
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
                        {interestRows?.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => removeRow(row.id, 'interest-income-doc', idx)}>
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
        </>
      )}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {interestApplicable === 'Applicable' && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setInterestRows([...interestRows, { interest_type: '', interest_earned: '', bank_name: '' }])}
          >
            Add Row
          </Button>
        )}
        <GetActionButtons
          type="post"
          data={interest_income}
          setData={setInterestRows}
          service_request={service_id}
          task_id={interest_income?.task_id}
          urlEndpoint="/income_tax_returns/interest-income/upsert/"
          status={interest_income?.data[0]?.status}
        />
      </Box>
      {/* Dividend Income Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          mb: dividendApplicable === 'Applicable' ? 1 : 2,
          justifyContent: 'space-between',
          mt: 2
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
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
        <RaiseRequest fields={[]} task_id={dividend_income.task_id} />
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
                {dividendRows?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Received From"
                        value={row.received_from}
                        onChange={(e) => {
                          const updated = [...dividendRows];
                          updated[idx].received_from = e.target.value;
                          setDividendRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Dividend Received"
                        type="number"
                        value={row.dividend_received}
                        onChange={(e) => {
                          const updated = [...dividendRows];
                          updated[idx].dividend_received = e.target.value;
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
                            if (row.file instanceof File) {
                              window.open(URL.createObjectURL(row.file), '_blank');
                            } else {
                              viewFile(row.file);
                            }
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
                        {dividendRows?.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => removeRow(row.id, 'dividend-income-document', idx)}>
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
        </>
      )}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {dividendApplicable === 'Applicable' && (
          <Button size="small" variant="outlined" onClick={() => setDividendRows([...dividendRows, { from: '', received: '' }])}>
            Add Row
          </Button>
        )}
        <GetActionButtons
          type="post"
          data={dividend_income}
          setData={setDividendRows}
          service_request={service_id}
          task_id={dividend_income?.task_id}
          urlEndpoint="/income_tax_returns/dividend-income/upsert/"
          status={dividend_income?.data[0]?.status}
        />
      </Box>
      {/* Gift Income Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: giftApplicable === 'Applicable' ? 1 : 2, justifyContent: 'space-between', mt: 2 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
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
        <RaiseRequest fields={[]} task_id={gift_income.task_id} />
      </Stack>
      {giftApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '17%' }}>Amount</TableCell>
                  <TableCell sx={{ width: '18%' }}>Received From</TableCell>
                  <TableCell sx={{ width: '20%' }}>Relation</TableCell>
                  <TableCell sx={{ width: '20%' }}>Date Received</TableCell>
                  <TableCell sx={{ width: '15%' }}>Marriage?</TableCell>
                  <TableCell sx={{ width: '20%' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {giftRows?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ p: 0.5, py: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Amount"
                        type="number"
                        value={row?.amount}
                        onChange={(e) => {
                          const updated = [...giftRows];
                          updated[idx].amount = e.target.value;
                          setGiftRows(updated);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0.5, py: 1 }}>
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
                    <TableCell sx={{ p: 0.5, py: 1 }}>
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
                    <TableCell sx={{ p: 0.5, py: 1 }}>
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
                    <TableCell sx={{ p: 0.5, py: 1 }} align="center">
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
                          value="Yes"
                          control={<Radio size="small" checked={row.was_it_marriage_related === 'Yes'} />}
                          label="Yes"
                          sx={{ m: 0 }}
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio size="small" checked={row.was_it_marriage_related === 'No'} />}
                          label="No"
                          sx={{ m: 0 }}
                        />
                      </RadioGroup>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveGiftRow(row, idx)}>
                          Save
                        </Button>
                        {giftRows?.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => removeRow(row.id, 'gift-income-document', idx)}>
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
        </>
      )}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {giftApplicable === 'Applicable' && (
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setGiftRows([...giftRows, { amount: '', received_from: '', relation: '', date_received: '', was_it_marriage_related: 'No' }])
            }
          >
            Add Row
          </Button>
        )}
        <GetActionButtons
          type="post"
          data={gift_income}
          setData={setGiftRows}
          service_request={service_id}
          task_id={gift_income?.task_id}
          urlEndpoint="/income_tax_returns/gift-income/upsert/"
          status={gift_income?.data[0]?.status}
        />
      </Box>
      {/* Family Pension Income Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: familyApplicable === 'Applicable' ? 1 : 2, justifyContent: 'space-between', mt: 2 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
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
        <RaiseRequest fields={[]} task_id={family_income.task_id} />
      </Stack>
      {familyApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Amount Received</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyRows?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Amount Received"
                        type="number"
                        value={row?.amount}
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
                        value={row?.source}
                        onChange={(_, v) => {
                          const updated = [...familyRows];
                          updated[idx].source = v;
                          setFamilyRows(updated);
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Source" />}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="contained" onClick={() => saveFamilyRow(row, idx)}>
                          Save
                        </Button>
                        {familyRows?.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeRow(row.id, 'family-pension-income-documents/files', idx)}
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
          </Box>
        </>
      )}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {familyApplicable === 'Applicable' && (
          <Button size="small" variant="outlined" onClick={() => setFamilyRows([...familyRows, { amount: '', source: '' }])}>
            Add Row
          </Button>
        )}
        <GetActionButtons
          type="post"
          data={family_income}
          setData={setFamilyRows}
          service_request={service_id}
          task_id={family_income?.task_id}
          urlEndpoint="/income_tax_returns/family-pension-income/upsert/"
          status={family_income?.data[0]?.status}
        />
      </Box>
      {/* Foreign Income Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: foreignApplicable === 'Applicable' ? 1 : 2, justifyContent: 'space-between', mt: 2 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
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
        <RaiseRequest fields={[]} task_id={foreign_income.task_id} />
      </Stack>
      {foreignApplicable === 'Applicable' && (
        <>
          <Box sx={{ p: 0, boxShadow: '0px 0px 10px 0px rgba(66, 66, 66, 0.1)', borderRadius: 2, mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ p: 0.5, py: 1, width: '20%' }}>Type of Income</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '20%' }}>Country</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '10%' }}>Currency</TableCell>
                  <TableCell sx={{ p: 0.5, py: 1, width: '15%' }}>Amount</TableCell>
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
                {foreignRows?.map((row, idx) => (
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
                        type="number"
                        value={row?.amount}
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
                        value={row?.tax_paid_abroad}
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
                            if (row.form67_file instanceof File) {
                              window.open(URL.createObjectURL(row.form67_file), '_blank');
                            } else {
                              viewFile(row.form67_file);
                            }
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
                        {foreignRows?.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => removeRow(row.id, 'foreign-income-info', idx)}>
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
        </>
      )}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {foreignApplicable === 'Applicable' && (
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
        )}
        <GetActionButtons
          type="post"
          data={foreign_income}
          setData={setForeignRows}
          service_request={service_id}
          task_id={foreign_income?.task_id}
          urlEndpoint="/income_tax_returns/foreign-income/upsert/"
          status={foreign_income?.data[0]?.status}
        />
      </Box>
      {/* Winnings/Lottery Income Section */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: winningsApplicable === 'Applicable' ? 1 : 2, justifyContent: 'space-between', mt: 2 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
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
        <RaiseRequest fields={[]} task_id={winning_income.task_id} />
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
                {winningsRows?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={winningsSources}
                        value={row?.source}
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
                        type="number"
                        value={row?.amount}
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
                            if (row.file instanceof File) {
                              window.open(URL.createObjectURL(row.file), '_blank');
                            } else {
                              viewFile(row.file);
                            }
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
                        {winningsRows?.length > 1 && (
                          <IconButton size="small" color="error" onClick={() => removeRow(row.id, 'winning-income-docs', idx)}>
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
        </>
      )}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {winningsApplicable === 'Applicable' && (
          <Button size="small" variant="outlined" onClick={() => setWinningsRows([...winningsRows, { source: '', amount: '' }])}>
            Add Row
          </Button>
        )}
        <GetActionButtons
          type="post"
          data={winning_income}
          setData={setWinningsRows}
          service_request={service_id}
          task_id={winning_income?.task_id}
          urlEndpoint="/income_tax_returns/winning-income/upsert/"
          status={winning_income?.data[0]?.status}
        />
      </Box>
    </Box>
  );
};

const AgricultureIncome = ({ data, service_id, setFileDialogOpen, fileDialogOpen, dialogFilesData, setDialogFilesData }) => {
  const { enqueueSnackbar } = useSnackbar();
  let initialData = {
    id: null,
    agriculture_income_docs: {
      amount: '',
      file: ''
    },
    status: 'in progress',
    agriculture: 'Not Applicable'
  };
  data = data[0];
  const [agricultureIncome, setAgricultureIncome] = React.useState(initialData);

  useEffect(() => {
    if (data?.data?.length > 0) {
      let __data = data.data[0];
      if (__data?.agriculture_income_docs === null) {
        __data.agriculture_income_docs = { amount: '', file: '' };
      }
      setAgricultureIncome(__data);
    }
  }, [data]);
  const postIncomeApplicability = async (v) => {
    let formData = new FormData();
    formData.append('service_request', parseInt(service_id));
    formData.append('service_task', parseInt(data.task_id));
    formData.append('agriculture', v);
    formData.append('status', 'in progress');
    const res = await Factory('post', `/income_tax_returns/agriculture-income/upsert/`, formData);
    if (res.res.status_cd === 0) {
      let __data = res.res.data;
      if (__data?.agriculture_income_docs === null) {
        __data.agriculture_income_docs = { amount: '', file: '' };
      }
      setAgricultureIncome(__data);
      return true;
    }
  };
  const postAgriculturalIncome = async () => {
    let formData = new FormData();
    let id = agricultureIncome?.agriculture_income_docs?.id || null;
    let type = 'post';
    let url = `/income_tax_returns/agriculture-income-docs/add/`;
    if (id) {
      type = 'put';
      url = `/income_tax_returns/agriculture-income-docs/${id}/update/`;
      formData.append('id', parseInt(id));
    }
    formData.append('agriculture_income', parseInt(data.data[0].id));
    formData.append('service_request', parseInt(service_id));
    formData.append('service_task', parseInt(data.task_id));
    if (agricultureIncome.agriculture_income_docs.file instanceof File)
      formData.append('file', agricultureIncome.agriculture_income_docs.file);
    formData.append('amount', agricultureIncome.agriculture_income_docs.amount);
    formData.append('status', 'in progress');
    const res = await Factory(type, url, formData);
    if (res.res.status_cd === 0) {
      if (type === 'post')
        setAgricultureIncome((prev) => ({ ...prev, agriculture_income_docs: { ...prev.agriculture_income_docs, id: res.res.data.id } }));
      enqueueSnackbar('Agricultural income saved successfully', {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'success'
      });
    } else {
      enqueueSnackbar('Error saving agricultural income', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'error' });
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <Typography>Do you have agricultural income during F.Y.? </Typography>
          <RadioGroup
            row
            value={agricultureIncome.agriculture}
            onChange={(_, v) => {
              postIncomeApplicability(v);
              setAgricultureIncome({ ...agricultureIncome, agriculture: v });
            }}
          >
            <FormControlLabel value="Applicable" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="Not Applicable" control={<Radio size="small" />} label="No" />
          </RadioGroup>
        </Box>
        <RaiseRequest fields={['Agricultural income during F.Y.']} task_id={data?.task_id} />
      </Stack>
      {agricultureIncome.agriculture === 'Applicable' && (
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Typography>If yes, enter net agricultural income earned</Typography>
          <TextField
            size="small"
            fullWidth
            sx={{ maxWidth: 200 }}
            value={agricultureIncome?.agriculture_income_docs?.amount}
            onChange={(e) =>
              setAgricultureIncome({
                ...agricultureIncome,
                agriculture_income_docs: { ...agricultureIncome.agriculture_income_docs, amount: e.target.value }
              })
            }
            placeholder="Agricultural Income"
          />
          <Button size="small" variant="contained" component="label">
            Upload
            <input
              type="file"
              hidden
              onChange={(e) =>
                setAgricultureIncome({
                  ...agricultureIncome,
                  agriculture_income_docs: { ...agricultureIncome.agriculture_income_docs, file: e.target.files[0] }
                })
              }
            />
          </Button>
          {agricultureIncome?.agriculture_income_docs?.file && (
            <Button
              size="small"
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => {
                if (agricultureIncome?.agriculture_income_docs?.file instanceof File) {
                  window.open(URL.createObjectURL(agricultureIncome?.agriculture_income_docs?.file), '_blank');
                } else {
                  viewFile(agricultureIncome?.agriculture_income_docs?.file);
                }
              }}
            >
              View
            </Button>
          )}
        </Stack>
      )}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button size="small" variant="contained" onClick={postAgriculturalIncome}>
          Save
        </Button>
        <GetActionButtons
          type="post"
          data={data}
          status={data?.data[0]?.status}
          urlEndpoint={`/income_tax_returns/agriculture-income/upsert/`}
          service_request={service_id}
          task_id={data?.task_id}
        />
      </Box>
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
      return (
        <AgricultureIncome
          data={data.agriculture_income}
          service_id={service_id}
          setFileDialogOpen={setFileDialogOpen}
          fileDialogOpen={fileDialogOpen}
          dialogFilesData={dialogFilesData}
          setDialogFilesData={setDialogFilesData}
        />
      );
  }
};

export default IncomeDetails;
