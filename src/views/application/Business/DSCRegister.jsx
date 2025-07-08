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
import SecurityIcon from '@mui/icons-material/Security';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'store';
import Factory from 'utils/Factory';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';
import MainCard from 'ui-component/cards/MainCard';
import Modal from 'ui-component/extended/Modal';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'dsc_number', label: 'DSC Number', type: 'text' },
  { name: 'dsc_type', label: 'DSC Type', type: 'select', options: dscTypes },
  { name: 'issue_authority', label: 'Issuing Authority', type: 'select', options: issuingAuthorities },
  { name: 'date_of_issue', label: 'Date of Issue', type: 'date' },
  { name: 'date_of_expiry', label: 'Date of Expiry', type: 'date' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'mobile_number', label: 'Mobile Number', type: 'text' },
  { name: 'location', label: 'Location', type: 'text' }
];

const DSCRegister = ({ handleBack, handleNext }) => {
  const [dscList, setDscList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state).accountReducer.user;
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDSCList();
  }, []);

  const fetchDSCList = async () => {
    setIsLoading(true);
    try {
      const response = await Factory('get', `/user_management/dsc-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setDscList(response.res.data);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(response?.res?.data || 'Failed to fetch DSC list'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error fetching DSC list:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch DSC list',
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
        dispatch(
          openSnackbar({
            open: true,
            message: 'DSC deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(response?.res?.data || 'Failed to delete DSC'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error deleting DSC:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete DSC',
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
            dispatch(
              openSnackbar({
                open: true,
                message: 'DSC updated successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            setDscList([...dscList, response.res]);
            dispatch(
              openSnackbar({
                open: true,
                message: 'DSC added successfully',
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
              message: JSON.stringify(response?.res?.data || 'Failed to save DSC'),
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      } catch (error) {
        console.error('Error submitting DSC:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to save DSC',
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
            label={field.label}
            size="small"
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
          Loading DSC Register...
        </Typography>
      </Box>
    );
  }

  return (
    <MainCard
      title="DSC Register"
      subtitle="Manage your Digital Signature Certificates for secure digital transactions"
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
          Add DSC
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
              <TableCell sx={{ fontWeight: 600 }}>DSC Number</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Valid Till</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dscList.length > 0 ? (
              dscList.map((dsc, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {dsc.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{dsc.dsc_number}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{dsc.dsc_type}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{dsc.date_of_expiry}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{dsc.location}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit DSC">
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
                      <Tooltip title="Delete DSC">
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
                    <SecurityIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No DSCs Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first Digital Signature Certificate for secure digital transactions
                    </Typography>
                    <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Add First DSC
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
        title={editIndex !== null ? 'Edit DSC' : 'Add DSC'}
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
          </Grid2>
        </Box>
      </Modal>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        title="Delete DSC"
        message="Are you sure you want to delete this DSC? This action cannot be undone."
        itemName={deleteIndex !== null ? `DSC: ${dscList[deleteIndex]?.dsc_number}` : ''}
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

export default DSCRegister;
