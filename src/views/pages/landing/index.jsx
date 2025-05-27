// material-ui
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project imports
import Customization from 'layout/Customization';
import AppBar from 'ui-component/extended/AppBar';
import CardSection from './CardSection';
import CustomizeSection from './CustomizeSection';
import FeatureSection from './FeatureSection';
import FooterSection from './FooterSection';
import HeaderSection from './HeaderSection';
import PreBuildDashBoard from './PreBuildDashBoard';

import StartupProjectSection from './StartupProjectSection';
//import IncludeSection from './IncludeSection';
//import RtlInfoSection from './RtlInfoSection';

import { ThemeMode } from 'config';

// =============================|| LANDING MAIN ||============================= //

export default function Landing() {
  const theme = useTheme();

  return (
    <>
      {/* 1. header and hero section */}
      <Box
        id="home"
        sx={{
          overflowX: 'hidden',
          overflowY: 'clip',
          background: 'linear-gradient(to left, #9DB0FF 0%, #F0F3FF 50%, #FFFFFF 100%)',
        }}
      >
        <AppBar />
        <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'transparent' }}>
        <HeaderSection />
        </Box>
      </Box>

      {/* 2. card section */}
      

      {/* 4. Developer Experience section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ?  background: 'linear-gradient(to left, #9DB0FF 0%, #F0F3FF 50%, #FFFFFF 100%)',mt:-20 }}>
        <CustomizeSection />
      </Box>
       {/* 2. card section */}
      <Box sx={{ py:0, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default',mt:-50 }}>
        <CardSection />
      </Box>
        <Box sx={{ py: 0 }}>
        <StartupProjectSection />
      </Box>

      {/* 3. about section */}
     

      {/* 4. Apps */}
      <Box sx={{ py:0.01, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'white',mt:-2}}>
        <PreBuildDashBoard />
      </Box>

      {/* 5. people section */}
      {/* <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
        <PeopleSection />
      </Box> */}
       <Box sx={{ py:10, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
        <FeatureSection />
      </Box>

      {/* 6. startup section */}
     

      {/* multi-language section */}
      {/*  <Box sx={{ py: 0 }}>
              <RtlInfoSection />
          </Box> */}

      {/* framework section */}
      {/* <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
        <FrameworkSection />
      </Box> */}

      {/* 7. inculde section */}
      {/* <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
              <IncludeSection />
          </Box>
          */}
      {/* footer section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0 ,textAlign: 'left',mt:-11}}>
        <FooterSection />
      </Box>
      <Customization />
    </>
  );
}
