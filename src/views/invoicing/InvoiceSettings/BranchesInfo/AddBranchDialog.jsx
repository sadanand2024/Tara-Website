import React, { useEffect, useState } from 'react';
import { Box, Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import Modal from 'ui-component/extended/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useSelector } from 'react-redux';
import Factory from 'utils/Factory';

const AddBranchDialog = ({ open, handleClose, getBranches, selectedRecord, getBranchesData }) => {
  const [type, setType] = useState('add');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);

  const branchFields = [
    { name: 'branch_name', label: 'Branch Name' },
    { name: 'branch_code', label: 'Branch Code' }
  ];
  const validationSchema = Yup.object().shape({
    branch_name: Yup.string().required('Branch Name is required'),
    branch_code: Yup.string().required('Branch Code is required')
  });
  const formik = useFormik({
    initialValues: {
      branch_name: '',
      branch_code: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const postData = { ...values, business: user.active_context.business_id };
      const url = selectedRecord?.id ? `/user_management/branches/${selectedRecord.id}/` : '/user_management/branches/';
      let postmethod = selectedRecord?.id ? 'put' : 'post';
      const { res } = await Factory(postmethod, url, postData);
      console.log(res);
      if (res?.status_cd === 0) {
        setType('');
        if (typeof getBranchesData === 'function') {
          getBranchesData();
        }
        if (typeof getBranches === 'function') {
          getBranches();
        }
        resetForm();
        handleClose();
        dispatch(
          openSnackbar({
            open: true,
            message: type === 'edit' ? 'Branch Updated Successfully' : 'Branch Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res?.data?.data || 'Unknown error'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });
  const renderFields = (fields) => {
    return fields.map((field) => {
      return (
        <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
          <Typography gutterBottom>{field.label}</Typography>
          <TextField
            value={values[field.name]}
            name={field.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            sx={{ width: '100%' }}
          />
        </Grid2>
      );
    });
  };

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  useEffect(() => {
    if (selectedRecord) {
      setValues(selectedRecord);
    }
  }, [selectedRecord]);
  return (
    <Modal
      open={open}
      showClose={true}
      title={type === 'edit' ? 'Edit Branch' : 'Add Branch'}
      handleClose={() => {
        setType('');
        resetForm(); // Optional
        handleClose(); // <- this closes the modal
      }}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              setType('');
              resetForm();
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
        <Grid2 container spacing={3}>
          {renderFields(branchFields)}
        </Grid2>
      </Box>
    </Modal>
  );
};

export default AddBranchDialog;
