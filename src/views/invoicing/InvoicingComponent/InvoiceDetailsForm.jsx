// File: InvoiceDetailsForm.jsx

import React from 'react';
import { Typography, Grid2 } from '@mui/material';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import CustomInput from 'utils/CustomInput';
import CustomDatePicker from 'utils/CustomDateInput';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import dayjs from 'dayjs';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const InvoiceDetailsForm = ({
  formik,
  invoiceDetailsFields,
  businessDetailsData,
  customers,
  getInvoiceFormat,
  branches,
  setInvoiceNumberFormat
}) => {
  const termsDropdown = [
    'NET 15',
    'NET 30',
    'NET 45',
    'NET 60',
    'Due end of the MONTH',
    'Due end of next MONTH',
    'Due on Receipt',
    'Custom'
  ];

  const handleTermsChange = (newValue) => {
    let newDueDate = null;
    const invoiceDate = dayjs(formik.values.invoice_date);

    switch (newValue) {
      case 'NET 15':
        newDueDate = invoiceDate.add(15, 'days');
        break;
      case 'NET 30':
        newDueDate = invoiceDate.add(30, 'days');
        break;
      case 'NET 45':
        newDueDate = invoiceDate.add(45, 'days');
        break;
      case 'NET 60':
        newDueDate = invoiceDate.add(60, 'days');
        break;
      case 'Due end of the MONTH':
        newDueDate = invoiceDate.endOf('month');
        break;
      case 'Due end of next MONTH':
        newDueDate = invoiceDate.add(1, 'month').endOf('month');
        break;
      case 'Due on Receipt':
        newDueDate = invoiceDate;
        break;
      default:
        break;
    }

    formik.setFieldValue('due_date', newDueDate ? newDueDate.format('YYYY-MM-DD') : '');
    formik.setFieldValue('terms', newValue);
  };

  const handleCustomerChange = (newValue) => {
    const selectedCustomer = customers?.find((c) => c.name === newValue);
    if (!selectedCustomer) return;

    formik.setFieldValue('customer', newValue);
    formik.setFieldValue('place_of_supply', selectedCustomer.state);

    // Always update billing address
    formik.setFieldValue('billing_address.address_line1', selectedCustomer.address_line1);
    formik.setFieldValue('billing_address.address_line2', selectedCustomer.address_line2);
    formik.setFieldValue('billing_address.state', selectedCustomer.state);
    formik.setFieldValue('billing_address.country', selectedCustomer.country);
    formik.setFieldValue('billing_address.postal_code', selectedCustomer.postal_code);
    formik.setFieldValue('customer_gstin', selectedCustomer.gstin);
    formik.setFieldValue('customer_pan', selectedCustomer.pan_number);
    // Conditionally update shipping address if "same_address" is true
    if (formik.values.same_address) {
      formik.setFieldValue('shipping_address.address_line1', selectedCustomer.address_line1);
      formik.setFieldValue('shipping_address.address_line2', selectedCustomer.address_line2);
      formik.setFieldValue('shipping_address.state', selectedCustomer.state);
      formik.setFieldValue('shipping_address.country', selectedCustomer.country);
      formik.setFieldValue('shipping_address.postal_code', selectedCustomer.postal_code);
    }
  };

  const renderField = (item) => {
    const fieldName = item.name;
    const value = formik.values[fieldName];

    if (fieldName === 'invoice_date' || fieldName === 'due_date') {
      return (
        <CustomDatePicker
          name={fieldName}
          value={value ? dayjs(value) : null}
          onChange={(date) => {
            if (date) {
              const formatted = dayjs(date).format('YYYY-MM-DD');
              formik.setFieldValue(fieldName, formatted);
              if (fieldName === 'due_date' && formik.values.terms !== 'Custom') {
                formik.setFieldValue('terms', 'Custom');
              }
            } else {
              formik.setFieldValue(fieldName, null);
            }
          }}
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
        />
      );
    } else if (['place_of_supply', 'state', 'gstin', 'branch_code'].includes(fieldName)) {
      return (
        <CustomAutocomplete
          name={fieldName}
          value={value || ''}
          onChange={(_, val) => {
            if (fieldName === 'gstin') {
              formik.setFieldValue('gstin', val || 'NA');
              if (businessDetailsData?.invoice_format?.find((item) => item.gstin === val && item.include_branch_code === false)) {
                console.log('hjb');
                getInvoiceFormat(val, 'NA');
                formik.setFieldValue('branch_code', 'NA');
                formik.setFieldValue('invoice_number', '');
                setInvoiceNumberFormat('');
              } else {
                console.log('hjb2');
                formik.setFieldValue('branch_code', 'NA');
                formik.setFieldValue('invoice_number', '');
                setInvoiceNumberFormat('');
              }
            } else if (fieldName === 'branch_code') {
              formik.setFieldValue('branch_code', val || 'NA');
              if (
                businessDetailsData?.invoice_format?.find((item) => item.gstin === formik.values.gstin && item.include_branch_code === true)
              ) {
                getInvoiceFormat(formik.values.gstin, val);
              }
            }
            formik.setFieldValue(fieldName, val);
          }}
          disabled={
            (fieldName === 'branch_code' &&
              businessDetailsData?.invoice_format?.find(
                (item) => item.gstin === formik.values.gstin && item.include_branch_code === false
              )) ||
            (fieldName === 'branch_code' && formik.values.gstin === '')
          }
          options={
            fieldName === 'gstin'
              ? businessDetailsData?.gst_details?.length > 0
                ? businessDetailsData.gst_details.map((item) => item.gstin || 'NA')
                : ['NA']
              : fieldName === 'branch_code'
                ? branches?.map((item) => item.branch_code || 'NA')
                : indian_States_And_UTs
          }
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
        />
      );
    } else if (fieldName === 'terms') {
      return (
        <CustomAutocomplete
          name={fieldName}
          value={value || ''}
          onChange={(_, val) => handleTermsChange(val)}
          options={termsDropdown}
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
        />
      );
    } else if (fieldName === 'customer') {
      return (
        <CustomAutocomplete
          name={fieldName}
          value={value || ''}
          onChange={(_, val) => handleCustomerChange(val)}
          options={customers?.map((c) => c.name) || []}
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
        />
      );
    } else {
      return (
        <CustomInput
          name={fieldName}
          value={value || ''}
          onChange={(e) => formik.setFieldValue(fieldName, e.target.value)}
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
          disabled={fieldName === 'invoice_number' || fieldName === 'customer_gstin' || fieldName === 'customer_pan'}
        />
      );
    }
  };
  console.log(formik.errors);
  return (
    <Grid2 container spacing={2}>
      {invoiceDetailsFields.map((item) => (
        <Grid2 size={{ xs: 12, sm: 6 }} key={item.name}>
          <Typography sx={{ mb: 1 }}>{item.label}</Typography>
          {renderField(item)}
        </Grid2>
      ))}
    </Grid2>
  );
};

export default InvoiceDetailsForm;
