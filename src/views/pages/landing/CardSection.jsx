// material-ui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

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
    minHeight: 200,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[6]
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 160,
      height: 160,
      border: '25px solid',
      borderColor: 'background.paper',
      opacity: theme.palette.mode === ThemeMode.DARK ? 0.1 : 0.4,
      borderRadius: '50%',
      top: -80,
      right: -80
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 160,
      height: 160,
      border: '2px solid',
      borderColor: 'background.paper',
      opacity: theme.palette.mode === ThemeMode.DARK ? 0.05 : 0.21,
      borderRadius: '50%',
      top: -100,
      right: -30
    },
    '& .MuiCardContent-root': {
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  };

  const landingCards = [
    {
      title: 'Payroll Automation',
      count: 450,
      icon: <PaymentsIcon sx={{ fontSize: '2.5rem', transform: 'rotate(45deg)' }} />,
      bgcolor: 'warning.main',
      color: 'warning.dark'
    },
    {
      title: 'Invoicing Generation',
      count: 189,
      icon: <ReceiptLongIcon sx={{ fontSize: '2.5rem' }} />,
      bgcolor: 'primary.200',
      color: 'primary.main'
    },
    {
      title: 'Business Services',
      count: 80,
      icon: <BusinessIcon sx={{ fontSize: '2.5rem' }} />,
      bgcolor: 'secondary.200',
      color: 'secondary.main'
    },
    {
      title: 'Gst Filings',
      count: 659,
      icon: <AccountBalanceIcon sx={{ fontSize: '2.5rem', transform: 'rotate(45deg)' }} />,
      bgcolor: 'warning.main',
      color: 'warning.dark'
    },
    {
      title: 'Fix My books',
      count: 556,
      icon: <AutoFixHighIcon sx={{ fontSize: '2.5rem' }} />,
      bgcolor: 'primary.200',
      color: 'primary.main'
    },
    {
      title: 'Advance Tax',
      count: 170,
      icon: <CalculateIcon sx={{ fontSize: '2.5rem' }} />,
      bgcolor: 'secondary.200',
      color: 'secondary.main'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ justifyContent: 'center' }}>
        {landingCards.map((card, index) => (
          <Grid key={index} size={{ md: 4, sm: 6, xs: 12 }}>
            <FadeInWhenVisible>
              <SubCard sx={{ bgcolor: card.bgcolor, ...cardSX }}>
                <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: 'background.paper',
                      opacity: theme.palette.mode === ThemeMode.DARK ? 1 : 0.5,
                      color: card.color,
                      height: 65,
                      width: 65,
                      borderRadius: '14px',
                      boxShadow: theme.shadows[3]
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        color: theme.palette.mode === ThemeMode.DARK ? 'dark.900' : 'grey.900',
                        mb: 0.5
                      }}
                    >
                      <CountUp end={card.count} duration={2.5} suffix="+" enableScrollSpy scrollSpyOnce />
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        color: theme.palette.mode === ThemeMode.DARK ? 'dark.900' : 'grey.900'
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                </Stack>
              </SubCard>
            </FadeInWhenVisible>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
