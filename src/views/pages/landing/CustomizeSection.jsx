// material-ui
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Document from 'assets/images/landing/Document.png';
import invoicing from 'assets/images/landing/invoicing.png';
import payroll from 'assets/images/landing/payroll.png';

import virtualcfo from 'assets/images/landing/virtualcfo.png';
import { useState } from 'react';

// assets


// Placeholder imports for new card images (replace with actual paths)

// ==============================|| LANDING - CUSTOMIZE ||============================== //

export default function CustomizeSection() {
  const listSX = {
    display: 'flex',
    gap: '0.7rem',
    padding: '10px 0',
    fontSize: '1rem',
    color: 'grey.900',
    svg: { color: 'secondary.main', minWidth: 20 }
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  const serviceCards = [
    {
      title: 'Invoicing',
      description:
        'Generate, customize, and manage invoices seamlessly. Get paid faster with professional invoice solutions.',
      image: invoicing,
    },
    {
      title: 'Virtual CFO',
      description:
        'Get expert financial oversight, strategic insights, and performance tracking — without hiring a full-time CFO.',
      image: virtualcfo,
    },
    {
      title: 'Payroll',
      description:
        'Simplify salary calculations, deductions, and payslip generation for your team in just a few clicks.',
      image: payroll,
    },
    {
      title: 'Document Wallet',
      description:
        'Securely store, manage, and access all your business documents anytime, anywhere — all in one place.',
      image: Document,
    },
  ];

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',mt:-25 }}>
      <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3, lg: 5 }} sx={{ justifyContent: 'center', alignItems: 'center' }}>


        {/* Section title */}


        {/* New Card Section */}
        <Grid size={12} sx={{ mt: { xs: 10 ,md: 10 } ,ml:{xs:12,lg:0}}}>
          <Grid container spacing={{ xs:2, sm: 3, md:10, lg:10}} justifyContent="center">
             {serviceCards.map((card, index) => (
               <Grid key={index} size={{ xs: 12, sm: 6, md:3 }} sx={{ textAlign: 'center' }}
                 onMouseEnter={() => setHoveredCard(index)}
                 onMouseLeave={() => setHoveredCard(null)}
               >
                 <Box
                   sx={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     p: 0,
                     borderRadius: '8px',
                     bgcolor: '#fff',
                     boxShadow: 1,
                     width: '280px',
                     height: '413px',
                     transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                     position: 'relative',
                     border: '1px solid #e0e0e0',
                     overflow: 'hidden',
                     '&:hover': {
                       transform: 'translateY(-10px)',
                       boxShadow: 4,
                     },
                   }}>
                   <CardMedia
                     component="img"
                     image={card.image}
                     alt={card.title}
                     sx={{
                      width: '280px',
                      height: '289px',
                      objectFit: 'cover',
                      display: 'block',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px'
                     }}
                   />
                   <Box sx={{
                       transition: 'transform 0.3s ease-in-out',
                       transform: hoveredCard === index ? 'translateY(-70px)' : 'translateY(0)',
                       bgcolor: '#fff',
                       padding: '20px',
                       position: 'absolute',
                       bottom: 0,
                       left: 0,
                       right: 0,
                       zIndex: 1,
                       width: '100%',
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       borderRadius: '0 0 8px 8px',
                       boxSizing: 'border-box',
                       height: '124px'
                   }}>
                     <Typography variant="h3" sx={{ mt: 0, mb: 1, color:'#1565c0'}}>
                       {card.title}
                     </Typography>
                     <Typography variant="h5" sx={{ mt:0, mb: 2, color: 'text.secondary'}}>
                       {card.description}
                     </Typography>
                     <Typography
                       variant="h5"
                       sx={{
                         mt: 0,
                         color: '#1565c0',
                         fontWeight: 500,
                         cursor: 'pointer',
                         '&:hover': {
                           textDecoration: 'underline',
                         },
                       }}
                     >
                       Sign Up &rarr;
                     </Typography>
                   </Box>
                 </Box>
               </Grid>
             ))}
           </Grid>
         </Grid>


      </Grid>
    </Container>
  );
}
