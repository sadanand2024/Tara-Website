import React, { useEffect,useState } from 'react';
import { Box, Typography, Button, Grid2,Card } from '@mui/material';
import IconSave from '@mui/icons-material/Save';
import { useFormik } from 'formik';


import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Yup from 'yup';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';
import BusinessRegistrationDocumenst from './BusinessRegistrationDocumenst';
const StepTwo = ({taskId,tradelicencedetailsTaskId, step, setStep}) => {

  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
   const [tradeLicense, settradeLicense] = useState({
       task_id: null
    });
  
  const dispatch = useDispatch();

  const licenseOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  const formik = useFormik({
    initialValues: {
      id: '',
      apply_new_license: null,
      trade_license_number: '',
      trade_license_file: null
    },
    validationSchema: Yup.object().shape({
      apply_new_license: Yup.object().nullable().required('Required'),
      trade_license_number: Yup.string().when('apply_new_license', {
        is: (val) => val?.value === false,
        then: (schema) => schema.required('TIN Number is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      trade_license_file: Yup.mixed().when('apply_new_license', {
        is: (val) => val?.value === false,
        then: (schema) => schema.required('Trade license file is required'),
        otherwise: (schema) => schema.notRequired()
      })
    }),
    onSubmit: async (values) => {
      // console.log(values);
      let url = values.id ? `/tradelicense/trade-license-exist/${values.id}/` : `/tradelicense/trade-license-exist/`;
      const formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', tradelicencedetailsTaskId);
      formData.append('apply_new_license', values.apply_new_license?.value);
      formData.append('trade_license_number', values.trade_license_number);
      formData.append('status', 'in progress');
      if (values.trade_license_file && typeof values.trade_license_file !== 'string') {
        formData.append('trade_license_file', values.trade_license_file);
      }
      else {
    formData.append('trade_license_number', '');
    formData.append('trade_license_file', '');
  }

      const { res } = await Factory(values.id ? 'put' : 'post', url, formData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: values.id ? 'Declaration updated successfully' : 'Declaration saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getTradeLicenseDeclaration();
        
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Declaration not saved',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  // Fetch and set values for both forms
  const getTradeLicenseDeclaration = async () => {
    const url = `/tradelicense/trade-license-exist/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      // Format the response data to match form structure
      const formattedData = {
        id: res.data.id || '',
        apply_new_license: licenseOptions.find((option) => option.value === res.data.apply_new_license),
        trade_license_number: res.data.trade_license_number,
        trade_license_file: res.data.trade_license_file
      };
      setValues(formattedData);
    settradeLicense(res.data);
    }
  };
  useEffect(() => {
    getTradeLicenseDeclaration();
  }, []);
  const { values, setValues, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;
  return (
    <>
    <Card sx={{ p: 3, mt: 4 }}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Box mb={3}>
          <Grid2 container alignItems="center" justifyContent="space-between" mb={2}>
          <Grid2>
            <Typography variant="h4" fontWeight={700}>
              <span style={{ textDecoration: 'underline' }}>Trade licence Declaration</span>
            </Typography>
          </Grid2>
          <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
            <Box display="flex" justifyContent="flex-end" gap={1}>
            
              <RaiseRequest
                fields={[
                  'Apply new license',
                'Trade license number',
                'Trade license file'
                
                ]}
              
                task_id={taskId}
              />
            </Box>
          </Grid2>
        </Grid2>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ sm: 3, md: 3, xs: 12 }}>
              <Typography variant="subtitle1">Apply for a new Trade Licence</Typography>
            </Grid2>
            <Grid2 size={{ sm: 3, md: 3, xs: 12 }}>
              <Autocomplete
                value={values.apply_new_license}
                size="small"
                onChange={(event, value) => {
                  setFieldValue('apply_new_license', value);
                  if (value?.value === true) {
                    setFieldValue('trade_license_number', '');
                    setFieldValue('trade_license_file', null);
                  }
                }}
                options={licenseOptions}
                getOptionLabel={(option) => option?.label || ''}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(touched.apply_new_license && errors.apply_new_license)}
                    helperText={touched.apply_new_license && errors.apply_new_license}
                  />
                )}
              />
            </Grid2>
            <Grid2 size={{ sm: 6, md: 6, xs: 12 }}></Grid2>

            {values.apply_new_license?.value === false && (
              <>
                <Grid2 size={{ sm: 3, md: 3, xs: 12 }}>
                  <Typography style={{ whiteSpace: 'nowrap' }}>Enter TIN Number</Typography>
                </Grid2>
                <Grid2 size={{ sm: 3, md: 3, xs: 12 }}>
                  <TextField
                    value={values.trade_license_number}
                    onChange={(event) => setFieldValue('trade_license_number', event.target.value)}
                    size="small"
                    fullWidth
                    error={Boolean(touched.trade_license_number && errors.trade_license_number)}
                    helperText={touched.trade_license_number && errors.trade_license_number}
                  />
                </Grid2>
                <Grid2 size={{ sm: 3, md: 3, xs: 12 }}>
                  <RenderFileUpload
                    label="Trade license file"
                    fieldName="trade_license_file"
                    file={values.trade_license_file}
                    setFieldValue={setFieldValue}
                  />
                </Grid2>
              </>
            )}
          </Grid2>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
          <Button size="medium" variant="contained" color="primary" type="submit">
            Save
          </Button>
          
          <GetActionButtons
                    type="put"
                    urlEndpoint="trade-license-exist"
                    recId={tradeLicense.id}
                                        status={tradeLicense.status}
                                        data={tradeLicense}
                                        service_request={service_id}
                                        task_id={taskId}
                                        urlKey="tradelicense"
                                        urlBool={true}
                                      />
        </Box>
      </form>
       </Card>
      <BusinessRegistrationDocumenst taskId={taskId}/>
        <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined"size="small" onClick={() => setStep(step - 1)}  startIcon={<ArrowBackIcon />}>
          Back
        </Button>
      <Button variant="contained" size="small" color="primary" onClick={() => setStep(step + 1)} endIcon={<ArrowForwardIcon />}>
          Continue
        </Button>
        </Box>
      
    </>
    
  
  );
};

export default StepTwo;
