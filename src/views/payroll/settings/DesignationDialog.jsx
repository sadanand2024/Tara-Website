import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Stack, Typography, Grid2 } from '@mui/material';
import CustomInput from 'utils/CustomInput';
import Modal from 'ui-component/extended/Modal';
import Factory from 'utils/Factory';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useSearchParams } from 'react-router-dom'; // Correct react-router import

export default function DesignationDialog({ open, handleClose, fetchDesignations, selectedRecord, type, setType }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null);

  const designationFields = [{ name: 'designation_name', label: 'Designation Name' }];

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  const formik = useFormik({
    initialValues: { designation_name: '' },
    validationSchema: Yup.object({
      designation_name: Yup.string().required('Designation Name is required')
    }),
    onSubmit: async (values) => {
      const postData = { ...values, payroll: payrollid };
      const url = type === 'edit' ? `/payroll/designations/${selectedRecord.id}/` : `/payroll/designations/`;
      const method = type === 'edit' ? 'put' : 'post';

      const { res } = await Factory(method, url, postData);

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
        fetchDesignations();
        resetForm();
        setType('');
        handleClose();
      } else {
        dispatchSnackbar(
          openSnackbar({
            open: true,
            message: JSON.stringify(res?.data?.error || 'Something went wrong'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const { values, handleChange, handleBlur, touched, errors, handleSubmit, setValues, resetForm } = formik;

  useEffect(() => {
    if (type === 'edit' && selectedRecord) {
      setValues({
        designation_name: selectedRecord.designation_name || ''
      });
    }
  }, [type, selectedRecord, setValues]);

  return (
    <Modal
      open={open}
      title={type === 'edit' ? 'Edit Designation' : 'Add Designation'}
      maxWidth="sm"
      showClose={true}
      handleClose={() => {
        resetForm();
        setType('');
        handleClose();
      }}
      header={{ title: `${type === 'edit' ? 'Update' : 'Add'} Designation`, subheader: '' }}
      footer={
        <Stack direction="row" justifyContent="space-between" sx={{ width: 1, gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              resetForm();
              setType('');
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
            {type === 'edit' ? 'Update' : 'Save'}
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        {designationFields.map((field) => (
          <Grid2 key={field.name} xs={12}>
            <Typography gutterBottom>
              {field.label} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomInput
              fullWidth
              name={field.name}
              value={values[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
            />
          </Grid2>
        ))}
      </Box>
    </Modal>
  );
}
