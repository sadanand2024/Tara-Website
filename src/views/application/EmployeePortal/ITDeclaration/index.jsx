import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid2,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Divider,
  Chip,
  InputAdornment
} from '@mui/material';
import { useSelector } from 'store';
import { IconDownload, IconChevronDown, IconCalculator, IconEye, IconSend } from '@tabler/icons-react';
import ITDeclarationPreview from './ITDeclarationPreview';
import MyTaxPlanner from './MyTaxPlanner';

const ITDeclaration = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [declarations, setDeclarations] = useState({
    sec80C: { declared: 20000, maxLimit: 150000 },
    otherChapterVIADeductions: { declared: 50000 },
    houseRentAllowance: { declared: 144000 },
    medicalSec80D: { declared: 5000 },
    houseProperty: { declared: 0 }
  });
  const [netTax, setNetTax] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [taxPlannerOpen, setTaxPlannerOpen] = useState(false);

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

  const handleDeclarationChange = (field, value) => {
    setDeclarations((prev) => ({
      ...prev,
      [field]: { ...prev[field], declared: value }
    }));
  };

  const calculateNetTax = () => {
    // Mock calculation - in real app this would be more complex
    const totalDeclarations = Object.values(declarations).reduce((sum, item) => sum + (item.declared || 0), 0);
    const mockTaxableIncome = 800000; // Mock taxable income
    const mockTaxRate = 0.3; // 30% tax rate
    const calculatedTax = (mockTaxableIncome - totalDeclarations) * mockTaxRate;
    setNetTax(Math.max(0, calculatedTax));
  };

  const handlePreview = () => {
    calculateNetTax();
    setPreviewOpen(true);
  };

  const handleSubmit = () => {
    calculateNetTax();
    // In real app, this would submit the declaration
    console.log('Submit clicked', declarations);
  };

  const declarationSections = [
    {
      key: 'sec80C',
      title: 'Sec 80C',
      description: 'Declared Amount/max limit',
      value: `${formatCurrency(declarations.sec80C.declared)} / ${formatCurrency(declarations.sec80C.maxLimit)}`,
      maxLimit: declarations.sec80C.maxLimit,
      color: 'primary'
    },
    {
      key: 'otherChapterVIADeductions',
      title: 'Other Chapter VIA Deductions',
      description: 'Declared Amount',
      value: formatCurrency(declarations.otherChapterVIADeductions.declared),
      color: 'secondary'
    },
    {
      key: 'houseRentAllowance',
      title: 'House Rent Allowance',
      description: 'Declared Amount',
      value: formatCurrency(declarations.houseRentAllowance.declared),
      color: 'success'
    },
    {
      key: 'medicalSec80D',
      title: 'Medical (Sec 80D)',
      description: 'Declared Amount',
      value: formatCurrency(declarations.medicalSec80D.declared),
      color: 'info'
    },
    {
      key: 'houseProperty',
      title: 'Income/Loss from House Property',
      description: 'Add to Declaration',
      value: formatCurrency(declarations.houseProperty.declared),
      color: 'warning'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textDecoration: 'underline' }}>
            IT Declaration
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
            Income Tax Declaration Form
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            icon={<IconCalculator size={16} />}
            label="My Tax Planner"
            variant="outlined"
            color="primary"
            onClick={() => setTaxPlannerOpen(true)}
            sx={{ cursor: 'pointer' }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
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
              <MenuItem value="2024-25">2024-25</MenuItem>
              <MenuItem value="2025-26">2025-26</MenuItem>
              <MenuItem value="2026-27">2026-27</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Declaration Sections */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {declarationSections.map((section, index) => (
          <Grid2 key={section.key} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                height: '100%',
                border: `2px solid ${
                  section.color === 'primary'
                    ? '#1976d2'
                    : section.color === 'secondary'
                      ? '#9c27b0'
                      : section.color === 'success'
                        ? '#2e7d32'
                        : section.color === 'info'
                          ? '#0288d1'
                          : section.color === 'warning'
                            ? '#ed6c02'
                            : '#1976d2'
                }`
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                  {section.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {section.description}
                </Typography>

                {section.key === 'sec80C' ? (
                  <Box>
                    <TextField
                      label="Declared Amount"
                      type="number"
                      value={declarations.sec80C.declared}
                      onChange={(e) => handleDeclarationChange('sec80C', parseInt(e.target.value) || 0)}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        endAdornment: <InputAdornment position="end">/ 1,50,000</InputAdornment>
                      }}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Max Limit: {formatCurrency(section.maxLimit)}
                    </Typography>
                  </Box>
                ) : section.key === 'houseProperty' ? (
                  <Box>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 1 }}
                      onClick={() => {
                        // In real app, this would open a modal for house property details
                        console.log('Add house property declaration');
                      }}
                    >
                      Add to Declaration
                    </Button>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Current: {section.value}
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    label="Declared Amount"
                    type="number"
                    value={declarations[section.key].declared}
                    onChange={(e) => handleDeclarationChange(section.key, parseInt(e.target.value) || 0)}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
                  />
                )}

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Value:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {section.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Summary and Action Section */}
      <Card sx={{ bgcolor: 'grey.50' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid2 container spacing={3} alignItems="center">
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Net Tax: ₹
                </Typography>
                <TextField
                  value={formatCurrency(netTax)}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: 'white',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }
                  }}
                />
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<IconEye size={20} />}
                  onClick={handlePreview}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    minWidth: 120
                  }}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={<IconSend size={20} />}
                  onClick={handleSubmit}
                  sx={{
                    bgcolor: 'success.main',
                    minWidth: 120,
                    '&:hover': {
                      bgcolor: 'success.dark'
                    }
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Note:</strong> Please ensure all declarations are accurate and supported by relevant documents. Incorrect declarations may
          result in penalties.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <strong>Important:</strong>• Section 80C includes investments in ELSS, PPF, NSC, etc. (Max: ₹1,50,000) • House Rent Allowance
          requires rent receipts and PAN of landlord • Medical insurance premiums are covered under Section 80D • All declarations are
          subject to verification
        </Typography>
      </Box>

      {/* IT Declaration Preview Modal */}
      <ITDeclarationPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        declarations={declarations}
        selectedYear={selectedYear}
      />

      {/* My Tax Planner Modal */}
      <MyTaxPlanner open={taxPlannerOpen} onClose={() => setTaxPlannerOpen(false)} selectedYear={selectedYear} />
    </Box>
  );
};

export default ITDeclaration;
