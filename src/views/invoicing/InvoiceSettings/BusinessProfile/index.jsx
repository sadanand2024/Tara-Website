import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { FormControl, TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Grid2, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomInput from 'utils/CustomInput';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
// import { useSnackbar } from '@/components/CustomSnackbar';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { entity_choices } from 'utils/Entity-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export default function TabOne({ businessDetails = {}, postType }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [busineesprofileFields] = useState({
    basic_details: [
      { name: 'nameOfBusiness', label: 'Business Name' },
      { name: 'registrationNumber', label: 'Business Registration Number' },
      { name: 'gst_registered', label: 'GST Registered' },
      { name: 'gstin', label: 'GSTIN' },
      { name: 'pan', label: 'PAN' },
      { name: 'entityType', label: 'Business Type' },
      { name: 'address_line1', label: 'Address Line 1' },
      { name: 'address_line2', label: 'Address Line 2' },
      { name: 'country', label: 'Country' },
      { name: 'state', label: 'State' },
      { name: 'pinCode', label: 'Pincode' },
      { name: 'email', label: 'Email' },
      { name: 'mobile_number', label: 'Mobile' }
    ],
    bank_details: [
      { name: 'account_number', label: 'Bank A/C No' },
      { name: 'bank_name', label: 'Bank Name' },
      { name: 'ifsc_code', label: 'IFSC Code' },
      { name: 'swift_code', label: 'Swift Code' }
    ]
  });
  // const { showSnackbar } = useSnackbar();

  // Formik validation schema
  const validationSchema = Yup.object({
    nameOfBusiness: Yup.string().required('Business Name is required'),
    registrationNumber: Yup.string().required('Registration Number is required'),
    entityType: Yup.string().required('Business Type is required'),
    gst_registered: Yup.string().required('GST Registration status is required'),
    gstin: Yup.string().when('gst_registered', {
      is: 'Yes',
      then: () => Yup.string().required('GSTIN is required'),
      otherwise: () => Yup.string().oneOf(['NA'], 'GSTIN must be "NA" when GST Registered is "No"') // Ensure "NA" for "No"
    }),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    pinCode: Yup.number()
      .typeError('Pincode must be an integer')
      .required('Pincode is required')
      .integer('Pincode must be an integer')
      .min(100000, 'Pincode must be at least 6 digits')
      .max(999999, 'Pincode must be at most 6 digits'),
    mobile_number: Yup.number()
      .typeError('Mobile Number must be an integer')
      .required('Mobile Number is required')
      .integer('Mobile Number must be an integer')
      .min(1000000000, 'Mobile Number must be 10 digits')
      .max(9999999999, 'Mobile Number must be 10 digits'),
    address_line1: Yup.string().required('Address Line 1 is required'),
    pan: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN is required'),
    bank_name: Yup.string().required('Bank Name is required'),
    account_number: Yup.number()
      .typeError('Account Number must be a number')
      .required('Account Number is required')
      .test(
        'length',
        'Account Number must be between 9 and 18 digits',
        (value) => value && value.toString().length >= 9 && value.toString().length <= 18
      ),

    ifsc_code: Yup.string()
      .required('IFSC Code is required')
      .matches(/^[A-Za-z]{4}0\d{6}$/, 'IFSC Code must be 11 characters: first 4 letters, a 0, followed by 6 digits')
    // swift_code: Yup.string()
    //   .required('SWIFT Code is required')
    //   .matches(
    //     /^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/,
    //     'SWIFT Code must be 8 or 11 characters: 4 letters, 2 letters, 2 alphanumeric, and optionally 3 alphanumeric'
    //   )
  });

  const formik = useFormik({
    initialValues: {
      nameOfBusiness: '',
      registrationNumber: '',
      entityType: '',
      gst_registered: '',
      gstin: '',
      country: 'IN',
      state: '',
      email: '',
      pinCode: '',
      mobile_number: '',
      address_line1: '',
      address_line2: '',
      pan: '',
      bank_name: '',
      account_number: '',
      ifsc_code: '',
      swift_code: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const url =
        postType === 'put' ? `/invoicing/invoicing-profiles/${businessDetails.id}/update/` : '/invoicing/invoicing-profiles/create/';
      const formData = new FormData();

      // Append all form values to the FormData object
      Object.keys(values).forEach((key) => {
        if (Array.isArray(values[key])) {
          values[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, values[key]);
        }
      });
      if (postType === 'post') {
        postData.business = businessDetails.id;
      }

      const { res } = await Factory(postType, url, formData);
      if (res.status_cd === 1) {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data.data) || 'Something went wrong',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      } else {
        // handleNext();
        dispatch(
          openSnackbar({
            open: true,
            message: 'Data Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      }
    }
  });
  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue } = formik;
  useEffect(() => {
    if (businessDetails && businessDetails.id) {
      setValues((prev) => ({
        ...prev,
        nameOfBusiness: businessDetails.business.nameOfBusiness || '',
        registrationNumber: businessDetails.business.registrationNumber || '',
        entityType: businessDetails.business.entityType || '',
        // gst_registered: businessDetails?.gst_details?.length !== 0 ? 'Yes' : 'No',
        gst_registered: Array.isArray(businessDetails?.gst_details) && businessDetails.gst_details.length > 0 ? 'Yes' : 'No',

        gstin:
          businessDetails?.gst_details?.length !== 0 && businessDetails.gstin === 'NA'
            ? ''
            : businessDetails?.gst_details?.length === 0
              ? 'NA'
              : businessDetails.gstin,
        state: businessDetails.business?.headOffice?.state || businessDetails?.state || '',
        email: businessDetails.business.email || '',
        pinCode: businessDetails.business?.headOffice?.pinCode || businessDetails?.pinCode || '',
        mobile_number: businessDetails.business.mobile_number || '',
        address_line1: businessDetails.business?.headOffice?.address_line1 || businessDetails?.address_line1 || '',
        address_line2: businessDetails.business?.headOffice?.address_line2 || businessDetails?.address_line2 || '',
        pan: businessDetails?.business?.pan || '',
        bank_name: businessDetails?.bank_name || '',
        account_number: businessDetails.account_number || '',
        ifsc_code: businessDetails.ifsc_code || '',
        swift_code: businessDetails.swift_code || ''
      }));
    }
  }, [businessDetails]);
  if (!businessDetails || !businessDetails.business) return <Typography>Loading business details...</Typography>;

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Business Details
      </Typography>

      <Grid2 container spacing={2}>
        {busineesprofileFields.basic_details.map((item, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
            <FormControl fullWidth>
              {item.name === 'gst_registered' ? (
                <Stack spacing={1}>
                  <FormLabel sx={{ fontWeight: 500 }}>
                    GST Registered <span style={{ color: 'red' }}>*</span>
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gst_registered"
                    value={values.gst_registered}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue('gst_registered', value);

                      // Handle conditional logic for GSTIN field
                      if (value === 'No') {
                        setFieldValue('gstin', 'NA');
                        formik.setFieldTouched('gstin', false);
                        formik.setFieldError('gstin', '');
                      } else if (value === 'Yes') {
                        setFieldValue('gstin', '');
                      }
                    }}
                  >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                  {touched.gst_registered && errors.gst_registered && (
                    <Typography variant="caption" color="error">
                      {errors.gst_registered}
                    </Typography>
                  )}
                </Stack>
              ) : item.name === 'gstin' ? (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {item.label}
                    <span style={{ color: 'red' }}>*</span>
                  </Typography>

                  <Grid2 container spacing={1} alignItems="center">
                    <Grid2 size={{ xs: 8 }}>
                      <CustomAutocomplete
                        value={values[item.name] || ''}
                        onChange={(e, newValue) => setFieldValue(item.name, newValue)}
                        options={
                          Array.isArray(businessDetails.gst_details)
                            ? businessDetails.gst_details.map((gstItem) => gstItem.gstin) // Get gstin from gst_details
                            : [] // Return empty array if gst_details is not an array
                        }
                        error={touched[item.name] && Boolean(errors[item.name])}
                        helperText={touched[item.name] && errors[item.name]}
                        name={item.name}
                        disabled={values.gst_registered === 'No'} // Disable gstin field if gst_registered is 'No'
                      />
                    </Grid2>

                    <Grid2 size={{ xs: 4 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<IconPlus size={16} />}
                        onClick={() => {
                          let id =
                            userData.user_type === 'Business'
                              ? userData.business_affiliated[0].id
                              : userData.businesssDetails.business[0].id;
                          navigate(`/business-profile?BID=${id}`);
                        }}
                        sx={{ ml: 2 }}
                      >
                        Add GST
                      </Button>
                    </Grid2>
                  </Grid2>
                </>
              ) : item.name === 'state' || item.name === 'entityType' ? (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {item.label}
                    <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <CustomAutocomplete
                    value={values[item.name] || ''}
                    onChange={(e, newValue) => setFieldValue(item.name, newValue)}
                    options={
                      item.name === 'entityType'
                        ? entity_choices // Use entity choices if the field is entityType
                        : indian_States_And_UTs // Use indian_States_And_UTs for state field
                    }
                    error={touched[item.name] && Boolean(errors[item.name])}
                    helperText={touched[item.name] && errors[item.name]}
                    name={item.name}
                  />
                </>
              ) : (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {item.label} {item.name !== 'address_line2' && <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <CustomInput
                    name={item.name}
                    value={values[item.name]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (item.name === 'pan') {
                        const upperValue = value.toUpperCase();
                        // Check if the PAN length is greater than 10
                        if (upperValue.length <= 10) {
                          setFieldValue(item.name, upperValue);
                        } else {
                          // Optionally handle the error or set the value to an empty string
                          setFieldValue(item.name, upperValue.substring(0, 10)); // Limit to 10 characters
                        }
                      } else {
                        setFieldValue(item.name, value);
                      }
                    }}
                    onBlur={handleBlur}
                    error={touched[item.name] && Boolean(errors[item.name])}
                    helperText={touched[item.name] && errors[item.name]}
                    disabled={item.name === 'country'}
                  />
                </>
              )}
            </FormControl>
          </Grid2>
        ))}
      </Grid2>

      <Typography variant="h4" sx={{ fontWeight: 'bold', pt: 3, mb: 2 }}>
        Bank Details
      </Typography>

      <Grid2 container spacing={2}>
        {busineesprofileFields.bank_details.map((item) => (
          <Grid2 size={{ xs: 12, sm: 6 }} key={item.name}>
            <FormControl fullWidth>
              <Typography sx={{ mb: 1 }}>
                {item.label}
                {item.name !== 'swift_code' && <span style={{ color: 'red' }}>*</span>}
              </Typography>{' '}
              <TextField
                name={item.name}
                value={values[item.name]}
                onChange={(e) => {
                  if (item.name === 'pan' || item.name === 'ifsc_code' || item.name === 'bank_name') {
                    setFieldValue(item.name, e.target.value.toUpperCase());
                  } else {
                    setFieldValue(item.name, e.target.value);
                  }
                }}
                onBlur={handleBlur}
                error={touched[item.name] && Boolean(errors[item.name])}
                helperText={touched[item.name] && errors[item.name]}
                required
              />
            </FormControl>
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Save & Continue
          </Button>
        </Stack>
      </Box>
    </>
  );
}
