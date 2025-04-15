import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import OtpInput from 'react18-input-otp';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconBug } from '@tabler/icons-react';

// ========================|| AWS COGNITO - RESET PASSWORD ||======================== //

export default function AuthResetPassword({ ...others }) {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const { awsResetPassword, isLoggedIn } = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth');

  return (
    <Formik
      initialValues={{
        otp: '',
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        otp: Yup.string().max(255).required('Verification Code is required'),
        password: Yup.string().max(255).required('Password is required'),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .test('confirmPassword', 'Both Password must be match!', (confirmPassword, yup) => yup.parent.password === confirmPassword)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await awsResetPassword?.(values.otp, values.password)
            .then(() => {
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Password Reset Successfully',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );
              setTimeout(() => {
                navigate(isLoggedIn ? '/auth/login' : authParam ? `/login?auth=${authParam}` : '/login', { replace: true });
              }, 1500);

              // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
              // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
              // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
              // github issue: https://github.com/formium/formik/issues/2430
            })
            .catch((err) => {
              setStatus({ success: false });
              setErrors({ submit: err });
              setSubmitting(false);
            });
        } catch (err) {
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <Stack spacing={1} sx={{ mb: 1.25 }}>
            {touched && errors && errors.submit && (
              <Alert color="error" icon={<IconBug color={theme.palette.error.main} />} sx={{ mb: 1 }}>
                {errors?.submit}
              </Alert>
            )}
            <OtpInput
              value={values.otp}
              onChange={(otp) => setFieldValue('otp', otp)}
              numInputs={6}
              isInputNum
              containerStyle={{ justifyContent: 'space-between' }}
              inputStyle={{
                width: '100%',
                margin: '4px',
                padding: '16px',
                backgroundColor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.grey[400]}`,
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
            {touched.otp && errors.otp && (
              <FormHelperText error id="helper-text-password-reset">
                {errors.otp}
              </FormHelperText>
            )}
          </Stack>
          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-reset">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-reset"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
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
          </FormControl>
          {touched.password && errors.password && (
            <FormControl fullWidth>
              <FormHelperText error id="standard-weight-helper-text-reset">
                {errors.password}
              </FormHelperText>
            </FormControl>
          )}
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

          <FormControl
            fullWidth
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            sx={{ ...theme.typography.customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type="password"
              value={values.confirmPassword}
              name="confirmPassword"
              label="Confirm Password"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
          </FormControl>

          {touched.confirmPassword && errors.confirmPassword && (
            <FormControl fullWidth>
              <FormHelperText error id="standard-weight-helper-text-confirm-password">
                {' '}
                {errors.confirmPassword}{' '}
              </FormHelperText>
            </FormControl>
          )}
          <Box sx={{ mt: 1 }}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Reset Password
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
}
