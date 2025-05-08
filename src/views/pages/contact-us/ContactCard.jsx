import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
// third party
import { PatternFormat } from 'react-number-format';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

import { gridSpacing } from 'store/constant';

// assets
import mailImg from 'assets/images/landing/widget-mail.svg';

// select options
const currencies = [
  {
    value: '1',
    label: 'Below $1000'
  },
  {
    value: '2',
    label: '$1000 - $5000'
  },
  {
    value: '3',
    label: 'Not specified'
  }
];

const sizes = [
  {
    value: '1',
    label: '1 - 5'
  },
  {
    value: '2',
    label: '5 - 10'
  },
  {
    value: '3',
    label: '10+'
  }
];

// ===========================|| CONTACT CARD - FORMS ||=========================== //

export default function ContactCard() {
  const [budget, setBudget] = React.useState(1);
  const handleChange = (event) => {
    setBudget(Number(event.target?.value));
  };

  const [size, setSize] = React.useState(1);
  const handleChange1 = (event) => {
    setSize(Number(event.target?.value));
  };

  return (
    <Container>
      <Grid container spacing={gridSpacing} sx={{ justifyContent: 'center' }}>
        <Grid sx={{ mt: { md: 12.5, xs: 2.5 }, mb: { md: 4, xs: 2.5 } }} size={{ sm: 10, md: 7 }}>
          <Grid container spacing={gridSpacing}>
            <Grid size={12}>
              <Typography
                variant="h1"
                color="white"
                sx={{
                  fontSize: { xs: '1.8125rem', md: '3.5rem' },
                  fontWeight: 900,
                  lineHeight: 1.4,
                  mt: { xs: 10, md: 0 },
                  whiteSpace: 'nowrap'
                }}
              >
                We’d love to hear from you
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 400, lineHeight: 1.4, my: { xs: 'auto', md: 0 }, mx: { xs: 'auto', md: 12.5 } }}
                color="white"
              >
                Explore key statistics and trends shaping our understanding of the current landscape.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ position: 'relative', display: { xs: 'none', lg: 'block' } }} size={12}>
          <CardMedia
            component="img"
            src={mailImg}
            alt="Berry"
            sx={{
              mb: -0.081,
              position: 'absolute',
              bottom: -130,
              right: 0,
              width: 400,
              maxWidth: 1,
              animation: '5s wings ease-in-out infinite'
            }}
          />
        </Grid>
        <Grid sx={{ mb: -37.5 }} size={10}>
          <Card sx={{ mb: 6.25 }} elevation={4}>
            <CardContent sx={{ p: 4 }}>
              <Formik
                initialValues={{
                  first_name: '',
                  last_name: '',
                  email: '',
                  mobile_number: '',
                  message: ''
                }}
                validationSchema={Yup.object().shape({
                  first_name: Yup.string().required('First name is required'),
                  last_name: Yup.string().required('Last name is required'),
                  email: Yup.string().email('Invalid email address').required('Email is required'),
                  mobile_number: Yup.string().required('Phone number is required'),
                  message: Yup.string().required('Message is required')
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // Handle form submission here
                  console.log('Form submitted:', values);
                  const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/user_management/contact`;
                  axios
                    .post(apiUrl, values)
                    .then((response) => {
                      enqueueSnackbar('Thank you for contacting us!', {
                        variant: 'success',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        autoHideDuration: 3000
                      });
                    })
                    .catch((error) => {
                      enqueueSnackbar('Error submitting form!', {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        autoHideDuration: 3000
                      });
                    })
                    .finally(() => {
                      setSubmitting(false);
                      resetForm();
                    });
                }}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={Boolean(touched.first_name && errors.first_name)}>
                          <InputLabel>First Name</InputLabel>
                          <OutlinedInput
                            type="text"
                            name="first_name"
                            value={values.first_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="First Name"
                            placeholder="Enter Your First Name"
                          />
                          {touched.first_name && errors.first_name && <FormHelperText error>{errors.first_name}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={Boolean(touched.last_name && errors.last_name)}>
                          <InputLabel>Last Name</InputLabel>
                          <OutlinedInput
                            type="text"
                            name="last_name"
                            value={values.last_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Last Name"
                            placeholder="Enter Your Last Name"
                          />
                          {touched.last_name && errors.last_name && <FormHelperText error>{errors.last_name}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                          <InputLabel>Email Address</InputLabel>
                          <OutlinedInput
                            type="text"
                            name="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Email Address"
                            placeholder="Enter Your Email Address"
                          />
                          {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={Boolean(touched.mobile_number && errors.mobile_number)}>
                          <TextField
                            type="tel"
                            name="mobile_number"
                            value={values.mobile_number}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Phone Number"
                            placeholder="Enter Your Contact Number"
                            error={Boolean(touched.mobile_number && errors.mobile_number)}
                            helperText={touched.mobile_number && errors.mobile_number}
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*'
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <FormControl fullWidth error={Boolean(touched.message && errors.message)}>
                          <TextField
                            id="outlined-multiline-static1"
                            name="message"
                            value={values.message}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Message"
                            multiline
                            fullWidth
                            rows={4}
                            error={Boolean(touched.message && errors.message)}
                            helperText={touched.message && errors.message}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <Grid container spacing={gridSpacing}>
                          <Grid size={{ sm: 'grow' }}>
                            <Typography align="left" variant="body2">
                              By submitting this, you agree to the
                              <Typography variant="subtitle1" component={Link} to="#" color="primary" sx={{ mx: 0.5 }}>
                                Privacy Policy
                              </Typography>
                              and
                              <Typography variant="subtitle1" component={Link} to="#" color="primary" sx={{ ml: 0.5 }}>
                                Cookie Policy
                              </Typography>
                            </Typography>
                          </Grid>
                          <Grid>
                            <AnimateButton>
                              <Button variant="contained" color="secondary" type="submit" disabled={isSubmitting}>
                                Submit
                              </Button>
                            </AnimateButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
