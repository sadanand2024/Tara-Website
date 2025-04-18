import React, { useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CancelIcon from '@mui/icons-material/Cancel';
// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'store/constant';

// assets
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { Container } from '@mui/material';

// ===============================|| PRICING - REUSABLE COMPONENT ||=============================== //

export default function PricingComponent({ plans, planList }) {
  const theme = useTheme();
  const { themeDirection } = useConfig();
  const priceListDisable = {
    opacity: '0.4',
    '& >div> svg': {
      fill: theme.palette.secondary.light
    }
  };

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);
  const [expandedPlans, setExpandedPlans] = useState(plans.map(() => false));

  const toggleExpanded = (index) => {
    setExpandedPlans((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const SectionCard = ({ plan, index, isSelected, visibleItems, expanded }) => (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: isSelected ? alpha(theme.palette.primary.light, 0.15) : 'white',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : alpha(theme.palette.grey[300], 0.5),
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
        }
      }}
      onClick={() => setSelectedPlanIndex(index)}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>{plan.icon}</Box>
      <Typography variant="h3" fontWeight={700} gutterBottom textAlign="center">
        {plan.title}
      </Typography>
      <Typography variant="h2" color="primary" fontWeight={600} gutterBottom textAlign="center">
        ₹{plan.price}{' '}
        <Typography component="span" variant="body1">
          / Lifetime
        </Typography>
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={1}>
        {visibleItems.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: plan.permission.includes(idx) ? 'text.primary' : 'error.main'
            }}
          >
            {plan.permission.includes(idx) ? (
              <CheckTwoToneIcon sx={{ fontSize: 22, color: '#673AB7' }} />
            ) : (
              <CancelIcon sx={{ fontSize: 22, color: 'error.main' }} />
            )}
            <Typography variant="subtitle1">{item}</Typography>
          </Box>
        ))}
      </Stack>

      {/* {planList.length > 5 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(index);
            }}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </Box>
      )} */}

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant={isSelected ? 'contained' : 'outlined'}
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPlanIndex(index);
          }}
        >
          {isSelected ? 'Selected' : 'Get Started'}
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Container sx={{ py: 2 }}>
      <Grid container spacing={gridSpacing} justifyContent="center">
        {plans.map((plan, index) => {
          const isSelected = selectedPlanIndex === index;
          const expanded = expandedPlans[index];
          // const visibleItems = expanded ? planList : planList.slice(0, 5);

          return (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <SectionCard plan={plan} index={index} isSelected={isSelected} visibleItems={planList} expanded={expanded} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
