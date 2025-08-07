import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Avatar,
  Paper,
  Chip,
  alpha
} from '@mui/material';
import { 
  IconFileText, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconDownload, 
  IconEye, 
  IconCheck, 
  IconX, 
  IconChevronRight,
  IconCalculator,
  IconHome,
  IconStethoscope,
  IconBuilding,
  IconReceipt
} from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';

const Declarations = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const declarationCategories = [
    {
      id: 'sec80c',
      title: 'Sec 80C',
      icon: IconFileText,
      declaredAmount: 20000,
      maxLimit: 150000,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
      hasArrow: true
    },
    {
      id: 'otherDeductions',
      title: 'Other chapter VIA Deductions',
      icon: IconCalculator,
      declaredAmount: 50000,
      maxLimit: null,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #E6FAF0 0%, #fff 100%)',
      hasArrow: false
    },
    {
      id: 'hra',
      title: 'House Rent Allowance',
      icon: IconHome,
      declaredAmount: 144000,
      maxLimit: null,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #FFF7E3 0%, #fff 100%)',
      hasArrow: true
    },
    {
      id: 'medical',
      title: 'Medical (Sec 80D)',
      icon: IconStethoscope,
      declaredAmount: 5000,
      maxLimit: null,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #F3E8FF 0%, #fff 100%)',
      hasArrow: true
    },
    {
      id: 'houseProperty',
      title: 'Income/Loss from House property',
      icon: IconBuilding,
      declaredAmount: 0,
      maxLimit: null,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #E0F7FA 0%, #fff 100%)',
      hasArrow: false,
      isAddButton: true
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateNetTax = () => {
    return declarationCategories
      .filter(cat => !cat.isAddButton)
      .reduce((sum, cat) => sum + cat.declaredAmount, 0);
  };

  return (
    <MainCard title="IT Declaration" subtitle="My Tax Planner">

      {/* Declaration Categories Grid */}
      <Grid2 container spacing={1} sx={{ mb: 1 }}>
        {declarationCategories.map((category, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                height: 180,
                width: '100%',
                border: `1.5px solid #E5EAF2`,
                boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: category.gradient,
                position: 'relative',
                '&:hover': {
                  boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                  borderColor: category.color,
                  background: category.gradient
                }
              }}
            >
              {/* Arrow indicator */}
              {category.hasArrow && (
                <IconChevronRight 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    color: category.color 
                  }} 
                />
              )}

              {/* Row 1: Icon and Title */}
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar
                  variant="circular"
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <category.icon size={28} style={{ color: category.color }} />
                </Avatar>
                <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                  {category.title}
                </Typography>
              </Box>

              {/* Row 2: Content */}
              <Box sx={{ width: '100%' }}>
                {category.isAddButton ? (
                  <Typography variant="body2" sx={{ mb: 2, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'underline' }}>
                    Add to Declaration
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                      {category.maxLimit ? 'Declared Amount/max limit' : 'Declared Amount'}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 0, fontWeight: 600, color: '#0A1F44' }}>
                      {category.maxLimit 
                        ? `₹ ${category.declaredAmount.toLocaleString('en-IN')} / ${category.maxLimit.toLocaleString('en-IN')}`
                        : `₹ ${category.declaredAmount.toLocaleString('en-IN')}`
                      }
                    </Typography>
                  </>
                )}
              </Box>
            </Paper>
          </Grid2>
        ))}
      </Grid2>

      {/* Bottom Section - Net Tax and Actions */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          width: '100%',
          border: `1.5px solid #E5EAF2`,
          boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
          p: 3,
          background: 'linear-gradient(135deg, #F0FDF4 0%, #fff 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#0A1F44' }}>
            Net Tax:
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#84cc16' }}>
            ₹ {calculateNetTax().toLocaleString('en-IN')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              background: '#F0FDF4',
              color: '#84cc16',
              fontWeight: 500,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 'none',
              minWidth: 80,
              height: 36,
              fontSize: 14,
              px: 2,
              py: 0.5,
              transition: 'background 0.2s, color 0.2s',
              '&:hover': {
                background: '#84cc16',
                color: '#fff'
              }
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            disableElevation
            sx={{
              background: '#84cc16',
              color: '#fff',
              fontWeight: 500,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 'none',
              minWidth: 80,
              height: 36,
              fontSize: 14,
              px: 2,
              py: 0.5,
              transition: 'background 0.2s, color 0.2s',
              '&:hover': {
                background: '#65a30d'
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>

      {/* Add Declaration Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Declaration</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Declaration Category</InputLabel>
                <Select value={selectedCategory} label="Declaration Category" onChange={(e) => setSelectedCategory(e.target.value)}>
                  {declarationCategories.filter(cat => !cat.isAddButton).map((category, index) => (
                    <MenuItem key={index} value={category.title}>
                      {category.title} {category.maxLimit && `(Max: ${formatCurrency(category.maxLimit)})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label="Amount" type="number" placeholder="Enter amount" />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label="Description" multiline rows={3} placeholder="Provide details about your declaration" />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Documents
                <input type="file" hidden multiple />
              </Button>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Submit Declaration
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default Declarations;
