import React, { useState, useEffect } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Grid2, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import CustomDatePicker from 'utils/CustomDateInput';
import Factory from 'utils/Factory'; // Ensure this function is defined
import dayjs from 'dayjs';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
function PersonalDetails({ employeeData, createdEmployeeId }) {
  const [payrollid, setPayrollId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
    { name: 'address_line1', label: 'Address Line 1' },
    { name: 'address_line2', label: 'Address Line 2' },

    { name: 'address_city', label: 'City' },
    { name: 'address_state', label: 'State' },
    { name: 'address_pinCode', label: 'Pincode' }
  ];

  const validationSchema = Yup.object({
    dob: Yup.date().required('Date of Birth is required'),
    guardian_name: Yup.string().required('Guardian Name is required'),
    pan: Yup.string()
      .required('PAN is required')
      .matches(/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN format (ABCDE1234F)'),
    aadhar: Yup.string()
      .matches(/^\d{12}$/, 'Aadhar must be 12 digits')
      .required('Aadhar number is required'),
    age: Yup.number().positive('Invalid age').integer('Invalid age').required('Age is required'),
    alternate_contact_number: Yup.string()
      .matches(/^\d{10}$/, 'Alternate contact must be 10 digits')
      .required('Alternate contact is required'),
    marital_status: Yup.string().required('Marital Status is required'),
    blood_group: Yup.string().required('Blood Group is required'),

    address: Yup.object({
      address_line1: Yup.string().required('Address Line 1 is required'),
      address_line2: Yup.string(), // optional
      address_city: Yup.string().required('City is required'),
      address_state: Yup.string().required('State is required'),
      address_pinCode: Yup.string()
        .matches(/^\d{6}$/, 'Invalid Pincode')
        .required('Pincode is required')
    })
  });

  const formik = useFormik({
    initialValues: {
      dob: '',
      age: '',
      guardian_name: '',
      pan: '',
      aadhar: '',
      address: {
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_pinCode: ''
      },
      alternate_contact_number: '',
      marital_status: '',
      blood_group: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const postData = { ...values, payroll: Number(payrollid) };
      if (employeeData?.id) {
        postData.employee = employeeData.id;
      } else if (createdEmployeeId) {
        postData.employee = createdEmployeeId;
      }
      postData.marital_status = values.marital_status.toLowerCase();

      let method = employeeData?.employee_personal_details?.id ? 'put' : 'post';
      let url =
        method === 'post'
          ? `/payroll/employee-personal-details`
          : `/payroll/employee-personal-details/${employeeData?.employee_personal_details?.id}`;
      const { res } = await Factory(method, url, postData);

      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Data Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data.data),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }

      setLoading(false);
    }
  });

  const renderFields = (fields, prefix = '') => {
    return fields.map((field) => {
      const fieldName = prefix ? `${prefix}${field.name}` : field.name;

      return (
        <Grid2 key={fieldName} size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.8 }}>
            {field.label}
          </Typography>

          {field.name === 'dob' ? (
            <CustomDatePicker
              name={fieldName}
              value={(() => {
                const rawValue = fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), values);
                return rawValue ? dayjs(rawValue) : null;
              })()}
              onChange={(newDate) => {
                const formattedDate = newDate ? dayjs(newDate).format('YYYY-MM-DD') : '';
                setFieldValue(fieldName, formattedDate);
              }}
              onBlur={handleBlur}
              inputFormat="DD-MM-YYYY"
              error={
                Boolean(fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), touched)) &&
                Boolean(fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), errors))
              }
              helperText={fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), errors)}
            />
          ) : field.name === 'address_state' || field.name === 'marital_status' || field.name === 'blood_group' ? (
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
              value={fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), values)}
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
              error={
                Boolean(fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), touched)) &&
                Boolean(fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), errors))
              }
              helperText={fieldName.split('.').reduce((obj, key) => (obj ? obj[key] : ''), errors)}
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
