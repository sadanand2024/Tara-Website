import { Box, Container, Grid, Typography } from '@mui/material';
import Business from 'assets/images/icons/Business.svg';
import Certification from 'assets/images/icons/Certification.svg';
import GstIcon from 'assets/images/icons/Gst.svg';
import Incometax from 'assets/images/icons/Incometax.svg';
import Incorporation from 'assets/images/icons/Incorporation.svg';
import Notice from 'assets/images/icons/Notice.svg';
import Tds from 'assets/images/icons/TDS.svg';
import Underline from 'assets/images/icons/Underline.svg';
import Visa from 'assets/images/icons/Visa.svg';
import React, { useState } from 'react';

const services = [
  { icon: <img src={GstIcon} alt="GST" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'GST', desc: 'Simplify GST filing and compliance with expert support.' },
  { icon: <img src={Incometax} alt="Income" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'Income Tax', desc: 'Accurate income tax filing and advisory made easy.' },
  { icon: <img src={Incorporation} alt="Incorporation" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'Incorporation', desc: 'Start your business journey with seamless company registration.' },
  { icon: <img src={Certification} alt="Certifications" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'Certifications', desc: 'Get essential business certifications without the hassle.' },
  { icon: <img src={Business} alt="Business Licenses" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'Business Licenses', desc: 'Secure the right licenses to operate and grow legally.' },
  { icon: <img src={Tds} alt="TDS" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'TDS', desc: 'Effortless TDS filing and compliance management.' },
  { icon: <img src={Notice} alt="Notice Management" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'Notice Management', desc: 'Handle legal and tax notices professionally and on time.' },
  { icon: <img src={Visa} alt="Visa Documentation" style={{ width: '2.2rem', height: '2.2rem' }} />, title: 'Visa Documentation', desc: 'Comprehensive documentation support for student and business visas.' }
];

const ServicesSection = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <Box sx={{
      background: '#F8F9FB',
      py: 6,
      fontFamily: "'Inter', Arial, sans-serif"
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 ,mt: 3}}>
          <Typography variant="h1" sx={{ m: 0, position: 'relative' }}>
            <Box component="span" sx={{
              color: '#FFD600',
              fontWeight: 500,
              fontSize: '2.5rem',
              letterSpacing: '-1px',
              position: 'relative',
              display: 'inline-block',
            }}>
              All-in-One
              <Box
                component="img"
                src={Underline}
                alt="Underline"
                sx={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-6px',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </Box>
            <Box component="span" sx={{
              color: '#0033CC',
              fontWeight: 700,
              fontSize: '2.5rem',
              ml: 2,
              
            }}>Financial & Compliance Services</Box>
          </Typography>
          <Typography sx={{
            color: '#222',
            fontFamily: 'Inter, sans-serif',
            fontSize: { xs: '16px', sm: '18px', md: '20px' },
            lineHeight: '150%',
            fontWeight: '500',
            // color: 'text.secondary',
            mt:3,
           
          }}>
            From GST, Income Tax, and Incorporation to TDS, Certifications, and Visa Documentation — manage everything seamlessly with Tara First.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, idx) => {
            const isHovered = hoverIndex === idx;
            return (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                  sx={{
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: isHovered
                      ? '0 4px 16px rgba(0,51,204,0.10)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    p: 3,
                    textAlign: 'left',
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)'
                  }}
                >
                  <Box sx={{
                    color: '#0033CC',
                    fontSize: '2.2rem',
                    mb: 2.25,
                    flexShrink: 0
                  }}>{service.icon}</Box>
                  <Typography sx={{
                    color: '#0039B5',
                    fontWeight: 700,
                    fontSize: '1.18rem',
                    mb: 1,
                    flexShrink: 0
                  }}>{service.title}</Typography>
                  <Typography sx={{
                    color: '#222',
                    fontSize: '1rem',
                    fontWeight: 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    flexGrow: 1
                  }}>{service.desc}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;