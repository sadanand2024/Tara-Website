import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { entityTypes, businessNatureChoices, states } from '../../utils/constants';
import Modal from 'ui-component/extended/Modal';
import { FormControl, FormLabel, Autocomplete, Button, TextField, Grid2, Stack, Box, Typography, CircularProgress } from '@mui/material';

const personalFields = [
  {
    name: 'nameOfBusiness',
    label: 'Business Name',
    type: 'text',
    required: true
  },
  {
    name: 'registrationNumber',
    label: 'Registration Number',
    type: 'text',
    required: false
  },
  {
    name: 'entityType',
    label: 'Entity Type',
    type: 'select',
    options: entityTypes,
    required: true
  },
  {
    name: 'pan',
    label: 'PAN',
    type: 'text',
    required: true
  },
  {
    name: 'business_nature',
    label: 'Nature of Business',
    type: 'select',
    options: businessNatureChoices,
    required: false
  },
  {
    name: 'trade_name',
    label: 'Trade Name',
    type: 'text',
    required: false
  },
  {
    name: 'mobile_number',
    label: 'Mobile Number',
    type: 'text',
    required: false
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: false
  },
  {
    name: 'dob_or_incorp_date',
    label: 'Date of Incorporation',
    type: 'date',
    required: false
  }
];

const headOfficeFields = [
  {
    name: 'address_line1',
    label: 'Address Line 1',
    type: 'text',
    required: true
  },
  {
    name: 'address_line2',
    label: 'Address Line 2',
    type: 'text',
    required: false
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    required: true
  },
  {
    name: 'state',
    label: 'State',
    type: 'select',
    options: states,
    required: true
  },
  {
    name: 'country',
    label: 'Country',
    type: 'text',
    required: true
  },
  {
    name: 'pincode',
    label: 'PIN Code',
    type: 'text',
    required: true
  }
];

const BusinessKYCDialog = ({ open, onClose, onSubmit, isSubmitting }) => {
  const validationSchema = Yup.object({
    nameOfBusiness: Yup.string().required('Business name is required').min(3, 'Business name should be at least 3 characters'),
    registrationNumber: Yup.string().min(6, 'Registration number should be at least 6 characters'),
    entityType: Yup.string().required('Entity type is required'),
    pan: Yup.string()
      .required('PAN is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
    business_nature: Yup.string().required('Business nature is required'),
    trade_name: Yup.string().required('Trade name is required'),
    mobile_number: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Invalid mobile number'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    dob_or_incorp_date: Yup.date().required('Date of incorporation is required').max(new Date(), 'Date cannot be in the future'),
    address_line1: Yup.string().required('Address is required').min(5, 'Address should be at least 5 characters'),
    address_line2: Yup.string(),
    city: Yup.string()
      .required('City is required')
      .matches(/^[a-zA-Z\s]+$/, 'City should only contain letters'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    pincode: Yup.string()
      .required('PIN code is required')
      .matches(/^[0-9]{6}$/, 'PIN code should be 6 digits')
  });
  const renderFields = (fields) => {
    return fields.map((field) =>
      field.name === 'state' || field.name === 'entityType' || field.name === 'business_nature' ? (
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
          <FormControl fullWidth>
            <FormLabel>{field.label}</FormLabel>
            <Autocomplete
              value={
                field.name === 'entityType' ? entityTypes.find((option) => option.value === values[field.name]) || null : values[field.name]
              }
              onChange={(e, value) => {
                if (field.name === 'entityType') {
                  setFieldValue(field.name, value ? value.value : '');
                } else {
                  setFieldValue(field.name, value);
                }
              }}
              onBlur={() => handleBlur({ target: { name: field.name } })}
              options={field.options}
              getOptionLabel={(option) => {
                if (field.name === 'entityType') {
                  return option ? option.label : '';
                }
                return option || '';
              }}
              isOptionEqualToValue={(option, value) => {
                if (field.name === 'entityType') {
                  return option.value === (value ? value.value : '');
                }
                return option === value;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  error={touched[field.name] && Boolean(errors[field.name])}
                  helperText={touched[field.name] && errors[field.name]}
                />
              )}
            />
          </FormControl>
        </Grid2>
      ) : field.name === 'dob_or_incorp_date' ? (
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
          <FormControl fullWidth>
            <FormLabel>{field.label}</FormLabel>
            <TextField
              fullWidth
              type="date"
              name={field.name}
              size="small"
              value={values[field.name] || ''}
              onChange={(e) => setFieldValue(field.name, e.target.value)}
              onBlur={(e) => handleBlur({ target: { name: field.name } })}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
        </Grid2>
      ) : (
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
          <FormControl fullWidth>
            <FormLabel>{field.label}</FormLabel>
            <TextField
              fullWidth
              name={field.name}
              value={values[field.name]}
              onChange={(e) => {
                let value = e.target.value;

                if (field.name === 'pan') {
                  // Only allow letters and numbers, max 10 characters
                  value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                  if (value.length > 10) {
                    return;
                  }
                } else if (field.name === 'mobile_number') {
                  // Only allow numbers, max 10 characters
                  value = value.replace(/[^0-9]/g, '');
                  if (value.length > 10) {
                    return;
                  }
                } else if (field.name === 'pincode') {
                  // Only allow numbers, max 6 characters
                  value = value.replace(/[^0-9]/g, '');
                  if (value.length > 6) {
                    return;
                  }
                } else if (field.name === 'city' || field.name === 'country') {
                  // Only allow letters and spaces
                  value = value.replace(/[^a-zA-Z\s]/g, '');
                }

                setFieldValue(field.name, value);
              }}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              size="small"
              disabled={field.name === 'country'}
            />
          </FormControl>
        </Grid2>
      )
    );
  };

  const formik = useFormik({
    initialValues: {
      nameOfBusiness: '',
      registrationNumber: '',
      entityType: '',
      pan: '',
      business_nature: '',
      trade_name: '',
      mobile_number: '',
      email: '',
      dob_or_incorp_date: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    validationSchema,
    onSubmit: (values) => {
      const submissionData = {
        ...values,
        dob_or_incorp_date: values.dob_or_incorp_date ? dayjs(values.dob_or_incorp_date).format('YYYY-MM-DD') : null,
        headOffice: {
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode
        }
      };
      onSubmit(submissionData);
    }
  });

  const { values, errors, touched, handleSubmit, handleBlur, setFieldValue } = formik;

  return (
    <Modal
      open={open}
      maxWidth="md"
      showClose={false}
      title="Business KYC Details"
      handleClose={
        // onClose
        () => {}
      }
      footer={
        <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 2 }}>
          {/* <Button onClick={onClose} variant="outlined" color="error" disabled={isSubmitting}>
            Cancel
          </Button> */}
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Business Information
        </Typography>

        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          {renderFields(personalFields)}
        </Grid2>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Head Office Address
        </Typography>

        <Grid2 container spacing={3} sx={{ mb: 2 }}>
          {renderFields(headOfficeFields)}
        </Grid2>
      </Box>
    </Modal>
  );
};

export default BusinessKYCDialog;
