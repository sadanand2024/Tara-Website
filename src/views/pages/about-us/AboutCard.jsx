import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FlagIcon from '@mui/icons-material/Flag';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Box, Card, CardContent, Container, Grid2, Typography, useTheme } from '@mui/material';


// Accent gradients palette for cards
const ACCENT_GRADIENTS = [
  'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
  'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
];

const values = [
  {
    icon: <GroupIcon sx={{ fontSize: 34, color: '#fff' }} />,
    title: 'All-in-One Dashboard',
    description: 'Manage tax, bookkeeping, payroll, and more in one place with real-time insights.'
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 34, color: '#fff' }} />,
    title: 'Built for Everyone',
    description: 'Flexible, scalable modules that adapt to both businesses and individuals.'
  },
  {
    icon: <WbSunnyIcon sx={{ fontSize: 34, color: '#fff' }} />,
    title: 'Automation + Expert Help',
    description: 'AI tools with expert support — no guesswork, just guidance.'
  },
  {
    icon: <VisibilityIcon sx={{ fontSize: 34, color: '#fff' }} />,
    title: 'Security & Compliance',
    description: 'Bank-level security and compliance to protect your data.'
  },
  {
    icon: <ChatBubbleIcon sx={{ fontSize: 34, color: '#fff' }} />,
    title: 'Easy & Engaging',
    description: 'A simple platform for submitting requests and collaborating with ease.'
  },
  {
    icon: <FlagIcon sx={{ fontSize: 34, color: '#fff' }} />,
    title: 'Tailored Onboarding',
    description: 'We learn your brand to deliver designs that reflect your identity.'
  }
];

const AboutUsCard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        mb:10,
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden',
        background: {
          xs: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)',
          md: 'linear-gradient(120deg, #f8fafc 60%, #a5b4fc 100%)'
        },
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(270deg, #ffecd2 0%, #fcb69f 50%, #a1c4fd 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 16s ease infinite',
          opacity: 0.35,
          zIndex: 0
        },
        '@keyframes gradientBG': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #ee0979, #ff6a00, #43cea2, #185a9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb:10,
            letterSpacing: 1.5,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Simplicity Meets Smart Solutions
        </Typography>
       

      <Grid2 container spacing={{ xs: 3, md: 5 }} justifyContent="center">
     {values.map((item, index) => (
    <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
      <Card
        sx={{
          height: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          borderTop: `4px solid transparent`,
          transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s, border-top 0.3s',
          p: 2,
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'scale(1.055) translateY(-10px)',
            boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.28)',
            borderTop: `4px solid #fff`
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length],
            borderRadius: '4px 4px 0 0',
            zIndex: 1
          }
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
          <Box
            sx={{
              mb: 3,
              mt: 1,
              width: 68,
              height: 68,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length],
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
              position: 'relative',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: `0 0 0 8px ${theme.palette.primary.light}, 0 4px 24px 0 rgba(0,0,0,0.10)`
              }
            }}
          >
            {item.icon}
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            gutterBottom
            sx={{ color: theme.palette.text.primary, fontSize: { xs: '1.1rem', md: '1.2rem' } }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 1, px: 1, fontSize: { xs: '0.98rem', md: '1.05rem' }, lineHeight: 1.7 }}
          >
            {item.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid2>
  ))}
</Grid2>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography
            variant="h1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              maxWidth: 700,
              mx: 'auto',
              mb: 8,
              fontSize: { xs: '1rem', md: '1.15rem' },
              fontStyle: 'italic'
            }}
          >
            "Built for growth. Powered by technology. Backed by experts."
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsCard;
