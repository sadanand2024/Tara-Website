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
  CircularProgress,
  Grid2,
  FormControl,
  FormLabel,
  Autocomplete
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
import { states } from 'utils/constants';
import Modal from 'ui-component/extended/Modal';

const Personal = ({ open, onClose, onSubmit, isSubmitting, cancel }) => {
  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true
    },
    {
      name: 'pan_number',
      label: 'PAN Number',
      type: 'text',
      required: true
    },
    {
      name: 'aadhaar_number',
      label: 'Aadhaar Number',
      type: 'text',
      required: true
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: true
    },
    {
      name: 'address_line1',
      label: 'Address Line 1',
      type: 'text',
      required: true
    },
    {
      name: 'address_line2',
      label: 'Address Line 2',
      type: 'text',
      required: false
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      required: true
    },
    {
      name: 'country',
      label: 'Country',
      type: 'text',
      required: true
    },
    {
      name: 'pinCode',
      label: 'Pin Code',
      type: 'text',
      required: true
    }
  ];

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name should be at least 3 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Name should only contain letters'),
    pan_number: Yup.string()
      .required('PAN Number is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number format (e.g., ABCDE1234F)')
      .transform((value) => (value ? value.toUpperCase() : value)),
    aadhaar_number: Yup.string()
      .required('Aadhaar Number is required')
      .matches(/^\d{12}$/, 'Aadhaar Number should be exactly 12 digits')
      .matches(/^[0-9]+$/, 'Aadhaar Number should only contain numbers'),
    dob: Yup.date()
      .nullable()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future')
      .test('age', 'Must be at least 18 years old', function (value) {
        if (!value) return true;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }),
    address_line1: Yup.string().required('Address Line 1 is required'),
    city: Yup.string()
      .required('City is required')
      .matches(/^[a-zA-Z\s]+$/, 'City should only contain letters'),
    state: Yup.string().required('State is required'),
    country: Yup.string()
      .required('Country is required')
      .matches(/^[a-zA-Z\s]+$/, 'Country should only contain letters'),
    pinCode: Yup.string()
      .required('Pin Code is required')
      .matches(/^\d{6}$/, 'Pin Code should be exactly 6 digits')
      .matches(/^[0-9]+$/, 'Pin Code should only contain numbers')
  });
  const renderFields = (fields) => {
    return fields.map((field) =>
      field.name === 'state' ? (
        <Grid2 size={{ xs: 12, sm: 6 }} key={field.name}>
          <FormControl fullWidth error={touched[field.name] && Boolean(errors[field.name])}>
            <FormLabel>{field.label}</FormLabel>
            <Autocomplete
              value={values[field.name]}
              onChange={(e, value) => setFieldValue(field.name, value)}
              onBlur={() => handleBlur({ target: { name: field.name } })}
              options={states}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  helperText={touched[field.name] && errors[field.name]}
                  size="small"
                />
              )}
            />
          </FormControl>
        </Grid2>
      ) : field.name === 'dob' ? (
        <Grid2 size={{ xs: 12, sm: 6 }} key={field.name}>
          <FormControl fullWidth error={touched[field.name] && Boolean(errors[field.name])}>
            <FormLabel>{field.label}</FormLabel>
            <TextField
              fullWidth
              type="date"
              name={field.name}
              size="small"
              value={values[field.name] || ''}
              onChange={(e) => setFieldValue(field.name, e.target.value)}
              onBlur={(e) => handleBlur({ target: { name: field.name } })}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
        </Grid2>
      ) : (
        <Grid2 size={{ xs: 12, sm: 6 }} key={field.name}>
          <FormControl fullWidth>
            <FormLabel>{field.label}</FormLabel>
            <TextField
              fullWidth
              name={field.name}
              value={values[field.name]}
              onChange={(e) => {
                let value = e.target.value;

                if (field.name === 'pan_number') {
                  // Only allow letters and numbers, max 10 characters
                  value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                  if (value.length > 10) {
                    return;
                  }
                } else if (field.name === 'aadhaar_number') {
                  // Only allow numbers, max 12 characters
                  value = value.replace(/[^0-9]/g, '');
                  if (value.length > 12) {
                    return;
                  }
                } else if (field.name === 'name' || field.name === 'city' || field.name === 'country') {
                  // Only allow letters and spaces
                  value = value.replace(/[^a-zA-Z\s]/g, '');
                }

                setFieldValue(field.name, value);
              }}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              size="small"
              disabled={field.name === 'country'}
            />
          </FormControl>
        </Grid2>
      )
    );
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      pan_number: '',
      aadhaar_number: '',
      dob: null,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: 'India',
      pinCode: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const submissionData = {
          ...values,
          address: {
            address_line1: values.address_line1,
            address_line2: values.address_line2,
            pinCode: values.pinCode,
            state: values.state,
            city: values.city,
            country: 'India'
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
  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue } = formik;
  return (
    <Modal
      open={open}
      maxWidth="sm"
      showClose={false}
      title="Add Personal Details"
      handleClose={onClose}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={() => {
              onClose();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
        <Grid2 container spacing={3}>
          {renderFields(fields)}
        </Grid2>
      </Box>
    </Modal>
  );
};

export default Personal;
