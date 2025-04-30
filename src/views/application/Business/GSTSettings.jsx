import React, { useState } from 'react';
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
  Tooltip
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

const initialGSTs = [
  {
    gstin: '27AAEPM1234C1Z5',
    trade_name: 'Acme Corp',
    branch_name: 'Mumbai',
    state: 'Maharashtra',
    type: 'Regular',
    is_export_sez: true
  },
  {
    gstin: '29AAEPM5678B1Z2',
    trade_name: 'Beta Pvt Ltd',
    branch_name: 'Bangalore',
    state: 'Karnataka',
    type: 'Composition',
    is_export_sez: false
  }
];

const validationSchema = Yup.object({
  gstin: Yup.string().required('GST Number is required'),
  legal_name: Yup.string().required('Legal Name is required'),
  trade_name: Yup.string().required('Trade Name is required'),
  branch_name: Yup.string().required('Branch/Vertical is required'),
  gst_username: Yup.string().required('Username in GST is required'),
  gst_password: Yup.string().required('Password is required'),
  authorized_signatory_pan: Yup.string().required('Authorized Signatory PAN is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  pinCode: Yup.string().required('Zip Code is required'),
  is_composition_scheme: Yup.boolean(),
  composition_scheme_percent: Yup.string(),
  is_export_sez: Yup.boolean(),
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
  const [gstList, setGstList] = useState(initialGSTs);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const user = useSelector((state) => state).accountReducer.user;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    formik.setValues({
      ...gstList[index],
      gst_username: '',
      gst_password: '',
      gst_document: null
    });
    setOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this GST entry?')) {
      setGstList(gstList.filter((_, i) => i !== index));
    }
  };

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
      pinCode: '',
      is_composition_scheme: false,
      composition_scheme_percent: '',
      is_export_sez: false,
      lut_reg_no: '',
      dob: '',
      financial_year: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append('business', user.active_context.business_id);
        Object.keys(values).forEach((key) => {
          if (key !== 'gst_document') {
            formData.append(key, values[key]);
          }
        });

        if (values.gst_document) {
          formData.append('gst_document', values.gst_document);
        }

        const response = await Factory('post', '/business/gst-settings', formData, {});

        if (response.res.status_cd === 0) {
          console.log(response.res);
        }

        // if (response.data) {
        //   if (editIndex !== null) {
        //     const updated = [...gstList];
        //     updated[editIndex] = response.data;
        //     setGstList(updated);
        //   } else {
        //     setGstList([...gstList, response.data]);
        //   }
        //   handleClose();
        // }
      } catch (error) {
        console.error('Error submitting GST details:', error);
        // You might want to show an error notification here
      } finally {
        setSubmitting(false);
      }
    }
  });

  console.log(formik.errors);

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
                  <TableCell>{row.type || (row.is_composition_scheme ? 'Composition' : 'Regular')}</TableCell>
                  <TableCell>{row.is_export_sez ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View/Edit">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(idx)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" color="error" onClick={() => handleDelete(idx)}>
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
                  <TextField
                    fullWidth
                    size="small"
                    id="state"
                    name="state"
                    label="State"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
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
                    id="pinCode"
                    name="pinCode"
                    label="Zip Code"
                    value={formik.values.pinCode}
                    onChange={formik.handleChange}
                    error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                    helperText={formik.touched.pinCode && formik.errors.pinCode}
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
                  <Button variant="outlined" component="label" fullWidth size="small" sx={{ height: '40px' }}>
                    Upload GST Certificate
                    <input type="file" hidden onChange={(e) => formik.setFieldValue('gst_document', e.currentTarget.files[0])} />
                  </Button>
                  {formik.values.gst_document && (
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {formik.values.gst_document.name}
                    </Typography>
                  )}
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
                        checked={formik.values.is_composition_scheme}
                        onChange={(e) => formik.setFieldValue('is_composition_scheme', e.target.checked)}
                        name="is_composition_scheme"
                      />
                    }
                    label="Are you Reg. under Composition Scheme?"
                  />
                </Grid>
                {formik.values.is_composition_scheme && (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Composition Scheme %
                    </Typography>
                    <RadioGroup row name="composition_scheme_percent" value={formik.values.composition_scheme_percent} onChange={formik.handleChange}>
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
                        checked={formik.values.is_export_sez}
                        onChange={(e) => formik.setFieldValue('is_export_sez', e.target.checked)}
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
            <Button type="submit" variant="contained" size="small" color="primary">
              {editIndex !== null ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default GSTSettings;
