import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid2, Autocomplete, Button, Card, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
const typeOfBusinessOptions = [
  'Proprietorship',
  'Partnership',
  'Pvt Ltd',
  'Public Ltd',
  'OPC',
  'HUF',
  'Trust',
  'Society',
  'Section 8',
  'Co-operative',
  'Joint Venture',
  'Branch Office',
  'Liaison Office',
  'Foreign Company'
];
const categoryOfEstablishmentOptions = ['Trust', 'Society', 'Section 8', 'Co-operative', 'Joint Venture', 'Branch Office'];
const natureOfBusinessOptions = ['Manufacturing', 'Service'];

const fields = [
  {
    label: 'Classification of Establishment',
    name: 'classification_of_establishment',
    type: 'autocomplete',
    options: typeOfBusinessOptions
  },
  {
    label: 'Category of Establishment',
    name: 'category_of_establishment',
    type: 'autocomplete',
    options: categoryOfEstablishmentOptions
  },
  {
    label: 'Legal Name of Business',
    name: 'legalNameOfBusiness',
    type: 'text'
  },
  {
    label: 'Nature of Business',
    name: 'nature_of_business',
    type: 'autocomplete',
    options: natureOfBusinessOptions
  },
  {
    label: 'Date of Commencement',
    name: 'date_of_commencement',
    type: 'date'
  },
  {
    label: 'PAN',
    name: 'business_pan',
    type: 'file'
  }
];
const BusinessIdentityStructureSection = () => {
  const dispatch = useDispatch();
  const [businessIdentityposttype, setBusinessIdentityposttype] = useState('post');

  const formik = useFormik({
    initialValues: {
      id: '',
      classification_of_establishment: '',
      category_of_establishment: '',
      legalNameOfBusiness: '',
      nature_of_business: '',
      business_pan: '',
      date_of_commencement: ''
    },
    validationSchema: Yup.object({
      classification_of_establishment: Yup.string().required('Classification of Establishment is required'),
      category_of_establishment: Yup.string().required('Category of Establishment is required'),
      legalNameOfBusiness: Yup.string().required('Legal Name of Business is required'),
      nature_of_business: Yup.string().required('Nature of Business is required')
    }),
    onSubmit: async (values) => {
      const url =
        businessIdentityposttype === 'put' ? `/labourlicense/business-identity/${values.id}/` : `/labourlicense/business-identity/`;

      const formData = new FormData();
      formData.append('service_request', 24);
      formData.append('service_task', 6);
      formData.append('date_of_commencement', values.date_of_commencement);
      formData.append('nature_of_business', values.nature_of_business);
      formData.append('legal_name_of_business', values.legalNameOfBusiness);
      formData.append('category_of_establishment', values.category_of_establishment);
      formData.append('classification_of_establishment', values.classification_of_establishment);
      formData.append('status', 'in progress');

      if (values.business_pan && typeof values.business_pan !== 'string') {
        formData.append('business_pan', values.business_pan);
      }

      const { res } = await Factory(businessIdentityposttype, url, formData);

      if (res.status_cd === 1) {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data.data) || 'Something went wrong',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: businessIdentityposttype === 'put' ? 'Data Updated Successfully' : 'Data Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getBusinessIdentity();
      }
    }
  });
  const renderField = (field) => {
    switch (field.type) {
      case 'autocomplete':
        return (
          <Autocomplete
            fullWidth
            size="small"
            options={field.options}
            value={values[field.name]}
            onChange={(e, value) => setFieldValue(field.name, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                name={field.name}
                onChange={handleChange}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
              />
            )}
          />
        );
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            name={field.name}
            value={values[field.name]}
            onChange={handleChange}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            onBlur={handleBlur}
          />
        );
      case 'date':
        return (
          <TextField
            fullWidth
            size="small"
            type="date"
            name={field.name}
            value={values[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          />
        );
      case 'file':
        return (
          <RenderFileUpload
            label={field.label}
            fieldName={field.name}
            file={values[field.name]}
            setFieldValue={setFieldValue}
            touched={touched[field.name]}
            errors={errors[field.name]}
          />
        );
      default:
        return null;
    }
  };
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  const getBusinessIdentity = async () => {
    const url = `/labourlicense/business-identity/by-request-or-task?service_request_id=24`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      // Map API response to form fields
      const responseData = {
        // Business Identity & Structure
        classification_of_establishment: res.data.classification_of_establishment || '',
        category_of_establishment: res.data.category_of_establishment || '',
        legalNameOfBusiness: res.data.legal_name_of_business || '',
        typeOfBusiness: res.data.type_of_business || '',
        nature_of_business: res.data.nature_of_business || '',
        business_pan: res.data.business_pan || '',
        date_of_commencement: res.data.date_of_commencement || '',
        id: res.data.id || ''
      };
      setValues(responseData);
      setBusinessIdentityposttype('put');
    }
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data) || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setBusinessIdentityposttype('post');
    }
  };
  useEffect(() => {
    getBusinessIdentity();
  }, []);

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        <span style={{ textDecoration: 'underline' }}>Business Identity & Structure</span>
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {fields.map((field) => (
            <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography color="text.secondary" fontWeight={500} mb={1}>
                {field.label}
              </Typography>
              {renderField(field)}
            </Grid2>
          ))}
        </Grid2>
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Send for review
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default BusinessIdentityStructureSection;
