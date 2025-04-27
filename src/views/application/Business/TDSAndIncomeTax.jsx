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
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialTDS = [
  {
    tan: 'DELH12345B',
    trade_name: 'Acme Corp',
    location: 'Delhi',
    deductor_category: 'Company',
    deductor_type: 'Government',
    pan: 'AAAPL1234C',
    state: 'Delhi',
    status: 'Active'
  }
];

const deductorCategories = ['Company', 'Individual', 'Firm', 'Trust'];
const deductorTypes = ['Government', 'Non-Government'];

const validationSchema = Yup.object({
  tan: Yup.string().required('TAN is required'),
  pan: Yup.string().required('PAN is required'),
  legal_name: Yup.string().required('Legal Name is required'),
  trade_name: Yup.string().required('Trade Name is required'),
  location: Yup.string().required('Location/Vertical is required'),
  deductor_category: Yup.string().required('Deductor Category is required'),
  deductor_type: Yup.string().required('Type of Deductor is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  tds_email: Yup.string().email('Invalid email').required('Email is required'),
  tds_contact: Yup.string().required('Contact Number is required'),
  tds_username: Yup.string().required('Username is required'),
  tds_password: Yup.string().required('Password is required'),
  rp_name: Yup.string().required('Name of Responsible Person is required'),
  rp_designation: Yup.string().required('Designation is required'),
  rp_pan: Yup.string().required('PAN of RP is required'),
  rp_mobile: Yup.string().required('Mobile is required'),
  rp_email: Yup.string().email('Invalid email').required('Email is required'),
  it_pan: Yup.string().required('PAN is required'),
  it_password: Yup.string().required('Password is required'),
  it_mobile: Yup.string().required('Registered Mobile Number is required')
});

const TDSAndIncomeTax = () => {
  const [tdsList, setTdsList] = useState(initialTDS);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    formik.setValues({ ...tdsList[index] });
    setOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this TDS entry?')) {
      setTdsList(tdsList.filter((_, i) => i !== index));
    }
  };

  const formik = useFormik({
    initialValues: {
      tan: '',
      pan: '',
      legal_name: '',
      trade_name: '',
      location: '',
      deductor_category: '',
      deductor_type: '',
      address: '',
      state: '',
      zipcode: '',
      tds_email: '',
      tds_contact: '',
      tds_username: '',
      tds_password: '',
      rp_name: '',
      rp_designation: '',
      rp_pan: '',
      rp_mobile: '',
      rp_email: '',
      it_pan: '',
      it_password: '',
      it_mobile: ''
    },
    validationSchema,
    onSubmit: (values) => {
      if (editIndex !== null) {
        const updated = [...tdsList];
        updated[editIndex] = values;
        setTdsList(updated);
      } else {
        setTdsList([...tdsList, values]);
      }
      handleClose();
    }
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          TDS & Income Tax
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
          Add TAN
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
                <TableCell>TAN</TableCell>
                <TableCell>Trade Name</TableCell>
                <TableCell>Location/Vertical</TableCell>
                <TableCell>Deductor Category</TableCell>
                <TableCell>Deductor Type</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tdsList.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.tan}</TableCell>
                  <TableCell>{row.trade_name}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.deductor_category}</TableCell>
                  <TableCell>{row.deductor_type}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.status}</TableCell>
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
              {tdsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    No TDS records added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit TDS Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit TDS Details' : 'Add TDS Details'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            {/* Deductor Details Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Deductor Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tan"
                    name="tan"
                    label="TAN"
                    value={formik.values.tan}
                    onChange={formik.handleChange}
                    error={formik.touched.tan && Boolean(formik.errors.tan)}
                    helperText={formik.touched.tan && formik.errors.tan}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="pan"
                    name="pan"
                    label="PAN"
                    value={formik.values.pan}
                    onChange={formik.handleChange}
                    error={formik.touched.pan && Boolean(formik.errors.pan)}
                    helperText={formik.touched.pan && formik.errors.pan}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="location"
                    name="location"
                    label="Location/Vertical"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small" error={formik.touched.deductor_category && Boolean(formik.errors.deductor_category)}>
                    <InputLabel>Deductor Category</InputLabel>
                    <Select
                      id="deductor_category"
                      name="deductor_category"
                      value={formik.values.deductor_category}
                      label="Deductor Category"
                      onChange={formik.handleChange}
                    >
                      {deductorCategories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small" error={formik.touched.deductor_type && Boolean(formik.errors.deductor_type)}>
                    <InputLabel>Type of Deductor</InputLabel>
                    <Select
                      id="deductor_type"
                      name="deductor_type"
                      value={formik.values.deductor_type}
                      label="Type of Deductor"
                      onChange={formik.handleChange}
                    >
                      {deductorTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="zipcode"
                    name="zipcode"
                    label="Zipcode"
                    value={formik.values.zipcode}
                    onChange={formik.handleChange}
                    error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                    helperText={formik.touched.zipcode && formik.errors.zipcode}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tds_email"
                    name="tds_email"
                    label="Email ID"
                    value={formik.values.tds_email}
                    onChange={formik.handleChange}
                    error={formik.touched.tds_email && Boolean(formik.errors.tds_email)}
                    helperText={formik.touched.tds_email && formik.errors.tds_email}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tds_contact"
                    name="tds_contact"
                    label="Contact Number"
                    value={formik.values.tds_contact}
                    onChange={formik.handleChange}
                    error={formik.touched.tds_contact && Boolean(formik.errors.tds_contact)}
                    helperText={formik.touched.tds_contact && formik.errors.tds_contact}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tds_username"
                    name="tds_username"
                    autoComplete="new-username"
                    label="Username (TDS Compliance)"
                    value={formik.values.tds_username}
                    onChange={formik.handleChange}
                    error={formik.touched.tds_username && Boolean(formik.errors.tds_username)}
                    helperText={formik.touched.tds_username && formik.errors.tds_username}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="tds_password"
                    name="tds_password"
                    autoComplete="new-password"
                    label="Password (TDS Compliance)"
                    type="password"
                    value={formik.values.tds_password}
                    onChange={formik.handleChange}
                    error={formik.touched.tds_password && Boolean(formik.errors.tds_password)}
                    helperText={formik.touched.tds_password && formik.errors.tds_password}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Authorized Person Details Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Authorized Person Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="rp_name"
                    name="rp_name"
                    label="Name of Responsible Person"
                    value={formik.values.rp_name}
                    onChange={formik.handleChange}
                    error={formik.touched.rp_name && Boolean(formik.errors.rp_name)}
                    helperText={formik.touched.rp_name && formik.errors.rp_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="rp_designation"
                    name="rp_designation"
                    label="Designation"
                    value={formik.values.rp_designation}
                    onChange={formik.handleChange}
                    error={formik.touched.rp_designation && Boolean(formik.errors.rp_designation)}
                    helperText={formik.touched.rp_designation && formik.errors.rp_designation}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="rp_pan"
                    name="rp_pan"
                    label="PAN of RP"
                    value={formik.values.rp_pan}
                    onChange={formik.handleChange}
                    error={formik.touched.rp_pan && Boolean(formik.errors.rp_pan)}
                    helperText={formik.touched.rp_pan && formik.errors.rp_pan}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="rp_mobile"
                    name="rp_mobile"
                    label="Mobile"
                    value={formik.values.rp_mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.rp_mobile && Boolean(formik.errors.rp_mobile)}
                    helperText={formik.touched.rp_mobile && formik.errors.rp_mobile}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="rp_email"
                    name="rp_email"
                    label="Email"
                    value={formik.values.rp_email}
                    onChange={formik.handleChange}
                    error={formik.touched.rp_email && Boolean(formik.errors.rp_email)}
                    helperText={formik.touched.rp_email && formik.errors.rp_email}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Income Tax Group */}
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                Income Tax
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="it_pan"
                    name="it_pan"
                    label="PAN"
                    value={formik.values.it_pan}
                    onChange={formik.handleChange}
                    error={formik.touched.it_pan && Boolean(formik.errors.it_pan)}
                    helperText={formik.touched.it_pan && formik.errors.it_pan}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="it_password"
                    name="it_password"
                    label="Password"
                    type="password"
                    value={formik.values.it_password}
                    onChange={formik.handleChange}
                    error={formik.touched.it_password && Boolean(formik.errors.it_password)}
                    helperText={formik.touched.it_password && formik.errors.it_password}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="it_mobile"
                    name="it_mobile"
                    label="Registered Mobile Number"
                    value={formik.values.it_mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.it_mobile && Boolean(formik.errors.it_mobile)}
                    helperText={formik.touched.it_mobile && formik.errors.it_mobile}
                  />
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

export default TDSAndIncomeTax;
