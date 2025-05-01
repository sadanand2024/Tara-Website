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
  Alert
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

const validationSchema = Yup.object().shape({
  gstin: Yup.string()
    .required('GST Number is required')
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number format'),
  legal_name: Yup.string().required('Legal Name is required'),
  trade_name: Yup.string().required('Trade Name is required'),
  branch_name: Yup.string().required('Branch/Vertical is required'),
  gst_username: Yup.string().required('Username in GST is required'),
  gst_password: Yup.string().required('Password is required'),
  authorized_signatory_pan: Yup.string()
    .required('Authorized Signatory PAN is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required').oneOf(INDIAN_STATES, 'Please select a valid state'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode format'),
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

const GSTSettings = () => {
  const [gstList, setGstList] = useState([]);
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
    const newValues = { ...gstList[index] };
    delete newValues['gst_document'];
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
      const response = await Factory('delete', `/user_management/gst-details/${gstList[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setGstList(gstList.filter((_, i) => i !== deleteIndex));
        showNotification('GST details deleted successfully');
      } else {
        showNotification('Failed to delete GST details', 'error');
      }
    } catch (error) {
      console.error('Error deleting GST details:', error);
      showNotification('Failed to delete GST details', 'error');
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

  const fetchGSTList = async () => {
    try {
      const response = await Factory('get', `/user_management/gst-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setGstList(response.res.data);
      } else {
        showNotification('Failed to fetch GST details', 'error');
      }
    } catch (error) {
      console.error('Error fetching GST details:', error);
      showNotification('Failed to fetch GST details', 'error');
    }
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
        Object.keys(values).forEach(key => {
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
            showNotification('GST details updated successfully');
          } else {
            setGstList([...gstList, response.res]);
            showNotification('GST details added successfully');
          }
          handleClose();
        } else {
          showNotification(response.res.status_msg || 'Failed to save GST details', 'error');
        }
      } catch (error) {
        console.error('Error submitting GST details:', error);
        showNotification('Failed to save GST details', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          GST Settings
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
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
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            {/* GST Details Group */}
            <Box mb={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="gstin"
                    name="gstin"
                    label="GST Number"
                    value={formik.values.gstin}
                    onChange={formik.handleChange}
                    error={formik.touched.gstin && Boolean(formik.errors.gstin)}
                    helperText={formik.touched.gstin && formik.errors.gstin}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="branch_name"
                    name="branch_name"
                    label="Branch/Vertical"
                    value={formik.values.branch_name}
                    onChange={formik.handleChange}
                    error={formik.touched.branch_name && Boolean(formik.errors.branch_name)}
                    helperText={formik.touched.branch_name && formik.errors.branch_name}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="authorized_signatory_pan"
                    name="authorized_signatory_pan"
                    label="Authorized Signatory PAN"
                    value={formik.values.authorized_signatory_pan}
                    onChange={formik.handleChange}
                    error={formik.touched.authorized_signatory_pan && Boolean(formik.errors.authorized_signatory_pan)}
                    helperText={formik.touched.authorized_signatory_pan && formik.errors.authorized_signatory_pan}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="gst_username"
                    name="gst_username"
                    autoComplete="new-gst_username"
                    label="Username in GST"
                    value={formik.values.gst_username}
                    onChange={formik.handleChange}
                    error={formik.touched.gst_username && Boolean(formik.errors.gst_username)}
                    helperText={formik.touched.gst_username && formik.errors.gst_username}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="gst_password"
                    name="gst_password"
                    label="Password"
                    autoComplete="new-gst_password"
                    type="gst_password"
                    value={formik.values.gst_password}
                    onChange={formik.handleChange}
                    error={formik.touched.gst_password && Boolean(formik.errors.gst_password)}
                    helperText={formik.touched.gst_password && formik.errors.gst_password}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Button variant="outlined" component="label" fullWidth size="small" sx={{ height: '40px', mb: 1 }}>
                      {editIndex !== null && gstList[editIndex]?.gst_document ? 'Replace GST Certificate' : 'Upload GST Certificate'}
                      <input type="file" hidden onChange={(e) => formik.setFieldValue('gst_document', e.currentTarget.files[0])} />
                    </Button>
                    {editIndex !== null && gstList[editIndex]?.gst_document && !formik.values.gst_document && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption">Current file:</Typography>
                        <Link
                          component="button"
                          variant="caption"
                          onClick={() => handleDownload(gstList[editIndex].gst_document, `GST_${gstList[editIndex].gstin}`)}
                        >
                          GST_{gstList[editIndex].gstin}
                        </Link>
                      </Box>
                    )}
                    {formik.values.gst_document && (
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        New file: {formik.values.gst_document.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Schemes & Exports Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Schemes & Exports
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.is_composition_scheme === 'yes'}
                        onChange={(e) => formik.setFieldValue('is_composition_scheme', e.target.checked ? 'yes' : 'no')}
                        name="is_composition_scheme"
                      />
                    }
                    label="Are you Reg. under Composition Scheme?"
                  />
                </Grid>
                {formik.values.is_composition_scheme === 'yes' && (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Composition Scheme %
                    </Typography>
                    <RadioGroup
                      row
                      name="composition_scheme_percent"
                      value={formik.values.composition_scheme_percent}
                      onChange={formik.handleChange}
                    >
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
                        checked={formik.values.is_export_sez === 'yes'}
                        onChange={(e) => formik.setFieldValue('is_export_sez', e.target.checked ? 'yes' : 'no')}
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="lut_reg_no"
                    name="lut_reg_no"
                    label="LUT Reg. No"
                    value={formik.values.lut_reg_no}
                    onChange={formik.handleChange}
                    error={formik.touched.lut_reg_no && Boolean(formik.errors.lut_reg_no)}
                    helperText={formik.touched.lut_reg_no && formik.errors.lut_reg_no}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="dob"
                    name="dob"
                    label="DOB"
                    type="date"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                    helperText={formik.touched.dob && formik.errors.dob}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth size="small" error={formik.touched.financial_year && Boolean(formik.errors.financial_year)}>
                    <InputLabel>Financial Year</InputLabel>
                    <Select
                      id="financial_year"
                      name="financial_year"
                      value={formik.values.financial_year}
                      label="Financial Year"
                      onChange={formik.handleChange}
                    >
                      {financialYearOptions.map((fy) => (
                        <MenuItem key={fy} value={fy}>
                          {fy}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
        onConfirm={() => deleteIndex !== null && handleDelete()}
        title="Delete GST Details"
        message="Are you sure you want to delete these GST details? This action cannot be undone."
        itemName={deleteIndex !== null ? `GST Number: ${gstList[deleteIndex]?.gstin}` : ''}
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

export default GSTSettings;
