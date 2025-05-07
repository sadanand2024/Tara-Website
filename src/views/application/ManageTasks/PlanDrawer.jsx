import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  Stack
} from '@mui/material';

// assets
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
// project imports
import { ThemeMode, ThemeDirection } from 'config';
import MainCard from 'ui-component/cards/MainCard';
import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'store/constant';
import Factory from 'utils/Factory';
import RazorpayPayment from '../../ManageSubscriptions/RazorpayPayment';
// assets
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import TwoWheelerTwoToneIcon from '@mui/icons-material/TwoWheelerTwoTone';
import AirportShuttleTwoToneIcon from '@mui/icons-material/AirportShuttleTwoTone';
import DirectionsBoatTwoToneIcon from '@mui/icons-material/DirectionsBoatTwoTone';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SvgIcon from '@mui/material/SvgIcon';
import IconArrowLeft from '@mui/icons-material/ArrowBack';

const PlanDrawer = ({ open, onClose, moduleId, type, selectedTask }) => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const { themeDirection } = useConfig();
  const [plans, setPlans] = useState([]);
  const user = useSelector((state) => state).accountReducer.user;
  const priceListDisable = {
    opacity: '0.4',
    '& >div> svg': {
      fill: theme.palette.secondary.light
    }
  };

  function capitalizeWords(str) {
    if (!str) return '';
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const getServicePricing = async () => {
    const res = await Factory('get', `/user_management/feature-services/${moduleId}/plans/`);
    if (res.res.status_cd === 0) {
      setPlans([...res.res.data]);
    }
  };
  useEffect(() => {
    if (moduleId) {
      getServicePricing();
    }
  }, [moduleId]);

  const ServicePlanCard = ({ plan }) => (
    <MainCard
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <MainCard.Header
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'secondary.main' }}>
                <BusinessCenterIcon fontSize="small" />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>
                {plan.name}
              </Typography>
            </Box>
            <Chip
              label={capitalizeWords(plan.plan_type)}
              color="info"
              variant="outlined"
              size="small"
              sx={{ textTransform: 'capitalize', fontWeight: 600 }}
            />
          </Stack>
        }
      />

      <MainCard.Content>
        <Stack direction="column" justifyContent="space-between" spacing={2} sx={{ p: 2, flexGrow: 1 }}>
          {/* Description with Tooltip */}
          <Tooltip title={plan.description} placement="top" arrow>
            <Typography
              variant="body1"
              color="text.primary"
              textAlign="center"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mt: 1,
                mb: 2,
                lineHeight: 1.6,
                minHeight: '3.2em' // Keeps all cards visually even (3 lines × 1.6 lineHeight)
              }}
            >
              {plan.description}
            </Typography>
          </Tooltip>

          {/* Price */}
          <Stack direction="row" alignItems="flex-end" justifyContent="center" spacing={1} sx={{ mb: 0 }}>
            <Typography variant="h3" color="secondary.main" fontWeight={700}>
              ₹{plan.amount}&nbsp;
              <Typography variant="caption" color="text.primary">
                One Time
              </Typography>
            </Typography>
          </Stack>

          <RazorpayPayment
            type="service"
            label="Purchase Now"
            status={'pending'}
            service_id={plan.service}
            contextId={user.active_context.id}
            userId={user.user.id}
            service_request_id={selectedTask?.id || ''}
            plan={plan}
            onSuccess={(response) => {
              console.log('Payment Success:', response);
            }}
            onFailure={() => {
              console.log('Payment Cancelled');
            }}
          />
        </Stack>
      </MainCard.Content>
    </MainCard>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', md: '60%', lg: '40%', xl: '35%' },
          bgcolor: 'background.default'
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <IconButton onClick={onClose}>
          <SvgIcon component={IconArrowLeft} color="primary" sx={{ cursor: 'pointer' }} />
        </IconButton>
        <Box sx={{ px: 0, pb: 0 }}>
          <Typography variant="h3" color="text.primary" textAlign="right">
            Choose Your Service Plan
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }} textAlign="right">
            Select the plan that best fits your business needs.
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ mt: 0 }} />
      {plans.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            No plans to display.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ p: 3 }}>
          {plans.map((plan) => (
            <Grid size={{ xs: 6, lg: 6, xl: 6 }} key={plan.id}>
              <ServicePlanCard
                plan={plan}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Drawer>
  );
};

PlanDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedTask: PropTypes.object,
  moduleId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default PlanDrawer;
