'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainCard from '@/components/MainCard';
import { Box, Typography, Grid2, Button } from '@mui/material';
import Factory from '@/utils/Factory';
import Loader from '@/components/PageLoader';
import { useSnackbar } from '@/components/CustomSnackbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useCurrentUser from '@/hooks/useCurrentUser';
import CustomAutocomplete from '@/utils/CustomAutocomplete';
import CustomInput from '@/utils/CustomInput';
import { indian_States_And_UTs } from '@/utils/indian_States_And_UT';
import { industries } from '@/utils/industries';

// Form validation schema using Yup
const validationSchema = Yup.object({
  nameOfBusiness: Yup.string().required('Business Name is required'),
  business_nature: Yup.string().required('Business Nature is required'),
  address_line1: Yup.string().required('Address Line 1 is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.number()
    .typeError('Pincode must be an integer')
    .required('Pincode is required')
    .integer('Pincode must be an integer')
    .min(100000, 'Pincode must be at least 6 digits')
    .max(999999, 'Pincode must be at most 6 digits')
});

const PayrollSetup = () => {
  const { userData } = useCurrentUser();
  let businessId = userData.user_type === 'Business' ? userData.business_affiliated[0].id : userData.businesssDetails.business[0].id;
  let userId = userData.dashboardChange === false ? userData.id : '';
  let router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [postType, setPostType] = useState('');

  const [loading, setLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({});
  const fields = [
    { name: 'nameOfBusiness', label: 'Business Name' },
    { name: 'business_nature', label: 'Business Nature' },
    { name: 'address_line1', label: 'Address Line 1' },
    { name: 'address_line2', label: 'Address Line 2' },
    { name: 'country', label: 'Country' },
    { name: 'state', label: 'State' },
    { name: 'city', label: 'City' },
    { name: 'pincode', label: 'Pincode' }
  ];

  const formik = useFormik({
    initialValues: {
      nameOfBusiness: '',
      business_nature: '',
      address_line1: '',
      address_line2: '',
      country: 'IN',
      city: '',
      state: '',
      pincode: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      let postData = {
        client: userId,
        nameOfBusiness: values.nameOfBusiness,
        business_nature: values.business_nature,
        headOffice: {
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          state: values.state,
          pincode: values.pincode
        }
      };

      const url = postType === 'post' ? `/user_management/businesses/` : `/user_management/businesses/${businessDetails.id}/`;
      const { res, error } = await Factory(postType, url, postData);

      if (res.status_cd === 0) {
        showSnackbar('Data Saved Successfully', 'success');

        const userDetails = JSON.parse(localStorage.getItem('auth-user')) || {};

        userDetails.business_exists = true;
        userDetails.business_affiliated = [{ ...res.data }];

        localStorage.setItem('auth-user', JSON.stringify(userDetails));
        router.push('/payroll');
      } else {
        showSnackbar(res.data?.data ? JSON.stringify(res.data.data) : 'An error occurred', 'error');
      }

      setLoading(false);
    }
  });

  const renderFields = (fields) => {
    return fields.map((field) => {
      if (field.name === 'state' || field.name === 'business_nature') {
        // Render CustomAutocomplete for the 'state' field
        return (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
            <Typography sx={{ mb: 1 }}>
              {field.label} <span style={{ color: 'red' }}>*</span>
            </Typography>

            <CustomAutocomplete
              value={values[field.name]}
              name={field.name}
              onChange={(e, newValue) => setFieldValue(field.name, newValue)}
              options={field.name === 'state' ? indian_States_And_UTs : industries}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              sx={{ width: '100%' }}
              // disabled={field.name === 'org_address_state'}
            />
          </Grid2>
        );
      }

      // Default rendering for other fields
      return (
        <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>
            {field.label} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <CustomInput
            name={field.name}
            value={values[field.name]}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            fullWidth
            disabled={field.name === 'country'}
          />
        </Grid2>
      );
    });
  };
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, setFieldValue } = formik;
  useEffect(() => {
    // Set business details first
  }, [userData]);

  const individual_Business_get = async () => {
    setLoading(true);
    const url = `/user_management/businesses/${businessId}/`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false); // Stop loading after the request completes
    console.log(res);
    if (res.status_cd === 0) {
      setBusinessDetails(res.data);
      setValues((prev) => ({
        ...prev,
        nameOfBusiness: res.data.nameOfBusiness,
        business_nature: res.data.business_nature,
        address_line1: res.data.headOffice.address_line1,
        address_line2: res.data.headOffice.address_line2,
        country: 'IN',
        city: res.data.headOffice.city,
        state: res.data.headOffice.state,
        pincode: res.data.headOffice.pincode
      }));
      setPostType('put');
    } else {
      setBusinessDetails((prev) => ({
        ...prev,
        nameOfBusiness: userData.dashboardChange === false ? userData.user_name : '',
        email: userData.dashboardChange === false ? userData.email : ''
      }));

      setValues((prev) => ({
        ...prev,
        nameOfBusiness: userData.dashboardChange === false ? userData.user_name : ''
      }));
      // showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
  useEffect(() => {
    individual_Business_get();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 2
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 800 }}>
            <Typography variant="h6" sx={{ color: '#4A4A4A', fontWeight: 600, textAlign: 'center' }}>
              Business Profile Setup!
            </Typography>
            <Typography variant="h6" sx={{ color: '#4A4A4A', fontWeight: 600, textAlign: 'center', mt: 1, mb: 1 }}>
              Glad to Have you onboard {businessDetails?.email}
            </Typography>
            <Typography variant="h6" sx={{ color: '#4A4A4A', textAlign: 'center', fontWeight: 600 }}>
              Set up your business profile to start off payroll for {businessDetails?.nameOfBusiness}
            </Typography>

            <MainCard sx={{ maxWidth: 800, marginTop: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                  {renderFields(fields)}
                </Grid2>
                <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                  <Button variant="contained" color="primary" type="submit" sx={{ padding: '10px 20px', fontSize: '16px' }}>
                    Get Started
                  </Button>
                </Box>
              </form>
            </MainCard>
          </Box>
        </Box>
      )}
    </>
  );
};

export default PayrollSetup;
