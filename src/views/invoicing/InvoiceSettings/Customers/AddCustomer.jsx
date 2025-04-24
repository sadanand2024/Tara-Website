import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Stack } from '@mui/material';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { IconX } from '@tabler/icons-react';
import IconButton from '@mui/material/IconButton';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import Factory from 'utils/Factory';
// import { useSnackbar } from 'components/CustomSnackbar';
import Modal from 'ui-component/extended/Modal';
import { CountriesList } from 'utils/CountriesList';
let gstTypes = [
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
  const [addCustomerData] = useState([
    { name: 'name', label: 'Name of the Customer' },
    { name: 'pan_number', label: 'PAN' },
    { name: 'gst_registered', label: 'GST Registered' },
    { name: 'gstin', label: 'GSTIN' },
    { name: 'gst_type', label: 'Type of GST' },
    { name: 'address_line1', label: 'Address Lane 1' },
    { name: 'address_line2', label: 'Address Lane 2' },
    { name: 'country', label: 'Country' },
    { name: 'state', label: 'State' },
    { name: 'postal_code', label: 'Pincode' },
    { name: 'email', label: 'Email' },
    { name: 'mobile_number', label: 'Mobile' },
    { name: 'opening_balance', label: 'Opening Balance' }
    // { name: 'swift_code', label: 'SWIFT Code' }
  ]);
  // const { showSnackbar } = useSnackbar();

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
        otherwise: () => Yup.string().oneOf(['NA'], 'GSTIN must be "NA" when GST Registered is "No"') // Ensure "NA" for "No"
      }),

      gst_type: Yup.string().required('GST Type is required'),
      address_line1: Yup.string().required('Address Line 1 is required'),
      postal_code: Yup.number()
        .typeError('Pincode must be an integer')
        .required('Pincode is required')
        .integer('Pincode must be an integer')
        .min(100000, 'Pincode must be at least 6 digits')
        .max(999999, 'Pincode must be at most 6 digits'),

      email: Yup.string().email('Invalid email format').required('Email is required'),

      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      opening_balance: Yup.number()
        .typeError('Opening Balance must be an integer')
        .required('Opening Balance is required')
        .integer('Opening Balance must be an integer')
    }),

    onSubmit: async (values) => {
      const postData = { ...values };
      postData.invoicing_profile = businessDetailsData?.id;
      let post_url = '/invoicing/customer_profiles/create/';
      let put_url = `/invoicing/invoicing/customer_profiles/update/${selectedCustomer?.id}/`;

      let url = type === 'edit' ? put_url : post_url;
      let method = type === 'edit' ? 'put' : 'post';

      try {
        const { res, error } = await Factory(method, url, postData);
        if (res.status_cd === 0) {
          getCustomersData(businessDetailsData?.id);
          setType('');
          resetForm();
          handleClose();
          // showSnackbar(type === 'edit' ? 'Data Updated Successfully' : 'Data Added Successfully', 'success');
        }
      } catch (error) {
        // showSnackbar(JSON.stringify(error), 'error');
      }
    }
  });

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

  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

  return (
    <Modal
      open={open}
      // maxWidth={ModalSize.MD}
      header={{ title: type === 'edit' ? 'Update Customer' : 'Add New Customer', subheader: '' }}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              setType('');
              resetForm();
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            {type === 'edit' ? 'Update' : 'Save'}
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
        <Grid2 container spacing={2}>
          {addCustomerData.map((item) => (
            <Grid2 size={{ xs: 12, sm: 6 }} key={item.name}>
              {item.name === 'gst_registered' ? (
                <FormControl fullWidth>
                  <FormLabel>{item.label}</FormLabel>
                  <RadioGroup
                    name={item.name}
                    value={values[item.name]}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue(item.name, value);

                      if (value === 'No') {
                        setFieldValue('gstin', 'NA'); // Set GSTIN to NA
                        formik.setFieldTouched('gstin', false); // Clear any existing validation error
                        formik.setFieldError('gstin', ''); // Clear error message
                      } else if (value === 'Yes') {
                        setFieldValue('gstin', ''); // Reset GSTIN field for "Yes"
                      }
                    }}
                    row
                  >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              ) : item.name === 'gst_type' || item.name === 'state' || item.name === 'country' ? (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {item.label} {<span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <CustomAutocomplete
                    value={values[item.name]}
                    name={item.name}
                    onChange={(e, newValue) => setFieldValue(item.name, newValue)}
                    options={item.name === 'gst_type' ? gstTypes : item.name === 'state' ? indian_States_And_UTs : CountriesList}
                    error={touched[item.name] && Boolean(errors[item.name])}
                    helperText={touched[item.name] && errors[item.name]}
                  />
                </>
              ) : (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {item.label} {!['address_line2', 'mobile_number'].includes(item.name) && <span style={{ color: 'red' }}>*</span>}
                  </Typography>

                  <CustomInput
                    name={item.name}
                    placeholder={item.name === 'opening_balance' ? '₹' : ''}
                    value={item.name === 'pan_number' ? values[item.name].toUpperCase() : values[item.name]}
                    onChange={(e) => {
                      if (item.name === 'pan_number' && e.target.value.length > 10) {
                        return;
                      }
                      const value = item.name === 'pan_number' ? e.target.value.toUpperCase() : e.target.value;
                      setFieldValue(item.name, value);
                    }}
                    onBlur={handleBlur}
                    error={touched[item.name] && Boolean(errors[item.name])}
                    helperText={touched[item.name] && errors[item.name]}
                    disabled={item.name === 'gstin' && values.gst_registered === 'No'}
                  />
                </>
              )}
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Modal>
  );
};

export default AddCustomer;
