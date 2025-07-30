import { Avatar, Box, Button, Card, Grid2, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useSelector } from 'react-redux';
import MainCard from 'ui-component/cards/MainCard';
const ProfileInfo = () => {
  const employee = useSelector((state) => state.accountReducer.user?.employee);

  const mainFields = [
    // { label: 'Profile', name: 'profile', type: 'file', required: true },
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Employee ID', name: 'associate_id', type: 'text', required: true },
    { label: 'work_location', name: 'work_location', type: 'text', required: true },
    { label: 'Company mail', name: 'work_email', type: 'text', required: true },
    { label: 'Mobile Number', name: 'mobile_number', type: 'text', required: true }
  ];

  const formik = useFormik({
    initialValues: {
      profile: '',
      name: '',
      associate_id: '',
      work_location: '',
      work_email: '',
      mobile_number: ''
    },
    validationSchema: Yup.object({
      profile: Yup.mixed().required('Profile is required'),
      name: Yup.string().required('Name is required'),
      associate_id: Yup.string().required('Employee ID is required'),
      work_location: Yup.string().required('work_location is required'),
      work_email: Yup.string().email('Invalid email').required('Company mail is required'),
      mobile_number: Yup.string()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Must be 10 digits')
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    }
  });

  const { values, setFieldValue, handleChange, handleBlur, touched, errors, handleSubmit } = formik;

  // Pre-fill form using Redux data
  useEffect(() => {
    if (employee) {
      const profileData = employee.profile || {};

      setFieldValue('name', `${profileData.first_name || ''} ${profileData.last_name || ''}`);
      setFieldValue('associate_id', profileData.associate_id || '');
      setFieldValue('work_location', profileData.work_location?.toString() || '');
      setFieldValue('work_email', profileData.work_email || '');
      setFieldValue('mobile_number', profileData.mobile_number || '');
      setFieldValue('profile', employee.photo || '');
    }
  }, [employee, setFieldValue]);

  const getLabelWithAsterisk = (label, isRequired) => (
    <Typography variant="subtitle1" mb={1} fontWeight={500}>
      {label}
      {isRequired && <span style={{ color: 'red', fontSize: '1.2em' }}> *</span>}
    </Typography>
  );

  const renderField = (field) => {
    if (field.name === 'profile') {
      const error = touched[field.name] && Boolean(errors[field.name]);
      const helperText = touched[field.name] && errors[field.name];
      const inputId = 'profile-image-upload';
      return (
        <Box display="flex" flexDirection="column" alignItems="start" gap={2}>
          {getLabelWithAsterisk(field.label, field.required)}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={inputId}
            type="file"
            onChange={(e) => {
              const file = e.currentTarget.files[0];
              if (file) {
                setFieldValue(field.name, file);
              }
            }}
          />
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              alt="Profile"
              src={
                values[field.name]
                  ? typeof values[field.name] === 'string'
                    ? values[field.name]
                    : URL.createObjectURL(values[field.name])
                  : ''
              }
              sx={{ width: 100, height: 100, boxShadow: 3, border: '2px solid #fff', background: '#fff' }}
              imgProps={{
                style: {
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%'
                }
              }}
            />
            <label htmlFor={inputId}>
              <Button variant="contained" size="small" component="span">
                Upload / Change Profile Image
              </Button>
            </label>
          </Box>
          {error && (
            <Typography variant="caption" color="error">
              {helperText}
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <>
        {getLabelWithAsterisk(field.label, field.required)}
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
  };

  return (
    <MainCard>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {mainFields.map((field) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
              {renderField(field)}
            </Grid2>
          ))}

          <Grid2 size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Stack>
          </Grid2>
        </Grid2>
      </form>
    </MainCard>
  );
};

export default ProfileInfo;
