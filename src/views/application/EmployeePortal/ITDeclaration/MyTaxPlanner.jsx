import React, { useState } from 'react';
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
  Grid2,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { IconX, IconCalculator, IconEye, IconSend } from '@tabler/icons-react';

const MyTaxPlanner = ({ open, onClose, selectedYear }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mock tax planning data
  const taxPlans = {
    planA: {
      name: 'Plan A',
      taxableIncome: 1225000,
      netTax: 123692,
      deductions: {
        sec80C: {
          total: 25000,
          breakdown: {
            '80C - 5yrs of FD': 10000,
            '80CO - Tuition fees': 10000,
            '80LCC - Pension fund': 5000
          }
        }
      }
    },
    planB: {
      name: 'Plan B',
      taxableIncome: 1350000,
      netTax: 100112,
      deductions: {
        sec80C: {
          total: 0,
          breakdown: {
            '80C - 5yrs of FD': 0,
            '80CO - Tuition fees': 0,
            '80LCC - Pension fund': 0
          }
        }
      }
    }
  };

  const handleViewPlan = (plan) => {
    // In real app, this would show detailed plan view
    console.log(`View ${plan.name}`);
  };

  const handleSubmitPlan = (plan) => {
    setSelectedPlan(plan);
    // In real app, this would submit the selected plan
    console.log(`Submit ${plan.name}`);
  };

  const handleConfirmSubmit = () => {
    // In real app, this would finalize the plan selection
    console.log('Plan confirmed:', selectedPlan);
    setSelectedPlan(null);
    onClose();
  };

  const renderPlanOverview = (plan) => (
    <Card
      sx={{
        height: '100%',
        border: plan.name === 'Plan A' ? '2px solid #1976d2' : '2px solid #9c27b0'
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
          {plan.name}
        </Typography>

        <Button variant="outlined" startIcon={<IconEye size={16} />} size="small" sx={{ mb: 3 }} onClick={() => handleViewPlan(plan)}>
          View Plan
        </Button>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Taxable Income
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
              {formatCurrency(plan.taxableIncome)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Net Tax
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {formatCurrency(plan.netTax)}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<IconSend size={16} />}
          fullWidth
          onClick={() => handleSubmitPlan(plan)}
          sx={{
            bgcolor: plan.name === 'Plan A' ? 'primary.main' : 'secondary.main',
            '&:hover': {
              bgcolor: plan.name === 'Plan A' ? 'primary.dark' : 'secondary.dark'
            }
          }}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <>
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
              My Tax Planner
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
              Compare Tax Planning Options
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label={selectedYear} variant="outlined" color="secondary" />
            <IconButton onClick={onClose} size="small">
              <IconX size={20} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Plan Overview Section */}
          <Grid2 container spacing={3} sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>{renderPlanOverview(taxPlans.planA)}</Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>{renderPlanOverview(taxPlans.planB)}</Grid2>
          </Grid2>

          {/* Compare Plans Section */}
          <Card sx={{ bgcolor: 'grey.50' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                Compare Plans
              </Typography>

              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Particulars</TableCell>
                      <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'center' }}>Plan A</TableCell>
                      <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'center' }}>Plan B</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Section 80C */}
                    <TableRow sx={{ bgcolor: 'primary.50' }}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Section 80C
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(taxPlans.planA.deductions.sec80C.total)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(taxPlans.planB.deductions.sec80C.total)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* 80C - 5yrs of FD */}
                    <TableRow hover>
                      <TableCell sx={{ pl: 4 }}>
                        <Typography variant="body2">80C - 5yrs of FD</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {taxPlans.planA.deductions.sec80C.breakdown['80C - 5yrs of FD'] > 0
                            ? formatCurrency(taxPlans.planA.deductions.sec80C.breakdown['80C - 5yrs of FD'])
                            : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {taxPlans.planB.deductions.sec80C.breakdown['80C - 5yrs of FD'] > 0
                            ? formatCurrency(taxPlans.planB.deductions.sec80C.breakdown['80C - 5yrs of FD'])
                            : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* 80CO - Tuition fees */}
                    <TableRow hover>
                      <TableCell sx={{ pl: 4 }}>
                        <Typography variant="body2">80CO - Tuition fees</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {taxPlans.planA.deductions.sec80C.breakdown['80CO - Tuition fees'] > 0
                            ? formatCurrency(taxPlans.planA.deductions.sec80C.breakdown['80CO - Tuition fees'])
                            : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {taxPlans.planB.deductions.sec80C.breakdown['80CO - Tuition fees'] > 0
                            ? formatCurrency(taxPlans.planB.deductions.sec80C.breakdown['80CO - Tuition fees'])
                            : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* 80LCC - Pension fund */}
                    <TableRow hover>
                      <TableCell sx={{ pl: 4 }}>
                        <Typography variant="body2">80LCC - Pension fund</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {taxPlans.planA.deductions.sec80C.breakdown['80LCC - Pension fund'] > 0
                            ? formatCurrency(taxPlans.planA.deductions.sec80C.breakdown['80LCC - Pension fund'])
                            : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {taxPlans.planB.deductions.sec80C.breakdown['80LCC - Pension fund'] > 0
                            ? formatCurrency(taxPlans.planB.deductions.sec80C.breakdown['80LCC - Pension fund'])
                            : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Taxable Income Summary */}
                    <TableRow sx={{ bgcolor: 'error.50' }}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          Taxable Income
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>
                          {formatCurrency(taxPlans.planA.taxableIncome)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>
                          {formatCurrency(taxPlans.planB.taxableIncome)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Net Tax Summary */}
                    <TableRow sx={{ bgcolor: 'primary.50' }}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          Net Tax
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {formatCurrency(taxPlans.planA.netTax)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {formatCurrency(taxPlans.planB.netTax)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Plan Recommendation */}
              <Box sx={{ mt: 3, p: 3, bgcolor: 'success.50', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                  💡 Tax Savings Recommendation
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {taxPlans.planA.netTax > taxPlans.planB.netTax
                    ? `Plan B saves you ${formatCurrency(taxPlans.planA.netTax - taxPlans.planB.netTax)} more in taxes!`
                    : `Plan A saves you ${formatCurrency(taxPlans.planB.netTax - taxPlans.planA.netTax)} more in taxes!`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Plan Submission Confirmation Dialog */}
      <Dialog open={selectedPlan !== null} onClose={() => setSelectedPlan(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Plan Selection
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to submit <strong>{selectedPlan?.name}</strong>?
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Taxable Income: {selectedPlan && formatCurrency(selectedPlan.taxableIncome)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Net Tax: {selectedPlan && formatCurrency(selectedPlan.netTax)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPlan(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmSubmit}
            sx={{
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' }
            }}
          >
            Confirm Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyTaxPlanner;
