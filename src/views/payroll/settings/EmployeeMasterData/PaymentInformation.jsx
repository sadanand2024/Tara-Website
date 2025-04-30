import React, { useState, useEffect } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Grid2, Typography } from '@mui/material';
import { useSearchParams } from 'react-router';
import Factory from 'utils/Factory'; // Ensure this function is defined
import CustomInput from 'utils/CustomInput';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router';
function PaymentInformation({ employeeData, createdEmployeeId }) {
  const [payrollid, setPayrollId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    const empId = searchParams.get('employee_id');

    if (id) setPayrollId(id);
    if (empId) setEmployeeId(empId);
  }, [searchParams]);

  const employeeFields = [
    { name: 'account_holder_name', label: 'Account Holder Name' },
    { name: 'bank_name', label: 'Bank Name' },
    { name: 'account_number', label: 'Account Number' },
    { name: 'ifsc_code', label: 'IFSC Code' },
    { name: 'branch_name', label: 'Branch Name' }
  ];

  const validationSchema = Yup.object({
    account_holder_name: Yup.string()
      .required('Account Holder Name is required')
      .max(100, 'Account Holder Name cannot exceed 100 characters'),

    bank_name: Yup.string().required('Bank Name is required').max(100, 'Bank Name cannot exceed 100 characters'),

    account_number: Yup.string()
      .required('Account Number is required')
      .matches(/^\d{9,18}$/, 'Account Number must be between 9 and 18 digits'),

    ifsc_code: Yup.string()
      .required('IFSC Code is required')
      .matches(/^[A-Za-z]{4}\d{7}$/, 'Invalid IFSC Code. Format: ABCD1234567'),

    branch_name: Yup.string().required('Branch Name is required').max(100, 'Branch Name cannot exceed 100 characters'),

    is_active: Yup.boolean().required('Status is required')
  });

  const formik = useFormik({
    initialValues: {
      account_holder_name: '',
      bank_name: '',
      account_number: '',
      ifsc_code: '',
      branch_name: '',
      is_active: true
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
      let method = employeeData?.employee_bank_details?.id ? 'put' : 'post';
      let url =
        method === 'post' ? `/payroll/employee-bank-details` : `/payroll/employee-bank-details/${employeeData?.employee_bank_details?.id}`;

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
        navigate(-1);
      } else {
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        });
      }

      setLoading(false);
    }
  });

  const renderFields = (fields, prefix = '') => {
    return fields.map((field) => {
      const fieldName = prefix ? `${prefix}${field.name}` : field.name;

      return (
        <Grid2 size={{ sx: 12, sm: 6 }} key={fieldName}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.8 }}>
            {field.label}
          </Typography>

          <CustomInput
            fullWidth
            name={fieldName}
            value={prefix ? values.address?.[field.name] || '' : values[field.name]}
            onChange={(e) => {
              let value = e.target.value;

              if (field.name === 'ifsc_code' || field.name === 'branch_name') {
                value = value.toUpperCase();
              }

              setFieldValue(fieldName, value);
            }}
            onBlur={handleBlur}
            error={touched[fieldName] && Boolean(errors[fieldName])}
            helperText={touched[fieldName] && errors[fieldName]}
          />
        </Grid2>
      );
    });
  };
  const { values, setValues, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;
  useEffect(() => {
    if (employeeData?.employee_bank_details && Object.keys(employeeData.employee_bank_details).length > 0) {
      setValues((prev) => ({
        ...prev,
        ...employeeData.employee_bank_details
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

export default PaymentInformation;
