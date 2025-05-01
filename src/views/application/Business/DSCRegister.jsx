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
  Stack,
  Tooltip,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'store';
import Factory from 'utils/Factory';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';

const dscTypes = ['Class 2', 'Class 3'];
const issuingAuthorities = ['eMudhra', 'Sify', 'Capricorn', 'NSDL'];

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  dsc_type: Yup.string().required('DSC Type is required'),
  dsc_number: Yup.string().required('DSC Number is required'),
  issue_authority: Yup.string().required('Issuing Authority is required'),
  date_of_issue: Yup.string().required('Date of Issue is required'),
  date_of_expiry: Yup.string().required('Date of Expiry is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile_number: Yup.string()
    .required('Mobile Number is required')
    .matches(/^[+]?[6-9]\d{9,12}$/, 'Invalid mobile number'),
  location: Yup.string().required('Location is required')
});

const DSCRegister = () => {
  const [dscList, setDscList] = useState([]);
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

  useEffect(() => {
    fetchDSCList();
  }, []);

  const fetchDSCList = async () => {
    try {
      const response = await Factory('get', `/user_management/dsc-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setDscList(response.res.data);
      } else {
        showNotification('Failed to fetch DSC list', 'error');
      }
    } catch (error) {
      console.error('Error fetching DSC list:', error);
      showNotification('Failed to fetch DSC list', 'error');
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    formik.setValues({ ...dscList[index] });
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
      const response = await Factory('delete', `/user_management/dsc-details/${dscList[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setDscList(dscList.filter((_, i) => i !== deleteIndex));
        showNotification('DSC deleted successfully');
      } else {
        showNotification('Failed to delete DSC', 'error');
      }
    } catch (error) {
      console.error('Error deleting DSC:', error);
      showNotification('Failed to delete DSC', 'error');
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

  const formik = useFormik({
    initialValues: {
      name: '',
      dsc_type: '',
      dsc_number: '',
      issue_authority: '',
      date_of_issue: '',
      date_of_expiry: '',
      email: '',
      mobile_number: '',
      location: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          business: user.active_context.business_id
        };

        let url = '/user_management/dsc-details/';
        let type = 'post';
        if (editIndex !== null) {
          url = `/user_management/dsc-details/${dscList[editIndex].id}/`;
          type = 'put';
        }

        const response = await Factory(type, url, payload, {});

        if (response.res.status_cd === 0) {
          if (editIndex !== null) {
            const updated = [...dscList];
            updated[editIndex] = response.res.data;
            setDscList(updated);
            showNotification('DSC updated successfully');
          } else {
            setDscList([...dscList, response.res]);
            showNotification('DSC added successfully');
          }
          handleClose();
        } else {
          showNotification(response.res.status_msg || 'Failed to save DSC', 'error');
        }
      } catch (error) {
        console.error('Error submitting DSC:', error);
        showNotification('Failed to save DSC', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          DSC Register
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
          Add DSC
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
                <TableCell>Name</TableCell>
                <TableCell>DSC Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Valid Till</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dscList.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.dsc_number}</TableCell>
                  <TableCell>{row.dsc_type}</TableCell>
                  <TableCell>{row.date_of_expiry}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
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
              {dscList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No DSCs added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit DSC Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit DSC' : 'Add DSC'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="dsc_number"
                  name="dsc_number"
                  label="DSC Number"
                  value={formik.values.dsc_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dsc_number && Boolean(formik.errors.dsc_number)}
                  helperText={formik.touched.dsc_number && formik.errors.dsc_number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={formik.touched.dsc_type && Boolean(formik.errors.dsc_type)}>
                  <InputLabel>DSC Type</InputLabel>
                  <Select
                    id="dsc_type"
                    name="dsc_type"
                    value={formik.values.dsc_type}
                    label="DSC Type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {dscTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={formik.touched.issue_authority && Boolean(formik.errors.issue_authority)}>
                  <InputLabel>Issuing Authority</InputLabel>
                  <Select
                    id="issue_authority"
                    name="issue_authority"
                    value={formik.values.issue_authority}
                    label="Issuing Authority"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {issuingAuthorities.map((auth) => (
                      <MenuItem key={auth} value={auth}>
                        {auth}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="date_of_issue"
                  name="date_of_issue"
                  label="Date of Issue"
                  type="date"
                  value={formik.values.date_of_issue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.date_of_issue && Boolean(formik.errors.date_of_issue)}
                  helperText={formik.touched.date_of_issue && formik.errors.date_of_issue}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="date_of_expiry"
                  name="date_of_expiry"
                  label="Date of Expiry"
                  type="date"
                  value={formik.values.date_of_expiry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.date_of_expiry && Boolean(formik.errors.date_of_expiry)}
                  helperText={formik.touched.date_of_expiry && formik.errors.date_of_expiry}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="mobile_number"
                  name="mobile_number"
                  label="Mobile Number"
                  value={formik.values.mobile_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
                  helperText={formik.touched.mobile_number && formik.errors.mobile_number}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  id="location"
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
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
              disabled={formik.isSubmitting}
              sx={{ position: 'relative', minWidth: '100px' }}
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
        title="Delete DSC"
        message="Are you sure you want to delete this DSC? This action cannot be undone."
        itemName={deleteIndex !== null ? `DSC: ${dscList[deleteIndex]?.dsc_number}` : ''}
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

export default DSCRegister;
