import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  Divider
} from '@mui/material';

const BusinessProfile = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Business Profile</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2 }}>Basic Information</Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Business Name"
                  defaultValue="AQUA TECH SOLUTIONS PVT LTD"
                />
                <TextField
                  fullWidth
                  label="Business Type"
                  defaultValue="Private Limited Company"
                />
                <TextField
                  fullWidth
                  label="Date of Incorporation"
                  type="date"
                  defaultValue="2024-01-01"
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="CIN Number"
                  defaultValue="U12345KA2024PTC123456"
                />
                <TextField
                  fullWidth
                  label="Registered Office Address"
                  multiline
                  rows={4}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2, mt: 3 }}>Contact Information</Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Business Email"
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Business Phone"
                  type="tel"
                />
                <TextField
                  fullWidth
                  label="Website"
                  type="url"
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Alternate Email"
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Alternate Phone"
                  type="tel"
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button variant="contained">
                  Save Changes
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BusinessProfile; 