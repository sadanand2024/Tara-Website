import React, { useEffect } from 'react';
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
  const dispatch = useDispatch();
  let fields = [
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
      name: 'natureOfPossession',
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
      natureOfPossession: '',
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
      pincode: Yup.string().required('Pincode is required'),
      natureOfPossession: Yup.string().required('Nature of possession is required'),
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
      let url = values.id ? `/labourlicense/business-location/${values.id}/` : `/labourlicense/business-location/`;
      let formData = new FormData();
      formData.append('service_request', 24);
      formData.append('service_task', 8);
      formData.append(
        'principal_place_of_business',
        JSON.stringify({
          line1: values.addressLine1,
          line2: values.addressLine2,
          city: values.city,
          state: values.state,
          pincode: values.pincode
        })
      );
      formData.append('nature_of_possession', values.natureOfPossession);
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
      natureOfPossession: '',
      address_proof: null,
      rental_agreement: null,
      bankStatement: null,
      additional_space: 'no'
    },
    validationSchema: Yup.object({
      addressLine1: Yup.string().required('Address Line 1 is required'),
      addressLine2: Yup.string().required('Address Line 2 is required'),
      city: Yup.string().required('City is required'),
      // district: Yup.string().required('District is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string().required('Pincode is required'),
      natureOfPossession: Yup.string().required('Nature of possession is required'),
      address_proof: Yup.mixed().required('Address proof is required'),
      rental_agreement: Yup.mixed().required('Rental Agreement/NOC is required'),
      bankStatement: Yup.mixed().required('Bank Statement/Cancelled Cheque is required')
    }),
    onSubmit: async (values) => {
      let url = values.id ? `/labourlicense/additional-business-location/${values.id}/` : `/labourlicense/additional-business-location/`;
      let formData = new FormData();
      formData.append('service_request', 24);
      formData.append('service_task', 8);
      formData.append('line1', values.addressLine1);
      formData.append('line2', values.addressLine2);
      formData.append('city', values.city);
      formData.append('district', values.district);
      formData.append('state', values.state);
      formData.append('pincode', values.pincode);
      formData.append('nature_of_possession', values.natureOfPossession);
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
    const url = `/labourlicense/business-location/by-request-or-task?service_request_id=24`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0 && res.data) {
      const data = res.data;
      formik.setValues({
        addressLine1: data.principal_place_of_business?.line1 || '',
        addressLine2: data.principal_place_of_business?.line2 || '',
        city: data.principal_place_of_business?.city || '',
        district: data.principal_place_of_business?.district || '',
        state: data.principal_place_of_business?.state || '',
        pincode: data.principal_place_of_business?.pincode || '',
        natureOfPossession: data.nature_of_possession || '',
        address_proof: data.address_proof || null,
        rental_agreement: data.rental_agreement || null,
        bankStatement: data.bank_statement || null,
        additional_space: data.additional_space || 'no',
        workplace: data.workplace && data.workplace !== 'null' ? data.workplace : '',
        id: data.id
      });
    }
  };
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return field.name === 'state' ? (
          <Autocomplete
            fullWidth
            size="small"
            options={indian_States_And_UTs}
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
        ) : (
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
        );
      case 'file':
        return (
          <RenderFileUpload
            label={field.label}
            fieldName={field.name}
            file={values[field.name]}
            setFieldValue={setFieldValue}
            touched={touched[field.name]}
            errors={errors[field.name]}
          />
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
      const url = `/labourlicense/additional-space/${values.id}/`;
      const { res } = await Factory('get', url);
      console.log(res);
      if (res.status_cd === 0 && res.data) {
        formik2.setValues({
          addressLine1: res.data.line1 || '',
          addressLine2: res.data.line2 || '',
          city: res.data.city || '',
          district: res.data.district || '',
          state: res.data.state || '',
          pincode: res.data.pincode || '',
          natureOfPossession: res.data.nature_of_possession || '',
          address_proof: res.data.address_proof || null,
          rental_agreement: res.data.rental_agreement || null,
          bankStatement: res.data.bank_statement || null,
          additional_space: res.data.additional_space || 'no',
          workplace: res.data.workplace && res.data.workplace !== 'null' ? res.data.workplace : '',
          id: res.data.id
        });
      }
    };
    if (values.additional_space === 'yes') {
      getAdditionalPremises();
    }
  }, [values.additional_space]);

  return (
    <Box mt={4}>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <Typography variant="h4" fontWeight={700} mb={0}>
              Business premises, location & proofs
            </Typography>
          </Grid2>
          <Grid2 size={12}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={700} mb={0}>
              Principal place of business
            </Typography>
          </Grid2>
          {fields.map((field) => (
            <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography color="text.secondary" fontWeight={500} mb={1}>
                {field.label}
              </Typography>
              {renderField(field)}
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
                  control={<Radio checked={values.additional_space === 'yes'} onChange={() => setFieldValue('additional_space', 'yes')} />}
                />
                <FormControlLabel
                  label="No"
                  control={<Radio checked={values.additional_space === 'no'} onChange={() => setFieldValue('additional_space', 'no')} />}
                />
              </FormGroup>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            {values.additional_space === 'yes' && (
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
          </Grid2>
          <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Grid2>
        </Grid2>
        {values.additional_space === 'yes' && (
          <Grid2 size={12}>
            <form onSubmit={handleSubmit2}>
              <Grid2 container spacing={2}>
                <Grid2 size={12}>
                  <Typography variant="h4" fontWeight={700} mb={0}>
                    Additional place of business
                  </Typography>
                </Grid2>
                {fields.map((field) => (
                  <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                    {renderField(field)}
                  </Grid2>
                ))}
              </Grid2>
              <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </Grid2>
            </form>
          </Grid2>
        )}
      </form>
    </Box>
  );
};

export default BusinessPremisesSection;
