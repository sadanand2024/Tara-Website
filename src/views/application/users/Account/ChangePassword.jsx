import { useState } from 'react';
// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import Factory from 'utils/Factory';

// ==============================|| PROFILE 2 - CHANGE PASSWORD ||============================== //

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbar({ open: true, message: 'All fields are required.', severity: 'error' });
      return;
    }
    if (newPassword.length < 8) {
      setSnackbar({ open: true, message: 'New password must be at least 8 characters.', severity: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSnackbar({ open: true, message: 'New password and confirm password do not match.', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      const res = await Factory('put', '/user_management/change-password/', {
        old_password: currentPassword,
        new_password: newPassword
      });
      if (res.res.status_cd === 0) {
        setSnackbar({ open: true, message: 'Password changed successfully.', severity: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSnackbar({ open: true, message: res.res.data.data.error || 'Failed to change password.', severity: 'error' });
        console.log(res);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to change password.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            type={showCurrent ? 'text' : 'password'}
            fullWidth
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle current password visibility" onClick={() => setShowCurrent((show) => !show)} edge="end">
                    {!showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} />
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            type={showNew ? 'text' : 'password'}
            fullWidth
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle new password visibility" onClick={() => setShowNew((show) => !show)} edge="end">
                    {!showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle confirm password visibility" onClick={() => setShowConfirm((show) => !show)} edge="end">
                    {!showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row">
            <AnimateButton>
              <Button variant="outlined" size="large" onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </AnimateButton>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
