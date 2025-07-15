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

const validationSchema = Yup.object({
  business_name: Yup.string().required('Business name is required'),
  registration_number: Yup.string().required('Registration number is required'),
  entity_type: Yup.string().required('Entity type is required'),
  'head_office.address_line1': Yup.string().required('Address Line 1 is required'),
  'head_office.address_line2': Yup.string().required('Address Line 2 is required'),
  'head_office.city': Yup.string().required('City is required'),
  'head_office.state': Yup.string().required('State is required'),
  'head_office.country': Yup.string().required('Country is required'),
  'head_office.pincode': Yup.string().required('Pincode is required'),
  pan: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number').required('PAN is required'),
  business_nature: Yup.string().required('Business Nature is required'),
  trade_name: Yup.string().required('Trade Name is required'),
  mobile_number: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Mobile Number is required'),
  email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format').required('Email is required')
});

const entityTypes = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'privateLimitedCompany', label: 'Private Limited Company' },
  { value: 'publicLimitedCompany', label: 'Public Limited Company' },
  { value: 'llp', label: 'Limited Liability Partnership' }
];

const AddBusiness = ({ open, onClose, userData, setUserData, getContext }) => {
  const dispatch = useDispatch();
  const Fields = [
    { name: 'business_name', label: 'Business Name', required: true },
    { name: 'registration_number', label: 'Registration Number', required: true },
    { name: 'entity_type', label: 'Entity Type', type: 'select', options: entityTypes, required: true },
    { name: 'head_office.address_line1', label: 'Address Line 1', required: true },
    { name: 'head_office.address_line2', label: 'Address Line 2', required: true },
    { name: 'head_office.city', label: 'City', required: true },
    { name: 'head_office.state', label: 'State', type: 'select', options: __IndianStates, required: true },
    { name: 'head_office.country', label: 'Country', required: true },
    { name: 'head_office.pincode', label: 'Pincode', required: true },
    { name: 'pan', label: 'PAN', required: true },
    { name: 'business_nature', label: 'Business Nature', required: true },
    { name: 'trade_name', label: 'Trade Name', required: true },
    { name: 'mobile_number', label: 'Mobile Number', required: true },
    { name: 'email', label: 'Email', required: true }
  ];

  const formik = useFormik({
    initialValues: {
      user_id: userData.user.id,
      business_name: '',
      registration_number: '',
      entity_type: '',
      head_office: {
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: 'India',
        pincode: ''
      },
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
      // Validate all fields before submit
     
      try {
        const response = await Factory('post', '/user_management/business/create/', values, {});
        if (response.res.status_cd === 0) {
          resetForm();
          dispatch(
            openSnackbar({
              open: true,
              message: 'Business Added Successfully',
              variant: 'alert',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
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
  // Helper to set nested value
  const setNestedFieldValue = (name, value) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFieldValue(`${parent}.${child}`, value);
    } else {
      setFieldValue(name, value);
    }
  };
  // Helper to get nested error/touched
  const getError = (name) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      return touched[parent]?.[child] && errors[parent]?.[child];
    }
    return touched[name] && errors[name];
  };
  // Render fields dynamically (no error display)
  const renderFields = () => (
    <Grid2 container spacing={2}>
      {Fields.map((field) => (
        <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
          {field.type === 'select' ? (
            <Autocomplete
              name={field.name}
              size='small'
              value={getValue(field.name) || ''}
              onChange={(e, newValue) => setNestedFieldValue(field.name, newValue?.value || newValue)}
              options={field.options}
              getOptionLabel={(option) => option.label || option}
              isOptionEqualToValue={(option, value) => (option.value || option) === (value.value || value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={field.label} // 👈 Label added here
                  error={Boolean(getError(field.name))}
                  helperText={getError(field.name)}
                  required={field.required}
                />
              )}
            />

          ) : field.type === 'date' ? (
            <CustomDatePicker
              name={field.name}
              value={getValue(field.name) || ''}
              onChange={(date) => setNestedFieldValue(field.name, date)}
              label={field.label}
            />
          ) : (
            <CustomInput
              name={field.name}
              value={getValue(field.name) || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              required={field.required}
              label={field.label}
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
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              // Validate the form and get all errors
              const validationErrors = await formik.validateForm();
              const missingFields = Object.entries(validationErrors)
                .map(([fieldName, error]) => {
                  // Find the matching label from Fields array
                  const field = Fields.find((f) => f.name === fieldName || fieldName.startsWith(`${f.name}.`));
                  return field ? field.label : fieldName;
                });
              if (missingFields.length > 0) {
                const message = `Please fill the required fields`;
                dispatch(
                  openSnackbar({
                    open: true,
                    message,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    alert: { color: 'error' },
                    close: false,
                    severity: 'error'
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
      <Box component="form" onSubmit={
      handleSubmit
        } sx={{ p: 2 }}>
        {renderFields()}
      
      </Box>
     </Modal>
  );
};

AddBusiness.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddBusiness;
