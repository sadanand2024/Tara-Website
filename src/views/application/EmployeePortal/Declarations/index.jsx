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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { IconFileText, IconPlus, IconEdit, IconTrash, IconDownload, IconEye, IconCheck, IconX, IconChevronDown } from '@tabler/icons-react';

const Declarations = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [declarations, setDeclarations] = useState([
    {
      id: 1,
      category: 'House Rent Allowance',
      subCategory: 'Rent Paid',
      amount: 120000,
      documents: ['Rent Agreement', 'Rent Receipts'],
      status: 'Submitted',
      submittedDate: '2024-01-15',
      approvedAmount: 120000,
      remarks: 'Approved'
    },
    {
      id: 2,
      category: 'Medical Insurance',
      subCategory: 'Health Insurance Premium',
      amount: 25000,
      documents: ['Insurance Policy', 'Premium Receipts'],
      status: 'Pending',
      submittedDate: '2024-01-20',
      approvedAmount: 0,
      remarks: 'Under Review'
    },
    {
      id: 3,
      category: 'Home Loan Interest',
      subCategory: 'Home Loan Interest',
      amount: 150000,
      documents: ['Loan Statement', 'Interest Certificate'],
      status: 'Rejected',
      submittedDate: '2024-01-10',
      approvedAmount: 0,
      remarks: 'Documentation incomplete'
    }
  ]);

  const declarationCategories = [
    {
      name: 'House Rent Allowance',
      maxLimit: 60000,
      subCategories: ['Rent Paid', 'Municipal Taxes']
    },
    {
      name: 'Medical Insurance',
      maxLimit: 25000,
      subCategories: ['Health Insurance Premium', 'Medical Expenses']
    },
    {
      name: 'Home Loan Interest',
      maxLimit: 200000,
      subCategories: ['Home Loan Interest', 'Principal Repayment']
    },
    {
      name: 'Section 80C',
      maxLimit: 150000,
      subCategories: ['ELSS', 'PPF', 'NPS', 'Life Insurance']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Declarations
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Submit and manage your tax-saving declarations
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconFileText size={24} color="#1976d2" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Total Declared
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {formatCurrency(295000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                FY 2024-25
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Approved Amount
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(120000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                40.7% of declared
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Review
              </Typography>
              <Typography variant="h4" color="warning.main">
                {formatCurrency(25000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                1 declaration
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rejected
              </Typography>
              <Typography variant="h4" color="error.main">
                {formatCurrency(150000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                1 declaration
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<IconPlus />} onClick={() => setOpenDialog(true)}>
              Add Declaration
            </Button>
            <Button variant="outlined" startIcon={<IconDownload />}>
              Download Summary
            </Button>
            <Button variant="outlined" startIcon={<IconEye />}>
              View Guidelines
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Declaration Categories */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Declaration Categories & Limits
          </Typography>
          <Grid container spacing={2}>
            {declarationCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Accordion>
                  <AccordionSummary expandIcon={<IconChevronDown />}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Max: {formatCurrency(category.maxLimit)}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Sub-categories:
                    </Typography>
                    {category.subCategories.map((subCat, subIndex) => (
                      <Typography key={subIndex} variant="body2" sx={{ ml: 2 }}>
                        • {subCat}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Declarations Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Declarations
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Sub-Category</TableCell>
                  <TableCell align="right">Declared Amount</TableCell>
                  <TableCell align="right">Approved Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {declarations.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subCategory}</TableCell>
                    <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.approvedAmount)}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                    </TableCell>
                    <TableCell>{formatDate(row.submittedDate)}</TableCell>
                    <TableCell>{row.remarks}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <IconEye size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="info">
                            <IconEdit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <IconTrash size={16} />
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

      {/* Add Declaration Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Declaration</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Declaration Category</InputLabel>
                <Select value={selectedCategory} label="Declaration Category" onChange={(e) => setSelectedCategory(e.target.value)}>
                  {declarationCategories.map((category, index) => (
                    <MenuItem key={index} value={category.name}>
                      {category.name} (Max: {formatCurrency(category.maxLimit)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Amount" type="number" placeholder="Enter amount" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} placeholder="Provide details about your declaration" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Documents
                <input type="file" hidden multiple />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Submit Declaration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Declarations;
