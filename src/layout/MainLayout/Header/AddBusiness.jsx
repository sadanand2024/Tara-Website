import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'hooks/useAuth';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

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
  MenuItem,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import Factory from 'utils/Factory';
import { __IndianStates } from '../../../utils/indianStates';

const validationSchema = Yup.object({
  business_name: Yup.string().required('Business name is required'),
  registration_number: Yup.string().required('Registration number is required'),
  entity_type: Yup.string().required('Entity type is required'),
  head_office: Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    pincode: Yup.string().required('Pincode is required')
  }),
  pan: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number')
    .required('PAN is required'),
  business_nature: Yup.string().required('Business nature is required'),
  trade_name: Yup.string().required('Trade name is required'),
  mobile_number: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  dob_or_incorp_date: Yup.date().required('Date of incorporation is required').max(new Date(), 'Date cannot be in the future')
});

const entityTypes = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'privateLimitedCompany', label: 'Private Limited Company' },
  { value: 'publicLimitedCompany', label: 'Public Limited Company' },
  { value: 'llp', label: 'Limited Liability Partnership' }
];

const AddBusiness = ({ open, onClose, userData, setUserData, getContext }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      user_id: userData.user.id,
      business_name: '',
      registration_number: '',
      entity_type: '',
      head_office: {
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: ''
      },
      pan: '',
      business_nature: '',
      trade_name: '',
      mobile_number: '',
      email: '',
      dob_or_incorp_date: ''
    },

    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await Factory('post', '/user_management/business/create/', values, {});
        if (response.res.status_cd === 0) {
          resetForm();
          dispatch(
            openSnackbar({
              open: true,
              message: 'Business Added Successfully',
              variant: 'alert',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              alert: { color: 'success' },
              close: false,
              severity: 'success'
            })
          );
          getContext();
          onClose();
          // You might want to add a success notification here
        }
      } catch (error) {
        console.error('Error registering business:', error);
        // You might want to add an error notification here
      } finally {
        setSubmitting(false);
      }
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3">Add New Business</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                id="business_name"
                name="business_name"
                label="Business Name"
                value={formik.values.business_name}
                onChange={formik.handleChange}
                error={formik.touched.business_name && Boolean(formik.errors.business_name)}
                helperText={formik.touched.business_name && formik.errors.business_name}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="registration_number"
                name="registration_number"
                label="Registration Number"
                value={formik.values.registration_number}
                onChange={formik.handleChange}
                error={formik.touched.registration_number && Boolean(formik.errors.registration_number)}
                helperText={formik.touched.registration_number && formik.errors.registration_number}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth size="small" error={formik.touched.entity_type && Boolean(formik.errors.entity_type)}>
                <InputLabel>Entity Type</InputLabel>
                <Select
                  id="entity_type"
                  name="entity_type"
                  value={formik.values.entity_type}
                  label="Entity Type"
                  onChange={formik.handleChange}
                >
                  {entityTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.entity_type && formik.errors.entity_type && <FormHelperText>{formik.errors.entity_type}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="pan"
                name="pan"
                label="PAN Number"
                value={formik.values.pan}
                onChange={formik.handleChange}
                error={formik.touched.pan && Boolean(formik.errors.pan)}
                helperText={formik.touched.pan && formik.errors.pan}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="business_nature"
                name="business_nature"
                label="Nature of Business"
                value={formik.values.business_nature}
                onChange={formik.handleChange}
                error={formik.touched.business_nature && Boolean(formik.errors.business_nature)}
                helperText={formik.touched.business_nature && formik.errors.business_nature}
              />
            </Grid>
            <Grid size={6}>
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
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="mobile_number"
                name="mobile_number"
                label="Mobile Number"
                value={formik.values.mobile_number}
                onChange={formik.handleChange}
                error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
                helperText={formik.touched.mobile_number && formik.errors.mobile_number}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="email"
                name="email"
                label="Business Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="dob_or_incorp_date"
                name="dob_or_incorp_date"
                label="Date of Incorporation"
                type="date"
                value={formik.values.dob_or_incorp_date}
                onChange={formik.handleChange}
                error={formik.touched.dob_or_incorp_date && Boolean(formik.errors.dob_or_incorp_date)}
                helperText={formik.touched.dob_or_incorp_date && formik.errors.dob_or_incorp_date}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                id="head_office.address"
                name="head_office.address"
                label="Address"
                value={formik.values.head_office.address}
                onChange={formik.handleChange}
                error={formik.touched.head_office?.address && Boolean(formik.errors.head_office?.address)}
                helperText={formik.touched.head_office?.address && formik.errors.head_office?.address}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="head_office.city"
                name="head_office.city"
                label="City"
                value={formik.values.head_office.city}
                onChange={formik.handleChange}
                error={formik.touched.head_office?.city && Boolean(formik.errors.head_office?.city)}
                helperText={formik.touched.head_office?.city && formik.errors.head_office?.city}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth size="small" error={formik.touched.head_office?.state && Boolean(formik.errors.head_office?.state)}>
                <InputLabel>State</InputLabel>
                <Select
                  id="head_office.state"
                  name="head_office.state"
                  value={formik.values.head_office.state}
                  label="State"
                  onChange={formik.handleChange}
                >
                  {__IndianStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.head_office?.state && formik.errors.head_office?.state && (
                  <FormHelperText>{formik.errors.head_office.state}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="head_office.country"
                name="head_office.country"
                label="Country"
                disabled
                value={formik.values.head_office.country}
                onChange={formik.handleChange}
                error={formik.touched.head_office?.country && Boolean(formik.errors.head_office?.country)}
                helperText={formik.touched.head_office?.country && formik.errors.head_office?.country}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                id="head_office.pincode"
                name="head_office.pincode"
                label="Pincode"
                value={formik.values.head_office.pincode}
                onChange={formik.handleChange}
                error={formik.touched.head_office?.pincode && Boolean(formik.errors.head_office?.pincode)}
                helperText={formik.touched.head_office?.pincode && formik.errors.head_office?.pincode}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
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
