import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';

const roles = ['CEO', 'CFO', 'CS', 'Director', 'Other'];

const getRoleColor = (role) => {
  switch (role) {
    case 'CEO':
      return 'error'; // Red for CEO
    case 'CFO':
      return 'warning'; // Orange for CFO
    case 'CS':
      return 'success'; // Green for Company Secretary
    case 'Director':
      return 'primary'; // Blue for Director
    default:
      return 'secondary'; // Purple for Other roles
  }
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  designation: Yup.string().required('Designation is required'),
  pan_number: Yup.string()
    .required('PAN Number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number format'),
  role: Yup.string().required('Role is required'),
  status: Yup.string().required('Status is required')
});

const KeyManagerialPersonnel = () => {
  const [personnel, setPersonnel] = useState([]);
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
    fetchPersonnel();
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

  const fetchPersonnel = async () => {
    try {
      const response = await Factory('get', `/user_management/kmp-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setPersonnel(response.res.data);
      } else {
        showNotification('Failed to fetch personnel list', 'error');
      }
    } catch (error) {
      console.error('Error fetching personnel:', error);
      showNotification('Failed to fetch personnel list', 'error');
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
    formik.setValues({ ...personnel[index] });
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
      const response = await Factory('delete', `/user_management/kmp-details/${personnel[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setPersonnel(personnel.filter((_, i) => i !== deleteIndex));
        showNotification('Personnel deleted successfully');
      } else {
        showNotification('Failed to delete personnel', 'error');
      }
    } catch (error) {
      console.error('Error deleting personnel:', error);
      showNotification('Failed to delete personnel', 'error');
    } finally {
      handleDeleteClose();
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      designation: '',
      pan_number: '',
      role: '',
      status: 'active'
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          business: user.active_context.business_id
        };

        let url = '/user_management/kmp-details/';
        let type = 'post';
        if (editIndex !== null) {
          url = `/user_management/kmp-details/${personnel[editIndex].id}/`;
          type = 'put';
        }

        const response = await Factory(type, url, payload, {});

        if (response.res.status_cd === 0) {
          if (editIndex !== null) {
            const updated = [...personnel];
            updated[editIndex] = response.res.data;
            setPersonnel(updated);
            showNotification('Personnel updated successfully');
          } else {
            setPersonnel([...personnel, response.res]);
            showNotification('Personnel added successfully');
          }
          handleClose();
        } else {
          showNotification(response.res.status_msg || 'Failed to save personnel', 'error');
        }
      } catch (error) {
        console.error('Error submitting personnel:', error);
        showNotification('Failed to save personnel', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h4" color="text.primary">
          Key Managerial Personnel
        </Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Personnel
        </Button>
      </Stack>

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
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>PAN Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personnel.map((person, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.designation}</TableCell>
                  <TableCell>{person.pan_number}</TableCell>
                  <TableCell>
                    <Chip 
                      label={person.role} 
                      color={getRoleColor(person.role)} 
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={person.status} 
                      color={person.status === 'active' ? 'success' : 'error'} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(idx)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {personnel.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No personnel added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Personnel Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit Personnel' : 'Add Personnel'}
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
                  id="designation"
                  name="designation"
                  label="Designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.designation && Boolean(formik.errors.designation)}
                  helperText={formik.touched.designation && formik.errors.designation}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="pan_number"
                  name="pan_number"
                  label="PAN Number"
                  value={formik.values.pan_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pan_number && Boolean(formik.errors.pan_number)}
                  helperText={formik.touched.pan_number && formik.errors.pan_number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={formik.touched.role && Boolean(formik.errors.role)}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    id="role"
                    name="role"
                    value={formik.values.role}
                    label="Role"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" error={formik.touched.status && Boolean(formik.errors.status)}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    id="status"
                    name="status"
                    value={formik.values.status}
                    label="Status"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
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
        title="Delete Personnel"
        message="Are you sure you want to delete this personnel? This action cannot be undone."
        itemName={deleteIndex !== null ? `Personnel: ${personnel[deleteIndex]?.name}` : ''}
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

export default KeyManagerialPersonnel;
 