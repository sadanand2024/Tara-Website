import React from 'react';
import { Box, Container, Typography, Paper, Grid2 } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const values = [
  {
    title: 'All-in-One Dashboard',
    description: 'Access tax tools, bookkeeping, compliance, payroll, and more from a single integrated dashboard with real-time insights.'
  },
  {
    title: 'Built for Businesses & Individuals',
    description: 'Whether you’re a freelancer or a growing enterprise, Tara First adapts to your needs with flexible and scalable modules.'
  },
  {
    title: 'Smart Automation + Expert Advice',
    description: 'Our platform blends AI automation with human expertise so you always have guidance when you need it — no guesswork.'
  },
  {
    title: 'Security & Compliance First',
    description: 'Built with banking-level encryption and compliance-first practices to ensure data privacy and regulatory peace of mind.'
  }
];

const AboutUsCard = () => {
  return (
    <Box sx={{ background: 'linear-gradient(to bottom, #f0f4ff, #ffffff)', py: { xs: 10, md: 16 } }}>
      <Container>
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, textAlign: 'center', mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
            We’re Redefining Financial Simplicity
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 6 }}>
            Tarafirst empowers individuals and businesses to take control of their finances through a unified platform that combines expert
            support, modern tools, and automated compliance — making finance stress-free and streamlined.
          </Typography>
        </motion.div>

        {/* Value Cards Section */}
        <Grid2 container spacing={4} justifyContent="center">
          {values.map((item, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    height: '100%',
                    minHeight: 240,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // 🔹 horizontally center content
                    justifyContent: 'center', // 🔹 vertically center content
                    textAlign: 'center'
                  }}
                >
                  <CheckCircleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid2>
          ))}
        </Grid2>

        {/* Impact Quote */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="h5" color="text.primary" sx={{ fontStyle: 'italic', fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
            "Built for growth. Powered by technology. Backed by experts."
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsCard;
