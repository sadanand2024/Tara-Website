import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, Stack, Typography, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { IconPlus } from '@tabler/icons-react';
import Modal from 'ui-component/extended/Modal';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import { CountriesList } from 'utils/CountriesList';

const gstTypes = [
  'Registered Business - Regular',
  'Registered Business - Composition',
  'Unregistered Business',
  'Consumer',
  'Overseas',
  'Special Economic Zones',
  'Deemed Export',
  'Tax Deductor',
  'SEZ Developer'
];

const AddCustomer = ({ type, setType, open, handleClose, selectedCustomer, businessDetailsData, getCustomersData }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      pan_number: '',
      gst_registered: 'No',
      gstin: 'NA',
      gst_type: '',
      address_line1: '',
      address_line2: '',
      country: 'India',
      state: '',
      postal_code: '',
      email: '',
      mobile_number: '',
      opening_balance: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Customer Name is required'),
      pan_number: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
        .required('PAN is required'),
      gst_registered: Yup.string().required('GST Registration status is required'),
      gstin: Yup.string().when('gst_registered', {
        is: 'Yes',
        then: () =>
          Yup.string()
            .required('GSTIN is required')
            .matches(/^[0-9A-Z]{15}$/, 'Invalid GSTIN, Format must be: 22AAAAA0000A1Z5'),
        otherwise: () => Yup.string().oneOf(['NA'], 'GSTIN must be "NA" when GST Registered is "No"')
      }),
      gst_type: Yup.string().required('GST Type is required'),
      address_line1: Yup.string().required('Address Line 1 is required'),
      postal_code: Yup.number()
        .typeError('Pincode must be a number')
        .required('Pincode is required')
        .min(100000, 'Minimum 6 digits')
        .max(999999, 'Maximum 6 digits'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      opening_balance: Yup.number().typeError('Opening Balance must be a number').required('Opening Balance is required')
    }),
    onSubmit: async (values) => {
      const postData = { ...values, invoicing_profile: businessDetailsData?.id };
      const url =
        type === 'edit' ? `/invoicing/invoicing/customer_profiles/update/${selectedCustomer?.id}/` : '/invoicing/customer_profiles/create/';
      const method = type === 'edit' ? 'put' : 'post';

      try {
        const { res } = await Factory(method, url, postData);
        if (res.status_cd === 0) {
          getCustomersData(businessDetailsData?.id);
          setType('');
          resetForm();
          handleClose();
          dispatch(
            openSnackbar({
              open: true,
              message: type === 'edit' ? 'Data Updated Successfully' : 'Data Added Successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
        }
      } catch (error) {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(error) || 'Something went wrong',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

  useEffect(() => {
    if (type === 'edit' && selectedCustomer) {
      setValues({
        name: selectedCustomer.name || '',
        pan_number: selectedCustomer.pan_number || '',
        gst_registered: selectedCustomer.gst_registered || 'No',
        gstin: selectedCustomer.gstin || '',
        gst_type: selectedCustomer.gst_type || '',
        address_line1: selectedCustomer.address_line1 || '',
        address_line2: selectedCustomer.address_line2 || '',
        country: selectedCustomer.country || '',
        state: selectedCustomer.state || '',
        postal_code: selectedCustomer.postal_code || '',
        email: selectedCustomer.email || '',
        mobile_number: selectedCustomer.mobile_number || '',
        opening_balance: selectedCustomer.opening_balance || ''
      });
    }
  }, [type, selectedCustomer]);

  const fields = [
    { name: 'name', label: 'Customer Name' },
    { name: 'pan_number', label: 'PAN' },
    { name: 'gst_registered', label: 'GST Registered' },
    { name: 'gstin', label: 'GSTIN' },
    { name: 'gst_type', label: 'GST Type' },
    { name: 'address_line1', label: 'Address Line 1' },
    { name: 'address_line2', label: 'Address Line 2' },
    { name: 'country', label: 'Country' },
    { name: 'state', label: 'State' },
    { name: 'postal_code', label: 'Pincode' },
    { name: 'email', label: 'Email' },
    { name: 'mobile_number', label: 'Mobile' },
    { name: 'opening_balance', label: 'Opening Balance' }
  ];

  return (
    <Modal
      open={open}
      showClose={true}
      handleClose={() => {
        setType('');
        resetForm(); // Optional
        handleClose(); // <- this closes the modal
      }}
      header={{ title: type === 'edit' ? 'Update Customer' : 'Add New Customer' }}
      footer={
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setType('');
              resetForm();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {type === 'edit' ? 'Update' : 'Save'}
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.name === 'gst_registered' ? (
                <FormControl fullWidth>
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup
                    row
                    name={field.name}
                    value={values[field.name]}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue(field.name, value);
                      if (value === 'No') {
                        setFieldValue('gstin', 'NA');
                        formik.setFieldTouched('gstin', false);
                        formik.setFieldError('gstin', '');
                      } else {
                        setFieldValue('gstin', '');
                      }
                    }}
                  >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              ) : field.name === 'gst_type' || field.name === 'state' || field.name === 'country' ? (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {field.label} <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <CustomAutocomplete
                    name={field.name}
                    value={values[field.name]}
                    onChange={(e, val) => setFieldValue(field.name, val)}
                    options={field.name === 'gst_type' ? gstTypes : field.name === 'state' ? indian_States_And_UTs : CountriesList}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                  />
                </>
              ) : (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {field.label} {['address_line2', 'mobile_number'].includes(field.name) ? '' : <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <CustomInput
                    name={field.name}
                    value={field.name === 'pan_number' ? values[field.name].toUpperCase() : values[field.name]}
                    onChange={(e) => {
                      const value = field.name === 'pan_number' ? e.target.value.toUpperCase() : e.target.value;
                      if (field.name === 'pan_number' && value.length > 10) return;
                      setFieldValue(field.name, value);
                    }}
                    onBlur={handleBlur}
                    placeholder={field.name === 'opening_balance' ? '₹' : ''}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                    disabled={field.name === 'gstin' && values.gst_registered === 'No'}
                  />
                </>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddCustomer;
