import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const CustomDatePicker = ({ label, value, name, onChange, error, helperText, width = '100%', size = 'small', onBlur, ...params }) => {
  const parsedValue = value ? dayjs(value) : null;

  const handleDateChange = (newValue) => {
    // Handle both direct date picker selection and manual input
    if (newValue && dayjs(newValue).isValid()) {
      onChange(newValue);
    } else {
      onChange(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={parsedValue}
        onChange={handleDateChange}
        slotProps={{
          textField: {
            error: Boolean(error),
            helperText,
            size,
            name,
            onBlur,
            sx: { width },
            inputProps: {
              placeholder: 'DD-MM-YYYY'
            }
          },
          field: {
            clearable: true,
            onClear: () => onChange(null)
          }
        }}
        {...params}
        format="DD-MM-YYYY"
        views={['year', 'month', 'day']}
        closeOnSelect={true}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
