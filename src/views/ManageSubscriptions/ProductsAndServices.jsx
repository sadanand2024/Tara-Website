import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Stack,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExtensionIcon from '@mui/icons-material/Extension';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from 'react-redux';

const ProductCard = ({ title, description, price, activePlan, features, actions }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        boxShadow: (theme) => `0 2px 16px 0 ${theme.palette.grey[200]}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => `0 4px 24px 0 ${theme.palette.grey[300]}`
        }
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 2.5 }
        }}
      >
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1
            }}
          >
            <span>{title}</span>
            {activePlan ? (
              <Chip
                size="small"
                label={activePlan}
                color="success"
                icon={<CheckCircleIcon />}
                sx={{
                  height: 24,
                  '& .MuiChip-icon': { fontSize: 16 }
                }}
              />
            ) : (
              <Chip
                size="small"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CurrencyRupeeIcon sx={{ fontSize: '1rem' }} />
                    <span>{price}</span>
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        opacity: 0.8,
                        ml: 0.5
                      }}
                    >
                      /month
                    </Typography>
                  </Box>
                }
                color="primary"
                variant="outlined"
                sx={{
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              />
            )}
          </Typography>
          <Box
            sx={{
              bgcolor: 'background.neutral',
              borderRadius: 1,
              p: 1.5,
              mb: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.5,
                mb: 1
              }}
            >
              {description}
            </Typography>
            {features && features.length > 0 && (
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {features.map((feature, index) => (
                  <Typography key={index} component="li" variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {feature}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Stack
          spacing={1}
          sx={{
            mt: 'auto',
            '& .MuiButton-root': {
              py: 0.75
            }
          }}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.primary ? 'contained' : 'outlined'}
              size="small"
              startIcon={action.icon}
              fullWidth={isMobile}
              component={Link}
              href={`${window.location.pathname}/plans`}
              sx={
                action.primary
                  ? {
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`
                      }
                    }
                  : {
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.lighter'
                      }
                    }
              }
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const ProductsAndServices = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const user = useSelector((state) => state).accountReducer.user;

  useEffect(() => {
    console.log(user);
    const tab = searchParams.get('tab');
    if (tab) {
      setTabValue(parseInt(tab));
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const moduleCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'accounting', label: 'Accounting & Finance' },
    { value: 'compliance', label: 'Compliance & Tax' },
    { value: 'document', label: 'Document Management' }
  ];

  const serviceCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'registration', label: 'Business Registration' },
    { value: 'compliance', label: 'Compliance Services' },
    { value: 'consulting', label: 'Consulting Services' }
  ];

  const filterItems = (items) => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const modules = [
    {
      title: 'Invoicing Module',
      description: 'Streamline your billing process with our comprehensive invoicing solution.',
      features: [
        'GST-compliant invoice generation',
        'Multiple currency support',
        'Customizable invoice templates',
        'Automated recurring billing'
      ],
      price: '0',
      activePlan: 'Trial Active',
      category: 'accounting',
      actions: [
        { label: 'View Plans', icon: <VisibilityIcon />, primary: true },
        { label: 'Start Trial', icon: <ShoppingCartIcon /> },
        { label: 'Subscribe Now', icon: <UpgradeIcon /> }
      ]
    },
    {
      title: 'Payroll Module',
      description: 'Complete payroll management system for businesses of all sizes.',
      features: [
        'Automated salary calculations',
        'Tax deductions & compliance',
        'Employee self-service portal',
        'Leave management integration'
      ],
      price: '6,999',
      activePlan: 'Pro Plan',
      category: 'accounting',
      actions: [
        { label: 'View Plans', icon: <VisibilityIcon />, primary: true },
        { label: 'Upgrade Now', icon: <UpgradeIcon /> }
      ]
    },
    {
      title: 'PractOS',
      description: 'All-in-one practice management solution for professionals.',
      features: ['Client management', 'Task tracking & deadlines', 'Document management', 'Team collaboration tools'],
      price: '3,499',
      category: 'accounting',
      actions: [
        { label: 'View Plans', icon: <VisibilityIcon />, primary: true },
        { label: 'Start Trial', icon: <ShoppingCartIcon /> },
        { label: 'Subscribe Now', icon: <UpgradeIcon /> }
      ]
    },
    {
      title: 'DOC Wallet',
      description: 'Secure document storage and management system.',
      features: ['Digital document storage', 'Quick document retrieval', 'Access control & sharing', 'Document version control'],
      price: '0',
      activePlan: 'Trial Active',
      category: 'document',
      actions: [
        { label: 'View Plans', icon: <VisibilityIcon />, primary: true },
        { label: 'Upgrade Now', icon: <UpgradeIcon /> }
      ]
    }
  ];

  const services = [
    {
      title: 'Private Limited Company Registration',
      description: 'End-to-end company registration service with expert guidance.',
      features: ['Name availability check', 'ROC registration process', 'Digital signature certificates', 'Post-registration compliances'],
      price: '9,999',
      category: 'registration',
      actions: [
        { label: 'View Plans', icon: <VisibilityIcon />, primary: true },
        { label: 'Buy Now', icon: <ShoppingCartIcon /> }
      ]
    },
    {
      title: 'GST Registration',
      description: 'Hassle-free GST registration service with complete support.',
      features: ['Eligibility assessment', 'Document preparation', 'Application filing', 'Follow-up support'],
      price: '1,999',
      category: 'compliance',
      actions: [
        { label: 'View Plans', icon: <VisibilityIcon />, primary: true },
        { label: 'Buy Now', icon: <ShoppingCartIcon /> }
      ]
    }
  ];

  const filteredModules = filterItems(modules);
  const filteredServices = filterItems(services);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: (theme) => `0 0 24px 0 ${theme.palette.grey[200]}`,
        mb: 3,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.50' : 'grey.900')
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main'
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab
            icon={<ExtensionIcon />}
            label="Modules"
            iconPosition="start"
            sx={{
              gap: 1,
              '& .MuiTab-iconWrapper': {
                marginRight: '0 !important'
              }
            }}
          />
          <Tab
            icon={<BusinessCenterIcon />}
            label="Services"
            iconPosition="start"
            sx={{
              gap: 1,
              '& .MuiTab-iconWrapper': {
                marginRight: '0 !important'
              }
            }}
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <TextField
          placeholder={`Search ${tabValue === 0 ? 'modules' : 'services'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            flex: { sm: 1 },
            maxWidth: { sm: '400px' },
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'action.hover'
              },
              '& fieldset': {
                borderColor: 'divider'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />
        <TextField
          select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 220 },
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'action.hover'
              },
              '& fieldset': {
                borderColor: 'divider'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon color="action" />
              </InputAdornment>
            )
          }}
        >
          {(tabValue === 0 ? moduleCategories : serviceCategories).map((category) => (
            <MenuItem
              key={category.value}
              value={category.value}
              sx={{
                py: 1,
                '&:hover': {
                  bgcolor: 'primary.lighter'
                }
              }}
            >
              {category.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mt: 2, px: 2 }}>
        {tabValue === 0 ? (
          <>
            <Grid2 container spacing={{ xs: 2, sm: 1 }} disableEqualOverflow>
              {filteredModules.map((module, index) => (
                <Grid2
                  size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                  key={index}
                  sx={{
                    display: 'flex',
                    '& > *': { width: '100%' },
                    p: { xs: 1, sm: 1.5 }
                  }}
                >
                  <ProductCard {...module} />
                </Grid2>
              ))}
            </Grid2>
          </>
        ) : (
          <>
            <Grid2 container spacing={{ xs: 2, sm: 1 }} disableEqualOverflow>
              {filteredServices.map((service, index) => (
                <Grid2
                  size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                  key={index}
                  sx={{
                    display: 'flex',
                    '& > *': { width: '100%' },
                    p: { xs: 1, sm: 1.5 }
                  }}
                >
                  <ProductCard {...service} />
                </Grid2>
              ))}
            </Grid2>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProductsAndServices;
