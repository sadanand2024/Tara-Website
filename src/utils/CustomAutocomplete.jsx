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
  // Render label with red asterisk if required
  let renderedLabel = label;
  if (label && required) {
    renderedLabel = (
      <span>
        {label}
        <span style={{ color: 'red' }}> *</span>
      </span>
    );
  }

  const getOptionLabel = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    return option.label || option.value || option;
  };

  const isOptionEqualToValue = (option, value) => {
    if (typeof option === 'string' && typeof value === 'string') {
      return option === value;
    }
    return option.value === value.value;
  };

  return (
    <Autocomplete
      size="small"
      value={value}
      onChange={onChange}
      options={options}
      disableClearable
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={(props, option) => {
        // Use a unique key for each option
        let key = typeof option === 'string' ? option : option.value || option.label;
        return (
          <li {...props} key={key}>
            {getOptionLabel(option)}
          </li>
        );
      }}
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
            label={renderedLabel}
          />
        )
      }
      {...props}
    />
  );
};

export default CustomAutocomplete;
