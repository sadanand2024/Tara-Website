import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import AutomationIcon from 'assets/images/icons/Automation.svg';
import CommitIcon from 'assets/images/icons/Commit.svg';
import FinancialIcon from 'assets/images/icons/Financial.svg';
import image1 from 'assets/images/landing/image1.png';
import image2 from 'assets/images/landing/image2.png';
import image3 from 'assets/images/landing/image3.png';

import React from 'react';

const TaraFinanceSection = () => {
  return (
    <Box sx={{ backgroundColor: '#f0f4ff', width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          padding: { xs: '20px 16px', sm: '30px 20px', md: '40px 20px' },
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Title Section */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '3rem' },
            fontWeight: 500,
            textAlign: 'center',
            color: '#002366',
            lineHeight: 1.3,
            mb: { xs: 2, sm: 3,lg:3 }
          }}
        >
          Over 150+ professionals and businesses
          <br />
          trust Tara First to manage their finances.
          <br />
          Now it's your turn.
        </Typography>
        <Typography 
          variant="h3" 
          color="#00256B" 
          fontWeight="400" 
          
          mb={4}
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
            
          }}
        >
          Get started with a customized walkthrough
        </Typography>

        {/* Features Section */}
        <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center" mb={{ xs: 3, sm: 4, }}>
          <Grid item xs={12} sm={4}>
            <Box>
              <Box
                sx={{
                  width: { xs: 48, sm: 56, md: 64 },
                  height: { xs: 48, sm: 56, md: 64 },
                  borderRadius: '50%',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: { xs:0, sm: 3, md: 10 },
                  mt:{xs:4}
                }}
              >
                <Box
                  component="img"
                  src={FinancialIcon}
                  alt="Financial Icon"
                  sx={{
                    width: '64px',
                    height: '64px',
                    mb: { xs:14, sm: 0, md:1 }
                  }}
                />
              </Box>
              <Typography 
                variant="body1" 
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  fontWeight: 500,
                  mt: { xs: -6, sm: -7, md: -8 },
                  lineHeight: 1.4
                }}
              >
                Access a complete <br />
                financial dashboard
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Box
                sx={{
                  // backgroundColor: '#fffccf',
                  width: { xs: 48, sm: 56, md: 64 },
                  height: { xs: 48, sm: 56, md: 64 },
                  borderRadius: '50%',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: { xs: 2, sm: 3, md: 10 },
                  mt:{xs:4}
                }}
              >
                <Box
                  component="img"
                  src={AutomationIcon}
                  alt="Automation Icon"
                  sx={{
                    width: '64px',
                    height: '64px',
                    mb: { xs:10, sm: 0, md:1 }
                  }}
                />
              </Box>
              <Typography 
                variant="body1" 
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  fontWeight: 500,
                  mt: { xs: -6, sm: -7, md: -8 },
                  lineHeight: 1.4
                }}
              >
                Uncover automation <br />
                opportunities
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Box
                sx={{
                  // backgroundColor: '#fffccf',
                  width: { xs: 48, sm: 56, md: 64 },
                  height: { xs: 48, sm: 56, md: 64 },
                  borderRadius: '50%',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: { xs: 2, sm: 3, md: 10 },
                  mt:{xs:4}
                }}
              >
                <Box
                  component="img"
                  src={CommitIcon}
                  alt="Commit Icon"
                  sx={{
                    width: '64px',
                    height: '64px',
                    mb: { xs:10, sm: 0, md:1 }
                  }}
                />
              </Box>
              <Typography 
                variant="body1" 
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  fontWeight: 500,
                  mt: { xs: -6, sm: -7, md: -8 },
                  lineHeight: 1.4
                }}
              >
                No commitment, no <br />
                pressure
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Buttons */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: { xs: 4, sm: 6, md: 8 } }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#ffd600',
              color: '#000',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 1, sm: 1.25, md: 1.5 },
              borderRadius: '10px',
              minWidth: { xs: '160px', sm: '180px', md: '200px' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Get a Demo
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#002aff',
              color: '#002aff',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 1, sm: 1.25, md: 1.5 },
              borderRadius: '10px',
              minWidth: { xs: '160px', sm: '180px', md: '200px' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Explore for free
          </Button>
        </Stack>

        {/* Characters */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: { xs: 3, sm: 4, md: 6 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 1, sm: 3, md: 4 },
            mb:{xs:0,mb:0,lg:0}
          
            
          }}
        >
          <Box
            component="img"
            src={image1}
            alt="Left Person"
            sx={{
              height: { xs: '250px', sm: '300px', md: '400px' },
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <Box
            component="img"
            src={image2}
            alt="Middle Person"
            sx={{
              height: { xs: '250px', sm: '300px', md: '400px' },
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <Box
            component="img"
            src={image3}
            alt="Right Person"
            sx={{
              height: { xs: '250px', sm: '300px', md: '400px' },
              width: 'auto',
              objectFit: 'contain',
              mb:{xs:5,lg:0}
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TaraFinanceSection;
