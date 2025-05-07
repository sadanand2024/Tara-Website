import React from 'react';
import { Box, Typography, Grid2, Paper, ClickAwayListener, Container, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// Import icons
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FolderIcon from '@mui/icons-material/Folder';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const products = [
  {
    title: 'Payroll',
    description: 'Automated payroll with TDS, EPF/ESI, payslips & more.',
    icon: <CreditCardIcon sx={{ fontSize: 30, color: '#FF6B6B' }} />,
    path: '/products/payroll',
    color: '#FF6B6B',
    id: 1,
    context_type: 'business',
    is_active: true
  },
  {
    title: 'Invoice',
    description: 'Smart invoicing with GST, reminders, and online payments.',
    icon: <ReceiptIcon sx={{ fontSize: 30, color: '#4D96FF' }} />,
    path: '/products/invoice',
    color: '#4D96FF',
    id: 2,
    context_type: 'business',
    is_active: true
  },
  {
    title: 'Accounting',
    description: 'Track income, expenses, and manage books easily.',
    icon: <AccountBalanceIcon sx={{ fontSize: 30, color: '#00C9A7' }} />,
    path: '/products/accounting',
    color: '#00C9A7',
    id: 3,
    context_type: 'business',
    is_active: false
  },
  {
    title: 'Document Vault',
    description: 'Securely store and access all your financial documents.',
    icon: <FolderIcon sx={{ fontSize: 30, color: '#FFA94D' }} />,
    path: '/products/document-vault',
    color: '#FFA94D',
    id: 4,
    context_type: 'business',
    is_active: false
  },
  {
    title: 'Compliance Tracker',
    description: 'Auto reminders and status for ITR, GST, and ROC filings.',
    icon: <VerifiedUserIcon sx={{ fontSize: 30, color: '#845EF7' }} />,
    path: '/products/compliance-tracker',
    color: '#845EF7',
    id: 5,
    context_type: 'business',
    is_active: false
  },
  {
    title: 'Tax Calculators',
    description: 'Calculate tax liability, HRA, capital gains & more.',
    icon: <CalculateIcon sx={{ fontSize: 30, color: '#2EB67D' }} />,
    path: '/products/tax-calculators',
    color: '#2EB67D',
    id: 6,
    context_type: 'business',
    is_active: false
  }
];

const MotionPaper = motion(Paper);

const panelVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const ProductCard = ({ product, onClose }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1,
      height: '100%',
      maxWidth: 320,
      minWidth: 320,
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: 2.5,
      transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
      border: '1px solid',
      borderColor: 'divider',
      minHeight: 180,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      opacity: product.is_active ? 1 : 0.5,
      pointerEvents: product.is_active ? 'auto' : 'none',
      cursor: product.is_active ? 'pointer' : 'not-allowed',
      '&:hover': product.is_active
        ? {
            transform: 'scale(1.035)',
            boxShadow: '0 6px 24px 0 rgba(0,0,0,0.10)',
            borderColor: product.color,
            zIndex: 1
          }
        : {}
    }}
  >
    <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>{product.icon}</Box>
    <Typography variant="subtitle1" sx={{ mb: 0.25, fontWeight: 700, fontSize: 16, textAlign: 'center', width: '100%' }}>
      {product.title}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, flex: 1, fontSize: 13, textAlign: 'center', width: '100%' }}>
      {product.description}
    </Typography>
    <Button
      component={RouterLink}
      to={`${product.path}?id=${product.id}&context=${product.context_type}&type=product`}
      onClick={onClose}
      endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
      size="small"
      disabled={!product.is_active}
      sx={{
        color: product.color,
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
  </Paper>
);

const ProductsPanel = ({ onClose }) => {
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
            backgroundColor: 'background.paper',
            px: { xs: 2, sm: 4, md: 10 },
            py: { xs: 3, sm: 5 },
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0 8px 12px -4px rgba(0, 0, 0, 0.45)' // ✅ bottom shadow only
          }}
        >
          <Container maxWidth="lg">
            <Grid2 container spacing={2} sx={{ px: { xs: 1, sm: 0 } }}>
              {products.map((product, index) => (
                <Grid2 xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ProductCard product={product} onClose={onClose} />
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </MotionPaper>
      </ClickAwayListener>
    </AnimatePresence>
  );
};

export default ProductsPanel;
