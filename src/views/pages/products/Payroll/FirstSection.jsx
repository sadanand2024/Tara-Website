import ReceiptIcon from '@mui/icons-material/Receipt';
import BadgeIcon from '@mui/icons-material/Badge';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// third party
import { Carousel } from 'react-responsive-carousel';

// project imports
import { ThemeMode } from 'config';

// assets
import { IconChevronRight, IconChevronLeft, IconLink } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

import SliderLight1 from 'assets/images/landing/pre-apps/slider-light-1.png';
import SliderDark1 from 'assets/images/landing/pre-apps/slider-dark-1.png';
import SliderLight2 from 'assets/images/landing/pre-apps/slider-light-2.png';
import SliderDark2 from 'assets/images/landing/pre-apps/slider-dark-2.png';
import SliderLight3 from 'assets/images/landing/pre-apps/slider-light-3.png';
import SliderDark3 from 'assets/images/landing/pre-apps/slider-dark-3.png';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// styles
const Images = styled('img')({
  width: '100%',
  height: 'auto',
  marginBottom: 32,
  backgroundSize: 'cover',
  objectFit: 'cover'
});

function SampleNextArrow(props) {
  const theme = useTheme();
  const { onClickHandler } = props;

  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        bgcolor: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        right: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
      aria-label="button"
    >
      <IconChevronRight fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}

function SamplePrevArrow(props) {
  const theme = useTheme();
  const { onClickHandler } = props;

  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        bgcolor: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        left: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
      aria-label="button"
    >
      <IconChevronLeft fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}

function Items({ title, caption, image, link }) {
  return (
    <>
      <Images
        src={image}
        alt="dashboard"
        sx={{
          width: { xs: '100%', xl: 743 },
          objectFit: 'contain',
          direction: 'initial'
        }}
      />
      <Stack spacing={1} sx={{ pt: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          component={Link}
          to={link}
          target="_blank"
          sx={{ alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
        >
          <Typography variant="h3" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <IconButton size="small" sx={{ color: 'text.primary' }}>
            <IconLink aria-label="link button" size={18} />
          </IconButton>
        </Stack>
        <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: { xs: '1rem', xl: '1.125rem' } }}>
          {caption}
        </Typography>
      </Stack>
    </>
  );
}

export default function PreBuildDashBoard() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('id');

  return (
    <>
      <Grid container sx={{ justifyContent: 'center', px: 1.25, gap: 7.5, py: 12.5 }}>
        <Grid sx={{ textAlign: 'center' }} size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1.5}>
            <Grid size={12}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                <Typography variant="h1" fontWeight={700} gutterBottom>
                  Smart Payroll That Pays Off
                </Typography>
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="h4" maxWidth={700} mx="auto">
                Automate salary processing, compliance filings, payslip generation, and employee management — all in one unified payroll
                system.
              </Typography>
            </Grid>
            <Grid size={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => navigate(`/register?id=${moduleId}`)}
                >
                  Get Started with Payroll
                </Button>
                <Button size="large" variant="contained" color="secondary">
                  Request Demo
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Box
            className="preBuildDashBoard-slider"
            sx={{
              direction: 'initial',
              '.slider': { height: { xs: 'auto' }, '& .slide:not(.selected)': { transformOrigin: 'center !important' } }
            }}
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              showIndicators={false}
              centerMode={downMD ? false : true}
              centerSlidePercentage={50}
              infiniteLoop={true}
              autoFocus={true}
              emulateTouch={true}
              swipeable={true}
              autoPlay={true}
              interval={2000}
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && <SamplePrevArrow onClickHandler={onClickHandler} hasPrev={hasPrev} label={label} />
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && <SampleNextArrow onClickHandler={onClickHandler} hasNext={hasNext} label={label} />
              }
            >
              <Items
                title="Blog Dashboard"
                image={theme.palette.mode === ThemeMode.DARK ? SliderDark1 : SliderLight1}
                link="/dashboard/blog"
              />
              <Items title="Calender" image={theme.palette.mode === ThemeMode.DARK ? SliderDark2 : SliderLight2} link="/apps/calendar" />
              <Items title="Chat App" image={theme.palette.mode === ThemeMode.DARK ? SliderDark3 : SliderLight3} link="/apps/chat" />
            </Carousel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

Items.propTypes = { title: PropTypes.string, caption: PropTypes.string, image: PropTypes.string, link: PropTypes.string };
