import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  Grid as Grid2,
  Radio,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import GetActionButtons from '../../FormHelpers';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import * as Yup from 'yup';

const additionalFields = [
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
    label: 'Address proof (Additional)',
    name: 'address_proof_additional',
    type: 'file'
  },
  {
    label: 'Rental Agreement/NOC (Additional)',
    name: 'rental_agreement_additional',
    type: 'file'
  }
];

const AdditionalPlaceOfBusiness = ({ businessPremises, setBusinessPremises, taskId }) => {
  const dispatch = useDispatch();
  const service_id = businessPremises?.service_request;

  

  const [additionalSpace, setAdditionalSpace] = useState(businessPremises?.additional_space || null);
  const [workplace, seWorkPlace] = useState(businessPremises?.workplace || null);

    const clearFormFields = () => {
    setValues({
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      nature_of_possession: '',
      address_proof_additional: null,
      rental_agreement_additional: null,
      id: null,
      workplace:'',
    });
  };

  const formik = useFormik({
    initialValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      nature_of_possession: '',
      address_proof_additional: null,
      rental_agreement_additional: null,
      id: null,
      workplace:''
    },
    validationSchema: Yup.object({
      addressLine1: Yup.string().required('Address Line 1 is required'),
      addressLine2: Yup.string().required('Address Line 2 is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string()
                .matches(/^[1-9][0-9]{5}$/, 'Pincode must be exactly 6 digits')
                .required('Pincode is required'),
      nature_of_possession: Yup.string().required('Nature of possession is required'),
      address_proof_additional: Yup.mixed().required('Address proof is required'),
      rental_agreement_additional: Yup.mixed().required('Rental Agreement/NOC is required')
    }),
    onSubmit: async (values) => {
      const url = values.id ? `/labourlicense/additional-space/${values.id}/` : `/labourlicense/additional-space/`;
      const formData = new FormData();
      formData.append('business_location_proofs', businessPremises.id);
      formData.append(
        'address',
        JSON.stringify({
          address_line1: values.addressLine1,
          address_line2: values.addressLine2,
          city: values.city,
          district: values.district,
          state: values.state,
          pincode: values.pincode
        })
      );
      formData.append('nature_of_possession', values.nature_of_possession);

      if (values.address_proof_additional && typeof values.address_proof_additional !== 'string') {
        formData.append('address_proof', values.address_proof_additional);
      }
      if (values.rental_agreement_additional && typeof values.rental_agreement_additional !== 'string') {
        formData.append('rental_agreement', values.rental_agreement_additional);
      }

      const { res } = await Factory(values.id ? 'put' : 'post', url, formData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: values.id ? 'Data updated successfully' : 'Data saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        fetchData();
        setBusinessPremises((prev) => ({
      ...prev,
      status: 'in progress'
    }));
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data?.data || 'Something went wrong'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const {
    values,
    setValues,
    setFieldValue,
    handleChange,
    errors,
    touched,
    handleSubmit,
    handleBlur
  } = formik;

  useEffect(() => {
    fetchData();
  }, [businessPremises?.id, additionalSpace]);


    const fetchData = async () => {
      if (businessPremises?.id && additionalSpace === 'yes') {
        const url = `/labourlicense/additional-space/view?business_location_proofs=${businessPremises.id}`;
        const { res } = await Factory('get', url);
        if (res.status_cd === 0 && res.data) {
          setValues({
            addressLine1: res?.data[0]?.address?.address_line1 || '',
            addressLine2: res?.data[0]?.address?.address_line2 || '',
            city: res?.data[0]?.address?.city || '',
            district: res?.data[0]?.address?.district || '',
            state: res?.data[0]?.address?.state || '',
            pincode: res?.data[0]?.address?.pincode || '',
            nature_of_possession: res?.data[0]?.nature_of_possession || '',
            address_proof_additional: res?.data[0]?.address_proof || null,
            rental_agreement_additional: res?.data[0]?.rental_agreement || null,
            id: res?.data[0]?.id
          });
        }
      }
    };

    const fetchAdditionalSpace = async () => {
      if (!businessPremises?.service_request) return;

      const url = `/labourlicense/business-location/by-request-or-task?service_request_id=${businessPremises.service_request}`;
      const { res } = await Factory('get', url);

      if (res.status_cd === 0 && res.data) {
        const data = res.data;
        setAdditionalSpace(data.additional_space || null);
        seWorkPlace(data?.workplace || null);


      }
    };

  useEffect(() => {
    fetchAdditionalSpace();
  }, [businessPremises?.service_request]);

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return field.name === 'state' || field.name === 'nature_of_possession' ? (
          <>
            <Typography variant="subtitle1" mb={1}>
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
                  sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'grey.600'
              }
            }}
                />
              )}
            />
          </>
        ) : (
          <>
            <Typography variant="subtitle1" mb={1}>
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
      case 'file':
        return (
          <>
            <Typography variant="subtitle1" mb={1}>
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
  return (
    <Box>
    <Card sx={{ p: 3, mt: 3 }}>
      <Grid2 container spacing={2}>
      <Grid2 item xs={12}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography fontWeight={600}>Additional place of business?</Typography>
          <FormGroup row>
          <FormControlLabel
    label="Yes"
    control={
      <Radio
        checked={additionalSpace === 'yes'}
        onChange={async () => {
          setAdditionalSpace('yes');

          const url = businessPremises.id
            ? `/labourlicense/business-location/${businessPremises.id}/`
            : `/labourlicense/business-location/`;

          const method = businessPremises.id ? 'put' : 'post';

          const payload = {
            // ...businessPremises,
            additional_space: 'yes',
            workplace: values.workplace || '',
            status: 'in progress'
          };

          const { res } = await Factory(method, url, payload);

          if (res.status_cd === 0) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Updated additional space to Yes',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
            setBusinessPremises((prev) => ({
    ...prev,
    additional_space: 'yes',
    workplace: values.workplace || '',
    status: 'in progress'
  }));
          }
        }}
      />
    }
  />

  <FormControlLabel
  label="No"
  control={
    <Radio
      checked={additionalSpace === 'no'}
      onChange={async () => {
        // Step 1: Delete additional space if it exists
        if (values.id) {
          const deleteUrl = `/labourlicense/additional-space/${values.id}/`;
          const deleteRes = await Factory('delete', deleteUrl);
          if (deleteRes.res.status_cd === 0) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Additional Place of Business deleted successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Failed to delete additional space',
                variant: 'alert',
                alert: { color: 'error' },
                close: false
              })
            );
            return;
          }
        }

        // Step 2: Update the business location to set additional_space: 'no'
        setAdditionalSpace('no');

        const url = businessPremises.id
          ? `/labourlicense/business-location/${businessPremises.id}/`
          : `/labourlicense/business-location/`;

        const method = businessPremises.id ? 'put' : 'post';

        const payload = {
          additional_space: 'no',
          status: 'in progress'
        };

        const { res } = await Factory(method, url, payload);

        if (res.status_cd === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Updated additional space to No',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
            setBusinessPremises((prev) => ({
    ...prev,
    additional_space: 'no',
    workplace: null,
    status: 'in progress'
  }));
          clearFormFields();
          seWorkPlace(null);
          fetchData();
        }
      }}
    />
  }
/>
</FormGroup>
          </Box>
        </Grid2>
        {console.log(additionalSpace)}
        {additionalSpace === 'yes' && (
          
          <Grid2 item xs={12}>
            <form onSubmit={handleSubmit}>

          {additionalSpace === 'yes' && (
            <Grid2 item xs={12} sm={6} md={4} sx={{ mt: 1 }}>
              <Autocomplete
                size="small"
                fullWidth
                options={['Office', 'Godown', 'Warehouse']}
                value={values.workplace || workplace || ''}
                onChange={async (_, value) => {
                  setFieldValue('workplace', value);
                  seWorkPlace(value);


                  if (value && businessPremises?.id) {
                    const url = `/labourlicense/business-location/${businessPremises.id}/`;
                    const payload = {
                      additional_space: 'yes',
                      workplace: value
                    };

                    const { res } = await Factory('put', url, payload);

                    if (res.status_cd === 0) {
                      dispatch(
                        openSnackbar({
                          open: true,
                          message: 'Workplace updated successfully!',
                          variant: 'alert',
                          alert: { color: 'success' },
                          close: false
                        })
                      );
                      setBusinessPremises((prev) => ({
    ...prev,
    workplace: value,
    additional_space: 'yes',
    status: 'in progress'
  }));

                    fetchAdditionalSpace();
                    } else {
                      dispatch(
                        openSnackbar({
                          open: true,
                          message: 'Failed to update workplace',
                          variant: 'alert',
                          alert: { color: 'error' },
                          close: false
                        })
                      );
                    }
                  }
                }}
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
          )}

              <Grid2 container spacing={2}>
                

                {additionalFields.map((field) => (
                  <Grid2 key={field.name} item xs={12} sm={6} md={4} sx={{mt:1}}>
                    
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
          </Grid2>
        )}
      </Grid2>
    </Card>
     <Box mt={2} display="flex" justifyContent="flex-end" sx={{mr:15}}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3}> 
      
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
      />
      </Stack>
    </Box>
    </Box>
  );
};

export default AdditionalPlaceOfBusiness;
