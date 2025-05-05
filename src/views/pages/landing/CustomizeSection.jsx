// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import { IconCircleCheck } from '@tabler/icons-react';
import DownloadIcon from '@mui/icons-material/Download';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SpeedIcon from '@mui/icons-material/Speed';
import GppGoodIcon from '@mui/icons-material/GppGood';

import LayerLeft from 'assets/images/landing/customization-left.png';
import LayerRight from 'assets/images/landing/customization-right.png';

// ==============================|| LANDING - CUSTOMIZE ||============================== //

export default function CustomizeSection() {
  const listSX = {
    display: 'flex',
    gap: '0.7rem',
    padding: '10px 0',
    fontSize: '1rem',
    color: 'grey.900',
    svg: { color: 'secondary.main', minWidth: 20 }
  };
  const benefitCards = [
    {
      title: 'Optimized Tax Efficiency',
      description:
        'Leverage built-in intelligence to reduce tax liabilities across GST, TDS, and Income Tax. Our clients maximize deductions and stay audit-ready year-round.',
      icon: <AccountBalanceWalletIcon sx={{ color: '#ff9800', fontSize: 40 }} />,
      bgColor: '#fff7e6'
    },
    {
      title: 'Faster Financial Workflows',
      description:
        'From invoicing to payroll to filings — automate repetitive tasks and execute processes in a fraction of the time, freeing your team to focus on growth.',
      icon: <SpeedIcon sx={{ color: '#43a047', fontSize: 40 }} />,
      bgColor: '#eaffea'
    },
    {
      title: 'Proactive Compliance Engine',
      description:
        'Stay ahead of deadlines with intelligent alerts, real-time rule updates, and end-to-end compliance workflows — built by financial experts for Indian regulations.',
      icon: <GppGoodIcon sx={{ color: '#e91e63', fontSize: 40 }} />,
      bgColor: '#ffeaf3'
    }
  ];

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3, lg: 5 }} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid sx={{ img: { width: '100%' } }} size={{ xs: 12, md: 6 }}>
          <Stack sx={{ width: '75%', mb: 5, mx: 'auto' }}>
            <CardMedia component="img" image={LayerLeft} alt="Layer" />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', md: '3rem' },
                  color: '#26334D'
                }}
              >
                Redefining Financial Simplicity with Tara First
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                  fontSize: '1.15rem',
                  zIndex: '99',
                  width: { xs: '100%', sm: '100%', md: 'calc(100% - 20%)' },
                  mt: 2
                }}
              >
                Tara First empowers individuals and businesses to take control of their finances through a unified fintech platform that
                combines expert support, modern tools, and automated compliance — making finance stress-free and streamlined.
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                  fontSize: '1.1rem',
                  zIndex: '99',
                  width: { xs: '100%', sm: '100%', md: 'calc(100% - 20%)' },
                  mt: 2
                }}
              >
                All your financial essentials. One powerful dashboard.
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography sx={listSX}>
                <IconCircleCheck size={20} />
                <b>All-in-One Dashboard</b>{' '}
              </Typography>
              <Typography sx={listSX}>
                <IconCircleCheck size={20} />
                <b>Smart Automation + Expert Advice</b>{' '}
              </Typography>
              <Typography sx={listSX}>
                <IconCircleCheck size={20} />
                <b>Security & Compliance First</b>{' '}
              </Typography>
              <Typography sx={listSX}>
                <IconCircleCheck size={20} />
                <b>Built for Businesses & Individuals</b>{' '}
              </Typography>
              <Button
                sx={{
                  boxShadow: 'none',
                  background: '#673ab7',
                  my: 4,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5
                }}
                variant="contained"
                component={Link}
                href="#success-stories"
                size="small"
              >
                See Tara First in Action
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12} sx={{ mt: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', md: '3rem' },
                  color: '#26334D'
                }}
              >
                All our products at Tara First are designed to deliver
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mt: { xs: 6, md: 10 } }} justifyContent="center">
            {benefitCards.map((card, index) => (
              <Grid key={index} item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    borderRadius: 3,
                    bgcolor: '#f8fafc',
                    boxShadow: 1,
                    height: '100%'
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: card.bgColor,
                      borderRadius: '50%',
                      p: 2,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 1
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, color: '#26334D' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 300 }}>
                    {card.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
