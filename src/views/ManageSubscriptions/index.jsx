import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
  CircularProgress
} from '@mui/material';

// icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorageIcon from '@mui/icons-material/Storage';
import { get } from 'lodash-es';
import Factory from 'utils/Factory';

const getModuleIcon = (moduleId) => {
  switch (moduleId) {
    case 1:
      return <GroupsIcon fontSize="large" />;
    case 2:
      return <ReceiptIcon fontSize="large" />;
    default:
      return <BusinessIcon fontSize="large" />;
  }
};

const formatFeatureValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return value.toString().replace(/_/g, ' ');
};

export default function ManageSubscriptions() {
  const theme = useTheme();
  const [currentPlan] = React.useState(1);
  const [subscriptionPlans, setSubscriptionPlans] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const getSubscriptionPlans = async () => {
      try {
        setIsLoading(true);
        const response = await Factory('get', '/user_management/subscription-plans/list', {}, {});
        console.log(response);
        // setSubscriptionPlans(response.data || []);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getSubscriptionPlans();
  }, []);

  const renderFeaturesList = (features_enabled) => {
    if (!features_enabled) return [];

    const mainFeatures = Object.entries(features_enabled)
      .filter(([key]) => !['features', 'add_ons'].includes(key))
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value: formatFeatureValue(value)
      }));

    const additionalFeatures = Object.entries(features_enabled.features || {}).map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: formatFeatureValue(value)
    }));

    return [...mainFeatures, ...additionalFeatures];
  };

  const getCurrentPlan = () => {
    return subscriptionPlans.find((plan) => plan.id === currentPlan) || null;
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Current Plan Section */}
      {getCurrentPlan() && (
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.background.paper} 100%)`,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            boxShadow: theme.customShadows.z1
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getModuleIcon(getCurrentPlan().module)}
                    <Typography
                      variant="h3"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600
                      }}
                    >
                      {getCurrentPlan().name}
                    </Typography>
                    <Chip
                      label={getCurrentPlan().plan_type.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.primary.lighter,
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        borderRadius: '16px'
                      }}
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {getCurrentPlan().description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      sx={{
                        borderRadius: '16px',
                        '& .MuiChip-label': { px: 2 }
                      }}
                    />
                    <Chip
                      label={`${getCurrentPlan().billing_cycle_days} Days Billing Cycle`}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.info.lighter,
                        color: theme.palette.info.main,
                        borderRadius: '16px',
                        '& .MuiChip-label': { px: 2 }
                      }}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                  <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography
                      variant="h3"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        mb: 0.5
                      }}
                    >
                      ₹{getCurrentPlan().base_price}
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{
                          ml: 0.5,
                          color: 'text.secondary',
                          fontWeight: 400
                        }}
                      >
                        /{getCurrentPlan().billing_cycle_days} days
                      </Typography>
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      borderRadius: '8px',
                      '&:hover': {
                        bgcolor: theme.palette.error.lighter
                      }
                    }}
                  >
                    Cancel Subscription
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Available Plans Section */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Available Plans
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {subscriptionPlans.length > 0 ? (
            subscriptionPlans.map((plan) => (
              <Grid item xs={12} md={6} key={plan.id}>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 600,
                    position: 'relative',
                    borderTop: `4px solid ${theme.palette[plan.module === 1 ? 'primary' : 'secondary'].main}`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      {getModuleIcon(plan.module)}
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="h4">{plan.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {plan.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="h3" sx={{ mb: 2, color: 'primary.main' }}>
                      ₹{plan.base_price}
                      <Typography variant="body1" component="span" color="text.secondary">
                        /{plan.billing_cycle_days} days
                      </Typography>
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                      <Grid container spacing={2}>
                        {renderFeaturesList(plan.features_enabled).map((feature, index) => (
                          <Grid item xs={6} key={index}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                mb: 1
                              }}
                            >
                              <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.3 }} />
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    lineHeight: 1.2
                                  }}
                                >
                                  {feature.name}
                                </Typography>
                                {feature.value !== 'Yes' && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {feature.value}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <Box sx={{ pt: 2, mt: 'auto' }}>
                      <Button
                        fullWidth
                        variant={plan.id === currentPlan ? 'outlined' : 'contained'}
                        color={plan.module === 1 ? 'primary' : 'secondary'}
                        disabled={plan.id === currentPlan}
                      >
                        {plan.id === currentPlan ? 'Current Plan' : 'Select Plan'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No subscription plans available
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
