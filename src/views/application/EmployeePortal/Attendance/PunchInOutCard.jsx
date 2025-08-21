import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, Alert, CircularProgress, Stack, Tooltip } from '@mui/material';
import { IconClock, IconMapPin, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
const GoogleAPIKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;

const PunchInOutCard = ({ onAttendanceUpdate }) => {
  const dispatch = useDispatch();
  const [attendanceStatus, setAttendanceStatus] = useState({
    isCheckedIn: false,
    checkInTime: null,
    location: null,
    locationAddress: null
  });
  const [loading, setLoading] = useState({
    statusCheck: true,
    location: false,
    action: false
  });
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  // Format date on component mount
  useEffect(() => {
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    );

    checkCurrentStatus();
  }, []);

  const checkCurrentStatus = async () => {
    try {
      const { res } = await Factory('get', '/payroll/today/');

      if (res.status_cd === 0 && res.data?.logs?.length > 0) {
        const activeSession = res.data.logs.find((log) => log.check_in && !log.check_out);

        if (activeSession) {
          const checkInTime = new Date(activeSession.check_in);
          const timeString = checkInTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          let locationAddress = null;
          if (activeSession.location) {
            const [lat, lng] = activeSession.location.split(',').map(Number);
            locationAddress = await getAddressFromCoordinates(lat, lng);
          }

          setAttendanceStatus({
            isCheckedIn: true,
            checkInTime: timeString,
            location: activeSession.location,
            locationAddress
          });
        }
      }
    } catch (err) {
      setError('Failed to load attendance data');
    } finally {
      setLoading((prev) => ({ ...prev, statusCheck: false }));
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const apiKey = GoogleAPIKey;
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);

      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const address = data.results[0];
        const components = address.address_components.reduce((acc, component) => {
          if (component.types.includes('street_number')) acc.streetNumber = component.long_name;
          if (component.types.includes('route')) acc.route = component.long_name;
          if (component.types.includes('locality')) acc.locality = component.long_name;
          if (component.types.includes('administrative_area_level_1')) acc.state = component.long_name;
          if (component.types.includes('country')) acc.country = component.long_name;
          return acc;
        }, {});

        return {
          full: address.formatted_address,
          short: `${components.streetNumber || ''} ${components.route || ''}`.trim(),
          locality: components.locality,
          state: components.state,
          country: components.country,
          coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        };
      }
      throw new Error(data.error_message || 'No address found');
    } catch (err) {
      return {
        full: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        short: 'Current location',
        locality: 'Unknown area',
        coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      };
    }
  };

  const getCurrentLocation = async () => {
    setLoading((prev) => ({ ...prev, location: true }));
    setError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const address = await getAddressFromCoordinates(latitude, longitude);

      return {
        coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        address
      };
    } catch (err) {
      let message = 'Location access denied';
      if (err.code === err.PERMISSION_DENIED) {
        message = 'Please enable location services in your browser settings';
      } else if (err.code === err.TIMEOUT) {
        message = 'Location request timed out';
      }
      setError(message);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, location: false }));
    }
  };

  const handleAttendanceAction = async () => {
    setLoading((prev) => ({ ...prev, action: true }));

    try {
      const locationData = await getCurrentLocation();
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const endpoint = attendanceStatus.isCheckedIn ? '/payroll/manual-checkout/' : '/payroll/manual-checkin/';

      const { res } = await Factory('post', endpoint, {
        location: locationData.coordinates,
        device_info: navigator.userAgent
      });

      if (res.status_cd === 0) {
        const newStatus = !attendanceStatus.isCheckedIn;
        setAttendanceStatus({
          isCheckedIn: newStatus,
          checkInTime: newStatus ? timeString : null,
          location: newStatus ? locationData.coordinates : null,
          locationAddress: newStatus ? locationData.address : null
        });

        dispatch(
          openSnackbar({
            open: true,
            message: `Successfully ${newStatus ? 'checked in' : 'checked out'}`,
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );

        if (onAttendanceUpdate) {
          onAttendanceUpdate(newStatus ? 'checkIn' : 'checkOut', timeString, locationData);
        }
      } else {
        throw new Error(res.data?.message || 'Action failed');
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Attendance action failed',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  if (loading.statusCheck) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" mt={2}>
          Loading attendance data...
        </Typography>
      </Card>
    );
  }
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2
      }}
    >
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Today's Attendance ({currentDate})
            </Typography>
            Please don't forget to checkout at the end of the day.
            <Typography variant="body1" color="text.secondary" mb={2}>
              {attendanceStatus.isCheckedIn ? 'You are currently checked in' : 'Ready to check in for your shift'}
            </Typography>
          </Box>

          <Box alignSelf="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
            {attendanceStatus.isCheckedIn && (
              <>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <IconClock size={18} />
                  <Typography>
                    Checked in at: <strong>{attendanceStatus.checkInTime}</strong>
                  </Typography>
                </Stack>
                {attendanceStatus.locationAddress && (
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <IconMapPin size={18} style={{ marginTop: 2 }} />
                    <Box>
                      {(() => {
                        const address = attendanceStatus.locationAddress.full;
                        const parts = address.split(',');
                        const result = [];

                        for (let i = 0; i < parts.length; i += 3) {
                          const group = parts.slice(i, i + 3).join(',');
                          if (group.trim()) {
                            result.push(group.trim());
                          }
                        }

                        return result.map((part, index) => (
                          <Typography variant="body2" key={index}>
                            {part}
                          </Typography>
                        ));
                      })()}
                    </Box>
                    <Tooltip
                      title="The location shown here is reported by the employee's browser and can be inaccurate, depending on their device and software."
                      placement="top"
                      arrow
                    >
                      <IconInfoCircle size={16} style={{ marginTop: 2, color: '#666', cursor: 'help' }} />
                    </Tooltip>
                  </Stack>
                )}
              </>
            )}
            <Button
              variant="contained"
              size="large"
              color={attendanceStatus.isCheckedIn ? 'error' : 'primary'}
              startIcon={loading.action || loading.location ? <CircularProgress size={20} color="inherit" /> : <IconClock size={20} />}
              onClick={handleAttendanceAction}
              disabled={loading.action || loading.location}
              sx={{
                minWidth: 160,
                maxWidth: 'fit-content',
                alignSelf: 'flex-start',
                fontWeight: 600,
                textTransform: 'none',
                marginTop: 2
              }}
            >
              {loading.action || loading.location ? 'Processing...' : attendanceStatus.isCheckedIn ? 'Check Out' : 'Check In'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PunchInOutCard;
