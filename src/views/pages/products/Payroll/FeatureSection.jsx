import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';

// project imports
import FadeInWhenVisible from '../../landing/Animation';
import { ThemeMode } from 'config';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';

// assets (replace with payroll related images or use same for demo)
import Offer1 from 'assets/images/landing/offer/offer-1.png';
import Offer2 from 'assets/images/landing/offer/offer-2.png';
import Offer3 from 'assets/images/landing/offer/offer-3.png';
import Offer4 from 'assets/images/landing/offer/offer-4.png';
import Offer5 from 'assets/images/landing/offer/offer-5.png';
import Offer6 from 'assets/images/landing/offer/offer-6.png';

function OfferCard({ title, caption, image }) {
  const theme = useTheme();
  const AvaterSx = { bgcolor: 'transparent', color: 'secondary.main', width: 48, height: 48 };

  return (
    <FadeInWhenVisible>
      <SubCard
        sx={{
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.100',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease'
          },
          height: 1,
          p: 2,
          minHeight: 200
        }}
      >
        <Stack spacing={2}>
          <Avatar variant="rounded" sx={AvaterSx}>
            <CardMedia component="img" src={image} alt={title} sx={{ maxHeight: 32, width: 'auto' }} />
          </Avatar>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {caption}
            </Typography>
          </Stack>
        </Stack>
      </SubCard>
    </FadeInWhenVisible>
  );
}

// =============================|| PAYROLL FEATURE SECTION ||============================= //

export default function FeatureSection() {
  return (
    <Container>
      <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
        <Grid sx={{ textAlign: 'center' }} size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1.5}>
            <Grid size={12}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Why Choose Tarafirst Payroll?
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                Tarafirst Payroll helps you run compliant payrolls effortlessly. From automated calculations and payslips to statutory
                filings, it's built to save you time and ensure peace of mind.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={3} sx={{ justifyContent: 'center', '&> .MuiGrid-root > div': { height: '100%' } }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard
                title="Automated Payroll Processing"
                caption="Calculate salaries, TDS, PF, and more in seconds with a click."
                image={Offer1}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard
                title="One-Click Payslip Generation"
                caption="Download and distribute professional payslips instantly."
                image={Offer2}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard title="Compliance Made Easy" caption="File PF, ESI, and TDS returns with full accuracy." image={Offer3} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard
                title="Self-Service for Employees"
                caption="Let your team view payslips, tax summaries, and apply leaves."
                image={Offer4}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard
                title="Smart Salary Structuring"
                caption="Customize CTC components and optimize for tax efficiency."
                image={Offer5}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard
                title="Payroll Insights & Reports"
                caption="Track costs, deductions, and generate real-time MIS reports."
                image={Offer6}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard title="Leave & Attendance Sync" caption="Integrate attendance data to auto-adjust payouts." image={Offer1} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <OfferCard
                title="Statutory Compliance Vault"
                caption="Maintain and access all compliance filings in one place."
                image={Offer2}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

OfferCard.propTypes = { title: PropTypes.string, caption: PropTypes.string, image: PropTypes.string };
