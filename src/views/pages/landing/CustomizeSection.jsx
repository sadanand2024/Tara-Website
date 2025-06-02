// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Document from 'assets/images/landing/Document.png';
import invoicing from 'assets/images/landing/invoicing.png';
import payroll from 'assets/images/landing/payroll.png';
import Virtualcfo from 'assets/images/landing/Virtualcfo.png';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// assets

// Placeholder imports for new card images (replace with actual paths)

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

  const [hoveredCard, setHoveredCard] = useState(null);

  const serviceCards = [
    {
      title: 'Invoicing',
      description: 'Generate, customize, and manage invoices seamlessly. Get paid faster with professional invoice solutions.',
      image: invoicing
    },
    {
      title: 'Virtual CFO',
      description: 'Get expert financial oversight, strategic insights, and performance tracking — without hiring a full-time ',
      image: Virtualcfo
    },
    {
      title: 'Payroll',
      description: 'Simplify salary calculations, deductions, and payslip generation for your team in just a few clicks.',
      image: payroll
    },
    {
      title: 'Document Wallet',
      description: 'Securely store, manage, and access all your business documents anytime, anywhere — all in one place.',
      image: Document
    }
  ];

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: -25, }}>
      <Grid container spacing={{ xs:1.5, sm: 2.5, md: 3, lg:5 }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {/* Section title */}

        {/* New Card Section */}
        <Grid size={12} sx={{ mt: { xs:10, md: 10,lg:10 }, ml: { xs:1, lg:2 } }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 10, lg:20 }} justifyContent="center">
            {serviceCards.map((card, index) => (
              <Grid
                key={index}
                size={{ xs: 6, sm: 6, md: 3 }}
                sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0,
                      borderRadius: '8px',
                      bgcolor: '#fff',
                      boxShadow: 1,
                      width: { xs: '181px', sm: '280px', md: '280px', lg: '280px' },
                      height: { xs: '387px', sm: '413px', md: '413px', lg: '413px' },
                      ml: { xs: 0, sm: -4 },
                      mt: { xs: '30px', sm: 0 },
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      position: 'relative',
                      border: '1px solid #e0e0e0',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={card.image}
                      alt={card.title}
                      sx={{
                        width: { xs: '181px', sm: '280px', md: '280px', lg: '280px' },
                        height: { xs: '229px', sm: '289px', md: '289px', lg: '289px' },
                        objectFit: 'cover',
                        display: 'block',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px'
                      }}
                    />
                    <Box
                      sx={{
                        transition: 'transform 0.3s ease-in-out',
                        transform: hoveredCard === index ? 'translateY(-70px)' : 'translateY(0)',
                        bgcolor: '#fff',
                        padding: '20px',
                        position: 'absolute',
                        alignItems: { xs: 'flex-start', sm: 'center', md: 'flex-start', lg: 'flex-start' }, // Fix here
                        width: { xs: '181px', sm: '280px', md: '280px', lg: '280px' },
                        height: { xs: '158px', sm: '115px', md: '115px', lg: '123px' },


                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        // width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        // alignItems: 'flex-start', // ✅ Ensure left alignment
                        textAlign: 'left',
                        fontWeight: 600,

                        borderRadius: '0 0 8px 8px',
                        boxSizing: 'border-box',
                        // height: '115px'
                      }}
                    >
                      <Typography variant="h3" textAlign:left sx={{ mt:-1, mb: 1, color: '#0023AF' }}>
                        {card.title}
                      </Typography>
                        
                      <Typography
                        variant="h5"
                        sx={{
                          mt: 0,
                          mb: 2,
                          fontWeight: 400,
                          color: 'text.secondary',
                          fontStyle: 'Inter',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          alignItems: { xs: 'flex-start', sm: 'center', md: 'flex-start', lg: 'flex-start' } // Fix here
                        }}
                      >
                        {card.description}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="flex-start"sx={{mt:1}} >
                        <Box sx={{ display: { xs: 'block', sm: 'none' }, alignItems: { xs: 'flex-start', sm: 'center', md: 'flex-start', lg: 'flex-start' } // Fix here
 }}>
                          <Typography
                           component={RouterLink}
                        to="/register"
                            variant="h5"
                            sx={{
                              mt: 0,
                              color: '#0023AF',
                              fontWeight: 500,
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            Sign Up &rarr;
                          </Typography>
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Button
                       component={RouterLink}
                        to="/register"
                        variant="contained"
                        color="secondary"
                          sx={{
                          textTransform: 'none',
                          fontWeight: 500,
                            width: '115px',
                            height: '31px',
                            ml:-2,
                            padding: '8px 20px',
                              borderRadius: '4px', // You can customize this
                            minWidth: 'unset', // Optional: remove default minWidth from MUI
                      }}
                        >
                    Try Now
                    </Button>

                          <Button
                           component={RouterLink}
                        to="/book-consultation"
                            variant="Outlined"
                         color="primary"
                          sx={{
                          textTransform: 'none',
                           fontWeight: 500,
                            width: '115px',
                            height: '31px',
                            ml:1,
                            padding: '8px 20px',
                              borderRadius: '4px', // You can customize this
                            minWidth: 'unset', // Optional: remove default minWidth from MUI
                            }}
                          >
                            Know More
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </RouterLink>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
