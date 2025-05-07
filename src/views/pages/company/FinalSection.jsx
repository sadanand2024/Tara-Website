import { Box, Stack, Typography } from '@mui/material';
import Company2 from 'assets/images/company/Company2.png';
import Company3 from 'assets/images/company/Company3.png';
import Company4 from 'assets/images/company/Company4.png';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const fontFamily = 'Inter, Poppins, Roboto, Helvetica Neue, Arial, sans-serif';

const FinalSection= () => (
  <Box sx={{ py: 8, mt: -10, px: { xs: 2, md: 8 }, background: '#fff', width: '100%', fontFamily }}>
    {/* Mission Section */}
    <Fade cascade direction="up" triggerOnce>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start" sx={{ mb: 8 }}>
        <Box flex={1} mb={{ xs: 3, md: 0 }}>
          <Typography sx={{ textAlign: 'left', fontWeight: 600, fontFamily, fontSize: { xs: '1.7rem', md: '2.2rem' }}}>
            Mission
          </Typography>
          <Typography
            sx={{
              textAlign: 'left',
              fontFamily,
              fontSize: { xs: '1rem', md: '1rem' },
              color: '#3A3A3A',
              lineHeight: 1.7,
              mt: 2
            }}
          >
            We simplify finance and compliance for modern Indian businesses. Our tools reduce complexity, save time, and ensure peace of mind. From startups to enterprises, we empower smart financial growth. With expert-backed services, success is just one platform away.
          </Typography>
        </Box>
        <Box flex={1} display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
          <Box
            component="img"
            src={Company2}
            alt="Mission"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 4,
              boxShadow: 3,
              objectFit: 'cover',
              display: 'block',
              maxWidth: { xs: '100%', md: 420 },
            }}
          />
        </Box>
      </Stack>
    </Fade>

    {/* Vision Section */}
    <Fade cascade direction="up" triggerOnce delay={100}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="stretch" sx={{ mb: 8 }}>
        <Box flex={1} display="flex" justifyContent={{ xs: 'center', md: 'flex-start' }} order={{ xs: 2, md: 1 }}>
          <Box
            component="img"
            src={Company3}
            alt="Vision"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 4,
              boxShadow: 3,
              objectFit: 'cover',
              display: 'block',
              maxWidth: { xs: '100%', md: 420 },
              mt:2,
            }}
          />
        </Box>
        <Box flex={1} order={{ xs: 1, md: 2 }}>
          <Typography sx={{ textAlign: 'left', fontWeight: 600, fontFamily, fontSize: { xs: '1.7rem', md: '2.2rem' }, mb: 1, ml: { xs: 0, md: 10 } }}>
            Vision
          </Typography>
          <Typography
            sx={{
              textAlign: 'left',
              fontFamily,
              fontSize: { xs: '1rem', md: '1rem' },
              color: '#3A3A3A',
              lineHeight: 1.7,
              mt: 2,
              ml: { xs: 0, md: 10 }
            }}
          >
            To be India's most trusted financial infrastructure platform. We envision seamless, tech-driven finance for every business. Transparency, automation, and control—at your fingertips. Tara First powers the future of business finance, today.
          </Typography>
        </Box>
      </Stack>
    </Fade>

    {/* Who we Serve Section */}
    <Fade cascade direction="up" triggerOnce delay={200}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="stretch" sx={{ mb: 8,mt:4 }}>
        <Box flex={1}>
          <Typography sx={{ textAlign: 'left', fontWeight: 600, fontFamily, fontSize: { xs: '1.7rem', md: '2.2rem' }, mb: 1 }}>
            Who we Serve
          </Typography>
          <Typography
            sx={{
              textAlign: 'left',
              fontFamily,
              fontSize: { xs: '1rem', md: '1rem' },
              color: '#3A3A3A',
              lineHeight: 1.7,
              mt: 2
            }}
          >
            we are serve startup,SMEs,and professionals across india.From incorporation to payroll,we simplify every financial step.Chartered accountants and firms trust us to scale their practice.Tara First is built for anyone who wants to run finances sma
          </Typography>
        </Box>
        <Box flex={1} display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
          <Box
            component="img"
            src={Company4}
            alt="Mission"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 4,
              boxShadow: 3,
              objectFit: 'cover',
              display: 'block',
              maxWidth: { xs: '100%', md: 420 },
            }}
          />
        </Box>
      </Stack>
    </Fade>
  </Box>
);

export default FinalSection;
