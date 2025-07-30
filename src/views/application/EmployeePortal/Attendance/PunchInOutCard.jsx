import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, Alert, CircularProgress } from '@mui/material';
import { IconClock, IconMapPin, IconAlertCircle } from '@tabler/icons-react';
import Factory from 'utils/Factory';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
const PunchInOutCard = ({ onAttendanceUpdate }) => {
  const dispatch = useDispatch();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Get current date in the format shown in the image
    const today = new Date();
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));

    // Check current check-in status
    checkCurrentStatus();
  }, []);

  const checkCurrentStatus = async () => {
    try {
      const { res } = await Factory('get', '/payroll/today/', {});
      if (res.status_cd === 0 && res.data && res.data.logs && res.data.logs.length > 0) {
        // Find the latest log that doesn't have a check-out time (currently checked in)
        const currentLog = res.data.logs.find((log) => log.check_in && !log.check_out);

        if (currentLog) {
          // User is currently checked in
          const checkInTime = new Date(currentLog.check_in);
          const timeString = checkInTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          setIsCheckedIn(true);
          setCheckInTime(timeString);

          // If location data is available, set it
          if (currentLog.location) {
            setLocation({
              latitude: 0,
              longitude: 0,
              coordinates: currentLog.location
            });
          }
        } else {
          // User is not currently checked in
          setIsCheckedIn(false);
          setCheckInTime(null);
          setLocation(null);
          setLocationAddress(null);
        }
      }
    } catch (error) {
      console.error('Error checking current status:', error);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Try multiple geocoding services for better accuracy
      const services = [
        // OpenStreetMap Nominatim
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`
        // Google Geocoding API (if you have API key)
        // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
      ];

      for (const serviceUrl of services) {
        try {
          const response = await fetch(serviceUrl);
          const data = await response.json();
          console.log('Geocoding response:', data);

          if (data.display_name) {
            // Extract relevant address components
            const addressParts = data.display_name.split(', ');

            // Try to find more specific location information
            let shortAddress = '';
            let city = '';
            let state = '';

            // Look for specific landmarks or areas
            if (data.address) {
              // Check for specific area names
              const area = data.address.suburb || data.address.neighbourhood || data.address.quarter || '';
              const road = data.address.road || '';
              const postcode = data.address.postcode || '';

              if (area && road) {
                shortAddress = `${area}, ${road}`;
              } else if (area) {
                shortAddress = area;
              } else if (road) {
                shortAddress = road;
              } else {
                shortAddress = addressParts.slice(0, 2).join(', ');
              }

              city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown';
              state = data.address.state || 'Unknown';
            } else {
              shortAddress = addressParts.slice(0, 2).join(', ');
              city = 'Unknown';
              state = 'Unknown';
            }

            return {
              fullAddress: data.display_name,
              shortAddress: shortAddress,
              city: city,
              state: state,
              country: data.address?.country || 'Unknown',
              coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            };
          }
        } catch (serviceError) {
          console.error('Service error:', serviceError);
          continue; // Try next service
        }
      }

      // If all services fail, return coordinates-based address
      return {
        fullAddress: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        shortAddress: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: 'Location',
        state: 'Unknown',
        country: 'Unknown',
        coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      };
    } catch (error) {
      console.error('Error getting address:', error);
      return {
        fullAddress: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        shortAddress: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: 'Location',
        state: 'Unknown',
        country: 'Unknown',
        coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      };
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      setIsGettingLocation(true);
      setLocationError(null);

      // Simple approach like the HTML example - directly request location
      // This will trigger the browser's permission popup
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Get address from coordinates
          const address = await getAddressFromCoordinates(latitude, longitude);
          setLocationAddress(address);

          setIsGettingLocation(false);
          resolve({ latitude, longitude, address });
        },
        (error) => {
          setIsGettingLocation(false);
          let errorMessage = 'Unable to retrieve your location.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access when prompted by your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location.';
          }

          setLocationError(errorMessage);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // 20 seconds to give user time to respond to popup
          maximumAge: 60000
        }
      );
    });
  };

  const handlePunchIn = async () => {
    try {
      setIsGettingLocation(true);
      // Get location first
      const locationData = await getCurrentLocation();

      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Prepare API payload
      const payload = {
        location: locationData?.coordinates || '',
        device_info: navigator.userAgent,
        check_in_type: 'manual'
      };

      // Make API call to manual check-in
      const { res } = await Factory('post', '/payroll/manual-checkin/', payload);

      if (res.status_cd === 0) {
        // Success - update local state
        setCheckInTime(timeString);
        setIsCheckedIn(true);
        setLocation(locationData);
        setLocationAddress(locationData);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Successfully checked in.',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        // Update parent component with attendance data
        if (onAttendanceUpdate) {
          onAttendanceUpdate('checkIn', timeString, locationData);
        }
      } else {
        // API error
        dispatch(
          openSnackbar({
            open: true,
            message: `Check-in failed: ${res.data?.message || 'Unknown error'}`,
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error during punch in:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify('Failed to check in. Please try again.'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePunchOut = async () => {
    try {
      setIsGettingLocation(true);
      // Get location for punch out as well
      const locationData = await getCurrentLocation();

      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Prepare API payload
      const payload = {
        location: locationData?.coordinates || '',
        device_info: navigator.userAgent
      };

      // Make API call to manual check-out
      const { res } = await Factory('post', '/payroll/manual-checkout/', payload);

      if (res.status_cd === 0) {
        // Success - update local state
        setIsCheckedIn(false);
        setCheckInTime(null);
        setLocation(null);
        setLocationAddress(null);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Successfully checked out.',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );

        // Update parent component with attendance data
        if (onAttendanceUpdate) {
          onAttendanceUpdate('checkOut', timeString, locationData);
        }
      } else {
        // API error
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(`Check-out failed: ${res.data?.message || 'Unknown error'}`),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error during punch out:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify('Failed to check out. Please try again.'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );

      // Still allow punch out even if location fails
      setIsCheckedIn(false);
      setCheckInTime(null);
      setLocation(null);
      setLocationAddress(null);

      // Update parent component even if location fails
      if (onAttendanceUpdate) {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        onAttendanceUpdate('checkOut', time, null);
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <Card
      sx={{
        bgcolor: 'grey.100',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent>
        {/* Location Error Alert */}
        {locationError && (
          <Alert severity="warning" icon={<IconAlertCircle />} sx={{ mb: 2 }} onClose={() => setLocationError(null)}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {locationError}
              </Typography>
              {locationError.includes('Location access denied') && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  To enable location: Click the location icon in your browser's address bar, or go to Settings → Privacy → Location and
                  allow access for this site.
                </Typography>
              )}
            </Box>
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left side - Text content */}
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1
              }}
            >
              Mark attendance for today ({currentDate})
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              {isCheckedIn ? 'You have checked in today.' : 'Please check in to start your work day.'}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 2
              }}
            >
              {isCheckedIn
                ? "Please don't forget to checkout at the end of the day."
                : 'Click the Check In button to mark your arrival. Your location will be requested for attendance verification.'}
            </Typography>

            {!isCheckedIn && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                💡 Location accuracy may vary. Exact coordinates will be shown for verification.
              </Typography>
            )}

            {/* Check-in time and location display */}
            {isCheckedIn && checkInTime && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  icon={<IconClock size={16} />}
                  label={`Checked in at: ${checkInTime}`}
                  sx={{
                    bgcolor: 'grey.200',
                    color: 'text.secondary',
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: 'text.secondary'
                    }
                  }}
                  size="small"
                />
                {location && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Chip
                      icon={<IconMapPin size={16} />}
                      label={locationAddress?.shortAddress || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                      sx={{
                        bgcolor: 'primary.50',
                        color: 'primary.main',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: 'primary.main'
                        }
                      }}
                      size="small"
                    />
                    {locationAddress && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', ml: 1 }}>
                        {locationAddress.city}, {locationAddress.state}
                      </Typography>
                    )}
                    {/* Show coordinates for verification */}
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', ml: 1, fontFamily: 'monospace' }}>
                      📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Right side - Action button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={isGettingLocation ? <CircularProgress size={16} color="inherit" /> : <IconClock size={20} />}
              onClick={isCheckedIn ? handlePunchOut : handlePunchIn}
              disabled={isGettingLocation}
              sx={{
                bgcolor: isCheckedIn ? 'error.main' : 'primary.main',
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: isCheckedIn ? 'error.dark' : 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'grey.400'
                }
              }}
            >
              {isGettingLocation ? 'Getting Location...' : isCheckedIn ? 'Check Out' : 'Check In'}
            </Button>

            {locationError && !isGettingLocation && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setLocationError(null);
                  if (isCheckedIn) {
                    handlePunchOut();
                  } else {
                    handlePunchIn();
                  }
                }}
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: '0.875rem'
                }}
              >
                Retry
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PunchInOutCard;
