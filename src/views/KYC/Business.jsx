import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DIALOG_TITLE_PADDING, DIALOG_CONTENT_PADDING } from 'config';
import { useTheme } from '@mui/material/styles';
import { entityTypes, businessNatureChoices, states } from '../../utils/constants';

const BusinessKYCDialog = ({ open, onClose, onSubmit, isSubmitting }) => {
  const theme = useTheme();

  const validationSchema = Yup.object({
    nameOfBusiness: Yup.string().required('Business name is required').min(3, 'Business name should be at least 3 characters'),
    registrationNumber: Yup.string()
      .required('Registration number is required')
      .min(6, 'Registration number should be at least 6 characters'),
    entityType: Yup.string().required('Entity type is required'),
    pan: Yup.string()
      .required('PAN is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
    business_nature: Yup.string().required('Nature of business is required'),
    trade_name: Yup.string().required('Trade name is required'),
    mobile_number: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Invalid mobile number'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    dob_or_incorp_date: Yup.date().required('Date of incorporation is required').max(new Date(), 'Date cannot be in the future'),
    headOffice: Yup.object({
      address_line1: Yup.string().required('Address line 1 is required').min(5, 'Address should be at least 5 characters'),
      address_line2: Yup.string(),
      city: Yup.string()
        .required('City is required')
        .matches(/^[a-zA-Z\s]+$/, 'City should only contain letters'),
      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      pincode: Yup.number().required('PIN code is required').min(100000, 'Invalid PIN code').max(999999, 'Invalid PIN code')
    })
  });

  const formik = useFormik({
    initialValues: {
      nameOfBusiness: '',
      registrationNumber: '',
      entityType: '',
      pan: '',
      business_nature: '',
      trade_name: '',
      mobile_number: '',
      email: '',
      dob_or_incorp_date: null,
      headOffice: {
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: 'India',
        pincode: ''
      }
    },
    validationSchema,
    onSubmit: (values) => {
      const submissionData = {
        ...values,
        dob_or_incorp_date: values.dob_or_incorp_date ? dayjs(values.dob_or_incorp_date).format('YYYY-MM-DD') : null,
        headOffice: {
          ...values.headOffice,
          pincode: values.headOffice.pincode ? parseInt(values.headOffice.pincode, 10) : ''
        }
      };
      onSubmit(submissionData);
    }
  });

  const requiredLabel = (label) => (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
      {label}
      <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
        *
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          m: 2
        }
      }}
    >
      <DialogTitle sx={{ ...DIALOG_TITLE_PADDING }}>
        <Stack direction="column" spacing={0}>
          <Typography variant="h3">Business KYC</Typography>
          <Typography variant="caption">Please provide your business details for KYC verification</Typography>
        </Stack>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ ...DIALOG_CONTENT_PADDING }} dividers>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('Business Name')}
                name="nameOfBusiness"
                value={formik.values.nameOfBusiness}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nameOfBusiness && Boolean(formik.errors.nameOfBusiness)}
                helperText={formik.touched.nameOfBusiness && formik.errors.nameOfBusiness}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('Registration Number')}
                name="registrationNumber"
                value={formik.values.registrationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.registrationNumber && Boolean(formik.errors.registrationNumber)}
                helperText={formik.touched.registrationNumber && formik.errors.registrationNumber}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label={requiredLabel('Entity Type')}
                name="entityType"
                value={formik.values.entityType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.entityType && Boolean(formik.errors.entityType)}
                helperText={formik.touched.entityType && formik.errors.entityType}
                size="small"
              >
                {entityTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('PAN')}
                name="pan"
                value={formik.values.pan}
                onChange={(e) => formik.setFieldValue('pan', e.target.value.toUpperCase())}
                onBlur={formik.handleBlur}
                error={formik.touched.pan && Boolean(formik.errors.pan)}
                helperText={formik.touched.pan && formik.errors.pan}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label={requiredLabel('Nature of Business')}
                name="business_nature"
                value={formik.values.business_nature}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.business_nature && Boolean(formik.errors.business_nature)}
                helperText={formik.touched.business_nature && formik.errors.business_nature}
                size="small"
              >
                {businessNatureChoices.map((choice) => (
                  <MenuItem key={choice} value={choice}>
                    {choice}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('Trade Name')}
                name="trade_name"
                value={formik.values.trade_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.trade_name && Boolean(formik.errors.trade_name)}
                helperText={formik.touched.trade_name && formik.errors.trade_name}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('Mobile Number')}
                name="mobile_number"
                value={formik.values.mobile_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
                helperText={formik.touched.mobile_number && formik.errors.mobile_number}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('Email')}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={requiredLabel('Date of Incorporation')}
                  value={formik.values.dob_or_incorp_date}
                  onChange={(value) => formik.setFieldValue('dob_or_incorp_date', value)}
                  onBlur={() => formik.setFieldTouched('dob_or_incorp_date', true)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      error: formik.touched.dob_or_incorp_date && Boolean(formik.errors.dob_or_incorp_date),
                      helperText: formik.touched.dob_or_incorp_date && formik.errors.dob_or_incorp_date
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <Typography variant="h4" sx={{ m: 0 }}>
                Head Office Address
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('Address Line 1')}
                name="headOffice.address_line1"
                value={formik.values.headOffice.address_line1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.headOffice?.address_line1 && Boolean(formik.errors.headOffice?.address_line1)}
                helperText={formik.touched.headOffice?.address_line1 && formik.errors.headOffice?.address_line1}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="headOffice.address_line2"
                value={formik.values.headOffice.address_line2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.headOffice?.address_line2 && Boolean(formik.errors.headOffice?.address_line2)}
                helperText={formik.touched.headOffice?.address_line2 && formik.errors.headOffice?.address_line2}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
                label={requiredLabel('City')}
                name="headOffice.city"
                value={formik.values.headOffice.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.headOffice?.city && Boolean(formik.errors.headOffice?.city)}
                helperText={formik.touched.headOffice?.city && formik.errors.headOffice?.city}
                size="small"
            />
          </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label={requiredLabel('State')}
                name="headOffice.state"
                value={formik.values.headOffice.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.headOffice?.state && Boolean(formik.errors.headOffice?.state)}
                helperText={formik.touched.headOffice?.state && formik.errors.headOffice?.state}
                size="small"
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
                label={requiredLabel('Country')}
                name="headOffice.country"
                value={formik.values.headOffice.country}
                disabled
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('PIN Code')}
                name="headOffice.pincode"
                type="number"
                value={formik.values.headOffice.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.headOffice?.pincode && Boolean(formik.errors.headOffice?.pincode)}
                helperText={formik.touched.headOffice?.pincode && formik.errors.headOffice?.pincode}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            disabled={isSubmitting || !formik.dirty || Object.keys(formik.errors).length > 0}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BusinessKYCDialog;
