import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  CircularProgress
} from '@mui/material';
import { industries } from 'utils/industries';
import { entity_choices } from 'utils/Entity-types';
import { __IndianStates } from 'utils/indianStates';
import Factory from 'utils/Factory';

// Add a mapping for entity types
const entityTypeMapping = {
  privateLimitedCompany: 'Private Limited Company',
  publicCompanyListed: 'Public Company Listed',
  publicCompanyUnlisted: 'Public Company Unlisted',
  soleProprietor: 'Sole Proprietor',
  partnershipUnregistered: 'Partnership Unregistered',
  partnershipRegistered: 'Partnership Registered',
  llp: 'LLP',
  huf: 'HUF',
  trust: 'Trust',
  society: 'Society',
  opc: 'OPC',
  others: 'Others (Specify)'
};

const validationSchema = Yup.object({
  nameOfBusiness: Yup.string().required('Business name is required'),
  business_nature: Yup.string().required('Industry is required'),
  pan: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number')
    .required('Business PAN is required'),
  registrationNumber: Yup.string().required('Registration No. is required'),
  entityType: Yup.string().required('Entity type is required'),
  dob_or_incorp_date: Yup.date().required('Date of Incorporation is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
  headOffice: Yup.object({
    address_line1: Yup.string().required('Address line 1 is required'),
    address_line2: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, 'Invalid PIN code')
      .required('PIN code is required')
  }),
  is_msme_registered: Yup.string().oneOf(['yes', 'no']).required(),
  msme_registration_type: Yup.string().when('is_msme_registered', {
    is: 'yes',
    then: () => Yup.string().required('MSME type is required'),
    otherwise: () => Yup.string().nullable()
  }),
  msme_registration_number: Yup.string().when('is_msme_registered', {
    is: 'yes',
    then: () => Yup.string().required('MSME number is required'),
    otherwise: () => Yup.string().nullable()
  })
});

const BusinessProfile = ({ user, tabChange, tabval }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      nameOfBusiness: '',
      business_nature: '',
      pan: '',
      registrationNumber: '',
      entityType: '',
      dob_or_incorp_date: '',
      email: '',
      mobile_number: '',
      headOffice: {
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: ''
      },
      is_msme_registered: 'no',
      msme_registration_type: '',
      msme_registration_number: '',
      trade_name: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await Factory('put', `/user_management/businesses/${user.active_context.business_id}/`, values, {});

        if (response.res.status_cd === 0) {
          enqueueSnackbar('Business profile updated successfully', {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'right' }
          });
          tabChange('e', 1 + tabval);
        } else {
          enqueueSnackbar(response.res.message || 'Failed to update business profile', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            ContentProps: {
              sx: {
                color: 'white'
              }
            }
          });
        }
      } catch (error) {
        console.error('Error updating business profile:', error);
        enqueueSnackbar('Failed to update business profile', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          ContentProps: {
            sx: {
              color: 'white'
            }
          }
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  useEffect(() => {
    const getBusinessProfile = async () => {
      try {
        setIsLoading(true);
        const response = await Factory('get', `/user_management/businesses/${user.active_context.business_id}/`, {}, {});
        if (response.res.status_cd === 0) {
          const profileData = response.res.data;
          formik.setValues({
            nameOfBusiness: profileData.nameOfBusiness || '',
            business_nature: profileData.business_nature || '',
            pan: profileData.pan || '',
            registrationNumber: profileData.registrationNumber || '',
            entityType: profileData.entityType || '',
            dob_or_incorp_date: profileData.dob_or_incorp_date || '',
            email: profileData.email || '',
            mobile_number: profileData.mobile_number || '',
            headOffice: {
              address_line1: profileData.headOffice?.address_line1 || '',
              address_line2: profileData.headOffice?.address_line2 || '',
              city: profileData.headOffice?.city || '',
              state: profileData.headOffice?.state || '',
              pincode: profileData.headOffice?.pincode || ''
            },
            is_msme_registered: profileData.is_msme_registered || 'no',
            msme_registration_type: profileData.msme_registration_type || '',
            msme_registration_number: profileData.msme_registration_number || '',
            trade_name: profileData.trade_name || ''
          });
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
        enqueueSnackbar('Failed to load business profile', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          ContentProps: {
            sx: {
              color: 'white'
            }
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    getBusinessProfile();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {/* Business Name Header */}
        <Grid item xs={12}>
          <Typography variant="h4" color="text.primary" gutterBottom>
            Business Profile
          </Typography>
        </Grid>

        {/* First Row: Business Name, Business PAN, and Logo */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="nameOfBusiness"
            name="nameOfBusiness"
            label="Business Name"
            value={formik.values.nameOfBusiness}
            onChange={formik.handleChange}
            error={formik.touched.nameOfBusiness && Boolean(formik.errors.nameOfBusiness)}
            helperText={formik.touched.nameOfBusiness && formik.errors.nameOfBusiness}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="pan"
            name="pan"
            label="Business PAN"
            value={formik.values.pan}
            onChange={formik.handleChange}
            error={formik.touched.pan && Boolean(formik.errors.pan)}
            helperText={formik.touched.pan && formik.errors.pan}
          />
        </Grid>

        {/* <Grid item xs={12} sm={4}> */}
          {/* <Box sx={{ mb: 2 }}>
            <input accept="image/*" style={{ display: 'none' }} id="logo-upload" type="file" onChange={handleLogoChange} />
            <label htmlFor="logo-upload">
              <Button variant="outlined" component="span" size="small">
                Upload Logo
              </Button>
            </label>
            {logoFile && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                {logoFile.name}
              </Typography>
            )}
          </Box> */}
        {/* </Grid> */}

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" error={formik.touched.business_nature && Boolean(formik.errors.business_nature)}>
            <InputLabel>Industry</InputLabel>
            <Select
              id="business_nature"
              name="business_nature"
              value={formik.values.business_nature}
              label="Industry"
              onChange={formik.handleChange}
            >
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.business_nature && formik.errors.business_nature && (
              <FormHelperText>{formik.errors.business_nature}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" error={formik.touched.entityType && Boolean(formik.errors.entityType)}>
            <InputLabel>Entity Type</InputLabel>
            <Select id="entityType" name="entityType" value={formik.values.entityType} label="Entity Type" onChange={formik.handleChange}>
              {Object.entries(entityTypeMapping).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.entityType && formik.errors.entityType && <FormHelperText>{formik.errors.entityType}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="registrationNumber"
            name="registrationNumber"
            label="Registration No."
            value={formik.values.registrationNumber}
            onChange={formik.handleChange}
            error={formik.touched.registrationNumber && Boolean(formik.errors.registrationNumber)}
            helperText={formik.touched.registrationNumber && formik.errors.registrationNumber}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
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

        {/* Primary Contact */}
        <Grid item xs={12}>
          <Typography variant="h5" color="text.primary" gutterBottom sx={{ mt: 2 }}>
            Primary Contact
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
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

        <Grid item xs={12} sm={6} md={6}>
          <TextField
            fullWidth
            size="small"
            id="mobile_number"
            name="mobile_number"
            label="Mobile"
            value={formik.values.mobile_number}
            onChange={formik.handleChange}
            error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
            helperText={formik.touched.mobile_number && formik.errors.mobile_number}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="headOffice.address_line1"
            name="headOffice.address_line1"
            label="Address Line 1"
            value={formik.values.headOffice.address_line1}
            onChange={formik.handleChange}
            error={formik.touched.headOffice?.address_line1 && Boolean(formik.errors.headOffice?.address_line1)}
            helperText={formik.touched.headOffice?.address_line1 && formik.errors.headOffice?.address_line1}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="headOffice.address_line2"
            name="headOffice.address_line2"
            label="Address Line 2"
            value={formik.values.headOffice.address_line2}
            onChange={formik.handleChange}
            error={formik.touched.headOffice?.address_line2 && Boolean(formik.errors.headOffice?.address_line2)}
            helperText={formik.touched.headOffice?.address_line2 && formik.errors.headOffice?.address_line2}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            id="headOffice.city"
            name="headOffice.city"
            label="City"
            value={formik.values.headOffice.city}
            onChange={formik.handleChange}
            error={formik.touched.headOffice?.city && Boolean(formik.errors.headOffice?.city)}
            helperText={formik.touched.headOffice?.city && formik.errors.headOffice?.city}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" error={formik.touched.headOffice?.state && Boolean(formik.errors.headOffice?.state)}>
            <InputLabel>State</InputLabel>
            <Select
              id="headOffice.state"
              name="headOffice.state"
              value={formik.values.headOffice.state}
              label="State"
              onChange={formik.handleChange}
            >
              {__IndianStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.headOffice?.state && formik.errors.headOffice?.state && (
              <FormHelperText>{formik.errors.headOffice?.state}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            id="headOffice.pincode"
            name="headOffice.pincode"
            label="PIN Code"
            value={formik.values.headOffice.pincode}
            onChange={formik.handleChange}
            error={formik.touched.headOffice?.pincode && Boolean(formik.errors.headOffice?.pincode)}
            helperText={formik.touched.headOffice?.pincode && formik.errors.headOffice?.pincode}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth size="small" id="country" name="country" label="Country" value="India" disabled />
        </Grid>

        {/* MSME Section */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1" gutterBottom>
              Is your business MSME Registered?
            </Typography>
            <RadioGroup row name="is_msme_registered" value={formik.values.is_msme_registered} onChange={formik.handleChange}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {formik.values.is_msme_registered === 'yes' && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                size="small"
                error={formik.touched.msme_registration_type && Boolean(formik.errors.msme_registration_type)}
              >
                <InputLabel>MSME/Udyam Registration Type</InputLabel>
                <Select
                  id="msme_registration_type"
                  name="msme_registration_type"
                  value={formik.values.msme_registration_type}
                  label="MSME/Udyam Registration Type"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="micro">Micro</MenuItem>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                </Select>
                {formik.touched.msme_registration_type && formik.errors.msme_registration_type && (
                  <FormHelperText>{formik.errors.msme_registration_type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                id="msme_registration_number"
                name="msme_registration_number"
                label="MSME/Udyam Registration Number"
                value={formik.values.msme_registration_number}
                onChange={formik.handleChange}
                error={formik.touched.msme_registration_number && Boolean(formik.errors.msme_registration_number)}
                helperText={formik.touched.msme_registration_number && formik.errors.msme_registration_number}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            * For MSME registered businesses, please include your MSME registration number in the address.
          </Typography>
        </Grid>
        {/* Submit Button */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" size="medium" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessProfile;
