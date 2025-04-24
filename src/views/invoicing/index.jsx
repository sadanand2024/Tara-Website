import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router';

import Factory from 'utils/Factory';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';

// @project
// import { useSnackbar } from '@/components/CustomSnackbar';
// import OverviewCard from './InvoiceCards/OverviewCard';
import { Button, Stack, Typography } from '@mui/material';
import { IconSparkles, IconSettings2 } from '@tabler/icons-react';
// import AddInvoice from './InvoicingComponent/AddInvoice';
// import useCurrentUser from '@/hooks/useCurrentUser';
import { CoPresentOutlined } from '@mui/icons-material';
// import Loader from '@/components/PageLoader';
// import HomeCard from '@/components/cards/HomeCard';
import MainCard from '../../ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';

/***************************  ANALYTICS - OVERVIEW  ***************************/

const AnalyticsOverview = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false); // State for loader

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const user = useSelector((state) => state).accountReducer.user;

  const invoice_settings_status_check = async () => {
    setLoading(true);
    let businessId = user.active_context.business_id;
    let url = `/invoicing/invoicing-profile-check/?business_id=${businessId}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0 && res.data.exists === false) {
      navigate('/app/invoice/settings');
    } else if (res.status_cd === 0 && res.data.exists === true) {
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
    <MainCard
      title=" Invoicing"
      secondary={
        <Stack direction="row" sx={{ gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              router.push(`${pathname}/settings`);
            }}
            startIcon={<IconSettings2 size={18} />}
          >
            Invoice Settings
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setType('add');
              // handleOpen();
              router.push(`${pathname}/generateInvoice`);
            }}
            startIcon={<IconSparkles size={16} />}
          >
            New Invoice
          </Button>
        </Stack>
      }
    >
      <MainCard>
        {loading ? (
          <h1>loading</h1>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={12}>
              {/* <OverviewCard
                businessId={user.active_context.business_id}
                open={open}
                onClose={handleClose}
                clientListData={clientListData || []}
                type={type}
                setType={setType}
                handleOpen={handleOpen}
              /> */}
            </Grid>
          </Grid>
        )}
      </MainCard>
    </MainCard>
  );
};
export default AnalyticsOverview;
