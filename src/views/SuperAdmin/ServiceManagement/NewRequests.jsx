import React, { useEffect } from 'react';

// material-ui
import MainCard from 'ui-component/cards/MainCard';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';
import Factory from 'utils/Factory';
import ServiceRequests from './ServiceTable';
import { useSelector } from 'store';
import { gridSpacing } from 'store/constant';

import { IconSearch } from '@tabler/icons-react';

export default function NewRequests() {
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state).accountReducer.user;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <MainCard
        title={
          <Grid container spacing={gridSpacing} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <Typography variant="h3" sx={{ p: 0 }}>
                Service Requests
              </Typography>
            </Grid>
            <Grid>
              <Stack direction="row" spacing={2}>
                {/* <Button variant="contained" startIcon={<AddIcon />} size="small">
                  Add Servies
                </Button>
                <Button variant="contained" startIcon={<AddIcon />} size="small">
                  Bulk Assign
                </Button> */}
                <OutlinedInput
                  id="input-search-list-style1"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconSearch stroke={1.5} size="16px" />
                    </InputAdornment>
                  }
                  size="small"
                />
              </Stack>
            </Grid>
          </Grid>
        }
        content={false}
      >
        <ServiceRequests searchQuery={searchQuery} assigned={false} setSearchQuery={setSearchQuery} />
      </MainCard>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
