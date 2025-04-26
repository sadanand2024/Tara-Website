'use client';
import React, { useState, useEffect } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Grid2, Typography } from '@mui/material';
import { useSearchParams } from 'react-router';
import CustomDatePicker from 'utils/CustomDateInput';
import Factory from 'utils/Factory'; // Ensure this function is defined
import dayjs from 'dayjs';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';

function PersonalDetails({ employeeData }) {
  const [payrollid, setPayrollId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    const empId = searchParams.get('employee_id');

    if (id) setPayrollId(id);
    if (empId) setEmployeeId(empId);
  }, [searchParams]);

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
    { name: 'street', label: 'Street' },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'pincode', label: 'Pincode' }
  ];

  const validationSchema = Yup.object({
    dob: Yup.date().required('Date of Birth is required'),
    guardian_name: Yup.string().required('Guardian Name is required'),
    pan: Yup.string()
      .required('PAN is required')
      .matches(/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid  format. format: ABCDE1234F'),
    aadhar: Yup.string()
      .matches(/^\d{12}$/, 'Aadhar Card must be 12 digits')
      .required('Aadhar Card number is required'),
    age: Yup.number().positive().integer().required('Age is required'),
    alternate_contact_number: Yup.string()
      .matches(/^\d{10}$/, 'Invalid contact number')
      .required('Required'),
    marital_status: Yup.string().required('Required'),
    blood_group: Yup.string().required('Blood Group is required'),
    address: Yup.object({
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string()
        .matches(/^\d{6}$/, 'Invalid pincode')
        .required('Pincode is required')
    })
  });

  const formik = useFormik({
    initialValues: {
      dob: dayjs().format('YYYY-MM-DD'),
      age: '',
      aadhar: '',
      guardian_name: '',
      pan: '',
      aadhar: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      alternate_contact_number: '',
      marital_status: '',
      blood_group: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const postData = { ...values, payroll: Number(payrollid) };
      postData.employee = employeeData.id;
      postData.marital_status = values.marital_status.toLowerCase();
      let method = employeeData?.employee_personal_details?.id ? 'put' : 'post';
      let url =
        method === 'post'
          ? `/payroll/employee-personal-details`
          : `/payroll/employee-personal-details/${employeeData?.employee_personal_details?.id}`;
      const { res } = await Factory(method, url, postData);

      if (res.status_cd === 0) {
        // showSnackbar('Data Saved Successfully', 'success');
      } else {
        // showSnackbar(JSON.stringify(res.data.data), 'error');
      }

      setLoading(false);
    }
  });

  const renderFields = (fields, prefix = '') => {
    return fields.map((field) => {
      const fieldName = prefix ? `${prefix}${field.name}` : field.name;

      return (
        <Grid2 size={{ sx: 12, sm: 6, md: 4 }} key={fieldName}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.8 }}>
            {field.label}
          </Typography>
          {field.name === 'dob' ? (
            <CustomDatePicker
              value={prefix ? dayjs(values.address?.[field.name]) || '' : dayjs(values[field.name]) || null}
              onChange={(newDate) => {
                const formattedDate = dayjs(newDate).format('YYYY-MM-DD');
                setFieldValue(fieldName, formattedDate);
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  fontSize: '0.75rem',
                  height: '40px'
                }
              }}
            />
          ) : field.name === 'state' || field.name === 'marital_status' || field.name === 'blood_group' ? (
            <CustomAutocomplete
              value={prefix ? values.address?.[field.name] || '' : values[field.name]}
              onChange={(e, newValue) => {
                setFieldValue(fieldName, newValue);
              }}
              options={
                field.name === 'marital_status'
                  ? ['Single', 'Married']
                  : field.name === 'blood_group'
                    ? ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
                    : indian_States_And_UTs
              }
            />
          ) : (
            <CustomInput
              fullWidth
              name={fieldName}
              value={prefix ? values.address?.[field.name] || '' : values[field.name]}
              onChange={(e) => {
                let value = e.target.value;

                if (field.name === 'pan' && value.length > 10) {
                  return; // Exit early if PAN length exceeds 10
                }

                if (field.name === 'pan' && value.length <= 10) {
                  value = value.toUpperCase();
                }

                setFieldValue(fieldName, value);
              }}
              onBlur={handleBlur}
              error={touched[fieldName] && Boolean(errors[fieldName])}
              helperText={touched[fieldName] && errors[fieldName]}
            />
          )}
        </Grid2>
      );
    });
  };
  const { values, setValues, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;
  useEffect(() => {
    if (employeeData && employeeData.employee_personal_details) {
      setValues((prev) => ({
        ...prev,
        marital_status:
          employeeData.employee_personal_details.marital_status.charAt(0).toUpperCase() +
          employeeData.employee_personal_details.marital_status.slice(1),
        ...employeeData.employee_personal_details
      }));
    }
  }, [employeeData]);

  return (
    <Box sx={{ mt: 2 }}>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            {renderFields(employeeFields)}
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Address Details
            </Typography>
          </Grid2>
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            {renderFields(addressFields, 'address.')}
          </Grid2>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </form>
      </FormikProvider>
    </Box>
  );
}

export default PersonalDetails;
