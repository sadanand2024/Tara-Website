import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Paper
} from '@mui/material';
import { IconDownload, IconCheck } from '@tabler/icons-react';

const TaxTDSInfo = ({ onClose }) => {
  // Mock data for the tax information
  const monthlyData = [
    {
      month: 'April 2024',
      tdsDeducted: 5400,
      grossIncome: 60000,
      netSalary: 52000,
      notes: ''
    },
    {
      month: 'May 2024',
      tdsDeducted: 5400,
      grossIncome: 60000,
      netSalary: 52000,
      notes: ''
    },
    {
      month: 'June 2024',
      tdsDeducted: 7200,
      grossIncome: 60000,
      netSalary: '',
      notes: 'Bonus included'
    }
  ];

  const totalTDS = monthlyData.reduce((sum, item) => sum + item.tdsDeducted, 0);

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Card sx={{ background: '#f5f5f5', borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Tax & TDS Information
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Know how much tax you've paid, why, and what's ahead.
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Grid2 container spacing={3} sx={{ mb: 3 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Card sx={{ background: 'white', height: '100%' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Total TDS Deducted (YTD)
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ₹{totalTDS.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Card sx={{ background: 'white', height: '100%' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Tax Regime
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <IconCheck size={24} color="green" />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'green' }}>
                      New Regime
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          {/* Monthly Data Table */}
          <Card sx={{ background: 'white', mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Monthly Tax Details
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2
                }}
              >
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>TDS Deducted</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Gross Income</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Net Salary</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthlyData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>₹{row.tdsDeducted.toLocaleString()}</TableCell>
                        <TableCell>₹{row.grossIncome.toLocaleString()}</TableCell>
                        <TableCell>
                          {row.netSalary && typeof row.netSalary === 'number' ? `₹${row.netSalary.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell>
                          {row.notes && (
                            <Chip
                              label={row.notes}
                              size="small"
                              sx={{
                                bgcolor: '#fff3cd',
                                color: '#856404',
                                fontSize: '0.75rem'
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card sx={{ background: 'white', mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                TDS Deducted Trend
              </Typography>
              <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 2, px: 2 }}>
                {monthlyData.map((item, index) => (
                  <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                    <Box
                      sx={{
                        height: `${(item.tdsDeducted / 8000) * 150}px`,
                        bgcolor: 'primary.main',
                        borderRadius: '4px 4px 0 0',
                        mb: 1
                      }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                      {item.month.split(' ')[0]} {item.month.split(' ')[1]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Download Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="outlined" startIcon={<IconDownload />} size="medium">
              Download TDS Summary (CSV)
            </Button>
            <Button variant="outlined" startIcon={<IconDownload />} size="medium">
              Download PDF for Form 12BA
            </Button>
          </Box>

          {/* Footer Text */}
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Tax deduction based on your monthly earnings, standard exemptions (₹ 75,000), and your selected regime.
          </Typography>

          {/* Close Button */}
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="contained" onClick={onClose} size="medium">
              Close
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaxTDSInfo;
