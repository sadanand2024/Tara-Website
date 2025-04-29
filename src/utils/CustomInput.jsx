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
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
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
      {...props}
    />
  );
};

export default CustomInput;
