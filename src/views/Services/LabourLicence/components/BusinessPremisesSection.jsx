import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid2,
  Select,
  MenuItem,
  Card,
  Autocomplete,
  Button,
  Radio,
  Stack,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';

const BusinessPremisesSection = () => {
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
      additional_space: Yup.string().required('Please select if you have additional space'),
      workplace: Yup.string().when('additional_space', {
        is: (val) => val === 'yes',
        then: () => Yup.string().required('Workplace is required'),
        otherwise: () => Yup.string().notRequired()
      })
    }),
    onSubmit: async (values) => {
      let url = businessPremises.id ? `/labourlicense/business-location/${businessPremises.id}/` : `/labourlicense/business-location/`;
      let formData = new FormData();
      formData.append('service_request', 24);
      formData.append('service_task', 8);
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
      formData.append('additional_space', values.additional_space);
      formData.append('workplace', values.workplace);
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
  const formik2 = useFormik({
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
            formik2.setValues({
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
  const getBusinessPremises = async () => {
    const url = `/labourlicense/business-location/by-request-or-task?service_request_id=24`;
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
        additional_space: data.additional_space || 'no',
        workplace: data.workplace && data.workplace !== 'null' ? data.workplace : ''
      });
      setBusinessPremises({
        ...data,
        additional_space: data.additional_space || 'no'
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
  const {
    values: values2,
    setFieldValue: setFieldValue2,
    handleChange: handleChange2,
    errors: errors2,
    touched: touched2,
    handleSubmit: handleSubmit2,
    handleBlur: handleBlur2
  } = formik2;
  useEffect(() => {
    getBusinessPremises();
  }, []);

  useEffect(() => {
    const getAdditionalPremises = async () => {
      if (!businessPremises?.id) return; // Don't fetch if we don't have the main business location ID

      const url = `/labourlicense/additional-space/view?business_location_proofs=${businessPremises.id}`;
      const { res } = await Factory('get', url);
      if (res.status_cd === 0 && res.data) {
        formik2.setValues({
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
    <Box mt={4}>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {/* First Card: Principal place of business */}
          <Grid2 size={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h4" fontWeight={700} mb={0}>
                Business premises, location & proofs
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={700} mb={0}>
                Principal place of business
              </Typography>
              <Grid2 container spacing={2}>
                {mainFields.map((field) => (
                  <Grid2 key={field.name} xs={12} sm={6} md={4}>
                    {renderField(field, formik)}
                  </Grid2>
                ))}
              </Grid2>
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <Typography>Additional place of business?</Typography>
                <FormGroup row>
                  <FormControlLabel
                    label="Yes"
                    control={
                      <Radio
                        checked={businessPremises?.additional_space === 'yes'}
                        onChange={() => setBusinessPremises((prev) => ({ ...prev, additional_space: 'yes' }))}
                      />
                    }
                  />
                  <FormControlLabel
                    label="No"
                    control={
                      <Radio
                        checked={businessPremises?.additional_space === 'no'}
                        onChange={() => setBusinessPremises((prev) => ({ ...prev, additional_space: 'no' }))}
                      />
                    }
                  />
                </FormGroup>
              </Box>
              {businessPremises?.additional_space === 'yes' && (
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Office', 'Godown', 'Warehouse']}
                  value={values.workplace || ''}
                  onChange={(e, value) => setFieldValue('workplace', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Workplace"
                      size="small"
                      error={touched.workplace && Boolean(errors.workplace)}
                      helperText={touched.workplace && errors.workplace}
                    />
                  )}
                  sx={{ minWidth: 180, ml: 2 }}
                />
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Send for review
                </Button>
              </Stack>
            </Card>
          </Grid2>

          {/* Second Card: Additional place of business */}
          {businessPremises?.additional_space === 'yes' && (
            <Grid2 size={12} mt={2}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h4" fontWeight={700} mb={0}>
                  Additional place of business
                </Typography>
                <Grid2 container spacing={2}>
                  {additionalFields.map((field) =>
                    field.name !== 'bankStatement' ? (
                      <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                        {renderField(field, formik2)}
                      </Grid2>
                    ) : null
                  )}
                </Grid2>
                <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit2}>
                      Save
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit2}>
                      Send for review
                    </Button>
                  </Stack>
                </Grid2>
              </Card>
            </Grid2>
          )}
        </Grid2>
      </form>
    </Box>
  );
};

export default BusinessPremisesSection;
