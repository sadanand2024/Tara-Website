import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import OtpInput from 'react18-input-otp';

// project imports
import { ThemeMode } from 'config';

// ============================|| JWT - CODE VERIFICATION ||============================ //

export default function AuthCodeVerification() {
  const theme = useTheme();
  const [otp, setOtp] = useState();
  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <OtpInput
          value={otp}
          onChange={(otpNumber) => setOtp(otpNumber)}
          numInputs={4}
          containerStyle={{ justifyContent: 'space-between' }}
          inputStyle={{
            width: '100%',
            margin: '8px',
            padding: '10px',
            border: `1px solid ${borderColor}`,
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
      </Grid>
      <Grid size={12}>
        <Button disableElevation fullWidth size="large" type="submit" variant="contained">
          Continue
        </Button>
      </Grid>
      <Grid size={12}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography>Did not receive the email? Check your spam filter, or</Typography>
          <Typography variant="body1" sx={{ minWidth: 85, ml: 2, textDecoration: 'none', cursor: 'pointer' }} color="primary">
            Resend code
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
