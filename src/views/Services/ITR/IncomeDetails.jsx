import React from 'react';
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

const docTypes = [
  { key: 'form16', label: 'Form 16' },
  { key: 'payslip', label: 'Payslip' },
  { key: 'form26as', label: 'Form 26AS' },
  { key: 'ais', label: 'AIS' },
  { key: 'bank', label: 'Bank Statement' }
];

const foreignDocTypes = [
  { key: 'foreignSalarySlip', label: 'Foreign Salary Slip' },
  { key: 'foreignBankStmt', label: 'Foreign Bank Statement' },
  { key: 'taxPaidAbroad', label: 'Tax Paid Certificate Abroad' }
];

const SalaryIncome = () => {
  const formik = useFormik({
    initialValues: {
      docs: {
        form16: [],
        payslip: [],
        form26as: [],
        ais: [],
        bank: []
      },
      notes: {
        form16: '',
        payslip: '',
        form26as: '',
        ais: '',
        bank: ''
      },
      otherIncome: [{ details: '', amount: '', document: null, notes: '' }],
      nriResident: '',
      foreignSalary: '',
      foreignDocs: {
        foreignSalarySlip: [],
        foreignBankStmt: [],
        taxPaidAbroad: []
      },
      periodFrom: '',
      periodTo: '',
      country: '',
      salaryReceivedIn: []
    },
    validationSchema: Yup.object({
      docs: Yup.object({
        form16: Yup.array().min(1, 'Required'),
        form26as: Yup.array().min(1, 'Required'),
        ais: Yup.array().min(1, 'Required'),
        bank: Yup.array().min(1, 'Required')
      }),
      otherIncome: Yup.array().of(
        Yup.object({
          details: Yup.string().required('Required'),
          amount: Yup.string().required('Required'),
          document: Yup.mixed(),
          notes: Yup.string()
        })
      ),
      foreignDocs: Yup.object({
        foreignSalarySlip: Yup.array().min(1, 'Required'),
        foreignBankStmt: Yup.array().min(1, 'Required'),
        taxPaidAbroad: Yup.array().min(1, 'Required')
      }),
      periodFrom: Yup.string().required('Required'),
      periodTo: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      salaryReceivedIn: Yup.array().min(1, 'Select at least one')
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Typography variant="h5" mb={2} sx={{ textDecoration: 'underline' }}>
          Upload Required Documents
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Document Type</TableCell>
              <TableCell>Uploads</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ alignItems: 'flex-start' }}>
            {docTypes.map((doc) => {
              const error = formik.touched.docs?.[doc.key] && formik.errors.docs?.[doc.key];
              return (
                <TableRow key={doc.key} sx={{ height: 80, verticalAlign: 'top' }}>
                  <TableCell>{doc.label}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body2" sx={{ minHeight: 24 }}>
                        {formik.values.docs[doc.key]?.length || 0} file(s)
                      </Typography>
                      <Box sx={{ minHeight: 20, height: 20 }}>
                        <Typography variant="caption" color="error.main">
                          {error ? error : '\u00A0'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Box>
                        {formik.values.docs[doc.key]?.map((file, idx) => (
                          <Button
                            key={idx}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 0.5 }}
                            onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                          >
                            View
                          </Button>
                        ))}
                        <Button size="small" variant="contained" component="label" sx={{ mb: 0.5 }}>
                          {doc.key === 'payslip' ? '+Upload' : formik.values.docs[doc.key]?.length ? '+Add more' : '+Upload'}
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                formik.setFieldValue(`docs.${doc.key}`, [...formik.values.docs[doc.key], e.target.files[0]]);
                              }
                            }}
                          />
                        </Button>
                      </Box>
                      <Box sx={{ minHeight: 20, height: 20 }}>
                        <Typography variant="caption" color="error.main">
                          {error ? error : '\u00A0'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={formik.values.notes[doc.key]}
                      onChange={(e) => formik.setFieldValue(`notes.${doc.key}`, e.target.value)}
                      placeholder="Add note"
                      helperText={'\u00A0'}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Typography variant="h5" mt={4} mb={2} sx={{ textDecoration: 'underline' }}>
          Details of any other income you wish to share
        </Typography>
        <FieldArray
          name="otherIncome"
          render={(arrayHelpers) => (
            <>
              {formik.values.otherIncome.map((row, idx) => (
                <Grid2 container spacing={1} alignItems="center" key={idx} mb={1}>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Details"
                      value={row.details}
                      onChange={(e) => formik.setFieldValue(`otherIncome[${idx}].details`, e.target.value)}
                      error={Boolean(formik.touched.otherIncome?.[idx]?.details && formik.errors.otherIncome?.[idx]?.details)}
                      helperText={
                        formik.touched.otherIncome?.[idx]?.details && formik.errors.otherIncome?.[idx]?.details
                          ? formik.errors.otherIncome[idx].details
                          : '\u00A0'
                      }
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 2 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Amount"
                      value={row.amount}
                      onChange={(e) => formik.setFieldValue(`otherIncome[${idx}].amount`, e.target.value)}
                      error={Boolean(formik.touched.otherIncome?.[idx]?.amount && formik.errors.otherIncome?.[idx]?.amount)}
                      helperText={
                        formik.touched.otherIncome?.[idx]?.amount && formik.errors.otherIncome?.[idx]?.amount
                          ? formik.errors.otherIncome[idx].amount
                          : '\u00A0'
                      }
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Box display="flex" flexDirection="column">
                      <Box>
                        <Button size="small" variant="contained" component="label" sx={{ mr: 1 }}>
                          Upload
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                formik.setFieldValue(`otherIncome[${idx}].document`, e.target.files[0]);
                              }
                            }}
                          />
                        </Button>
                        {row.document && (
                          <Button size="small" variant="outlined" onClick={() => window.open(URL.createObjectURL(row.document), '_blank')}>
                            View
                          </Button>
                        )}
                      </Box>
                      <Box minHeight={20}>
                        <Typography variant="caption" color="error.main">
                          {formik.touched.otherIncome?.[idx]?.document && formik.errors.otherIncome?.[idx]?.document
                            ? formik.errors.otherIncome[idx].document
                            : '\u00A0'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Notes"
                      value={row.notes}
                      onChange={(e) => formik.setFieldValue(`otherIncome[${idx}].notes`, e.target.value)}
                      helperText={'\u00A0'}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 1 }}>
                    {formik.values.otherIncome.length > 1 && (
                      <Button size="small" color="error" onClick={() => arrayHelpers.remove(idx)}>
                        <DeleteIcon />
                      </Button>
                    )}
                  </Grid2>
                </Grid2>
              ))}
              <Button
                size="small"
                variant="outlined"
                onClick={() => arrayHelpers.push({ details: '', amount: '', document: null, notes: '' })}
              >
                Add row
              </Button>
            </>
          )}
        />
        <Box mt={4} mb={2}>
          <Typography mb={1}>Were you a non-resident for any part of the financial year?</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.nriResident === 'yes'}
                onChange={() => formik.setFieldValue('nriResident', formik.values.nriResident === 'yes' ? '' : 'yes')}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.nriResident === 'no'}
                onChange={() => formik.setFieldValue('nriResident', formik.values.nriResident === 'no' ? '' : 'no')}
              />
            }
            label="No"
          />
        </Box>
        <Box mb={2}>
          <Typography mb={1}>Did you have foreign salary and employment?</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.foreignSalary === 'yes'}
                onChange={() => formik.setFieldValue('foreignSalary', formik.values.foreignSalary === 'yes' ? '' : 'yes')}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.foreignSalary === 'no'}
                onChange={() => formik.setFieldValue('foreignSalary', formik.values.foreignSalary === 'no' ? '' : 'no')}
              />
            }
            label="No"
          />
        </Box>
        <Typography variant="h5" mt={5} mb={2} sx={{ textDecoration: 'underline' }}>
          Foreign/NRI Employment & Salary Details
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Document Type</TableCell>
              <TableCell>Uploads</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ alignItems: 'flex-start' }}>
            {foreignDocTypes.map((doc) => {
              const error = formik.touched.foreignDocs?.[doc.key] && formik.errors.foreignDocs?.[doc.key];
              return (
                <TableRow key={doc.key} sx={{ height: 80, verticalAlign: 'top' }}>
                  <TableCell>{doc.label}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body2" sx={{ minHeight: 24 }}>
                        {formik.values.foreignDocs[doc.key]?.length || 0} file(s)
                      </Typography>
                      <Box sx={{ minHeight: 20, height: 20 }}>
                        <Typography variant="caption" color="error.main">
                          {error ? error : '\u00A0'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Box>
                        {formik.values.foreignDocs[doc.key]?.map((file, idx) => (
                          <Button
                            key={idx}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 0.5 }}
                            onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                          >
                            View
                          </Button>
                        ))}
                        <Button size="small" variant="contained" component="label" sx={{ mb: 0.5 }}>
                          {formik.values.foreignDocs[doc.key]?.length ? '+Add more' : '+Upload'}
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                formik.setFieldValue(`foreignDocs.${doc.key}`, [...formik.values.foreignDocs[doc.key], e.target.files[0]]);
                              }
                            }}
                          />
                        </Button>
                      </Box>
                      <Box sx={{ minHeight: 20, height: 20 }}>
                        <Typography variant="caption" color="error.main">
                          {error ? error : '\u00A0'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Grid2 container spacing={2} alignItems="center" mt={2}>
          {/* Period of Employment */}
          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography>Period of Employment</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3, md: 2 }}>
            <TextField
              size="small"
              type="date"
              fullWidth
              value={formik.values.periodFrom}
              onChange={(e) => formik.setFieldValue('periodFrom', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={Boolean(formik.touched.periodFrom && formik.errors.periodFrom)}
              helperText={formik.touched.periodFrom && formik.errors.periodFrom ? formik.errors.periodFrom : '\u00A0'}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3, md: 2 }}>
            <TextField
              size="small"
              type="date"
              fullWidth
              value={formik.values.periodTo}
              onChange={(e) => formik.setFieldValue('periodTo', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={Boolean(formik.touched.periodTo && formik.errors.periodTo)}
              helperText={formik.touched.periodTo && formik.errors.periodTo ? formik.errors.periodTo : '\u00A0'}
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
              value={formik.values.country}
              onChange={(e) => formik.setFieldValue('country', e.target.value)}
              error={Boolean(formik.touched.country && formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country ? formik.errors.country : '\u00A0'}
            />
          </Grid2>
        </Grid2>
        {/* Salary Received In */}
        <Box mt={2} mb={2}>
          <Typography mb={1}>Salary Received In</Typography>
          <FormControlLabel
            control={
              <Radio
                checked={formik.values.salaryReceivedIn === 'indian'}
                onChange={(e) => {
                  formik.setFieldValue('salaryReceivedIn', 'indian');
                }}
              />
            }
            label="Indian Bank"
          />
          <FormControlLabel
            control={
              <Radio
                checked={formik.values.salaryReceivedIn === 'foreign'}
                onChange={(e) => {
                  formik.setFieldValue('salaryReceivedIn', 'foreign');
                }}
              />
            }
            label="Foreign Bank"
          />
          <FormControlLabel
            control={
              <Radio
                checked={formik.values.salaryReceivedIn === 'both'}
                onChange={(e) => {
                  formik.setFieldValue('salaryReceivedIn', 'both');
                }}
              />
            }
            label="Both"
          />
          <Box minHeight={20}>
            <Typography variant="caption" color="error.main">
              {formik.touched.salaryReceivedIn && formik.errors.salaryReceivedIn ? formik.errors.salaryReceivedIn : '\u00A0'}
            </Typography>
          </Box>
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Save & Continue
        </Button>
      </form>
    </FormikProvider>
  );
};

const HousePropertyIncome = () => {
  const [numProperties, setNumProperties] = React.useState(1);
  const properties = Array.from({ length: numProperties });
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <Typography>No. of House Properties</Typography>
        <Button size="small" variant="outlined" onClick={() => setNumProperties(Math.max(1, numProperties - 1))}>
          -
        </Button>
        <Typography>{numProperties}</Typography>
        <Button size="small" variant="outlined" onClick={() => setNumProperties(numProperties + 1)}>
          +
        </Button>
      </Box>
      {properties.map((_, idx) => (
        <Paper key={idx} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8fafc' }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
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
                renderInput={(params) => <TextField {...params} placeholder="Select type" />}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Property Address</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Grid2 container spacing={1}>
                <Grid2 size={4}>
                  <TextField size="small" fullWidth placeholder="Line 1" />
                </Grid2>
                <Grid2 size={4}>
                  <TextField size="small" fullWidth placeholder="Line 2" />
                </Grid2>
                <Grid2 size={4}>
                  <TextField size="small" fullWidth placeholder="Line 3" />
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Is it Co-owned Property?</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <RadioGroup row>
                <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Ownership %</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField size="small" fullWidth placeholder="%" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Country (if Foreign)</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                size="small"
                fullWidth
                options={['India', 'Other']}
                renderInput={(params) => <TextField {...params} placeholder="Select country" />}
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
              <RadioGroup row>
                <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Annual Rent Received</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField size="small" fullWidth placeholder="Amount" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Rent Received In</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                size="small"
                fullWidth
                options={['Bank', 'Cash']}
                renderInput={(params) => <TextField {...params} placeholder="Select mode" />}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Did you pay municipal taxes?</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <RadioGroup row>
                <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Municipal tax paid</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField size="small" fullWidth placeholder="Amount" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Municipal tax receipt</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Button size="small" variant="contained" component="label">
                Upload
                <input type="file" hidden />
              </Button>
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
              <RadioGroup row>
                <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Interest paid during the FY</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField size="small" fullWidth placeholder="Amount" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Principal paid during the FY</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField size="small" fullWidth placeholder="Amount" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Upload loan interest certificate</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Button size="small" variant="contained" component="label">
                Upload
                <input type="file" hidden />
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography>Loan statement</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Button size="small" variant="contained" component="label">
                Upload
                <input type="file" hidden />
              </Button>
            </Grid2>
          </Grid2>
        </Paper>
      ))}
      <Button size="small" variant="outlined" onClick={() => setNumProperties(numProperties + 1)}>
        Add Property
      </Button>
      {numProperties > 1 && (
        <Button size="small" color="error" variant="outlined" onClick={() => setNumProperties(numProperties - 1)} sx={{ ml: 2 }}>
          Remove Property
        </Button>
      )}
    </Box>
  );
};

const CapitalGainsIncome = () => {
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [numProperties, setNumProperties] = React.useState(1);
  const [showReinvest, setShowReinvest] = React.useState(Array(numProperties).fill(false));
  const [numOtherGains, setNumOtherGains] = React.useState(1);
  const propertyTypes = ['Land', 'Plot', 'Building'];
  const gainTypes = ['Equity shares', 'Mutual funds', 'Property/Land', 'Foreign equity', 'Others'];
  const eqMfTypes = ['Equity shares', 'Mutual funds (equity)', 'Mutual funds (debt/hybrid)'];
  const investOptions = ['Bonds', 'Property', 'Other'];
  return (
    <Box>
      {/* Capital Gains Type Selection */}
      <Box mb={3}>
        <Typography mb={1}>Select the type of Capital Gains applicable:</Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {gainTypes.map((type) => (
            <FormControlLabel key={type} control={<Checkbox />} label={type} />
          ))}
        </Box>
      </Box>
      {/* Capital Gain from Property/Land */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8fafc' }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          Capital Gain from Property / Land
        </Typography>
        <Box display="flex" alignItems="center" mb={2} gap={2}>
          <Typography>No. of Properties Sold</Typography>
          <Button size="small" variant="outlined" onClick={() => setNumProperties(Math.max(1, numProperties - 1))}>
            -
          </Button>
          <Typography>{numProperties}</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setNumProperties(numProperties + 1);
              setShowReinvest([...showReinvest, false]);
            }}
          >
            +
          </Button>
        </Box>
        {Array.from({ length: numProperties }).map((_, idx) => (
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
                  renderInput={(params) => <TextField {...params} placeholder="Select type" />}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Date of Purchase</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField size="small" type="date" fullWidth InputLabelProps={{ shrink: true }} />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Purchase Cost</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField size="small" fullWidth placeholder="Amount" />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Date of Sale</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField size="small" type="date" fullWidth InputLabelProps={{ shrink: true }} />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Sale Value</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField size="small" fullWidth placeholder="Amount" />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Upload purchase doc</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Button size="small" variant="contained" component="label">
                  Upload
                  <input type="file" hidden />
                </Button>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Upload sale doc</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Button size="small" variant="contained" component="label">
                  Upload
                  <input type="file" hidden />
                </Button>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Reinvestment made</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup
                  row
                  value={showReinvest[idx] ? 'yes' : 'no'}
                  onChange={(_, v) => {
                    const arr = [...showReinvest];
                    arr[idx] = v === 'yes';
                    setShowReinvest(arr);
                  }}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
            </Grid2>
            {showReinvest[idx] && (
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
                          renderInput={(params) => <TextField {...params} placeholder="Select" />}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField size="small" fullWidth placeholder="Amount" />
                      </TableCell>
                      <TableCell>
                        <TextField size="small" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input type="file" hidden />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        ))}
      </Paper>
      {/* Capital Gain from Equity/Mutual Fund */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8fafc' }}>
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
              +Upload
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
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white !important' }}>Exit</TableCell>
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
                      <TextField size="small" fullWidth placeholder="Exit" />
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
    presumptiveRate: '6% (digital payments) or 8% of turnover',
    presumptiveIncome: 'Slab rates as per individual / firm'
  },
  '44ADA': {
    nature: 'Professionals (e.g., CA, Doctors, Lawyers, Architects)',
    presumptiveRate: '50% of gross receipts',
    presumptiveIncome: 'Slab rates as per individual'
  },
  '44AE': {
    nature: 'Goods transport businesses',
    presumptiveRate: 'Fixed amount per vehicle/month',
    presumptiveIncome: 'Slab rates after presumptive income computed'
  },
  '44BB': {
    nature: 'Non-resident in oil services',
    presumptiveRate: '10% of gross receipts (deemed profit)',
    presumptiveIncome: 'Flat 10% of gross receipts'
  },
  '44BBB': {
    nature: 'Foreign co. in turnkey power projects',
    presumptiveRate: '10% + surcharge + cess',
    presumptiveIncome: '10% of gross receipts'
  }
};

const sectionTypes = ['44AD', '44ADA', '44AE', '44BB', '44BBB'];

const BusinessIncome = () => {
  const [numBusinesses, setNumBusinesses] = React.useState(1);
  const [presumptive, setPresumptive] = React.useState(Array(numBusinesses).fill('no'));
  const [bookMaintained, setBookMaintained] = React.useState(Array(numBusinesses).fill('no'));
  const [gstRegistered, setGstRegistered] = React.useState(Array(numBusinesses).fill('no'));
  const [selectedSection, setSelectedSection] = React.useState(Array(numBusinesses).fill(''));
  const businessTypes = ['Trading', 'Manufacturing', 'Profession', 'Other'];

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <Typography>No. of Businesses/Professions</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setNumBusinesses(Math.max(1, numBusinesses - 1));
            setPresumptive(presumptive.slice(0, -1));
            setBookMaintained(bookMaintained.slice(0, -1));
            setGstRegistered(gstRegistered.slice(0, -1));
            setSelectedSection(selectedSection.slice(0, -1));
          }}
        >
          -
        </Button>
        <Typography>{numBusinesses}</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setNumBusinesses(numBusinesses + 1);
            setPresumptive([...presumptive, 'no']);
            setBookMaintained([...bookMaintained, 'no']);
            setGstRegistered([...gstRegistered, 'no']);
            setSelectedSection([...selectedSection, '']);
          }}
        >
          +
        </Button>
      </Box>
      {Array.from({ length: numBusinesses }).map((_, idx) => {
        const section = selectedSection[idx];
        const sectionData = sectionPresumptiveData[section] || { nature: '', presumptiveRate: '', presumptiveIncome: '' };
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
                <TextField size="small" fullWidth placeholder="Enter name" />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Business Type</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={businessTypes}
                  renderInput={(params) => <TextField {...params} placeholder="Select type" />}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography>Opting for presumptive?</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                <RadioGroup
                  row
                  value={presumptive[idx]}
                  onChange={(_, v) => {
                    const arr = [...presumptive];
                    arr[idx] = v;
                    setPresumptive(arr);
                  }}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid2>
            </Grid2>
            {/* If Presumptive = Yes, show left-side fields (4-12) */}
            {presumptive[idx] === 'yes' && (
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
                      value={section}
                      onChange={(_, v) => {
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
                    <TextField size="small" fullWidth value={sectionData.nature} placeholder="Nature" InputProps={{ readOnly: true }} />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Presumptive Rate</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={sectionData.presumptiveRate}
                      placeholder="Presumptive Rate"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Presumptive Income</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={sectionData.presumptiveIncome}
                      placeholder="Presumptive Income"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Grossturnover/receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField size="small" fullWidth placeholder="Gross turnover/receipts" />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography>Digital % Receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField size="small" fullWidth placeholder="Digital % Receipts" />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload Bank Statements</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input type="file" hidden multiple />
                      </Button>
                      <Typography variant="body2">0 uploads</Typography>
                      <Button size="small" variant="outlined">
                        +Upload
                      </Button>
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload 26AS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload AIS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>GST Registered?</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <RadioGroup
                      row
                      value={gstRegistered[idx]}
                      onChange={(_, v) => {
                        const arr = [...gstRegistered];
                        arr[idx] = v;
                        setGstRegistered(arr);
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                  </Grid2>
                  {/* If GST Registered = Yes */}
                  {gstRegistered[idx] === 'yes' && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography>GST Returns</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input type="file" hidden />
                        </Button>
                      </Grid2>
                    </>
                  )}
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Any other relevant docs</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                  </Grid2>
                </Grid2>
              </Box>
            )}
            {/* If Presumptive = No, show right-side fields */}
            {presumptive[idx] === 'no' && (
              <Box mb={2}>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Gross Turnover</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField size="small" fullWidth placeholder="Gross Turnover" />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Digital % Receipts</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField size="small" fullWidth placeholder="Digital % Receipts" />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Net Profit</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField size="small" fullWidth placeholder="Net Profit" />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload Bank Statement</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" component="label">
                        Upload
                        <input type="file" hidden multiple />
                      </Button>
                      <Typography variant="body2">0 uploads</Typography>
                      <Button size="small" variant="outlined">
                        +Upload
                      </Button>
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Book Maintained?</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <RadioGroup
                      row
                      value={bookMaintained[idx]}
                      onChange={(_, v) => {
                        const arr = [...bookMaintained];
                        arr[idx] = v;
                        setBookMaintained(arr);
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                  </Grid2>
                  {/* If Book Maintained = Yes */}
                  {bookMaintained[idx] === 'yes' && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography>Upload P&L</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input type="file" hidden />
                        </Button>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography>Upload C/S</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input type="file" hidden />
                        </Button>
                      </Grid2>
                    </>
                  )}
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>GST Registered?</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <RadioGroup
                      row
                      value={gstRegistered[idx]}
                      onChange={(_, v) => {
                        const arr = [...gstRegistered];
                        arr[idx] = v;
                        setGstRegistered(arr);
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                  </Grid2>
                  {/* If GST Registered = Yes */}
                  {gstRegistered[idx] === 'yes' && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography>GST Returns</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button size="small" variant="contained" component="label">
                          Upload
                          <input type="file" hidden />
                        </Button>
                      </Grid2>
                    </>
                  )}
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload 26AS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Upload AIS</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography>Any other relevant docs</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button size="small" variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                  </Grid2>
                </Grid2>
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

const interestTypes = ['Savings', 'FD', 'RD', 'NRO', 'NRE', 'Others'];

const relationOptions = ['Relative', 'Non-relative'];

const pensionSources = ['Government', 'Private'];
const foreignIncomeTypes = ['Dividend', 'Interest', 'Others'];
const countryOptions = ['India', 'USA', 'UK', 'Other'];
const currencyOptions = ['INR', 'USD', 'GBP', 'EUR', 'Other'];
const winningsSources = ['Lottery', 'Game Show', 'Gambling', 'Others'];

const OtherIncome = () => {
  const [interestApplicable, setInterestApplicable] = React.useState('yes');
  const [interestRows, setInterestRows] = React.useState([{ type: '', earned: '', bank: '' }]);
  const [dividendApplicable, setDividendApplicable] = React.useState('yes');
  const [dividendRows, setDividendRows] = React.useState([{ from: '', received: '' }]);
  const [giftApplicable, setGiftApplicable] = React.useState('yes');
  const [giftRows, setGiftRows] = React.useState([{ amount: '', from: '', relation: '', date: '', marriage: 'no' }]);
  const [familyApplicable, setFamilyApplicable] = React.useState('yes');
  const [familyRows, setFamilyRows] = React.useState([{ amount: '', source: '' }]);
  const [foreignApplicable, setForeignApplicable] = React.useState('yes');
  const [foreignRows, setForeignRows] = React.useState([{ type: '', country: '', currency: '', amount: '', taxPaid: 'no' }]);
  const [winningsApplicable, setWinningsApplicable] = React.useState('yes');
  const [winningsRows, setWinningsRows] = React.useState([{ source: '', amount: '' }]);

  return (
    <Box>
      {/* Interest Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={interestApplicable === 'yes' ? 0 : 2}>
        <Typography>Interest Income: </Typography>
        <RadioGroup row value={interestApplicable} onChange={(_, v) => setInterestApplicable(v)}>
          <FormControlLabel value="yes" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="no" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {interestApplicable === 'yes' && (
        <>
          {interestRows.map((row, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={interestTypes}
                    renderInput={(params) => <TextField {...params} label="Interest Type" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Interest Earned" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Bank Name" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
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
                {interestRows.length > 1 && (
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="error" onClick={() => setInterestRows(interestRows.filter((_, i) => i !== idx))}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid2>
                )}
              </Grid2>
            </Paper>
          ))}
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={() => setInterestRows([...interestRows, { type: '', earned: '', bank: '' }])}>
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Dividend Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={dividendApplicable === 'yes' ? 0 : 2}>
        <Typography>Dividend Income: </Typography>
        <RadioGroup row value={dividendApplicable} onChange={(_, v) => setDividendApplicable(v)}>
          <FormControlLabel value="yes" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="no" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {dividendApplicable === 'yes' && (
        <>
          {dividendRows.map((row, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Received From" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Dividend Received" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
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
                {dividendRows.length > 1 && (
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="error" onClick={() => setDividendRows(dividendRows.filter((_, i) => i !== idx))}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid2>
                )}
              </Grid2>
            </Paper>
          ))}
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={() => setDividendRows([...dividendRows, { from: '', received: '' }])}>
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Gift Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={giftApplicable === 'yes' ? 0 : 2}>
        <Typography>Gift Income: </Typography>
        <RadioGroup row value={giftApplicable} onChange={(_, v) => setGiftApplicable(v)}>
          <FormControlLabel value="yes" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="no" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {giftApplicable === 'yes' && (
        <>
          {giftRows.map((row, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Received From" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={relationOptions}
                    renderInput={(params) => <TextField {...params} label="Relation" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField size="small" fullWidth label="Date Received" type="date" InputLabelProps={{ shrink: true }} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                  <Typography>was it on Marriage?</Typography>
                  <RadioGroup row value={row.marriage}>
                    <FormControlLabel value="yes" control={<Radio size="small" checked={row.marriage === 'yes'} />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio size="small" checked={row.marriage === 'no'} />} label="No" />
                  </RadioGroup>
                </Grid2>
                {giftRows.length > 1 && (
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="error" onClick={() => setGiftRows(giftRows.filter((_, i) => i !== idx))}>
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
              onClick={() => setGiftRows([...giftRows, { amount: '', from: '', relation: '', date: '', marriage: 'no' }])}
            >
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Family Pension Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={familyApplicable === 'yes' ? 0 : 2}>
        <Typography>Family Pension Income: </Typography>
        <RadioGroup row value={familyApplicable} onChange={(_, v) => setFamilyApplicable(v)}>
          <FormControlLabel value="yes" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="no" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {familyApplicable === 'yes' && (
        <>
          {familyRows.map((row, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Amount Received" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={pensionSources}
                    renderInput={(params) => <TextField {...params} label="Source" />}
                  />
                </Grid2>
                {familyRows.length > 1 && (
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="error" onClick={() => setFamilyRows(familyRows.filter((_, i) => i !== idx))}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid2>
                )}
              </Grid2>
            </Paper>
          ))}
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={() => setFamilyRows([...familyRows, { amount: '', source: '' }])}>
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Foreign Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={foreignApplicable === 'yes' ? 0 : 2}>
        <Typography>Foreign Income: </Typography>
        <RadioGroup row value={foreignApplicable} onChange={(_, v) => setForeignApplicable(v)}>
          <FormControlLabel value="yes" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="no" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {foreignApplicable === 'yes' && (
        <>
          {foreignRows.map((row, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={foreignIncomeTypes}
                    renderInput={(params) => <TextField {...params} label="Type of Income" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={countryOptions}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={currencyOptions}
                    renderInput={(params) => <TextField {...params} label="Currency" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Tax Paid Abroad?</Typography>
                    <RadioGroup row value={row.taxPaid}>
                      <FormControlLabel value="yes" control={<Radio size="small" checked={row.taxPaid === 'yes'} />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio size="small" checked={row.taxPaid === 'no'} />} label="No" />
                    </RadioGroup>
                  </Stack>
                </Grid2>
                {row.taxPaid === 'yes' && (
                  <Grid2 size={{ xs: 12, sm: 8 }}>
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
                )}
                {foreignRows.length > 1 && (
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="error" onClick={() => setForeignRows(foreignRows.filter((_, i) => i !== idx))}>
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
              onClick={() => setForeignRows([...foreignRows, { type: '', country: '', currency: '', amount: '', taxPaid: 'no' }])}
            >
              Add Row
            </Button>
          </Box>
        </>
      )}
      {/* Winnings/Lottery Income Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={winningsApplicable === 'yes' ? 0 : 2}>
        <Typography>Winnings/Lottery Income: </Typography>
        <RadioGroup row value={winningsApplicable} onChange={(_, v) => setWinningsApplicable(v)}>
          <FormControlLabel value="yes" control={<Radio size="small" />} label="Applicable" />
          <FormControlLabel value="no" control={<Radio size="small" />} label="Not Applicable" />
        </RadioGroup>
      </Stack>
      {winningsApplicable === 'yes' && (
        <>
          {winningsRows.map((row, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={winningsSources}
                    renderInput={(params) => <TextField {...params} label="Source of Income" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField size="small" fullWidth label="Amount" />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
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
                {winningsRows.length > 1 && (
                  <Grid2 size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="error" onClick={() => setWinningsRows(winningsRows.filter((_, i) => i !== idx))}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid2>
                )}
              </Grid2>
            </Paper>
          ))}
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

const AgricultureIncome = () => {
  const [hasAgriIncome, setHasAgriIncome] = React.useState('no');
  return (
    <Box>
      <Typography variant="h6" mb={2} sx={{ textDecoration: 'underline' }}>
        Agricultural Income
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography>Do you have agricultural income during F.Y.?</Typography>
        <RadioGroup row value={hasAgriIncome} onChange={(_, v) => setHasAgriIncome(v)}>
          <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
          <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
        </RadioGroup>
      </Stack>
      {hasAgriIncome === 'yes' && (
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

const IncomeDetails = ({ type }) => {
  switch (type) {
    case 'salary':
      return <SalaryIncome />;
    case 'house':
      return <HousePropertyIncome />;
    case 'capital':
      return <CapitalGainsIncome />;
    case 'business':
      return <BusinessIncome />;
    case 'other':
      return <OtherIncome />;
    case 'agriculture':
      return <AgricultureIncome />;
  }
};

export default IncomeDetails;
