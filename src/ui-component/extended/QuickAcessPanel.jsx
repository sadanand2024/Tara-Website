import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Box, Button, ClickAwayListener, Container, Grid2, Paper, Typography } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const quickAccess = [
  {
    title: 'Document Drafting',
    description: 'Easily create, edit, and manage legal and business documents with smart templates.',
    icon: <CreditCardIcon sx={{ fontSize: 30, color: '#FF6B6B' }} />,
    path: '/document-drafting',
    color: '#FF6B6B',
    id: 1,
    context_type: 'business',
    is_active: true
  }
];

const MotionPaper = motion.create(Paper);

const panelVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const QuickAccessCard = ({ item, onClose }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: 2.5,
      transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
      border: '1px solid',
      borderColor: 'divider',
      minHeight: 180,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      '&:hover': item.is_active
        ? {
            transform: 'scale(1.035)',
            boxShadow: '0 6px 24px 0 rgba(0,0,0,0.10)',
            borderColor: item.color,
            zIndex: 1
          }
        : {}
    }}
  >
    <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>{item.icon}</Box>
    <Typography variant="subtitle1" sx={{ mb: 0.25, fontWeight: 700, fontSize: 16, textAlign: 'center', width: '100%' }}>
      {item.title}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, flex: 1, fontSize: 13, textAlign: 'center', width: '100%' }}>
      {item.description}
    </Typography>
    {item.is_active ? (
      <Button
        component={RouterLink}
        to={item.path}
        onClick={onClose}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
        size="small"
        sx={{
          color: item.color,
          justifyContent: 'center',
          pl: 0,
          fontWeight: 500,
          fontSize: 13,
          minWidth: 0,
          textTransform: 'none',
          width: '100%',
          '&:hover': {
            bgcolor: 'transparent',
            '& .MuiSvgIcon-root': {
              transform: 'translateX(4px)'
            }
          },
          '& .MuiSvgIcon-root': {
            transition: 'transform 0.2s ease'
          }
        }}
      >
        Try Now
      </Button>
    ) : (
      <Typography
        variant="body2"
        sx={{
          color: 'text.disabled',
          fontWeight: 500,
          fontSize: 13,
          textAlign: 'center',
          mt: 1
        }}
      >
        Coming Soon
      </Typography>
    )}
  </Paper>
);

QuickAccessCard.propTypes = {
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

const QuickAccessPanel = ({ onClose }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });
  const getBackgroundColor = () => {
    if (trigger) return '#FFFFFF';
    return pathname === '/' ? 'linear-gradient(to left, #9DB0FF 0%, #F0F3FF 50%, #FFFFFF 100%)' : '#FFFFFF';
  };
  return (
    <AnimatePresence>
      <ClickAwayListener onClickAway={onClose}>
        <MotionPaper
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          sx={{
            position: 'absolute',
            maxHeight: '80vh',
            overflowY: 'auto',
            top: '100%',
            left: 0,
            width: '100vw',
            zIndex: 1100,
            backgroundImage: trigger ? 'none' : getBackgroundColor(),
            backgroundColor: trigger ? '#FFFFFF' : pathname === '/' ? 'transparent' : '#FFFFFF',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            px: { xs: 2, sm: 4, md: 10 },
            py: { xs: 3, sm: 5 },
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0 8px 12px -4px rgba(0, 0, 0, 0.45)'
          }}
        >
          <Container maxWidth="lg">
            <Grid2 container spacing={2} sx={{ px: { xs: 1, sm: 0 } }}>
              {quickAccess.map((item, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                  <QuickAccessCard item={item} onClose={onClose} />
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </MotionPaper>
      </ClickAwayListener>
    </AnimatePresence>
  );
};

QuickAccessPanel.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default QuickAccessPanel;
