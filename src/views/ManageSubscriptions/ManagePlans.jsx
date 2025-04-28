import React, { useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// project imports
import { ThemeMode, ThemeDirection } from 'config';
import MainCard from 'ui-component/cards/MainCard';
import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'store/constant';

// assets
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import TwoWheelerTwoToneIcon from '@mui/icons-material/TwoWheelerTwoTone';
import AirportShuttleTwoToneIcon from '@mui/icons-material/AirportShuttleTwoTone';
import DirectionsBoatTwoToneIcon from '@mui/icons-material/DirectionsBoatTwoTone';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const plans = [
  {
    active: false,
    icon: <TwoWheelerTwoToneIcon fontSize="medium" color="inherit" />,
    title: 'Standard',
    description:
      'Create one end product for a client, transfer that end product to your client, charge them for your services. Not as Saas but the license can be transferred to the client.',
    price: 69,
    permission: [0, 1]
  },
  {
    active: true,
    icon: <AirportShuttleTwoToneIcon fontSize="medium" />,
    title: 'Standard Plus',
    description:
      'Create one end product for a client, transfer that end product to your client, transfer that end product to your client, charge them for your services. The license is then transferred to the client.',
    price: 129,
    permission: [0, 1, 2, 3]
  },
  {
    active: false,
    icon: <DirectionsBoatTwoToneIcon fontSize="medium" />,
    title: 'Enterprise',
    description:
      'You are licensed to use the CONTENT to create one end product for yourself or for one client (a "single application"), and the end product may be sold or distributed for free.',
    price: 599,
    permission: [0, 1, 2, 3, 5]
  },
  {
    active: false,
    icon: <DirectionsBoatTwoToneIcon fontSize="medium" />,
    title: 'Business Pro',
    description:
      'You are licensed to use the CONTENT to create one end product for yourself or for one client (a "single application"), and the end product may be sold or distributed for free.',
    price: 599,
    permission: [0, 1, 2, 3, 5]
  },
  {
    active: false,
    icon: <DirectionsBoatTwoToneIcon fontSize="medium" />,
    title: 'Startup',
    description:
      'You are licensed to use the CONTENT to create one end product for yourself or for one client (a "single application"), and the end product may be sold or distributed for free.',
    price: 599,
    permission: [0, 1, 2, 3, 5]
  },
  {
    active: false,
    icon: <DirectionsBoatTwoToneIcon fontSize="medium" />,
    title: 'Growth',
    description:
      'You are licensed to use the CONTENT to create one end product for yourself or for one client (a "single application"), and the end product may be sold or distributed for free.',
    price: 599,
    permission: [0, 1, 2, 3, 5]
  },
  {
    active: false,
    icon: <DirectionsBoatTwoToneIcon fontSize="medium" />,
    title: 'Ultimate',
    description:
      'You are licensed to use the CONTENT to create one end product for yourself or for one client (a "single application"), and the end product may be sold or distributed for free.',
    price: 599,
    permission: [0, 1, 2, 3, 5]
  }
];

const planList = [
  'One End Product', // 0
  'No attribution required', // 1
  'TypeScript', // 2
  'Figma Design Resources', // 3
  'Create Multiple Products', // 4
  'Create a SaaS Project', // 5
  'Resale Product', // 6
  'Separate sale of our UI Elements?' // 7
];

// ===============================|| PRICING - PRICE 1 ||=============================== //

export default function Price1() {
  const theme = useTheme();
  const { themeDirection } = useConfig();
  const priceListDisable = {
    opacity: '0.4',
    '& >div> svg': {
      fill: theme.palette.secondary.light
    }
  };

  // Billing type state
  const [billingType, setBillingType] = useState('annual'); // 'monthly' or 'annual'

  // Carousel state
  const [centerIndex, setCenterIndex] = useState(1); // Start with the second card centered
  const visibleCount = 3;
  const cardWidth = 420;
  const cardGap = 24;

  // Clamp centerIndex
  const minIndex = 1;
  const maxIndex = plans.length - 2;

  const handlePrev = () => {
    setCenterIndex((prev) => Math.max(minIndex, prev - 1));
  };
  const handleNext = () => {
    setCenterIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Helper to generate a random color for each card (consistent per render)
  function getRandomColor(index) {
    const colors = ['#cb1818', '#6B5B95', '#88B04B', '#9f1d95', '#1da390', '#955251', '#B565A7', '#009B77', '#DD4124', '#45B8AC'];
    return colors[index % colors.length];
  }

  // Only show three cards: center, left, right
  const getVisibleCards = () => {
    if (plans.length < 3) return plans;
    return plans.slice(centerIndex - 1, centerIndex + 2);
  };
  const visibleCards = getVisibleCards();

  // Example price calculation (replace with your real logic)
  const getPrice = (plan) => {
    if (billingType === 'monthly') {
      return Math.round(plan.price / 12);
    }
    return plan.price;
  };

  return (
    <Card sx={{ pt: 3, pb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pb: 0 }}>
        <Box>
          <Typography variant="h3" color="text.primary">
            Choose Your Subscription Plan
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Select the plan that best fits your business needs.
          </Typography>
        </Box>
        {/* Billing Switcher */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            bgcolor: '#eef2f6',
            borderRadius: 3,
            boxShadow: 0,
            alignItems: 'center',
            minWidth: 260,
            width: 320,
            height: 48,
            p: 0.5,
            overflow: 'hidden'
          }}
        >
          {/* Sliding Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              left: billingType === 'monthly' ? 6 : '50%',
              width: 'calc(50% - 6px)',
              height: 'calc(100% - 12px)',
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
              transition: 'left 0.3s cubic-bezier(.4,2,.6,1)',
              zIndex: 1
            }}
          />
          {/* Monthly Option */}
          <Box
            onClick={() => setBillingType('monthly')}
            sx={{
              flex: 1,
              zIndex: 2,
              position: 'relative',
              textAlign: 'center',
              py: 1.2,
              fontWeight: 500,
              color: billingType === 'monthly' ? 'primary.main' : 'text.primary',
              cursor: 'pointer',
              fontSize: 16,
              borderRadius: 2,
              transition: 'color 0.2s',
              userSelect: 'none'
            }}
          >
            Monthly
          </Box>
          {/* Annual Option */}
          <Box
            onClick={() => setBillingType('annual')}
            sx={{
              flex: 1,
              zIndex: 2,
              position: 'relative',
              textAlign: 'center',
              py: 1.2,
              fontWeight: 500,
              color: billingType === 'annual' ? 'primary.main' : 'text.primary',
              cursor: 'pointer',
              fontSize: 16,
              borderRadius: 2,
              transition: 'color 0.2s',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Annual
            <Box component="span" sx={{ color: 'success.dark', fontWeight: 400, fontSize: 14, ml: 1 }}>
              (Save 40%)
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Dots Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2}}>
        {plans.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => {
              // Clamp to minIndex and maxIndex
              if (idx >= minIndex && idx <= maxIndex) setCenterIndex(idx);
            }}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              mx: 0.75,
              backgroundColor: idx === centerIndex ? 'primary.main' : 'grey.400',
              transition: 'background 0.2s',
              border: idx === centerIndex ? '2px solid' : 'none',
              borderColor: idx === centerIndex ? 'primary.dark' : 'none',
              cursor: idx >= minIndex && idx <= maxIndex ? 'pointer' : 'default',
              opacity: idx >= minIndex && idx <= maxIndex ? 1 : 0.4,
              '&:hover': {
                boxShadow: idx >= minIndex && idx <= maxIndex ? 2 : 'none',
              }
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {/* Left Arrow */}
        <IconButton
          onClick={handlePrev}
          disabled={centerIndex === minIndex}
          sx={{
            p: 0,
            bgcolor: 'transparent',
            boxShadow: 'none',
            opacity: centerIndex === minIndex ? 0.4 : 0.9,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1,
              bgcolor: 'transparent',
            }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 28, color: 'primary.dark', transition: 'font-size 0.2s', '&:hover': { fontSize: 36 } }} />
        </IconButton>
        {/* Cards Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: `${cardGap}px`,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            py: 2,
          }}
        >
          {visibleCards.map((plan, idx) => {
            // idx: 0 (left), 1 (center), 2 (right)
            const planIndex = centerIndex - 1 + idx;
            const randomColor = getRandomColor(planIndex);
            let scale = 0.9;
            let zIndex = 1;
            if (idx === 1) {
              scale = 1;
              zIndex = 2;
            } // Center card zoomed
            return (
              <Box
                key={planIndex}
                sx={{
                  width: cardWidth,
                  flex: `0 0 ${cardWidth}px`,
                  transform: `scale(${scale})`,
                  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s',
                  zIndex,
                  boxShadow: idx === 1 ? theme.shadows[8] : theme.shadows[2],
                  border: idx === 1 ? `1px solid ${randomColor}` : 'none',
                  borderRadius: 2,
                  background: 'transparent',
                  position: 'relative',
                }}
              >
                {/* Current Plan Badge as Diagonal Strip */}
                {idx === 1 && plan.active && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 18,
                      right: -32,
                      zIndex: 10,
                      transform: 'rotate(45deg)',
                      bgcolor: 'success.dark',
                      color: '#fff',
                      px: 2.5,
                      py: 0.5,
                      fontWeight: 700,
                      fontSize: 13,
                      boxShadow: 3,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      minWidth: 80
                    }}
                  >
                    Current Plan
                  </Box>
                )}
                <MainCard
                  boxShadow
                  sx={{
                    pt: 1,
                    borderTop: `6px solid ${randomColor}`,
                    transition: 'box-shadow 0.3s, border 0.3s',
                    height: '100%',
                    '&:hover': {
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Grid container spacing={gridSpacing} sx={{ textAlign: 'center' }}>
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          width: 60,
                          height: 60,
                          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'primary.light',
                          color: 'primary.main',
                          '& > svg': {
                            width: 35,
                            height: 35
                          }
                        }}
                      >
                        {plan.icon}
                      </Box>
                    </Grid>
                    <Grid size={12}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '1.5625rem',
                          fontWeight: 500,
                          position: 'relative',
                          mb: 0.5,
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -10,
                            left: 'calc(50% - 25px)',
                            width: 50,
                            height: 4,
                            bgcolor: 'primary.main',
                            borderRadius: '3px'
                          }
                        }}
                      >
                        {plan.title}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body2">{plan.description}</Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '2.1875rem',
                          fontWeight: 700,
                          '& > span': {
                            fontSize: '1.25rem',
                            fontWeight: 500
                          }
                        }}
                      >
                        <sup>$</sup>
                        {getPrice(plan)}
                        <span>/ {billingType === 'monthly' ? 'Month ' : 'Year'} per user</span>
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <List
                        sx={{
                          m: 0,
                          p: 0,
                          '&> li': {
                            px: 0,
                            py: 0.625,
                            '& svg': {
                              fill: theme.palette.success.dark
                            }
                          }
                        }}
                        component="ul"
                      >
                        {planList.map((list, i) => (
                          <React.Fragment key={i}>
                            <ListItem sx={!plan.permission.includes(i) ? priceListDisable : {}}>
                              <ListItemIcon>
                                <CheckTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                              </ListItemIcon>
                              <ListItemText primary={list} />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List>
                    </Grid>
                    <Grid size={12}>
                      <Button variant="outlined" disabled={plan.active}>
                        {!plan.active ? 'Order Now' : 'Current Plan'}
                      </Button>
                    </Grid>
                  </Grid>
                </MainCard>
              </Box>
            );
          })}
        </Box>
        {/* Right Arrow */}
        <IconButton
          onClick={handleNext}
          disabled={centerIndex === maxIndex}
          sx={{
            p: 0,
            bgcolor: 'transparent',
            boxShadow: 'none',
            opacity: centerIndex === maxIndex ? 0.4 : 0.9,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1,
              bgcolor: 'transparent',
            }
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 28, color: 'primary.dark', transition: 'font-size 0.2s', '&:hover': { fontSize: 36 } }} />
        </IconButton>
      </Box>
    </Card>
  );
}
