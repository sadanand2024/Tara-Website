import {
    Autocomplete,
    Box,
    Button,
    Card,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import * as Yup from 'yup';

const PrincipleOfBusiness = () => {
  const [prinicipalBusiness, setprinicipalBusiness] = useState({
    id: null,
  });
  const dispatch = useDispatch();

  let mainFields = [
    {
      label: 'pincode ',
      name: 'pincode',
      type: 'text'
    },
    {
      label: 'State',
      name: 'state',
      type: 'text'
    },
    {
      label: 'District',
      name: 'district',
      type: 'text'
    },
    {
      label: 'City/Town/Village',
      name: 'city',
      type: 'text'
    },
    {
      label: 'Road/Street/Locality',
      name: 'road_street_locality',
      type: 'text'
    },
    {
      label: 'Building/PlatNo',
      name: 'building_flat_no',
      type: 'text'
    },
    {
      label: 'Latitude',
      name: 'latitude',
      type: 'text'
    },
    {
      label: 'Longitude',
      name: 'longitude',
      type: 'text'
    },
    {
      label: 'Nature of Possession of Premises',
      name: 'nature_of_possession_of_premise',
      type: 'text'
    },
    {
      label: 'Address Proof',
      name: 'address_proof',
      type: 'text'
    },
    {
      label: 'Upload Address Proof',
      name: 'address_proof_file',
      type: 'file'
    },
    {
      label: 'Rental Agreement/NOC',
      name: 'rental_agreement_or_noc',
      type: 'file'
    },
    {
      label: 'Upload Bank Statement/Cancelled Cheque',
      name: 'bank_statement_or_cancelled_cheque',
      type: 'file'
    }
  ];

  const formik = useFormik({
    initialValues: {
      pincode: '',
      state: '',
      district: '',
      city: '',
      road_street_locality: '',
      building_flat_no: '',
      latitude: '',
      longitude: '',
      nature_of_possession_of_premise: '',
      address_proof: '',
      address_proof_file: null,
      rental_agreement_or_noc: null,
      bank_statement_or_cancelled_cheque: null,
    },
    validationSchema: Yup.object({
      pincode: Yup.number().required('Pincode is required'),
      state: Yup.string().required('State is required'),
      city: Yup.string().required('City is required'),
      district: Yup.string().required('District is required'),
      road_street_locality: Yup.string().required('Road/Street/Locality is required'),
      building_flat_no: Yup.string().required('Building/Flat No is required'),
      latitude: Yup.string().required('Latitude is required'),
      longitude: Yup.string().required('Longitude is required'),
      nature_of_possession_of_premise: Yup.string().required('Nature of possession of premises is required'),
      address_proof: Yup.string().required('Address proof is required'),
      address_proof_file: Yup.mixed().required('Address Proof file is required'),
    }),
    onSubmit: async (values) => {
      try {
        let url = prinicipalBusiness.id ? `/gst/principal-place-details/${prinicipalBusiness.id}/` : `/gst/principal-place-details/`;
        let formData = new FormData();
        formData.append('service_request', 32);
        formData.append('service_task', 68);
        formData.append(
          'principal_place',
          JSON.stringify({
            pincode: values.pincode,
            state: values.state,
            district: values.district,
            city: values.city,
            road_street_locality: values.road_street_locality,
            building_flat_no: values.building_flat_no,
            latitude: values.latitude,
            longitude: values.longitude,
          })
        );
        formData.append('nature_of_possession_of_premise', values.nature_of_possession_of_premise);
        formData.append('address_proof', values.address_proof);
        formData.append('status', 'in progress');

        if (values.address_proof_file && typeof values.address_proof_file !== 'string') {
          formData.append('address_proof_file', values.address_proof_file);
        }
        if (values.rental_agreement_or_noc && typeof values.rental_agreement_or_noc !== 'string') {
          formData.append('rental_agreement_or_noc', values.rental_agreement_or_noc);
        }
        if (values.bank_statement_or_cancelled_cheque && typeof values.bank_statement_or_cancelled_cheque !== 'string') {
          formData.append('bank_statement_or_cancelled_cheque', values.bank_statement_or_cancelled_cheque);
        }

        const { res } = await Factory(prinicipalBusiness.id ? 'put' : 'post', url, formData);
        // console.log('API Response:', res);
        
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
              message: prinicipalBusiness.id ? 'Data Updated Successfully' : 'Data Saved Successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          getprinicipalBusiness();
        }
      } catch (error) {
        console.error('Submit error:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'An error occurred while saving data',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const getprinicipalBusiness = async () => {
    const url = `/gst/principal-place-details/by-service-request/?service_request_id=32`;
    const { res } = await Factory('get', url, {});
   
    if (res.status_cd === 0 && res.data) {
      const data = res.data;
      formik.setValues({
        pincode: data.principal_place?.pincode || '',
        state: data.principal_place?.state || '',
        district: data.principal_place?.district || '',
        city: data.principal_place?.city || '',
        road_street_locality: data.principal_place?.road_street_locality || '',
        building_flat_no: data.principal_place?.building_flat_no || '',
        latitude: data.principal_place?.latitude || '',
        longitude: data.principal_place?.longitude || '',
        nature_of_possession_of_premise: data.nature_of_possession_of_premise || '',
        address_proof: data.address_proof || '',
        address_proof_file: data.address_proof_file || null,
        rental_agreement_or_noc: data.rental_agreement_or_noc || null,
        bank_statement_or_cancelled_cheque: data.bank_statement_or_cancelled_cheque || null,
      });
      setprinicipalBusiness({
        ...data,
        id: data.id
      });
    }
  };

  const renderField = (field, formikContext) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikContext;

    switch (field.type) {
      case 'text':
        return ['nature_of_possession_of_premise', 'address_proof', 'state'].includes(field.name) ? (
          <>
            <Typography color="text.secondary" fontWeight={500} mb={1}>
              {field.label}
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={
                field.name === 'nature_of_possession_of_premise'
                  ? ['own', 'rented', 'leased']
                  : field.name === 'address_proof'
                  ? ['Electricity Bill', 'Property tax receipt', 'Lease Deed/Rental Agreement']
                  : indian_States_And_UTs
              }
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

  useEffect(() => {
    getprinicipalBusiness();
  }, []);

  return (
    <Box mt={4}>
      <Card sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <Typography variant="h4" fontWeight={700}>
                Details of Principal Place of Business
              </Typography>
            </Grid2>

            {mainFields.map((field) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
                {renderField(field, formik)}
              </Grid2>
            ))}

            <Grid2 size={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button variant="contained" color="primary" type="submit">
                  {prinicipalBusiness.id ? 'Update' : 'Save'}
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Card>
    </Box>
  );
};

export default PrincipleOfBusiness;
