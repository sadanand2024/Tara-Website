import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';

const CustomDatePicker = ({ label, value, onChange, error, helperText, width = '100%', size = 'small', onBlur, ...params }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        format="DD-MM-YYYY"
        onBlur={onBlur}
        slotProps={{
          textField: {
            error: Boolean(error), // Ensure boolean conversion
            helperText: helperText,
            size: size,
            sx: { width }
          }
        }}
        {...params}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
