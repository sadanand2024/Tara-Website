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
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import * as Yup from 'yup';
import GetActionButtons from '../../FormHelpers';


const additionalFields = [
  { label: 'Address Line 1', name: 'addressLine1', type: 'text' },
  { label: 'Address Line 2', name: 'addressLine2', type: 'text' },
  { label: 'City', name: 'city', type: 'text' },
  { label: 'District', name: 'district', type: 'text' },
  { label: 'State', name: 'state', type: 'text' },
  { label: 'Pincode', name: 'pincode', type: 'text' },
  { label: 'Nature of possession', name: 'nature_of_possession', type: 'text' },
  { label: 'Address proof (Additional)', name: 'address_proof_additional', type: 'file' },
  { label: 'Rental Agreement/NOC (Additional)', name: 'rental_agreement_additional', type: 'file' }
];

const AdditionalPlaceOfBusiness = ({ businessPremises, setBusinessPremises, taskId = null }) => {
    const service_id = businessPremises?.service_request;

  const dispatch = useDispatch();
  const [additionalSpace, setAdditionalSpace] = useState(businessPremises?.additional_space || null);

  const formik = useFormik({
    initialValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      nature_of_possession: '',
      trade_area: '',
      road_type: '',
      address_proof_additional: null,
      rental_agreement_additional: null,
      id: null
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
      const url = values.id
        ? `/tradelicense/additional-space/${values.id}/`
        : `/tradelicense/additional-space/`;

      const formData = new FormData();
      formData.append('business_locations', businessPremises.id);
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

  const clearFormFields = () => {
    setValues({
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      nature_of_possession: '',
      trade_area: '',
      road_type: '',
      address_proof_additional: null,
      rental_agreement_additional: null,
      id: null
    });
  };

  const fetchData = async () => {
    if (businessPremises?.id && additionalSpace === true) {
      const url = `/tradelicense/additional-space/${businessPremises.id}/`;
      const { res } = await Factory('get', url);
      if (res.status_cd === 0 && res.data) {
        setValues({
          addressLine1: res.data.address.address_line1 || '',
          addressLine2: res.data.address.address_line2 || '',
          city: res.data.address.city || '',
          district: res.data.address.district || '',
          state: res.data.address.state || '',
          pincode: res.data.address.pincode || '',
          nature_of_possession: res.data.nature_of_possession || '',
          trade_area: res.data.trade_area || '',
          road_type: res.data.road_type || '',
          address_proof_additional: res.data.address_proof || null,
          rental_agreement_additional: res.data.rental_agreement || null,
          id: res.data.id
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessPremises?.id, additionalSpace]);

  useEffect(() => {
  const fetchAdditionalSpace = async () => {
    if (!businessPremises?.service_request) return;

    const url = `/tradelicense/business-location/by-request-or-task?service_request_id=${businessPremises.service_request}`;
    const { res } = await Factory('get', url);

    if (res.status_cd === 0 && res.data) {
      const data = res.data;
      setAdditionalSpace(data.additional_space || null);
    }
  };

  fetchAdditionalSpace();
}, [businessPremises?.service_request]);

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return field.name === 'state' || field.name === 'nature_of_possession' || field.name === 'road_type' ? (
          <>
            <Typography variant="subtitle1" mb={1}>
              {field.label}
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={
                field.name === 'state'
                  ? indian_States_And_UTs
                  : field.name === 'nature_of_possession'
                  ? ['Self Owned', 'Rented', 'Leased']
                  : ['Single lane', 'Double lane', 'More than 2 lanes']
              }
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
              // type={field.name === 'pincode' ? 'number' : 'text'}
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
        checked={additionalSpace === true}
        onChange={async () => {
          setAdditionalSpace(true);

          const url = businessPremises.id
            ? `/tradelicense/business-location/${businessPremises.id}/`
            : `/tradelicense/business-location/`;

          const method = businessPremises.id ? 'put' : 'post';

          const payload = {
            // ...businessPremises,
            additional_space: true
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
      additional_space: true,
      status: 'in progress'
    }));
            fetchData();
          }
        }}
      />
    }
  />
 
  <FormControlLabel
  label="No"
  control={
    <Radio
      checked={additionalSpace === false}
      onChange={async () => {
        // Step 1: Delete additional space if it exists
        if (values.id) {
          const deleteUrl = `/tradelicense/additional-space/${values.id}/`;
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
        setAdditionalSpace(false);

        const url = businessPremises.id
          ? `/tradelicense/business-location/${businessPremises.id}/`
          : `/tradelicense/business-location/`;

        const method = businessPremises.id ? 'put' : 'post';

        const payload = {
          additional_space: false
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
              additional_space: false,
              status: 'in progress'
  }));
          clearFormFields();
          fetchData()
        }
      }}
    />
  }
/>
</FormGroup>
          </Box>
        </Grid2>

        {additionalSpace === true && (
          <Grid2 item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid2 container spacing={2}>
                {additionalFields.map((field) => (
                  <Grid2 key={field.name} item xs={12} sm={6} md={4}>
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
    <Box mt={2} display="flex" justifyContent="flex-end">
  <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3} sx={{mr:14}}> 
        <GetActionButtons
                  type="put"
                  urlEndpoint="business-location"
                  recId={businessPremises.id}
                  status={businessPremises.status}
                  data={businessPremises}
                  service_request={service_id}
                  task_id={taskId}
                  urlKey="tradelicense"
                  urlBool={true}
                />
</Stack>
  
    </Box>
  </Box>
  );
};

export default AdditionalPlaceOfBusiness;
