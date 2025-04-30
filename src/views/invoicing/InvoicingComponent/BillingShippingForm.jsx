// File: BillingShippingForm.jsx

import React from 'react';
import { Box, Grid, Typography, FormControlLabel, Checkbox } from '@mui/material';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';

const BillingShippingForm = ({ formik }) => {
  const { values, setFieldValue, touched, errors } = formik;

  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    setFieldValue('same_address', checked);
    if (checked) {
      setFieldValue('not_applicablefor_shipping', false);
      setFieldValue('shipping_address', { ...values.billing_address });
    } else {
      setFieldValue('shipping_address', {
        address_line1: '',
        address_line2: '',
        country: 'IN',
        state: '',
        postal_code: ''
      });
    }
  };

  const handleNotApplicableShipping = (e) => {
    const checked = e.target.checked;
    setFieldValue('not_applicablefor_shipping', checked);
    setFieldValue('same_address', false);
    setFieldValue(
      'shipping_address',
      checked
        ? {
            address_line1: 'NA',
            address_line2: 'NA',
            country: 'NA',
            state: 'NA',
            postal_code: 'NA'
          }
        : {
            address_line1: '',
            address_line2: '',
            country: 'IN',
            state: '',
            postal_code: ''
          }
    );
  };

  const renderField = (item, section) => {
    const fieldName = `${section}.${item.name}`;
    const value = values[section][item.name];

    if (item.name === 'state') {
      return (
        <CustomAutocomplete
          options={indian_States_And_UTs}
          value={value || ''}
          onChange={(_, val) => setFieldValue(fieldName, val)}
          name={fieldName}
          disabled={values.same_address || values.not_applicablefor_shipping}
          error={touched[section]?.[item.name] && Boolean(errors[section]?.[item.name])}
          helperText={touched[section]?.[item.name] && errors[section]?.[item.name]}
        />
      );
    }

    return (
      <CustomInput
        name={fieldName}
        value={value || ''}
        onChange={(e) => setFieldValue(fieldName, e.target.value)}
        disabled={item.name === 'country' || values.same_address || values.not_applicablefor_shipping}
        error={touched[section]?.[item.name] && Boolean(errors[section]?.[item.name])}
        helperText={touched[section]?.[item.name] && errors[section]?.[item.name]}
      />
    );
  };

  const addressFields = [
    { name: 'address_line1', label: 'Address Line 1' },
    { name: 'address_line2', label: 'Address Line 2' },
    { name: 'country', label: 'Country' },
    { name: 'state', label: 'State' },
    { name: 'postal_code', label: 'Pincode' }
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6">Billing & Shipping Information</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={values.same_address} onChange={handleSameAddress} />}
          label="Same as Billing Address"
        />
        <FormControlLabel
          control={<Checkbox checked={values.not_applicablefor_shipping} onChange={handleNotApplicableShipping} />}
          label="Not applicable for Shipping"
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Billing Address
          </Typography>
          {addressFields.map((item) => (
            <Box key={item.name} sx={{ mb: 2 }}>
              <Typography variant="caption">{item.label}</Typography>
              {renderField(item, 'billing_address')}
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Shipping Address
          </Typography>
          {addressFields.map((item) => (
            <Box key={item.name} sx={{ mb: 2 }}>
              <Typography variant="caption">{item.label}</Typography>
              {renderField(item, 'shipping_address')}
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillingShippingForm;
