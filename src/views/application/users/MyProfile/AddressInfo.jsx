import React, { useEffect } from 'react';
import { Autocomplete, Box, Button, Card, Grid2, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useSelector } from 'store';
import MainCard from 'ui-component/cards/MainCard';
const additionalFields = [
  { label: 'Address Line 1', name: 'address_line1', type: 'text', required: true },
  { label: 'Address Line 2', name: 'address_line2', type: 'text', required: true },
  { label: 'City', name: 'address_city', type: 'text', required: true },
  //   { label: 'District', name: 'district', type: 'text', required: true },
  { label: 'State', name: 'address_state', type: 'text', required: true },
  { label: 'Country', name: 'country', type: 'text', required: true },
  { label: 'PinCode', name: 'address_pinCode', type: 'text', required: true }
  //   { label: 'Address proof (Additional)', name: 'address_proof_additional', type: 'file', required: true }
];

const AddressInfo = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const personalDetails = user?.employee?.personal_details;

  const formik = useFormik({
    initialValues: {
      address_line1: '',
      address_line2: '',
      address_city: '',
      //   district: '',
      address_state: '',
      address_pinCode: '',
      country: '',
      address_proof_additional: null,
      id: null
    },
    validationSchema: Yup.object({
      address_line1: Yup.string().required('Address Line 1 is required'),
      address_line2: Yup.string().required('Address Line 2 is required'),
      address_city: Yup.string().required('address_city is required'),
      //   district: Yup.string().required('District is required'),
      address_state: Yup.string().required('address_state is required'),
      address_pinCode: Yup.string()
        .matches(/^[1-9][0-9]{5}$/, 'address_pinCode must be exactly 6 digits')
        .required('address_pinCode is required'),
      country: Yup.string().required('Country is required'),
      address_proof_additional: Yup.mixed().required('Address proof is required')
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    }
  });

  const { values, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;

  // Set initial form values from Redux
  useEffect(() => {
    if (personalDetails?.address) {
      setFieldValue('address_line1', personalDetails.address.address_line1 || '');
      setFieldValue('address_line2', personalDetails.address.address_line2 || '');
      setFieldValue('address_city', personalDetails.address.address_city || '');
      //   setFieldValue('district', personalDetails.address.address_address_city || ''); // You may have a separate field for district
      setFieldValue('address_state', personalDetails.address.address_state || '');
      setFieldValue('country', 'India'); // Default if not in Redux
      setFieldValue('address_pinCode', personalDetails.address.address_pinCode || '');
      setFieldValue('id', personalDetails.id || null);
    }
  }, [personalDetails, setFieldValue]);

  const getLabelWithAsterisk = (label, isRequired = true) => (
    <span>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </span>
  );

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <Box key={field.name}>
            <Typography variant="subtitle1" mb={1}>
              {getLabelWithAsterisk(field.label, field.required)}
            </Typography>
            <TextField
              fullWidth
              size="small"
              name={field.name}
              value={values[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
            />
          </Box>
        );

      case 'file':
        return (
          <Box key={field.name}>
            <Typography variant="subtitle1" mb={1}>
              {getLabelWithAsterisk(field.label, field.required)}
            </Typography>
            <RenderFileUpload
              label={field.label}
              fieldName={field.name}
              file={values[field.name]}
              setFieldValue={setFieldValue}
              touched={touched[field.name]}
              errors={errors[field.name]}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <MainCard>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {additionalFields.map((field) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
              {renderField(field)}
            </Grid2>
          ))}
        </Grid2>
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Stack>
      </form>
    </MainCard>
  );
};

export default AddressInfo;
