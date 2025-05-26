import React from 'react';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import BookIcon from '@mui/icons-material/Book';
// import FolderIcon from '@mui/icons-material/Folder';
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Grid, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import { IconCircleCheck } from '@tabler/icons-react';
// import Include_image from 'assets/images/landing/Include_image.png';
import DocumentIcon from 'assets/images/icons/Documenticon.svg';
import Document_required from 'assets/images/Landing/Document_required.png';



// const iconMap = [
//   { icon: <FolderIcon />, color: '#e53935' },        // red
//   { icon: <AccountBalanceIcon />, color: '#8e24aa' }, // purple
//   { icon: <ReceiptLongIcon />, color: '#43a047' },    // green
//   { icon: <DescriptionIcon />, color: '#fb8c00' },     // orange
//   { icon: <BookIcon />, color: '#1e88e5' },            // blue
//   { icon: <PeopleAltIcon />, color:'rgb(241, 16, 16)' }  // brown
// ];


const DocumentsRequired = ({ documents }) => {
  // const theme = useTheme();

  const half = Math.ceil(documents.length / 2);
  const documentsCol1 = documents.slice(0, half);
  const documentsCol2 = documents.slice(half);

  // Determine the maximum number of rows needed based on the longer column
  const maxRows = Math.max(documentsCol1.length, documentsCol2.length);

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 }, maxWidth: 'lg', margin: '0 auto',mt:{xs:0,lg:-5} }}>
      <Typography
        variant="h2"
        fontWeight={700}
        textAlign="center"
        mb={4}
        sx={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          color: '#000000',
        }}
      >
        Documents Required
      </Typography>

      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="flex-start">
        {/* Left Content - Documents List Container */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} sx={{ mt: { xs: 0, lg: 0 } }}>
            {/* Render items row by row */}
            {[...Array(maxRows)].map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Left Column Item */}
                <Grid item xs={6}>
                  {documentsCol1[rowIndex] && (
                    <ListItem
                      disableGutters
                      sx={{
                        width: '100%',
                        height: 72,
                        minHeight: 72,
                        padding: '8px 16px',
                        gap: 2,
                        mb: { xs: 1.5, md: 2 },
                        alignItems: 'flex-start',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#e3f2fd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        <img src={DocumentIcon} alt="Document Icon" style={{ width: '24px', height: '24px' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={documentsCol1[rowIndex]}
                        primaryTypographyProps={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: '18px',
                          lineHeight: 1.4,
                          color: '#001033',
                          // Styles to limit text to two lines
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      />
                    </ListItem>
                  )}
                </Grid>

                {/* Right Column Item */}
                <Grid item xs={6}>
                  {documentsCol2[rowIndex] && (
                    <ListItem
                      disableGutters
                      sx={{
                        width: '100%',
                        height: 72,
                        minHeight: 72,
                        padding: '8px 16px',
                        gap: 2,
                        mb: { xs: 1.5, md: 2, lg: 0 },
                        alignItems: 'flex-start',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#e3f2fd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        <img src={DocumentIcon} alt="Document Icon" style={{ width: '24px', height: '24px' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={documentsCol2[rowIndex]}
                        primaryTypographyProps={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: 1.4,
                          color: '#001033',
                          // Styles to limit text to two lines
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      />
                    </ListItem>
                  )}
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>

        {/* Right Content - Illustration */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            component="img"
            src={Document_required} // **REPLACE WITH YOUR ACTUAL ILLUSTRATION PATH**
            alt="Documents Illustration"
            sx={{
              width: 700,
              height: 450,
              padding: '10px',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentsRequired;