import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowRight } from '@tabler/icons-react';

const FirstSection = ({ data }) => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8, backgroundColor: theme.palette.background.default }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h1" color="primary" gutterBottom>
              {data.name}
            </Typography>
            <Typography variant="h4" sx={{ mb: 3 }}>
              {data.description}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              {data.longDescription || data.description}
            </Typography>
            <Button variant="contained" color="primary" size="large" endIcon={<IconArrowRight />} sx={{ px: 4, py: 1.5 }}>
              Get Started
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={data.mainImage || data.images?.light[0]}
              alt={data.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: theme.customShadows.z8
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

FirstSection.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    longDescription: PropTypes.string,
    mainImage: PropTypes.string,
    images: PropTypes.shape({
      light: PropTypes.arrayOf(PropTypes.string),
      dark: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired
};

export default FirstSection;
