import React, { useState, useEffect } from 'react';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import { Typography } from '@mui/material';
import { Grid2 } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Stack, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Modal from 'ui-component/extended/Modal';
import CustomInput from 'utils/CustomInput';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconPlus } from '@tabler/icons-react';
export default function BranchesInfo({ handleBack, handleNext }) {
  const [branches, setBranches] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const branchFields = [
    { name: 'branch_name', label: 'Branch Name' },
    { name: 'branch_code', label: 'Branch Code' }
  ];
  const getBranches = async () => {
    const { res } = await Factory('get', `/user_management/branches/${user.active_context.business_id}/`, {}, {});
    if (res.status_cd === 0) {
      setBranches(res.data);
    }
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          message: res.message || 'Failed to get branches',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const handleRemoveBranch = async (index) => {
    let url = `/user_management/branches/${branches[index].id}/`;

    let response = await Factory('delete', url, {});
    if (response.res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Branch deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      getBranches();
    } else {
      dispatch(
        openSnackbar({
          message: response.res.message || 'Failed to delete branch',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const handleOpenDialog = () => {
    setOpen(true);
    setType('add');
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleEditBranch = (index) => {
    setOpen(true);
    setType('edit');
    setSelectedRecord(branches[index]);
    setValues(branches[index]);
  };
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
      const url = type === 'edit' ? `/user_management/branches/${selectedRecord.id}/` : '/user_management/branches/';
      let postmethod = type === 'edit' ? 'put' : 'post';
      const { res } = await Factory(postmethod, url, postData);
      if (res?.status_cd === 0) {
        setType('');
        getBranches();
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
            message: JSON.stringify(res?.data?.data?.error || 'Unknown error'),
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
          <Typography gutterBottom>
            {field.label} {<span style={{ color: 'red' }}>*</span>}
          </Typography>
          <CustomInput
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
  useEffect(() => {
    getBranches();
  }, []);
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4"></Typography>
          <Button startIcon={<IconPlus size={16} />} variant="contained" color="primary" onClick={handleOpenDialog}>
            Add Branch
          </Button>
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>Branch Name</TableCell>
                <TableCell>Branch Code</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch, index) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.branch_name}</TableCell>
                  <TableCell>{branch.branch_code}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" size="small" onClick={() => handleEditBranch(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleRemoveBranch(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              navigate('/app/invoice');
            }}
          >
            Back to Dashboard
          </Button>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Box>
      </Grid2>
    </Grid2>
  );
}
