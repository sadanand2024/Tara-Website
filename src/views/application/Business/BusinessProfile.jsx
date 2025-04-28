import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  Typography
} from '@mui/material';
import { industries } from 'utils/industries';
import { entity_choices } from 'utils/Entity-types';
import { __IndianStates } from 'utils/indianStates';

const validationSchema = Yup.object({
  business_name: Yup.string().required('Business name is required'),
  industry: Yup.string().required('Industry is required'),
  business_pan: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number')
    .required('Business PAN is required'),
  cin_llpin_reg_no: Yup.string().required('CIN/LLPIN/Registration No. is required'),
  entity_type: Yup.string().required('Entity type is required'),
  dob_doi: Yup.date().required('Date of Incorporation is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
  address_line_1: Yup.string().required('Address line 1 is required'),
  address_line_2: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pin_code: Yup.string()
    .matches(/^[0-9]{6}$/, 'Invalid PIN code')
    .required('PIN code is required'),
  country: Yup.string().required('Country is required'),
  is_msme: Yup.boolean(),
  msme_type: Yup.string().when('is_msme', {
    is: true,
    then: Yup.string().required('MSME type is required')
  }),
  msme_number: Yup.string().when('is_msme', {
    is: true,
    then: Yup.string().required('MSME number is required')
  })
});

const BusinessProfile = () => {
  const [logoFile, setLogoFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      business_name: '',
      industry: '',
      business_pan: '',
      cin_llpin_reg_no: '',
      entity_type: '',
      dob_doi: '',
      email: '',
      mobile: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      pin_code: '',
      country: 'India',
      is_msme: false,
      msme_type: '',
      msme_number: ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Handle form submission
    }
  });

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

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
        <Grid item xs={12} sm={4}>
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

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            id="business_pan"
            name="business_pan"
            label="Business PAN"
            value={formik.values.business_pan}
            onChange={formik.handleChange}
            error={formik.touched.business_pan && Boolean(formik.errors.business_pan)}
            helperText={formik.touched.business_pan && formik.errors.business_pan}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box sx={{ mb: 2 }}>
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
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" error={formik.touched.industry && Boolean(formik.errors.industry)}>
            <InputLabel>Industry</InputLabel>
            <Select id="industry" name="industry" value={formik.values.industry} label="Industry" onChange={formik.handleChange}>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.industry && formik.errors.industry && <FormHelperText>{formik.errors.industry}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" error={formik.touched.entity_type && Boolean(formik.errors.entity_type)}>
            <InputLabel>Entity Type</InputLabel>
            <Select
              id="entity_type"
              name="entity_type"
              value={formik.values.entity_type}
              label="Entity Type"
              onChange={formik.handleChange}
            >
              {entity_choices.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.entity_type && formik.errors.entity_type && <FormHelperText>{formik.errors.entity_type}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="cin_llpin_reg_no"
            name="cin_llpin_reg_no"
            label="CIN/LLPIN/Reg. No."
            value={formik.values.cin_llpin_reg_no}
            onChange={formik.handleChange}
            error={formik.touched.cin_llpin_reg_no && Boolean(formik.errors.cin_llpin_reg_no)}
            helperText={formik.touched.cin_llpin_reg_no && formik.errors.cin_llpin_reg_no}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="dob_doi"
            name="dob_doi"
            label="Date of Incorporation"
            type="date"
            value={formik.values.dob_doi}
            onChange={formik.handleChange}
            error={formik.touched.dob_doi && Boolean(formik.errors.dob_doi)}
            helperText={formik.touched.dob_doi && formik.errors.dob_doi}
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

        <Grid item xs={12} sm={6} md={4}>
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

        <Grid item xs={12} sm={6} md={4}>
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
            id="address_line_1"
            name="address_line_1"
            label="Address Line 1"
            value={formik.values.address_line_1}
            onChange={formik.handleChange}
            error={formik.touched.address_line_1 && Boolean(formik.errors.address_line_1)}
            helperText={formik.touched.address_line_1 && formik.errors.address_line_1}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            id="address_line_2"
            name="address_line_2"
            label="Address Line 2"
            value={formik.values.address_line_2}
            onChange={formik.handleChange}
            error={formik.touched.address_line_2 && Boolean(formik.errors.address_line_2)}
            helperText={formik.touched.address_line_2 && formik.errors.address_line_2}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            id="city"
            name="city"
            label="City"
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" error={formik.touched.state && Boolean(formik.errors.state)}>
            <InputLabel>State</InputLabel>
            <Select id="state" name="state" value={formik.values.state} label="State" onChange={formik.handleChange}>
              {__IndianStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.state && formik.errors.state && <FormHelperText>{formik.errors.state}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            id="pin_code"
            name="pin_code"
            label="PIN Code"
            value={formik.values.pin_code}
            onChange={formik.handleChange}
            error={formik.touched.pin_code && Boolean(formik.errors.pin_code)}
            helperText={formik.touched.pin_code && formik.errors.pin_code}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth size="small" id="country" name="country" label="Country" value={formik.values.country} disabled />
        </Grid>

        {/* MSME Section */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={formik.values.is_msme}
                onChange={(e) => formik.setFieldValue('is_msme', e.target.checked)}
                name="is_msme"
              />
            }
            label="Is your business MSME Registered?"
          />
        </Grid>

        {formik.values.is_msme && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" error={formik.touched.msme_type && Boolean(formik.errors.msme_type)}>
                <InputLabel>MSME/Udyam Registration Type</InputLabel>
                <Select
                  id="msme_type"
                  name="msme_type"
                  value={formik.values.msme_type}
                  label="MSME/Udyam Registration Type"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="micro">Micro</MenuItem>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                </Select>
                {formik.touched.msme_type && formik.errors.msme_type && <FormHelperText>{formik.errors.msme_type}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                id="msme_number"
                name="msme_number"
                label="MSME/Udyam Registration Number"
                value={formik.values.msme_number}
                onChange={formik.handleChange}
                error={formik.touched.msme_number && Boolean(formik.errors.msme_number)}
                helperText={formik.touched.msme_number && formik.errors.msme_number}
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
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" size="small">
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessProfile;
