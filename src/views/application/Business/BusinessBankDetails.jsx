import React, { useState } from 'react';
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
  Paper,
  Card
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const validationSchema = Yup.object({
  bank_name: Yup.string().required('Bank name is required'),
  account_number: Yup.string()
    .required('Account number is required')
    .matches(/^\d{9,18}$/, 'Account number must be between 9 and 18 digits'),
  branch_name: Yup.string().required('Branch name is required'),
  ifsc: Yup.string()
    .required('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  swift_code: Yup.string().matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code')
});

const BusinessBankDetails = () => {
  const [open, setOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const account = bankAccounts[index];
    formik.setValues(account);
    setEditIndex(index);
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      bank_name: '',
      account_number: '',
      branch_name: '',
      ifsc: '',
      swift_code: ''
    },
    validationSchema,
    onSubmit: (values) => {
      if (editIndex !== null) {
        // Update existing account
        const updatedAccounts = [...bankAccounts];
        updatedAccounts[editIndex] = values;
        setBankAccounts(updatedAccounts);
      } else {
        // Add new account
        setBankAccounts([...bankAccounts, values]);
      }
      handleClose();
    }
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" color="text.primary">
          Business Bank Account Details
        </Typography>
        <Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Bank
        </Button>
      </Box>

      {/* Bank Accounts Table */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          '& .MuiTableContainer-root': {
            borderRadius: 0
          },
          '& .MuiTableCell-root': {
            color: 'text.primary'
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            py: 1,
            backgroundColor: 'primary.dark',
            color: '#fff'
          }
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Bank Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IFSC</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Swift Code</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '100px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankAccounts.map((account, index) => (
                <TableRow key={index} hover>
                  <TableCell>{account.bank_name}</TableCell>
                  <TableCell>{account.account_number}</TableCell>
                  <TableCell>{account.branch_name}</TableCell>
                  <TableCell>{account.ifsc}</TableCell>
                  <TableCell>{account.swift_code}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(index)} sx={{ color: 'primary.main' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const updatedAccounts = [...bankAccounts];
                        updatedAccounts.splice(index, 1);
                        setBankAccounts(updatedAccounts);
                      }}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {bankAccounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.primary' }}>
                    No bank accounts added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Bank Dialog */}
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
                  error={formik.touched.bank_name && Boolean(formik.errors.bank_name)}
                  helperText={formik.touched.bank_name && formik.errors.bank_name}
                  InputLabelProps={{
                    sx: { color: 'text.primary' }
                  }}
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
                  error={formik.touched.account_number && Boolean(formik.errors.account_number)}
                  helperText={formik.touched.account_number && formik.errors.account_number}
                  InputLabelProps={{
                    sx: { color: 'text.primary' }
                  }}
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
                  error={formik.touched.branch_name && Boolean(formik.errors.branch_name)}
                  helperText={formik.touched.branch_name && formik.errors.branch_name}
                  InputLabelProps={{
                    sx: { color: 'text.primary' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="ifsc"
                  name="ifsc"
                  label="IFSC Code"
                  value={formik.values.ifsc}
                  onChange={formik.handleChange}
                  error={formik.touched.ifsc && Boolean(formik.errors.ifsc)}
                  helperText={formik.touched.ifsc && formik.errors.ifsc}
                  InputLabelProps={{
                    sx: { color: 'text.primary' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  id="swift_code"
                  name="swift_code"
                  label="Swift Code"
                  value={formik.values.swift_code}
                  onChange={formik.handleChange}
                  error={formik.touched.swift_code && Boolean(formik.errors.swift_code)}
                  helperText={formik.touched.swift_code && formik.errors.swift_code}
                  InputLabelProps={{
                    sx: { color: 'text.primary' }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} size="small" sx={{ color: 'text.primary' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small" color="primary">
              {editIndex !== null ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BusinessBankDetails;
