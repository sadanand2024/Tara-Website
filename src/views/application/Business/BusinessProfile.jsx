import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete } from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  CircularProgress,
  Avatar
} from '@mui/material';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { industries } from 'utils/industries';
import { entity_choices } from 'utils/Entity-types';
import { __IndianStates } from 'utils/indianStates';
import Factory from 'utils/Factory';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

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
  }),
  // is_multiple_branches: Yup.string().oneOf(['yes', 'no']).required(),
  branches: Yup.array().when('is_multiple_branches', {
    is: 'yes',
    then: () =>
      Yup.array().of(
        Yup.object({
          branch_name: Yup.string().required('Branch name is required'),
          branch_code: Yup.string().required('Branch code is required')
        })
      ),
    otherwise: () => Yup.array().nullable()
  })
});
const businessProfileFields = [
  {
    name: 'nameOfBusiness',
    label: 'Business Name',
    type: 'text'
  },
  {
    name: 'business_nature',
    label: 'Business Nature',
    type: 'text'
  },
  {
    name: 'pan',
    label: 'PAN',
    type: 'text'
  },
  {
    name: 'registrationNumber',
    label: 'Registration Number',
    type: 'text'
  },
  {
    name: 'entityType',
    label: 'Entity Type',
    type: 'autocomplete',
    options: Object.values(entityTypeMapping)
  },
  {
    name: 'dob_or_incorp_date',
    label: 'Date of Incorporation',
    type: 'date'
  }
];
let primaryContactFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'text'
  },
  {
    name: 'mobile_number',
    label: 'Mobile Number',
    type: 'text'
  },
  {
    name: 'headOffice.address_line1',
    label: 'Address Line 1',
    type: 'text'
  },
  {
    name: 'headOffice.address_line2',
    label: 'Address Line 2',
    type: 'text'
  },
  {
    name: 'headOffice.city',
    label: 'City',
    type: 'text'
  },
  {
    name: 'headOffice.state',
    label: 'State',
    type: 'text'
  },
  {
    name: 'headOffice.pincode',
    label: 'Pincode',
    type: 'text'
  }
];
const BusinessProfile = ({ user, tabChange, tabval }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [logoFile, setLogoFile] = useState(null);
  const [logoposttype, setLogoposttype] = useState('post');
  const [logoUrlDetails, setLogoUrlDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [isMultipleBranches, setIsMultipleBranches] = useState('no');
  const [initialValues, setInitialValues] = useState({
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
  });

  // Fetch initial data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // Fetch business profile
        const profileResponse = await Factory('get', `/user_management/businesses/${user.active_context.business_id}/`, {}, {});
        if (profileResponse.res.status_cd === 0) {
          const profileData = profileResponse.res.data;
          setInitialValues({
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

        // Fetch branches
        const branchesResponse = await Factory('get', `/user_management/branches/${user.active_context.business_id}/`, {}, {});
        if (branchesResponse.res.status_cd === 0) {
          if (branchesResponse.res.data.length > 0) {
            setIsMultipleBranches('yes');
            setBranches(branchesResponse.res.data);
          } else {
            setIsMultipleBranches('no');
            setBranches([]);
          }
        }
        // Fetch logo
        const logoResponse = await Factory('get', `/user_management/business-logo/${user.active_context.business_id}/`, {}, {});
        if (logoResponse.res.status_cd === 0) {
          setLogoUrlDetails(logoResponse.res.data);
          setLogoposttype('put');
        } else {
          setLogoUrlDetails(null);
          setLogoposttype('post');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Failed to load data', {
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

    fetchAllData();
  }, [user.active_context.business_id]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await Factory('put', `/user_management/businesses/${user.active_context.business_id}/`, values, {});

        if (response.res.status_cd === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Business profile updated successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
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
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(error),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const fileInputRef = useRef(null);

  const handleLogoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);

      console.log(logoposttype);
      let url = logoposttype === 'put' ? `/user_management/business-logo/${logoUrlDetails.id}/` : '/user_management/business-logo/';
      let formData = new FormData();
      formData.append('logo', file);
      logoposttype === 'post' && formData.append('business', user.active_context.business_id);
      let { res, error } = await Factory(logoposttype, url, formData);
      console.log(res);
      if (res.status_cd === 0) {
        setLogoUrlDetails(res.data);
        setLogoposttype('put');
        dispatch(
          openSnackbar({
            open: true,
            message: 'Logo updated successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(error),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  };

  const handleAddBranch = () => {
    const newBranches = [...branches, { branch_name: '', branch_code: '' }];
    setBranches(newBranches);
  };

  const handleRemoveBranch = async (index) => {
    // If the branch doesn't have an ID, it means it hasn't been saved yet
    if (!branches[index].id) {
      const newBranches = [...branches];
      newBranches.splice(index, 1);
      setBranches(newBranches);
      return;
    }

    // If the branch has an ID, proceed with API deletion
    let url = `/user_management/branches/${branches[index].id}/`;
    let response = await Factory('delete', url, {});
    if (response.res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Branch deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      const branchesResponse = await Factory('get', `/user_management/branches/${user.active_context.business_id}/`, {}, {});
      if (branchesResponse.res.status_cd === 0) {
        if (branchesResponse.res.data.length > 0) {
          setIsMultipleBranches('yes');
          setBranches(branchesResponse.res.data);
        } else {
          setIsMultipleBranches('no');
          setBranches([]);
        }
      }
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete branch',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const handleBranchChange = (index, field, value) => {
    const newBranches = [...branches];
    newBranches[index] = { ...newBranches[index], [field]: value };
    setBranches(newBranches);
  };
  const renderField = (field) => {
    // Helper function to get nested value
    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
    };

    switch (field.type) {
      case 'autocomplete':
        return (
          <Autocomplete
            fullWidth
            size="small"
            options={field.options}
            value={getNestedValue(values, field.name)}
            onChange={(e, value) => setFieldValue(field.name, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                name={field.name}
                onChange={(e, value) => setFieldValue(field.name, value)}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
              />
            )}
          />
        );
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            name={field.name}
            value={getNestedValue(values, field.name)}
            onChange={(e) => {
              if (field.name === 'pan') {
                let value = e.target.value;
                if (value.length === 10) {
                  setFieldValue(field.name, value.toUpperCase());
                } else {
                  return;
                }
              } else {
                setFieldValue(field.name, e.target.value);
              }
            }}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            onBlur={handleBlur}
          />
        );
      case 'date':
        return (
          <TextField
            fullWidth
            size="small"
            type="date"
            name={field.name}
            value={getNestedValue(values, field.name)}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          />
        );

      default:
        return null;
    }
  };

  const handleSaveBranch = async (index) => {
    let branchesdata = branches[index];
    let data = {
      branch_name: branchesdata.branch_name,
      branch_code: branchesdata.branch_code,
      business: user.active_context.business_id
    };

    try {
      let response;
      if (branchesdata.id) {
        // If branch has an ID, use PUT to update existing branch
        response = await Factory('put', `/user_management/branches/${branchesdata.id}/`, data);
      } else {
        // If no ID, use POST to create new branch
        response = await Factory('post', '/user_management/branches/', data);
      }

      if (response.res.status_cd === 0) {
        enqueueSnackbar('Branch saved successfully', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        // Refresh branches after saving
        const branchesResponse = await Factory('get', `/user_management/branches/${user.active_context.business_id}/`, {}, {});
        if (branchesResponse.res.status_cd === 0) {
          setBranches(branchesResponse.res.data || []);
        }
      }
    } catch (error) {
      console.error('Error saving branch:', error);
      enqueueSnackbar('Failed to save branch', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  const { values, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  console.log(errors);
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid2 container spacing={2}>
        {/* Business Name Header */}
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h4" color="text.primary" gutterBottom>
            Business Profile
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }} sx={{ mt: 2, mb: 2 }}>
          <Grid2 container spacing={2} direction="column" alignItems="center">
            <Grid2>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image-upload"
                type="file"
                onChange={handleLogoChange}
                ref={fileInputRef}
              />
              <Avatar
                alt="Profile"
                src={logoUrlDetails?.logo || (logoFile ? URL.createObjectURL(logoFile) : '')}
                sx={{
                  width: 100,
                  height: 100,
                  boxShadow: 3,
                  border: '2px solid #fff',
                  background: '#fff'
                }}
                imgProps={{
                  style: {
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%'
                  }
                }}
              />
            </Grid2>

            <Grid2>
              <label htmlFor="profile-image-upload">
                <Button variant="contained" size="small" component="span">
                  Upload / Change Logo
                </Button>
              </label>
            </Grid2>
          </Grid2>
        </Grid2>
        {businessProfileFields.map((field) => (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography color="text.secondary" fontWeight={500} mb={1}>
              {field.label}
            </Typography>
            {renderField(field)}
          </Grid2>
        ))}

        {/* Primary Contact */}
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h4" color="text.primary" gutterBottom sx={{ mt: 2 }}>
            Primary Contact
          </Typography>
        </Grid2>
        {primaryContactFields.map((field) => (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography color="text.secondary" fontWeight={500} mb={1}>
              {field.label}
            </Typography>
            {renderField(field)}
          </Grid2>
        ))}

        {/* MSME Section */}
        <Grid2 size={{ xs: 12 }}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1" gutterBottom>
              Is your business MSME Registered?
            </Typography>
            <RadioGroup row name="is_msme_registered" value={values.is_msme_registered} onChange={handleChange}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid2>

        {values.is_msme_registered === 'yes' && (
          <>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={touched.msme_registration_type && Boolean(errors.msme_registration_type)}>
                <InputLabel>MSME/Udyam Registration Type</InputLabel>
                <Select
                  id="msme_registration_type"
                  name="msme_registration_type"
                  value={values.msme_registration_type}
                  label="MSME/Udyam Registration Type"
                  onChange={handleChange}
                >
                  <MenuItem value="micro">Micro</MenuItem>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                </Select>
                {touched.msme_registration_type && errors.msme_registration_type && (
                  <FormHelperText>{errors.msme_registration_type}</FormHelperText>
                )}
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                id="msme_registration_number"
                name="msme_registration_number"
                label="MSME/Udyam Registration Number"
                value={values.msme_registration_number}
                onChange={handleChange}
                error={touched.msme_registration_number && Boolean(errors.msme_registration_number)}
                helperText={touched.msme_registration_number && errors.msme_registration_number}
              />
            </Grid2>
          </>
        )}

        <Grid2 size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            * For MSME registered businesses, please include your MSME registration number in the address.
          </Typography>
        </Grid2>
        {/* Submit Button */}
        <Grid2 size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" size="medium" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Grid2>
        {/* multiple branches */}
        <Grid2 size={{ xs: 12 }}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1" gutterBottom>
              Do you have multiple branches?
            </Typography>
            <RadioGroup row name="is_multiple_branches" value={isMultipleBranches} onChange={(e) => setIsMultipleBranches(e.target.value)}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          {isMultipleBranches === 'yes' && (
            <>
              {branches.map((branch, index) => (
                <Grid2 container spacing={2} key={index} sx={{ mt: 1, mb: 4 }}>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Branch Name"
                      value={branch.branch_name}
                      onChange={(e) => handleBranchChange(index, 'branch_name', e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Branch Code"
                      value={branch.branch_code}
                      onChange={(e) => handleBranchChange(index, 'branch_code', e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button type="button" variant="outlined" color="primary" onClick={() => handleSaveBranch(index)} size="small">
                      Save Branch
                    </Button>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button type="button" variant="outlined" color="error" onClick={() => handleRemoveBranch(index)} size="small">
                      Remove Branch
                    </Button>
                  </Grid2>
                </Grid2>
              ))}
              <Grid2 size={{ xs: 12, md: 12, sm: 12 }} sx={{ mt: 2 }}>
                <Button variant="outlined" color="primary" onClick={handleAddBranch} startIcon={<AddIcon />} size="small">
                  Add Branch
                </Button>
              </Grid2>
            </>
          )}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default BusinessProfile;
