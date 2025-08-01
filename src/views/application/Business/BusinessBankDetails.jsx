import React, { useEffect, useState } from 'react';
import {
  Grid2,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  Fade,
  Divider,
  Paper
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useSelector } from 'store';
import Factory from 'utils/Factory';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';
import MainCard from 'ui-component/cards/MainCard';
import Modal from 'ui-component/extended/Modal';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
const validationSchema = Yup.object().shape({
  bank_name: Yup.string().required('Bank name is required'),
  account_number: Yup.string()
    .required('Account number is required')
    .matches(/^\d{9,18}$/, 'Account number must be between 9 and 18 digits'),
  branch_name: Yup.string().required('Branch name is required'),
  ifsc_code: Yup.string().required('IFSC code is required'),
  swift_code: Yup.string()
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code')
    .nullable()
});
const fields = [
  { name: 'bank_name', label: 'Bank Name' },
  { name: 'account_number', label: 'Account Number' },
  { name: 'branch_name', label: 'Branch Name' },
  { name: 'ifsc_code', label: 'IFSC Code' },
  { name: 'swift_code', label: 'Swift Code' }
];
const BusinessBankDetails = ({ user, handleNext, handleBack, tabChange, tabval }) => {
  const [open, setOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedAccount);
    setOpenDeleteDialog(false);
    setSelectedAccount(null);
  };

  const fetchBankAccounts = async () => {
    setIsLoading(true);
    const { res } = await Factory('get', `/user_management/bank-details/${user.active_context.business_id}/`, {}, {});
    if (res.status_cd === 0) {
      setBankAccounts(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data || 'Failed to fetch bank accounts'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const handleEdit = (index) => {
    const account = bankAccounts[index];
    setValues({ ...account });
    setOpen(true);
  };

  const handleDelete = async (item) => {
    const { res } = await Factory('delete', `/user_management/bank-details/${item.id}/`, {}, {});
    if (res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Bank account deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      fetchBankAccounts();
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data || 'Failed to delete bank account'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      business: user?.active_context?.business_id,
      bank_name: '',
      account_number: '',
      branch_name: '',
      ifsc_code: '',
      swift_code: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        business: user.active_context.business_id
      };

      let url = '/user_management/bank-details/';
      let type = 'post';
      if (values.id) {
        url = `/user_management/bank-details/${values.id}/`;
        type = 'put';
      }

      const { res } = await Factory(type, url, payload, {});
      if (res.status_cd === 0) {
        // After successful add or update, fetch the latest bank accounts from the backend
        fetchBankAccounts();
        dispatch(
          openSnackbar({
            open: true,
            message: 'Bank account updated successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        handleClose();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res?.data.data || 'Failed to save bank account'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
      setSubmitting(false);
    }
  });
  const getLabelWithAsterisk = (label, isRequired) => (
    <Typography variant="body2" fontWeight={500} gutterBottom sx={{ display: 'inline-block' }}>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </Typography>
  );
  const renderFields = () => {
    const requiredFields = ['bank_name', 'account_number', 'branch_name', 'ifsc_code'];

    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        {getLabelWithAsterisk(field.label, requiredFields.includes(field.name))}
        <TextField
          fullWidth
          size="small"
          // label={field.label}
          name={field.name}
          value={values[field.name] || ''}
          onChange={(e) => {
            if (field.name === 'account_number') {
              const value = e.target.value.replace(/\D/g, '');
              setFieldValue(field.name, value);
            } else if (field.name === 'bank_name' || field.name === 'ifsc_code') {
              const value = e.target.value.toUpperCase();
              setFieldValue(field.name, value);
            } else if (field.name === 'swift_code') {
              const value = e.target.value.toUpperCase();
              setFieldValue(field.name, value);
            } else {
              setFieldValue(field.name, e.target.value);
            }
          }}
          onBlur={handleBlur}
          error={touched[field.name] && Boolean(errors[field.name])}
          helperText={touched[field.name] && errors[field.name] ? errors[field.name] : ''}
        />
      </Grid2>
    ));
  };
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h5" color="text.secondary">
          Loading Bank Accounts...
        </Typography>
      </Box>
    );
  }
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  return (
    <MainCard
      title="Bank Accounts"
      subtitle="Manage your business bank accounts for seamless financial operations"
      // icon={<AccountBalanceIcon color="primary" />}
      action={
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          Add Bank Account
        </Button>
      }
    >
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: 1,
          overflowX: 'auto'
        }}
      >
        <Table size="small">
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important'
              }
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Bank Name</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Account Number</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Branch</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>IFSC Code</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Swift Code</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankAccounts.filter(Boolean).length > 0 ? (
              bankAccounts.filter(Boolean).map((account, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} sx={{ whiteSpace: 'nowrap' }}>
                      {account.bank_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {account.account_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {account.branch_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {account.ifsc_code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {account.swift_code || 'NA'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit Bank Account">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(index)}
                          sx={{
                            backgroundColor: 'primary.50',
                            '&:hover': { backgroundColor: 'primary.100' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Bank Account">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(account)}
                          sx={{
                            backgroundColor: 'error.50',
                            '&:hover': { backgroundColor: 'error.100' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    <AccountBalanceIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Bank Accounts Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first bank account for business transactions
                    </Typography>
                    <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Add First Bank Account
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleBack}>
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Stack>
      </Box>
      <Modal
        open={open}
        maxWidth="sm"
        showClose={true}
        title={values.id ? 'Edit Bank Account' : 'Add Bank Account'}
        handleClose={() => {
          resetForm();
          handleClose();
        }}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button
              onClick={() => {
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
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Grid2 container spacing={2}>
            {renderFields()}
          </Grid2>
        </Box>
      </Modal>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        dialogData={{
          title: 'Delete Bank Account',
          heading: 'Are you sure?',
          description: 'This action will permanently delete the selected bank account.'
        }}
      />
    </MainCard>
  );
};

export default BusinessBankDetails;
