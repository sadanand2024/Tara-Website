import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Grid2, Button, FormControlLabel, Checkbox } from '@mui/material';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
const fields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text'
  },
  {
    label: 'Designation',
    name: 'designation',
    type: 'text'
  },
  {
    label: 'Mobile Number',
    name: 'mobile_number',
    type: 'text'
  },
  {
    label: 'Email',
    name: 'email',
    type: 'text'
  },
  {
    label: 'Aadhaar Image',
    name: 'aadhaar_image',
    type: 'file'
  },
  {
    label: 'PAN Image',
    name: 'pan_image',
    type: 'file'
  },
  {
    label: 'Photo',
    name: 'passport_photo',
    type: 'file'
  }
];
const ApplicantDetails = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      designation: '',
      aadhaar_image: '',
      pan_image: '',
      passport_photo: '',
      address: '',
      residential_address: 'no'
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required')
    }),
    onSubmit: async (values) => {
      console.log(values);
      let formData = new FormData();
      formData.append('service_request', 25);
      formData.append('service_task', 12);
      formData.append('name', values.name);
      formData.append('designation', values.designation);
      formData.append('mobile_number', values.mobile_number);
      formData.append('email', values.email);
      formData.append('status', 'in progress');
      if (values.aadhaar_image && typeof values.aadhaar_image !== 'string') {
        formData.append('aadhaar_image', values.aadhaar_image);
      }
      if (values.pan_image && typeof values.pan_image !== 'string') {
        formData.append('pan_image', values.pan_image);
      }
      if (values.passport_photo && typeof values.passport_photo !== 'string') {
        formData.append('passport_photo', values.passport_photo);
      }
      formData.append('address', values.address);
      formData.append('residential_address', values.residential_address);

      let url = values.id ? `/tradelicense/applicant-details/${values.id}/` : `/tradelicense/applicant-details/`;

      const { res } = await Factory(values.id ? 'put' : 'post', url, formData);
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
            message: values.id ? 'Data updated successfully' : 'Data saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getApplicantDetails();
      }
    }
  });
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            name={field.name}
            type={field.name === 'mobile_number' ? 'number' : 'text'}
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
    }
  };
  const handleCheckboxChange = (event) => {
    setFieldValue('residential_address', event.target.checked ? 'yes' : 'no');
    if (event.target.checked) {
      setFieldValue('address', '');
    }
  };
  const getApplicantDetails = async () => {
    let url = `/tradelicense/applicant-details/by-request-or-task?service_request_id=25`;
    const { res } = await Factory('get', url);
    console.log(res);
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data) || 'Something went wrong'
        })
      );
    } else {
      formik.setValues({
        ...res.data,
        aadhaar_image: res.data.aadhaar_image ? res.data.aadhaar_image : '',
        pan_image: res.data.pan_image ? res.data.pan_image : '',
        passport_photo: res.data.passport_photo ? res.data.passport_photo : ''
      });
    }
  };
  useEffect(() => {
    getApplicantDetails();
  }, []);
  const { values, handleChange, handleBlur, setFieldValue, touched, errors, handleSubmit } = formik;
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        <span style={{ textDecoration: 'underline' }}>Applicant Details</span>
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {fields.map((field) => (
            <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography color="text.secondary" fontWeight={500} mb={1}>
                {field.label}
              </Typography>
              {renderField(field)}
            </Grid2>
          ))}
        </Grid2>
        <Grid2 container spacing={2} mt={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={1}>
              <span style={{ textDecoration: 'underline' }}>Residential Address</span>
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={values.residential_address === 'yes'} onChange={handleCheckboxChange} />}
              label="Same as in Aadhaar"
            />
            {values.residential_address === 'no' && (
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
            )}
          </Grid2>
        </Grid2>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ApplicantDetails;
