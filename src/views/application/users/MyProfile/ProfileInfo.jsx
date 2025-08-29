import { Avatar, Box, Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
const ProfileInfo = () => {
  // const employee = useSelector((state) => state.accountReducer.user?.employee);
    const employee = useSelector((state) => state.accountReducer.user?.employee);
  const profileId = employee?.profile?.id;
  const [isLoading, setIsLoading] = useState(true);
const [profileData, setProfileData] = useState(null);
const dispatch = useDispatch();

  const mainFields = [
    // { label: 'Profile', name: 'profile', type: 'file', required: true },
    { label: 'First Name', name: 'first_name', type: 'text', required: true },
    { label: 'Middle Name', name: 'middle_name', type: 'text', required: true },
    { label: 'Last Name', name: 'last_name', type: 'text', required: true },
   { label: 'Work Location', name: 'work_location', type: 'text', required: true },
    { label: 'Designation', name: 'designation', type: 'text', required: true },
     { label: 'Department', name: 'department', type: 'text', required: true },
     { label: 'Employee ID', name: 'associate_id', type: 'text', required: true },
    { label: 'Company mail', name: 'work_email', type: 'text', required: true },
    { label: 'Mobile Number', name: 'mobile_number', type: 'text', required: true },
    { label: 'Date of Birth', name: 'dob', type: 'date', required: true },
    { label: 'Blood Group', name: 'blood_group', type: 'autocomplete', required: true, options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'] },
     {
      label: 'Marital Status',
      name: 'marital_status',
      type: 'autocomplete',
      required: true,
      options: ['single', 'married'] 
    },
     {
      label: 'Guardian Name',
      name: 'guardian_name',
      type: 'text',
      required: true
    },


  ];
  const disabledFields = [
  'work_location',
  'designation',
  'department',
  'associate_id',
  'work_email'
];

  const formik = useFormik({
    initialValues: {
      profile: '',
      first_name:'',
      middle_name: '',
      last_name: '',
      designation: '',
      department: '',
      associate_id: '',
      work_location: '',
      work_email: '',
      mobile_number: '',
      dob: '',
      blood_group: '',
      guardian_name:'',
      marital_status:'',
    },
    validationSchema: Yup.object({
      // profile: Yup.mixed().required('Profile is required'),
      first_name: Yup.string().required('first_name is required'),
      // middle_name: Yup.string().required('middle_name is required'),
      last_name: Yup.string().required('last_name is required'),
      designation: Yup.string().required('designation is required'),
      department: Yup.string().required('department is required'),
      associate_id: Yup.string().required('Employee ID is required'),
      work_location: Yup.string().required('work_location is required'),
      dob: Yup.string().required('Date of Joining is required'),
      blood_group: Yup.string().required('Blood Group is required'),
      guardian_name: Yup.string().required('Guardian Name is required'),
      marital_status: Yup.string().required('Marital Status is required'),
      work_email: Yup.string().email('Invalid email').required('Company mail is required'),
      mobile_number: Yup.string()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Must be 10 digits')
    }),
    // onSubmit: (values) => {
    //   console.log('Form Submitted:', values);
    // }
    onSubmit: async (values, { setSubmitting }) => {
  try {
    setSubmitting(true);

    const url = '/payroll/employee-profile-update/';

    // Build payload to match your API shape exactly
    const body = {
      profile: {
        id: values.profile_id,          // required
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        mobile_number: values.mobile_number
        // include other updatable profile fields here ONLY if your backend accepts them in this block
        // e.g., work_email, etc., else keep them out to avoid 400s.
      },
      personal_details: {
        id: values.personal_id,         // required
        employee: values.employee_id,   // profile id / employee id
        dob: values.dob,
        blood_group: values.blood_group,
        marital_status: values.marital_status,
        guardian_name: values.guardian_name
      }
    };

    const { res } = await Factory('put', url, body);
    if (res?.status_cd === 0) {
     
      dispatch(
        openSnackbar({
          open: true,
          message: 'Profile updated successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      // optionally refetch:
      // await getProfileInfo();
    } else {
     
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to update profile',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  } catch (err) {
    
    dispatch(
      openSnackbar({
        open: true,
        message: 'Failed to update profile',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      })
    );
  } finally {
    setSubmitting(false);
  }
}

  });

  const { values, setFieldValue, handleChange, handleBlur, touched, errors, handleSubmit, isSubmitting } = formik;



const getProfileInfo = async () => {
  setIsLoading(true);
  const url = `/payroll/employee-profile/`;

  try {
    const { res } = await Factory('get', url);
    if (res?.status_cd === 0 && res?.data?.profile) {
      const data = res.data.profile;
      const data1= res.data.personal_details;

      formik.setValues({
        //  name: `${data?.first_name || ''} ${data?.last_name || ''}`.trim(),
      first_name: data?.first_name || '',
      middle_name: data?.middle_name || '',
      last_name: data?.last_name || '',
      designation: data?.designation || '',
      department: data?.department || '',

        associate_id: data?.associate_id || '',
        work_location: data?.work_location || '',
        work_email: data?.work_email || '',
        mobile_number: data?.mobile_number || '',
       dob: data1?.dob || '',
        blood_group: data1?.blood_group || '',
        guardian_name: data1?.guardian_name || '',
        marital_status: data1?.marital_status || '',
       
      });

      setProfileData(data);
    }
  } catch (error) {
    console.error('Failed to fetch personal info:', error);
    dispatch(
      openSnackbar({
        open: true,
        message: 'Failed to fetch personal info',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      })
    );
  } finally {
    setIsLoading(false);
  }
};

 useEffect(() => {
  getProfileInfo();
}, []);

  const getLabelWithAsterisk = (label, isRequired) => (
    <Typography variant="subtitle1" mb={1} fontWeight={500}>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
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

     switch (field.type) {
      case 'date':
        return (
          <>
            {getLabelWithAsterisk(field.label, field.required)}
            <TextField
              fullWidth
              size="small"
              name={field.name}
              type="date"
              value={values[field.name] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              InputLabelProps={{ shrink: true }}
            />
          </>
        );

      case 'autocomplete':
        return (
          <>
            {getLabelWithAsterisk(field.label, field.required)}
            <Autocomplete
              options={field.options || []}
              value={values[field.name] || ''}
              onChange={(_, newValue) => setFieldValue(field.name, newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={field.name}
                  size="small"
                  error={touched[field.name] && Boolean(errors[field.name])}
                  helperText={touched[field.name] && errors[field.name]}
                />
              )}
            />
          </>
        );

      default:
        return (
          <>
            {getLabelWithAsterisk(field.label, field.required)}
            <TextField
              fullWidth
              size="small"
              name={field.name}
              value={values[field.name] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              disabled={disabledFields.includes(field.name)}
            />
          </>
        );
    }
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
              <Button type="submit" variant="contained" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Saving…' : 'Save'}
              </Button>
            </Stack>
          </Grid2>
        </Grid2>
      </form>
    </MainCard>
  );
};

export default ProfileInfo;
