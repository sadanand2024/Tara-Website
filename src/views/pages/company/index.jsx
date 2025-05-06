import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import React from 'react';
import FooterSection from '../landing/FooterSection';
import FinalSection from './FinalSection';
import FirstSection from './FirstSection';
const CompanyPage = () => {
  const theme = useTheme();

  return (
    <>
    <Box
          sx={{
            position: 'relative',
            width: '100%',
            background:'',
            //  height: '300px',
            display: 'flex',
            flexDirection:'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          >
          
          <Container>
         <FirstSection/>
          <FinalSection/>
         </Container>
    </Box>
    <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0 }}>
    <FooterSection />
     </Box>
     </>
    
    
  )
}

export default CompanyPage