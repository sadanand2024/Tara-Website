import { Box, Button, Grid, Typography } from '@mui/material';
// import balance from 'assets/images/landing/balance.png';
import balance from 'assets/images/icons/balance.svg';
import React from 'react';

const DemoSection = () => {
  return (
    <Box
      sx={{
        backgroundColor:'rgb(247, 243, 224)',
        borderRadius: '50px',
        padding: '30px 20px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        color: '#002366',
        maxWidth: '1100px',
        margin: '40px auto',
        position: 'relative',
        overflow: 'visible',
        
      }}
    >
    
      <Typography
        textAlign="center"
      variant="h1"
     gutterBottom
     sx={{
    fontFamily: 'Manrope, sans-serif',
    fontSize: '30px',
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
        variant="contained"
        sx={{
          backgroundColor: '#FFD41C',
          borderRadius: '8px',
          padding: '12px 28px',
          fontSize: '1rem',
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
            width: '800px',
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