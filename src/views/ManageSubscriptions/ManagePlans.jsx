import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Factory from 'utils/Factory';
import RazorparPayment from './RazorparPayment';
// assets
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import TwoWheelerTwoToneIcon from '@mui/icons-material/TwoWheelerTwoTone';
import AirportShuttleTwoToneIcon from '@mui/icons-material/AirportShuttleTwoTone';
import DirectionsBoatTwoToneIcon from '@mui/icons-material/DirectionsBoatTwoTone';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

const planIcons = [
  <TwoWheelerTwoToneIcon fontSize="medium" color="inherit" />,
  <AirportShuttleTwoToneIcon fontSize="medium" />,
  <DirectionsBoatTwoToneIcon fontSize="medium" />
  // ...add more icons if you want
];

// ===============================|| PRICING - PRICE 1 ||=============================== //

export default function Price1() {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('id');
  const { themeDirection } = useConfig();
  const [plans, setPlans] = useState([]);
  const [centerIndex, setCenterIndex] = useState(1);
  const user = useSelector((state) => state).accountReducer.user;
  const priceListDisable = {
    opacity: '0.4',
    '& >div> svg': {
      fill: theme.palette.secondary.light
    }
  };

  // Billing type state
  const [billingType, setBillingType] = useState('annual'); // 'monthly' or 'annual'

  // Carousel state
  const visibleCount = 3;
  const cardWidth = 420;
  const cardGap = 24;

  const filteredPlans = plans.filter(
    (plan) =>
      plan.plan_type === 'trial' ||
      (billingType === 'monthly' && plan.plan_type === 'monthly') ||
      (billingType === 'annual' && plan.plan_type === 'annually')
  );

  const minIndex = 1;
  const maxIndex = filteredPlans.length - 2;

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
    if (filteredPlans.length < 3) return filteredPlans;
    return filteredPlans.slice(centerIndex - 1, centerIndex + 2);
  };
  const visibleCards = getVisibleCards();

  // Example price calculation (replace with your real logic)
  const getPrice = (plan) => {
    if (billingType === 'monthly') {
      return Math.round(plan.base_price / 12);
    }
    return plan.base_price;
  };

  // Helper to get a random icon for each plan
  const getPlanIcon = (idx) => planIcons[idx % planIcons.length];

  function capitalizeWords(str) {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  useEffect(() => {
    if (moduleId) {
      const getModulePricing = async () => {
        const res = await Factory('get', `/user_management/subscription-plans/list/?is_active=yes&module_id=${moduleId}`);
        if (res.res.status_cd === 0) {
          setPlans(res.res.data.data);
        }
      };
      getModulePricing();
    }
  }, [moduleId]);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        {filteredPlans.map((_, idx) => (
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
                boxShadow: idx >= minIndex && idx <= maxIndex ? 2 : 'none'
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
              bgcolor: 'transparent'
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
            py: 2
          }}
        >
          {visibleCards.map((plan, idx) => {
            const planIndex = centerIndex - 1 + idx;
            let scale = 0.9;
            let zIndex = 1;
            if (idx === 1) {
              scale = 1;
              zIndex = 2;
            }
        return (
              <Box
                key={plan.id}
                sx={{
                  width: cardWidth,
                  flex: `0 0 ${cardWidth}px`,
                  transform: `scale(${scale})`,
                  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s',
                  zIndex,
                  boxShadow: idx === 1 ? theme.shadows[8] : theme.shadows[2],
                  border: idx === 1 ? `1px solid ${getRandomColor(planIndex)}` : 'none',
                  borderRadius: 2,
                  background: 'transparent',
                  position: 'relative'
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
                    borderTop: `6px solid ${getRandomColor(planIndex)}`,
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
                        {getPlanIcon(planIndex)}
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
                        {plan.name}
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
                        <sup>₹</sup>
                        {plan.plan_type === 'annually' ? (
                          <>
                            {plan.base_price}
                            <span>/ Year</span>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              (₹{(parseFloat(plan.base_price) / 12).toFixed(2)} / Month)
                            </Typography>
                          </>
                        ) : (
                          <>
                            {plan.base_price}
                            <span>/ {plan.plan_type === 'monthly' ? 'Month' : 'Trial'}</span>
                          </>
                        )}
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
                        {Object.entries(plan.features_enabled || {}).map(([key, value]) => {
                          if (key === 'features' && typeof value === 'object') {
                            // Nested features
                            return Object.entries(value).map(([subKey, subValue], idx) => (
                              <React.Fragment key={subKey}>
                                <ListItem>
                                  <ListItemIcon>
                                    {typeof subValue === 'boolean' ? (
                                      subValue ? (
                                        <CheckTwoToneIcon color="success" sx={{ fontSize: '1.3rem' }} />
                                      ) : (
                                        <CloseIcon
                                          color="inherit"
                                          sx={{ fontSize: '1.3rem', color: `${theme.palette.error.main} !important` }}
                                        />
                                      )
                                    ) : (
                                      <CheckTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      typeof subValue === 'boolean' ? (
                                        <span style={{ fontWeight: 600 }}>{capitalizeWords(subKey)}</span>
                                      ) : (
                                        <>
                                          <span style={{ fontWeight: 600 }}>{capitalizeWords(subKey)}</span>
                                          {`: ${Array.isArray(subValue) ? subValue.join(', ') : subValue.toString()}`}
                                        </>
                                      )
                                    }
                                    primaryTypographyProps={{ color: theme.palette.text.primary }}
                                  />
                                </ListItem>
                                <Divider />
                              </React.Fragment>
                            ));
                          } else if (typeof value === 'object') {
                            // Add-ons or other nested objects, skip or handle as needed
                            return null;
                          } else {
                            return (
                              <React.Fragment key={key}>
                                <ListItem>
                          <ListItemIcon>
                                    {typeof value === 'boolean' ? (
                                      value ? (
                                        <CheckTwoToneIcon color="success" sx={{ fontSize: '1.3rem' }} />
                                      ) : (
                                        <CloseIcon
                                          color="inherit"
                                          sx={{ fontSize: '1.3rem', color: `${theme.palette.error.main} !important` }}
                                        />
                                      )
                                    ) : (
                            <CheckTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    )}
                          </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      typeof value === 'boolean' ? (
                                        <span style={{ fontWeight: 600 }}>{capitalizeWords(key)}</span>
                                      ) : (
                                        <>
                                          <span style={{ fontWeight: 600 }}>{capitalizeWords(key)}</span>
                                          {`: ${value}`}
                                        </>
                                      )
                                    }
                                  />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                            );
                          }
                        })}
                  </List>
                </Grid>
                <Grid size={12}>
                      <RazorparPayment
                        contextId={user.active_context.id}
                        userId={user.user.id}
                        plan={plan}
                        onSuccess={(response) => {
                          // Handle success (show snackbar, update UI, etc.)
                          console.log('Payment Success:', response);
                        }}
                        onFailure={() => {
                          // Handle failure/cancel
                          console.log('Payment Cancelled');
                        }}
                      />
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
              bgcolor: 'transparent'
            }
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 28, color: 'primary.dark', transition: 'font-size 0.2s', '&:hover': { fontSize: 36 } }} />
        </IconButton>
      </Box>
    </Card>
  );
}
