import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Stack, Typography, FormControlLabel, Checkbox, TextField, Grid2 } from '@mui/material';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import Modal from 'ui-component/extended/Modal';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
export default function LeaveManagementDialog({ open, handleClose, selectedRecord, type, setType, fetchLeaveManagementData }) {
  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL
  const dispatch = useDispatch();
  // Update payroll ID from search params
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const departmentFields = [
    { name: 'name_of_leave', label: 'Name of the Leave' },
    { name: 'code', label: 'Code' },
    { name: 'leave_type', label: 'Select Type' }
    // { name: 'number_of_leaves', label: 'How many leaves do employees get?' }
  ];

  // Formik validation schema
  const validationSchema = Yup.object().shape({
    name_of_leave: Yup.string().required('Name of Leave is required'),
    code: Yup.string().required('Code is required'),
    leave_type: Yup.string().required('Type is required'),
    number_of_leaves: Yup.number()
      .typeError('Number of leaves must be a number')
      .positive('Number of leaves must be positive')
      .required('Number of leave days is required'),
    employee_leave_period: Yup.string().required('Leave period is required'),
    reset_leave_balance_type: Yup.string().when('reset_leave_balance', {
      is: true,
      then: () => Yup.string().required('Reset leave balance type is required')
    }),
    max_carry_forward_days: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .typeError('Max carry forward days must be a number')
      .positive('Max carry forward days must be positive')
      .when('carry_forward_unused_leaves', {
        is: true,
        then: (schema) => schema.required('Max carry forward days is required'),
        otherwise: (schema) => schema.notRequired()
      }),
    encashment_days: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .typeError('Encashment days must be a number')
      .positive('Encashment days must be positive')
      .when('encash_remaining_leaves', {
        is: true,
        then: (schema) => schema.required('Encashment days is required'),
        otherwise: (schema) => schema.notRequired()
      })
  });

  const formik = useFormik({
    initialValues: {
      name_of_leave: '',
      code: '',
      leave_type: '',
      employee_leave_period: 'Monthly',
      number_of_leaves: '',
      pro_rate_leave_balance_of_new_joinees_based_on_doj: false,
      carry_forward_unused_leaves: false,
      reset_leave_balance: false,
      reset_leave_balance_type: '',
      max_carry_forward_days: '',
      encash_remaining_leaves: false,
      encashment_days: ''
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const postData = {
        ...values,
        payroll: Number(payrollid),
        number_of_leaves: Number(values.number_of_leaves),
        max_carry_forward_days: values.max_carry_forward_days ? Number(values.max_carry_forward_days) : null,
        encashment_days: values.encashment_days ? Number(values.encashment_days) : null
      };
      const url = type === 'edit' ? `/payroll/leave-management/${selectedRecord?.id}` : '/payroll/leave-management';
      let postType = type === 'edit' ? 'put' : 'post';

      const { res, error } = await Factory(postType, url, postData);
      if (res?.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        handleClose();
        resetForm();
        fetchLeaveManagementData();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res?.data?.data || error),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  useEffect(() => {
    if (type === 'edit' && selectedRecord) {
      setValues(selectedRecord); // Ensure values are set for editing
    }
  }, [type, selectedRecord]);
  // Render each field dynamically
  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {field.label}
        </Typography>
        {field.label === 'Select Type' || field.label === 'Name of the Leave' ? (
          <CustomAutocomplete
            value={values[field.name]}
            name={field.name}
            onChange={(e, newValue) => setFieldValue(field.name, newValue)}
            options={field.label === 'Select Type' ? ['Paid', 'Un Paid'] : ['Casual Leave', 'Sick Leave', 'Earned leave']}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            sx={{ width: '100%' }}
          />
        ) : (
          <CustomInput
            fullWidth
            name={field.name}
            value={values[field.name]}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          />
        )}
      </Grid2>
    ));
  };
  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;
  return (
    <Modal
      open={open}
      maxWidth={'lg'}
      showClose={true}
      handleClose={() => {
        setType('');
        resetForm();
        handleClose(); // Reset form and close dialog
      }}
      title="Add/ Update Leave"
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              setType('');
              resetForm();
              handleClose(); // Reset form and close dialog
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
        <Grid2 container spacing={3}>
          {renderFields(departmentFields)}
        </Grid2>
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ mb: 2 }}>How many leaves do employees get ?</Typography>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 6 }}>
              <CustomAutocomplete
                value={values.employee_leave_period || ''}
                name="employee_leave_period"
                options={['Monthly', 'Yearly']}
                onChange={(e, newValue) => setFieldValue('employee_leave_period', newValue)}
                onBlur={handleBlur}
                error={touched.employee_leave_period && Boolean(errors.employee_leave_period)}
                helperText={touched.employee_leave_period && errors.employee_leave_period}
                sx={{ minWidth: 250, maxWidth: 250 }}
                placeholder="Select"
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                fullWidth
                size="small"
                value={values.number_of_leaves}
                onChange={(e) => setFieldValue('number_of_leaves', e.target.value)}
                onBlur={handleBlur}
                error={touched.number_of_leaves && Boolean(errors.number_of_leaves)}
                helperText={touched.number_of_leaves && errors.number_of_leaves}
              />
            </Grid2>
          </Grid2>
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            label="Pro rate leave balance for new joinees based on their D.O.J"
            control={
              <Checkbox
                checked={values.pro_rate_leave_balance_of_new_joinees_based_on_doj}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setFieldValue('pro_rate_leave_balance_of_new_joinees_based_on_doj', checked);
                }}
              />
            }
          />
        </Box>

        <Box size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Box>
            <FormControlLabel
              label="Reset the leave balance of employees every"
              control={
                <Checkbox
                  checked={values.reset_leave_balance}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (!checked) {
                      setFieldValue('reset_leave_balance_type', '');
                      setFieldValue('max_carry_forward_days', '');
                      setFieldValue('encashment_days', '');
                    }
                    // Update the value for the checkbox
                    setFieldValue('reset_leave_balance', checked);
                  }}
                />
              }
            />
            <CustomAutocomplete
              value={values.reset_leave_balance_type || ''}
              name="reset_leave_balance_type"
              options={['Monthly', 'Yearly']}
              onChange={(e, newValue) => setFieldValue('reset_leave_balance_type', newValue)}
              onBlur={handleBlur}
              error={touched.reset_leave_balance_type && Boolean(errors.reset_leave_balance_type)}
              helperText={touched.reset_leave_balance_type && errors.reset_leave_balance_type}
              sx={{ minWidth: 200, maxWidth: 200, ml: 1 }}
              placeholder="Select"
            />
          </Box>
          {values.reset_leave_balance && (
            <Box sx={{ ml: 2 }}>
              <FormControlLabel
                label="Carry forward unused leave days upon reset? max carry forward days"
                control={
                  <Checkbox
                    checked={values.carry_forward_unused_leaves}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFieldValue('carry_forward_unused_leaves', checked);
                    }}
                  />
                }
              />
              <TextField
                value={
                  values.max_carry_forward_days === undefined || values.max_carry_forward_days === null ? '' : values.max_carry_forward_days
                }
                onChange={(e) => setFieldValue('max_carry_forward_days', e.target.value)}
                onBlur={handleBlur}
                error={values.carry_forward_unused_leaves && touched.max_carry_forward_days && Boolean(errors.max_carry_forward_days)}
                helperText={values.carry_forward_unused_leaves && touched.max_carry_forward_days && errors.max_carry_forward_days}
              />
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  label="Encash remaing leave days ? max encashment days"
                  control={
                    <Checkbox
                      checked={values.encash_remaining_leaves}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue('encash_remaining_leaves', checked);
                      }}
                    />
                  }
                />
                <TextField
                  value={values.encashment_days === undefined || values.encashment_days === null ? '' : values.encashment_days}
                  onChange={(e) => setFieldValue('encashment_days', e.target.value)}
                  onBlur={handleBlur}
                  error={values.encash_remaining_leaves && touched.encashment_days && Boolean(errors.encashment_days)}
                  helperText={values.encash_remaining_leaves && touched.encashment_days && errors.encashment_days}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
