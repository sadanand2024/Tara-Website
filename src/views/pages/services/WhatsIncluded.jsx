import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Include_image from 'assets/images/landing/Include_image.png';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const WhatsIncluded = ({ title = "What's Included", items }) => {
  return (
    <Fade triggerOnce direction="up">
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: '60px', md: '60px' } }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: '1150px',
            width: '100%',
            borderRadius: '20px',
            border: '0.5px solid #0023AF',
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            height:'60%',
            
          }}
        >
          <Grid container sx={{ minHeight: { xs: 'auto', md: '400px' },minWidth: { xs: 'auto', md: '600px' } }}>
            {/* Left Image - exactly half width and full height */}
            <Grid xs={12} md={6}>
              <Box
                sx={{
                  width: '548px',
                  height: '100%',
                  display: 'flex',
                }}
              >
                <Box
                  component="img"
                  src={Include_image}
                  alt="Service Features"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            </Grid>

            {/* Right Content */}
            <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ p: { xs: 3, sm: 4, md: 4 }, width: '600px' }}>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: { xs: '24px', sm: '28px', md: '28px' },
                    lineHeight: '120%',
                    color: '#000000',
                    mt: { xs:2, md: -5 },
                  }}
                >
                  {title}
                </Typography>
                <Box sx={{mt:-8}}>
                <List dense sx={{mt:10}}>
                  {items.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <CheckIcon sx={{ color: '#1d4ed8' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: { xs: '16px', md: '18px' },
                          color: '#001033',
                          
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
};

export default WhatsIncluded;
