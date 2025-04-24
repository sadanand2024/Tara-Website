'use client';

import { useState, useEffect } from 'react';
import CustomInput from '@/utils/CustomInput';
import CustomAutocomplete from '@/utils/CustomAutocomplete';
import dayjs from 'dayjs';
import CustomDatePicker from '@/utils/CustomDateInput';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Factory from '@/utils/Factory';
import { indianCurrency } from '../../../../utils/CurrencyToggle';

import { useSearchParams } from 'next/navigation';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Grid2, Button, Stack, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/components/CustomSnackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeCard from '@/components/cards/HomeCard';
import MainCard from '@/components/MainCard';

/***************************  ACCOUNT  ***************************/

export default function RecordPayment() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  let customerFields = [
    { name: 'customer', label: 'Customer Name' },
    { name: 'invoice_number', label: 'Invoice Number' },
    { name: 'invoice_date', label: 'Invoice Date' },
    { name: 'amount_invoiced', label: 'Invoice Amount' },
    { name: 'amount_Received_till_date', label: 'Received till Date' },
    { name: 'amount_due', label: 'Amount Due' }
  ];

  let paymentFields = [
    { name: 'amount', label: 'Amount Received' },
    { name: 'date', label: 'Payment Date' },
    { name: 'method', label: 'Payment Mode' },
    { name: 'tax_deducted', label: 'Tax Deducted' },
    { name: 'amount_withheld', label: 'Amount Withheld' }
  ];

  const formik = useFormik({
    initialValues: {
      customer: '',
      invoice_number: '',
      invoice_date: '',
      amount_invoiced: '',
      amount_Received_till_date: '',
      amount_due: '',

      amount: '',
      date: dayjs().format('YYYY-MM-DD'),
      method: '',
      tax_deducted: 'tds_income_tax',
      amount_withheld: '',
      comments: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number().required('required').typeError('Amount must be an integer'),
      date: Yup.date().required('required'),
      method: Yup.string().required('required'),
      tax_deducted: Yup.string().required(' required'),
      amount_withheld: Yup.number().required('Amount withheld is required when tax is deducted')
    }),
    onSubmit: async (values) => {
      let postData = {
        reference_number: '',
        invoice: selectedInvoice.id,
        amount: values.amount,
        date: values.date,
        method:
          values.method === 'Cash' ? 'cash' : values.method === 'Card' ? 'card' : values.method === 'Bank Transfer' ? 'bank_transfer' : '',
        tax_deducted: values.tax_deducted,
        amount_withheld: values.amount_withheld,
        comments: values.comments
      };

      let url = '/invoicing/receipt';
      const { res, error } = await Factory('post', url, postData);
      if (res.status_cd === 0) {
        router.push(`/invoicing`);
        showSnackbar('Payment recorded Successfully', 'success');
        resetForm();
      } else {
        showSnackbar(JSON.stringify(res.data), 'error');
      }
    }
  });

  const get_Individual_Invoice_Data = async () => {
    const { res } = await Factory('get', `/invoicing/individual-invoice/${invoiceId}/`, {});
    if (res.status_cd === 0) {
      setSelectedInvoice(res.data);
    } else {
    }
  };

  useEffect(() => {
    if (invoiceId) {
      get_Individual_Invoice_Data();
    }
  }, [invoiceId]);
  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

  useEffect(() => {
    if (selectedInvoice) {
      setValues({
        ...values,
        customer: selectedInvoice.customer,
        invoice_number: selectedInvoice.invoice_number,
        invoice_date: selectedInvoice.invoice_date || '',
        amount_invoiced: selectedInvoice.amount_invoiced || '',
        amount_Received_till_date: selectedInvoice.total_amount - selectedInvoice.balance_due,
        amount_due: selectedInvoice.balance_due
      });
    }
  }, [selectedInvoice]);
  return (
    <HomeCard title="Record Payment" tagline="Record your payment details here.">
      <MainCard>
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Invoice Details</Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid2 container spacing={2}>
              {customerFields.map((item, index) => (
                <Grid2 size={{ xs: 12, sm: 4 }} key={item.name}>
                  <div style={{ paddingBottom: '5px' }}>
                    <Typography sx={{ color: 'grey.800' }}>{item.label}</Typography>
                  </div>
                  <CustomInput
                    name={item.name}
                    value={formik.values[item.name]}
                    disabled
                    onBlur={formik.handleBlur}
                    error={formik.touched[item.name] && formik.errors[item.name]}
                    helperText={formik.touched[item.name] && formik.errors[item.name]}
                  />
                </Grid2>
              ))}
            </Grid2>
            {values.amount_due !== 0 && (
              <>
                <Box sx={{ mb: 2, mt: 4 }}>
                  <Typography variant="h6">Latest Payment Record</Typography>
                </Box>
                <Grid2 container spacing={2}>
                  {paymentFields.map((item, index) => (
                    <Grid2 size={{ xs: 12, sm: 4 }} key={item.name}>
                      {item.name === 'tax_deducted' ? (
                        <FormControl fullWidth>
                          <Typography sx={{ color: 'grey.800' }}>{item.label}</Typography>
                          <RadioGroup
                            name={item.name}
                            value={values[item.name]}
                            onChange={(e) => {
                              const value = e.target.value;

                              // If 'no_tax' is selected, reset the amount_withheld to 0 and clear errors
                              if (value === 'no_tax') {
                                setFieldValue('tax_deducted', value);
                                setFieldValue('amount_withheld', 0); // Set amount_withheld to 0 when no tax is selected
                                formik.setFieldTouched('amount_withheld', false); // Clear any touched state
                                formik.setFieldError('amount_withheld', ''); // Clear error for amount_withheld
                              } else {
                                setFieldValue('tax_deducted', value); // Keep the selected value for tax_deducted
                              }
                            }}
                            row
                          >
                            <FormControlLabel value="no_tax" control={<Radio />} label="No Tax deducted" />
                            <FormControlLabel value="tds_income_tax" control={<Radio />} label="Yes, TDS/TCS" />
                          </RadioGroup>
                        </FormControl>
                      ) : item.name === 'method' ? (
                        <div style={{ paddingBottom: '5px' }}>
                          <Typography sx={{ color: 'grey.800' }}>{item.label}</Typography>

                          <CustomAutocomplete
                            value={values[item.name]}
                            name={item.name}
                            options={['Cash', 'Card', 'Bank Transfer']}
                            onChange={(e, newValue) => setFieldValue(item.name, newValue)}
                            error={touched[item.name] && Boolean(errors[item.name])}
                            helperText={touched[item.name] && errors[item.name]}
                          />
                        </div>
                      ) : item.name === 'date' ? (
                        <div style={{ paddingBottom: '5px' }}>
                          <Typography sx={{ color: 'grey.800' }}>{item.label}</Typography>

                          <CustomDatePicker
                            views={['year', 'month', 'day']}
                            value={values[item.name] ? dayjs(values[item.name]) : null} // Ensure it's a dayjs object or null
                            onChange={(newDate) => {
                              const formattedDate = dayjs(newDate).format('YYYY-MM-DD');
                              setFieldValue(item.name, formattedDate); // Set the formatted date in Formik
                            }}
                            sx={{
                              width: '100%',
                              '& .MuiInputBase-root': {
                                fontSize: '0.75rem',
                                height: '40px'
                              }
                            }}
                            error={touched[item.name] && Boolean(errors[item.name])}
                            helperText={touched[item.name] && errors[item.name]}
                          />
                        </div>
                      ) : (
                        <div style={{ paddingBottom: '5px' }}>
                          <Typography sx={{ color: 'grey.800' }}>{item.label}</Typography>
                          <CustomInput
                            name={item.name}
                            value={values[item.name]}
                            onChange={(e) => setFieldValue(item.name, e.target.value)}
                            onBlur={formik.handleBlur}
                            error={touched[item.name] && Boolean(errors[item.name])}
                            helperText={touched[item.name] && errors[item.name]}
                            disabled={values.tax_deducted === 'no_tax' && (item.name === 'amount_withheld' || item.name === 'tax_deducted')}
                          />
                        </div>
                      )}
                    </Grid2>
                  ))}
                </Grid2>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Comments
                  </Typography>
                  <CustomInput
                    multiline
                    minRows={4}
                    maxRows={6}
                    name="comments" // Assuming 'notes' is the key in your initialValues
                    value={values.notes}
                    onChange={(e) => formik.setFieldValue('comments', e.target.value)}
                    sx={{
                      width: '100%', // Restricting width to 100% of its parent container
                      maxWidth: '400px' // Limiting the max width if needed
                    }}
                  />
                </Box>
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3, gap: 5 }}>
              <Typography variant="h5" sx={{ fontWeight: 400 }}>
                Balance Due:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 400 }}>
                {indianCurrency}
                {values.amount_due}
              </Typography>{' '}
            </Box>
            {values.amount_due !== 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 3, gap: 5 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => {
                    router.back();
                  }}
                >
                  Back to Dashboard
                </Button>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </Box>
            )}
          </form>
        </Box>
      </MainCard>
    </HomeCard>
  );
}
