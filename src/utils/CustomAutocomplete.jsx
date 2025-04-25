import React from 'react';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

const CustomAutocomplete = ({ label, value, onChange, options, error, helperText, name, textColor, ...props }) => {
  return (
    <Autocomplete
      size="small"
      value={value}
      onChange={onChange}
      options={options}
      disableClearable
      renderInput={(params) => (
        <TextField
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '15px',
              color: textColor || 'inherit' // Apply text color
            }
          }}
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          fullWidth
        />
      )}
      {...props}
    />
  );
};

export default CustomAutocomplete;
