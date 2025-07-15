import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CustomInput = ({
  id,
  placeholder,
  type = 'text',
  touched,
  errors,
  InputProps,
  maxWidth,
  width,
  autoComplete,
  textColor,
  multiline,
  maxRows,
  rows,
  onBlur,
  name,
  label,
  required,
  inputProps,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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

  // Custom onChange to filter input if pattern is set
  const handleInputChange = (e) => {
    if (inputProps && inputProps.pattern === '[0-9]*') {
      // Block if any non-digit character is present
      if (/[^0-9]/.test(e.target.value)) {
        return;
      }
    } else if (inputProps && inputProps.pattern) {
      const regex = new RegExp(inputProps.pattern);
      if (!regex.test(e.target.value) && e.target.value !== '') {
        return;
      }
    }
    if (onChange) onChange(e);
  };

  return (
    <TextField
      sx={{
        maxWidth,
        '& .MuiInputLabel-root': {
          fontSize: '14px'
        },
        '& .MuiInputBase-input': {
          fontSize: '15px',
          color: textColor || 'inherit'
        }
      }}
      onBlur={onBlur}
      name={name}
      id={id}
      autoComplete={autoComplete}
      placeholder={placeholder}
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      fullWidth
      variant="outlined"
      size="small"
      error={Boolean(touched && errors)}
      helperText={touched && errors ? <span style={{ color: 'red' }}>{errors}</span> : null}
      InputProps={{
        ...InputProps,
        endAdornment:
          type === 'password' ? (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ) : null
      }}
      multiline={multiline}
      rows={rows}
      maxRows={maxRows}
      label={renderedLabel}
      inputProps={inputProps}
      onChange={handleInputChange}
      {...props}
    />
  );
};

export default CustomInput;
