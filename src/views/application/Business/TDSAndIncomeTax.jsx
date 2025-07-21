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
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useSelector, useDispatch } from 'store';
import Factory from 'utils/Factory';
import { INDIAN_STATES } from 'utils/constants';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';
import MainCard from 'ui-component/cards/MainCard';
import Modal from 'ui-component/extended/Modal';
import { openSnackbar } from 'store/slices/snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const deductorCategories = ['Company', 'Individual', 'Firm', 'Trust'];
const deductorTypes = ['Government', 'Non-Government'];

const deductorFields = [
  {
    label: 'TAN Number',
    name: 'tan_number',
    type: 'text'
  },
  {
    label: 'PAN',
    name: 'pan',
    type: 'text'
  },
  {
    label: 'Legal Name',
    name: 'legal_name',
    type: 'text'
  },
  {
    label: 'Trade Name',
    name: 'trade_name',
    type: 'text'
  },
  {
    label: 'Location/Vertical',
    name: 'location',
    type: 'text'
  },
  {
    label: 'Deductor Category',
    name: 'deductor_category',
    type: 'select',
    options: deductorCategories
  },
  {
    label: 'Deductor Type',
    name: 'deductor_type',
    type: 'select',
    options: deductorTypes
  },
  {
    label: 'Address',
    name: 'address',
    type: 'text'
  },
  {
    label: 'State',
    name: 'state',
    type: 'select',
    options: INDIAN_STATES
  },
  {
    label: 'Pincode',
    name: 'pincode',
    type: 'text'
  },
  {
    label: 'Email ID',
    name: 'email',
    type: 'text'
  },
  {
    label: 'Contact Number',
    name: 'mobile_number',
    type: 'text'
  },
  {
    label: 'Username (TDS Compliance)',
    name: 'tds_username',
    type: 'text'
  },
  {
    label: 'Password (TDS Compliance)',
    name: 'tds_password',
    type: 'text'
  }
];

const authorizedPersonalDetailsFields = [
  {
    label: 'Name of Responsible Person',
    name: 'name',
    type: 'text'
  },
  {
    label: 'Designation',
    name: 'designation',
    type: 'text'
  },
  {
    label: 'PAN of RP',
    name: 'pan_of_RP',
    type: 'text'
  },
  {
    label: 'Mobile',
    name: 'mobile',
    type: 'text'
  },
  {
    label: 'Email',
    name: 'email',
    type: 'text'
  }
];

const incomeTaxDetailsFields = [
  {
    label: 'PAN',
    name: 'pan',
    type: 'text'
  },
  {
    label: 'Password',
    name: 'password',
    type: 'text'
  },
  {
    label: 'Registered Mobile Number',
    name: 'registered_mobile_number',
    type: 'text'
  }
];

const validationSchema = Yup.object().shape({
  tan_number: Yup.string()
    .required('TAN is required')
    .matches(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, 'Invalid TAN format'),
  // pan: Yup.string()
  //   .required('PAN is required')
  //   .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  pan: Yup.string()
  .required('PAN is required')
  .matches(/^[A-Z]{3}C[A-Z][0-9]{4}[A-Z]$/, 'Invalid PAN format'),

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

const TDSAndIncomeTax = ({ handleBack, handleNext }) => {
  const [tdsList, setTdsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state).accountReducer.user;
  const dispatch = useDispatch();

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
        dispatch(
          openSnackbar({
            open: true,
            message: 'TDS details deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(response?.res?.data || 'Failed to delete TDS details'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error deleting TDS details:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete TDS details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      handleDeleteClose();
    }
  };

  const fetchTDSDetails = async () => {
    setIsLoading(true);
    try {
      const response = await Factory('get', `/user_management/tds-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setTdsList(response.res.data);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(response?.res?.data || 'Failed to fetch TDS details'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error fetching TDS details:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch TDS details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setIsLoading(false);
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
            name: values.authorized_personal_Details.name,
            designation: values.authorized_personal_Details.designation,
            mobile_number: values.authorized_personal_Details.mobile,
            email: values.authorized_personal_Details.email
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
            dispatch(
              openSnackbar({
                open: true,
                message: 'TDS details updated successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            setTdsList([...tdsList, response.res]);
            dispatch(
              openSnackbar({
                open: true,
                message: 'TDS details added successfully',
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
              message: JSON.stringify(response?.res?.data || 'Failed to save TDS details'),
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      } catch (error) {
        console.error('Error submitting TDS details:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to save TDS details',
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

  useEffect(() => {
    fetchTDSDetails();
  }, []);

  const renderFields = (fields, prefix = '') => {
    return fields.map((field) => {
      const fieldName = prefix ? `${prefix}.${field.name}` : field.name;
      const fieldValue = prefix ? values[prefix]?.[field.name] || '' : values[field.name] || '';
      const fieldError = prefix ? errors[prefix]?.[field.name] : errors[field.name];
      const fieldTouched = prefix ? touched[prefix]?.[field.name] : touched[field.name];

      return (
        <Grid2 key={fieldName} size={{ xs: 12, sm: 6, md: 4 }}>
          {field.type === 'text' && (
            <TextField
              fullWidth
              size="small"
              label={field.label}
              name={fieldName}
              value={fieldValue}
              onChange={(e) => {
                let value = e.target.value;
                // Apply specific formatting based on field name
                if (field.name === 'tan_number' || field.name === 'pan' || field.name === 'pan_of_RP') {
                  value = value.toUpperCase();
                } else if (field.name === 'pincode' || field.name === 'mobile' || field.name === 'registered_mobile_number') {
                  value = value.replace(/\D/g, '');
                }
                setFieldValue(fieldName, value);
              }}
              onBlur={handleBlur}
              error={fieldTouched && Boolean(fieldError)}
              helperText={fieldTouched && fieldError ? fieldError : ''}
              type={field.name === 'tds_password' || field.name === 'password' ? 'password' : 'text'}
              autoComplete={
                field.name === 'tds_username'
                  ? 'new-username'
                  : field.name === 'tds_password' || field.name === 'password'
                    ? 'new-password'
                    : 'off'
              }
              inputProps={
                field.name === 'pincode' ? { maxLength: 6 } : field.name === 'pan' || field.name === 'pan_of_RP' ? { maxLength: 10 } : {}
              }
            />
          )}
          {field.type === 'select' && (
            <FormControl fullWidth size="small" error={fieldTouched && Boolean(fieldError)}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={fieldName}
                value={fieldValue}
                label={field.label}
                onChange={(e) => setFieldValue(fieldName, e.target.value)}
                onBlur={handleBlur}
              >
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {fieldTouched && fieldError && <FormHelperText>{fieldError}</FormHelperText>}
            </FormControl>
          )}
        </Grid2>
      );
    });
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
          Loading TDS Details...
        </Typography>
      </Box>
    );
  }

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;

  return (
    <MainCard
      title="TDS & Income Tax"
      subtitle="Manage your TDS (Tax Deducted at Source) and Income Tax details for compliance"
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
          Add TAN
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
              <TableCell sx={{ fontWeight: 600 }}>TAN</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trade Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location/Vertical</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Deductor Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Deductor Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>State</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tdsList.length > 0 ? (
              tdsList.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {row.tan_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.trade_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.location}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.deductor_category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.deductor_type}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.state}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit TDS Details">
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
                      <Tooltip title="Delete TDS Details">
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
                <TableCell colSpan={7} align="center">
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    <ReceiptIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No TDS Records Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first TDS details for tax compliance
                    </Typography>
                    <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Add First TAN
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
        title={editIndex !== null ? 'Edit TDS Details' : 'Add TDS Details'}
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
          {/* Deductor Details Group */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary" sx={{ mb: 2 }}>
              Deductor Details
            </Typography>
            <Grid2 container spacing={2}>
              {renderFields(deductorFields)}
            </Grid2>
          </Box>

          {/* Authorized Person Details Group */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary" sx={{ mb: 2 }}>
              Authorized Person Details
            </Typography>
            <Grid2 container spacing={2}>
              {renderFields(authorizedPersonalDetailsFields, 'authorized_personal_Details')}
            </Grid2>
          </Box>

          {/* Income Tax Group */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary" sx={{ mb: 2 }}>
              Income Tax
            </Typography>
            <Grid2 container spacing={2}>
              {renderFields(incomeTaxDetailsFields, 'income_tax_details')}
            </Grid2>
          </Box>
        </Box>
      </Modal>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        title="Delete TDS Details"
        message="Are you sure you want to delete these TDS details? This action cannot be undone."
        itemName={deleteIndex !== null ? `TAN: ${tdsList[deleteIndex]?.tan_number}` : ''}
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

export default TDSAndIncomeTax;
