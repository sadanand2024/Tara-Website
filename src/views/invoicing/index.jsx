import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import Factory from 'utils/Factory';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import OverviewCard from './InvoiceCards/OverviewCard';
import { Button, Stack, Typography, Box, Skeleton } from '@mui/material';
import { IconSparkles, IconSettings2, IconReceipt } from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

/***************************  ANALYTICS - OVERVIEW  ***************************/

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoicing_profile_data, setInvoicing_profile_data] = useState(null);
  const user = useSelector((state) => state.accountReducer.user);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const invoice_settings_status_check = async () => {
    setLoading(true);
    let businessId = user.active_context.business_id;
    let url = `/invoicing/invoicing-profile-check/?business_id=${businessId}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0 && res.data.exists === false) {
      navigate('/app/invoice/settings');
    } else if (res.status_cd === 0 && res.data.exists === true) {
      setInvoicing_profile_data(res.data);
      return;
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data.error) || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  useEffect(() => {
    invoice_settings_status_check();
  }, [user]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        p: 0
      }}
    >
      <MainCard
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconReceipt size={24} />
            <Typography variant="h3">Invoicing Dashboard</Typography>
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/app/invoice/settings')}
              startIcon={<IconSettings2 size={18} />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Invoice Settings
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setType('add');
                navigate(`/app/invoice/generateInvoice`);
              }}
              startIcon={<IconSparkles size={16} />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: (theme) => theme.customShadows.primary
              }}
            >
              New Invoice
            </Button>
          </Stack>
        }
        sx={{
          borderRadius: 0,
          boxShadow: (theme) => theme.customShadows.z1,
          height: '100%',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {loading ? (
          <Box sx={{ p: 3, flex: 1 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 1 }, flex: 1 }}>
            <OverviewCard
              businessId={user.active_context.business_id}
              invoicing_profile_data={invoicing_profile_data}
              open={open}
              onClose={handleClose}
              type={type}
              setType={setType}
              handleOpen={handleOpen}
            />
          </Box>
        )}
      </MainCard>
    </Box>
  );
};

export default AnalyticsOverview;
