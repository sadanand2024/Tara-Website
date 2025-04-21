import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import CardMedia from '@mui/material/CardMedia';
import taralogoWhite from 'assets/images/taralogoWhite.png'; // Tarafirstlogo_png
import { Typography } from '@mui/material';

export default function TaraWhiteLogo() {
  return (
    <Typography component={RouterLink} to="/" aria-label="theme-logo">
      <CardMedia component="img" src={taralogoWhite} alt="defaultLayout" sx={{ width: 200 }} />
    </Typography>
  );
}
