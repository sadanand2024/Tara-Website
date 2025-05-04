'use client';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const PricingPlans = ({ data }) => {
  if (!data) return null;

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  ];

  return (
    <Fade triggerOnce direction="up">
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
        {/* Section Title */}
        <Typography variant="h2" fontWeight={700} textAlign="center" mb={4}>
          {data.title}
        </Typography>

        {/* Responsive Plans Grid */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          {data.plans?.map((plan, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardHeader
                  title={plan.name}
                  subheader={plan.bestFor}
                  titleTypographyProps={{
                    variant: 'h6',
                    fontWeight: 700,
                    color: 'white',
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                  }}
                  subheaderTypographyProps={{
                    color: 'white',
                    fontSize: { xs: '0.7rem', sm: '0.8rem' }
                  }}
                  sx={{
                    background: gradients[idx % gradients.length],
                    py: { xs: 1.5, sm: 2 }
                  }}
                />
                <CardContent sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: { xs: 1.5, sm: 2 }
                }}>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                      mb: 1.5
                    }}
                  >
                    {plan.price}
                  </Typography>
                  {plan.features && (
                    <Box sx={{width: '100%', mt: 1.5}}>
                      {plan.features.map((feature, featureIdx) => (
                        <Typography
                          key={featureIdx}
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 0.5,
                            fontSize: { xs: '0.7rem', sm: '0.8rem' }
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ p: 1.5 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{
                      py: 1,
                      borderRadius: 1.5
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Note Section */}
        {data.note && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            mt={3}
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.8rem' }
            }}
          >
            {data.note}
          </Typography>
        )}
      </Container>
    </Fade>
  );
};

export default PricingPlans;
