import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Delete } from '@mui/icons-material';
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
  CircularProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  Pagination,
  Stack
} from '@mui/material';

import { industries } from 'utils/industries';
import { entity_choices } from 'utils/Entity-types';
import { __IndianStates } from 'utils/indianStates';
import Factory from 'utils/Factory';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import AddBranchDialog from './AddBranchDialog';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';

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
    name: 'logo',
    label: 'Logo',
    type: 'file'
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
const BusinessProfile = ({ tabChange, tabval }) => {
  const user = useSelector((state) => state.accountReducer.user);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [logoFile, setLogoFile] = useState(null);
  const [logoposttype, setLogoposttype] = useState('post');
  const [logoUrlDetails, setLogoUrlDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [isMultipleBranches, setIsMultipleBranches] = useState('no');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
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
      case 'file':
        return (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-upload"
              type="file"
              onChange={handleLogoChange}
              ref={fileInputRef}
            />

            <Box display="flex" alignItems="center" gap={10}>
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

              <label htmlFor="profile-image-upload">
                <Button variant="contained" size="small" component="span" sx={{ whiteSpace: 'nowrap' }}>
                  Upload / Change Logo
                </Button>
              </label>
            </Box>
          </Grid2>
        );

      default:
        return null;
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
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid2 container spacing={2}>
        {/* Business Name Header */}
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h4" color="text.primary" gutterBottom>
            Business Profile
          </Typography>
        </Grid2>
        {/* <Grid2 size={{ xs: 12, md: 6 }} sx={{ mt: 2, mb: 2 }}>
        
        </Grid2> */}
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
          <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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

        <Grid2 size={{ xs: 10 }}>
          {isMultipleBranches === 'yes' && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" color="text.primary" gutterBottom sx={{ mb: 2 }}></Typography>
                <Button variant="outlined" color="primary" onClick={handleAddBranch} startIcon={<AddIcon />} size="small">
                  Add Branch
                </Button>
              </Stack>
              <Card
                elevation={2}
                component="div"
                sx={{
                  mb: 2,

                  '& .MuiTableContainer-root': {
                    borderRadius: 0
                  },
                  '& .MuiTableCell-root': {
                    color: 'text.primary'
                  },
                  '& .MuiTableHead-root .MuiTableCell-root': {
                    py: 1,
                    backgroundColor: 'primary.main',
                    color: '#fff'
                  }
                }}
              >
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Branch Name</TableCell>
                        <TableCell>Branch Code</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((branch, index) => (
                        <TableRow key={index}>
                          <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                          <TableCell>{branch.branch_name}</TableCell>
                          <TableCell>{branch.branch_code}</TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                              <IconButton color="primary" size="small" onClick={() => handleEdit(branch)}>
                                <Edit />
                              </IconButton>
                              <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                                <IconButton color="error" size="small" onClick={() => handleRemoveBranch(index)}>
                                  <Delete />
                                </IconButton>
                              </Box>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {branches.length > 0 && (
                <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
                  <Pagination count={Math.ceil(branches.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
                </Stack>
              )}
            </>
          )}
        </Grid2>
        <AddBranchDialog
          open={open}
          handleClose={handleClose}
          branches={branches}
          setBranches={setBranches}
          user={user}
          selectedBranch={selectedBranch}
        />
      </Grid2>
    </Box>
  );
};

export default BusinessProfile;
