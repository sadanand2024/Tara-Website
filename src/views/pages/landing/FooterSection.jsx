import { Link as RouterLink } from 'react-router-dom';

// material-ui
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// project imports
import taralogoWhite from 'assets/images/taralogoWhite.png'; // Tarafirstlogo_png
import { ThemeMode } from 'config';
import { frameworks } from './FrameworkSection';
// assets
import { IconBrandDiscord } from '@tabler/icons-react';

import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import PublicIcon from '@mui/icons-material/Public';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
// Link - custom style
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.mode === ThemeMode.DARK ? theme.palette.text.secondary : theme.palette.text.hint,
  '&:hover': {
    color: theme.palette.primary.main
  },
  '&:active': {
    color: theme.palette.primary.main
  }
}));

// =============================|| LANDING - FOOTER SECTION ||============================= //

export default function FooterSection() {
  const theme = useTheme();
  const textColor = theme.palette.mode === ThemeMode.DARK ? 'text.secondary' : 'text.hint';

  return (
    <>
      <Container sx={{ mb: 15 }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={12}>
            <Grid container spacing={{ xs: 4, md: 8 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={{ xs: 2, md: 5 }}>
                  <Typography component={RouterLink} to="/" aria-label="theme-logo">
                    <CardMedia component="img" src={taralogoWhite} alt="defaultLayout" sx={{ width: 200 }} />
                  </Typography>
                  <Typography variant="body2" color={textColor}>
                    Tara First is a unified fintech platform for managing personal and business finances. From company registration to GST,
                    payroll, and more — we combine smart software with expert support to simplify your financial journey.
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={{ xs: 4, md: 4 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack spacing={{ xs: 3, md: 3 }}>
                      <Typography variant="h4" color={textColor} sx={{ fontWeight: 500 }}>
                        Our Address
                      </Typography>
                      <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnIcon color="primary" />
                          <Typography variant="body2" color={textColor}>
                            Tara First Technologies Pvt. Ltd.
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color={textColor} sx={{ pl: 4 }}>
                          White Waters, Timber Lake Colony, Chitrapuri Colony, Rai Durg, Hyderabad, Telangana 500032
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon color="primary" />
                          <Link href="tel:+919876543210" color={textColor} underline="none">
                            +91 98765 43210
                          </Link>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EmailIcon color="primary" />
                          <Link href="mailto:support@tarafirst.in" color={textColor} underline="none">
                            support@tarafirst.in
                          </Link>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack spacing={{ xs: 2, md: 4 }}>
                      <Typography variant="h4" color={textColor} sx={{ fontWeight: 500 }}>
                        Help
                      </Typography>
                      <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                        <FooterLink to={'/pages/about-us'} component={RouterLink} underline="none">
                          About Us
                        </FooterLink>
                        <FooterLink to={'/pages/contact-us'} component={RouterLink} underline="none">
                          Contact Us
                        </FooterLink>
                        <FooterLink href="#" underline="none">
                          Blog
                        </FooterLink>
                        <FooterLink underline="none">Documentation</FooterLink>
                        <FooterLink href="#" underline="none">
                          Change Log
                        </FooterLink>
                        <FooterLink to={'/book-consultation'} component={RouterLink} underline="none">
                          Support
                        </FooterLink>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Stack spacing={{ xs: 3, md: 5 }}>
                      <Typography variant="h4" color={textColor} sx={{ fontWeight: 500 }}>
                        Follow Us On
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={{ xs: 2, sm: 1.5, md: 2 }}>
                        <IconButton size="small" aria-label="TaraFirst Github" component={Link} href="#">
                          <GitHubIcon
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'success.main' }
                            }}
                          />
                        </IconButton>
                        <IconButton size="small" aria-label="TaraFirst Instagram" component={Link} href="#">
                          <InstagramIcon
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main' }
                            }}
                          />
                        </IconButton>

                        <IconButton size="small" aria-label="TaraFirst Youtube" component={Link} href="#">
                          <YouTubeIcon
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main' }
                            }}
                          />
                        </IconButton>
                        <IconButton size="small" aria-label="TaraFirst Blog" component={Link} href="#">
                          <PublicIcon
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main' }
                            }}
                          />
                        </IconButton>
                        <IconButton size="small" aria-label="TaraFirst Twitter" component={Link} href="#">
                          <XIcon
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'primary.main' }
                            }}
                          />
                        </IconButton>
                        <IconButton size="small" aria-label="TaraFirst Facebook" component={Link} href="#">
                          <FacebookIcon
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'primary.main' }
                            }}
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ bgcolor: 'dark.dark', py: { xs: 3, sm: 1.5 } }}>
        {/* <Container>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={{ xs: 1.5, sm: 1, md: 3 }}
          >
            <Typography color="text.secondary">
              © Berry is managed by{' '}
              <Link href="https://codedthemes.com/"  underline="hover">
                CodedThemes
              </Link>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={{ xs: 2, sm: 1.5, md: 2 }}>
              <IconButton
                size="small"
                aria-label="codedTheme Github"
                component={Link}
                href="https://github.com/codedthemes"
                
              >
                <GitHubIcon
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'success.main' }
                  }}
                />
              </IconButton>
              <IconButton
                size="small"
                aria-label="codedTheme Instagram"
                component={Link}
                href="https://www.instagram.com/codedthemes"
                
              >
                <InstagramIcon
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                />
              </IconButton>
              <IconButton
                size="small"
                aria-label="codedTheme Discord"
                component={Link}
                href="https://discord.com/invite/p2E2WhCb6s"
                
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'info.main' }
                }}
              >
                <IconBrandDiscord size={30} />
              </IconButton>
              <IconButton
                size="small"
                aria-label="codedTheme Youtube"
                component={Link}
                href="https://www.youtube.com/channel/UCiZG__BaRkT1OuZl5ifzO6A"
                
              >
                <YouTubeIcon
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                />
              </IconButton>
              <IconButton size="small" aria-label="Berry Blog" component={Link} href="https://links.codedthemes.com/HTIBc" >
                <PublicIcon
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                />
              </IconButton>
              <IconButton size="small" aria-label="codedTheme Twitter" component={Link} href="https://x.com/codedthemes" >
                <XIcon
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                />
              </IconButton>
              <IconButton
                size="small"
                aria-label="codedTheme Dribble"
                component={Link}
                href="https://dribbble.com/codedthemes"
                
              >
                <SportsBasketballIcon
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'warning.main' }
                  }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </Container> */}
      </Box>
    </>
  );
}
