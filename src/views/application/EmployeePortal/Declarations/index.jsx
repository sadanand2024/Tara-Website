import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
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
  Avatar,
  Paper,
  Chip,
  alpha,
  InputAdornment,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import * as Yup from 'yup';
import DeclarationEditDialog from './DeclarationEditDialog';
import {
  IconFileText,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDownload,
  IconEye,
  IconCheck,
  IconX,
  IconChevronRight,
  IconCalculator,
  IconHome,
  IconStethoscope,
  IconBuilding,
  IconReceipt,
  IconSearch,
  IconInfoCircle,
  IconBook,
  IconCurrencyRupee,
  IconPercentage,
  IconMinus,
  IconChevronDown
} from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';

const Declarations = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const declarationCategories = [
    {
      id: 'sec80c',
      title: 'Sec 80C',
      icon: '80',
      declaredAmount: 160000,
      maxLimit: 150000,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
      hasEdit: true
    },
    {
      id: 'otherDeductions',
      title: 'Other Chapter VI-A Deductions',
      icon: IconBook,
      declaredAmount: 200000,
      maxLimit: null,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #E6FAF0 0%, #fff 100%)',
      hasEdit: true
    },
    {
      id: 'hra',
      title: 'House Rent Allowance',
      icon: 'house-dollar',
      declaredAmount: 720000,
      maxLimit: null,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #FFF7E3 0%, #fff 100%)',
      hasEdit: true
    },
    {
      id: 'medical',
      title: 'Medical (Sec 80D)',
      icon: 'medical-cross',
      declaredAmount: 50000,
      maxLimit: null,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #F3E8FF 0%, #fff 100%)',
      hasEdit: true
    },
    {
      id: 'houseProperty',
      title: 'Income/Loss From House Property',
      icon: 'house-loss',
      declaredAmount: -200000,
      maxLimit: null,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #E0F7FA 0%, #fff 100%)',
      hasEdit: true,
      isLoss: true
    },
    {
      id: 'otherIncome',
      title: 'Other Income',
      icon: IconCurrencyRupee,
      declaredAmount: null,
      maxLimit: null,
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #F9FAFB 0%, #fff 100%)',
      hasEdit: true,
      isAddButton: true
    },
    {
      id: 'tcsTds',
      title: 'TCS/TDS Deduction',
      icon: IconPercentage,
      declaredAmount: null,
      maxLimit: null,
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #F9FAFB 0%, #fff 100%)',
      hasEdit: true,
      isAddButton: true
    }
  ];

  // Detailed accordion data for summary view
  const accordionData = [
    {
      id: 'sec80c',
      title: 'Section 80C (max limit 1.5 lakh)',
      maxLimit: 150000,
      declaredAmount: 160000,
      items: [
        {
          name: 'Declared amount in ₹',
          amount: null,
          isTotal: true
        },
        {
          name: '80C - Repayment of Housing loan (Principal amount)',
          amount: 160000
        }
      ]
    },
    {
      id: 'otherDeductions',
      title: 'Other Chapter VI-A Deductions',
      maxLimit: null,
      declaredAmount: 200000,
      items: [
        {
          name: 'Declared amount in ₹',
          amount: null,
          isTotal: true
        },
        {
          name: '80CCD1(B) - Contribution to NPS 2015',
          amount: 50000
        },
        {
          name: '80EEA - Additional Interest on Housing loan borrowed as on 1st Apr 2019',
          amount: 150000
        }
      ]
    },
    {
      id: 'hra',
      title: 'House Rent Allowance',
      maxLimit: null,
      declaredAmount: 720000,
      items: [
        {
          name: 'House on Rent 1',
          amount: 720000,
          details: {
            period: 'Apr 2025 - Mar 2026',
            monthlyRent: 60000,
            annualRent: 720000,
            address: 'Plot 17, Oorjitha Golden leaf, Gundlapochempally, Hyderabad, 500014'
          }
        }
      ]
    }
  ];

  // Form field configurations for different declaration types
  const getFormFields = (categoryId) => {
    const fieldConfigs = {
      sec80c: [
        {
          name: 'npsContribution',
          label: '80CCD Contribution to NPS',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'tuitionFees',
          label: '80C Children Tuition Fees',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'nscDeposit',
          label: '80C Deposit in NSC',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'postOfficeDeposit',
          label: '80C Deposit in Post Office Savings Schemes',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'nscInterest',
          label: '80C Interest on NSC Reinvested',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'infrastructureBonds',
          label: '80C Long term Infrastructure Bonds',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'fixedDeposit',
          label: '80C 5 Years of Fixed Deposit in Scheduled Bank',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'pensionFund',
          label: '80CCC Contribution to Pension Fund',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'nssDeposit',
          label: '80C Deposit in NSS',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'elss',
          label: '80C Equity Linked Savings Scheme (ELSS)',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'lifeInsurance',
          label: '80C Life Insurance Premium',
          type: 'number',
          required: false,
          maxLimit: null
        },
        {
          name: 'mutualFunds',
          label: '80C Mutual Funds',
          type: 'number',
          required: false,
          maxLimit: null
        }
      ],
      otherDeductions: [
        {
          name: 'housingLoanInterest',
          label: '80EE Additional Interest on housing loan borrowed as on 1st Apr 2016',
          type: 'number',
          required: false,
          maxLimit: 50000
        },
        {
          name: 'politicalDonations',
          label: '80GGC Donations made to Political Party or Electoral Trust',
          type: 'number',
          required: false,
          maxLimit: 999999999
        },
        {
          name: 'npsEmployeeContribution',
          label: '80CCD(1) Employee Contribution to NPS',
          type: 'number',
          required: false,
          maxLimit: 150000
        },
        {
          name: 'medicalTreatmentSenior',
          label: '80DDB Medical Treatment (Specified Disease only)- Senior Citizen',
          type: 'number',
          required: false,
          maxLimit: 100000
        },
        {
          name: 'housingLoanInterest2019',
          label: '80EEA Additional Interest on Housing loan borrowed as on 1st Apr 2019',
          type: 'number',
          required: false,
          maxLimit: 150000
        },
        {
          name: 'scientificDonations',
          label: '80GGA Donations made for Scientific Research or Rural Development',
          type: 'number',
          required: false,
          maxLimit: 999999999
        },
        {
          name: 'evLoanInterest',
          label: '80EEB Interest on Electric Vehicle borrowed as on 1st Apr 2019',
          type: 'number',
          required: false,
          maxLimit: 150000
        },
        {
          name: 'nps2015Contribution',
          label: '80CCD1(B) Contribution to NPS 2015',
          type: 'number',
          required: false,
          maxLimit: 50000
        }
      ],
      hra: [
        {
          name: 'rentPeriodFrom',
          label: 'From',
          type: 'select',
          required: true,
          options: [
            { value: 'Apr 2025', label: 'Apr 2025' },
            { value: 'May 2025', label: 'May 2025' },
            { value: 'Jun 2025', label: 'Jun 2025' },
            { value: 'Jul 2025', label: 'Jul 2025' },
            { value: 'Aug 2025', label: 'Aug 2025' },
            { value: 'Sep 2025', label: 'Sep 2025' },
            { value: 'Oct 2025', label: 'Oct 2025' },
            { value: 'Nov 2025', label: 'Nov 2025' },
            { value: 'Dec 2025', label: 'Dec 2025' },
            { value: 'Jan 2026', label: 'Jan 2026' },
            { value: 'Feb 2026', label: 'Feb 2026' },
            { value: 'Mar 2026', label: 'Mar 2026' }
          ]
        },
        {
          name: 'rentPeriodTo',
          label: 'To',
          type: 'select',
          required: true,
          options: [
            { value: 'Apr 2025', label: 'Apr 2025' },
            { value: 'May 2025', label: 'May 2025' },
            { value: 'Jun 2025', label: 'Jun 2025' },
            { value: 'Jul 2025', label: 'Jul 2025' },
            { value: 'Aug 2025', label: 'Aug 2025' },
            { value: 'Sep 2025', label: 'Sep 2025' },
            { value: 'Oct 2025', label: 'Oct 2025' },
            { value: 'Nov 2025', label: 'Nov 2025' },
            { value: 'Dec 2025', label: 'Dec 2025' },
            { value: 'Jan 2026', label: 'Jan 2026' },
            { value: 'Feb 2026', label: 'Feb 2026' },
            { value: 'Mar 2026', label: 'Mar 2026' }
          ]
        },
        {
          name: 'monthlyRentAmount',
          label: 'Monthly Rent Amount',
          type: 'number',
          required: true,
          helperText: 'Enter monthly rent amount'
        },
        {
          name: 'houseNameNumber',
          label: 'House Name/Number',
          type: 'text',
          required: false,
          helperText: 'Enter house name or number'
        },
        {
          name: 'streetAreaLocality',
          label: 'Street/Area/Locality',
          type: 'text',
          required: false,
          helperText: 'Enter street, area or locality'
        }
      ],
      medical: [
        {
          name: 'preventiveHealthCheckupDependent',
          label: '80D Preventive Health Checkup - Dependant Parents',
          type: 'number',
          required: false,
          maxLimit: 5000
        },
        {
          name: 'medicalBillsSeniorCitizen',
          label: '80D Medical Bills - Senior Citizen (>60)',
          type: 'number',
          required: false,
          maxLimit: 50000
        },
        {
          name: 'medicalInsurancePremium',
          label: '80D Medical Insurance Premium',
          type: 'number',
          required: false,
          maxLimit: 25000,
          hasAgeField: true,
          ageFieldName: 'medicalInsuranceAge'
        },
        {
          name: 'medicalInsurancePremiumDependent',
          label: '80D Medical Insurance Premium - Dependant Parents',
          type: 'number',
          required: false,
          maxLimit: 25000,
          hasAgeField: true,
          ageFieldName: 'medicalInsuranceDependentAge'
        },
        {
          name: 'preventiveHealthCheckup',
          label: '80D Preventive Health Check-up',
          type: 'number',
          required: false,
          maxLimit: 5000
        }
      ],
      houseProperty: [
        {
          name: 'declaredAmount',
          label: 'Income/Loss from House Property (₹)',
          type: 'number',
          required: true,
          helperText: 'Enter negative value for loss, positive for income'
        },
        {
          name: 'propertyAddress',
          label: 'Property Address',
          type: 'text',
          required: false,
          helperText: 'Address of the property (optional)'
        }
      ],
      otherIncome: [
        {
          name: 'declaredAmount',
          label: 'Other Income Amount (₹)',
          type: 'number',
          required: true,
          helperText: 'Enter the amount of other income'
        },
        {
          name: 'incomeSource',
          label: 'Income Source',
          type: 'text',
          required: true,
          helperText: 'Describe the source of income'
        }
      ],
      tcsTds: [
        {
          name: 'declaredAmount',
          label: 'TCS/TDS Amount (₹)',
          type: 'number',
          required: true,
          helperText: 'Enter the TCS/TDS amount deducted'
        },
        {
          name: 'deductorName',
          label: 'Deductor Name',
          type: 'text',
          required: true,
          helperText: 'Name of the person/entity who deducted TDS'
        }
      ]
    };
    return fieldConfigs[categoryId] || [];
  };

  // Validation schemas for different declaration types
  const getValidationSchema = (categoryId) => {
    const baseSchema = {
      declaredAmount: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large')
    };

    const specificSchemas = {
      sec80c: Yup.object({
        npsContribution: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        tuitionFees: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        nscDeposit: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        postOfficeDeposit: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        nscInterest: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        infrastructureBonds: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        fixedDeposit: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        pensionFund: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        nssDeposit: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        elss: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        lifeInsurance: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        mutualFunds: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large')
      }),
      otherDeductions: Yup.object({
        housingLoanInterest: Yup.number().min(0, 'Amount cannot be negative').max(50000, 'Maximum limit is ₹50,000'),
        politicalDonations: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        npsEmployeeContribution: Yup.number().min(0, 'Amount cannot be negative').max(150000, 'Maximum limit is ₹1,50,000'),
        medicalTreatmentSenior: Yup.number().min(0, 'Amount cannot be negative').max(100000, 'Maximum limit is ₹1,00,000'),
        housingLoanInterest2019: Yup.number().min(0, 'Amount cannot be negative').max(150000, 'Maximum limit is ₹1,50,000'),
        scientificDonations: Yup.number().min(0, 'Amount cannot be negative').max(999999999, 'Amount is too large'),
        evLoanInterest: Yup.number().min(0, 'Amount cannot be negative').max(150000, 'Maximum limit is ₹1,50,000'),
        nps2015Contribution: Yup.number().min(0, 'Amount cannot be negative').max(50000, 'Maximum limit is ₹50,000')
      }),
      hra: Yup.object({
        rentPeriodFrom: Yup.string().required('Rent period from is required'),
        rentPeriodTo: Yup.string().required('Rent period to is required'),
        monthlyRentAmount: Yup.number().required('Monthly rent amount is required').min(0, 'Rent cannot be negative'),
        houseNameNumber: Yup.string(),
        streetAreaLocality: Yup.string()
      }),
      medical: Yup.object({
        preventiveHealthCheckupDependent: Yup.number().min(0, 'Amount cannot be negative').max(5000, 'Maximum limit is ₹5,000'),
        medicalBillsSeniorCitizen: Yup.number().min(0, 'Amount cannot be negative').max(50000, 'Maximum limit is ₹50,000'),
        medicalInsurancePremium: Yup.number().min(0, 'Amount cannot be negative').max(25000, 'Maximum limit is ₹25,000'),
        medicalInsuranceAge: Yup.string(),
        medicalInsurancePremiumDependent: Yup.number().min(0, 'Amount cannot be negative').max(25000, 'Maximum limit is ₹25,000'),
        medicalInsuranceDependentAge: Yup.string(),
        preventiveHealthCheckup: Yup.number().min(0, 'Amount cannot be negative').max(5000, 'Maximum limit is ₹5,000')
      }),
      houseProperty: Yup.object({
        declaredAmount: Yup.number().required('Amount is required').max(999999999, 'Amount is too large'),
        propertyAddress: Yup.string()
      }),
      otherIncome: Yup.object({
        ...baseSchema,
        incomeSource: Yup.string().required('Income source is required').min(3, 'Income source must be at least 3 characters')
      }),
      tcsTds: Yup.object({
        ...baseSchema,
        deductorName: Yup.string().required('Deductor name is required').min(3, 'Deductor name must be at least 3 characters')
      })
    };

    return specificSchemas[categoryId] || Yup.object(baseSchema);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Custom icon components
  const CustomIcon = ({ icon, color, size = 20 }) => {
    if (icon === '80') {
      return (
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          80
        </Box>
      );
    }

    if (icon === 'house-dollar') {
      return (
        <Box sx={{ position: 'relative' }}>
          <IconHome size={size} color={color} />
          <Box
            sx={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography sx={{ fontSize: '6px', color: 'white', fontWeight: 'bold' }}>₹</Typography>
          </Box>
        </Box>
      );
    }

    if (icon === 'medical-cross') {
      return (
        <Box
          sx={{
            width: size,
            height: size,
            border: `1.5px solid ${color}`,
            borderRadius: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              width: '60%',
              height: 1.5,
              backgroundColor: color,
              position: 'absolute'
            }}
          />
          <Box
            sx={{
              width: 1.5,
              height: '60%',
              backgroundColor: color,
              position: 'absolute'
            }}
          />
        </Box>
      );
    }

    if (icon === 'house-loss') {
      return (
        <Box sx={{ position: 'relative' }}>
          <IconHome size={size} color={color} />
          <Box
            sx={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconMinus size={6} color="white" />
          </Box>
        </Box>
      );
    }

    return null;
  };

  const filteredCategories = declarationCategories.filter((category) => category.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <MainCard title="IT Declaration" subtitle="My Tax Planner">
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={20} color="#6b7280" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: '#f9fafb',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e7eb'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6'
              }
            }
          }}
          size="medium"
        />
      </Box>

      {/* Main Grid Layout */}
      <Grid2 container spacing={3}>
        {/* Left Column - Declaration Categories */}
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Grid2 container spacing={1.5}>
            {filteredCategories.map((category, index) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    height: 160,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: category.gradient,
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      borderColor: category.color
                    }
                  }}
                >
                  {/* Header with title and icons */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography variant="h6" fontWeight={600} fontSize={15} sx={{ color: '#111827', lineHeight: 1.2 }}>
                      {category.title}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      {category.hasEdit && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCategory(category);
                            setOpenDialog(true);
                          }}
                        >
                          <IconEdit size={22} color="#6b7280" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {/* Icon and Content */}
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        flexShrink: 0
                      }}
                    >
                      {typeof category.icon === 'string' ? (
                        <CustomIcon icon={category.icon} color={category.color} size={20} />
                      ) : (
                        <category.icon size={20} color={category.color} />
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {category.isAddButton ? (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#3b82f6',
                            fontWeight: 500,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Add to declaration
                        </Typography>
                      ) : (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5, lineHeight: 1.2 }}>
                            {category.isLoss ? 'Total Loss' : category.maxLimit ? 'Declared Amount / Max limit in ₹' : 'Declared Amount'}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem', lineHeight: 1.2 }}>
                            {category.isLoss
                              ? `-${formatCurrency(Math.abs(category.declaredAmount))}`
                              : category.maxLimit
                                ? `${formatCurrency(category.declaredAmount)} / ${formatCurrency(category.maxLimit)}`
                                : formatCurrency(category.declaredAmount)}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>

        {/* Right Column - Summary Grid */}
        <Grid2 size={{ xs: 12, lg: 6 }}>
          {/* Declaration Categories Accordions */}
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#111827', mb: 2 }}>
              Apr 2025
            </Typography>
            {accordionData.map((category) => (
              <Accordion
                key={category.id}
                elevation={0}
                sx={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px !important',
                  mb: 1,
                  '&:before': {
                    display: 'none'
                  },
                  '&.Mui-expanded': {
                    margin: '0 0 8px 0'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<IconChevronDown size={20} color="#6b7280" />}
                  sx={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    minHeight: 48,
                    '&.Mui-expanded': {
                      minHeight: 48,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '8px 0',
                      alignItems: 'center'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ color: '#111827' }}>
                      {category.title}
                    </Typography>
                    {category.maxLimit && (
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                        Max Limit in ₹: {formatCurrency(category.maxLimit)}
                      </Typography>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2, backgroundColor: '#ffffff' }}>
                  {category.items.map((item, index) => (
                    <Box key={index} sx={{ mb: item.details ? 2 : 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#111827', fontSize: '0.875rem' }}>
                          {item.name}
                        </Typography>
                        {item.amount !== null && (
                          <Typography variant="body2" fontWeight={500} sx={{ color: '#111827', fontSize: '0.875rem' }}>
                            {formatCurrency(item.amount)}
                          </Typography>
                        )}
                      </Box>

                      {item.details && (
                        <Box sx={{ ml: 2, pl: 2, borderLeft: '2px solid #e5e7eb' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                              From - To
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                              Annual Rent in ₹
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#111827', fontSize: '0.8rem' }}>
                              {item.details.period}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#111827', fontSize: '0.8rem' }}>
                              {formatCurrency(item.details.annualRent)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                              Monthly Rent in ₹
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                              Full Address
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#111827', fontSize: '0.8rem' }}>
                              {formatCurrency(item.details.monthlyRent)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#111827', fontSize: '0.8rem' }}>
                              {item.details.address}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Declaration Status */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid #3b82f6',
                backgroundColor: '#fef3c7',
                p: 2.5,
                mb: 2
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#111827' }}>
                  Declaration Status : LOCKED
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#3b82f6',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Hide
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                You have declared on 21 Apr 2025, and you cannot withdraw it
              </Typography>
            </Paper>

            {/* Regime Information */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                p: 2.5,
                mb: 2
              }}
            >
              <Typography variant="body1" sx={{ color: '#111827', fontSize: '0.875rem' }}>
                Your IT declaration is considered as per the Old Regime
              </Typography>
            </Paper>

            {/* Download Link */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Download Form 12BB
              </Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>

      <DeclarationEditDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        category={selectedCategory}
        getFormFields={getFormFields}
        getValidationSchema={getValidationSchema}
        onSubmit={async (values, category) => {
          // TODO: Replace with API call to persist changes
          // Example: await api.updateDeclaration(category.id, values)
          return Promise.resolve();
        }}
      />
    </MainCard>
  );
};

export default Declarations;
