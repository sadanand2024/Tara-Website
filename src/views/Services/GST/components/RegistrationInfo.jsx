import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
import { openSnackbar } from 'store/slices/snackbar';
import { useSearchParams } from 'react-router-dom';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';




// Dummy placeholders - replace with your actual imports/context hooks
import { useDispatch } from 'react-redux';
// import { openSnackbar } from 'yourSnackbarSlice';
// import Factory from 'yourApiFactory';


const RegistrationInfo = () => {
     const [searchParams] = useSearchParams();
      const service_id = searchParams.get('service_id');
  const [registrationInfo, setregistrationInfo] = useState({});
  const dispatch = useDispatch();

  const questions = [
    { label: '1. Is this voluntary registration?', stateKey: 'is_this_voluntary_registration' },
    { label: '2. Applying for Casual taxable person?', stateKey: 'applying_for_casual_taxable_person' },
    { label: '3. Opting for Composition scheme?', stateKey: 'opting_for_composition_scheme' },
    { label: '4. Any existing GST Registration?', stateKey: 'any_existing_registration' }
  ];

  const validationSchema = Yup.object().shape({
    is_this_voluntary_registration: Yup.string().required('Please select an option'),
    applying_for_casual_taxable_person: Yup.string().required('Please select an option'),
    opting_for_composition_scheme: Yup.string().required('Please select an option'),
    any_existing_registration: Yup.string().required('Please select an option'),
    registration_number: Yup.string().when('existingGST', (existingGST, schema) => {
      return existingGST === 'yes'
        ? schema.required('Registration No. is required')
        : schema.notRequired();
    }),
    date_of_registration: Yup.date()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .when('existingGST', (existingGST, schema) => {
        return existingGST === 'yes'
          ? schema.required('Registration Date is required')
          : schema.notRequired();
      }),
  });

  const formik = useFormik({
    initialValues: {
      is_this_voluntary_registration: '',
      applying_for_casual_taxable_person: '',
      opting_for_composition_scheme: '',
      any_existing_registration: '',
      registration_number: '',
      date_of_registration: '',
      // add any extra fields here if needed for your API
    },
    validationSchema,
    onSubmit: async (values) => {
      const task_id = registrationInfo.task_id;
      try {
        const url = registrationInfo.id
          ? `/gst/registration-info/${registrationInfo.id}/`
          : `/gst/registration-info/`;

        const formData = new FormData();
        formData.append('service_request',service_id);
        formData.append('service_task', task_id);
        formData.append('status', 'in progress');

        // Map your form values to formData keys (adjust keys as per your API)
        formData.append('is_this_voluntary_registration', values.is_this_voluntary_registration);
        formData.append('applying_for_casual_taxable_person', values.applying_for_casual_taxable_person);
        formData.append('opting_for_composition_scheme', values.opting_for_composition_scheme);
        formData.append('any_existing_registration', values.any_existing_registration);
        if (values.any_existing_registration === 'Yes') {
  formData.append('registration_number', values.registration_number);
  formData.append('date_of_registration', values.date_of_registration);
  }
  else {
  formData.append('registration_number', '');
  formData.append('date_of_registration', '');
  }

        // Example: if you had file inputs:
        // if (values.someFileField && typeof values.someFileField !== 'string') {
        //   formData.append('some_file_field', values.someFileField);
        // }

        // Replace Factory with your API calling method:
        const { res } = await Factory(registrationInfo.id ? 'put' : 'post', url, formData);

        if (res.status_cd === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: registrationInfo.id ? 'Data updated successfully' : 'Data saved successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          // alert(registrationInfo.id ? 'Data updated successfully' : 'Data saved successfully');
          getregistrationInfo(); // Refresh data
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: JSON.stringify(res.data.data) || 'Something went wrong',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
          alert('Something went wrong: ' + JSON.stringify(res.data?.data || 'Unknown error'));
        }
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  });

  // Move getregistrationInfo above useEffect so it's defined before useEffect runs
  const getregistrationInfo = async () => {
    const url = `/gst/service-request-section-data?service_request_id=${service_id}&section=business_details`;
    const { res } = await Factory('get', url);
    

    if (res.status_cd === 0 && res.data) {
      const data = res?.data?.task_data["Registration Info"]?.data;
      // const data = res.data;
    
      if (res?.data?.task_data && data !== null) {
      formik.setValues({
        is_this_voluntary_registration: data.is_this_voluntary_registration || '',
        applying_for_casual_taxable_person: data.applying_for_casual_taxable_person || '',
        opting_for_composition_scheme: data.opting_for_composition_scheme || '',
        any_existing_registration: data.any_existing_registration || '',
        registration_number: data.registration_number || '',
        date_of_registration: data.date_of_registration || '',
        id:data.id || '',
        task_id: res.data?.task_data["Registration Info"]?.task_id || null,

      });
      setregistrationInfo({
        ...data,
        task_id: res.data?.task_data["Registration Info"]?.task_id || null,

      });
    }
    else {
        setregistrationInfo({
          task_id: res?.data?.task_data["Registration Info"]?.task_id,
        });
      }
    }
  };

  // useEffect must be after getregistrationInfo is defined
  useEffect(() => {
    getregistrationInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ pt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Grid2>
               <Typography variant="h4" fontWeight={700}>
                 Registration Information
               </Typography>
             </Grid2>
             <Grid2 sx={{ flexGrow:1,ml:95 }}>
               <Box display="flex" justifyContent="flex-end" gap={1}>
                 <RaiseRequest
                   fields={[]}
                   task_id={registrationInfo.task_id}
                 />
                 
               </Box>
             </Grid2>

          <form onSubmit={formik.handleSubmit}>
            {questions.map((item, index) => (
              <FormControl
                key={index}
                component="fieldset"
                fullWidth
                sx={{ mt: 2 }}
              >
                <FormLabel component="legend">{item.label}</FormLabel>
                <RadioGroup
                  row
                  name={item.stateKey}
                  value={formik.values[item.stateKey]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                {formik.touched[item.stateKey] && formik.errors[item.stateKey] && (
                  <Typography variant="caption" color="error">
                    {formik.errors[item.stateKey]}
                  </Typography>
                )}
              </FormControl>
            ))}

            {formik.values.any_existing_registration === 'Yes' && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  GST Registration Details
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 2 }}>
                    <TextField
                      label="Registration No."
                      name="registration_number"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={formik.values.registration_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.registration_number && Boolean(formik.errors.registration_number)}
                      helperText={formik.touched.registration_number && formik.errors.registration_number}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 2 }}>
                    <TextField
                      label="Date of Registration"
                      name="date_of_registration"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={formik.values.date_of_registration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.date_of_registration && Boolean(formik.errors.date_of_registration)}
                      helperText={formik.touched.date_of_registration && formik.errors.date_of_registration}
                    />
                  </Grid2>
                </Grid2>
              </Box>
            )}

            <Grid2 size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button variant="contained" color="primary" type="submit">
                  Save Registration Details
                </Button>
                 <GetActionButtons
                            type="put"
                            urlEndpoint="registration-info"
                            recId={registrationInfo.id}
                            status={registrationInfo.status}
                            data={registrationInfo}
                            service_request={service_id}
                            task_id={registrationInfo.task_id}
                            urlKey="gst"
                            urlBool={true}
                            
                          />
              </Stack>
            </Grid2>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegistrationInfo;
