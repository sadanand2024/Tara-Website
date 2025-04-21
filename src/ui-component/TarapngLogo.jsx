import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import CardMedia from '@mui/material/CardMedia';
import Tarafirstlogo_png from 'assets/images/Tarafirstlogo_png.png'; // Tarafirstlogo_png
import { Typography } from '@mui/material';

export default function TarapngLogo() {
  return (
    <Typography component={RouterLink} to="/" aria-label="theme-logo">
      <CardMedia component="img" src={Tarafirstlogo_png} alt="defaultLayout" sx={{ width: 200 }} />
    </Typography>
  );
}
