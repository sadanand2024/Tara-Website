import useMediaQuery from '@mui/material/useMediaQuery';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';

// project imports
import Logo from 'ui-component/Logo';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import imgMain from 'assets/images/auth/img-a2-signup.svg';
import activationSuccess from '../../../assets/images/auth/activation-success.svg';
import activationPending from '../../../assets/images/auth/activation-pending.svg';

// carousel items
const items = [
  {
    title: 'Simplify Your Finance, Accounting & Compliance',
    description: 'TaraFirst empowers businesses to manage bookkeeping, payroll, tax filings, and reporting seamlessly.'
  },
  {
    title: 'Expert-Backed Financial Management',
    description: 'Get CA-supervised services, real-time reports, and stress-free compliance — tailored for startups and growing businesses.'
  },
  {
    title: 'Complete Business Financial Solutions',
    description: 'From bookkeeping to CFO services, TaraFirst offers powerful tools and expert support to scale your business securely.'
  },
  {
    title: 'Smart Finance & Compliance Platform',
    description:
      'TaraFirst combines technology and expert support to automate accounting, tax, payroll, and reporting for modern businesses.'
  }
];

// ===============================|| AUTH2 - ACTIVATE ACCOUNT ||=============================== //

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function ActivateAccount() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const params = new URLSearchParams(location.search);
  const pathParts = location.pathname.split('/');
  const lastWord = pathParts[pathParts.length - 1];

  const [activationData, setActivationData] = useState({
    uid: params.get('uid'),
    token: params.get('token')
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [url, setUrl] = useState(lastWord !== 'activation' ? '/user_management/team/invitation/accept/' : '/user_management/activate');

  useEffect(() => {
    if (activationData.uid && activationData.token) {
      handleActivation(url);
    } else {
      enqueueSnackbar('Invalid activation link', { variant: 'error' });
      navigate('/login');
    }
  }, []);

  const handleActivation = (url) => {
    setIsLoading(true);
    axios({
      method: 'POST',
      url: import.meta.env.VITE_APP_BASE_URL + url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        uid: activationData.uid,
        token: activationData.token
      }
    })
      .then((res) => {
        setIsActivated(true);
        enqueueSnackbar('Account activated successfully', {
          variant: 'success',
          autoHideDuration: 3000
        });
        setTimeout(() => {
          navigate('/login');
        }, 8000);
      })
      .catch((e) => {
        const errorMessage = e.response?.data?.error || 'Invalid or expired activation link';
        enqueueSnackbar(errorMessage, {
          variant: 'error',
          autoHideDuration: 5000
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const activationLink = `${window.location.origin}/auth/activate?uid=${activationData.uid}&token=${activationData.token}`;

  return (
    <Grid container sx={{ minHeight: '100vh', justifyContent: { xs: 'center', md: 'space-between' }, alignItems: 'center' }}>
      <Grid
        sx={{
          minHeight: '100vh',
          width: { xs: '100%', md: '50%', lg: '58.333%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Grid
          id="activate-account"
          container
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: { xs: '100vh', md: 'auto' },
            p: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <MotionBox
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            component={Grid}
            container
            spacing={2}
            sx={{
              justifyContent: 'center',
              maxWidth: { xs: '100%', sm: 480 },
              width: '100%',
              p: { xs: 2.5, md: 4 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: theme.customShadows.z1,
              overflow: 'hidden',
              mx: { xs: 2, sm: 0 }
            }}
          >
            <Grid size={12} sx={{ textAlign: 'center', mb: 3 }}>
              <MotionBox
                component="img"
                src={isActivated ? activationSuccess : activationPending}
                alt={isActivated ? 'Account Activated' : 'Activation Pending'}
                sx={{
                  width: '200px',
                  height: 'auto',
                  mb: 3
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <MotionTypography
                variant="h3"
                sx={{
                  mb: 1,
                  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 600
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isActivated ? `Activated!` : `Activating Account...`}
              </MotionTypography>
              {isActivated && (
                <MotionBox
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: 64,
                      color: theme.palette.success.main,
                      filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.success.main, 0.4)})`
                    }}
                  />
                </MotionBox>
              )}
            </Grid>
            <Grid size={12}>
              <Stack spacing={3} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                {!isActivated && (
                  <MotionTypography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                      lineHeight: 1.6,
                      letterSpacing: '0.02em',
                      textAlign: 'center'
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Stack sx={{ direction: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography component="span" sx={{ fontWeight: 500 }}>
                        Please wait while we activate your account.
                      </Typography>
                      <Typography component="span" sx={{ fontWeight: 500 }}>
                        This won't take long.
                      </Typography>
                    </Stack>
                  </MotionTypography>
                )}
                {isActivated ? (
                  <MotionBox initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        mb: 2
                      }}
                    >
                      You will be redirected to the login page in a few seconds...
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/login')}
                        sx={{
                          textTransform: 'none',
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                          fontSize: '1rem',
                          fontWeight: 500,
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                          '&:hover': {
                            boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.28)}`
                          }
                        }}
                      >
                        Go to Login
                      </Button>
                    </Box>
                  </MotionBox>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleActivation(url)}
                    disabled={isLoading}
                    sx={{
                      textTransform: 'none',
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 500,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.28)}`
                      }
                    }}
                  >
                    {isLoading ? 'Activating...' : 'Retry Activation'}
                  </Button>
                )}
                {!isActivated && (
                  <MotionBox
                    sx={{
                      width: '100%',
                      mt: 3
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5
                      }}
                    >
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      Having trouble? Contact support at{' '}
                      <a
                        href="mailto:admin@tarafirst.com"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 500
                        }}
                      >
                        admin@tarafirst.com
                      </a>
                    </Typography>
                  </MotionBox>
                )}
              </Stack>
            </Grid>
          </MotionBox>
        </Grid>
      </Grid>
      <Grid
        sx={{
          position: 'relative',
          alignSelf: 'stretch',
          display: { xs: 'none', md: 'block' },
          width: { md: '50%', lg: '41.667%' }
        }}
      >
        <BackgroundPattern2>
          <Grid container sx={{ justifyContent: 'center' }}>
            <Grid size={12}>
              <Grid container sx={{ justifyContent: 'center', pb: 8 }}>
                <Grid sx={{ '& .slick-list': { pb: 2 } }} size={{ xs: 10, lg: 8 }}>
                  <AuthSlider items={items} />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <CardMedia
                component="img"
                alt="Auth method"
                src={imgMain}
                sx={{
                  maxWidth: 1,
                  m: '0 auto',
                  display: 'block',
                  width: 300
                }}
              />
            </Grid>
          </Grid>
        </BackgroundPattern2>
      </Grid>
    </Grid>
  );
}
