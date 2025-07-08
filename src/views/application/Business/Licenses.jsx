import React, { useState, useEffect } from 'react';
import {
  Grid2,
  Typography,
  TextField,
  Button,
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
  Tooltip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'store';
import Factory from 'utils/Factory';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';
import MainCard from 'ui-component/cards/MainCard';
import Modal from 'ui-component/extended/Modal';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const validationSchema = Yup.object().shape({
  license_type: Yup.string().required('License Type is required'),
  license_number: Yup.string().required('License Number is required'),
  location: Yup.string().required('Location is required'),
  date_of_issue: Yup.string().required('Date of Issue is required'),
  date_of_expiry: Yup.string().required('Date of Expiry is required'),
  license_document: Yup.mixed()
});

const licenseTypeOptions = ['Trade License', 'Labour License', 'Food License', 'Trade Mark'];

const fields = [
  { name: 'license_type', label: 'License Type', type: 'select', options: licenseTypeOptions },
  { name: 'license_number', label: 'License Number', type: 'text' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'date_of_issue', label: 'Date of Issue', type: 'date' },
  { name: 'date_of_expiry', label: 'Date of Expiry', type: 'date' }
];

const Licenses = ({ handleBack, handleNext }) => {
  const [licenses, setLicenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state).accountReducer.user;
  const dispatch = useDispatch();

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    setIsLoading(true);
    try {
      const response = await Factory('get', `/user_management/license-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setLicenses(response.res.data);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(response?.res?.data || 'Failed to fetch licenses'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch licenses',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setIsLoading(false);
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
        dispatch(
          openSnackbar({
            open: true,
            message: 'License deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(response?.res?.data || 'Failed to delete license'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error deleting license:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete license',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
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
        Object.keys(values).forEach((key) => {
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
            dispatch(
              openSnackbar({
                open: true,
                message: 'License updated successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            setLicenses([...licenses, response.res]);
            dispatch(
              openSnackbar({
                open: true,
                message: 'License added successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          }
          handleClose();
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: JSON.stringify(response?.res?.data || 'Failed to save license'),
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      } catch (error) {
        console.error('Error submitting license:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to save license',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleDocDownload = async (documentUrl) => {
    try {
      if (!documentUrl) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'No document available for download',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }
      window.open(documentUrl, '_blank');
      dispatch(
        openSnackbar({
          open: true,
          message: 'Document download started',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } catch (error) {
      console.error('Error downloading document:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to download document',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const renderFields = () => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        {field.type === 'select' ? (
          <FormControl fullWidth size="small" error={formik.touched[field.name] && Boolean(formik.errors[field.name])}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={formik.values[field.name]}
              label={field.label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {formik.touched[field.name] && formik.errors[field.name] && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {formik.errors[field.name]}
              </Typography>
            )}
          </FormControl>
        ) : (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            name={field.name}
            type={field.type}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] && formik.errors[field.name] ? formik.errors[field.name] : ''}
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
          Loading Licenses...
        </Typography>
      </Box>
    );
  }

  return (
    <MainCard
      title="Licenses"
      subtitle="Manage your business licenses and permits for regulatory compliance"
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
          Add License
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
              <TableCell sx={{ fontWeight: 600 }}>License Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>License Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Expiry Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Document</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {licenses.length > 0 ? (
              licenses.map((license, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {license.license_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{license.license_number}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{license.location}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{license.date_of_expiry}</Typography>
                  </TableCell>
                  <TableCell>
                    {license.license_document ? (
                      <Tooltip title="Download Document">
                        <IconButton
                          size="small"
                          onClick={() => handleDocDownload(license.license_document)}
                          sx={{
                            backgroundColor: 'primary.50',
                            '&:hover': { backgroundColor: 'primary.100' }
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No Document
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit License">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(idx)}
                          sx={{
                            backgroundColor: 'primary.50',
                            '&:hover': { backgroundColor: 'primary.100' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete License">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(idx)}
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
                    <DescriptionIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Licenses Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first business license for regulatory compliance
                    </Typography>
                    <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Add First License
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
        title={editIndex !== null ? 'Edit License' : 'Add License'}
        handleClose={handleClose}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              onClick={formik.handleSubmit}
              type="submit"
              variant="contained"
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
          </Stack>
        }
      >
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ padding: 2 }}>
          <Grid2 container spacing={2}>
            {renderFields()}
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom>
                License Document
              </Typography>
              <Box>
                <Button variant="outlined" component="label" fullWidth size="small" sx={{ height: '40px', mb: 1 }}>
                  {editIndex !== null && licenses[editIndex]?.license_document ? 'Replace Document' : 'Upload Document'}
                  <input type="file" hidden onChange={(e) => formik.setFieldValue('license_document', e.currentTarget.files[0])} />
                </Button>
                {editIndex !== null && licenses[editIndex]?.license_document && !formik.values.license_document && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption">Current file:</Typography>
                    <Button variant="text" size="small" onClick={() => handleDocDownload(licenses[editIndex].license_document)}>
                      Download Current Document
                    </Button>
                  </Box>
                )}
                {formik.values.license_document && (
                  <Typography variant="caption">New file: {formik.values.license_document.name}</Typography>
                )}
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </Modal>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        title="Delete License"
        message="Are you sure you want to delete this license? This action cannot be undone."
        itemName={deleteIndex !== null ? `License: ${licenses[deleteIndex]?.license_number}` : ''}
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

export default Licenses;
