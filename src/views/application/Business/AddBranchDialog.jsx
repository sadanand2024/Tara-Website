import React, { useState, useEffect } from 'react';
import Modal from 'ui-component/extended/Modal';
import { Box, Typography, Button, Stack, Grid2, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Factory from 'utils/Factory';

const AddBranchDialog = ({ open, handleClose, setBranches, user, selectedBranch }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      branch_name: '',
      branch_code: ''
    },
    validationSchema: yup.object({
      branch_name: yup.string().required('Branch name is required'),
      branch_code: yup.string().required('Branch code is required')
    }),
    onSubmit: async (values) => {
      let data = {
        branch_name: values.branch_name.trim(),
        branch_code: values.branch_code.trim(),
        business: user.active_context.business_id
      };
      let method = selectedBranch && selectedBranch.id ? 'put' : 'post';
      let url = selectedBranch && selectedBranch.id ? `/user_management/branches/${selectedBranch.id}/` : '/user_management/branches/';
      let response = await Factory(method, url, data);

      if (response.res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Branch saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );

        resetForm();
        handleClose();
        const branchesResponse = await Factory('get', `/user_management/branches/${user.active_context.business_id}/`, {}, {});
        if (branchesResponse.res.status_cd === 0) {
          setBranches(branchesResponse.res.data || []);
        }
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: response.res.message || 'Failed to save branch',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const { values, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  useEffect(() => {
    if (selectedBranch) {
      setFieldValue('branch_name', selectedBranch.branch_name);
      setFieldValue('branch_code', selectedBranch.branch_code);
    }
  }, [selectedBranch]);
  return (
    <Modal
      maxWidth="sm"
      open={open}
      showClose={true}
      handleClose={handleClose}
      title="Add Branch"
      footer={
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: '100%' }}>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Branch Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.branch_name}
              onChange={(e) => setFieldValue('branch_name', e.target.value)}
              error={touched.branch_name && Boolean(errors.branch_name)}
              helperText={touched.branch_name && errors.branch_name}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'text.disabled'
                }
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Branch Code
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.branch_code}
              onChange={(e) => setFieldValue('branch_code', e.target.value)}
              error={touched.branch_code && Boolean(errors.branch_code)}
              helperText={touched.branch_code && errors.branch_code}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'text.disabled'
                }
              }}
            />
          </Grid2>
        </Grid2>
      </Box>
    </Modal>
  );
};

export default AddBranchDialog;
