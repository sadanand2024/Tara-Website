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

const ClosedLoansTab = ({ onViewDetails }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mock closed loan data
  const closedLoans = [
    {
      id: 2,
      type: 'Personal loan',
      amount: 50000,
      monthlyInstalment: 5250,
      installmentsPaid: 12,
      totalInstallments: 12,
      balancePrincipal: 0,
      tenure: 'Jan 2024 - Dec 2024',
      status: 'Completed',
      startDate: '2024-01-01',
      endDate: '2024-12-01',
      interestRate: 10.2,
      loanNumber: 'LN002',
      closedDate: '2024-12-15'
    }
  ];

  return (
    <Box>
      <Card sx={{ border: '2px solid #9c27b0' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              textDecoration: 'underline',
              border: '2px solid #9c27b0',
              borderRadius: 1,
              px: 2,
              py: 0.5,
              bgcolor: 'secondary.50',
              display: 'inline-block'
            }}
          >
            Closed Loans
          </Typography>

          {closedLoans.length > 0 ? (
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
                  {closedLoans.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {loan.type}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Status: {loan.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Closed Date: {loan.closedDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Loan Tenure: {loan.tenure}
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
                No closed loans found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClosedLoansTab;
