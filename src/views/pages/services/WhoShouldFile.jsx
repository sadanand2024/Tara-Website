// material-ui
import { Box, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

// assets
import { IconCircleCheck } from '@tabler/icons-react';

import LayerLeft from 'assets/images/landing/customization-left.png';
import LayerRight from 'assets/images/landing/customization-right.png';
import { Fade } from 'react-awesome-reveal';

// ==============================|| LANDING - CUSTOMIZE ||============================== //
const WhoShouldFile = ({ items,related }) => {
  if (!items || items.length & related || related.length === 0) return null;
  const listSX = {
    display: 'flex',
    gap: { xs: '0.2rem', sm: '0.3rem', md: '0.7rem' },
    padding: '10px 0',
    fontSize: '1rem',
    color: 'grey.900',
    svg: { color: 'secondary.main', minWidth: 16 }
  };

  return (
  <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
      <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3, lg: 5 }} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid sx={{ img: { width: '100%' } }} size={{ xs: 12, md: 6 }}>
          <Stack sx={{ width: '75%', mb: 5, mx: 'auto' }}>
            <CardMedia component="img" image={LayerLeft} alt="Layer" />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
        <Grid item xs={12} md={6}>
            <Fade direction="up" cascade damping={0.1} triggerOnce>
              <Box textAlign="left" mb={3}  >
                <Typography variant="h1" fontWeight={800} color="text.primary">
                  Who Should File?
                </Typography>
                <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                  fontSize: '1rem',
                  zIndex: '99',
                  width: { xs: '100%', sm: '100%', md: 'calc(100% - 20%)' }
                }}
              >
                If you relate to any of the following, filing is essential:
              </Typography>
              </Box>

              {items.map((item, idx) => (
                <Box key={idx} display="flex" alignItems="flex-start" gap={1} mb={0.5}>
                  <Typography key={idx} sx={listSX}>
                    <IconCircleCheck size={20} />
                    {item}
                  </Typography>
                </Box>
              ))}
            </Fade>
          </Grid>

        </Grid>
        <Grid size={12}>
          <Grid container spacing={2.5} direction={{ xs: 'column-reverse', md: 'row' }}>
            <Grid size={{ xs: 12, md: 6 }}>
            <Grid item xs={12} md={7}>
              <Box textAlign="left" mb={3}>
                <Typography variant="h1" fontWeight={800} color="text.primary">
                  Related Services
                </Typography>
                <Typography
                              variant="subtitle2"
                              sx={{
                                color: 'text.primary',
                                mt:1,
                                fontSize: '1rem',
                                zIndex: '99',
                                width: { xs: '100%', sm: '100%', md: 'calc(100% - 20%)' }
                              }}
                            >
                            It easy for developers of any skill level to use their product.
                          </Typography>
              </Box>
                  {related.map((item, idx) => (
                <Box key={idx} display="flex" alignItems="flex-start" gap={1} mb={0.5}>
                  <Typography key={idx} sx={listSX}>
                    <IconCircleCheck size={20} />
                    {item}
                  </Typography>
                </Box>
              ))}
            
          </Grid>
            </Grid>
            <Grid sx={{ img: { width: '100%' } }} size={{ xs: 12, md: 6 }}>
              <Stack sx={{ width: '70%', mx: 'auto' }}>
              <CardMedia component="img" image={LayerRight} alt="Layer" />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
    
  );
}

export default WhoShouldFile;