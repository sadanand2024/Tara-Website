import React, { useEffect } from 'react';
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
  Grid,
  IconButton,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
  Card
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Factory from 'utils/Factory';
import InfoIcon from '@mui/icons-material/Info';

const validationSchema = Yup.object({
  first_name: Yup.string().when('userType', {
    is: 'new',
    then: () => Yup.string().required('First Name is required')
  }),
  last_name: Yup.string().when('userType', {
    is: 'new',
    then: () => Yup.string().required('Last Name is required')
  }),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobile_number: Yup.string().when('userType', {
    is: 'new',
    then: () =>
      Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required')
  }),
  role: Yup.object().required('Role is required'),
  userType: Yup.string().required('Please select user type')
});

const AddUser = ({ open, onClose, user }) => {
  const [userType, setUserType] = React.useState('new');
  const [searchResult, setSearchResult] = React.useState(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [roles, setRoles] = React.useState([]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await Factory('get', `/user_management/context-roles/list?context_id=${user.active_context.id}`, {}, {});
        if (response.res.status_cd === 0) {
          setRoles(response.res.data.context.roles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      }
    };

    getRoles();
  }, [user.active_context.id]);

  const formik = useFormik({
    initialValues: {
      userType: 'new',
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      role: null
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('Form values:', values);
      resetForm();
      onClose();
    }
  });

  const handleUserTypeChange = (event, newType) => {
    if (newType !== null) {
      setUserType(newType);
      formik.setFieldValue('userType', newType);
      formik.setFieldValue('email', '');
      setSearchResult(null);
    }
  };

  const handleEmailSearch = async () => {
    if (!formik.values.email || formik.errors.email) {
      return;
    }
    setHasSearched(true);
    const response = await Factory('get', `/user_management/user/search?email=${formik.values.email}`, {}, {});
    if (response.res.status_cd === 0) {
      setSearchResult({ ...response.res.data.data });
      formik.setValues({ ...response.res.data.data, userType: 'existing' });
    } else {
      setSearchResult(null);
    }
  };

  const handleClose = () => {
    formik.resetForm();
    setUserType('new');
    setSearchResult(null);
    setHasSearched(false);
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
      <DialogTitle sx={{ m: 0, px: 3, py: 1, fontSize: '1.25rem' }}>
        Add User
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
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              size="small"
              fullWidth
              sx={{
                bgcolor: (theme) => theme.palette.primary.lighter,
                '& .MuiToggleButton-root': {
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    '&:hover': {
                      bgcolor: 'primary.light'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="new" aria-label="new user">
                <PersonAddIcon sx={{ mr: 1 }} />
                New User
              </ToggleButton>
              <ToggleButton value="existing" aria-label="existing user">
                <PersonSearchIcon sx={{ mr: 1 }} />
                Existing User
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={3}>
            {userType === 'existing' ? (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    id="email"
                    name="email"
                    label="Search by Email"
                    value={formik.values.email}
                    onChange={(e) => {
                      formik.handleChange(e);
                      // Reset search results when email changes
                      if (hasSearched) {
                        setHasSearched(false);
                        setSearchResult(null);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <Button
                    variant="contained"
                    onClick={handleEmailSearch}
                    size="small"
                    sx={{ minWidth: '100px' }}
                    disabled={!formik.values.email || Boolean(formik.errors.email)}
                  >
                    Search
                  </Button>
                </Box>
                {hasSearched && (
                  <Card
                    sx={{
                      mt: 1,
                      borderRadius: 1,
                      borderTop: 3,
                      borderColor: searchResult ? 'success.main' : 'error.main',
                      bgcolor: searchResult ? 'success.lighter' : 'error.lighter',
                      boxShadow: 1,
                      p: 2
                    }}
                  >
                    {searchResult ? (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {searchResult.first_name} {searchResult.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Phone: {searchResult.mobile_number || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Email: {searchResult.email}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            borderLeft: 1,
                            borderColor: 'divider',
                            pl: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="info.dark"
                            sx={{
                              fontStyle: 'italic',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 0.5
                            }}
                          >
                            <InfoIcon sx={{ fontSize: '1rem', mt: '1px' }} />
                            By clicking "Add Existing User" you are sending an invitation to this user with automatically generated
                            credentials and an activation link to this email!
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="subtitle2" color="error.darker">
                        No user found with this email address
                      </Typography>
                    )}
                  </Card>
                )}
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                    helperText={formik.touched.first_name && formik.errors.first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="last_name"
                    name="last_name"
                    label="Last Name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                    helperText={formik.touched.last_name && formik.errors.last_name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    id="email"
                    name="email"
                    label="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="mobile_number"
                    name="mobile_number"
                    label="Phone Number"
                    value={formik.values.mobile_number}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
                    helperText={formik.touched.mobile_number && formik.errors.mobile_number}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={userType === 'new' ? 6 : 12}>
              <Autocomplete
                id="role"
                size="small"
                options={roles}
                getOptionLabel={(option) => option.name || ''}
                value={formik.values.role}
                onChange={(_, newValue) => {
                  formik.setFieldValue('role', newValue);
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} color="error" variant="outlined" size="small">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" size="small" disabled={formik.isSubmitting}>
            {userType === 'new' ? 'Add User' : 'Add Existing User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

AddUser.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddUser;
