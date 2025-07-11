import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import Factory from 'utils/Factory';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import OverviewCard from './InvoiceCards/OverviewCard';
import { Button, Stack, Typography, Box, CircularProgress } from '@mui/material';
import { IconSparkles, IconSettings2, IconReceipt, IconPlus } from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

/***************************  ANALYTICS - OVERVIEW  ***************************/

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoiceUsage, setInvoiceUsage] = useState({});
  const [invoicing_profile_data, setInvoicing_profile_data] = useState(null);
  const user = useSelector((state) => state.accountReducer.user);
  const invoiceId = import.meta.env.VITE_APP_INVOICE_ID;

  const getInvoiceUsage = async () => {
    const res = await Factory('get', `/user_management/usage-summary/${user.active_context.id}/?module_id=${invoiceId}`, {});
    if (res.res.status_cd === 0) {
      let response = res.res.data.data || [];
      let usage = {};
      usage.invoice_count = response.find((item) => item.feature_key === 'invoices_count') || {};
      usage.users_count = response.find((item) => item.feature_key === 'users_count') || {};
      usage.gstin = response.find((item) => item.feature_key === 'gstin') || {};
      setInvoiceUsage(usage);
    }
  };

  useEffect(() => {
    getInvoiceUsage();
  }, []);

  useEffect(() => {
    console.log(invoiceUsage);
  }, [invoiceUsage]);

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

  return !loading ? (
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
              variant="contained"
              size="small"
              onClick={() => {
                setType('add');
                navigate(`/app/invoice/generateInvoice`);
              }}
              startIcon={<IconPlus size={16} />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: (theme) => theme.customShadows.primary
              }}
            >
              New Invoice
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/app/invoice/settings?tabValue=0')}
              startIcon={<IconSettings2 size={18} />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Invoice Settings
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
      </MainCard>
    </Box>
  ) : (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
      <CircularProgress />
    </Stack>
  );
};

export default AnalyticsOverview;
