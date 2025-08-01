import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert
} from '@mui/material';
import {
  IconShieldCheck,
  IconDownload,
  IconEye,
  IconFileText,
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
  IconCalendar,
  IconFileInvoice
} from '@tabler/icons-react';

const Form16Compliances = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');

  const form16Data = [
    {
      id: 1,
      financialYear: '2023-24',
      employerName: 'Tara Finance Ltd',
      panNumber: 'ABCDE1234F',
      grossSalary: 850000,
      totalDeductions: 150000,
      taxableIncome: 700000,
      taxPaid: 45000,
      status: 'Available',
      downloadDate: '2024-06-15',
      remarks: 'Form 16 generated successfully'
    },
    {
      id: 2,
      financialYear: '2022-23',
      employerName: 'Tara Finance Ltd',
      panNumber: 'ABCDE1234F',
      grossSalary: 780000,
      totalDeductions: 120000,
      taxableIncome: 660000,
      taxPaid: 38000,
      status: 'Available',
      downloadDate: '2023-06-20',
      remarks: 'Form 16 generated successfully'
    }
  ];

  const complianceDocuments = [
    {
      id: 1,
      documentType: 'Form 16',
      financialYear: '2023-24',
      status: 'Available',
      lastUpdated: '2024-06-15',
      description: 'Annual salary certificate for tax filing'
    },
    {
      id: 2,
      documentType: 'Investment Proof Summary',
      financialYear: '2023-24',
      status: 'Available',
      lastUpdated: '2024-03-31',
      description: 'Summary of all tax-saving investments'
    },
    {
      id: 3,
      documentType: 'Tax Computation Sheet',
      financialYear: '2023-24',
      status: 'Pending',
      lastUpdated: '2024-06-10',
      description: 'Detailed tax calculation breakdown'
    },
    {
      id: 4,
      documentType: 'Form 16A',
      financialYear: '2023-24',
      status: 'Not Available',
      lastUpdated: '-',
      description: 'TDS certificate for other income'
    }
  ];

  const complianceStatus = {
    form16Generated: true,
    taxFilingDue: '2024-07-31',
    documentsComplete: 3,
    totalDocuments: 4,
    lastComplianceCheck: '2024-06-15'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Not Available':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <IconCheck size={20} color="green" />;
      case 'Pending':
        return <IconClock size={20} color="orange" />;
      case 'Not Available':
        return <IconX size={20} color="red" />;
      default:
        return <IconAlertCircle size={20} color="gray" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (dateString === '-') return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Form 16 & Compliances
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Access your Form 16 and compliance documents for tax filing
      </Typography>

      {/* Compliance Status Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tax Filing Deadline:</strong> {formatDate(complianceStatus.taxFilingDue)} |<strong> Last Compliance Check:</strong>{' '}
          {formatDate(complianceStatus.lastComplianceCheck)}
        </Typography>
      </Alert>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconShieldCheck size={24} color="#1976d2" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Form 16 Status
                </Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                Available
              </Typography>
              <Typography variant="body2" color="textSecondary">
                FY 2023-24
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents Ready
              </Typography>
              <Typography variant="h4" color="primary">
                {complianceStatus.documentsComplete}/{complianceStatus.totalDocuments}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {Math.round((complianceStatus.documentsComplete / complianceStatus.totalDocuments) * 100)}% complete
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tax Filing Due
              </Typography>
              <Typography variant="h4" color="warning.main">
                {formatDate(complianceStatus.taxFilingDue)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last date to file ITR
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="h4" color="info.main">
                {formatDate(complianceStatus.lastComplianceCheck)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Compliance check
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Financial Year</InputLabel>
                <Select value={selectedYear} label="Financial Year" onChange={(e) => setSelectedYear(e.target.value)}>
                  <MenuItem value="2024-25">2024-25</MenuItem>
                  <MenuItem value="2023-24">2023-24</MenuItem>
                  <MenuItem value="2022-23">2022-23</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" startIcon={<IconDownload />} fullWidth>
                Download All Documents
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" startIcon={<IconCalendar />} fullWidth>
                View Filing Calendar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Form 16 Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Form 16 Details
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Financial Year</TableCell>
                  <TableCell>Employer Name</TableCell>
                  <TableCell>PAN Number</TableCell>
                  <TableCell align="right">Gross Salary</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Taxable Income</TableCell>
                  <TableCell align="right">Tax Paid</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Download Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {form16Data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.financialYear}</TableCell>
                    <TableCell>{row.employerName}</TableCell>
                    <TableCell>{row.panNumber}</TableCell>
                    <TableCell align="right">{formatCurrency(row.grossSalary)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.totalDeductions)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.taxableIncome)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.taxPaid)}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                    </TableCell>
                    <TableCell>{formatDate(row.downloadDate)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Download Form 16">
                          <IconButton size="small" color="primary">
                            <IconDownload size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="info">
                            <IconEye size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Compliance Documents */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Compliance Documents
          </Typography>
          <List>
            {complianceDocuments.map((doc, index) => (
              <React.Fragment key={doc.id}>
                <ListItem>
                  <ListItemIcon>{getStatusIcon(doc.status)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {doc.documentType}
                        </Typography>
                        <Chip label={doc.financialYear} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {doc.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Last updated: {formatDate(doc.lastUpdated)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {doc.status === 'Available' && (
                        <Tooltip title="Download">
                          <IconButton size="small" color="primary">
                            <IconDownload size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="View Details">
                        <IconButton size="small" color="info">
                          <IconEye size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < complianceDocuments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Form16Compliances;
