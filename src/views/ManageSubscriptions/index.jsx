import React from 'react';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import StarIcon from '@mui/icons-material/Star';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import ProductsAndServices from './ProductsAndServices';
import { useSelector } from 'react-redux';
import NoSubscriptionsIcon from '@mui/icons-material/WorkspacePremium';

const SubscriptionCard = ({ module, planName, price, expiry, trial }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8]
        },
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
        <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-start' }
            }}
          >
            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 600 }}>
              {planName}
            </Typography>
            {!trial ? (
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} color="primary.main" sx={{ fontWeight: 600 }}>
                  ₹ {price}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  per month
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} color="primary.main" sx={{ fontWeight: 600 }}>
                  TRIAL PLAN
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  &nbsp;
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'background.neutral',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                  display: 'inline-block'
                }}
              />
              {expiry}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              startIcon={<UpgradeIcon />}
              sx={{
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`
                }
              }}
            >
              Upgrade/Change Plan
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              sx={{
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.lighter'
                }
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
        onClick={() => navigate('/app/products-and-services')}
        sx={{
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&:hover': {
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`
          }
        }}
      >
        Browse Modules
      </Button>
    </Box>
  );
};

const ManageSubscriptions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const user = useSelector((state) => state).accountReducer.user;

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
            onClick={() => navigate('/app/products-and-services')}
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
            onClick={() => navigate('/app/products-and-services?tab=1')}
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
          <Button
            fullWidth={isMobile}
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate('/app/products-and-services')}
            sx={{
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.lighter'
              }
            }}
          >
            View Package/Suite
          </Button>
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
        {user.module_subscriptions && user.module_subscriptions.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {user.module_subscriptions.map((subscription, index) => (
              <Grid item xs={12} md={4} key={index}>
                <SubscriptionCard
                  module={subscription.module_name}
                  planName={subscription.plan_name}
                  price={subscription.price || '0'}
                  expiry={subscription.expiry}
                  trial={subscription.status === 'trial'}
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
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Actions</Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Act.</Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>05-Apr-2025</TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                    }}
                  >
                    PVT Ltd Reg
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={500}
                    sx={{
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                    }}
                  >
                    ₹ 9,999
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label="Receipt"
                    color="success.darker"
                    size="small"
                    sx={{
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      color: 'white',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} justifyContent="flex-end">
                    {isMobile ? (
                      <>
                        <IconButton
                          size="small"
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.lighter'
                            }
                          }}
                        >
                          <FileDownloadIcon fontSize="small" />
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
                      </>
                    ) : (
                      <>
                        <Button
                          size="small"
                          startIcon={<FileDownloadIcon />}
                          variant="outlined"
                          sx={{
                            borderColor: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              bgcolor: 'primary.lighter'
                            }
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ReceiptIcon />}
                          variant="outlined"
                          sx={{
                            borderColor: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              bgcolor: 'primary.lighter'
                            }
                          }}
                        >
                          Invoice
                        </Button>
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10-Apr-2025</TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Invoicing Module (Pay)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary.main" fontWeight={500}>
                    ₹ 2,999
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label="Receipt"
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
                    <Button
                      size="small"
                      startIcon={<FileDownloadIcon />}
                      variant="outlined"
                      sx={{
                        borderColor: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          bgcolor: 'primary.lighter'
                        }
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ReceiptIcon />}
                      variant="outlined"
                      sx={{
                        borderColor: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          bgcolor: 'primary.lighter'
                        }
                      }}
                    >
                      Invoice
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
};

export default ManageSubscriptions;
