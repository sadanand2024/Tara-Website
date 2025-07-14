import React from 'react';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

const CustomAutocomplete = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  name,
  textColor,
  getOptionKey,
  customTextField,
  required,
  ...props
}) => {
  return (
    <>
      {label && (
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: '1rem' }}>{label}</span>
          {required && <span style={{ color: 'red' }}> *</span>}
        </div>
      )}
      <Autocomplete
        size="small"
        value={value}
        onChange={onChange}
        options={options}
        disableClearable
        getOptionKey={(option) => (getOptionKey ? getOptionKey(option) : option.id || option)}
        renderInput={(params) =>
          customTextField ? (
            customTextField(params)
          ) : (
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '15px',
                  color: textColor || 'inherit' // Apply text color
                }
              }}
              {...params}
              error={error}
              helperText={helperText}
              fullWidth
              required={required}
            />
          )
        }
        {...props}
      />
    </>
  );
};

export default CustomAutocomplete;
