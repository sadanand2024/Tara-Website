import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Stack, Typography, Grid2 } from '@mui/material';
import CustomInput from 'utils/CustomInput';
import Modal from 'ui-component/extended/Modal';
import Factory from 'utils/Factory';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useSearchParams } from 'react-router-dom'; // correct react-router-dom

export default function DepartmentDialog({ open, handleClose, fetchDepartments, selectedRecord, type, setType }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null);

  const departmentFields = [
    { name: 'dept_name', label: 'Department Name' },
    { name: 'dept_code', label: 'Department Code' },
    { name: 'description', label: 'Description' }
  ];

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      dept_name: '',
      dept_code: '',
      description: ''
    },
    validationSchema: Yup.object({
      dept_name: Yup.string().required('Department Name is required'),
      dept_code: Yup.string().required('Department Code is required'),
      description: Yup.string().required('Description is required')
    }),
    onSubmit: async (values) => {
      const postData = { ...values, payroll: payrollid };
      const url = type === 'edit' ? `/payroll/departments/${selectedRecord.id}/` : `/payroll/departments/`;
      const method = type === 'edit' ? 'put' : 'post';

      const { res } = await Factory(method, url, postData);
      console.log(res);
      if (res?.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: type === 'edit' ? 'Record Updated Successfully' : 'Record Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        fetchDepartments();
        resetForm();
        handleClose();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data.error),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const { values, setValues, handleChange, handleBlur, errors, touched, handleSubmit, resetForm } = formik;

  useEffect(() => {
    if (type === 'edit' && selectedRecord) {
      setValues({
        dept_name: selectedRecord.dept_name || '',
        dept_code: selectedRecord.dept_code || '',
        description: selectedRecord.description || ''
      });
    }
  }, [type, selectedRecord, setValues]);

  return (
    <Modal
      open={open}
      showClose={true}
      title={type === 'edit' ? 'Edit Department' : 'Add Department'}
      handleClose={() => {
        setType('');
        resetForm(); // Optional
        handleClose(); // <- this closes the modal
      }}
      maxWidth="sm"
      header={{ title: `${type === 'edit' ? 'Update' : 'Add'} Department`, subheader: '' }}
      footer={
        <Stack direction="row" justifyContent="space-between" sx={{ width: 1, gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setType('');
              resetForm();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {type === 'edit' ? 'Update' : 'Save'}
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Grid2 container spacing={3}>
          {departmentFields.map((field) => (
            <Grid2 key={field.name} xs={12}>
              <Typography gutterBottom>
                {field.label} <span style={{ color: 'red' }}>*</span>
              </Typography>
              <CustomInput
                fullWidth
                name={field.name}
                multiline={field.name === 'description'}
                minRows={field.name === 'description' ? 6 : undefined}
                value={values[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
              />
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Modal>
  );
}
