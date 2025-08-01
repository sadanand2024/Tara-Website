import React from 'react';
import TextField from '@mui/material/TextField';

export default function SearchBar({ value, onChange, placeholder = 'Search...', sx = {}, ...props }) {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{ minWidth: 200, ...sx }}
      {...props}
    />
  );
}
