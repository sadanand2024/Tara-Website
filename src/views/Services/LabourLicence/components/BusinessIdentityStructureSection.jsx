import { Autocomplete, Box, Button, Card, Grid2, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import CircularProgressComponent from 'utils/CircularProgressComponent';
import { industries } from 'utils/industries';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
import GetActionButtons from '../../FormHelpers';
import RaiseRequest from '../../RaiseRequest';


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
const categoryOfEstablishmentOptions = [
  'Manufacturing & Industrial Units',
  'Shops & Commercial Establishments',
  'IT & Professional Services',
  'Contract & Outsourcing Services',
  'Hospitality & Food Services',
  'Health & Medical Services',
  'Educational & Training Institutions',
  'Transport & Logistics',
  'Media & Entertainment',
  'Others'
];

const fields = [
  {
    label: 'Classification of Establishment',
    name: 'classification_of_establishment',
    type: 'autocomplete',
    options: typeOfBusinessOptions,
    required: true
  },
  {
    label: 'Category of Establishment',
    name: 'category_of_establishment',
    type: 'autocomplete',
    options: categoryOfEstablishmentOptions,
    required: true
  },
  {
    label: 'Legal Name of Business',
    name: 'legalNameOfBusiness',
    type: 'text',
    required: true
  },
  {
    label: 'Nature of Business',
    name: 'nature_of_business',
    type: 'autocomplete',
    options: industries,
    required: true
  },
  {
    label: 'Date of Commencement',
    name: 'date_of_commencement',
    type: 'date',
    required: true
  },
  {
    label: 'PAN',
    name: 'business_pan',
    type: 'file',
    required: true
  }
];
const BusinessIdentityStructureSection = ({ taskId }) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [businessIdentityposttype, setBusinessIdentityposttype] = useState('post');
  const [businessInfo, setBusinessInfo] = useState({
    taskId: null
  });
  const [personsEmployed, setPersonsEmployed] = useState({
    male: '',
    female: '',
    others: '',
    total: ''
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      service_type: '',
      classification_of_establishment: '',
      category_of_establishment: '',
      legalNameOfBusiness: '',
      nature_of_business: '',
      business_pan: '',
      date_of_commencement: '',
      status: '',
      service_request: '',
      service_task: '',
      assignee: '',
      reviewer: ''
    },
    validationSchema: Yup.object({
      classification_of_establishment: Yup.string().required('Classification of Establishment is required'),
      category_of_establishment: Yup.string().required('Category of Establishment is required'),
      legalNameOfBusiness: Yup.string().required('Legal Name of Business is required'),
      nature_of_business: Yup.string().required('Nature of Business is required')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);

      const url =
        businessIdentityposttype === 'put' ? `/labourlicense/business-identity/${values.id}/` : `/labourlicense/business-identity/`;

      const formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', taskId);
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
      setIsLoading(false);
    }
  });
  const getLabelWithAsterisk = (label, isRequired = true) => (
    <span>
      {label}

      {isRequired && <span style={{ color: 'red' }}> *</span>}

    </span>
  );
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
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    color: 'grey.600'
                  }
                }}
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
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'grey.600'
              }
            }}
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
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'grey.600'
              }
            }}
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
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'grey.600'
              }
            }}
          />
        );
      default:
        return null;
    }
  };
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  const getBusinessIdentity = async () => {
    const url = `/labourlicense/business-identity/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      // Map API response to form fields

      const responseData = {
        id: res.data.id || '',
        service_type: res.data.service_type || '',
        classification_of_establishment: res.data.classification_of_establishment || '',
        category_of_establishment: res.data.category_of_establishment || '',
        legalNameOfBusiness: res.data.legal_name_of_business || '',
        nature_of_business: res.data.nature_of_business || '',
        business_pan: res.data.business_pan || '',
        date_of_commencement: res.data.date_of_commencement || '',
        status: res.data.status || '',
        service_request: res.data.service_request || '',
        service_task: res.data.service_task || '',
        assignee: res.data.assignee || '',
        reviewer: res.data.reviewer || ''
      };
      setValues(responseData);
      setBusinessInfo(res?.data);
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
  if (isLoading) {
    return <CircularProgressComponent isLoading={isLoading} displayContent={'Loading business identity...'} />;
  }

  return (
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
                'Category of establishment',
                'Legal name of business',
                'Nature of business',
                'Business PAN',
                'Date of commencement'
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
              {/* <Typography variant="subtitle1" mb={1}>
                {field.label}
              </Typography> */}
              <Typography variant="subtitle1" mb={1}>
                {getLabelWithAsterisk(field.label, field.required)}
              </Typography>
              {renderField(field)}
            </Grid2>
          ))}
          <Grid2 item xs={12} sx={{ maxWidth: 'none', width: '100%' }}>
            <Typography variant="subtitle1" mb={1}>
              {getLabelWithAsterisk('Number of persons employed')}
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Male"
                type="number"
                size="small"
                value={personsEmployed.male}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPersonsEmployed((pe) => ({
                    ...pe,
                    male: val,
                    total: String(Number(val || 0) + Number(pe.female || 0) + Number(pe.others || 0))
                  }));
                }}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Female"
                type="number"
                size="small"
                value={personsEmployed.female}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPersonsEmployed((pe) => ({
                    ...pe,
                    female: val,
                    total: String(Number(pe.male || 0) + Number(val || 0) + Number(pe.others || 0))
                  }));
                }}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Others"
                type="number"
                size="small"
                value={personsEmployed.others}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPersonsEmployed((pe) => ({
                    ...pe,
                    others: val,
                    total: String(Number(pe.male || 0) + Number(pe.female || 0) + Number(val || 0))
                  }));
                }}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Total"
                type="number"
                size="small"
                value={personsEmployed.total}
                InputProps={{ readOnly: true }}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid2>
        </Grid2>
        <Stack direction="row" spacing={1} sx={{ mt: 3, justifyContent: 'flex-end' }}>
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
            urlKey="labourlicense"
            urlBool={true}
          />
        </Stack>
      </form>
    </Card>
  );
};

export default BusinessIdentityStructureSection;
