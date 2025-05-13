import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import BusinessIcon from '@mui/icons-material/Business';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import PaymentIcon from '@mui/icons-material/Payment';
import PieChartIcon from '@mui/icons-material/PieChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SchoolIcon from '@mui/icons-material/School';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { ThemeMode } from 'config';
import FooterSection from '../landing/FooterSection';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Extended FAQ categories
const faqCategories = [
  'Financial Statements',
  'Taxation',
  'Auditing',
  'Bookkeeping',
  'Payroll',
  'Compliance',
  'Business Registration',
  'Investment & Banking',
  'Financial Planning',
  'Risk Management',
  'Corporate Finance',
  'International Accounting',
  'Forensic Accounting',
  'Management Accounting',
  'Cost Accounting',
  'Financial Analysis',
  'Budgeting',
  'Financial Reporting',
  'Asset Management',
  'Financial Technology'
];

const categoryIcons = {
  'Financial Statements': <AssessmentIcon />,
  Taxation: <ReceiptIcon />,
  Auditing: <AccountBalanceIcon />,
  Bookkeeping: <SchoolIcon />,
  Payroll: <PaymentIcon />,
  Compliance: <BusinessIcon />,
  'Business Registration': <AccountBalanceWalletIcon />,
  'Investment & Banking': <TrendingUpIcon />,
  'Financial Planning': <AccountBalanceIcon />,
  'Risk Management': <BusinessIcon />,
  'Corporate Finance': <TrendingUpIcon />,
  'International Accounting': <AccountBalanceWalletIcon />,
  'Forensic Accounting': <AssessmentIcon />,
  'Management Accounting': <SchoolIcon />,
  'Cost Accounting': <ReceiptIcon />,
  'Financial Analysis': <TrendingUpIcon />,
  Budgeting: <PaymentIcon />,
  'Financial Reporting': <AssessmentIcon />,
  'Asset Management': <AccountBalanceWalletIcon />,
  'Financial Technology': <BusinessIcon />
};

// Sample FAQ data (extended with more categories)
const faqData = {
  'Financial Statements': [
    {
      question: 'What are the key components of a balance sheet?',
      answer:
        "A balance sheet consists of three main components: Assets (what the company owns), Liabilities (what the company owes), and Shareholders' Equity (the residual interest in assets after deducting liabilities).",
      helpful: 45,
      notHelpful: 5
    },
    {
      question: 'How do I prepare a cash flow statement?',
      answer:
        'A cash flow statement is prepared by analyzing changes in cash and cash equivalents from operating activities, investing activities, and financing activities over a specific period.',
      helpful: 38,
      notHelpful: 2
    }
  ],
  Taxation: [
    {
      question: 'What are the different types of taxes a business needs to pay?',
      answer:
        'Businesses typically need to pay income tax, GST/VAT, payroll taxes, property taxes, and other industry-specific taxes depending on their location and business type.',
      helpful: 52,
      notHelpful: 8
    },
    {
      question: 'How do I calculate taxable income?',
      answer:
        'Taxable income is calculated by subtracting allowable deductions and exemptions from gross income. The specific calculation method varies by tax jurisdiction and business structure.',
      helpful: 41,
      notHelpful: 4
    }
  ],
  Auditing: [
    {
      question: 'What is the purpose of an audit?',
      answer:
        "An audit provides an independent examination of financial statements to ensure they present a true and fair view of the company's financial position and performance.",
      helpful: 47,
      notHelpful: 3
    },
    {
      question: 'What are the different types of audits?',
      answer:
        'Common types of audits include financial audits, internal audits, external audits, compliance audits, and operational audits.',
      helpful: 39,
      notHelpful: 1
    }
  ],
  'Financial Planning': [
    {
      question: 'What is financial planning?',
      answer:
        'Financial planning is the process of creating a comprehensive plan to meet your financial goals and objectives. It involves analyzing your current financial situation, setting goals, and developing strategies to achieve those goals.',
      helpful: 42,
      notHelpful: 3
    }
  ],
  'Risk Management': [
    {
      question: 'What is risk management in finance?',
      answer:
        "Risk management in finance involves identifying, analyzing, and mitigating potential risks that could affect an organization's financial performance. This includes market risk, credit risk, operational risk, and liquidity risk.",
      helpful: 38,
      notHelpful: 2
    }
  ]
};

const categoryData = [
  {
    icon: <AccountBalanceIcon fontSize="large" sx={{ color: '#3f51b5' }} />,
    title: 'Financial Statements',
    desc: 'Learn about balance sheets, income statements, and more.'
  },
  {
    icon: <ReceiptIcon fontSize="large" sx={{ color: '#009688' }} />,
    title: 'Taxation',
    desc: 'Tax rules, filing, and compliance for businesses.'
  },
  {
    icon: <AssessmentIcon fontSize="large" sx={{ color: '#ff5722' }} />,
    title: 'Auditing',
    desc: 'Understand audit processes and requirements.'
  },
  {
    icon: <PaymentIcon fontSize="large" sx={{ color: '#4caf50' }} />,
    title: 'Payroll',
    desc: 'Payroll management, salary, and compliance.'
  },
  {
    icon: <TrendingUpIcon fontSize="large" sx={{ color: '#fbc02d' }}/>,
    title: 'Investment & Banking',
    desc: 'Investments, banking, and financial growth.'
  },
  {
  icon: <BusinessCenterIcon fontSize="large" sx={{ color: '#ff9800' }} />, // Orange
  title: 'Business Strategy',
  desc: 'Planning, market positioning, and competitive analysis.'
},
{
  icon: <GavelIcon fontSize="large" sx={{ color: '#607d8b' }} />, // Blue Grey
  title: 'Regulatory Compliance',
  desc: 'Stay compliant with local and international laws.'
},
  {
    icon: <SchoolIcon fontSize="large"  sx={{ color: '#9c27b0' }}  />,
    title: 'Bookkeeping',
    desc: 'Bookkeeping basics and best practices.'
  }
];

const generalFaqs = [
  {
    question: 'What can I do with the Invoicing feature?',
    answer:
      'With our invoicing tool, you can create and send professional invoices, track payment statuses, set payment reminders, and accept online payments from clients.'
  },
  {
    question: 'Can I automate salary payments using the Payroll module?',
    answer:
      'Yes, the Payroll module allows you to automate monthly salary disbursements, calculate tax deductions, generate payslips, and stay compliant with statutory regulations.'
  },
  {
    question: 'How secure is my data in the Document Vault?',
    answer:
      'All documents are stored with bank-level encryption, and you have full control over who can view, edit, or share your files. We also keep a version history and backup of every document.'
  },
  {
    question: 'Can I integrate Invoicing with my accounting software?',
    answer:
      'Yes, our invoicing system supports integration with popular accounting tools to automatically sync your financial data and reduce manual work.'
  },
  {
    question: 'Does the Payroll system support compliance with local tax laws?',
    answer:
      'Absolutely. Our Payroll module is regularly updated to reflect the latest tax laws and labor regulations, ensuring accurate tax calculation and compliance reporting.'
  },
  {
    question: 'What types of documents can I store in the Document Vault?',
    answer:
      'You can store a wide range of documents, including contracts, invoices, compliance files, tax returns, employee records, and more. The system supports PDF, Word, Excel, image files, and ZIPs.'
  }
];


const billingFaqs = [
  {
    question: 'How does the billing cycle work?',
    answer: 'You can choose between monthly or annual billing cycles. Invoices are automatically generated at the start of each cycle based on your subscription plan.'
  },
  {
    question: 'Can I customize the invoices I send to clients?',
    answer: 'Yes, you can fully customize your invoices — including logo, colors, tax settings, and terms — to match your brand and business needs.'
  },
  {
    question: 'Do you support GST and other tax formats on invoices?',
    answer: 'Yes, our system supports GST, VAT, and other region-specific tax formats. You can configure tax rates and apply them to individual invoice items.'
  },
  {
    question: 'What payment methods do you support for client invoices?',
    answer: 'Clients can pay invoices via credit/debit cards, bank transfers, UPI, and integrated payment gateways depending on your region and setup.'
  },
  {
    question: 'Can I track when a client views or pays an invoice?',
    answer: 'Yes, the system provides real-time tracking so you can see when an invoice is viewed, paid, or becomes overdue. You can also set automated reminders.'
  },
  {
    question: 'How do I update my billing information or payment method?',
    answer: 'You can update your billing address and payment method at any time from the Billing section under your Account Settings.'
  }
];


const FinanceIllustration = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0
        }}
      />

      {/* Main Dashboard Illustration */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          height: '300px',
          background: 'white',
          borderRadius: 2,
          boxShadow: theme.shadows[4],
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          zIndex: 1,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
            '100%': { transform: 'translateY(0px)' }
          }
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          <AccountBalanceIcon color="primary" />
          <Typography variant="subtitle1" fontWeight="bold">
            Financial Dashboard
          </Typography>
        </Box>

        {/* Charts Section */}
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
          {/* Left Chart */}
          <Box
            sx={{
              flex: 1,
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 1,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">
              Revenue
            </Typography>
          </Box>

          {/* Middle Chart */}
          <Box
            sx={{
              flex: 1,
              background: alpha(theme.palette.secondary.main, 0.1),
              borderRadius: 1,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PieChartIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
            <Typography variant="caption" color="text.secondary">
              Expenses
            </Typography>
          </Box>

          {/* Right Chart */}
          <Box
            sx={{
              flex: 1,
              background: alpha(theme.palette.success.main, 0.1),
              borderRadius: 1,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShowChartIcon sx={{ fontSize: 40, color: 'success.main' }} />
            <Typography variant="caption" color="text.secondary">
              Growth
            </Typography>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Box
            sx={{
              flex: 1,
              background: alpha(theme.palette.info.main, 0.1),
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AttachMoneyIcon sx={{ color: 'info.main' }} />
            <Typography variant="caption" color="text.secondary">
              Balance
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              background: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CurrencyExchangeIcon sx={{ color: 'warning.main' }} />
            <Typography variant="caption" color="text.secondary">
              Exchange
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const KnowledgePage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedGeneral, setExpandedGeneral] = useState(false);
  const [expandedBilling, setExpandedBilling] = useState(false);
   const [searchParams] = useSearchParams();
      const navigate = useNavigate();
      const service_id = searchParams.get('id');
      const service_type = searchParams.get('type');

    const handleChatClick = () => {
    navigate(`/book-consultation?id=${service_id}&context=${service_type}&type=service`);
  };
  const handleQuestionClick =( )=> {
     navigate('/pages/contact-us');
  };

  // Filter FAQs based on search query and selected category
  const filteredFaqs = Object.entries(faqData).reduce((acc, [category, faqs]) => {
    if (!selectedCategory || category === selectedCategory) {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    }
    return acc;
  }, {});

  // Filter categories based on search
  const filteredCategories = faqCategories.filter((category) => category.toLowerCase().includes(categorySearch.toLowerCase()));

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const handleFeedback = (category, question, isHelpful) => {
    setFeedback((prev) => ({
      ...prev,
      [`${category}-${question}`]: isHelpful
    }));
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const CategoryList = () => (
    <List sx={{ width: '100%', pt: 0 }}>
      {filteredCategories.map((category) => (
        <ListItem
          key={category}
          button
          onClick={() => {
            setSelectedCategory(category);
            if (isMobile) setDrawerOpen(false);
          }}
          selected={selectedCategory === category}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'secondary.light',
              color: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.light'
              },
              '& .MuiListItemIcon-root': {
                color: 'secondary.main'
              }
            },
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{categoryIcons[category]}</ListItemIcon>
          <ListItemText
            primary={category}
            primaryTypographyProps={{
              fontWeight: selectedCategory === category ? 600 : 400
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{  minHeight: '100vh', pb: 6, pt:2 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: '#e9edfb',
          borderRadius: 4,
          maxWidth: 1200,
          mx: 'auto',
          mt: 6,
          mb: 4,
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          gap: 4,
          boxShadow: 0
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" fontWeight={700} color="#1a237e" gutterBottom>
            Looking for help? Here are our most frequently asked questions.
          </Typography>
          <Typography color="#3949ab" sx={{ mt:5 }}>
            Everything you need to know about Financial Accounting and our services. Can't find the answer to a question you have? No
            worries, just click "I've got a question" or "Chat to our team"!
          </Typography>
        </Box>
       
      </Box>

      {/* Action Buttons */}
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
               onClick={handleQuestionClick}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                py: 2,
                bgcolor: 'white',
                borderColor: '#3949ab',
                color: '#3949ab',
                '&:hover': { bgcolor: '#e9edfb', borderColor: '#1a237e', color: '#1a237e' }
              }}
            >
              I've got a question
            </Button>
          </Grid>
         <Grid item xs={12} md={6}>
      <Button
        fullWidth
        variant="contained"
        size="large"
        endIcon={<ArrowForwardIcon />}
        onClick={handleChatClick}
        sx={{
          borderRadius: 3,
          fontWeight: 600,
          py: 2,
          bgcolor: '#3949ab',
          color: 'white',
          '&:hover': { bgcolor: '#1a237e' }
        }}
      >
        Chat to our team
      </Button>
    </Grid>
        </Grid>
      </Container>

      {/* Category Cards */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ background: '#e9edfb', borderRadius: 4, p: { xs: 2, md: 4 } }}>
          <Grid container spacing={3}>
            {categoryData.map((cat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={cat.title}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 0,
                    bgcolor: 'white',
                    textAlign: 'center',
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 3, bgcolor: '#f6f8fd' }
                  }}
                >
                  <Box sx={{ mb: 2 }}>{cat.icon}</Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#1a237e" sx={{ mb: 1 }}>
                    {cat.title}
                  </Typography>
                  <Typography variant="body2" color="#3949ab">
                    {cat.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* FAQ Sections */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ background:'rgb(58, 72, 158)', borderRadius: 4, p: { xs: 2, md: 4 }, color: 'white', mb: 2 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: 'white' }}>
                General FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'white', opacity: 0.85 }}>
                Everything you need to know about the product. Can't find an answer?{' '}
                <Link href="#" color="#b3c6ff" underline="always" sx={{ fontWeight: 500 }} onClick={handleQuestionClick}>
                  Chat to our team.
                </Link>
              </Typography>
              {generalFaqs.map((faq, idx) => (
                <Accordion
                  key={faq.question}
                  expanded={expandedGeneral === idx}
                  onChange={() => setExpandedGeneral(expandedGeneral === idx ? false : idx)}
                  sx={{
                    background: 'transparent',
                    color: 'white',
                    boxShadow: 0,
                    borderBottom: '1px solid #5c6bc0',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                    <Typography fontWeight={600} sx={{ color: 'white' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: 'white', opacity: 0.9 }}>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ background: '#3949ab', borderRadius: 4, p: { xs: 2, md: 4 }, color: 'white', mb: 2 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: 'white' }}>
                Billing FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'white', opacity: 0.85 }}>
                Everything you need to know about billing and invoices. Can't find an answer?{' '}
                <Link href="#" color="#b3c6ff" underline="always" sx={{ fontWeight: 500 }}>
                  Chat to our team.
                </Link>
              </Typography>
              {billingFaqs.map((faq, idx) => (
                <Accordion
                  key={faq.question}
                  expanded={expandedBilling === idx}
                  onChange={() => setExpandedBilling(expandedBilling === idx ? false : idx)}
                  sx={{
                    background: 'transparent',
                    color: 'white',
                    boxShadow: 0,
                    borderBottom: '1px solid #5c6bc0',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                    <Typography fontWeight={600} sx={{ color: 'white' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: 'white', opacity: 0.9 }}>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer (optional, simple version) */}
      {/* <Box sx={{ mt: 8, textAlign: 'center', color: '#b0b8d9', fontSize: 14 }}>
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </Box> */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0 ,textAlign: 'left'}}>
         <FooterSection />
          </Box> 
    </Box>
  );
};

export default KnowledgePage;
