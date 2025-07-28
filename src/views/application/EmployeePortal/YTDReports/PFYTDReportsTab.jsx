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
  FormControl,
  Select,
  MenuItem,
  Button,
  Stack,
  TextField,
  Grid2
} from '@mui/material';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';

const PFYTDReportsTab = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('Apr 2025 - May 2025');

  // Mock PF YTD data
  const pfYtdData = {
    employeeDetails: {
      empId: 'EMP001',
      name: 'John Doe',
      joinDate: '15-01-2023',
      pfNo: 'PF123456789',
      uan: '123456789012'
    },
    pfSummary: [
      {
        month: 'Apr 2025',
        earnings: 152000,
        employeePf: 9600,
        employerPf: 9600,
        eps: 1250
      },
      {
        month: 'May 2025',
        earnings: 152000,
        employeePf: 9600,
        employerPf: 9600,
        eps: 1250
      },
      {
        month: 'June 2025',
        earnings: 152000,
        employeePf: 9600,
        employerPf: 9600,
        eps: 1250
      },
      {
        month: 'July 2025',
        earnings: 152000,
        employeePf: 9600,
        employerPf: 9600,
        eps: 1250
      }
    ]
  };

  const dateRanges = ['Apr 2025 - May 2025', 'Apr 2025 - Jun 2025', 'Apr 2025 - Jul 2025', 'Apr 2025 - Aug 2025'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePfTotals = () => {
    const totals = pfYtdData.pfSummary.reduce(
      (acc, item) => {
        acc.earnings += item.earnings;
        acc.employeePf += item.employeePf;
        acc.employerPf += item.employerPf;
        acc.eps += item.eps;
        return acc;
      },
      { earnings: 0, employeePf: 0, employerPf: 0, eps: 0 }
    );
    return totals;
  };

  const pfTotals = calculatePfTotals();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textDecoration: 'underline' }}>
            YTD Reports
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
            PF YTD Statement
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              displayEmpty
              IconComponent={IconChevronDown}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              {dateRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<IconDownload size={20} />} sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
            Download
          </Button>
        </Box>
      </Box>

      {/* PF YTD Content */}
      <Grid2 container spacing={3}>
        {/* PF Summary Table */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                PF YTD Summary
              </Typography>

              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', minWidth: 100 }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'right', minWidth: 120 }}>
                        Earnings (₹)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'center', minWidth: 150 }}>
                        Employee Contribution
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, textDecoration: 'underline', textAlign: 'center', minWidth: 200 }}>
                        Employer's Contribution
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell sx={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          PF
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>
                        <Grid2 container>
                          <Grid2 size={6}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              PF
                            </Typography>
                          </Grid2>
                          <Grid2 size={6}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              EPS
                            </Typography>
                          </Grid2>
                        </Grid2>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pfYtdData.pfSummary.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.month}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(row.earnings)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(row.employeePf)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>
                          <Grid2 container>
                            <Grid2 size={6}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatCurrency(row.employerPf)}
                              </Typography>
                            </Grid2>
                            <Grid2 size={6}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatCurrency(row.eps)}
                              </Typography>
                            </Grid2>
                          </Grid2>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Total Row */}
                    <TableRow sx={{ bgcolor: 'primary.50' }}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          Total
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {formatCurrency(pfTotals.earnings)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {formatCurrency(pfTotals.employeePf)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>
                        <Grid2 container>
                          <Grid2 size={6}>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              {formatCurrency(pfTotals.employerPf)}
                            </Typography>
                          </Grid2>
                          <Grid2 size={6}>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              {formatCurrency(pfTotals.eps)}
                            </Typography>
                          </Grid2>
                        </Grid2>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid2>

        {/* Employee Details */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textDecoration: 'underline' }}>
                Employee Details
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Emp. ID
                  </Typography>
                  <TextField
                    value={pfYtdData.employeeDetails.empId}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Name
                  </Typography>
                  <TextField
                    value={pfYtdData.employeeDetails.name}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Join Date
                  </Typography>
                  <TextField
                    value={pfYtdData.employeeDetails.joinDate}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    PF NO
                  </Typography>
                  <TextField
                    value={pfYtdData.employeeDetails.pfNo}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    UAN
                  </Typography>
                  <TextField
                    value={pfYtdData.employeeDetails.uan}
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
      </Grid2>
    </Box>
  );
};

export default PFYTDReportsTab;
