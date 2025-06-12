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
  TextField,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Tooltip,
  Link,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'store';
import Factory from 'utils/Factory';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';
import { INDIAN_STATES } from 'utils/constants';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
const validationSchema = Yup.object().shape({
  gstin: Yup.string()
    .required('GST Number is required')
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number format'),
  legal_name: Yup.string().required('Legal Name is required'),
  trade_name: Yup.string().required('Trade Name is required'),
  gst_username: Yup.string().required('Username in GST is required'),
  gst_password: Yup.string().required('Password is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required').oneOf(INDIAN_STATES, 'Please select a valid state'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode format'),
  branch_name: Yup.string(),
  authorized_signatory_pan: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  is_composition_scheme: Yup.string().oneOf(['yes', 'no']).required('Composition Scheme is required'),
  composition_scheme_percent: Yup.string().when('is_composition_scheme', {
    is: (val) => val === 'yes',
    then: () => Yup.string().required('Composition Scheme Percentage is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  is_export_sez: Yup.string().oneOf(['yes', 'no']).required('Export/SEZ is required'),
  lut_reg_no: Yup.string(),
  dob: Yup.string(),
  financial_year: Yup.string()
});

const compositionPercOptions = ['1%', '2%', '5%', '6%'];

const getFinancialYearOptions = () => {
  const options = [];
  const startYear = 2018;
  const now = new Date();
  let fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  for (let y = startYear; y <= fyStart; y++) {
    options.push(`${y}-${y + 1}`);
  }
  return options;
};

const financialYearOptions = getFinancialYearOptions();
const fields = [
  {
    name: 'gstin',
    label: 'GST Number',
    type: 'text'
  },
  {
    name: 'legal_name',
    label: 'Legal Name',
    type: 'text'
  },
  {
    name: 'trade_name',
    label: 'Trade Name',
    type: 'text'
  },
  {
    name: 'branch_name',
    label: 'Branch/Vertical',
    type: 'text'
  },
  {
    name: 'state',
    label: 'State',
    type: 'select',
    options: INDIAN_STATES
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text'
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text'
  },
  {
    name: 'authorized_signatory_pan',
    label: 'Authorized Signatory PAN',
    type: 'text'
  },
  {
    name: 'gst_username',
    label: 'Username in GST',
    type: 'text'
  },
  {
    name: 'gst_password',
    label: 'Password in GST',
    type: 'text'
  },
  {
    name: 'gst_document',
    label: 'GST Document',
    type: 'file'
  }
];
const fields_lut = [
  {
    name: 'lut_reg_no',
    label: 'LUT Reg. No',
    type: 'text'
  },
  {
    name: 'dob',
    label: 'DOB',
    type: 'date'
  },
  {
    name: 'financial_year',
    label: 'Financial Year',
    type: 'select',
    options: financialYearOptions
  }
];
const GSTSettings = () => {
  const [gstList, setGstList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const user = useSelector((state) => state.accountReducer.user);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const newValues = { ...gstList[index] };
    setValues(newValues);
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
      const response = await Factory('delete', `/user_management/gst-details/${gstList[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setGstList(gstList.filter((_, i) => i !== deleteIndex));
        dispatch(
          openSnackbar({
            open: true,
            message: 'GST details deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to delete GST details',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error deleting GST details:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete GST details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      handleDeleteClose();
    }
  };

  const handleDownload = (documentUrl, fileName) => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.setAttribute('download', fileName || 'gst-document');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchGSTList = async () => {
    try {
      const response = await Factory('get', `/user_management/gst-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setGstList(response.res.data);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to fetch GST details',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error fetching GST details:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch GST details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          {field.label}
        </Typography>
        {field.type === 'text' ? (
          <TextField
            fullWidth
            size="small"
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e) => {
              const { value } = e.target;
              if (field.name === 'authorized_signatory_pan') {
                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                if (value.length > 10) return;
                setFieldValue(field.name, value.toUpperCase());
              } else {
                setFieldValue(field.name, e.target.value);
              }
            }}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            InputLabelProps={{ shrink: true }}
          />
        ) : field.type === 'file' ? (
          <RenderFileUpload
            label={field.label}
            fieldName={field.name}
            file={values[field.name]}
            setFieldValue={(e) => setFieldValue(field.name, e.target.value)}
            touched={touched[field.name]}
            errors={errors[field.name]}
          />
        ) : field.type === 'select' ? (
          <Autocomplete
            fullWidth
            size="small"
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e, value) => setFieldValue(field.name, value)}
            options={field.options}
            renderInput={(params) => <TextField {...params} />}
          />
        ) : field.type === 'date' ? (
          <TextField
            fullWidth
            size="small"
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        ) : null}
      </Grid>
    ));
  };

  useEffect(() => {
    fetchGSTList();
  }, []);

  const formik = useFormik({
    initialValues: {
      gstin: '',
      legal_name: '',
      trade_name: '',
      branch_name: '',
      gst_username: '',
      gst_password: '',
      authorized_signatory_pan: '',
      gst_document: null,
      address: '',
      state: '',
      pincode: '',
      is_composition_scheme: 'no',
      composition_scheme_percent: '',
      is_export_sez: 'no',
      lut_reg_no: '',
      dob: '',
      financial_year: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === 'gst_document' && values[key] instanceof File) {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        });
        formData.append('business', user.active_context.business_id);

        let url = '/user_management/gst-details/';
        let type = 'post';
        if (editIndex !== null) {
          url = `/user_management/gst-details/${gstList[editIndex].id}/`;
          type = 'put';
        }

        const response = await Factory(type, url, formData, {}, true);

        if (response.res.status_cd === 0) {
          if (editIndex !== null) {
            const updated = [...gstList];
            updated[editIndex] = response.res.data;
            setGstList(updated);
            dispatch(
              openSnackbar({
                open: true,
                message: 'GST details updated successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            setGstList([...gstList, response.res]);
            dispatch(
              openSnackbar({
                open: true,
                message: 'GST details added successfully',
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
              message: response.res.status_msg || 'Failed to save GST details',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      } catch (error) {
        console.error('Error submitting GST details:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to save GST details',
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
  const { values, setValues, touched, errors, handleSubmit, setFieldValue, handleBlur, resetForm, isSubmitting } = formik;
  console.log(values);
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          GST Settings
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add GST
        </Button>
      </Box>
      <Card
        elevation={2}
        sx={{
          mb: 2,
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
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>GST Number</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Trade Name</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Branch/Vertical</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>State</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Export/SEZ</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>GST DOC</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gstList.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.gstin}</TableCell>
                  <TableCell>{row.trade_name}</TableCell>
                  <TableCell>{row.branch_name}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.type || (row.is_composition_scheme === 'yes' ? 'Composition' : 'Regular')}</TableCell>
                  <TableCell>{row.is_export_sez === 'yes' ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {row.gst_document && (
                      <Tooltip title="Download GST Document">
                        <IconButton size="small" color="primary" onClick={() => handleDownload(row.gst_document, `GST_${row.gstin}`)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
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
              {gstList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No GST records added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit GST Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit GST Details' : 'Add GST Details'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent dividers>
            {/* GST Details Group */}
            <Box mb={2}>
              <Grid container spacing={2}>
                {renderFields(fields)}
              </Grid>
            </Box>

            {/* Schemes & Exports Group */}
            <Box mb={2}>
              {/* <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Schemes & Exports
              </Typography> */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.is_composition_scheme === 'yes'}
                        onChange={(e) => setFieldValue('is_composition_scheme', e.target.checked ? 'yes' : 'no')}
                        name="is_composition_scheme"
                      />
                    }
                    label="Are you Reg. under Composition Scheme?"
                  />
                </Grid>
                {values.is_composition_scheme === 'yes' && (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Composition Scheme %
                    </Typography>
                    <RadioGroup row name="composition_scheme_percent" value={values.composition_scheme_percent} onChange={setFieldValue}>
                      {compositionPercOptions.map((perc) => (
                        <FormControlLabel key={perc} value={perc} control={<Radio size="small" />} label={perc} />
                      ))}
                    </RadioGroup>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.is_export_sez === 'yes'}
                        onChange={(e) => setFieldValue('is_export_sez', e.target.checked ? 'yes' : 'no')}
                        name="is_export_sez"
                      />
                    }
                    label="Is your business involved in export/supply to sez/deemed exports?"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* LUT Details Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                LUT Details
              </Typography>
              <Grid container spacing={2}>
                {renderFields(fields_lut)}
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
              disabled={isSubmitting}
              onClick={handleSubmit}
              sx={{ position: 'relative', minWidth: '100px' }}
            >
              {isSubmitting ? (
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
        onConfirm={() => deleteIndex !== null && handleDelete()}
        title="Delete GST Details"
        message="Are you sure you want to delete this GST details? This action cannot be undone."
        itemName={deleteIndex !== null ? `GST Number: ${gstList[deleteIndex]?.gstin}` : ''}
      />
    </Box>
  );
};

export default GSTSettings;
