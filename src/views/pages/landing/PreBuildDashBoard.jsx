import { Box, Button, Grid, Typography } from '@mui/material';
// import balance from 'assets/images/landing/balance.png';
import balance from 'assets/images/icons/balance.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';



const DemoSection = () => {
  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'block' }, 
        backgroundColor:'rgb(247, 243, 224)',
        borderRadius: '50px',
        padding: '30px 20px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        color: '#002366',
        maxWidth: '1240px',
        margin: '40px auto',
        position: 'relative',
        overflow: 'visible',
        mt: { xs: 0, sm: 0, md: 0, lg:5 },
        py: { xs: 4, sm: 6, md: 8, lg: -40 },
        
         
        
      }}
    >
    
      <Typography
        textAlign="center"
      variant="h1"
     gutterBottom
     sx={{
    fontFamily: 'Inter',
    fontSize: '36px',
    lineHeight: '53px',
    lineWidth: '200%',
    fontWeight: 500,
    color:'#00266B',
    
  }}
>
  See how Tara First can Make <br />
        a difference for your management
</Typography>

      {/* Button */}
      <Button
       component={RouterLink}
      to="/book-consultation"
        variant="contained"
        sx={{
          backgroundColor: '#FFD41C',
          borderRadius: '10px',
          padding: '12px 28px',
          fontSize: '18px',
          fontWeight: 500,

          color: '#00266B',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#f7c600',
            boxShadow: 'none',
          },
          mt: 2,
          boxShadow: 'none',
        }}
      >
        Schedule your personalized demo
      </Button>

      {/* Image Below the Box */}
      <Grid container justifyContent="center">
        <Box
          component="img"
          src={balance}
          alt="Demo Illustration"
          sx={{
            width: '900px',
            height: '280px',
            objectFit: 'contain',
            position: 'relative',
            bottom: '-60px',
            mt:5,
          }}
        />
      </Grid>
    </Box>
  );
};

export default DemoSection;