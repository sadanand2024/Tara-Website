import { Autocomplete, Box, Button, Stack, TextField } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Modal from 'ui-component/extended/Modal';
import CustomDatePicker from 'utils/CustomDateInput';
import CustomInput from 'utils/CustomInput';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
import { __IndianStates } from '../../../utils/indianStates';
import natureOfBusinessOptions from 'utils/natureOfBusinessOptions';

const validationSchema = Yup.object({
  business_name: Yup.string().required('Business name is required'),
  // registration_number: Yup.string().required('Registration number is required'),
  entity_type: Yup.string().required('Entity type is required'),
  address_line1: Yup.string().required('Address Line 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits')
    .required('Pincode is required'),
  pan: Yup.string()
    .required('PAN Number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN Number format'),
  trade_name: Yup.string().required('Trade Name is required'),
  mobile_number: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be exactly 10 digits')
    .required('Mobile Number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required')
});

const entityTypes = ['Proprietorship', 'Partnership', 'Private Limited Company', 'Public Limited Company', 'Limited Liability Partnership'];

const AddBusiness = ({ open, onClose, userData, setUserData, getContext }) => {
  const dispatch = useDispatch();
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const Fields = [
    { name: 'business_name', label: 'Business Name', required: true },
    { name: 'registration_number', label: 'Registration Number', required: false },
    { name: 'entity_type', label: 'Entity Type', type: 'select', options: entityTypes, required: true },
    { name: 'pan', label: 'PAN', required: true },
    { name: 'business_nature', type: 'select', label: 'Business Nature', options: natureOfBusinessOptions, required: true },
    { name: 'trade_name', label: 'Trade Name', required: true },
    { name: 'mobile_number', label: 'Mobile Number', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'dob_or_incorp_date', label: 'Date of Incorporation' },
    { name: 'address_line1', label: 'Address Line 1', required: true },
    { name: 'address_line2', label: 'Address Line 2', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'state', label: 'State', type: 'select', options: __IndianStates, required: true },
    { name: 'country', label: 'Country', required: true },
    { name: 'pincode', label: 'Pincode', required: true }
  ];

  const formik = useFormik({
    initialValues: {
      user_id: userData.user.id,
      business_name: '',
      registration_number: '',
      dob_or_incorp_date: new Date().toISOString().slice(0, 10),
      entity_type: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      pan: '',
      business_nature: '',
      trade_name: '',
      mobile_number: '',
      email: ''
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      const payload = {
        user_id: values.user_id,
        business_name: values.business_name,
        registration_number: values.registration_number,
        dob_or_incorp_date: values.dob_or_incorp_date,
        entity_type: values.entity_type,
        head_office: {
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode
        },
        pan: values.pan,
        business_nature: values.business_nature,
        trade_name: values.trade_name,
        mobile_number: values.mobile_number,
        email: values.email
      };

      try {
        const response = await Factory('post', '/user_management/business/create/', payload, {});
        if (response.res.status_cd === 0) {
          resetForm();
          dispatch(
            openSnackbar({
              open: true,
              message: 'Business Added Successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false,
              severity: 'success'
            })
          );
          getContext();
          onClose();
        }
      } catch (error) {
        console.error('Error registering business:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const { values, handleChange, handleBlur, touched, errors, handleSubmit, setFieldValue } = formik;

  // Helper to get nested value
  const getValue = (name) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      return values[parent]?.[child] || '';
    }
    return values[name] || '';
  };

  // Helper to get nested error/touched
  const getError = (name) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      return (touched[parent]?.[child] || submitAttempted) && errors[parent]?.[child];
    }
    return (touched[name] || submitAttempted) && errors[name];
  };

  // Helper to render label with red asterisk if required
  const renderLabel = (label, required) => {
    // Check for special cases (like 'Address Line 2' and 'registration_number')
    const isSpecialCase = label === 'Address Line 2' || label === 'registration_number';

    return (
      <span>
        {label}
        {required && !isSpecialCase && <span style={{ color: 'red' }}> *</span>}
      </span>
    );
  };

  // Render fields dynamically
  const renderFields = () => (
    <Grid2 container spacing={2}>
      {Fields.map((field) => (
        <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
          {field.type === 'select' ? (
            <Autocomplete
              options={field.options}
              size="small"
              value={getValue(field.name) || ''}
              onChange={(e, newValue) => setFieldValue(field.name, newValue)}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              isOptionEqualToValue={(option, value) =>
                typeof option === 'string' ? option === value : option.value === (value?.value ?? value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={renderLabel(field.label, field.required)}
                  error={Boolean(getError(field.name))}
                  fullWidth
                  size="small"
                />
              )}
            />
          ) : field.name === 'dob_or_incorp_date' ? (
            <TextField
              fullWidth
              size="small"
              name={field.name}
              type="date"
              value={getValue(field.name) || ''}
              onChange={(e) => setFieldValue(field.name, e.target.value)}
              required={field.required}
              label={renderLabel(field.label, field.required)}
            />
          ) : (
            <TextField
              name={field.name}
              size="small"
              value={getValue(field.name) || ''}
              onChange={(e) => {
                let input = e.target.value;

                if (field.name === 'mobile_number' || field.name === 'pincode') {
                  if (/[^0-9]/.test(input)) return;
                }

                if (field.name === 'pan') {
                  input = input.toUpperCase();
                  if (!/^[A-Z0-9]*$/.test(input)) return;
                  if (input.length > 10) return;
                }

                setFieldValue(field.name, input);
              }}
              onBlur={handleBlur}
              label={renderLabel(field.label, field.required)}
              error={Boolean(getError(field.name))}
              fullWidth
            />
          )}
        </Grid2>
      ))}
    </Grid2>
  );

  return (
    <Modal
      open={open}
      title={'Add Business'}
      maxWidth="sm"
      showClose={true}
      handleClose={handleClose}
      header={{ title: 'Add Business', subheader: '' }}
      footer={
        <Stack direction="row" justifyContent="space-between" sx={{ width: 1, gap: 2 }}>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              setSubmitAttempted(true);
              // Validate the form and get all errors
              const validationErrors = await formik.validateForm();
              const missingFields = Object.entries(validationErrors).map(([fieldName, error]) => {
                // Find the matching label from Fields array
                const field = Fields.find((f) => f.name === fieldName || fieldName.startsWith(`${f.name}.`));
                return field ? field.label : fieldName;
              });
              if (missingFields.length > 0) {
                dispatch(
                  openSnackbar({
                    open: true,
                    message: `Please fill the Mandatory fields`,
                    variant: 'alert',
                    alert: { color: 'error' },
                    close: false
                  })
                );
                return;
              }
              // No errors, submit form (save data)
              handleSubmit();
            }}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        {renderFields()}
      </Box>
    </Modal>
  );
};

AddBusiness.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
  getContext: PropTypes.func.isRequired
};

export default AddBusiness;
