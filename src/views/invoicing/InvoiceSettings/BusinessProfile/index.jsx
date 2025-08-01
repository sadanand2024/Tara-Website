import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {
  FormControl,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid2,
  Box,
  CircularProgress,
  Divider,
  Avatar
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomInput from 'utils/CustomInput';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { entity_choices } from 'utils/Entity-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { businessTypesArray } from 'utils/businessTypesArray';
import CustomUpload from 'utils/CustomUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'ui-component/cards/MainCard';

export default function BusinessProfileComponnet({ businessDetails = {}, postType, handleNext, setBusinessDetails, setTabValue }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoUrlDetails, setLogoUrlDetails] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoposttype, setLogoposttype] = useState('post');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileInputRef, setFileInputRef] = useState(null);
  const [busineesprofileFields] = useState({
    basic_details: [
      { name: 'nameOfBusiness', label: 'Business Name', required: true },
      { name: 'registrationNumber', label: 'Business Registration Number', required: false },
      { name: 'logo', label: 'Logo', required: true },
      { name: 'gst_registered', label: 'GST Registered ?', required: true },
      { name: 'gstin', label: 'GSTIN', required: true },
      { name: 'pan', label: 'PAN', required: true },
      { name: 'entityType', label: 'Business Type', required: true },
      { name: 'address_line1', label: 'Address Line 1', required: true },
      { name: 'address_line2', label: 'Address Line 2', required: false },
      { name: 'country', label: 'Country', required: true },
      { name: 'state', label: 'State/Union Territory', required: true },
      { name: 'pincode', label: 'Pincode', required: true },
      { name: 'email', label: 'Email', required: true },
      { name: 'mobile_number', label: 'Mobile', required: true }
    ],
    bank_details: [
      { name: 'account_number', label: 'Bank A/C No', required: true },
      { name: 'bank_name', label: 'Bank Name', required: true },
      { name: 'ifsc_code', label: 'IFSC Code', required: true },
      { name: 'swift_code', label: 'Swift Code' }
    ]
  });

  const validationSchema = Yup.object({
    nameOfBusiness: Yup.string().required('Business Name is required'),
    entityType: Yup.string().required('Business Type is required'),
    gst_registered: Yup.boolean().required('GST Registration status is required'),
    gstin: Yup.string().when('gst_registered', {
      is: true,
      then: () =>
        Yup.string()
          .required('GSTIN is required when GST Registered is Yes')
          .test('not-na', 'GSTIN cannot be "NA" when GST Registered is Yes', (value) => value !== 'NA'),
      otherwise: () => Yup.string().oneOf(['NA'], 'GSTIN must be "NA" when GST Registered is No')
    }),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits')
      .test('no-alphabets', 'Pincode cannot contain alphabets', (value) => {
        return value ? /^\d+$/.test(value) : true;
      }),
    mobile_number: Yup.string()
      .required('Mobile Number is required')
      .matches(/^\d{10}$/, 'Mobile Number must be exactly 10 digits')
      .test('no-alphabets', 'Mobile Number cannot contain alphabets', (value) => {
        return value ? /^\d+$/.test(value) : true;
      }),
    address_line1: Yup.string().required('Address Line 1 is required'),
    pan: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN is required'),
    bank_name: Yup.string()
      .required('Bank Name is required')
      .test('no-numbers', 'Bank Name cannot contain numbers', (value) => {
        return value ? /^[A-Za-z\s]+$/.test(value) : true;
      }),
    account_number: Yup.string()
      .required('Account Number is required')
      .matches(/^\d{9,18}$/, 'Account Number must be between 9 and 18 digits')
      .test('no-alphabets', 'Account Number cannot contain alphabets', (value) => {
        return value ? /^\d+$/.test(value) : true;
      }),
    ifsc_code: Yup.string()
      .required('IFSC Code is required')
      .matches(/^[A-Za-z]{4}0\d{6}$/, 'IFSC Code must be 11 characters: first 4 letters, a 0, followed by 6 digits')
    // swift_code: Yup.string()
    //   .required('SWIFT Code is required')
    //   .matches(
    //     /^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/,
    //     'SWIFT Code must be 8 or 11 characters: 4 letters, 2 letters, 2 alphanumeric, and optionally 3 alphanumeric'
    //   )
    // branch: Yup.string().required('Branch is required'),
    // branch_code: Yup.string().required('Branch Code is required')
  });

  const formik = useFormik({
    initialValues: {
      nameOfBusiness: '',
      registrationNumber: '',
      entityType: '',
      gst_registered: false,
      gstin: 'NA',
      country: 'IN',
      state: '',
      email: '',
      pincode: '',
      mobile_number: '',
      address_line1: '',
      address_line2: '',
      pan: '',
      bank_name: '',
      account_number: '',
      ifsc_code: '',
      swift_code: '',
      branch: '',
      branch_code: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const url =
        postType === 'put'
          ? `/invoicing/invoicing-profiles/${businessDetails.invoicing_profile_id}/update/`
          : '/invoicing/invoicing-profiles/create/';
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
        formData.append('business', businessDetails.id);
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
        dispatch(
          // setBusinessDetails(res.data.data),
          openSnackbar({
            open: true,
            message: postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        handleNext();
      }
    }
  });
  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue } = formik;
  useEffect(() => {
    if (businessDetails && businessDetails.id) {
      const isGstRegistered = businessDetails.gst_registered === true;
      setValues((prev) => ({
        ...prev,
        nameOfBusiness: businessDetails.nameOfBusiness || '',
        registrationNumber: businessDetails.registrationNumber || '',
        entityType: businessDetails.entityType || '',
        gst_registered: isGstRegistered,
        gstin: isGstRegistered ? businessDetails.gstin || '' : 'NA',
        state: businessDetails?.headOffice?.state || businessDetails?.state || '',
        email: businessDetails.email || '',
        pincode: businessDetails?.headOffice?.pincode || businessDetails?.pincode || '',
        mobile_number: businessDetails.mobile_number || '',
        address_line1: businessDetails?.headOffice?.address_line1 || businessDetails?.address_line1 || '',
        address_line2: businessDetails?.headOffice?.address_line2 || businessDetails?.address_line2 || '',
        pan: businessDetails.pan || '',
        bank_name: businessDetails?.bank_name || '',
        account_number: businessDetails?.account_number || '',
        ifsc_code: businessDetails?.ifsc_code || '',
        swift_code: businessDetails?.swift_code || ''
      }));
    }
  }, [businessDetails]);

  const getLogoDetails = async () => {
    const logoResponse = await Factory('get', `/user_management/business-logo/${businessDetails.id}/`, {}, {});
    if (logoResponse.res.status_cd === 0) {
      setLogoUrlDetails(logoResponse.res.data);
      setLogoposttype('put');
    } else {
      setLogoUrlDetails(null);
      setLogoposttype('post');
    }
  };

  useEffect(() => {
    if (businessDetails && businessDetails.id) {
      getLogoDetails();
    }
  }, [businessDetails]);

  if (!businessDetails || !businessDetails.id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }
  //   const getLabelWithAsterisk = (label, isRequired) => {
  //   return (
  //     <span>
  //       {label}
  //       {isRequired && <span style={{ color: 'red', fontSize: '1.3em' }}> *</span>}
  //     </span>
  //   );
  // };
  const getLabelWithAsterisk = (label, isRequired) => (
    <span style={{ fontSize: '1rem', fontWeight: 500 }}>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </span>
  );
  const handleLogoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);

      let url = logoposttype === 'put' ? `/user_management/business-logo/${logoUrlDetails.id}/` : '/user_management/business-logo/';
      let formData = new FormData();
      formData.append('logo', file);
      logoposttype === 'post' && formData.append('business', businessDetails.id);
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
  return (
    <MainCard>
      <Grid2 container spacing={2}>
        {busineesprofileFields.basic_details.map((item, index) =>
          item.name === 'logo' ? (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
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
                  <Button variant="contained" size="small" component="span">
                    Upload / Change Logo
                  </Button>
                </label>
              </Box>
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
              <FormControl fullWidth>
                {item.name === 'gst_registered' ? (
                  <Stack spacing={1}>
                    <FormLabel sx={{ variant: 'subtitle1' }}>{getLabelWithAsterisk('GST Registered ?', true)}</FormLabel>
                    <RadioGroup
                      row
                      name="gst_registered"
                      value={String(values.gst_registered)} // always pass string for HTML binding
                      onChange={(e) => {
                        const isRegistered = e.target.value === 'true'; // convert string to boolean
                        setFieldValue('gst_registered', isRegistered);

                        if (!isRegistered) {
                          setFieldValue('gstin', 'NA');
                          formik.setFieldTouched('gstin', false);
                          formik.setFieldError('gstin', '');
                        } else {
                          setFieldValue('gstin', '');
                          // Trigger validation for GSTIN when switching to Yes
                          formik.setFieldTouched('gstin', true);
                        }
                      }}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>

                    {touched.gst_registered && errors.gst_registered && (
                      <Typography variant="caption" color="error">
                        {errors.gst_registered}
                      </Typography>
                    )}
                  </Stack>
                ) : item.name === 'gstin' ? (
                  <>
                    <Typography sx={{ mb: 1 }}>{getLabelWithAsterisk(item.label, values.gst_registered === true)}</Typography>

                    <Grid2 container spacing={1} alignItems="center">
                      <Grid2 size={{ xs: 8 }}>
                        <CustomAutocomplete
                          value={values[item.name] || ''}
                          onChange={(e, newValue) => {
                            setFieldValue(item.name, newValue);
                            // Trigger immediate validation for GSTIN
                            formik.setFieldTouched(item.name, true);
                            // Clear error immediately if a value is selected
                            if (newValue && newValue.trim() !== '') {
                              formik.setFieldError(item.name, '');
                            }
                          }}
                          options={
                            Array.isArray(businessDetails.gst_details)
                              ? businessDetails.gst_details.map((gstItem) => gstItem.gstin) // Get gstin from gst_details
                              : [] // Return empty array if gst_details is not an array
                          }
                          error={touched[item.name] && Boolean(errors[item.name])}
                          helperText={touched[item.name] && errors[item.name]}
                          name={item.name}
                          disabled={values.gst_registered === false} // Disable gstin field if gst_registered is false
                          disableClearable
                          customTextField={(params) => (
                            <TextField
                              {...params}
                              // label="Select GSTIN"
                              error={touched[item.name] && Boolean(errors[item.name])}
                              helperText={touched[item.name] && errors[item.name]}
                              inputProps={{
                                ...params.inputProps,
                                readOnly: true, // 🔑 Prevents typing
                                style: { cursor: 'pointer' } // Optional: cursor looks clickable
                              }}
                              sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                  color: 'grey.600'
                                }
                              }}
                            />
                          )}
                        />
                      </Grid2>

                      {values.gst_registered === true && (
                        <Grid2 size={{ xs: 4 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<IconPlus size={16} />}
                            onClick={() => {
                              if (businessDetails.id) {
                                // navigate(`/apps/business-settings?BID=${businessDetails.id}&tabvalue=3`);
                                setTabValue(1);
                              }
                            }}
                            sx={{ ml: 2 }}
                          >
                            Add GST
                          </Button>
                        </Grid2>
                      )}
                    </Grid2>
                  </>
                ) : item.name === 'state' || item.name === 'entityType' ? (
                  <>
                    {/* <Typography sx={{ mb: 1 }}>{item.label}</Typography> */}
                    <Typography sx={{ mb: 1 }}>{getLabelWithAsterisk(item.label, item.required)}</Typography>
                    <CustomAutocomplete
                      value={values[item.name] || ''}
                      onChange={(e, newValue) => setFieldValue(item.name, newValue)}
                      options={
                        item.name === 'entityType'
                          ? values.pan && values.pan.length >= 4
                            ? businessTypesArray[values.pan[3]] || entity_choices
                            : entity_choices
                          : indian_States_And_UTs
                      }
                      error={touched[item.name] && Boolean(errors[item.name])}
                      helperText={touched[item.name] && errors[item.name]}
                      name={item.name}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          color: 'grey.600'
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Typography component="label" sx={{ mb: 1 }}>
                      {getLabelWithAsterisk(item.label, item.required)}
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
                            // If we have 4 characters, check the 4th letter to set business type
                            if (upperValue.length >= 4) {
                              const fourthLetter = upperValue[3];
                              const businessTypes = businessTypesArray[fourthLetter];
                              if (businessTypes && businessTypes.length > 0) {
                                setFieldValue('entityType', businessTypes[0]); // Set the first business type as default
                              }
                            }
                          } else {
                            // Optionally handle the error or set the value to an empty string
                            setFieldValue(item.name, upperValue.substring(0, 10)); // Limit to 10 characters
                          }
                        } else if (item.name === 'pincode') {
                          // Only allow digits for pincode
                          const numericValue = value.replace(/\D/g, '');
                          if (numericValue.length <= 6) {
                            setFieldValue(item.name, numericValue);
                          }
                        } else if (item.name === 'mobile_number') {
                          // Only allow digits for mobile number
                          const numericValue = value.replace(/\D/g, '');
                          if (numericValue.length <= 10) {
                            setFieldValue(item.name, numericValue);
                          }
                        } else {
                          setFieldValue(item.name, value);
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched[item.name] && Boolean(errors[item.name])}
                      helperText={touched[item.name] && errors[item.name]}
                      disabled={item.name === 'country'}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          color: 'grey.600'
                        }
                      }}
                    />
                  </>
                )}
              </FormControl>
            </Grid2>
          )
        )}
      </Grid2>

      <Typography variant="h4" sx={{ fontWeight: 'bold', pt: 3, mb: 2 }}>
        Bank Details
      </Typography>

      <Grid2 container spacing={2}>
        {busineesprofileFields.bank_details.map((item) => (
          <Grid2 size={{ xs: 12, sm: 6 }} key={item.name}>
            <FormControl fullWidth>
              {/* <Typography sx={{ mb: 1 }}>{item.label}</Typography>{' '} */}
              <Typography component="label" sx={{ mb: 1 }}>
                {getLabelWithAsterisk(item.label, item.required)}
              </Typography>
              <TextField
                name={item.name}
                value={values[item.name]}
                size="small"
                onChange={(e) => {
                  const value = e.target.value;
                  if (item.name === 'pan' || item.name === 'ifsc_code' || item.name === 'swift_code') {
                    setFieldValue(item.name, value.toUpperCase());
                  } else if (item.name === 'bank_name') {
                    // Only allow letters and spaces for bank name, convert to uppercase
                    const letterOnlyValue = value.replace(/[^A-Za-z\s]/g, '');
                    setFieldValue(item.name, letterOnlyValue.toUpperCase());
                  } else if (item.name === 'account_number') {
                    // Only allow digits for account number
                    const numericValue = value.replace(/\D/g, '');
                    if (numericValue.length <= 18) {
                      setFieldValue(item.name, numericValue);
                    }
                  } else {
                    setFieldValue(item.name, value);
                  }
                }}
                onBlur={handleBlur}
                error={touched[item.name] && Boolean(errors[item.name])}
                helperText={touched[item.name] && errors[item.name]}
                required
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    color: 'grey.600'
                  }
                }}
              />
            </FormControl>
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 4 }}>
        <Stack direction="row" spacing={2}>
          <div className="INV-Step-3">
            <Button variant="contained" onClick={handleSubmit}>
              Save & Continue
            </Button>
          </div>
        </Stack>
      </Box>
    </MainCard>
  );
}
