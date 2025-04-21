import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid2, Paper, ClickAwayListener, Stack, Button, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'utils/axios';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CalculateIcon from '@mui/icons-material/Calculate';

const productUIConfig = {
  Payroll: {
    icon: <CreditCardIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: '#FF6B6B' }} />,
    path: '/products/payroll'
  },
  Invoice: {
    icon: <ReceiptLongIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: '#5C7AEA' }} />,
    path: '/products/invoicing'
  },
  Accounting: {
    icon: <AccountBalanceIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: '#00C9A7' }} />,
    path: '/products/accounting'
  },

  'Document Vault': {
    icon: <FolderZipIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: '#FFA94D' }} />,
    path: '/products/document-vault'
  },
  'Compliance Tracker': {
    icon: <VerifiedUserIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: '#845EF7' }} />,
    path: '/products/compliance-tracker'
  },
  'Tax Calculators': {
    icon: <CalculateIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: '#2EB67D' }} />,
    path: '/products/tax-calculators'
  }
};

const MotionPaper = motion(Paper);

const panelVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
const ProductsPanel = ({ onClose }) => {
  const [products, setProducts] = useState([]);

  const getProductsList = async () => {
    try {
      const response = await axios.get('/user_management/modules/list?context_type=business');

      const enhancedProducts = (response.data.modules || []).map((product) => {
        const uiConfig = productUIConfig[product.name] || {};
        return {
          ...product,
          ...uiConfig,
          disabled: !product.is_active // 🔥 Set disabled based on API response
        };
      });

      setProducts(enhancedProducts);
    } catch (err) {
      console.error('Failed to fetch products/modules:', err);
    }
  };

  useEffect(() => {
    getProductsList();
  }, []);
  console.log(products);
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
          <Container>
            <Grid2 container spacing={3} justifyContent="flex-start">
              {products.map((product) => (
                <Grid2 key={product.id} size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      width: '100%',
                      maxWidth: 280,
                      minHeight: 200,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flex: 1,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      ...(product.disabled
                        ? { opacity: 0.5, pointerEvents: 'none' }
                        : {
                            '&:hover': {
                              transform: 'translateY(-6px)',
                              boxShadow: '0 12px 20px rgba(0,0,0,0.08)'
                            }
                          })
                    }}
                  >
                    <Stack spacing={1} alignItems="center" textAlign="center">
                      <Box>{product.icon}</Box>
                      <Typography variant="h4" fontWeight={600}>
                        {product.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'left' }}>
                        {product.description}
                      </Typography>
                    </Stack>

                    <Box sx={{ mt: 'auto', pt: 1 }}>
                      <Button
                        variant="text"
                        color="primary"
                        component={RouterLink}
                        to={`${product.path}?id=${product.id}`}
                        disabled={product.disabled}
                        onClick={onClose}
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          p: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%'
                        }}
                        endIcon={<span>&rarr;</span>}
                      >
                        Try Now
                      </Button>
                    </Box>
                  </Paper>
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
