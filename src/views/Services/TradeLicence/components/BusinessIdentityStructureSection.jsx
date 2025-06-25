import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid2, Autocomplete, Button, Card, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import ApplicantDetails from './ApplicantDetails';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';
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
const natureOfBusinessOptions = ['Manufacturing', 'Service'];

const fields = [
  {
    label: 'Type of Business',
    name: 'type_of_business',
    type: 'autocomplete',
    options: typeOfBusinessOptions
  },

  {
    label: 'Legal Name of Business',
    name: 'legal_name_of_business',
    type: 'text'
  },

  {
    label: 'Nature of Business',
    name: 'nature_of_business',
    type: 'autocomplete',
    options: natureOfBusinessOptions
  },
  {
    label: 'PAN',
    name: 'business_pan',
    type: 'file'
  }
];
const BusinessIdentityStructureSection = ({taskId, applicantTaskId}) => {

  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const dispatch = useDispatch();
  const [businessIdentityposttype, setBusinessIdentityposttype] = useState('post');
  const [businessInfo, setbusinessInfo] = useState({
    task_id: null
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      type_of_business: '',
      legal_name_of_business: '',
      nature_of_business: '',
      business_pan: ''
    },
    validationSchema: Yup.object({
      type_of_business: Yup.string().required('Type of Business is required'),
      legal_name_of_business: Yup.string().required('Legal Name of Business is required'),
      nature_of_business: Yup.string().required('Nature of Business is required'),
      business_pan: Yup.mixed().required('PAN is required')
    }),
    onSubmit: async (values) => {
      const url = businessIdentityposttype === 'put' ? `/tradelicense/business-identity/${values.id}/` : `/tradelicense/business-identity/`;

      const formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', taskId);
      formData.append('nature_of_business', values.nature_of_business);
      formData.append('legal_name_of_business', values.legal_name_of_business);
      formData.append('type_of_business', values.type_of_business);
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
    const url = `/tradelicense/business-identity/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      const responseData = {
        type_of_business: res.data.type_of_business || '',
        legal_name_of_business: res.data.legal_name_of_business || '',
        nature_of_business: res.data.nature_of_business || '',
        business_pan: res.data.business_pan || '',
        task_id:res.data.task_id || '',
        id: res.data.id || ''
      };
      setValues(responseData);
      setbusinessInfo(res.data);
    
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
    <Box>
      <Card sx={{ p: 3 }}>
      <Grid2 container alignItems="center" justifyContent="space-between" mb={2}>
  <Grid2>
    <Typography variant="h4" fontWeight={700}>
      <span style={{ textDecoration: 'underline' }}>Business Identity & Structure</span>
    </Typography>
  </Grid2>
  <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
    <Box display="flex" justifyContent="flex-end" gap={1}>
     
      <RaiseRequest
        fields={[
          'Type of business',
          'legal name of business',
          'nature of business',
          'business pan',
        
        ]}
       
        task_id={taskId}
      />
    </Box>
  </Grid2>
</Grid2>


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
          <Stack direction="row" spacing={1} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          
            <GetActionButtons
                              type="put"
                              urlEndpoint="business-identity"
                              recId={businessInfo.id}
                              status={businessInfo.status}
                              data={businessInfo}
                              service_request={service_id}
                              task_id={taskId}
                              urlKey="tradelicense"
                              urlBool={true}
                            />
          </Stack>
        </form>
      </Card>
      <ApplicantDetails applicantTaskId={applicantTaskId} />

    </Box>
  );
};

export default BusinessIdentityStructureSection;
