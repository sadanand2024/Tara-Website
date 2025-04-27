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
  Stack,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialLicenses = [
  {
    license_name: 'Trade License',
    license_number: 'TL12345',
    location: 'Mumbai',
    issue_date: '2022-01-01',
    expiry_date: '2025-01-01',
    status: 'Active',
    doc: null
  },
  {
    license_name: 'Food License',
    license_number: 'FL67890',
    location: 'Delhi',
    issue_date: '2021-06-15',
    expiry_date: '2024-06-15',
    status: 'Active',
    doc: null
  }
];

const validationSchema = Yup.object({
  license_name: Yup.string().required('License Name is required'),
  license_number: Yup.string().required('License Number is required'),
  location: Yup.string().required('Location is required'),
  issue_date: Yup.string().required('Date of Issue is required'),
  expiry_date: Yup.string().required('Valid Till is required'),
  doc: Yup.mixed()
});

const licenseNameOptions = ['Trade', 'Labour', 'Food', 'Trade Mark', 'Add New'];

const Licenses = () => {
  const [licenses, setLicenses] = useState(initialLicenses);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [customLicenseName, setCustomLicenseName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    formik.setValues({ ...licenses[index] });
    setOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this license?')) {
      setLicenses(licenses.filter((_, i) => i !== index));
    }
  };

  const formik = useFormik({
    initialValues: {
      license_name: '',
      license_number: '',
      location: '',
      issue_date: '',
      expiry_date: '',
      doc: null
    },
    validationSchema,
    onSubmit: (values) => {
      let finalValues = { ...values };
      if (values.license_name === 'Add New') {
        finalValues.license_name = customLicenseName;
      }
      if (editIndex !== null) {
        const updated = [...licenses];
        updated[editIndex] = finalValues;
        setLicenses(updated);
      } else {
        setLicenses([...licenses, finalValues]);
      }
      setCustomLicenseName('');
      handleClose();
    }
  });

  const handleDocDownload = (doc) => {
    if (doc) {
      const url = URL.createObjectURL(doc);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
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
                <TableCell>License Name</TableCell>
                <TableCell>License Number</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Doc</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {licenses.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.license_name}</TableCell>
                  <TableCell>{row.license_number}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.expiry_date}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    {row.doc ? (
                      <Tooltip title="Download/View Document">
                        <IconButton size="small" onClick={() => handleDocDownload(row.doc)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
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
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small" error={formik.touched.license_name && Boolean(formik.errors.license_name)}>
                  <InputLabel>License Name</InputLabel>
                  <Select
                    id="license_name"
                    name="license_name"
                    value={formik.values.license_name}
                    label="License Name"
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (e.target.value !== 'Add New') setCustomLicenseName('');
                    }}
                  >
                    {licenseNameOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.license_name && formik.errors.license_name && (
                    <Typography variant="caption" color="error">
                      {formik.errors.license_name}
                    </Typography>
                  )}
                </FormControl>
                {formik.values.license_name === 'Add New' && (
                  <Box mt={1}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Enter License Name"
                      value={customLicenseName}
                      onChange={(e) => setCustomLicenseName(e.target.value)}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  id="license_number"
                  name="license_number"
                  label="License Number"
                  value={formik.values.license_number}
                  onChange={formik.handleChange}
                  error={formik.touched.license_number && Boolean(formik.errors.license_number)}
                  helperText={formik.touched.license_number && formik.errors.license_number}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  id="location"
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  id="issue_date"
                  name="issue_date"
                  label="Date of Issue"
                  type="date"
                  value={formik.values.issue_date}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.issue_date && Boolean(formik.errors.issue_date)}
                  helperText={formik.touched.issue_date && formik.errors.issue_date}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  id="expiry_date"
                  name="expiry_date"
                  label="Valid Till"
                  type="date"
                  value={formik.values.expiry_date}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.expiry_date && Boolean(formik.errors.expiry_date)}
                  helperText={formik.touched.expiry_date && formik.errors.expiry_date}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button variant="outlined" component="label" fullWidth size="small" sx={{ height: '40px' }}>
                  Upload Doc
                  <input type="file" hidden onChange={(e) => formik.setFieldValue('doc', e.currentTarget.files[0])} />
                </Button>
                {formik.values.doc && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {formik.values.doc.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} size="small" sx={{ color: 'text.primary' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Licenses;
