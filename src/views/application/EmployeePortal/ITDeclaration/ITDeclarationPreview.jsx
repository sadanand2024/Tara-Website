import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Divider,
  TextField,
  Grid2,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { IconX, IconCalculator, IconChevronDown, IconDownload } from '@tabler/icons-react';

const ITDeclarationPreview = ({ open, onClose, declarations, selectedYear }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mock detailed breakdown data
  const detailedBreakdown = {
    sec80C: [
      { item: '80C - 5yrs FD', amount: 50000 },
      { item: '80C - Children Tuition Fees', amount: 30000 },
      { item: '80CCC - Contribution to Pension Fund', amount: 20000 },
      { item: '80C - Deposit in NSC', amount: 10000 }
    ],
    otherChapterVIADeductions: [
      { item: '80EE - Additional Interest on Housing Loan', amount: 25000 },
      { item: '80CCD1(B) - Contribution to NPS', amount: 25000 }
    ],
    houseRentAllowance: {
      details: {
        fromTo: 'Apr 25 - Mar 2026',
        monthlyRent: 19000,
        annualRent: 140000,
        address: '123, ABC Street, XYZ City, State - 123456'
      },
      declaredAmount: 140500
    }
  };

  const calculateTotalSec80C = () => {
    return detailedBreakdown.sec80C.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotalOtherDeductions = () => {
    return detailedBreakdown.otherChapterVIADeductions.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotalDeclarations = () => {
    return calculateTotalSec80C() + calculateTotalOtherDeductions() + detailedBreakdown.houseRentAllowance.declaredAmount;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textDecoration: 'underline' }}>
            IT Declaration Preview
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
            Detailed Breakdown
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip icon={<IconCalculator size={16} />} label="My Tax Planner" variant="outlined" color="primary" />
          <Chip label={selectedYear} variant="outlined" color="secondary" />
          <IconButton onClick={onClose} size="small">
            <IconX size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid2 container spacing={3}>
          {/* Section 80C */}
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: '100%', border: '2px solid #1976d2' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                  Section 80C (Max limit 1.5 lakh)
                </Typography>

                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Declared Amount (₹)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailedBreakdown.sec80C.map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2">{item.item}</Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: 'primary.50' }}>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            Total Section 80C
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {formatCurrency(calculateTotalSec80C())}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid2>

          {/* Other Chapter VIA Deductions */}
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: '100%', border: '2px solid #9c27b0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                  Other Chapter VIA Deductions
                </Typography>

                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Declared Amount (₹)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailedBreakdown.otherChapterVIADeductions.map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2">{item.item}</Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: 'secondary.50' }}>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            Total Other Deductions
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {formatCurrency(calculateTotalOtherDeductions())}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid2>

          {/* House Rent Allowance */}
          <Grid2 size={{ xs: 12 }}>
            <Card sx={{ border: '2px solid #2e7d32' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                  House Rent Allowance
                </Typography>

                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 8 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        House on Rent 1
                      </Typography>

                      <Grid2 container spacing={2} sx={{ mb: 3 }}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              From - To
                            </Typography>
                            <TextField
                              value={detailedBreakdown.houseRentAllowance.details.fromTo}
                              fullWidth
                              size="small"
                              InputProps={{ readOnly: true }}
                              sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                            />
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Monthly Rent (₹)
                            </Typography>
                            <TextField
                              value={formatCurrency(detailedBreakdown.houseRentAllowance.details.monthlyRent)}
                              fullWidth
                              size="small"
                              InputProps={{ readOnly: true }}
                              sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                            />
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Annual Rent
                            </Typography>
                            <TextField
                              value={formatCurrency(detailedBreakdown.houseRentAllowance.details.annualRent)}
                              fullWidth
                              size="small"
                              InputProps={{ readOnly: true }}
                              sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                            />
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Address
                            </Typography>
                            <TextField
                              value={detailedBreakdown.houseRentAllowance.details.address}
                              fullWidth
                              size="small"
                              InputProps={{ readOnly: true }}
                              sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                            />
                          </Box>
                        </Grid2>
                      </Grid2>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1, height: '100%' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Declared Amount (₹)
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(detailedBreakdown.houseRentAllowance.declaredAmount)}
                      </Typography>
                    </Box>
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          </Grid2>

          {/* Summary Section */}
          <Grid2 size={{ xs: 12 }}>
            <Card sx={{ bgcolor: 'grey.50' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                  Declaration Summary
                </Typography>

                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">Section 80C Total:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(calculateTotalSec80C())}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">Other Chapter VIA Deductions:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(calculateTotalOtherDeductions())}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">House Rent Allowance:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(detailedBreakdown.houseRentAllowance.declaredAmount)}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Total Declarations:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {formatCurrency(calculateTotalDeclarations())}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={{ p: 3, bgcolor: 'primary.50', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Estimated Tax Savings
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCurrency(calculateTotalDeclarations() * 0.3)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Based on 30% tax bracket
                      </Typography>
                    </Box>
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="outlined"
          startIcon={<IconDownload size={20} />}
          onClick={() => {
            // In real app, this would download the preview as PDF
            console.log('Download preview');
          }}
        >
          Download Preview
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: 'success.main',
            '&:hover': {
              bgcolor: 'success.dark'
            }
          }}
        >
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ITDeclarationPreview;
