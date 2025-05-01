import React, { useEffect, useState } from 'react';
import {
  Grid,
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
  Card,
  CircularProgress,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'store';
import Factory from 'utils/Factory';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';

const validationSchema = Yup.object().shape({
  bank_name: Yup.string().required('Bank name is required'),
  account_number: Yup.string()
    .required('Account number is required')
    .matches(/^\d{9,18}$/, 'Account number must be between 9 and 18 digits'),
  branch_name: Yup.string().required('Branch name is required'),
  ifsc_code: Yup.string()
    .required('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  swift_code: Yup.string()
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code')
    .nullable()
});

const BusinessBankDetails = () => {
  const [open, setOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const user = useSelector((state) => state).accountReducer.user;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const fetchBankAccounts = async () => {
    try {
      const response = await Factory('get', `/user_management/bank-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setBankAccounts(response.res.data);
      } else {
        showNotification('Failed to fetch bank accounts', 'error');
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      showNotification('Failed to fetch bank accounts', 'error');
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const handleEdit = (index) => {
    const account = bankAccounts[index];
    formik.setValues({ ...account });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = async () => {
    try {
      const response = await Factory('delete', `/user_management/bank-details/${bankAccounts[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setBankAccounts(bankAccounts.filter((_, i) => i !== deleteIndex));
        showNotification('Bank account deleted successfully');
      } else {
        showNotification('Failed to delete bank account', 'error');
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
      showNotification('Failed to delete bank account', 'error');
    } finally {
      handleDeleteClose();
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
      setIsLoading(true);
      try {
        const payload = {
          ...values,
          business: user.active_context.business_id
        };

        let url = '/user_management/bank-details/';
        let type = 'post';
        if (editIndex !== null) {
          url = `/user_management/bank-details/${bankAccounts[editIndex].id}/`;
          type = 'put';
        }

        const response = await Factory(type, url, payload, {});

        if (response.res.status_cd === 0) {
          if (editIndex !== null) {
            const updated = [...bankAccounts];
            updated[editIndex] = response.res.data;
            setBankAccounts(updated);
            showNotification('Bank account updated successfully');
          } else {
            setBankAccounts([...bankAccounts, response.res]);
            showNotification('Bank account added successfully');
          }
          handleClose();
        } else {
          showNotification(response.res.status_msg || 'Failed to save bank account', 'error');
        }
      } catch (error) {
        console.error('Error submitting bank details:', error);
        showNotification('Failed to save bank account', 'error');
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" color="text.primary">
          Business Bank Account Details
        </Typography>
        <Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Bank
        </Button>
      </Box>

      <Card
        elevation={2}
        sx={{
          mb: 3,
          '& .MuiTableContainer-root': { borderRadius: 0 },
          '& .MuiTableCell-root': { color: 'text.primary' },
          '& .MuiTableHead-root .MuiTableCell-root': { py: 1, backgroundColor: 'primary.dark', color: '#fff' }
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Bank Name</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>IFSC</TableCell>
                <TableCell>Swift Code</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankAccounts.map((account, index) => (
                <TableRow key={index} hover>
                  <TableCell>{account.bank_name}</TableCell>
                  <TableCell>{account.account_number}</TableCell>
                  <TableCell>{account.branch_name}</TableCell>
                  <TableCell>{account.ifsc_code}</TableCell>
                  <TableCell>{account.swift_code || '-'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(index)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {bankAccounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No bank accounts added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit Bank Account' : 'Add Bank Account'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="bank_name"
                  name="bank_name"
                  label="Bank Name"
                  value={formik.values.bank_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.bank_name && Boolean(formik.errors.bank_name)}
                  helperText={formik.touched.bank_name && formik.errors.bank_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="account_number"
                  name="account_number"
                  label="Account Number"
                  value={formik.values.account_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.account_number && Boolean(formik.errors.account_number)}
                  helperText={formik.touched.account_number && formik.errors.account_number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="branch_name"
                  name="branch_name"
                  label="Branch Name"
                  value={formik.values.branch_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.branch_name && Boolean(formik.errors.branch_name)}
                  helperText={formik.touched.branch_name && formik.errors.branch_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="ifsc_code"
                  name="ifsc_code"
                  label="IFSC Code"
                  value={formik.values.ifsc_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ifsc_code && Boolean(formik.errors.ifsc_code)}
                  helperText={formik.touched.ifsc_code && formik.errors.ifsc_code}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  id="swift_code"
                  name="swift_code"
                  label="Swift Code (Optional)"
                  value={formik.values.swift_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.swift_code && Boolean(formik.errors.swift_code)}
                  helperText={formik.touched.swift_code && formik.errors.swift_code}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} size="small" sx={{ color: 'text.primary' }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="small" 
              color="primary"
              disabled={formik.isSubmitting || isLoading}
              sx={{ position: 'relative', minWidth: '100px' }}
            >
              {(formik.isSubmitting || isLoading) ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px'
                    }}
                  />
                  {editIndex !== null ? 'Updating...' : 'Saving...'}
                </>
              ) : editIndex !== null ? (
                'Update'
              ) : (
                'Save'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        title="Delete Bank Account"
        message="Are you sure you want to delete this bank account? This action cannot be undone."
        itemName={deleteIndex !== null ? `Bank Account: ${bankAccounts[deleteIndex]?.account_number}` : ''}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BusinessBankDetails;
