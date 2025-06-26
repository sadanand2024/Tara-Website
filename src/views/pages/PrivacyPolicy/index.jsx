// material-ui
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project imports
import PrivacyPolicy from './PrivacyPolicy'; // ✅ fixed import
import FooterSection from '../landing/FooterSection';

// config
import { ThemeMode } from 'config';

// =============================|| LANDING MAIN ||============================= //

export default function Privacy() {
  const theme = useTheme();

  return (
    <>
      {/* 1. header and hero section */}
      <Box
        id="home"
        sx={{
          overflowX: 'hidden',
          overflowY: 'clip',
          background: 'linear-gradient(to left,rgb(245, 245, 245) 0%,rgb(240, 240, 242) 0%,rgb(237, 238, 244) 0%)',
        }}
      >
        <Box
          sx={{
            py: 5.5,
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'transparent',
          }}
        >
          <PrivacyPolicy/>
        </Box>

        <Box
          sx={{
            py: 12.5,
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900',
            pb: 0,
            textAlign: 'left',
            mt: -11,
          }}
        >
          <FooterSection />
        </Box>
      </Box>
    </>
  );
}
