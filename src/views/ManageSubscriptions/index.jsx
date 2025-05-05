import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import StarIcon from '@mui/icons-material/Star';
import { Avatar, Chip } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AutorenewIcon from '@mui/icons-material/Autorenew';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Paper
} from '@mui/material';

// icons
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useSelector } from 'react-redux';
import NoSubscriptionsIcon from '@mui/icons-material/WorkspacePremium';
import Factory from '../../utils/Factory';

const getStatusColor = (status) => {
  if (status === 'active') return 'success';
  if (status === 'trial') return 'warning';
  return 'error';
};

const SubscriptionCard = ({ module, planName, price, expiry, trial, status, autoRenew, description }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        transition: 'all 0.3s',
        overflow: 'visible',
        boxShadow: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: 8,
          transform: 'translateY(-4px) scale(1.02)'
        }
      }}
    >
      {/* Status Chip at top right */}
      <Chip
        label={status === 'trial' ? 'Trial' : status.charAt(0).toUpperCase() + status.slice(1)}
        color={getStatusColor(status)}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontWeight: 600,
          zIndex: 2
        }}
      />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <PaymentIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {planName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {module}
              </Typography>
              {/* Description below module name */}
              {description && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {description}
                </Typography>
              )}
            </Box>
          </Stack>
          {/* Valid till and pricing on the same line */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Chip
              label={`Valid till: ${expiry}`}
              color={status === 'active' ? 'success' : status === 'trial' ? 'warning' : 'error'}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'grey.100',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                minWidth: 90,
                justifyContent: 'center',
                fontWeight: 600
              }}
            > */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'secondary.light',
                color: 'secondary.main',
                borderRadius: 8,
                minWidth: 90,
                justifyContent: 'center',
                fontWeight: 500
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'secondary.main', mr: 0.5 }}>
                ₹{price}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 400, color: 'secondary.main' }}>
                / Month
              </Typography>
              {autoRenew === 'yes' && (
                <Chip
                  icon={<AutorenewIcon fontSize="small" />}
                  label="Auto-renew"
                  color="info"
                  size="small"
                  sx={{ ml: 1, height: 22, fontSize: '0.75rem', fontWeight: 500 }}
                />
              )}
              {/* </Box> */}
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row', justifyContent: 'space-between' }} spacing={1}>
            <Button
              variant="contained"
              size="small"
              fullWidth={isMobile}
              startIcon={<UpgradeIcon />}
              sx={{
                fontWeight: 600,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
              }}
            >
              Upgrade/Change Plan
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth={isMobile}
              startIcon={<VisibilityIcon />}
              sx={{
                fontWeight: 600,
                borderColor: 'primary.main'
              }}
            >
              View Usage
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const EmptySubscriptions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider'
      }}
    >
      <NoSubscriptionsIcon
        sx={{
          fontSize: 72,
          color: 'primary.main',
          opacity: 0.3,
          mb: 2
        }}
      />
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom sx={{ fontWeight: 600 }}>
        No Active Subscriptions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 480, mx: 'auto' }}>
        You don't have any active subscriptions yet. Explore our modules and services to find the perfect solution for your business needs.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/app/subscriptions/modules-and-services')}
        sx={{
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&:hover': {
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`
          }
        }}
      >
        Browse Modules & Services
      </Button>
    </Box>
  );
};

const ManageSubscriptions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [moduleSubscriptions, setModuleSubscriptions] = useState([]);
  const [servicesPurchased, setServicesPurchased] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state).accountReducer.user;

  useEffect(() => {
    const getPaymentHistory = async () => {
      const response = await Factory('get', `/user_management/payment-history?context_id=${user.active_context.id}`);
      console.log(response.res.data);
      if (response.res.status_cd === 0) {
        setPaymentHistory([...response.res.data.module_payments, ...response.res.data.service_payments]);
      }
    };
    getPaymentHistory();

    const getModuleSubscriptions = async () => {
      const response = await Factory('get', `/user_management/context-subscriptions/${user.active_context.id}/`);
      if (response.res.status_cd === 0) {
        setModuleSubscriptions(response.res.data.subscriptions);
      }
    };
    getModuleSubscriptions();

    const getServicesPurchased = async () => {
      const response = await Factory('get', `/user_management/context-service-requests/${user.active_context.id}/`);
      if (response.res.status_cd === 0) {
        setServicesPurchased(response.res.data);
      }
    };
    getServicesPurchased();
  }, [user.active_context]);

  return (
    <Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          pb: 2,
          borderBottom: '2px solid',
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant={isMobile ? 'h3' : 'h2'} color="secondary" sx={{ mb: 0.5 }}>
            My Subscriptions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your subscriptions and services
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/app/subscriptions/modules-and-services')}
            sx={{
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`
              }
            }}
          >
            Add Module
          </Button>
          <Button
            fullWidth={isMobile}
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            onClick={() => navigate('/app/subscriptions/modules-and-services?tab=1')}
            sx={{
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.lighter'
              }
            }}
          >
            Buy a Service
          </Button>
          {/* <Button
            fullWidth={isMobile}
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate('/app/subscriptions/modules-and-services')}
            sx={{
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.lighter'
              }
            }}
          >
            View Package/Suite
          </Button> */}
        </Stack>
      </Box>

      {/* Active Subscriptions */}
      <Box>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            mb: { xs: 2, sm: 3 },
            fontWeight: 600,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 40,
              height: 3,
              bgcolor: 'primary.main',
              borderRadius: 1
            }
          }}
        >
          Active Subscriptions
        </Typography>
        {moduleSubscriptions && moduleSubscriptions.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {moduleSubscriptions.map((subscription) => (
              <Grid item xs={12} md={4} lg={3} key={subscription.id}>
                <SubscriptionCard
                  module={subscription.module.name}
                  planName={subscription.plan.name}
                  price={subscription.plan.price}
                  expiry={subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : ''}
                  trial={subscription.status === 'trial'}
                  status={subscription.status}
                  autoRenew={subscription.auto_renew}
                  description={subscription.plan.description || subscription.module.description}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptySubscriptions />
        )}
      </Box>

      {/* Services Purchased */}
      <Box sx={{ overflow: 'auto' }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            mb: { xs: 2, sm: 3 },
            // color: 'primary.main',
            fontWeight: 600,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 40,
              height: 3,
              bgcolor: 'primary.main',
              borderRadius: 1
            }
          }}
        >
          Services Purchased
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 2,
            minWidth: { xs: 'max-content', md: '100%' },
            '& .MuiTableCell-head': {
              bgcolor: 'grey.50',
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              p: { xs: 1.5, sm: 2 }
            },
            '& .MuiTableCell-body': {
              p: { xs: 1.5, sm: 2 },
              whiteSpace: 'nowrap'
            },
            '& .MuiTableRow-root:hover': {
              bgcolor: 'primary.lighter'
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Private Limited Company Reg.</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary.main" fontWeight={500}>
                    ₹ 9,999
                  </Typography>
                </TableCell>
                <TableCell>14/Apr</TableCell>
                <TableCell>
                  <Chip
                    label="Completed"
                    color="success.darker"
                    size="small"
                    sx={{
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.lighter'
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.lighter'
                        }
                      }}
                    >
                      <ReceiptIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">MSME Registration</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary.main" fontWeight={500}>
                    ₹ 9,999
                  </Typography>
                </TableCell>
                <TableCell>14/Apr</TableCell>
                <TableCell>
                  <Chip
                    label="Completed"
                    color="success.darker"
                    size="small"
                    sx={{
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.lighter'
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.lighter'
                        }
                      }}
                    >
                      <ReceiptIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Payment History */}
      <Box sx={{ overflow: 'auto' }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            mb: { xs: 2, sm: 3 },
            // color: 'primary.main',
            fontWeight: 600,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 40,
              height: 3,
              bgcolor: 'primary.main',
              borderRadius: 1
            }
          }}
        >
          Payment History
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 2,
            minWidth: { xs: 'max-content', md: '100%' },
            '& .MuiTableCell-head': {
              bgcolor: 'grey.50',
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              p: { xs: 1.5, sm: 2 }
            },
            '& .MuiTableCell-body': {
              p: { xs: 1.5, sm: 2 },
              whiteSpace: 'nowrap'
            },
            '& .MuiTableRow-root:hover': {
              bgcolor: 'primary.lighter'
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Payment ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{payment.plan_name || payment.suite_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary.main" fontWeight={500}>
                      ₹ {payment.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status === 'paid' && payment.payment_captured ? 'Paid' : 'Failed'}
                      color={payment.status === 'paid' && payment.payment_captured ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.payment_method ? payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1) : ''}
                      {payment.card_last4 ? ` ••••${payment.card_last4}` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {payment.razorpay_order_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {payment.razorpay_payment_id}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
};

export default ManageSubscriptions;
