import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Grid2,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { useSelector } from 'store';
import { IconDownload, IconX, IconCheck, IconClock } from '@tabler/icons-react';
import ActiveLoansTab from './ActiveLoansTab';
import ClosedLoansTab from './ClosedLoansTab';

const LoanStatement = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
      </Box>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setViewDetailsOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textDecoration: 'underline' }}>
            Loan Statement
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
            Employee Loan Overview
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<IconDownload size={20} />} sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
          Download Statement
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Active Loans" />
          <Tab label="Closed Loans" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && <ActiveLoansTab onViewDetails={handleViewDetails} />}
      {tabValue === 1 && <ClosedLoansTab onViewDetails={handleViewDetails} />}

      {/* Loan Details Modal */}
      <Dialog
        open={viewDetailsOpen}
        onClose={() => setViewDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
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
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, textDecoration: 'underline' }}>
              Loan Details
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
              {selectedLoan?.type}
            </Typography>
          </Box>
          <IconButton onClick={() => setViewDetailsOpen(false)} size="small">
            <IconX size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedLoan && (
            <Grid2 container spacing={3}>
              {/* Loan Information */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                      Loan Information
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Loan Number
                        </Typography>
                        <TextField
                          value={selectedLoan.loanNumber}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Loan Type
                        </Typography>
                        <TextField
                          value={selectedLoan.type}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Loan Amount
                        </Typography>
                        <TextField
                          value={formatCurrency(selectedLoan.amount)}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { bgcolor: 'success.50', fontWeight: 600 } }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Interest Rate
                        </Typography>
                        <TextField
                          value={`${selectedLoan.interestRate}%`}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>

              {/* Payment Details */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                      Payment Details
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Monthly Instalment
                        </Typography>
                        <TextField
                          value={formatCurrency(selectedLoan.monthlyInstalment)}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { bgcolor: 'primary.50', fontWeight: 600 } }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Installments Paid
                        </Typography>
                        <TextField
                          value={`${selectedLoan.installmentsPaid} of ${selectedLoan.totalInstallments}`}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Balance Principal
                        </Typography>
                        <TextField
                          value={selectedLoan.balancePrincipal === 0 ? 'NIL' : formatCurrency(selectedLoan.balancePrincipal)}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{
                            '& .MuiInputBase-input': {
                              bgcolor: selectedLoan.balancePrincipal === 0 ? 'success.50' : 'error.50',
                              fontWeight: 600
                            }
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Loan Tenure
                        </Typography>
                        <TextField
                          value={selectedLoan.tenure}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                        />
                      </Box>

                      {selectedLoan.closedDate && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Closed Date
                          </Typography>
                          <TextField
                            value={selectedLoan.closedDate}
                            fullWidth
                            size="small"
                            InputProps={{ readOnly: true }}
                            sx={{ '& .MuiInputBase-input': { bgcolor: 'success.50' } }}
                          />
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>

              {/* Status Summary */}
              <Grid2 size={{ xs: 12 }}>
                <Card
                  sx={{
                    bgcolor: selectedLoan.balancePrincipal === 0 ? 'success.50' : 'warning.50',
                    border: `2px solid ${selectedLoan.balancePrincipal === 0 ? '#2e7d32' : '#ed6c02'}`
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      {selectedLoan.balancePrincipal === 0 ? (
                        <IconCheck size={24} color="#2e7d32" />
                      ) : (
                        <IconClock size={24} color="#ed6c02" />
                      )}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          ml: 1,
                          color: selectedLoan.balancePrincipal === 0 ? 'success.main' : 'warning.main'
                        }}
                      >
                        {selectedLoan.balancePrincipal === 0 ? 'Loan Fully Paid' : 'Loan in Progress'}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedLoan.balancePrincipal === 0
                        ? 'Congratulations! You have successfully completed all payments.'
                        : `${selectedLoan.totalInstallments - selectedLoan.installmentsPaid} installments remaining.`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="outlined" onClick={() => setViewDetailsOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<IconDownload size={16} />}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Download Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanStatement;
