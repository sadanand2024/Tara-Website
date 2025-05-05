// material-ui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// project imports
import FadeInWhenVisible from './Animation';
import { ThemeMode } from 'config';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';

// third party
import CountUp from 'react-countup';

// assets
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CalculateIcon from '@mui/icons-material/Calculate';

// =============================|| LANDING - CARD SECTION ||============================= //

export default function CardSection() {
  const theme = useTheme();

  const cardSX = {
    overflow: 'hidden',
    position: 'relative',
    border: 'none',
    height: 1,
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 150,
      height: 150,
      border: '35px solid',
      borderColor: 'background.paper',
      opacity: theme.palette.mode === ThemeMode.DARK ? 0.1 : 0.4,
      borderRadius: '50%',
      top: -72,
      right: -63
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 150,
      height: 150,
      border: '2px solid',
      borderColor: 'background.paper',
      opacity: theme.palette.mode === ThemeMode.DARK ? 0.05 : 0.21,
      borderRadius: '50%',
      top: -97,
      right: -3
    },
    '& .MuiCardContent-root': {
      padding: '20px 38px 20px 30px'
    }
  };

  const landingCards = [
    {
      title: 'Payroll Automation',
      count: 150,
      icon: <PaymentsIcon sx={{ fontSize: '2.25rem', transform: 'rotate(45deg)' }} />,
      bgcolor: 'warning.main',
      color: 'warning.dark'
    },
    {
      title: 'Invoicing Engine',
      count: 11,
      icon: <ReceiptLongIcon sx={{ fontSize: '2.25rem' }} />,
      bgcolor: 'primary.200',
      color: 'primary.main'
    },
    {
      title: 'Business Services',
      count: 170,
      icon: <BusinessIcon sx={{ fontSize: '2.25rem' }} />,
      bgcolor: 'secondary.200',
      color: 'secondary.main'
    },
    {
      title: 'Gst Filings',
      count: 150,
      icon: <AccountBalanceIcon sx={{ fontSize: '2.25rem', transform: 'rotate(45deg)' }} />,
      bgcolor: 'warning.main',
      color: 'warning.dark'
    },
    {
      title: 'Fix My books',
      count: 11,
      icon: <AutoFixHighIcon sx={{ fontSize: '2.25rem' }} />,
      bgcolor: 'primary.200',
      color: 'primary.main'
    },
    {
      title: 'Advance Tax',
      count: 170,
      icon: <CalculateIcon sx={{ fontSize: '2.25rem' }} />,
      bgcolor: 'secondary.200',
      color: 'secondary.main'
    }
  ];

  return (
    <Container>
      <Grid container spacing={{ xs: 3, sm: 5 }} sx={{ justifyContent: 'center', textAlign: 'center' }}>
        {landingCards.map((card, index) => (
          <Grid key={index} size={{ md: 4, sm: 6, xs: 12 }}>
            <FadeInWhenVisible>
              <SubCard sx={{ bgcolor: card.bgcolor, ...cardSX }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: 'background.paper',
                      opacity: theme.palette.mode === ThemeMode.DARK ? 1 : 0.5,
                      color: card.color,
                      height: 60,
                      width: 60,
                      borderRadius: '12px'
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Stack sx={{ alignItems: 'flex-end' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 800,
                        fontSize: '2.5rem',
                        zIndex: '99',
                        color: theme.palette.mode === ThemeMode.DARK ? 'dark.900' : 'grey.900'
                      }}
                    >
                      <CountUp end={card.count} duration={2.5} suffix="+" enableScrollSpy scrollSpyOnce />
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 500,
                        fontSize: '1.120rem',
                        textAlign: 'end',
                        color: theme.palette.mode === ThemeMode.DARK ? 'dark.900' : 'grey.900'
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Stack>
                </Stack>
              </SubCard>
            </FadeInWhenVisible>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
