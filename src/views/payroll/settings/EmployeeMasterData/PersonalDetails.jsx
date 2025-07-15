'use client';
import { Box, Grid2, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import CustomDatePicker from 'utils/CustomDateInput';
import CustomInput from 'utils/CustomInput';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import * as Yup from 'yup';

const PersonalDetails = ({ fetchEmployeeData, employeeData, createdEmployeeId, setSubmitRef, onNext }) => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const payrollId = searchParams.get('payrollid');
  const employeeId = searchParams.get('employee_id');

  const [loading, setLoading] = useState(false);
  const employeeFields = [
    { name: 'dob', label: 'Date of Birth', required: false },
    { name: 'guardian_name', label: 'Guardian Name', required: true },
    { name: 'pan', label: 'PAN', required: true },
    { name: 'aadhar', label: 'Aadhar', required: false },
    { name: 'age', label: 'Age', required: false },
    { name: 'alternate_contact_number', label: 'Alternate Contact Number', required: false },
    { name: 'marital_status', label: 'Marital Status', required: false },
    { name: 'blood_group', label: 'Blood Group', required: false }
  ];
  
  const addressFields = [
    { name: 'address_line1', label: 'Address Line 1', required: true },
    { name: 'address_line2', label: 'Address Line 2', required: false },
    { name: 'address_city', label: 'City', required: false },
    { name: 'address_state', label: 'State', required: false },
    { name: 'address_pinCode', label: 'Pincode', required: false }
  ];
  
  const initialValues = {
    dob: '',
    guardian_name: '',
    pan: '',
    aadhar: '',
    age: '', // keep for display, but will be auto-calculated
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
  const getLabelWithAsterisk = (label, isRequired) => (
    <span>
      {label}
      {isRequired && <span style={{ color: 'red', fontSize: '1.2em', marginLeft: 2 }}>*</span>}
    </span>
  );

  const validationSchema = Yup.object({
    // dob: Yup.date().required('Required'),
    guardian_name: Yup.string().required('Required'),
    pan: Yup.string()
      .required()
      .matches(/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN'),
    // aadhar: Yup.string()
    //   .required()
    //   .matches(/^\d{12}$/, 'Must be 12 digits'),
    // age: Yup.number().required().positive().integer(), // REMOVE age validation
    // alternate_contact_number: Yup.string()
    //   .required()
    //   .matches(/^\d{10}$/, 'Must be 10 digits'),
    // marital_status: Yup.string().required('Required'),
    // blood_group: Yup.string().required('Required'),
    address: Yup.object().shape({
      address_line1: Yup.string().required('Required'),
      // address_city: Yup.string().required('Required'),
      // address_state: Yup.string().required('Required'),
      // address_pinCode: Yup.string()
      //   .required()
      //   .matches(/^\d{6}$/, 'Invalid Pincode')
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
        onNext();
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

  // Add useEffect to calculate age from dob
  useEffect(() => {
    if (values.dob) {
      const today = dayjs();
      const birthDate = dayjs(values.dob);
      let age = today.diff(birthDate, 'year');
      setFieldValue('age', age);
    } else {
      setFieldValue('age', '');
    }
    // eslint-disable-next-line
  }, [values.dob]);

  const renderField = (field, prefix = '') => {
    const fieldName = prefix ? `${prefix}.${field.name}` : field.name;
    const value = prefix ? values[prefix]?.[field.name] : values[field.name];
    const error = prefix ? errors[prefix]?.[field.name] : errors[field.name];
    const isTouched = prefix ? touched[prefix]?.[field.name] : touched[field.name];

    if (field.name === 'age') {
      return (
        <>
          {/* <Typography variant="subtitle1">{field.label}</Typography> */}
          <Typography variant="subtitle1">
            {getLabelWithAsterisk(field.label, field.required)}
          </Typography>
          <CustomInput
            fullWidth
            name={fieldName}
            value={value || ''}
            disabled
            sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
          />
        </>
      );
    }

    return (
      <>
        {/* <Typography variant="subtitle1">{field.label}</Typography> */}
        <Typography variant="subtitle1">
  {getLabelWithAsterisk(field.label, field.required)}
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
            sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
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
            sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
          />
        )}
      </>
    );
  };
  useEffect(() => {
    if (setSubmitRef) {
      setSubmitRef(formik.submitForm);
    }
  }, [setSubmitRef, formik.submitForm]);
  return (
    <Box sx={{ mt: 2 }}>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            Personal Details
          </Typography>
          <Grid2 container spacing={2}>
            {employeeFields.map((f, i) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                {renderField(f)}
              </Grid2>
            ))}
          </Grid2>

          <Typography variant="h4" mt={4} gutterBottom>
            Address Details
          </Typography>
          <Grid2 container spacing={2}>
            {addressFields.map((f, i) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                {renderField(f, 'address')}
              </Grid2>
            ))}
          </Grid2>
        </form>
      </FormikProvider>
    </Box>
  );
};

export default PersonalDetails;
