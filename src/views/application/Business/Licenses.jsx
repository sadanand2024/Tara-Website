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
import DownloadIcon from '@mui/icons-material/Download';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'store';
import Factory from 'utils/Factory';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';

const validationSchema = Yup.object().shape({
  license_type: Yup.string().required('License Type is required'),
  license_number: Yup.string().required('License Number is required'),
  location: Yup.string().required('Location is required'),
  date_of_issue: Yup.string().required('Date of Issue is required'),
  date_of_expiry: Yup.string().required('Date of Expiry is required'),
  license_document: Yup.mixed()
});

const licenseTypeOptions = ['Trade License', 'Labour License', 'Food License', 'Trade Mark'];

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
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
    fetchLicenses();
  }, []);

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

  const fetchLicenses = async () => {
    try {
      const response = await Factory('get', `/user_management/license-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setLicenses(response.res.data);
      } else {
        showNotification('Failed to fetch licenses', 'error');
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
      showNotification('Failed to fetch licenses', 'error');
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
    const itemToEdit = licenses[index];
    const newValues = { ...itemToEdit };
    delete newValues['license_document'];
    formik.setValues(newValues);
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
      const response = await Factory('delete', `/user_management/license-details/${licenses[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setLicenses(licenses.filter((_, i) => i !== deleteIndex));
        showNotification('License deleted successfully');
      } else {
        showNotification('Failed to delete license', 'error');
      }
    } catch (error) {
      console.error('Error deleting license:', error);
      showNotification('Failed to delete license', 'error');
    } finally {
      handleDeleteClose();
    }
  };

  const formik = useFormik({
    initialValues: {
      license_type: '',
      license_number: '',
      location: '',
      date_of_issue: '',
      date_of_expiry: '',
      license_document: null
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key === 'license_document' && values[key] instanceof File) {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        });
        formData.append('business', user.active_context.business_id);

        let url = '/user_management/license-details/';
        let type = 'post';
        if (editIndex !== null) {
          url = `/user_management/license-details/${licenses[editIndex].id}/`;
          type = 'put';
        }

        const response = await Factory(type, url, formData, {}, true);

        if (response.res.status_cd === 0) {
          if (editIndex !== null) {
            const updated = [...licenses];
            updated[editIndex] = response.res.data;
            setLicenses(updated);
            showNotification('License updated successfully');
          } else {
            setLicenses([...licenses, response.res]);
            showNotification('License added successfully');
          }
          handleClose();
        } else {
          showNotification(response.res.status_msg || 'Failed to save license', 'error');
        }
      } catch (error) {
        console.error('Error submitting license:', error);
        showNotification('Failed to save license', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleDocDownload = async (documentUrl) => {
    try {
      if (!documentUrl) {
        showNotification('No document available for download', 'error');
        return;
      }
      window.open(documentUrl, '_blank');
      showNotification('Document download started');
    } catch (error) {
      console.error('Error downloading document:', error);
      showNotification('Failed to download document', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Licenses
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
          Add License
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
                <TableCell>License Type</TableCell>
                <TableCell>License Number</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Doc</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {licenses.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.license_type}</TableCell>
                  <TableCell>{row.license_number}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.date_of_expiry}</TableCell>
                  <TableCell>
                    {row.license_document && (
                      <Tooltip title="Download Document">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDocDownload(row.license_document)}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
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
              {licenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No licenses added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit License Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit License' : 'Add License'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={formik.touched.license_type && Boolean(formik.errors.license_type)}>
                  <InputLabel>License Type</InputLabel>
                  <Select
                    id="license_type"
                    name="license_type"
                    value={formik.values.license_type}
                    label="License Type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {licenseTypeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="license_number"
                  name="license_number"
                  label="License Number"
                  value={formik.values.license_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.license_number && Boolean(formik.errors.license_number)}
                  helperText={formik.touched.license_number && formik.errors.license_number}
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
              <Grid item xs={12}>
                <Box>
                  <Button variant="outlined" component="label" fullWidth size="small" sx={{ height: '40px', mb: 1 }}>
                    {editIndex !== null && licenses[editIndex]?.license_document ? 'Replace Document' : 'Upload Document'}
                    <input 
                      type="file" 
                      hidden 
                      onChange={(e) => formik.setFieldValue('license_document', e.currentTarget.files[0])} 
                    />
                  </Button>
                  {editIndex !== null && licenses[editIndex]?.license_document && !formik.values.license_document && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption">Current file:</Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleDocDownload(licenses[editIndex].license_document)}
                      >
                        Download Current Document
                      </Button>
                    </Box>
                  )}
                  {formik.values.license_document && (
                    <Typography variant="caption">
                      New file: {formik.values.license_document.name}
                    </Typography>
                  )}
                </Box>
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
        title="Delete License"
        message="Are you sure you want to delete this license? This action cannot be undone."
        itemName={deleteIndex !== null ? `License: ${licenses[deleteIndex]?.license_number}` : ''}
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

export default Licenses;
