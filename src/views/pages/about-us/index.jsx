// material-ui
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import FooterSection from '../landing/FooterSection';


// project imports
import AboutCard from './AboutCard';

// assets
// import headerBackground from 'assets/images/landing/bg-header.jpg';
import HeroSection from './HeroSection';

// ============================|| CONTACT US ||============================ //

export default function ContactUsPage() {
     const theme = useTheme();
  return (
    <Box
      // sx={{
      //   backgroundImage: `url(${headerBackground})`,
      //   backgroundSize: '100% 600px',
      //   backgroundAttachment: 'fixed',
      //   backgroundRepeat: 'no-repeat',
      //   textAlign: 'center',
      
      // }}
    >
      <HeroSection/>
      <AboutCard />
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0,mt:-10,textAlign: 'left' }}>
        <FooterSection />
      </Box>
    </Box>
  );
}
