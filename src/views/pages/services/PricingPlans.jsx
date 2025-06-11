'use client';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PricingPlans = ({ data }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const service_id = searchParams.get('id');
  const service_type = searchParams.get('type');
  if (!data) return null;

  // const gradients = [
  //   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  //   'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  //   'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  // ];

  return (
    <Fade triggerOnce direction="up">
      <Container sx={{ 
        py: { xs: 0,sm:1},
        mt:{xs:0,sm:-6}
        // background: 'linear-gradient(270.18deg, rgba(184, 198, 255, 0.5) 0.15%, #FDFDFF 99.85%)'
      }}>
        {/* Section Title */}
        <Typography 
          variant="h2" 
          fontWeight={700}
          textAlign="center"
          mb={4}
          sx={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '38px',
            lineHeight: '100%',
            letterSpacing: '0px',
            color: '#000000',
            mt: { xs: 0, lg:2},
            
          }}
        >
          {data.title}
        </Typography>

        {/* Responsive Plans Grid */}
        <Grid container spacing={{ xs: 2, md: 5 }} justifyContent="center" sx={{  mt:{xs:0,lg:5}}}>
          {data.plans?.map((plan, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                  paddingTop: '45px',
                  paddingRight: '16px',
                  paddingBottom: '2px',
                  paddingLeft: '16px',
                  background: '#FFFFFF'
                }}
              >
                <CardHeader
                  title={plan.name}
                  subheader={plan.bestFor}
                  titleTypographyProps={{
                    variant: 'h6',
                    fontWeight: 800,
                    color: '#001033',
                    fontSize: '20px',
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    fontFamily: 'Inter',
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
                  }}
                  subheaderTypographyProps={{
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    fontFamily: 'Inter',
                    color: '#1F242E',
                    mt:{xs:0,lg:1.5},
                    textAlign: 'left',
                    whiteSpace: 'normal'
                  }}
                  sx={{
                    background: '#FFFFFF',
                    py: { xs: 1.5, sm: 2 },
                    mt:{xs:0,lg:-5},
                    
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: { xs: 1.5, sm: 2 },
                    width: '100%',
                    padding: '0 16px'
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{
                      fontSize: '26px',
                      lineHeight: '100%',
                      letterSpacing: '0px',
                      fontFamily: 'Inter',
                      color: '#001033',
                      mb: 1.5,
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'clip'
                    }}
                  >
                    {plan.price}
                  </Typography>
                  {plan.features && (
                    <Box sx={{ width: '100%', mt: 1.5, flexGrow: 1 }}>
                      {plan.features.map((feature, featureIdx) => (
                        <Typography
                          key={featureIdx}
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 0.5,
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            textAlign: 'left'
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ p:0.1, mt: 'auto', justifyContent: {
      xs: 'center',  // center on mobile
      sm: 'flex-start'  // left-aligned on tablet and above
    }, padding: '0 16px 28px 16px' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    sx={{
                      width: '200px',
                      height: '43px',
                      margin: '0 !important',
                      borderRadius: '4px',
                      paddingTop: '12px',
                      paddingRight: '20px',
                      paddingBottom: '12px',
                      paddingLeft: '20px',
                      bgcolor: '#0042D1',
                      color: '#FFFFFF',
                      '&:hover': {
                        bgcolor: '#0035A8'
                      }
                    }}
                    onClick={(e) => {
                      navigate(`/register?id=${service_id}&context=${service_type}&type=service`);
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
        {/* {data.note && (
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
        )} */}
      </Container>
    </Fade>
  );
};

export default PricingPlans;
