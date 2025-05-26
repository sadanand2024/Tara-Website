import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import Include_image from 'assets/images/landing/Include_image.png';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const WhatsIncluded = ({ title = "What's Included", items }) => {
  return (
    <Fade triggerOnce direction="up">
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: '60px', md: '125px' } }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: '1150px',
            width: '100%',
            minHeight: { xs: 'auto', md: '505px' },
            borderRadius: { xs: '12px', md: '12px' },
            border: '0.5px solid #0023AF',
            backgroundColor: '#FFFFFF',
            p: 0,
            display: 'flex',
            alignItems: 'stretch',
            gap: '0',
            overflow: 'hidden',
          }}
        >
          <Grid container spacing={{ xs: 0, md: 4 }} alignItems="stretch">
            {/* Left Image */}
            <Grid item xs={12} md={6} sx={{ p: 0, m: 0 ,}}>
              <Box
                component="img"
                src={Include_image}
                alt="Service Features"
                sx={{
                  width: '100%',
                  height: { xs: '300px', md: '100%' },
                  borderRadius: { xs: '12px 12px 0 0', md: '6px 0 0 6px' },
                  objectFit: 'cover',
                  margin: 0,
                  padding: 0,
                  display: 'block',
                }}
              />
            </Grid>

            {/* Right Content */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: { xs: 3, sm: 4, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  gutterBottom
                  sx={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '28px', sm: '32px', md: '38px' },
                    lineHeight: '120%',
                    letterSpacing: '0px',
                    mr: { xs: 0, md: '140px' },
                    color: '#000000',
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  {title}
                </Typography>
                <List dense sx={{ pl: { xs: 0, md: '24px' } }}>
                  {items.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: { xs: '28px', md: '32px' } }}>
                        <CheckIcon sx={{ color: '#1d4ed8', fontSize: { xs: '20px', md: '24px' } }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: { xs: '18px', sm: '20px', md: '22px' },
                          lineHeight: '140%',
                          letterSpacing: '0px',
                          color: '#001033',
                          margin: '2px',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
};

export default WhatsIncluded;
