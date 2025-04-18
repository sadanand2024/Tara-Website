import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Stack, CardMedia, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

import FadeInWhenVisible from '../../../landing/Animation';
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

const offers = [
  {
    title: 'Can I register a private limited company alone?',
    caption: 'Yes. A minimum of two directors is required, but one person can hold both roles in some cases.',
    image: Offer1
  },
  {
    title: 'Can foreign nationals or NRIs be directors or shareholders?',
    caption: 'Yes, they can—with some additional formalities like notarized documents and proof of address.',
    image: Offer2
  },
  {
    title: 'Can I convert my company to an LLP or other structure later?',
    caption: 'Yes. Conversions are allowed but may require compliance checks and formalities.',
    image: Offer3
  },
  {
    title: 'How long does it take to incorporate a Pvt Ltd company?',
    caption: 'Typically 5–7 working days, provided all documents are in order.',
    image: Offer4
  },
  {
    title: 'What if my company name gets rejected?',
    caption: 'We offer one free name resubmission to improve your chances of approval.',
    image: Offer5
  },
  {
    title: 'Will someone from your team help me throughout the process?',
    caption: 'Absolutely. A dedicated Relationship Manager will guide you at every step.',
    image: Offer6
  }
];

// =============================|| OFFER CARD ||============================= //

const OfferCard = ({ title, caption, image }) => {
  const theme = useTheme();
  const avatarSx = {
    bgcolor: 'transparent',
    color: 'secondary.main',
    width: 56,
    height: 56
  };

  return (
    <FadeInWhenVisible>
      <SubCard
        sx={{
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.100',
          borderColor: 'divider',
          '&:hover': { boxShadow: 'none' },
          height: '100%'
        }}
      >
        <Stack spacing={4}>
          <Avatar variant="rounded" sx={avatarSx}>
            <CardMedia component="img" src={image} alt={title} />
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
};

OfferCard.propTypes = {
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
};

// =============================|| FEATURE SECTION ||============================= //

export default function FeatureSection() {
  return (
    <Container>
      <Grid container spacing={7.5} justifyContent="center">
        <Box>
          <Typography variant="h1" fontWeight={700} gutterBottom>
            Your Concerns, Answered
          </Typography>
          <Typography variant="h3" color="text.secondary" gutterBottom>
            These are real questions founders like you had. We answered them and helped them launch, pick the right structure, and determine
            eligibility. This is how they decide if a Pvt Ltd company is right for them.
          </Typography>
        </Box>

        <Grid size={12}>
          <Grid container spacing={5} justifyContent="center" sx={{ '& > .MuiGrid2-root > div': { height: '100%' } }}>
            {offers.map((offer, idx) => (
              <Grid key={idx} size={{ md: 4, sm: 6 }}>
                <OfferCard {...offer} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={12} sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontSize: '1rem', mb: 2 }}>
            Still unsure? Talk to an expert.
          </Typography>
          <Button variant="contained" color="primary">
            Book a Free Call
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
