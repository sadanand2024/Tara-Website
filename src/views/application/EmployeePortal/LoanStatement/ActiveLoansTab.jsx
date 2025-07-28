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
  Button
} from '@mui/material';
import { IconEye } from '@tabler/icons-react';

const ActiveLoansTab = ({ onViewDetails }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mock active loan data
  const activeLoans = [
    {
      id: 1,
      type: 'Marriage loan',
      amount: 10000,
      monthlyInstalment: 2083,
      installmentsPaid: 5,
      totalInstallments: 5,
      balancePrincipal: 0,
      tenure: 'Apr 2025 - Sep 2025',
      status: 'Scheduled',
      startDate: '2025-04-01',
      endDate: '2025-09-01',
      interestRate: 8.5,
      loanNumber: 'LN001'
    }
  ];

  return (
    <Box>
      <Card sx={{ border: '2px solid #1976d2' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              textDecoration: 'underline',
              border: '2px solid #1976d2',
              borderRadius: 1,
              px: 2,
              py: 0.5,
              bgcolor: 'primary.50',
              display: 'inline-block'
            }}
          >
            Active Loans
          </Typography>

          {activeLoans.length > 0 ? (
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600, textDecoration: 'underline' }}>Loan Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'right' }}>Loan Amount (₹)</TableCell>
                    <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'right' }}>Monthly Instalment (₹)</TableCell>
                    <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeLoans.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {loan.type}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Installments paid: {loan.installmentsPaid} of {loan.totalInstallments}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Balance principal (₹): {loan.balancePrincipal === 0 ? 'NIL' : formatCurrency(loan.balancePrincipal)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Loan Tenure: {loan.tenure} ({loan.status})
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(loan.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(loan.monthlyInstalment)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          variant="text"
                          startIcon={<IconEye size={16} />}
                          onClick={() => onViewDetails(loan)}
                          sx={{
                            textDecoration: 'underline',
                            color: 'primary.main',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No active loans found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActiveLoansTab;
