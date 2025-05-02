// File: InvoiceDetailsForm.jsx

import React from 'react';
import { Typography, Grid2 } from '@mui/material';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import CustomInput from 'utils/CustomInput';
import CustomDatePicker from 'utils/CustomDateInput';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import dayjs from 'dayjs';

const InvoiceDetailsForm = ({ formik, invoiceData, businessDetailsData, customers }) => {
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

  const fields = invoiceData || [
    { name: 'customer', label: 'Customer Name' },
    { name: 'place_of_supply', label: 'Place of Supply' },
    { name: 'invoice_number', label: 'Invoice Number' },
    { name: 'invoice_date', label: 'Invoice Date' },
    { name: 'terms', label: 'Terms' },
    { name: 'due_date', label: 'Due Date' },
    { name: 'order_number', label: 'Order Number' },
    { name: 'sales_person', label: 'Sales Person' }
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
    } else if (['place_of_supply', 'state'].includes(fieldName)) {
      return (
        <CustomAutocomplete
          name={fieldName}
          value={value || ''}
          onChange={(_, val) => formik.setFieldValue(fieldName, val)}
          options={indian_States_And_UTs}
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
          disabled={fieldName === 'invoice_number'}
        />
      );
    }
  };

  return (
    <Grid2 container spacing={2}>
      {fields.map((item) => (
        <Grid2 size={{ xs: 12, sm: 6 }} key={item.name}>
          <Typography sx={{ mb: 1 }}>{item.label}</Typography>
          {renderField(item)}
        </Grid2>
      ))}
    </Grid2>
  );
};

export default InvoiceDetailsForm;
