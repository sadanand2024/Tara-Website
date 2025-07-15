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
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import { useSelector } from 'store';
import Factory from 'utils/Factory';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import MainCard from 'ui-component/cards/MainCard';
import Modal from 'ui-component/extended/Modal';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const roles = ['CEO', 'CFO', 'CS', 'Director', 'Other'];

const getRoleColor = (role) => {
  switch (role) {
    case 'CEO':
      return 'error';
    case 'CFO':
      return 'warning';
    case 'CS':
      return 'success';
    case 'Director':
      return 'primary';
    default:
      return 'secondary';
  }
};

const getRoleIcon = (role) => {
  switch (role) {
    case 'CEO':
      return '👑';
    case 'CFO':
      return '💰';
    case 'CS':
      return '⚖️';
    case 'Director':
      return '🎯';
    default:
      return '👤';
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

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'designation', label: 'Designation', required: true },
  { name: 'pan_number', label: 'PAN Number', required: true },
  { name: 'role', label: 'Role', type: 'select', options: roles, required: true },
  { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: false }
];

const KeyManagerialPersonnel = ({ user, handleNext, handleBack, tabChange, tabval }) => {
  const [open, setOpen] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // Add state for delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const fetchPersonnel = async () => {
    setIsLoading(true);
    const response = await Factory('get', `/user_management/kmp-details/${user.active_context.business_id}/`, {}, {});
    if (response.res.status_cd === 0) {
      setPersonnel(response.res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(response?.res?.data || 'Failed to fetch personnel'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const handleEdit = (index) => {
    const person = personnel[index];
    setValues({ ...person });
    setOpen(true);
  };

  const handleDelete = async (item) => {
    const { res } = await Factory('delete', `/user_management/kmp-details/${item.id}/`, {}, {});
    if (res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Personnel deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      fetchPersonnel();
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data || 'Failed to delete personnel'),
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
      name: '',
      designation: '',
      pan_number: '',
      role: '',
      status: 'active'
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        business: user.active_context.business_id
      };

      let url = '/user_management/kmp-details/';
      let type = 'post';
      if (values.id) {
        url = `/user_management/kmp-details/${values.id}/`;
        type = 'put';
      }

      const response = await Factory(type, url, payload, {});

      if (response.res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Personnel updated successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        fetchPersonnel();
        handleClose();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(response?.res?.data || 'Failed to save personnel'),
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
    <Typography variant="subtitle1" gutterBottom fontWeight={500}>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </Typography>
  );

  const renderFields = () => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        {getLabelWithAsterisk(field.label, field.required)}

        {/* <Typography variant="subtitle1" gutterBottom>
          {field.label}
        </Typography> */}
        {field.type === 'select' ? (
          <FormControl fullWidth size="small">
            <Select
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => setFieldValue(field.name, e.target.value)}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
            >
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {field.name === 'role' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getRoleIcon(option)}</span>
                      <span>{option}</span>
                    </Box>
                  ) : (
                    option.charAt(0).toUpperCase() + option.slice(1)
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            size="small"
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e) => {
              if (field.name === 'pan_number') {
                const value = e.target.value.toUpperCase();
                if (value.length <= 10) {
                  setFieldValue(field.name, value);
                }
              } else if (field.name === 'name') {
                const value = e.target.value;
                setFieldValue(field.name, value);
              } else {
                setFieldValue(field.name, e.target.value);
              }
            }}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name] ? errors[field.name] : ''}
          />
        )}
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
          Loading Personnel...
        </Typography>
      </Box>
    );
  }

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;

  return (
    <MainCard
      title="Key Managerial Personnel"
      subtitle="Manage your business key personnel and their roles for seamless operations"
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
          Add Personnel
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
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>PAN Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personnel.length > 0 ? (
              personnel.map((person, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {person.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon color="action" fontSize="small" />
                      <Typography variant="body2">{person.designation}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{person.pan_number}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span>{getRoleIcon(person.role)}</span>
                          <span>{person.role}</span>
                        </Box>
                      }
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
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit Personnel">
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
                      <Tooltip title="Delete Personnel">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setSelectedPersonnel(person);
                            setOpenDeleteDialog(true);
                          }}
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
                    <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Personnel Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your key managerial personnel for business operations
                    </Typography>
                    <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Add First Personnel
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={open}
        showClose={true}
        title={values.id ? 'Edit Personnel' : 'Add Personnel'}
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
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
          <Grid2 container spacing={2}>
            {renderFields()}
          </Grid2>
        </Box>
      </Modal>
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          if (selectedPersonnel) handleDelete(selectedPersonnel);
          setOpenDeleteDialog(false);
          setSelectedPersonnel(null);
        }}
        dialogData={{
          title: 'Delete Personnel',
          heading: 'Are you sure?',
          description: 'This action will permanently delete the selected personnel.'
        }}
      />
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
    </MainCard>
  );
};

export default KeyManagerialPersonnel;
