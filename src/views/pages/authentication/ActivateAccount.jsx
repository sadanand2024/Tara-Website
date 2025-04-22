import useMediaQuery from '@mui/material/useMediaQuery';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

// project imports
import Logo from 'ui-component/Logo';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import imgMain from 'assets/images/auth/img-a2-signup.svg';

// carousel items
const items = [
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  }
];

// ===============================|| AUTH2 - ACTIVATE ACCOUNT ||=============================== //

export default function ActivateAccount() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [activationData, setActivationData] = useState({
    uid: '',
    ssid: '',
    name: '',
    email: '',
    invitedBy: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uid = params.get('uid');
    const ssid = params.get('ssid');
    const name = params.get('name');
    const email = params.get('email');
    const invitedBy = params.get('invitedBy');

    if (uid && ssid) {
      setActivationData({ uid, ssid, name, email, invitedBy });
    } else {
      enqueueSnackbar('Invalid activation link', { variant: 'error' });
      navigate('/login');
    }
  }, [location, navigate, enqueueSnackbar]);

  const handleActivation = async () => {
    // try {
    //   setIsLoading(true);
    //   const response = await axios.post('/api/auth/activate-account', {
    //     uid: activationData.uid,
    //     ssid: activationData.ssid
    //   });

    //   if (response.data.success) {
    //     enqueueSnackbar('Account activated successfully', { variant: 'success' });
    //     navigate('/pages/login');
    //   } else {
    //     throw new Error(response.data.message || 'Activation failed');
    //   }
    // } catch (error) {
    //   enqueueSnackbar(error.message || 'Failed to activate account', { variant: 'error' });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const activationLink = `${window.location.origin}/auth/activate?uid=${activationData.uid}&ssid=${activationData.ssid}`;

  return (
    <Grid container sx={{ justifyContent: { xs: 'center', md: 'space-between' }, alignItems: 'center' }}>
      <Grid sx={{ minHeight: '100vh' }} size={{ md: 6, lg: 7, xs: 12 }}>
        <Grid
          id="activate-account"
          container
          sx={{
            mt: 10,
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: { xs: 'calc(100vh - 68px)', md: 'calc(100vh - 152px)' }
          }}
          size={12}
        >
          {/* Content Section*/}
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: 'center',
              maxWidth: 480,
              p: { xs: 2.5, md: 4 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: (theme) => theme.customShadows.z1
            }}
          >
            <Grid size={12}>
              <Stack spacing={3} sx={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1,
                    background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 600
                  }}
                >
                  Hello {activationData.name},
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{
                    lineHeight: 1.6,
                    letterSpacing: '0.02em'
                  }}
                >
                  {activationData.invitedBy} (
                  <Typography
                    component="span"
                    color="primary"
                    sx={{
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.dark',
                        transition: 'color 0.3s ease'
                      }
                    }}
                  >
                    {activationData.email}
                  </Typography>
                  ) with{' '}
                  <Typography component="span" sx={{ fontWeight: 500 }}>
                    Hyper 9
                  </Typography>{' '}
                  has invited you to start using their password management service.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleActivation}
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    mb: 2,
                    textTransform: 'none',
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                      boxShadow: (theme) => `0 12px 20px ${alpha(theme.palette.primary.main, 0.28)}`
                    }
                  }}
                >
                  {isLoading ? 'Activating...' : 'Activate Account'}
                </Button>
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mb: 1.5,
                      fontWeight: 500
                    }}
                  >
                    Instead, you can copy/paste this link into your browser
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      width: '100%',
                      wordBreak: 'break-all',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.12)
                      }
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(activationLink);
                      enqueueSnackbar('Link copied to clipboard', { variant: 'success' });
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem'
                      }}
                    >
                      {activationLink}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  If you have any problems accessing your account, please contact support.
                </Typography>
                <a href="mailto:admin@tarafirst.com">admin@tarafirst.com</a>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }} size={{ md: 6, lg: 5 }}>
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
              <CardMedia component="img" alt="Auth method" src={imgMain} sx={{ maxWidth: 1, m: '0 auto', display: 'block', width: 300 }} />
            </Grid>
          </Grid>
        </BackgroundPattern2>
      </Grid>
    </Grid>
  );
}
