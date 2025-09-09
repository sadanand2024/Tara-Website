import { RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomErrorComponent from 'views/pages/maintenance/Error';
// routing
import router from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
// import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';

import ThemeCustomization from 'themes';
import { ServicesProvider } from 'contexts/ServicesContext';
import ErrorBoundary from 'components/ErrorBoundary';
// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { SupabseProvider as AuthProvider } from 'contexts/SupabaseContext';

// ==============================|| APP ||============================== //

export default function App() {
  const handleError = (error, errorInfo) => {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  };
  return (
    <ErrorBoundary ErrorComponent={CustomErrorComponent} onError={handleError}>
      <ThemeCustomization>
        {/* <RTLLayout> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Locales>
            <NavigationScroll>
              <AuthProvider>
                <>
                  <Notistack>
                    <ServicesProvider>
                      <RouterProvider router={router} />
                      <Snackbar />
                    </ServicesProvider>
                  </Notistack>
                </>
              </AuthProvider>
            </NavigationScroll>
          </Locales>
        </LocalizationProvider>
        {/* </RTLLayout> */}
      </ThemeCustomization>
    </ErrorBoundary>
  );
}
