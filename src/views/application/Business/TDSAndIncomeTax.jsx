import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Tooltip,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'store';
import Factory from 'utils/Factory';
import { INDIAN_STATES } from 'utils/constants';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';

const initialTDS = [
  {
    tan: 'DELH12345B',
    trade_name: 'Acme Corp',
    location: 'Delhi',
    deductor_category: 'Company',
    deductor_type: 'Government',
    pan: 'AAAPL1234C',
    state: 'Delhi',
    status: 'Active'
  }
];

const deductorCategories = ['Company', 'Individual', 'Firm', 'Trust'];
const deductorTypes = ['Government', 'Non-Government'];

const validationSchema = Yup.object().shape({
  tan_number: Yup.string()
    .required('TAN is required')
    .matches(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, 'Invalid TAN format'),
  pan: Yup.string()
    .required('PAN is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  legal_name: Yup.string().required('Legal Name is required'),
  trade_name: Yup.string().required('Trade Name is required'),
  location: Yup.string().required('Location/Vertical is required'),
  deductor_category: Yup.string().required('Deductor Category is required'),
  deductor_type: Yup.string().required('Type of Deductor is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required').oneOf(INDIAN_STATES, 'Please select a valid state'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode format'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile_number: Yup.string()
    .required('Contact Number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  tds_username: Yup.string().required('Username is required'),
  tds_password: Yup.string().required('Password is required'),
  authorized_personal_Details: Yup.object().shape({
    name: Yup.string().required('Name of Responsible Person is required'),
    designation: Yup.string().required('Designation is required'),
    pan_of_RP: Yup.string()
      .required('PAN of RP is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
    mobile: Yup.string()
      .required('Mobile is required')
      .matches(/^[6-9]\d{9}$/, 'Invalid mobile number'),
    email: Yup.string().email('Invalid email').required('Email is required')
  }),
  income_tax_details: Yup.object().shape({
    pan: Yup.string()
      .required('PAN is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
    password: Yup.string().required('Password is required'),
    registered_mobile_number: Yup.string()
      .required('Registered Mobile Number is required')
      .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
  })
});

const TDSAndIncomeTax = () => {
  const [tdsList, setTdsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const user = useSelector((state) => state).accountReducer.user;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const itemToEdit = tdsList[index];
    formik.setValues({
      ...itemToEdit,
      authorized_personal_Details: {
        ...formik.values.authorized_personal_Details,
        ...itemToEdit.authorized_personal_Details
      },
      income_tax_details: {
        ...formik.values.income_tax_details,
        ...itemToEdit.income_tax_details
      }
    });
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
      const response = await Factory('delete', `/user_management/tds-details/${tdsList[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setTdsList(tdsList.filter((_, i) => i !== deleteIndex));
        showNotification('TDS details deleted successfully');
      } else {
        showNotification('Failed to delete TDS details', 'error');
      }
    } catch (error) {
      console.error('Error deleting TDS details:', error);
      showNotification('Failed to delete TDS details', 'error');
    } finally {
      handleDeleteClose();
    }
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

  const fetchTDSDetails = async () => {
    try {
      const response = await Factory('get', `/user_management/tds-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setTdsList(response.res.data);
      } else {
        showNotification('Failed to fetch TDS details', 'error');
      }
    } catch (error) {
      console.error('Error fetching TDS details:', error);
      showNotification('Failed to fetch TDS details', 'error');
    }
  };

  const formik = useFormik({
    initialValues: {
      tan_number: '',
      pan: '',
      legal_name: '',
      trade_name: '',
      location: '',
      deductor_category: '',
      deductor_type: '',
      address: '',
      state: '',
      pincode: '',
      email: '',
      mobile_number: '',
      tds_username: '',
      tds_password: '',
      authorized_personal_Details: {
        name: '',
        designation: '',
        pan_of_RP: '',
        mobile: '',
        email: ''
      },
      income_tax_details: {
        pan: '',
        password: '',
        registered_mobile_number: ''
      }
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          business: user.active_context.business_id,
          authorized_personal_details: {
            name: values.authorized_personal_name,
            designation: values.authorized_personal_designation,
            mobile_number: values.authorized_personal_mobile,
            email: values.authorized_personal_email
          },
          income_tax_details: {
            ward: values.ward,
            ao_type: values.ao_type,
            range: values.range,
            ao_number: values.ao_number
          }
        };

        // Remove individual fields that are now in nested objects
        delete payload.authorized_personal_name;
        delete payload.authorized_personal_designation;
        delete payload.authorized_personal_mobile;
        delete payload.authorized_personal_email;
        delete payload.ward;
        delete payload.ao_type;
        delete payload.range;
        delete payload.ao_number;

        let url = '/user_management/tds-details/';
        let type = 'post';
        if (editIndex !== null) {
          url = `/user_management/tds-details/${tdsList[editIndex].id}/`;
          type = 'put';
        }

        const response = await Factory(type, url, payload, {});

        if (response.res.status_cd === 0) {
          if (editIndex !== null) {
            const updated = [...tdsList];
            updated[editIndex] = response.res.data;
            setTdsList(updated);
            showNotification('TDS details updated successfully');
          } else {
            setTdsList([...tdsList, response.res]);
            showNotification('TDS details added successfully');
          }
          handleClose();
        } else {
          showNotification(response.res.status_msg || 'Failed to save TDS details', 'error');
        }
      } catch (error) {
        console.error('Error submitting TDS details:', error);
        showNotification('Failed to save TDS details', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    fetchTDSDetails();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          TDS & Income Tax
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
          Add TAN
        </Button>
      </Box>
      <Card
        elevation={2}
        sx={{
          mb: 2,
          '& .MuiTableContainer-root': { borderRadius: 0 },
          '& .MuiTableCell-root': { color: 'text.primary' },
          '& .MuiTableHead-root .MuiTableCell-root': { py: 1, backgroundColor: 'primary.dark', color: '#fff' }
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>TAN</TableCell>
                <TableCell>Trade Name</TableCell>
                <TableCell>Location/Vertical</TableCell>
                <TableCell>Deductor Category</TableCell>
                <TableCell>Deductor Type</TableCell>
                <TableCell>State</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tdsList.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.tan_number}</TableCell>
                  <TableCell>{row.trade_name}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.deductor_category}</TableCell>
                  <TableCell>{row.deductor_type}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View/Edit">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(idx)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {tdsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    No TDS records added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit TDS Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit TDS Details' : 'Add TDS Details'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            {/* Deductor Details Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Deductor Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tan_number"
                    name="tan_number"
                    label="TAN"
                    value={formik.values.tan_number}
                    onChange={formik.handleChange}
                    error={formik.touched.tan_number && Boolean(formik.errors.tan_number)}
                    helperText={formik.touched.tan_number && formik.errors.tan_number}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="pan"
                    name="pan"
                    label="PAN"
                    value={formik.values.pan}
                    onChange={formik.handleChange}
                    error={formik.touched.pan && Boolean(formik.errors.pan)}
                    helperText={formik.touched.pan && formik.errors.pan}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="legal_name"
                    name="legal_name"
                    label="Legal Name"
                    value={formik.values.legal_name}
                    onChange={formik.handleChange}
                    error={formik.touched.legal_name && Boolean(formik.errors.legal_name)}
                    helperText={formik.touched.legal_name && formik.errors.legal_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="trade_name"
                    name="trade_name"
                    label="Trade Name"
                    value={formik.values.trade_name}
                    onChange={formik.handleChange}
                    error={formik.touched.trade_name && Boolean(formik.errors.trade_name)}
                    helperText={formik.touched.trade_name && formik.errors.trade_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="location"
                    name="location"
                    label="Location/Vertical"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small" error={formik.touched.deductor_category && Boolean(formik.errors.deductor_category)}>
                    <InputLabel>Deductor Category</InputLabel>
                    <Select
                      id="deductor_category"
                      name="deductor_category"
                      value={formik.values.deductor_category}
                      label="Deductor Category"
                      onChange={formik.handleChange}
                    >
                      {deductorCategories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small" error={formik.touched.deductor_type && Boolean(formik.errors.deductor_type)}>
                    <InputLabel>Type of Deductor</InputLabel>
                    <Select
                      id="deductor_type"
                      name="deductor_type"
                      value={formik.values.deductor_type}
                      label="Type of Deductor"
                      onChange={formik.handleChange}
                    >
                      {deductorTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="address"
                    name="address"
                    label="Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small" error={formik.touched.state && Boolean(formik.errors.state)}>
                    <InputLabel>State</InputLabel>
                    <Select
                      id="state"
                      name="state"
                      value={formik.values.state}
                      label="State"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {INDIAN_STATES.map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.state && formik.errors.state && <FormHelperText>{formik.errors.state}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="pincode"
                    name="pincode"
                    label="Pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                    helperText={formik.touched.pincode && formik.errors.pincode}
                    inputProps={{ maxLength: 6 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="email"
                    name="email"
                    label="Email ID"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="mobile_number"
                    name="mobile_number"
                    label="Contact Number"
                    value={formik.values.mobile_number}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
                    helperText={formik.touched.mobile_number && formik.errors.mobile_number}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tds_username"
                    name="tds_username"
                    autoComplete="new-username"
                    label="Username (TDS Compliance)"
                    value={formik.values.tds_username}
                    onChange={formik.handleChange}
                    error={formik.touched.tds_username && Boolean(formik.errors.tds_username)}
                    helperText={formik.touched.tds_username && formik.errors.tds_username}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tds_password"
                    name="tds_password"
                    autoComplete="new-password"
                    label="Password (TDS Compliance)"
                    type="password"
                    value={formik.values.tds_password}
                    onChange={formik.handleChange}
                    error={formik.touched.tds_password && Boolean(formik.errors.tds_password)}
                    helperText={formik.touched.tds_password && formik.errors.tds_password}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Authorized Person Details Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Authorized Person Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="authorized_personal_Details.name"
                    name="authorized_personal_Details.name"
                    label="Name of Responsible Person"
                    value={formik.values.authorized_personal_Details.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.authorized_personal_Details?.name && Boolean(formik.errors.authorized_personal_Details?.name)}
                    helperText={formik.touched.authorized_personal_Details?.name && formik.errors.authorized_personal_Details?.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="authorized_personal_Details.designation"
                    name="authorized_personal_Details.designation"
                    label="Designation"
                    value={formik.values.authorized_personal_Details.designation}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.authorized_personal_Details?.designation &&
                      Boolean(formik.errors.authorized_personal_Details?.designation)
                    }
                    helperText={
                      formik.touched.authorized_personal_Details?.designation && formik.errors.authorized_personal_Details?.designation
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="authorized_personal_Details.pan_of_RP"
                    name="authorized_personal_Details.pan_of_RP"
                    label="PAN of RP"
                    value={formik.values.authorized_personal_Details.pan_of_RP}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.authorized_personal_Details?.pan_of_RP && Boolean(formik.errors.authorized_personal_Details?.pan_of_RP)
                    }
                    helperText={
                      formik.touched.authorized_personal_Details?.pan_of_RP && formik.errors.authorized_personal_Details?.pan_of_RP
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="authorized_personal_Details.mobile"
                    name="authorized_personal_Details.mobile"
                    label="Mobile"
                    value={formik.values.authorized_personal_Details.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.authorized_personal_Details?.mobile && Boolean(formik.errors.authorized_personal_Details?.mobile)}
                    helperText={formik.touched.authorized_personal_Details?.mobile && formik.errors.authorized_personal_Details?.mobile}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="authorized_personal_Details.email"
                    name="authorized_personal_Details.email"
                    label="Email"
                    value={formik.values.authorized_personal_Details.email}
                    onChange={formik.handleChange}
                    error={formik.touched.authorized_personal_Details?.email && Boolean(formik.errors.authorized_personal_Details?.email)}
                    helperText={formik.touched.authorized_personal_Details?.email && formik.errors.authorized_personal_Details?.email}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Income Tax Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Income Tax
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="income_tax_details.pan"
                    name="income_tax_details.pan"
                    label="PAN"
                    value={formik.values.income_tax_details.pan}
                    onChange={formik.handleChange}
                    error={formik.touched.income_tax_details?.pan && Boolean(formik.errors.income_tax_details?.pan)}
                    helperText={formik.touched.income_tax_details?.pan && formik.errors.income_tax_details?.pan}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="income_tax_details.password"
                    name="income_tax_details.password"
                    label="Password"
                    type="password"
                    value={formik.values.income_tax_details.password}
                    onChange={formik.handleChange}
                    error={formik.touched.income_tax_details?.password && Boolean(formik.errors.income_tax_details?.password)}
                    helperText={formik.touched.income_tax_details?.password && formik.errors.income_tax_details?.password}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="income_tax_details.registered_mobile_number"
                    name="income_tax_details.registered_mobile_number"
                    label="Registered Mobile Number"
                    value={formik.values.income_tax_details.registered_mobile_number}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.income_tax_details?.registered_mobile_number &&
                      Boolean(formik.errors.income_tax_details?.registered_mobile_number)
                    }
                    helperText={
                      formik.touched.income_tax_details?.registered_mobile_number &&
                      formik.errors.income_tax_details?.registered_mobile_number
                    }
                  />
                </Grid>
              </Grid>
            </Box>
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
              disabled={formik.isSubmitting}
              onClick={formik.handleSubmit}
              sx={{ position: 'relative' }}
            >
              {formik.isSubmitting ? (
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
        title="Delete TDS Details"
        message="Are you sure you want to delete these TDS details? This action cannot be undone."
        itemName={deleteIndex !== null ? `TAN: ${tdsList[deleteIndex]?.tan_number}` : ''}
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

export default TDSAndIncomeTax;
