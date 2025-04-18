import BadgeIcon from '@mui/icons-material/Badge';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PricingComponent from '../../../pricing/PricingComponent';
import { Box, Typography } from '@mui/material';

const planList = [
  'Company Name Application',
  'DSCs + DINs',
  'MOA + AOA Drafting',
  'Incorporation Filings',
  'PAN + TAN',
  'Certificate of Incorporation',
  'Email/Chat Support',
  'Phone RM Support',
  'ROC Filing Guidance',
  'GST Registration',
  'Startup India Registration',
  'ESIC + PF + PT Guidance',
  'Consultations (Tax/Legal)',
  'Compliance Calendar',
  'Fast Track Support',
  'Turnaround < 5 Days'
];

const plans = [
  {
    title: 'Basic',
    icon: (
      <BadgeIcon
        sx={{ fontSize: 48, color: 'primary.main' }} // Blue by default
      />
    ),
    description: 'All essential incorporation services.',
    price: '5,999',
    permission: [0, 1, 2, 3, 4, 5, 6]
  },

  {
    title: 'Standard',
    icon: (
      <SupervisorAccountIcon
        sx={{ fontSize: 48, color: '#673AB7' }} // Orange
      />
    ),
    description: 'Everything in Basic, plus added compliance.',
    price: '11,999',
    permission: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    title: 'Premium / Startup PRO',
    icon: (
      <VerifiedUserIcon
        sx={{ fontSize: 48, color: 'success.main' }} // Green
      />
    ),
    description: 'Ideal for startups & high-growth companies.',
    price: '18,499',
    permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    active: true
  }
];

const SecondSection = () => (
  <Box sx={{ py: 5 }}>
    <Typography variant="h1" textAlign="center" gutterBottom>
      Pricing & Plans
    </Typography>
    <Typography variant="h3" color="text.secondary" textAlign="center" mb={4}>
      Choose a plan that fullfills your business needs.
    </Typography>

    <PricingComponent plans={plans} planList={planList} />
  </Box>
);
export default SecondSection;
