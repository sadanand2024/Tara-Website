import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  IconButton,
  Stack,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTheme } from '@mui/material/styles';
import { DIALOG_TITLE_PADDING, DIALOG_CONTENT_PADDING } from 'config';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { states } from 'utils/constants';
const Personal = ({ open, onClose, onSubmit, isSubmitting, cancel }) => {
  const theme = useTheme();

  const requiredLabel = (label) => (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
      {label}
      <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
        *
      </Typography>
    </Box>
  );

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name should be at least 3 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Name should only contain letters'),
    pan_number: Yup.string()
      .required('PAN Number is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number format'),
    aadhaar_number: Yup.string()
      .required('Aadhaar Number is required')
      .matches(/^\d{12}$/, 'Aadhaar Number should be 12 digits'),
    date: Yup.date()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future')
      .test('age', 'Must be at least 18 years old', (value) => {
        if (!value) return false;
        return dayjs().diff(dayjs(value), 'year') >= 18;
      }),
    // icai_number: Yup.string()
    //   .required('ICAI Number is required')
    //   .matches(/^\d{6}$/, 'ICAI Number should be 6 digits'),
    address: Yup.object({
      address_line1: Yup.string().required('Address Line 1 is required').min(5, 'Address should be at least 5 characters'),
      address_line2: Yup.string(),
      pinCode: Yup.string()
        .required('PIN Code is required')
        .matches(/^\d{6}$/, 'PIN Code should be 6 digits'),
      state: Yup.string().required('State is required'),
      city: Yup.string()
        .required('City is required')
        .matches(/^[a-zA-Z\s]+$/, 'City should only contain letters'),
      country: Yup.string().required('Country is required')
    })
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      pan_number: '',
      aadhaar_number: '',
      date: null,
      //   icai_number: '',
      address: {
        address_line1: '',
        address_line2: '',
        pinCode: '',
        state: '',
        city: '',
        country: 'India'
      }
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const submissionData = {
          ...values,
          date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
          address: {
            ...values.address,
            pinCode: values.address.pinCode ? parseInt(values.address.pinCode, 10) : ''
          }
        };
        await onSubmit(submissionData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="column" spacing={0}>
            <Typography variant="h3">Add Personal Details</Typography>
            <Typography variant="caption">Your personal details will be used to create your profile</Typography>
          </Stack>
        </Box>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ ...DIALOG_CONTENT_PADDING }} dividers>
          <Grid container spacing={2} disableEqualOverflow>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label={requiredLabel('Full Name')}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('PAN Number')}
                name="pan_number"
                value={formik.values.pan_number}
                onChange={(e) => formik.setFieldValue('pan_number', e.target.value.toUpperCase())}
                onBlur={formik.handleBlur}
                error={formik.touched.pan_number && Boolean(formik.errors.pan_number)}
                helperText={formik.touched.pan_number && formik.errors.pan_number}
                inputProps={{ maxLength: 10 }}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('Aadhaar Number')}
                name="aadhaar_number"
                value={formik.values.aadhaar_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.aadhaar_number && Boolean(formik.errors.aadhaar_number)}
                helperText={formik.touched.aadhaar_number && formik.errors.aadhaar_number}
                inputProps={{ maxLength: 12 }}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={requiredLabel('Date of Birth')}
                  value={formik.values.date}
                  onChange={(value) => formik.setFieldValue('date', value)}
                  onBlur={() => formik.setFieldTouched('date', true)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date && formik.errors.date
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('ICAI Number')}
                name="icai_number"
                value={formik.values.icai_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.icai_number && Boolean(formik.errors.icai_number)}
                helperText={formik.touched.icai_number && formik.errors.icai_number}
                size="small"
              />
            </Grid> */}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label={requiredLabel('Address Line 1')}
                name="address.address_line1"
                value={formik.values.address.address_line1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.address_line1 && Boolean(formik.errors.address?.address_line1)}
                helperText={formik.touched.address?.address_line1 && formik.errors.address?.address_line1}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address.address_line2"
                value={formik.values.address.address_line2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.address_line2 && Boolean(formik.errors.address?.address_line2)}
                helperText={formik.touched.address?.address_line2 && formik.errors.address?.address_line2}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('City')}
                name="address.city"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                helperText={formik.touched.address?.city && formik.errors.address?.city}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label={requiredLabel('State')}
                name="address.state"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                helperText={formik.touched.address?.state && formik.errors.address?.state}
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
                name="address.country"
                value={formik.values.address.country}
                disabled
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={requiredLabel('PIN Code')}
                name="address.pinCode"
                value={formik.values.address.pinCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.pinCode && Boolean(formik.errors.address?.pinCode)}
                helperText={formik.touched.address?.pinCode && formik.errors.address?.pinCode}
                type="number"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          {cancel && (
            <Button onClick={onClose} variant="outlined" color="error" size="medium">
              Cancel
            </Button>
          )}
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

export default Personal;
