import React, { useEffect } from 'react';
import { Box, Grid2, Typography, FormControlLabel, Checkbox, Paper, Divider, Chip, useTheme, alpha } from '@mui/material';
import { LocationOn, LocalShipping, Receipt, CheckCircle, Cancel } from '@mui/icons-material';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';

const BillingShippingForm = ({ formik, onStateChange }) => {
  const { values, setFieldValue, touched, errors } = formik;
  const theme = useTheme();

  const handleStateChange = (section, newState) => {
    setFieldValue(`${section}.state`, newState);
    if (onStateChange) {
      onStateChange(section, newState);
    }
  };

  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    setFieldValue('same_address', checked);
    if (checked) {
      setFieldValue('not_applicablefor_shipping', false);
      setFieldValue('shipping_address', { ...values.billing_address });
      // Notify about shipping state change if it's now same as billing
      if (onStateChange) {
        onStateChange('shipping_address', values.billing_address.state);
      }
    } else {
      setFieldValue('shipping_address', {
        address_line1: '',
        address_line2: '',
        country: 'India',
        state: '',
        postal_code: ''
      });
      if (onStateChange) {
        onStateChange('shipping_address', '');
      }
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
            country: 'India',
            state: '',
            postal_code: ''
          }
    );
    if (onStateChange) {
      onStateChange('shipping_address', checked ? 'NA' : '');
    }
  };

  const renderField = (item, section) => {
    const fieldName = `${section}.${item.name}`;
    const value = values[section][item.name];

    if (item.name === 'state') {
      return (
        <CustomAutocomplete
          options={indian_States_And_UTs}
          value={value || ''}
          onChange={(_, val) => handleStateChange(section, val)}
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
    <Box sx={{ mb: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          p: 1.5,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Receipt sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          Billing & Shipping Information
        </Typography>
      </Box>

      {/* Options Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderRadius: 2
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
          Address Options
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={values.same_address}
                onChange={handleSameAddress}
                sx={{
                  '&.Mui-checked': {
                    color: theme.palette.success.main
                  }
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ fontSize: 20, color: values.same_address ? theme.palette.success.main : 'inherit' }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Same as Billing Address
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.not_applicablefor_shipping}
                onChange={handleNotApplicableShipping}
                sx={{
                  '&.Mui-checked': {
                    color: theme.palette.warning.main
                  }
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Cancel sx={{ fontSize: 20, color: values.not_applicablefor_shipping ? theme.palette.warning.main : 'inherit' }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Not applicable for Shipping
                </Typography>
              </Box>
            }
          />
        </Box>
      </Paper>

      {/* Address Forms Section */}
      <Grid2 container spacing={10}>
        {/* Billing Address */}
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: 'fit-content',
              borderRadius: 2,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
                pb: 1.5,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <LocationOn
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 24
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main
                }}
              >
                Billing Address
              </Typography>
              <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ ml: 'auto', fontSize: '0.75rem' }} />
            </Box>

            <Grid2 container spacing={2}>
              {addressFields.map((item) => (
                <Grid2 size={{ xs: 12, sm: 6 }} key={`billing-${item.name}`}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                      fontSize: '0.875rem'
                    }}
                  >
                    {item.label}
                  </Typography>
                  {renderField(item, 'billing_address')}
                </Grid2>
              ))}
            </Grid2>
          </Paper>
        </Grid2>

        {/* Shipping Address */}
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: 'fit-content',
              borderRadius: 2,
              border: `2px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
              backgroundColor: alpha(theme.palette.secondary.main, 0.02),
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: alpha(theme.palette.secondary.main, 0.3),
                boxShadow: theme.shadows[8]
              },
              opacity: values.not_applicablefor_shipping ? 0.6 : 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
                pb: 1.5,
                borderBottom: `2px solid ${alpha(theme.palette.secondary.main, 0.1)}`
              }}
            >
              <LocalShipping
                sx={{
                  color: theme.palette.secondary.main,
                  fontSize: 24
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.secondary.main
                }}
              >
                Shipping Address
              </Typography>
              {values.not_applicablefor_shipping ? (
                <Chip label="Not Applicable" size="small" color="warning" variant="filled" sx={{ ml: 'auto', fontSize: '0.75rem' }} />
              ) : values.same_address ? (
                <Chip label="Same as Billing" size="small" color="success" variant="filled" sx={{ ml: 'auto', fontSize: '0.75rem' }} />
              ) : (
                <Chip label="Optional" size="small" color="default" variant="outlined" sx={{ ml: 'auto', fontSize: '0.75rem' }} />
              )}
            </Box>

            <Grid2 container spacing={2}>
              {addressFields.map((item) => (
                <Grid2 size={{ xs: 12, sm: 6 }} key={`shipping-${item.name}`}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                      fontSize: '0.875rem'
                    }}
                  >
                    {item.label}
                  </Typography>
                  {renderField(item, 'shipping_address')}
                </Grid2>
              ))}
            </Grid2>
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default BillingShippingForm;
