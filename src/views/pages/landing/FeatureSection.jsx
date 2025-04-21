import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';

// project imports
import FadeInWhenVisible from './Animation';
import { ThemeMode } from 'config';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';

// assets
import Offer1 from 'assets/images/landing/offer/offer-1.png';
import Offer2 from 'assets/images/landing/offer/offer-2.png';
import Offer3 from 'assets/images/landing/offer/offer-3.png';
import Offer4 from 'assets/images/landing/offer/offer-4.png';
import Offer5 from 'assets/images/landing/offer/offer-5.png';
import Offer6 from 'assets/images/landing/offer/offer-6.png';

function OfferCard({ title, caption, image }) {
  const theme = useTheme();
  const AvaterSx = { bgcolor: 'transparent', color: 'secondary.main', width: 56, height: 56 };

  return (
    <FadeInWhenVisible>
      <SubCard
        sx={{
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.100',
          borderColor: 'divider',
          '&:hover': { boxShadow: 'none' },
          height: 1
        }}
      >
        <Stack spacing={4}>
          <Avatar variant="rounded" sx={AvaterSx}>
            <CardMedia component="img" src={image} alt="Beautiful User Interface" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              {caption}
            </Typography>
          </Stack>
        </Stack>
      </SubCard>
    </FadeInWhenVisible>
  );
}

// =============================|| LANDING - FEATURE PAGE ||============================= //

export default function FeatureSection() {
  return (
    <Container>
      <Grid container spacing={7.5} sx={{ justifyContent: 'center' }}>
        <Grid sx={{ textAlign: 'center' }} size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1.5}>
            <Grid size={12}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                What does TaraFirst offer?
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                TaraFirst is your one-stop fintech platform — from company incorporation to compliance, invoicing, payroll, and reporting.
                We simplify complex financial processes so you can focus on growing your business.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={5} sx={{ justifyContent: 'center', '&> .MuiGrid-root > div': { height: '100%' } }}>
            <Grid size={{ md: 4, sm: 6 }}>
              <OfferCard
                title="Smart Company Incorporation"
                caption="TaraFirst simplifies your business formation with automated filing, expert validation, and transparent timelines."
                image={Offer1}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 6 }}>
              <OfferCard
                title="End-to-End Compliance"
                caption="Stay on top of GST, TDS, MCA, and other statutory filings with our intelligent compliance tracker and real-time alerts."
                image={Offer2}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 6 }}>
              <OfferCard
                title="Unified Invoicing & Payments"
                caption="Generate professional invoices, auto-apply GST, track dues, and integrate with payment gateways — all in one place."
                image={Offer3}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 6 }}>
              <OfferCard
                title="Payroll & Employee Management"
                caption="Process salaries, handle compliance, and generate payslips effortlessly with our smart payroll engine."
                image={Offer4}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 6 }}>
              <OfferCard
                title="Virtual CFO & Dashboards"
                caption="Track KPIs, financial health, and burn rate in real-time with actionable dashboards curated by finance experts."
                image={Offer5}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 6 }}>
              <OfferCard
                title="Secure Document Vault"
                caption="Organize all your financial documents in one secure place with smart search, tagging, and sharing controls."
                image={Offer6}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

OfferCard.propTypes = { title: PropTypes.string, caption: PropTypes.string, image: PropTypes.string };
