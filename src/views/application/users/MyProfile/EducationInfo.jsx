import React, { useEffect } from 'react';
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
import * as Yup from 'yup';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useSelector } from 'store';

const additionalFields = [
  { label: 'Qualification/Degree', name: 'qualification', type: 'text', required: true },
  { label: 'Year Of Passing', name: 'year_of_passing', type: 'text', required: true },
  { label: 'Upload Certificate', name: 'certificate', type: 'file', required: true }
];

const EducationInfo = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const employeeEducation = user?.employee?.education_details?.[0] || {};

  const formik = useFormik({
    initialValues: {
      qualification: '',
      year_of_passing: '',
      certificate: '',
      id: null
    },
    validationSchema: Yup.object({
      qualification: Yup.string().required('Qualification is required'),
      year_of_passing: Yup.string().required('Year of Passing is required'),
      certificate: Yup.string().required('Certificate is required')
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    }
  });

  const {
    values,
    setFieldValue,
    handleChange,
    errors,
    touched,
    handleSubmit,
    handleBlur
  } = formik;

  // Prefill Redux values
  useEffect(() => {
    if (employeeEducation) {
      setFieldValue('qualification', employeeEducation.qualification || '');
      setFieldValue('year_of_passing', employeeEducation.year_of_passing?.toString() || '');
      setFieldValue('certificate', employeeEducation.upload_certificate || '');
      setFieldValue('id', employeeEducation.id || null);
    }
  }, [employeeEducation, setFieldValue]);

  const getLabelWithAsterisk = (label, isRequired = true) => (
    <span>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </span>
  );

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        if (field.name === 'qualification') {
          return (
            <>
              <Typography variant="subtitle1" mb={1}>
                {getLabelWithAsterisk(field.label, field.required)}
              </Typography>
              <Autocomplete
                fullWidth
                size="small"
                options={['12th', 'B.Tech', 'MBA']}
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
          );
        }
        return (
          <>
            <Typography variant="subtitle1" mb={1}>
              {getLabelWithAsterisk(field.label, field.required)}
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
            <Typography variant="subtitle1" mb={1}>
              {getLabelWithAsterisk(field.label, field.required)}
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
      <Card sx={{ p: 1}}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{xs:12}}>
              <Typography variant="h4" fontWeight={700}>
                Education Information
              </Typography>
            </Grid2>

            {additionalFields.map((field) => (
              <Grid2 size={{xs:12,sm:6,md:4}}  key={field.name}>
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
      </Card>
    </Box>
  );
};

export default EducationInfo;
