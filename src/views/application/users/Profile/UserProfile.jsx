// material-ui
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// assets
import Avatar1 from 'assets/images/users/avatar-1.png';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';

// ==============================|| PROFILE 2 - USER PROFILE ||============================== //

const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export default function UserProfile({ onSubmit }) {
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
    icai_number: Yup.string()
      .required('ICAI Number is required')
      .matches(/^\d{6}$/, 'ICAI Number should be 6 digits'),
    address: Yup.object({
      address_line1: Yup.string().required('Address Line 1 is required').min(5, 'Address should be at least 5 characters'),
      address_line2: Yup.string(),
      pincode: Yup.number().required('PIN Code is required').min(100000, 'Invalid PIN Code').max(999999, 'Invalid PIN Code'),
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
      icai_number: '',
      address: {
        address_line1: '',
        address_line2: '',
        pincode: '',
        state: '',
        city: '',
        country: 'India'
      }
    },
    validationSchema,
    onSubmit: (values) => {
      const submissionData = {
        ...values,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        address: {
          ...values.address,
          pincode: values.address.pincode ? parseInt(values.address.pincode, 10) : ''
        }
      };
      onSubmit(submissionData);
    }
  });

  return (
    <form id="profile-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={gridSpacing}>
        {/* <Grid size={12}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid>
              <Avatar alt="User 1" src={Avatar1} sx={{ height: 80, width: 80 }} />
            </Grid>
            <Grid size={{ sm: 'grow' }}>
              <Grid container spacing={1}>
                <Grid size={12}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <input accept="image/*" style={{ display: 'none' }} id="contained-button-file" multiple type="file" />
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Typography variant="caption">
                    <ErrorTwoToneIcon sx={{ height: 16, width: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                    Image size Limit should be 125kb Max.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid> */}

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Full Name"
            size="small"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="PAN Number"
            size="small"
            name="pan_number"
            value={formik.values.pan_number}
            onChange={(e) => formik.setFieldValue('pan_number', e.target.value.toUpperCase())}
            onBlur={formik.handleBlur}
            error={formik.touched.pan_number && Boolean(formik.errors.pan_number)}
            helperText={formik.touched.pan_number && formik.errors.pan_number}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Aadhaar Number"
            size="small"
            name="aadhaar_number"
            value={formik.values.aadhaar_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.aadhaar_number && Boolean(formik.errors.aadhaar_number)}
            helperText={formik.touched.aadhaar_number && formik.errors.aadhaar_number}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={formik.values.date}
              onChange={(value) => formik.setFieldValue('date', value)}
              onBlur={() => formik.setFieldTouched('date', true)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  error: formik.touched.date && Boolean(formik.errors.date),
                  helperText: formik.touched.date && formik.errors.date,
                  sx: { '& .MuiInputBase-root': { height: '40px' } }
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="ICAI Number"
            size="small"
            name="icai_number"
            value={formik.values.icai_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.icai_number && Boolean(formik.errors.icai_number)}
            helperText={formik.touched.icai_number && formik.errors.icai_number}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address Line 1"
            size="small"
            name="address.address_line1"
            value={formik.values.address.address_line1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.address_line1 && Boolean(formik.errors.address?.address_line1)}
            helperText={formik.touched.address?.address_line1 && formik.errors.address?.address_line1}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address Line 2"
            size="small"
            name="address.address_line2"
            value={formik.values.address.address_line2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.address_line2 && Boolean(formik.errors.address?.address_line2)}
            helperText={formik.touched.address?.address_line2 && formik.errors.address?.address_line2}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="City"
            name="address.city"
            value={formik.values.address.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
            helperText={formik.touched.address?.city && formik.errors.address?.city}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            select
            label="State"
            name="address.state"
            value={formik.values.address.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
            helperText={formik.touched.address?.state && formik.errors.address?.state}
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Country" size="small" name="address.country" value={formik.values.address.country} disabled />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="PIN Code"
            size="small"
            name="address.pincode"
            type="number"
            value={formik.values.address.pincode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.pincode && Boolean(formik.errors.address?.pincode)}
            helperText={formik.touched.address?.pincode && formik.errors.address?.pincode}
          />
        </Grid>
      </Grid>
    </form>
  );
}
