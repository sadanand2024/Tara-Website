import { useEffect, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project imports
import { gridSpacing } from 'store/constant';
import Factory from 'utils/Factory';

// validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// ==============================|| PROFILE 2 - USER PROFILE ||============================== //

export default function UserProfile({ user, pageChange, value }) {
  const [type, setType] = useState('put');
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .required('First Name is required')
      .min(2, 'First Name should be at least 2 characters')
      .matches(/^[a-zA-Z\s]+$/, 'First Name should only contain letters'),
    last_name: Yup.string()
      .required('Last Name is required')
      .min(2, 'Last Name should be at least 2 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Last Name should only contain letters'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    mobile_number: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number should be 10 digits')
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      status: 'active'
    },
    validationSchema,
    onSubmit: async (values) => {
      const submissionData = {
        id: values.id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        mobile_number: values.mobile_number
      };

      const url = type === 'put' ? `/user_management/users/${values.id}/` : '/user_management/users/';

      const response = await Factory(type, url, submissionData, {}, true);

      if (response.res.status_cd === 0) {
        console.log(`Profile ${type === 'put' ? 'updated' : 'created'} successfully`);
        if (type === 'post') {
          setType('put');
        }
      } else {
        console.error(`Failed to ${type === 'put' ? 'update' : 'create'} profile:`, response.res.data);
      }
    }
  });

  const getUserData = async () => {
    try {
      const response = await Factory('get', `/user_management/users/${user.user.id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setType('put');
        formik.setValues({
          id: response.res.data.id || '',
          first_name: response.res.data.first_name || '',
          last_name: response.res.data.last_name || '',
          email: response.res.data.email || '',
          mobile_number: response.res.data.mobile_number || '',
          status: response.res.data.status || 'active'
        });
      } else if (response.res.data.detail === 'User details not found.') {
        setType('post');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return {
          bgcolor: 'success.lighter',
          color: 'success.dark',
          borderColor: 'success.main'
        };
      case 'inactive':
        return {
          bgcolor: 'error.lighter',
          color: 'error.dark',
          borderColor: 'error.main'
        };
      default:
        return {
          bgcolor: 'grey.100',
          color: 'grey.700',
          borderColor: 'grey.500'
        };
    }
  };

  return (
    <form id="profile-form" onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="text.primary">
          User Profile
        </Typography>
        <Chip
          label={formik.values.status === 'active' ? 'Active' : 'Inactive'}
          sx={{
            ...getStatusColor(formik.values.status),
            fontWeight: 600,
            border: '1px solid',
            '& .MuiChip-label': {
              px: 2
            }
          }}
        />
      </Box>

      <Grid container spacing={gridSpacing}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            disabled={true}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Mobile"
            name="mobile_number"
            value={formik.values.mobile_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
            helperText={formik.touched.mobile_number && formik.errors.mobile_number}
          />
        </Grid>
      </Grid>
      {console.log(value)}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            formik.handleSubmit();
            pageChange('', 1 + value);
          }}
        >
          Save & Continue
        </Button>
      </Box>
    </form>
  );
}
