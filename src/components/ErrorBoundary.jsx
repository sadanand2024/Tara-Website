import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_PATH } from 'config';

// React Router Error Handler
function RouterErrorHandler() {
    const error = useRouteError();
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate(DASHBOARD_PATH);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    let errorMessage = 'Something went wrong';
    let errorTitle = 'Oops! Something went wrong';

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            errorTitle = 'Page Not Found';
            errorMessage = 'The page you are looking for does not exist.';
        } else if (error.status === 401) {
            errorTitle = 'Unauthorized';
            errorMessage = 'You are not authorized to access this page.';
        } else if (error.status === 403) {
            errorTitle = 'Access Denied';
            errorMessage = 'You do not have permission to access this page.';
        } else if (error.status === 500) {
            errorTitle = 'Server Error';
            errorMessage = 'Something went wrong on our end. Please try again later.';
        }
    }

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    py: 4
                }}
            >
                <Stack spacing={3} alignItems="center">
                    {/* Error Icon */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            bgcolor: 'error.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <Typography variant="h1" color="error.main" sx={{ fontSize: '3rem' }}>
                            !
                        </Typography>
                    </Box>

                    {/* Error Title */}
                    <Typography variant="h3" component="h1" gutterBottom>
                        {errorTitle}
                    </Typography>

                    {/* Error Message */}
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                        {errorMessage}
                    </Typography>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<HomeIcon />}
                            onClick={handleGoHome}
                            size="large"
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            size="large"
                        >
                            Refresh Page
                        </Button>
                    </Stack>

                    {/* Development Error Details (only show in development) */}
                    {process.env.NODE_ENV === 'development' && error && (
                        <Box
                            sx={{
                                mt: 4,
                                p: 2,
                                bgcolor: 'grey.100',
                                borderRadius: 1,
                                textAlign: 'left',
                                maxWidth: '100%',
                                overflow: 'auto'
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Error Details (Development Only):
                            </Typography>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                {error.toString()}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Container>
    );
}

// Fallback UI component for component errors
function ErrorFallback({ error, resetErrorBoundary }) {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        navigate(DASHBOARD_PATH);
    };

    const handleReset = () => {
        resetErrorBoundary();
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    py: 4
                }}
            >
                <Stack spacing={3} alignItems="center">
                    {/* Error Icon */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            bgcolor: 'error.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <Typography variant="h1" color="error.main" sx={{ fontSize: '3rem' }}>
                            !
                        </Typography>
                    </Box>

                    {/* Error Title */}
                    <Typography variant="h3" component="h1" gutterBottom>
                        Oops! Something went wrong
                    </Typography>

                    {/* Error Message */}
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                        We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
                    </Typography>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={handleReset}
                            size="large"
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<HomeIcon />}
                            onClick={handleGoHome}
                            size="large"
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            size="large"
                        >
                            Refresh Page
                        </Button>
                    </Stack>

                    {/* Development Error Details (only show in development) */}
                    {process.env.NODE_ENV === 'development' && error && (
                        <Box
                            sx={{
                                mt: 4,
                                p: 2,
                                bgcolor: 'grey.100',
                                borderRadius: 1,
                                textAlign: 'left',
                                maxWidth: '100%',
                                overflow: 'auto'
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Error Details (Development Only):
                            </Typography>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                {error.toString()}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Container>
    );
}

// Error logging function
function logErrorToService(error, errorInfo) {
    // Log the error to console (in production, you'd send this to an error reporting service)
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // Example: Send to error reporting service
    // if (process.env.NODE_ENV === 'production') {
    //   // Send to Sentry, LogRocket, etc.
    //   errorReportingService.captureException(error, { extra: errorInfo });
    // }
}

// Main ErrorBoundary component
function ErrorBoundary({ children }) {
    // If this is being used as a React Router error element, render the router error handler
    if (children === undefined) {
        return <RouterErrorHandler />;
    }

    // Otherwise, use it as a component error boundary
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={logErrorToService}
            onReset={() => {
                // Reset the state of your app here
                console.log('Error boundary reset');
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
}

export default ErrorBoundary;
