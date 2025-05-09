import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import { Link as RouterLink } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TarapngLogo from '../../../ui-component/TarapngLogo';
// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import LoginProvider from './LoginProvider';
import ViewOnlyAlert from './ViewOnlyAlert';

import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';

import useAuth from 'hooks/useAuth';
import { APP_AUTH } from 'config';

// A mapping of auth types to dynamic imports
const authRegisterImports = {
  firebase: () => import('./firebase/AuthRegister'),
  jwt: () => import('./jwt/AuthRegister'),
  aws: () => import('./aws/AuthRegister'),
  auth0: () => import('./auth0/AuthRegister'),
  supabase: () => import('./supabase/AuthRegister')
};

export default function Register() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { isLoggedIn } = useAuth();
  const [AuthRegisterComponent, setAuthRegisterComponent] = useState(null);

  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth') || '';

  useEffect(() => {
    const selectedAuth = authParam || APP_AUTH;

    const importAuthRegisterComponent = authRegisterImports[selectedAuth];

    importAuthRegisterComponent()
      .then((module) => setAuthRegisterComponent(() => module.default))
      .catch((error) => {
        console.error(`Error loading ${selectedAuth} AuthRegister`, error);
      });
  }, [authParam]);

  return (
    <AuthWrapper1>
      <Grid container direction="column" sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
        <Grid size={12}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              {!isLoggedIn && <ViewOnlyAlert />}
              <AuthCardWrapper>
                <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Grid sx={{ mb: 3 }}>
                    {/* <Link to="#" aria-label="theme logo">
                      <Logo />
                    </Link> */}
                    {/* <Typography variant="h1">Tara First</Typography> */}
                    <TarapngLogo />
                  </Grid>
                  <Grid size={12}>
                    <Grid container direction={{ xs: 'column-reverse', md: 'row' }} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Grid>
                        <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Typography gutterBottom variant={downMD ? 'h3' : 'h2'} sx={{ color: 'secondary.main' }}>
                            Sign up
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                            Enter your details to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>{AuthRegisterComponent && <AuthRegisterComponent />}</Grid>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={12}>
                    <Grid container direction="column" sx={{ alignItems: 'center' }} size={12}>
                      <Typography variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        Already have an account ?{' '}
                        <Link to="/login" style={{ textDecoration: 'none', color: '#673ab7', fontWeight: 'bold' }}>
                          Sign in
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
              {/* {!isLoggedIn && (
                <Box
                  sx={{
                    maxWidth: { xs: 400, lg: 475 },
                    margin: { xs: 2.5, md: 3 },
                    '& > *': {
                      flexGrow: 1,
                      flexBasis: '50%'
                    }
                  }}
                >
                  <LoginProvider currentLoginWith={APP_AUTH} />
                </Box>
              )} */}
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ px: 3, mb: 3, mt: 1 }} size={12}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
}
