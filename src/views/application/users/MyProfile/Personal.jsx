import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid2,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const PersonalInfo = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const personal = user?.employee?.personal_details || {};

  const mainFields = [
    {
      label: 'Date of Birth',
      name: 'dob',
      type: 'date',
      required: true
    },
    {
      label: 'Blood Group',
      name: 'blood_group',
      type: 'autocomplete',
      required: true,
      options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-','Unknown']
    },
    {
      label: 'Nationality',
      name: 'nationality',
      type: 'text',
      required: true
    },
    {
      label: 'Marital Status',
      name: 'marital_status',
      type: 'text',
      required: true
    },
    {
      label: 'Place of Birth',
      name: 'place_of_birth',
      type: 'text',
      required: true
    },
    {
      label: 'Residential Status',
      name: 'residential_status',
      type: 'text',
      required: true
    },
    {
      label: 'Father Name',
      name: 'father_name',
      type: 'text',
      required: true
    },
    {
      label: 'Religion',
      name: 'religion',
      type: 'text',
      required: true
    },
    {
      label: 'Physically Challenged',
      name: 'physically_challenged',
      type: 'autocomplete',
      required: true,
      options: ['Yes', 'No']
    }
  ];

  const formik = useFormik({
    initialValues: {
      dob: personal.dob || '',
      blood_group: personal.blood_group || '',
      nationality: personal.nationality || '',
      marital_status: personal.marital_status || '',
      place_of_birth: personal.place_of_birth || '',
      residential_status: personal.residential_status || '',
      father_name: personal.guardian_name || '',
      religion: personal.religion || '',
      physically_challenged: personal.physically_challenged || ''
    },
    validationSchema: Yup.object({
      dob: Yup.string().required('Date of birth is required'),
      blood_group: Yup.string().required('Blood group is required'),
      nationality: Yup.string().required('Nationality is required'),
      marital_status: Yup.string().required('Marital status is required'),
      place_of_birth: Yup.string().required('Place of birth is required'),
      residential_status: Yup.string().required('Residential status is required'),
      father_name: Yup.string().required('Father name is required'),
      religion: Yup.string().required('Religion is required'),
      physically_challenged: Yup.string().required('This field is required')
    }),
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      // dispatch action or call API
    }
  });

  const {
    values,
    setFieldValue,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit
  } = formik;

  const getLabelWithAsterisk = (label, isRequired = true) => (
    <Typography variant="subtitle1" mb={1} fontWeight={500}>
      {label}
      {isRequired && <span style={{ color: 'red', fontSize: '1.2em' }}> *</span>}
    </Typography>
  );

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'date':
        return (
          <>
            {getLabelWithAsterisk(field.label, field.required)}
            <TextField
              fullWidth
              size="small"
              name={field.name}
              type={field.type === 'date' ? 'date' : 'text'}
              value={values[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
            />
          </>
        );

      case 'autocomplete':
        return (
          <>
            {getLabelWithAsterisk(field.label, field.required)}
            <Autocomplete
              fullWidth
              size="small"
              options={field.options || []}
              value={values[field.name] || ''}
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
        );

      default:
        return null;
    }
  };

  return (
    <Box >
      <Card sx={{ p: 1 }}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{xs:12}}>
              <Typography variant="h4" fontWeight={700}>
                Personal Information
              </Typography>
            </Grid2>

            {mainFields.map((field) => (
              <Grid2 size={{xs:12,sm:6,md:4}} key={field.name}>
                {renderField(field)}
              </Grid2>
            ))}

            <Grid2 size={{xs:12}}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Card>
    </Box>
  );
};

export default PersonalInfo;
