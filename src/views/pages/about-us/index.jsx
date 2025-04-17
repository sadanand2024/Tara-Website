// material-ui
import Box from '@mui/material/Box';

// project imports
import AboutCard from './AboutCard';

// assets
import headerBackground from 'assets/images/landing/bg-header.jpg';

// ============================|| CONTACT US ||============================ //

export default function ContactUsPage() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: '100% 600px',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        textAlign: 'center'
      }}
    >
      <AboutCard />
    </Box>
  );
}
