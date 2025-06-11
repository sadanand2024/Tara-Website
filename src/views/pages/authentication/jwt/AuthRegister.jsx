import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';
import OtpInput from 'react18-input-otp';
import { ThemeMode } from 'config';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthCodeVerification from './AuthCodeVerification';
// ===========================|| JWT - REGISTER ||=========================== //

export default function JWTRegister({ ...others }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [showOTPField, setShowOTPField] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const { register } = useAuth();
  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth');
  const moduleId = searchParams.get('id');
  const type = searchParams.get('type');
  const context_type = searchParams.get('context');

  // Determine if organizationName should be shown/required
  const isBusinessContext = context_type === 'business' || context_type === 'Business';

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  const handleRequestOTP = async (values) => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/user_management/request-otp/`, {
        email: values.email
      });
      setEmail(values.email);
      setPassword(values.password);
      setShowOTPField(true);
      dispatch(
        openSnackbar({
          open: true,
          message: 'OTP sent successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.response?.data?.error || 'Failed to send OTP. Please try again.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      throw err;
    }
  };

  return (
    <>
      <Grid container direction="column" spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }} size={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              {showOTPField ? 'Enter OTP to complete registration' : 'Sign up with Email address'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Formik
        enableReinitialize
        initialValues={{
          email: '',
          password: '',
          otp: '',
          ...(isBusinessContext ? { organizationName: '' } : {}),
          moduleId: moduleId,
          type: type || '',
          context_type: context_type || '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          ...(isBusinessContext
            ? {
                organizationName: Yup.string().max(255).required('Organization name is required')
              }
            : {}),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password can not start or end with spaces', (value) => value === value.trim()),
          otp: Yup.string().when('showOTPField', {
            is: true,
            then: (schema) => schema.required('OTP is required')
          })
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (!showOTPField) {
              await handleRequestOTP(values);
              return;
            }

            // Validate OTP length before proceeding
            if (!values.otp || values.otp.length !== 6) {
              setErrors({ submit: 'Please enter complete 6-digit OTP' });
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Please enter complete 6-digit OTP',
                  variant: 'alert',
                  alert: { color: 'error' },
                  close: false
                })
              );
              return;
            }

            const trimmedEmail = values.email.trim();
            const response = await register(
              trimmedEmail,
              values.otp,
              values.password,
              values.organizationName,
              moduleId,
              type,
              context_type
            );

            setStatus({ success: true });
            setSubmitting(false);

            dispatch(
              openSnackbar({
                open: true,
                message: 'Your registration has been successfully completed',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } catch (err) {
            // console.error('Registration failed:', err);

            setStatus({ success: false });

            let errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
            if (err.error) {
              errorMsg = err.error;
            }

            setErrors({ submit: errorMsg });
            setSubmitting(false);

            dispatch(
              openSnackbar({
                open: true,
                message: errorMsg,
                variant: 'alert',
                alert: { color: 'error' },
                close: false
              })
            );
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* Only show organization name if business context */}
            {isBusinessContext && !showOTPField && (
              <FormControl
                fullWidth
                error={Boolean(touched.organizationName && errors.organizationName)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="organization-name">Organization Name</InputLabel>
                <OutlinedInput
                  id="organization-name"
                  type="text"
                  value={values.organizationName}
                  name="organizationName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Organization Name"
                />
                {touched.organizationName && errors.organizationName && (
                  <FormHelperText error id="helper-text-organization-name">
                    {errors.organizationName}
                  </FormHelperText>
                )}
              </FormControl>
            )}

            {!showOTPField ? (
              <>
                <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email-register"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.email}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password-register"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-register">
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>

                {strength !== 0 && (
                  <FormControl fullWidth>
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid>
                          <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
                        </Grid>
                        <Grid>
                          <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </FormControl>
                )}
              </>
            ) : (
              <OtpInput
                value={values.otp}
                onChange={(otpNumber) => {
                  // Only allow numbers
                  const numbersOnly = otpNumber.replace(/[^0-9]/g, '');
                  handleChange({ target: { name: 'otp', value: numbersOnly } });
                }}
                numInputs={6}
                type="number"
                shouldAutoFocus
                containerStyle={{ justifyContent: 'space-between' }}
                inputStyle={{
                  width: '100%',
                  margin: '8px',
                  padding: '10px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 4,
                  ':hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
                focusStyle={{
                  outline: 'none',
                  border: `2px solid ${theme.palette.primary.main}`
                }}
              />
            )}
            {!showOTPField && (
              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                    }
                    label={
                      <Typography variant="subtitle1">
                        Agree with &nbsp;
                        <Typography variant="subtitle1" component={Link} to="#">
                          Terms & Condition.
                        </Typography>
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            )}
            {/* {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )} */}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  {showOTPField ? 'Complete Registration' : 'Sign up'}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}
