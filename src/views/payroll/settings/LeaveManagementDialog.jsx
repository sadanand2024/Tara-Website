import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Import Grid2 from MUI system
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import Modal from 'ui-component/extended/Modal';

export default function LeaveManagementDialog({ open, handleClose, selectedRecord, type, setType, fetchLeaveManagementData }) {
  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL

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
  const validationSchema = Yup.object({
    name_of_leave: Yup.string().required('Name of Leave is required'),
    code: Yup.string().required('Code is required'),
    leave_type: Yup.string().required('Type is required'),
    number_of_leaves: Yup.string().required('Number of leave days is required')
  });

  const formik = useFormik({
    initialValues: {
      name_of_leave: ' ',
      code: '',
      leave_type: '',
      employee_leave_period: 'Monthly',
      number_of_leaves: '',
      pro_rate_leave_balance_of_new_joinees_based_on_doj: false,
      carry_forward_unused_leaves: false,
      reset_leave_balance: false,
      reset_leave_balance_type: null,
      max_carry_forward_days: null,
      encash_remaining_leaves: false,
      encashment_days: null
    },
    validationSchema,
    onSubmit: async (values) => {
      const postData = { ...values, payroll: Number(payrollid) };
      const url = type === 'edit' ? `/payroll/leave-management/${selectedRecord?.id}` : '/payroll/leave-management';
      let postType = type === 'edit' ? 'put' : 'post';

      const { res, error } = await Factory(postType, url, postData);
      if (res?.status_cd === 0) {
        // showSnackbar(postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully', 'success');
        handleClose();
        resetForm();
        fetchLeaveManagementData();
      } else {
        // showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
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
      header={{ title: 'Add Leave', subheader: '' }}
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

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Select</InputLabel>
            <Select
              value={values.employee_leave_period || ''}
              label="Selct"
              onChange={(e) => setFieldValue('employee_leave_period', e.target.value)}
            >
              <MenuItem value={'Monthly'}>Monthly</MenuItem>
              <MenuItem value={'Yearly'}>Yearly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            sx={{ ml: 2 }}
            value={values.number_of_leaves}
            onChange={(e) => setFieldValue('number_of_leaves', e.target.value)}
            error={touched.number_of_leaves && Boolean(errors.number_of_leaves)}
            helperText={touched.number_of_leaves && errors.number_of_leaves}
          />
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
            <FormControl sx={{ m: 1, minWidth: 120, mt: 0 }} size="small">
              <InputLabel id="demo-select-small-label">Select</InputLabel>
              <Select
                value={values.reset_leave_balance_type || ''}
                label="Selct"
                onChange={(e) => setFieldValue('reset_leave_balance_type', e.target.value)}
              >
                <MenuItem value={'Monthly'}>Monthly</MenuItem>
                <MenuItem value={'Yearly'}>Yearly</MenuItem>
              </Select>
            </FormControl>
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
                value={values.max_carry_forward_days}
                onChange={(e) => setFieldValue('max_carry_forward_days', e.target.value)}
                error={touched.max_carry_forward_days && Boolean(errors.max_carry_forward_days)}
                helperText={touched.max_carry_forward_days && errors.max_carry_forward_days}
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
                  value={values.encashment_days}
                  onChange={(e) => setFieldValue('encashment_days', e.target.value)}
                  error={touched.encashment_days && Boolean(errors.encashment_days)}
                  helperText={touched.encashment_days && errors.encashment_days}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
