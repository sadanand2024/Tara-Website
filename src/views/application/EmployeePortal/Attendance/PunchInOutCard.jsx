import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, Alert, CircularProgress, Stack, Tooltip, Grid } from '@mui/material';
import { IconClock, IconMapPin, IconInfoCircle } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';
const GoogleAPIKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;

const PunchInOutCard = ({ onAttendanceUpdate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);

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
  const [wsConnected, setWsConnected] = useState(false);

  // WebSocket connection
  const socketUrl = user?.id ? `ws://dev-backend.tarafirst.com:8000/ws/attendance/${user.id}/` : null;
  const { sendJsonMessage, lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    onOpen: () => {
      setWsConnected(true);
    },
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {}
    },
    onClose: (event) => {
      setWsConnected(false);
    },
    onError: (error) => {
      setWsConnected(false);
    },
    shouldReconnect: (closeEvent) => {
      // Only reconnect if user is available and it's not a manual close
      return user?.id && closeEvent.code !== 1000;
    },
    reconnectAttempts: 5,
    reconnectInterval: 3000
  });

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'ws_connected':
        break;
      case 'attendance_update':
        handleAttendanceUpdate(data);
        break;
      default:
        break;
    }
  };

  // Handle attendance updates from WebSocket
  const handleAttendanceUpdate = (data) => {
    const { action, record } = data;

    if (action === 'check_in' || action === 'check_out') {
      const isCheckedIn = action === 'check_in';
      const checkInTime = record.check_in
        ? new Date(record.check_in).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        : null;

      setAttendanceStatus((prev) => ({
        ...prev,
        isCheckedIn,
        checkInTime: isCheckedIn ? checkInTime : null,
        location: record.location || null
      }));

      // Show notification
      dispatch(
        openSnackbar({
          open: true,
          message: `Attendance ${action === 'check_in' ? 'check-in' : 'check-out'} recorded successfully`,
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );

      // Call parent callback if provided
      if (onAttendanceUpdate) {
        onAttendanceUpdate(action === 'check_in' ? 'checkIn' : 'checkOut', checkInTime, {
          coordinates: record.location,
          verified: record.verified
        });
      }
    }
  };

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

  // Get the current attendance status from the API
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

  // Get the address from the coordinates
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

  // Get the user's current location
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

  // Handle attendance action (check in or check out)
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

        // Send WebSocket message
        if (user?.id) {
          const wsMessage = {
            type: 'attendance_action',
            action: newStatus ? 'check_in' : 'check_out',
            employee_id: user.id,
            location: locationData.coordinates,
            device_info: navigator.userAgent,
            timestamp: new Date().toISOString()
          };
          sendJsonMessage(wsMessage);
        }

        // Update local state immediately
        setAttendanceStatus({
          isCheckedIn: newStatus,
          checkInTime: newStatus ? timeString : null,
          location: newStatus ? locationData.coordinates : null,
          locationAddress: newStatus ? locationData.address : null
        });

        // Show success notification
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // spinner + text vertically
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200 // adjust based on your layout
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Checking status...
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // column on mobile, row on desktop
            justifyContent: 'space-between',
            gap: 3
          }}
        >
          {/* Left side - Title and status */}
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              Today's Attendance ({currentDate})
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
              Please don't forget to checkout at the end of the day.
            </Typography>

            {attendanceStatus.isCheckedIn ? (
              <Typography variant="body2" color="success.darker" fontWeight="medium">
                ✅ You are currently checked in
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                ⏸️ You are not checked in
              </Typography>
            )}
          </Box>

          {/* Right side - Time, location, and action button */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-end' }, // align right on desktop
              flexShrink: 0
            }}
          >
            <Stack spacing={2} alignItems="flex-start">
              {attendanceStatus.isCheckedIn && (
                <>
                  {/* Check-in time */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconClock size={18} />
                    <Typography>
                      Checked in at: <strong>{attendanceStatus.checkInTime}</strong>
                    </Typography>
                  </Stack>

                  {/* Location */}
                  {attendanceStatus.locationAddress && (
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <IconMapPin size={18} style={{ marginTop: 2 }} />
                      <Box>
                        {attendanceStatus.locationAddress.full
                          .split(',')
                          .reduce((result, _, i, arr) => {
                            if (i % 3 === 0) result.push(arr.slice(i, i + 3).join(','));
                            return result;
                          }, [])
                          .map((part, idx) => (
                            <Typography variant="body2" key={idx}>
                              {part.trim()}
                            </Typography>
                          ))}
                      </Box>
                      <Tooltip
                        title="The location shown here is reported by the employee's browser and may not always be accurate."
                        placement="top"
                        arrow
                      >
                        <IconInfoCircle size={16} style={{ marginTop: 2, color: '#666', cursor: 'help' }} />
                      </Tooltip>
                    </Stack>
                  )}
                </>
              )}

              {/* Check In/Out Button */}
              <Button
                variant="contained"
                size="large"
                color={attendanceStatus.isCheckedIn ? 'error' : 'primary'}
                startIcon={loading.action || loading.location ? <CircularProgress size={20} color="inherit" /> : <IconClock size={20} />}
                onClick={handleAttendanceAction}
                disabled={loading.action || loading.location}
                sx={{
                  minWidth: 160,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                {loading.action || loading.location ? 'Processing...' : attendanceStatus.isCheckedIn ? 'Check Out' : 'Check In'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PunchInOutCard;
