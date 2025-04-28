import React from 'react';
import { Box, Typography, Grid2, Paper, ClickAwayListener, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const services = [
  {
    title: 'Income Tax & TDS',
    color: 'teal',
    items: [
      { label: 'ITR filing', path: '/services/income-tax/itr-filing' },
      { label: 'Notice Management', path: '/services/income-tax/notice-management' },
      { label: 'TDS Return filing', path: '/services/income-tax/tds-return' },
      { label: 'Advance Tax', path: '/services/income-tax/advance-tax' },
      { label: 'Tax Consultation', path: '/services/income-tax/consultation' },
      { label: 'Form 15CA/CB filing', path: '/services/income-tax/form-15ca-cb' },
      { label: '+More', path: '/services/income-tax' }
    ]
  },
  {
    title: 'Accounting & VCFO',
    color: 'indigo',
    items: [
      { label: 'Virtual CFO', path: '/services/accounting/vcfo' },
      { label: 'Bookkeeping', path: '/services/accounting/bookkeeping' },
      { label: 'Invoicing', path: '/services/accounting/invoicing' },
      { label: 'Fix My Books', path: '/services/accounting/fix-my-books' },
      { label: 'Inventory management', path: '/services/accounting/inventory-management' },
      { label: 'MIS & Analytics', path: '/services/accounting/mis-analytics' },
      { label: '+More', path: '/services/accounting' }
    ]
  },
  {
    title: 'Business Registration / Licenses',
    color: 'salmon',
    items: [
      { label: 'Private Limited Company', path: '/services/registration/private-limited' },
      { label: 'MSME registration', path: '/services/registration/msme-registration' },
      { label: 'Startup India registration', path: '/services/registration/startup-india' },
      { label: 'Labour license', path: '/services/registration/labour-license' },
      { label: 'Trade license', path: '/services/registration/trade-license' },
      { label: 'IEC registration', path: '/services/registration/iec' },
      { label: '+More', path: '/services/registration' }
    ]
  },
  {
    title: 'ROC & Legal',
    color: 'orange',
    items: [
      { label: 'Annual filings (AoA, MoA)', path: '/services/legal/annual-filings' },
      { label: 'Director change', path: '/services/legal/director-change' },
      { label: 'DIR 3 KYC', path: '/services/legal/dir3-kyc' },
      { label: 'Draft Board Resolution', path: '/services/legal/board-resolution' },
      { label: 'Agreement Drafting', path: '/services/legal/agreement-drafting' },
      { label: 'RERA', path: '/services/legal/rera' },
      { label: '+More', path: '/services/legal' }
    ]
  },
  {
    title: 'Advisory',
    color: 'purple',
    items: [
      { label: 'Financial Modelling', path: '/services/advisory/financial-modelling' },
      { label: 'Pitch deck', path: '/services/advisory/pitch-deck' },
      { label: 'Valuation', path: '/services/advisory/valuation' },
      { label: 'Financial due diligence', path: '/services/advisory/due-diligence' },
      { label: 'Internal Audit', path: '/services/advisory/internal-audit' },
      { label: 'Working Capital Management', path: '/services/advisory/working-capital' },
      { label: '+More', path: '/services/advisory' }
    ]
  },
  {
    title: 'Payroll & Compliance',
    color: 'darkgreen',
    items: [
      { label: 'Payroll preparation / Processing', path: '/services/payroll/payroll-processing' },
      { label: 'Salary structuring', path: '/services/payroll/salary-structuring' },
      { label: 'Employee ITR filing (bulk)', path: '/services/payroll/employee-itr-filing' },
      { label: 'EPF/ESI Registration', path: '/services/payroll/epf-esi-registration' },
      { label: 'EPF/ESI / PT Filings', path: '/services/payroll/pt-registration' },
      { label: 'Employee / Group Insurance', path: '/services/payroll/employee-insurance' },
      { label: '+More', path: '/services/payroll' }
    ]
  },
  {
    title: 'GST',
    color: 'orangered',
    items: [
      { label: 'GST Registration', path: '/services/gst/registration' },
      { label: 'GST Return filing', path: '/services/gst/return-filing' },
      { label: 'Notice Management', path: '/services/gst/notice-management' },
      { label: 'Cancellation / Revocation', path: '/services/gst/cancellation-revocation' },
      { label: 'GST Refund', path: '/services/gst/refund' },
      { label: 'LUT filing', path: '/services/gst/lut-filing' },
      { label: '+More', path: '/services/gst' }
    ]
  },
  {
    title: 'Fund & Wealth',
    color: 'darkmagenta',
    items: [
      { label: 'Loan', path: '/services/wealth/loan' },
      { label: 'Investments', path: '/services/wealth/investments' },
      { label: 'Insurance', path: '/services/wealth/insurance' },
      { label: 'Retirement planning', path: '/services/wealth/retirement' },
      { label: 'Wealth Advisory', path: '/services/wealth/advisory' },
      { label: 'FHI', path: '/services/wealth/fhi' },
      { label: '+More', path: '/services/wealth' }
    ]
  }
];
const MotionPaper = motion(Paper);

const panelVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
const ServicesPanel = ({ onClose }) => {
  return (
    <AnimatePresence>
      <ClickAwayListener onClickAway={onClose}>
        <MotionPaper
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          sx={{
            position: 'absolute',
            maxHeight: '80vh',
            overflowY: 'auto',
            top: '100%',
            left: 0,
            width: '100vw',
            zIndex: 1100,
            backgroundColor: 'background.paper',
            px: { xs: 2, sm: 4, md: 10 },
            py: { xs: 3, sm: 5 },
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0 8px 12px -4px rgba(0, 0, 0, 0.45)' // ✅ bottom shadow only
          }}
        >
          <Container>
            <Grid2 container spacing={4}>
              {services.map((section, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: section.color,
                      textTransform: 'uppercase',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 1,
                      mb: 1
                    }}
                  >
                    {section.title}
                  </Typography>
                  {section.items.map((item, i) => (
                    <Typography
                      key={i}
                      component={RouterLink}
                      to={item.path}
                      onClick={onClose}
                      variant="body2"
                      sx={{
                        display: 'block',
                        mb: 1,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'text.primary',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: section.color
                        }
                      }}
                    >
                      {item.label}
                    </Typography>
                  ))}
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </MotionPaper>
      </ClickAwayListener>
    </AnimatePresence>
  );
};

export default ServicesPanel;
