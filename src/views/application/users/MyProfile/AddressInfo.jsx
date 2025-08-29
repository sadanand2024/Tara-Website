import { Box, Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
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
  const profileId = user?.employee?.personal_details?.id;

  const [AddressInfo, setAddressInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      personal_id: '',
      address_line1: '',
      address_line2: '',
      address_city: '',
      //   district: '',
      address_state: '',
      address_pinCode: '',
      country: '',
      address_proof_additional: null,
      // id: ''
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
      // Make file optional so submit isn’t blocked by hidden/missing field
      // address_proof_additional: Yup.mixed().nullable()
    }),
    onSubmit: async (values, { setSubmitting }) => {
  try {
    setSubmitting(true);

    // Build the endpoint using personal_id
    const url = `/payroll/employee-profile-update/`;

    // Prepare the payload
     const body = {
    
      personal_details: {
        address: {
        address_line1: values.address_line1,
        address_line2: values.address_line2,
        address_city: values.address_city,
        address_state: values.address_state,
        address_pinCode: values.address_pinCode,
        country: values.country
      }
      }
    };

    const { res } = await Factory('put', url, body);
    if (res?.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Address updated successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to update address',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  } catch (err) {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Failed to update address',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      })
    );
  } finally {
    setSubmitting(false);
  }
}

   
  });

  const { values, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur, isSubmitting } = formik;

const getAddressInfo = async () => {
  setIsLoading(true);
  const url = `/payroll/employee-profile/`;

  try {
    const { res } = await Factory('get', url);
    if (res?.status_cd === 0 && res?.data?.personal_details) {
      // const data = res.data.personal_details;
       const data = res.data.personal_details;
      const address = data.address || {};

      formik.setValues({
         personal_id: data?.id ?? '',
        address_line1: address?.address_line1 || '',
        address_line2: address?.address_line2 || '',
        address_city: address?.address_city || '',
        address_state: address?.address_state || '',
        address_pinCode: address?.address_pinCode || '',
        country: address?.country || 'Indian'
      });

      setAddressInfo(data);
    }
  } catch (error) {
   
    dispatch(
      openSnackbar({
        open: true,
        message: 'Failed to fetch address info',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      })
    );
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    getAddressInfo();
  }, []);

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
          <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </Stack>
      </form>
    </MainCard>
  );
};

export default AddressInfo;
