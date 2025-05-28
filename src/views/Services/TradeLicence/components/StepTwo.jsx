import React, { useEffect } from 'react';
import { Box, Typography, Button, Grid2 } from '@mui/material';
import IconSave from '@mui/icons-material/Save';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import BusinessRegistrationDocumenst from './BusinessRegistrationDocumenst';
const StepTwo = () => {
  const dispatch = useDispatch();

  const licenseOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  const formik = useFormik({
    initialValues: {
      id: '',
      apply_new_license: null,
      trade_license_number: null,
      trade_license_file: null
    },
    validationSchema: Yup.object().shape({
      apply_new_license: Yup.object().nullable().required('Required'),
      trade_license_number: Yup.string().when('apply_new_license', {
        is: (val) => val?.value === 'no',
        then: (schema) => schema.required('TIN Number is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      trade_license_file: Yup.mixed().when('apply_new_license', {
        is: (val) => val?.value === 'no',
        then: (schema) => schema.required('Trade license file is required'),
        otherwise: (schema) => schema.notRequired()
      })
    }),
    onSubmit: async (values) => {
      console.log(values);
      let url = values.id ? `/tradelicense/trade-license-exist/${values.id}/` : `/tradelicense/trade-license-exist/`;
      const formData = new FormData();
      formData.append('service_request', 25);
      formData.append('service_task', 5);
      formData.append('apply_new_license', values.apply_new_license?.value);
      formData.append('trade_license_number', values.trade_license_number);
      if (values.trade_license_file && typeof values.trade_license_file !== 'string') {
        formData.append('trade_license_file', values.trade_license_file);
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
    const url = `/tradelicense/trade-license-exist/by-request-or-task?service_request_id=25`;
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
    }
  };
  useEffect(() => {
    getTradeLicenseDeclaration();
  }, []);
  const { values, setValues, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;
  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Box mb={3}>
          <Typography variant="h4" mb={1}>
            Trade licence Declaration
          </Typography>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ sm: 3, md: 3, xs: 12 }}>
              <Typography>Apply for a new Trade Licence</Typography>
            </Grid2>
            <Grid2 size={{ sm: 3, md: 3, xs: 12 }}>
              <Autocomplete
                value={values.apply_new_license}
                size="small"
                onChange={(event, value) => {
                  setFieldValue('apply_new_license', value);
                  if (value?.value === 'yes') {
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

            {values.apply_new_license?.value === 'no' && (
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
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button size="medium" variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </form>
      <BusinessRegistrationDocumenst />
    </>
  );
};

export default StepTwo;
