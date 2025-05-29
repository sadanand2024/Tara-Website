import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Define common styles for all custom buttons
const baseButtonStyles = {
  borderRadius: '4px',
  textTransform: 'none',
  '&:hover': {
    opacity: 0.9, // Simple hover effect
  },
};

// Styled components for different button types
const PrimaryButtonLarge = styled(Button)(({ theme }) => ({
  ...baseButtonStyles,
  backgroundColor: '#0042D1',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  padding: '12px 20px', // V: 12, H: 20
  '&:active': {
     backgroundColor: '#0038B0', // Hover & Pressed color
  },
}));

const SecondaryButtonLarge = styled(Button)(({ theme }) => ({
  ...baseButtonStyles,
  backgroundColor: 'transparent',
  color: '#0042D1',
  border: '1px solid #0042D1',
  fontSize: '16px',
  fontWeight: 600,
  padding: '12px 20px', // V: 12, H: 20
   '&:active': {
     borderColor: '#0038B0', // Hover & Pressed color
     color: '#0038B0',
     backgroundColor: 'transparent',
  },
}));


const BaseButton = styled(Button)(({ theme, variant = 'primary' }) => ({
  ...baseButtonStyles,
  fontSize: '14px',
  fontWeight: 600,
  padding: '8px 17px', // V: 8, H: 17
  ...(variant === 'primary' && {
    backgroundColor: '#0042D1',
    color: '#fff',
    '&:active': {
       backgroundColor: '#0038B0',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: 'transparent',
    color: '#0042D1',
    border: '1px solid #0042D1',
     '&:active': {
       borderColor: '#0038B0',
       color: '#0038B0',
       backgroundColor: 'transparent',
    },
  }),
}));

const SmallButton = styled(Button)(({ theme, variant = 'primary' }) => ({
  ...baseButtonStyles,
  fontSize: '12px',
  fontWeight: 500,
  padding: '6px 14px', // V: 6, H: 14
   ...(variant === 'primary' && {
    backgroundColor: '#0042D1',
    color: '#fff',
    '&:active': {
       backgroundColor: '#0038B0',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: 'transparent',
    color: '#0042D1',
    border: '1px solid #0042D1',
     '&:active': {
       borderColor: '#0038B0',
       color: '#0038B0',
       backgroundColor: 'transparent',
    },
  }),
}));


// Export the components
export { BaseButton, PrimaryButtonLarge, SecondaryButtonLarge, SmallButton };

