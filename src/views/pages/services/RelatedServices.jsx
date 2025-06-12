import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Box, Container, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';



import React, { useRef } from 'react';


const RelatedServices = ({ related }) => {
  if (!related || related.length === 0) return null;

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // Scroll left by a fixed amount
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Scroll right by a fixed amount
    }
  };

  return (
    <Container sx={{ mt:-8 }}>
      <Typography
        variant="h2"
        textAlign="center"
        fontWeight={700}
        sx={{
          fontFamily: 'Inter',
          fontWeight: 700,
          lineHeight: '100%',
          letterSpacing: '0px',
          // background: '#000000',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          mb:15,
          color: '#000',
        }}
      >
        Related Services
      </Typography>

      <Box sx={{ position: 'relative',mt:{xs:-6,lg:-8},width:{xs:'100%',lg: '120%'},ml:{xs:1,lg:-12} }}>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            backgroundColor: '#0042D1', // White background for visibility
            borderRadius: '50%',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            color:'#FFFFFF'
          }}
          onClick={scrollLeft}
        >
          <ChevronLeft />
        </Box>

        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 3,
            pb: 2,
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none', // IE and Edge
            scrollbarWidth: 'none', // Firefox
            scrollBehavior: 'smooth', // Smooth scrolling
          }}
        >
          {related.map((service, idx) => (
            <Box
              key={idx}
              sx={{
                width: 336,
                height: 242,
                padding: '32px 36px',
                gap: 2, // Equivalent to 16px with default MUI spacing
                backgroundColor: '#fff',
                borderRadius:2,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0, // Ensure cards don't shrink
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={1}
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '22px',
                    lineHeight: '26px',
                    letterSpacing: '0px',
                    // width: 300,
                    height:50,
                    textAlign: 'left',
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="#001033"
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '24px',
                    letterSpacing: '0px',
                    textAlign: 'left',
                  }}
                >
                  {service.description}
                </Typography>
              </Box>
              <Link
                href={service.link}
                 component={RouterLink}
                 to="/book-consultation"
                color="primary.main"
                underline="none"
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                }}
              >
                Know More
                <Box sx={{ ml: 1, mt: 0.5 }}>→</Box>
              </Link>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            backgroundColor: '#0042D1', // White background for visibility
            borderRadius: '50%',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            // mr:5,
            color:'#FFFFFF'
          }}
          onClick={scrollRight}
        >
          <ChevronRight />
        </Box>
      </Box>
    </Container>
  );
};

export default RelatedServices;
