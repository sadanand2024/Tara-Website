import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const CustomDatePicker = ({ label, value, name, onChange, error, helperText, width = '100%', size = 'small', onBlur, ...params }) => {
  const parsedValue = value ? dayjs(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={parsedValue}
        onChange={(newValue) => {
          if (newValue && dayjs(newValue).isValid()) {
            onChange(dayjs(newValue));
          } else {
            onChange(null);
          }
        }}
        format="DD-MM-YYYY"
        openTo="day"
        slotProps={{
          textField: {
            error: Boolean(error),
            helperText,
            size,
            name,
            onBlur,
            sx: { width },
            inputProps: {
              placeholder: 'DD-MM-YYYY',
              maxLength: 10
            }
          },
          actionBar: {
            actions: ['clear', 'accept']
          }
        }}
        {...params}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
