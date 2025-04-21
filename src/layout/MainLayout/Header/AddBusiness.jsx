import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// material-ui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormHelperText,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';

const validationSchema = Yup.object({
  businessName: Yup.string().required('Business name is required'),
  businessType: Yup.string().required('Business type is required'),
  gstNumber: Yup.string()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number')
    .required('GST number is required'),
  address: Yup.string().required('Address is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required')
});

const businessTypes = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'Limited Liability Partnership' },
  { value: 'pvt_ltd', label: 'Private Limited Company' },
  { value: 'public_ltd', label: 'Public Limited Company' }
];

const AddBusiness = ({ open, onClose }) => {
  const formik = useFormik({
    initialValues: {
      businessName: '',
      businessType: '',
      gstNumber: '',
      address: '',
      email: '',
      phone: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('Business Details:', values);
      resetForm();
      onClose();
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h4">Add New Business</Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={6}>
              <TextField
                fullWidth
                id="businessName"
                name="businessName"
                label="Business Name"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                error={formik.touched.businessName && Boolean(formik.errors.businessName)}
                helperText={formik.touched.businessName && formik.errors.businessName}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth error={formik.touched.businessType && Boolean(formik.errors.businessType)}>
                <InputLabel>Business Type</InputLabel>
                <Select
                  id="businessType"
                  name="businessType"
                  value={formik.values.businessType}
                  label="Business Type"
                  onChange={formik.handleChange}
                >
                  {businessTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.businessType && formik.errors.businessType && (
                  <FormHelperText>{formik.errors.businessType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                id="gstNumber"
                name="gstNumber"
                label="GST Number"
                value={formik.values.gstNumber}
                onChange={formik.handleChange}
                error={formik.touched.gstNumber && Boolean(formik.errors.gstNumber)}
                helperText={formik.touched.gstNumber && formik.errors.gstNumber}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Business Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Business Address"
                multiline
                rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            Add Business
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

AddBusiness.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddBusiness; 