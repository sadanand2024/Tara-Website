import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid2,
  Select,
  MenuItem,
  Autocomplete,
  Button,
  Radio,
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
      label: 'Trade Area',
      name: 'trade_area',
      type: 'text'
    },
    {
      label: 'Road Type',
      name: 'road_type',
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
      trade_area: '',
      road_type: '',
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
      trade_area: Yup.string().required('Trade Area is required'),
      road_type: Yup.string().required('Road Type is required'),
      address_proof: Yup.mixed().required('Address proof is required'),
      rental_agreement: Yup.mixed().required('Rental Agreement/NOC is required'),
      // bankStatement: Yup.mixed().required('Bank Statement/Cancelled Cheque is required'),
      additional_space: Yup.string().required('Please select if you have additional space'),
      workplace: Yup.string().when('additional_space', {
        is: (val) => val === 'yes',
        then: () => Yup.string().required('Workplace is required'),
        otherwise: () => Yup.string().notRequired()
      })
    }),
    onSubmit: async (values) => {
      let url = businessPremises.id ? `/tradelicense/business-location/${businessPremises.id}/` : `/tradelicense/business-location/`;
      let formData = new FormData();
      formData.append('service_request', 25);
      formData.append('service_task', 14);
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
      formData.append('additional_space', values.additional_space);
      formData.append('workplace', values.workplace);
      formData.append('trade_area', values.trade_area);
      formData.append('road_type', values.road_type);
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
      trade_area: '',
      road_type: '',
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
      let url = values.id ? `/tradelicense/additional-space/${values.id}/` : `/tradelicense/additional-space/`;
      let formData = new FormData();
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
        const getAdditionalPremises = async () => {
          if (!businessPremises?.id) return;
          const url = `/tradelicense/additional-space/${businessPremises.id}/`;
          const { res } = await Factory('get', url);
          if (res.status_cd === 0 && res.data) {
            formik2.setValues({
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
    const url = `/tradelicense/business-location/by-request-or-task?service_request_id=25`;
    const { res } = await Factory('get', url);
    console.log(res);
    if (res.status_cd === 0 && res.data) {
      const data = res.data;
      formik.setValues({
        addressLine1: data.address?.address_line1 || '',
        addressLine2: data.address?.address_line2 || '',
        city: data.address?.city || '',
        district: data.address?.district || '',
        state: data.address?.state || '',
        pincode: data.address?.pincode || '',
        nature_of_possession: data.nature_of_possession || '',
        trade_area: data.trade_area || '',
        road_type: data.road_type || '',
        trade_premises: data.trade_premises || '',
        trade_description: data.trade_description || '',
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
        return field.name === 'state' || field.name === 'nature_of_possession' || field.name === 'road_type' ? (
          <>
            <Typography color="text.secondary" fontWeight={500} mb={1}>
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
              type={field.name === 'pincode' ? 'number' : 'text'}
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

      const url = `/tradelicense/additional-space/${businessPremises.id}/`;
      const { res } = await Factory('get', url);
      if (res.status_cd === 0 && res.data) {
        formik2.setValues({
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
    };

    if (businessPremises?.additional_space === 'yes') {
      getAdditionalPremises();
    }
  }, [businessPremises?.additional_space, businessPremises?.id]);

  return (
    <Box mt={4}>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <Typography variant="h4" fontWeight={700} mb={0}>
              Business premises, location & proofs
            </Typography>
          </Grid2>
          {[
            { label: 'Trade Premises', name: 'trade_premises', type: 'text' },
            { label: 'Trade Description', name: 'trade_description', type: 'text' }
          ].map((field) => (
            <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
              {renderField(field, formik)}
            </Grid2>
          ))}
          <Grid2 size={12}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={700} mb={0}>
              Principal place of business
            </Typography>
          </Grid2>
          {mainFields.map((field) => (
            <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
              {renderField(field, formik)}
            </Grid2>
          ))}

          <Grid2 size={12}>
            <br />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography>Additional place of business?</Typography>
              <FormGroup row>
                <FormControlLabel
                  label="Yes"
                  control={
                    <Radio
                      checked={values.additional_space === 'yes'}
                      onChange={() => {
                        setFieldValue('additional_space', 'yes');
                        setBusinessPremises((prev) => ({ ...prev, additional_space: 'yes' }));
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label="No"
                  control={
                    <Radio
                      checked={values.additional_space === 'no'}
                      onChange={() => {
                        setFieldValue('additional_space', 'no');
                        setBusinessPremises((prev) => ({ ...prev, additional_space: 'no' }));
                      }}
                    />
                  }
                />
              </FormGroup>
            </Box>
          </Grid2>

          <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Grid2>
        </Grid2>
        {businessPremises?.additional_space === 'yes' && (
          <Grid2 size={12}>
            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                <Typography variant="h4" fontWeight={700} mb={0}>
                  Additional place of business
                </Typography>
              </Grid2>
              {additionalFields.map((field) =>
                field.name !== 'bankStatement' ? (
                  <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                    {renderField(field, formik2)}
                  </Grid2>
                ) : null
              )}
              <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleSubmit2}>
                  Save
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
        )}
      </form>
    </Box>
  );
};

export default BusinessPremisesSection;
