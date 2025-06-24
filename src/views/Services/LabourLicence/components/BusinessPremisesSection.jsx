import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Grid2, Card, Autocomplete, Button, Radio, Stack, FormGroup, FormControlLabel } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import AdditionalPlaceOfBusiness from './AdditionalPlaceOfBusiness';
import { useSearchParams } from 'react-router-dom';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';
const BusinessPremisesSection = ({ taskId }) => {
  const [searchParams] = useSearchParams();
    const service_id = searchParams.get('service_id');
  const [businessPremises, setBusinessPremises] = useState({
    id: null,
    additional_space: 'no'
  });
  const dispatch = useDispatch();
  let mainFields = [
    {
      label: 'Address Line 1',
      name: 'addressLine1',
      type: 'text'
    },
    {
      label: 'Address Line 2',
      name: 'addressLine2',
      type: 'text'
    },
    {
      label: 'City',
      name: 'city',
      type: 'text'
    },
    {
      label: 'District',
      name: 'district',
      type: 'text'
    },
    {
      label: 'State',
      name: 'state',
      type: 'text'
    },
    {
      label: 'Pincode',
      name: 'pincode',
      type: 'text'
    },
    {
      label: 'Nature of possession',
      name: 'nature_of_possession',
      type: 'text'
    },
    {
      label: 'Address proof',
      name: 'address_proof',
      type: 'file'
    },
    {
      label: 'Rental Agreement/NOC',
      name: 'rental_agreement',
      type: 'file'
    },
    {
      label: 'Bank Statement/Cancelled Cheque',
      name: 'bankStatement',
      type: 'file'
    }
  ];

  const formik = useFormik({
    initialValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      nature_of_possession: '',
      address_proof: null,
      rental_agreement: null,
      bankStatement: null,
      workplace: '',
      additional_space: 'no'
    },
    validationSchema: Yup.object({
      addressLine1: Yup.string().required('Address Line 1 is required'),
      addressLine2: Yup.string().required('Address Line 2 is required'),
      city: Yup.string().required('City is required'),
      // district: Yup.string().required('District is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.number().required('Pincode is required'),
      nature_of_possession: Yup.string().required('Nature of possession is required'),
      address_proof: Yup.mixed().required('Address proof is required'),
      rental_agreement: Yup.mixed().required('Rental Agreement/NOC is required'),
      bankStatement: Yup.mixed().required('Bank Statement/Cancelled Cheque is required'),
      // additional_space: Yup.string().required('Please select if you have additional space'),
      // workplace: Yup.string().when('additional_space', {
      //   is: (val) => val === 'yes',
      //   then: () => Yup.string().required('Workplace is required'),
      //   otherwise: () => Yup.string().notRequired()
      // })
    }),
    onSubmit: async (values) => {
      let url = businessPremises.id ? `/labourlicense/business-location/${businessPremises.id}/` : `/labourlicense/business-location/`;
      let formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', taskId);
      formData.append(
        'principal_place_of_business',
        JSON.stringify({
          address_line1: values.addressLine1,
          address_line2: values.addressLine2,
          district: values.district,
          city: values.city,
          state: values.state,
          pincode: values.pincode
        })
      );
      formData.append('nature_of_possession', values.nature_of_possession);
      // formData.append('additional_space', values.additional_space);
      // formData.append('workplace', values.workplace);
      formData.append('status', 'in progress');

      if (values.address_proof && typeof values.address_proof !== 'string') {
        formData.append('address_proof', values.address_proof);
      }
      if (values.rental_agreement && typeof values.rental_agreement !== 'string') {
        formData.append('rental_agreement', values.rental_agreement);
      }
      if (values.bankStatement && typeof values.bankStatement !== 'string') {
        formData.append('bank_statement', values.bankStatement);
      }

      const { res } = await Factory(businessPremises.id ? 'put' : 'post', url, formData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: businessPremises.id ? 'Data updated successfully' : 'Data saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getBusinessPremises();
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

  const getBusinessPremises = async () => {
    const url = `/labourlicense/business-location/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0 && res.data) {
      const data = res.data;
      formik.setValues({
        addressLine1: data.principal_place_of_business?.address_line1 || '',
        addressLine2: data.principal_place_of_business?.address_line2 || '',
        city: data.principal_place_of_business?.city || '',
        district: data.principal_place_of_business?.district || '',
        state: data.principal_place_of_business?.state || '',
        pincode: data.principal_place_of_business?.pincode || '',
        nature_of_possession: data.nature_of_possession || '',
        address_proof: data.address_proof || null,
        rental_agreement: data.rental_agreement || null,
        bankStatement: data.bank_statement || null,
        // additional_space: data.additional_space || 'no',
        // workplace: data.workplace && data.workplace !== 'null' ? data.workplace : ''
      });
      setBusinessPremises({
        ...data,
        // additional_space: data.additional_space || 'no'
      });
    }
  };
  const renderField = (field, formikContext) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikContext;

    switch (field.type) {
      case 'text':
        return field.name === 'state' || field.name === 'nature_of_possession' ? (
          <>
            <Typography color="text.secondary" fontWeight={500} mb={1}>
              {field.label}
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={field.name === 'state' ? indian_States_And_UTs : ['Self Owned', 'Rented', 'Leased']}
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
        ) : (
          <>
            <Typography color="text.secondary" fontWeight={500} mb={1}>
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
            />
          </>
        );
      case 'file':
        return (
          <>
            <Typography color="text.secondary" fontWeight={500} mb={1}>
              {field.label}
            </Typography>
            <RenderFileUpload
              label={field.label}
              fieldName={field.name}
              file={values[field.name]}
              setFieldValue={setFieldValue}
              touched={touched[field.name]}
              errors={errors[field.name]}
            />
          </>
        );
      default:
        return null;
    }
  };

  const { values, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;

  useEffect(() => {
    getBusinessPremises();
  }, []);

  return (
    <Box mt={4}>
      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            {/* <Grid2 size={12}>
              <Typography variant="h4" fontWeight={700}>
                Business premises, location & proofs
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={700} mt={2}>
                Principal place of business
              </Typography>
            </Grid2> */}
                      <Grid2 container alignItems="center" justifyContent="space-between" mb={2}>
      <Grid2>
    <Typography variant="h4" fontWeight={700}>
      <span style={{ textDecoration: 'underline' }}>Business premises, location & proofs</span>
    </Typography>
     
  </Grid2>
  <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
    <Box display="flex" justifyContent="flex-end" gap={1}>
     
      <RaiseRequest
        fields={[
         'Address Line 1',
  'Address Line 2',
  'City',
  'District',
  'State',
  'Pincode',
  'Nature of possession',
  'Address proof',
  'Rental agreement',
  'Bank statement',
  'Workplace',
  'Additional space required'
        
        ]}
      
        task_id={taskId}
      />
    </Box>
  </Grid2>
</Grid2>

            {mainFields.map((field) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
                {renderField(field, formik)}
              </Grid2>
            ))}

            {/* <Grid2 size={12}>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography sx={{ mr: 2 }}>Additional place of business?</Typography>
                <FormGroup row>
                  <FormControlLabel
                    label="Yes"
                    control={
                      <Radio
                        checked={businessPremises.additional_space === 'yes'}
                        onChange={() => {
                          setBusinessPremises((prev) => ({ ...prev, additional_space: 'yes' }));
                          setFieldValue('additional_space', 'yes');
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="No"
                    control={
                      <Radio
                        checked={businessPremises.additional_space === 'no'}
                        onChange={() => {
                          setBusinessPremises((prev) => ({ ...prev, additional_space: 'no' }));
                          setFieldValue('additional_space', 'no');
                        }}
                      />
                    }
                  />
                </FormGroup>
              </Box>
            </Grid2>

            {businessPremises.additional_space === 'yes' && (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Office', 'Godown', 'Warehouse']}
                  value={values.workplace || ''}
                  onChange={(_, value) => setFieldValue('workplace', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Workplace"
                      error={touched.workplace && Boolean(errors.workplace)}
                      helperText={touched.workplace && errors.workplace}
                    />
                  )}
                />
              </Grid2>
            )} */}

            <Grid2 size={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
{/*               
                                    <GetActionButtons
                                      type="put"
                                      urlEndpoint="business-location"
                                      recId={businessPremises.id}
                                      status={businessPremises.status}
                                      data={businessPremises}
                                      service_request={service_id}
                                      task_id={taskId}
                                      urlKey="labourlicense"
                                      urlBool={true}
                                    /> */}
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Card>

        <Box mt={4}>
          <AdditionalPlaceOfBusiness 
           businessPremises={businessPremises}
           setBusinessPremises={setBusinessPremises} // ✅ Pass this down
           taskId={taskId} />
        </Box>
    </Box>
  );
};

export default BusinessPremisesSection;
