import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Delete } from '@mui/icons-material';
import CircularProgressComponent from 'utils/CircularProgressComponent';

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
  TextField,
  Typography,
  RadioGroup,
  Radio,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Pagination,
  Stack,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Fade,
  Zoom
} from '@mui/material';

import { industries } from 'utils/industries';
import { entity_choices } from 'utils/Entity-types';
import { __IndianStates } from 'utils/indianStates';
import Factory from 'utils/Factory';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import AddBranchDialog from './AddBranchDialog';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';

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
    type: 'text',
    required: true
  },
  {
    name: 'business_nature',
    label: 'Business Nature',
    type: 'text',
    required: true
  },
  {
    name: 'pan',
    label: 'PAN',
    type: 'text',
    required: true
  },
  {
    name: 'registrationNumber',
    label: 'Registration Number',
    type: 'text',
    required: true
  },
  {
    name: 'entityType',
    label: 'Entity Type',
    type: 'autocomplete',
    options: Object.values(entityTypeMapping),
    required: true
  },
  {
    name: 'dob_or_incorp_date',
    label: 'Date of Incorporation',
    type: 'date',
    required: true
  }
];

const primaryContactFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: true
  },
  {
    name: 'mobile_number',
    label: 'Mobile Number',
    type: 'text',
    required: true
  },
  {
    name: 'headOffice.address_line1',
    label: 'Address Line 1',
    type: 'text',
    required: true
  },
  {
    name: 'headOffice.address_line2',
    label: 'Address Line 2',
    type: 'text',
    required: false
  },
  {
    name: 'headOffice.city',
    label: 'City',
    type: 'text',
    required: true
  },
  {
    name: 'headOffice.state',
    label: 'State',
    type: 'text',
    required: true
  },
  {
    name: 'headOffice.pincode',
    label: 'Pincode',
    type: 'text',
    required: true
  }
];

const BusinessProfile = ({ tabChange, tabval }) => {
  const user = useSelector((state) => state.accountReducer.user);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [logoFile, setLogoFile] = useState(null);
  const [logoposttype, setLogoposttype] = useState('post');
  const [logoUrlDetails, setLogoUrlDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [isMultipleBranches, setIsMultipleBranches] = useState('no');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddBranch = () => {
    setOpen(true);
  };

  const handleEdit = (branch) => {
    setOpen(true);
    setSelectedBranch(branch);
  };

  const handleRemoveBranch = async (index) => {
    if (!branches[index].id) {
      const newBranches = [...branches];
      newBranches.splice(index, 1);
      setBranches(newBranches);
      return;
    }

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

  const paginatedData = branches.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to load data',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
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
          dispatch(
            openSnackbar({
              open: true,
              message: response.res.message || 'Failed to update business profile',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
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
      let url = logoposttype === 'put' ? `/user_management/business-logo/${logoUrlDetails.id}/` : '/user_management/business-logo/';
      let formData = new FormData();
      formData.append('logo', file);
      logoposttype === 'post' && formData.append('business', user.active_context.business_id);
      let { res, error } = await Factory(logoposttype, url, formData);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const event = { target: { files: [file] } };
        handleLogoChange(event);
      }
    }
  };

  const renderField = (field) => {
    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
    };

    const commonTextFieldProps = {
      fullWidth: true,
      size: 'small',
      variant: 'outlined',
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 2
          }
        },
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
          '&.Mui-focused': {
            color: 'primary.main'
          }
        }
      }
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
                {...commonTextFieldProps}
                name={field.name}
                label={field.label}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name] ? errors[field.name] : ''}
              />
            )}
          />
        );
      case 'text':
        return (
          <TextField
            {...commonTextFieldProps}
            name={field.name}
            label={field.label}
            value={getNestedValue(values, field.name)}
            onChange={(e) => {
              if (field.name === 'pan') {
                let value = e.target.value;
                if (value.length <= 10) {
                  setFieldValue(field.name, value.toUpperCase());
                }
              } else {
                setFieldValue(field.name, e.target.value);
              }
            }}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name] ? errors[field.name] : ''}
            onBlur={handleBlur}
          />
        );
      case 'date':
        return (
          <TextField
            {...commonTextFieldProps}
            type="date"
            name={field.name}
            label={field.label}
            value={getNestedValue(values, field.name)}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name] ? errors[field.name] : ''}
            InputLabelProps={{
              shrink: true
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderLogoUpload = () => (
    <Card
      elevation={0}
      sx={{
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'grey.300',
        backgroundColor: isDragging ? 'primary.50' : 'background.paper',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'primary.50'
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-image-upload"
          type="file"
          onChange={handleLogoChange}
          ref={fileInputRef}
        />

        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Avatar
            alt="Business Logo"
            src={logoUrlDetails?.logo || (logoFile ? URL.createObjectURL(logoFile) : '')}
            sx={{
              width: 120,
              height: 120,
              border: '3px solid',
              borderColor: 'primary.main',
              backgroundColor: 'background.paper',
              boxShadow: 3
            }}
            imgProps={{
              style: {
                objectFit: 'contain',
                padding: 8
              }
            }}
          >
            {!logoUrlDetails?.logo && !logoFile && <BusinessIcon sx={{ fontSize: 60, color: 'grey.400' }} />}
          </Avatar>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: 2
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: 18, color: 'white' }} />
          </Box>
        </Box>

        <Typography variant="h6" color="text.primary" gutterBottom>
          Business Logo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {logoUrlDetails?.logo || logoFile ? 'Click to change logo' : 'Drag & drop or click to upload'}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center">
          <Chip icon={<CloudUploadIcon />} label="Upload Logo" variant="outlined" color="primary" size="small" />
          {logoUrlDetails?.logo && <Chip icon={<VerifiedIcon />} label="Uploaded" color="success" size="small" />}
        </Stack>
      </CardContent>
    </Card>
  );

if(isLoading) {
  return <CircularProgressComponent isLoading = {isLoading} displayContent= {"Loading Business Profile Data"}/>
}
  const { values, handleChange, errors, touched, handleSubmit, handleBlur, setFieldValue } = formik;

  return (
    <MainCard title="Business Profile" subtitle="Manage your business profile for invoice generation and business operations">
      <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}>
        <Grid2 container spacing={3}>
          {/* Business Information Section */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                      Business Information
                    </Typography>
                  </Box>
                }
                sx={{
                  backgroundColor: 'primary.50',
                  borderBottom: '1px solid',
                  borderColor: 'grey.200',
                  padding: 2
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Grid2 container spacing={3}>
                  {businessProfileFields.map((field) => (
                    <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
                      {renderField(field)}
                    </Grid2>
                  ))}
                </Grid2>
              </CardContent>
            </Card>
          </Grid2>
          {/* Logo Upload Section */}
          <Grid2 size={{ xs: 12, md: 4 }}>{renderLogoUpload()}</Grid2>
          {/* Primary Contact Section */}
          <Grid2 size={{ xs: 12 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContactMailIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                      Primary Contact Information
                    </Typography>
                  </Box>
                }
                sx={{
                  backgroundColor: 'primary.50',
                  borderBottom: '1px solid',
                  borderColor: 'grey.200',
                  padding: 2
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Grid2 container spacing={3}>
                  {primaryContactFields.map((field) => (
                    <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                      {renderField(field)}
                    </Grid2>
                  ))}
                </Grid2>
              </CardContent>
            </Card>
          </Grid2>

          {/* MSME Registration Section */}
          <Grid2 size={{ xs: 12 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                      MSME Registration
                    </Typography>
                  </Box>
                }
                sx={{
                  backgroundColor: 'primary.50',
                  borderBottom: '1px solid',
                  borderColor: 'grey.400',
                  padding: 2
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="text.primary" fontWeight={500} gutterBottom>
                    Is your business MSME Registered?
                  </Typography>
                  <RadioGroup row name="is_msme_registered" value={values.is_msme_registered} onChange={handleChange} sx={{ mt: 1 }}>
                    <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" sx={{ mr: 4 }} />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Box>

                <Fade in={values.is_msme_registered === 'yes'}>
                  <Box>
                    <Grid2 container spacing={3}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Autocomplete
                          fullWidth
                          value={values.msme_registration_type}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                          options={['Micro', 'Small', 'Medium']}
                          onChange={(e, value) => setFieldValue('msme_registration_type', value)}
                          onBlur={handleBlur}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="MSME/Udyam Registration Type"
                              size="small"
                              error={touched.msme_registration_type && Boolean(errors.msme_registration_type)}
                              helperText={
                                touched.msme_registration_type && errors.msme_registration_type ? errors.msme_registration_type : ''
                              }
                            />
                          )}
                        />
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
                          helperText={
                            touched.msme_registration_number && errors.msme_registration_number ? errors.msme_registration_number : ''
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid2>
                    </Grid2>
                  </Box>
                </Fade>

                <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> For MSME registered businesses, please include your MSME registration number in the address.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid2>

          {/* Submit Button */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={isSubmitting}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Saving...
                  </Box>
                ) : (
                  'Save & Continue'
                )}
              </Button>
            </Box>
          </Grid2>
        </Grid2>
        {/* Branch Management Section */}
        <Grid2 size={{ xs: 12 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 3 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountTreeIcon color="primary" />
                  <Typography variant="h5" fontWeight={600}>
                    Branch Management
                  </Typography>
                </Box>
              }
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Do you have multiple branches?
                  </Typography>
                  <RadioGroup
                    row
                    name="is_multiple_branches"
                    value={isMultipleBranches}
                    onChange={(e) => setIsMultipleBranches(e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Box>
              }
              sx={{
                backgroundColor: 'primary.50',
                borderBottom: '1px solid',
                borderColor: 'grey.400',
                padding: 2
              }}
            />

            {isMultipleBranches === 'yes' && (
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" color="text.primary" fontWeight={500}>
                    Branch Locations
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddBranch}
                    startIcon={<AddIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    Add Branch
                  </Button>
                </Box>

                {branches.length > 0 ? (
                  <>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 2 }}>
                      <TableContainer>
                        <Table size="small">
                          <TableHead
                            sx={{
                              backgroundColor: 'primary.main',
                              '& .MuiTableCell-root': {
                                color: '#ffffff !important'
                              }
                            }}
                          >
                            <TableRow>
                              <TableCell>S.No</TableCell>
                              <TableCell>Branch Name</TableCell>
                              <TableCell>Branch Code</TableCell>
                              <TableCell align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paginatedData.map((branch, index) => (
                              <TableRow key={index} hover>
                                <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={500}>
                                    {branch.branch_name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip label={branch.branch_code} size="small" color="primary" variant="outlined" />
                                </TableCell>
                                <TableCell align="center">
                                  <Stack direction="row" spacing={1} justifyContent="center">
                                    <Tooltip title="Edit Branch">
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEdit(branch)}
                                        sx={{
                                          backgroundColor: 'primary.50',
                                          '&:hover': { backgroundColor: 'primary.100' }
                                        }}
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Branch">
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemoveBranch(index)}
                                        sx={{
                                          backgroundColor: 'error.50',
                                          '&:hover': { backgroundColor: 'error.100' }
                                        }}
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination
                        count={Math.ceil(branches.length / rowsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      backgroundColor: 'grey.50'
                    }}
                  >
                    <AccountTreeIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Branches Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first branch location
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleAddBranch}
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Add First Branch
                    </Button>
                  </Box>
                )}
              </CardContent>
            )}
          </Card>
        </Grid2>

        <AddBranchDialog
          open={open}
          handleClose={handleClose}
          branches={branches}
          setBranches={setBranches}
          user={user}
          selectedBranch={selectedBranch}
        />
      </Box>
    </MainCard>
  );
};

export default BusinessProfile;
