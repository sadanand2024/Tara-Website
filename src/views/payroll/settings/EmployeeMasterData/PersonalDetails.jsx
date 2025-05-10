'use client';
import React, { useEffect, useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Box, Grid, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import CustomDatePicker from 'utils/CustomDateInput';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';

const PersonalDetails = ({ fetchEmployeeData, employeeData, createdEmployeeId }) => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const payrollId = searchParams.get('payrollid');
  const employeeId = searchParams.get('employee_id');

  const [loading, setLoading] = useState(false);
  const employeeFields = [
    { name: 'dob', label: 'Date of Birth' },
    { name: 'guardian_name', label: 'Guardian Name' },
    { name: 'pan', label: 'PAN' },
    { name: 'aadhar', label: 'Aadhar' },
    { name: 'age', label: 'Age' },
    { name: 'alternate_contact_number', label: 'Alternate Contact Number' },
    { name: 'marital_status', label: 'Marital Status' },
    { name: 'blood_group', label: 'Blood Group' }
  ];

  const addressFields = [
    { name: 'address_line1', label: 'Address Line 1' },
    { name: 'address_line2', label: 'Address Line 2' },

    { name: 'address_city', label: 'City' },
    { name: 'address_state', label: 'State' },
    { name: 'address_pinCode', label: 'Pincode' }
  ];
  const initialValues = {
    dob: '',
    guardian_name: '',
    pan: '',
    aadhar: '',
    age: '',
    alternate_contact_number: '',
    marital_status: '',
    blood_group: '',
    address: {
      address_line1: '',
      address_line2: '',
      address_city: '',
      address_state: '',
      address_pinCode: ''
    }
  };

  const validationSchema = Yup.object({
    dob: Yup.date().required('Required'),
    guardian_name: Yup.string().required('Required'),
    pan: Yup.string()
      .required()
      .matches(/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN'),
    aadhar: Yup.string()
      .required()
      .matches(/^\d{12}$/, 'Must be 12 digits'),
    age: Yup.number().required().positive().integer(),
    alternate_contact_number: Yup.string()
      .required()
      .matches(/^\d{10}$/, 'Must be 10 digits'),
    marital_status: Yup.string().required('Required'),
    blood_group: Yup.string().required('Required'),
    address: Yup.object().shape({
      address_line1: Yup.string().required('Required'),
      address_city: Yup.string().required('Required'),
      address_state: Yup.string().required('Required'),
      address_pinCode: Yup.string()
        .required()
        .matches(/^\d{6}$/, 'Invalid Pincode')
    })
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const postData = {
        ...values,
        payroll: Number(payrollId),
        employee: employeeData?.id || createdEmployeeId,
        marital_status: values.marital_status.toLowerCase()
      };

      const method = employeeData?.employee_personal_details?.id ? 'put' : 'post';
      const url =
        method === 'post'
          ? `/payroll/employee-personal-details`
          : `/payroll/employee-personal-details/${employeeData.employee_personal_details.id}`;

      const { res } = await Factory(method, url, postData);

      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        fetchEmployeeData(postData.employee);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data?.data || 'Something went wrong'),
            variant: 'alert',
            alert: { color: 'error' }
          })
        );
      }
      setLoading(false);
    }
  });

  const { values, setValues, setFieldValue, handleSubmit, handleBlur, touched, errors } = formik;

  // Prefill on mount
  useEffect(() => {
    if (employeeData?.employee_personal_details) {
      setValues({
        ...initialValues,
        ...employeeData.employee_personal_details,
        marital_status:
          employeeData.employee_personal_details.marital_status?.charAt(0).toUpperCase() +
          employeeData.employee_personal_details.marital_status?.slice(1)
      });
    }
  }, [employeeData]);

  const renderField = (field, prefix = '') => {
    const fieldName = prefix ? `${prefix}.${field.name}` : field.name;
    const value = prefix ? values[prefix]?.[field.name] : values[field.name];
    const error = prefix ? errors[prefix]?.[field.name] : errors[field.name];
    const isTouched = prefix ? touched[prefix]?.[field.name] : touched[field.name];

    return (
      <>
        <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.8 }}>
          {field.label}
        </Typography>

        {field.name === 'dob' ? (
          <CustomDatePicker
            name={fieldName}
            value={value ? dayjs(value) : null}
            onChange={(date) => setFieldValue(fieldName, date ? date.format('YYYY-MM-DD') : '')}
            onBlur={handleBlur}
            error={Boolean(isTouched && error)}
            helperText={isTouched && error}
          />
        ) : field.name === 'address_state' || field.name === 'marital_status' || field.name === 'blood_group' ? (
          <CustomAutocomplete
            name={fieldName}
            value={value || ''}
            options={
              field.name === 'marital_status'
                ? ['Single', 'Married']
                : field.name === 'blood_group'
                  ? ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
                  : indian_States_And_UTs
            }
            onChange={(e, newValue) => setFieldValue(fieldName, newValue)}
            error={Boolean(isTouched && error)}
            helperText={isTouched && error}
          />
        ) : (
          <CustomInput
            fullWidth
            name={fieldName}
            value={value || ''}
            onChange={(e) => {
              let val = e.target.value;

              // PAN should be uppercase only
              if (field.name === 'pan') {
                val = val.toUpperCase();
                val = val.replace(/[^A-Z0-9]/g, ''); // restrict to uppercase letters and numbers
              }

              // Aadhar - digits only
              if (field.name === 'aadhar') {
                val = val.replace(/\D/g, '');
              }

              // Age - digits only
              if (field.name === 'age') {
                val = val.replace(/\D/g, '');
              }

              // Alternate contact number - digits only
              if (field.name === 'alternate_contact_number') {
                val = val.replace(/\D/g, '');
              }

              // Guardian name - allow only alphabets and space
              if (field.name === 'guardian_name') {
                val = val.replace(/[^a-zA-Z\s]/g, '');
              }

              // Address Pincode - digits only
              if (field.name === 'address_pinCode') {
                val = val.replace(/\D/g, '');
              }

              setFieldValue(fieldName, val);
            }}
            onBlur={handleBlur}
            error={Boolean(isTouched && error)}
            helperText={isTouched && error}
          />
        )}
      </>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Personal Details
          </Typography>
          <Grid container spacing={2}>
            {employeeFields.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                {renderField(f)}
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" mt={4} gutterBottom>
            Address Details
          </Typography>
          <Grid container spacing={2}>
            {addressFields.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                {renderField(f, 'address')}
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
      </FormikProvider>
    </Box>
  );
};

export default PersonalDetails;
