import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { Autocomplete, Button, Card, Grid2, Stack, TextField, Typography } from '@mui/material';

export default function AdditionalPlaceOfBusiness({ businessPremises }) {
  const dispatch = useDispatch();
  let additionalFields = [
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
      rental_agreement_additional: null
    },
    validationSchema: Yup.object({
      addressLine1: Yup.string().required('Address Line 1 is required'),
      addressLine2: Yup.string().required('Address Line 2 is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.number().required('Pincode is required'),
      nature_of_possession: Yup.string().required('Nature of possession is required'),
      address_proof_additional: Yup.mixed().required('Address proof is required'),
      rental_agreement_additional: Yup.mixed().required('Rental Agreement/NOC is required')
    }),
    onSubmit: async (values) => {
      let url = values.id ? `/labourlicense/additional-space/${values.id}/` : `/labourlicense/additional-space/`;
      let formData = new FormData();
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
        const getAdditionalPremises = async () => {
          if (!businessPremises?.id) return;
          const url = `/labourlicense/additional-space/view?business_location_proofs=${businessPremises.id}`;
          const { res } = await Factory('get', url);
          if (res.status_cd === 0 && res.data) {
            setValues({
              addressLine1: res.data[0].address.address_line1 || '',
              addressLine2: res.data[0].address.address_line2 || '',
              city: res.data[0].address.city || '',
              district: res.data[0].address.district || '',
              state: res.data[0].address.state || '',
              pincode: res.data[0].address.pincode || '',
              nature_of_possession: res.data[0].nature_of_possession || '',
              address_proof_additional: res.data[0].address_proof || null,
              rental_agreement_additional: res.data[0].rental_agreement || null,
              id: res.data[0].id
            });
          }
        };
        getAdditionalPremises();
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
  const { values, setValues, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;
  useEffect(() => {
    const getAdditionalPremises = async () => {
      if (!businessPremises?.id) return; // Don't fetch if we don't have the main business location ID

      const url = `/labourlicense/additional-space/view?business_location_proofs=${businessPremises.id}`;
      const { res } = await Factory('get', url);
      if (res.status_cd === 0 && res.data) {
        setValues({
          addressLine1: res.data[0].address.address_line1 || '',
          addressLine2: res.data[0].address.address_line2 || '',
          city: res.data[0].address.city || '',
          district: res.data[0].address.district || '',
          state: res.data[0].address.state || '',
          pincode: res.data[0].address.pincode || '',
          nature_of_possession: res.data[0].nature_of_possession || '',
          address_proof_additional: res.data[0].address_proof || null,
          rental_agreement_additional: res.data[0].rental_agreement || null,
          id: res.data[0].id
        });
      }
    };

    if (businessPremises?.additional_space === 'yes') {
      getAdditionalPremises();
    }
  }, [businessPremises?.additional_space, businessPremises?.id]);
  return (
    <Card sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6">Additional Place of Business</Typography>

      {businessPremises?.additional_space === 'yes' && (
        <Grid2 size={12} mt={2}>
          <Typography variant="h4" fontWeight={700} mb={0}>
            Additional place of business
          </Typography>
          <Grid2 container spacing={2}>
            {additionalFields.map((field) =>
              field.name !== 'bankStatement' ? (
                <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                  {renderField(field, formik)}
                </Grid2>
              ) : null
            )}
          </Grid2>
          <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
              </Button>
            </Stack>
          </Grid2>
        </Grid2>
      )}
    </Card>
  );
}
