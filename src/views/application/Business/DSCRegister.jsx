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
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const dscTypes = ['Type 2', 'Type 3'];
const issuingAuthorities = ['eMudhra', 'Sify', 'Capricorn', 'NSDL'];

const initialDSC = [
  {
    name: 'John Doe',
    dsc_serial: 'DSC123456',
    type: 'Type 2',
    issuing_authority: 'eMudhra',
    issue_date: '2022-01-01',
    expiry_date: '2024-01-01',
    email: 'john@example.com',
    mobile: '9876543210',
    password: 'secret123',
    status: 'Active',
    location: 'Mumbai'
  }
];

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  dsc_serial: Yup.string().required('DSC Serial Number is required'),
  type: Yup.string().required('Type is required'),
  issuing_authority: Yup.string().required('Issuing Authority is required'),
  issue_date: Yup.string().required('Date of Issue is required'),
  expiry_date: Yup.string().required('Expiry Date is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile: Yup.string().required('Mobile is required'),
  password: Yup.string().required('Password is required'),
  location: Yup.string().required('Location is required')
});

const DSCRegister = () => {
  const [dscList, setDscList] = useState(initialDSC);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [viewPasswordIndex, setViewPasswordIndex] = useState(null);

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

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this DSC?')) {
      setDscList(dscList.filter((_, i) => i !== index));
    }
  };

  const handleViewPassword = (index) => {
    setViewPasswordIndex(viewPasswordIndex === index ? null : index);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      dsc_serial: '',
      type: '',
      issuing_authority: '',
      issue_date: '',
      expiry_date: '',
      email: '',
      mobile: '',
      password: '',
      location: ''
    },
    validationSchema,
    onSubmit: (values) => {
      if (editIndex !== null) {
        const updated = [...dscList];
        updated[editIndex] = values;
        setDscList(updated);
      } else {
        setDscList([...dscList, values]);
      }
      handleClose();
    }
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          DSC Register
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
          Add DSC
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Valid Till</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dscList.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.expiry_date}</TableCell>
                  <TableCell>{row.status}</TableCell>

                  <TableCell>{row.location}</TableCell>
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
              {dscList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    No DSCs added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit DSC Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editIndex !== null ? 'Edit DSC' : 'Add DSC'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
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
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="dsc_serial"
                  name="dsc_serial"
                  label="DSC Serial Number"
                  value={formik.values.dsc_serial}
                  onChange={formik.handleChange}
                  error={formik.touched.dsc_serial && Boolean(formik.errors.dsc_serial)}
                  helperText={formik.touched.dsc_serial && formik.errors.dsc_serial}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={formik.touched.type && Boolean(formik.errors.type)}>
                  <InputLabel>Type</InputLabel>
                  <Select id="type" name="type" value={formik.values.type} label="Type" onChange={formik.handleChange}>
                    {dscTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={formik.touched.issuing_authority && Boolean(formik.errors.issuing_authority)}>
                  <InputLabel>Issuing Authority</InputLabel>
                  <Select
                    id="issuing_authority"
                    name="issuing_authority"
                    value={formik.values.issuing_authority}
                    label="Issuing Authority"
                    onChange={formik.handleChange}
                  >
                    {issuingAuthorities.map((auth) => (
                      <MenuItem key={auth} value={auth}>
                        {auth}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="expiry_date"
                  name="expiry_date"
                  label="Expiry Date"
                  type="date"
                  value={formik.values.expiry_date}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.expiry_date && Boolean(formik.errors.expiry_date)}
                  helperText={formik.touched.expiry_date && formik.errors.expiry_date}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="mobile"
                  name="mobile"
                  label="Mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={formik.touched.mobile && formik.errors.mobile}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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

export default DSCRegister;
