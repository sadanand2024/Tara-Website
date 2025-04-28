import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialPersonnel = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Director',
    din: 'DIN12345678',
    role: 'Executive',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    designation: 'CFO',
    din: 'DIN87654321',
    role: 'KMP',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    designation: 'Company Secretary',
    din: 'DIN45678912',
    role: 'KMP',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    designation: 'HR Director',
    din: 'DIN98765432',
    role: 'Executive',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Robert Brown',
    designation: 'CTO',
    din: 'DIN34567891',
    role: 'KMP',
    status: 'Active'
  }
];

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  designation: Yup.string().required('Designation is required'),
  din: Yup.string()
    .required('DIN/PAN is required')
    .matches(/^(DIN|PAN)[0-9]{8}$/, 'Invalid DIN/PAN format'),
  role: Yup.string().required('Role is required'),
  status: Yup.string().required('Status is required')
});

const KeyManagerialPersonnel = () => {
  const [personnel, setPersonnel] = useState(initialPersonnel);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditId(null);
  };

  const handleEdit = (person) => {
    setEditId(person.id);
    formik.setValues(person);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this personnel?')) {
      setPersonnel(personnel.filter((person) => person.id !== id));
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      designation: '',
      din: '',
      role: '',
      status: 'Active'
    },
    validationSchema,
    onSubmit: (values) => {
      if (editId) {
        setPersonnel(personnel.map((person) => (person.id === editId ? { ...values, id: editId } : person)));
      } else {
        setPersonnel([...personnel, { ...values, id: Date.now() }]);
      }
      handleClose();
    }
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h4" color="text.primary">
          Key Managerial Personnel
        </Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Personnel
        </Button>
      </Stack>

      <Card
        elevation={2}
        sx={{
          mb: 3,
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
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', py: 1 }}>Name</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', py: 1 }}>Designation</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', py: 1 }}>DIN/PAN</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', py: 1 }}>Role</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', py: 1 }}>Status</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', py: 1 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personnel.map((person) => (
                <TableRow key={person.id} hover>
                  <TableCell sx={{ color: 'text.primary' }}>{person.name}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{person.designation}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{person.din}</TableCell>
                  <TableCell>
                    <Chip label={person.role} color={person.role === 'Executive' ? 'primary' : 'secondary'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={person.status} color={person.status === 'Active' ? 'success' : 'error'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(person)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(person.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        * KMP - Key Managerial Personnel as per Companies Act, 2013
      </Typography>

      {/* Add/Edit Personnel Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'text.primary' }}>
          {editId ? 'Edit Personnel' : 'Add Personnel'}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
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
                  id="designation"
                  name="designation"
                  label="Designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  error={formik.touched.designation && Boolean(formik.errors.designation)}
                  helperText={formik.touched.designation && formik.errors.designation}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="din"
                  name="din"
                  label="DIN/PAN"
                  value={formik.values.din}
                  onChange={formik.handleChange}
                  error={formik.touched.din && Boolean(formik.errors.din)}
                  helperText={formik.touched.din && formik.errors.din}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={formik.touched.role && Boolean(formik.errors.role)}>
                  <InputLabel>Role</InputLabel>
                  <Select id="role" name="role" value={formik.values.role} label="Role" onChange={formik.handleChange}>
                    <MenuItem value="Executive">Executive</MenuItem>
                    <MenuItem value="KMP">KMP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" error={formik.touched.status && Boolean(formik.errors.status)}>
                  <InputLabel>Status</InputLabel>
                  <Select id="status" name="status" value={formik.values.status} label="Status" onChange={formik.handleChange}>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} size="small" sx={{ color: 'text.primary' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small" color="primary">
              {editId ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default KeyManagerialPersonnel;
