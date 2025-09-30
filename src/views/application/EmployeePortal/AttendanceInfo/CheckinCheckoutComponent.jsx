import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { IconClock, IconCheck, IconX, IconAlertTriangle, IconMapPin } from '@tabler/icons-react';

const CheckinCheckoutComponent = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1.5px solid #E5EAF2`,
        boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        p: 2.5,
        background: 'linear-gradient(135deg, #E8F5FF 0%, #fff 100%)',
        '&:hover': {
          boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
          borderColor: '#3498db',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, color: '#0A1F44', textAlign: 'center' }}>
        Checked In
      </Typography>

      {/* Timer Display */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 50,
              height: 40,
              backgroundColor: '#fff',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #E5EAF2'
            }}
          >
            <Typography variant="h4" sx={{ color: '#3498db' }}>
              07
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#3498db', mt: 0.5, fontWeight: 600 }}>
            H
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 50,
              height: 40,
              backgroundColor: '#fff',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #E5EAF2'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#3498db' }}>
              48
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#3498db', mt: 0.5, fontWeight: 600 }}>
            M
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 50,
              height: 40,
              backgroundColor: '#fff',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #E5EAF2'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#3498db' }}>
              36
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#3498db', mt: 0.5, fontWeight: 600 }}>
            S
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
        Checked in: 9:00 AM
      </Typography>

      <Button variant="contained" color="error" fullWidth>
        Check Out
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          This Week
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0A1F44' }}>
          158 hr
        </Typography>
      </Box>
    </Paper>
  );
};

export default CheckinCheckoutComponent;
