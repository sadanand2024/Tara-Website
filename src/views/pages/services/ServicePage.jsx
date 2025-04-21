import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import servicesData from 'data/servicesData';
import ErrorPage from 'views/pages/maintenance/Error';
import PrivateLimitedPage from './custom/PrivateLimitedPage';
import ITR from './custom/ITR';

const ServicePage = () => {
  const { category, slug } = useParams();
  const categoryData = servicesData[category];
  const pageData = categoryData?.pages[slug];

  if (!categoryData || !pageData) {
    return <ErrorPage />;
  }
  if (pageData?.customComponent === 'PrivateLimitedPage') {
    return <PrivateLimitedPage />;
  }
  if (pageData?.customComponent === 'ITRFiling') {
    return <ITR />;
  }

  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: { xs: 4, md: 10 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {pageData.heroTitle}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {pageData.heroSubtitle}
        </Typography>
        {pageData.cta && (
          <Button variant="contained" color="primary" size="large" sx={{ mt: 4 }} href={pageData.cta.link}>
            {pageData.cta.label}
          </Button>
        )}
      </Box>

      {/* What's Included */}
      {pageData.includes && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            What's Included
          </Typography>
          <Grid container spacing={4}>
            {pageData.includes.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="body1">✅ {item}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Documents Required */}
      {pageData.documents && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            Documents Required
          </Typography>
          <ul>
            {pageData.documents.map((doc, idx) => (
              <li key={idx}>{doc}</li>
            ))}
          </ul>
        </Box>
      )}

      {/* FAQs */}
      {pageData.faqs && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          {pageData.faqs.map((faq, idx) => (
            <Box sx={{ mt: 2 }} key={idx}>
              <Typography variant="subtitle1" fontWeight="bold">
                Q: {faq.question}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A: {faq.answer}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ServicePage;
