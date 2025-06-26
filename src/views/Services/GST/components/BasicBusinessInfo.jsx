import { Autocomplete, Box, Button, Card, Grid2, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';

import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
const BasicBusinessInfo = () => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const [basicInfo, setbasicInfo] = useState({
    id: null,
    task_id: null
  });

  const dispatch = useDispatch();
  let mainFields = [
    {
      label: 'Legal Name of the Business',
      name: 'legal_name_of_business',
      type: 'text'
    },
    {
      label: 'Trade Name of the Business',
      name: 'trade_name_of_business',
      type: 'text'
    },
    {
      label: 'PAN of the Business',
      name: 'business_pan',
      type: 'file'
    },
    {
      label: 'constitution of the Business',
      name: 'constitution_of_business',
      type: 'text'
    },

    {
      label: 'Date of Commencement of Business',
      name: 'business_commencement_date',
      type: 'date'
    },
    {
      label: 'Nature Of Business',
      name: 'nature_of_business',
      type: 'text'
    },
    {
      label: 'Email Address',
      name: 'email_address',
      type: 'text'
    },
    {
      label: 'Mobile Number',
      name: 'mobile_number',
      type: 'text'
    }
  ];

  const formik = useFormik({
    initialValues: {
      legal_name_of_business: '',
      trade_name_of_business: '',
      business_pan: null,
      constitution_of_business: '',
      certificate_of_incorporation: null,
      MOA_AOA: null,
      business_commencement_date: '',
      nature_of_business: '',
      email_address: '',
      mobile_number: ''
    },
    validationSchema: Yup.object({
      legal_name_of_business: Yup.string().required('legal_name_of_business is required'),
      trade_name_of_business: Yup.string().required('trade_name_of_business is required'),
      business_pan: Yup.mixed().required('business_pan is required'),
      constitution_of_business: Yup.string().required('Constitution is required'),
      // certificate_of_incorporation: Yup.mixed().required('certificate_of_incorporation is required'),
      // MOA_AOA: Yup.mixed().required('MOA_AOA is required'),
      business_commencement_date: Yup.string().required('business_commencement_date is required'),
      nature_of_business: Yup.string().required('nature_of_business is required'),
      // rental_agreement: Yup.mixed().required('Rental Agreement/NOC is required'),
       mobile_number: Yup.string()
              .required('Mobile Number is required')
              .matches(/^[0-9]+$/, 'Mobile Number must be a number')
              .min(10, 'Mobile Number must be at least 10 digits')
              .max(10, 'Mobile Number must not exceed 10 digits'),  
      email_address: Yup.string().required('email_address is required'),
      certificate_of_incorporation: Yup.mixed().when('constitution_of_business', {
        is: (val) => ['Foreign Company', 'Private Comapny', 'Public Company', 'One Person Company', 'Section 8 Company'].includes(val),
        then: (schema) => schema.required('Certificate of Incorporation is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      MOA_AOA: Yup.mixed().when('constitution_of_business', {
        is: (val) => ['Foreign Company', 'Private Comapny', 'Public Company', 'One Person Company', 'Section 8 Company'].includes(val),
        then: (schema) => schema.required('MOA & AOA is required'),
        otherwise: (schema) => schema.notRequired()
      })
    }),
    onSubmit: async (values) => {
      const task_id = basicInfo.task_id;
      let url = basicInfo.id ? `/gst/basic-business-info/${basicInfo.id}/` : `/gst/basic-business-info/`;
      let formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', task_id);
      formData.append('status', 'in progress');

      formData.append('legal_name_of_business', values.legal_name_of_business);
      formData.append('trade_name_of_business', values.trade_name_of_business);

      formData.append('constitution_of_business', values.constitution_of_business);
      formData.append('business_commencement_date', values.business_commencement_date);

      formData.append('nature_of_business', values.nature_of_business);
      formData.append('email_address', values.email_address);
      formData.append('mobile_number', values.mobile_number);

      if (values.business_pan && typeof values.business_pan !== 'string') {
        formData.append('business_pan', values.business_pan);
      }

      if (values.certificate_of_incorporation && typeof values.certificate_of_incorporation !== 'string') {
        formData.append('certificate_of_incorporation', values.certificate_of_incorporation);
      }
      if (values.MOA_AOA && typeof values.MOA_AOA !== 'string') {
        formData.append('MOA_AOA', values.MOA_AOA);
      }

      const { res } = await Factory(basicInfo.id ? 'put' : 'post', url, formData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: basicInfo.id ? 'Data updated successfully' : 'Data saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getbasicInfo();
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
      }
    }
  });

  const getbasicInfo = async () => {
    // const url = `/gst/basic-business-info/by-service-request/?service_request_id=${service_id}`;
    const url = `/gst/service-request-section-data?service_request_id=${service_id}&section=business_details`;
    const { res } = await Factory('get', url);

    if (res.status_cd === 0 && res.data) {
      const data = res?.data?.task_data['Basic Business Info']?.data;
      if (res?.data?.task_data && data !== null) {
        formik.setValues({
          legal_name_of_business: data?.legal_name_of_business || '',
          business_pan: data.business_pan || null,
          certificate_of_incorporation: data.certificate_of_incorporation || null,
          MOA_AOA: data.MOA_AOA || null,
          business_commencement_date: data.business_commencement_date || '',
          nature_of_business: data.nature_of_business || '',
          mobile_number: data.mobile_number || '',
          email_address: data.email_address || '',
          constitution_of_business: data.constitution_of_business || '',
          trade_name_of_business: data.trade_name_of_business || '',
          id: data.id || '',
          task_id: res?.data?.task_data['Basic Business Info']?.task_id || null
        });
        setbasicInfo({
          ...(data || {}),
          task_id: res.data?.task_data['Basic Business Info']?.task_id || null
        });
      } else {
        setbasicInfo({
          task_id: res?.data?.task_data['Basic Business Info']?.task_id
        });
      }
    }
  };
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        if (field.name === 'constitution_of_business') {
          return (
            <>
              <Typography variant="subtitle1" mb={1}>
                {field.label}
              </Typography>
              <Autocomplete
                fullWidth
                size="small"
                // options={field.options}
                options={[
                  'Proprietorship',
                  'Partnership',
                  'Private Comapny',
                  'Public Company',
                  'One Person Company',
                  'HUF',
                  'Trust',
                  'Society',
                  'Section 8 Company',
                  'Co-operative',
                  'Joint Venture',
                  'Branch Office',
                  'Liaison Office',
                  'Foreign Company'
                ]}
                value={values[field.name]}
                onChange={(e, value) => setFieldValue(field.name, value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name={field.name}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                  />
                )}
              />
            </>
          );
        }

        return (
          <>
            <Typography variant="subtitle1"  mb={1}>
              {field.label}
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
              sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'grey.600'
              }
            }}
            />
          </>
        );
      case 'date':
        return (
          <>
            <Typography variant="subtitle1"  mb={1}>
              {field.label}
            </Typography>
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
          </>
        );

      case 'file':
        return (
          <>
            <Typography variant="subtitle1"  mb={1}>
              {field.label}
            </Typography>
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
          </>
        );

      default:
        return null;
    }
  };

  const { values, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;

  useEffect(() => {
    getbasicInfo();
  }, []);
  

  return (
    <Box mt={4}>
      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 container alignItems="center" justifyContent="space-between" mb={2}>
              <Grid2>
                <Typography variant="h4" fontWeight={700}>
                  Basic Business Information
                </Typography>
              </Grid2>
              <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <RaiseRequest
                    fields={[
                      'Legal Name of the Business',
                      'Trade Name of the Business',
                      'PAN of the Business',
                      'constitution of the Business',
                      'Date of Commencement of Business',
                      'Nature Of Business',
                      'Email Address',
                      'Mobile Number'
                    ]}
                    task_id={basicInfo.task_id}
                  />
                </Box>
              </Grid2>
            </Grid2>

            {mainFields.map((field) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
                {renderField(field, formik)}
              </Grid2>
            ))}
            {['Foreign Company', 'Private Comapny', 'Public Company', 'One Person Company', 'Section 8 Company'].includes(
              values.constitution_of_business
            ) && (
              <>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  {renderField(
                    {
                      label: 'Certificate of Incorporation',
                      name: 'certificate_of_incorporation',
                      type: 'file'
                    },
                    formik
                  )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  {renderField(
                    {
                      label: 'MOA & AOA',
                      name: 'MOA_AOA',
                      type: 'file'
                    },

                    formik
                  )}
                </Grid2>
              </>
            )}
            <Grid2 size={12}>
              <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
                <GetActionButtons
                  type="put"
                  urlEndpoint="basic-business-info"
                  recId={basicInfo.id}
                  status={basicInfo.status}
                  data={basicInfo}
                  service_request={service_id}
                  task_id={basicInfo.task_id}
                  urlKey="gst"
                  urlBool={true}
                />
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Card>
    </Box>
  );
};

export default BasicBusinessInfo;
