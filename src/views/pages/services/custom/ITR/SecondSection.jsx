import React, { useState } from 'react';
import { Box, Button, Container, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography, Grid2 } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PricingComponent from '../../../pricing/PricingComponent';

const questions = [
  {
    key: 'businessIncome',
    question: 'Do you have income from business or freelancing?',
    sub: 'If yes, do you opt for presumptive taxation (44AD/44ADA)?'
  },
  {
    key: 'capitalGains',
    question: 'Did you sell shares, mutual funds, property or crypto?'
  },
  {
    key: 'foreignIncome',
    question: 'Did you earn from abroad or hold foreign assets?'
  },
  {
    key: 'multipleProperties',
    question: 'Do you own more than one property?'
  },
  {
    key: 'entityFiling',
    question: 'Are you filing for a Company, LLP, Firm or Trust?'
  }
];

const plans = [
  {
    title: 'Lite',
    icon: <BadgeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    description: 'Ideal for salaried individuals only.',
    price: '₹499',
    permission: [0, 1]
  },
  {
    title: 'Standard',
    icon: <SupervisorAccountIcon sx={{ fontSize: 48, color: '#673AB7' }} />,
    description: 'Ideal for capital gains, presumptive income.',
    price: '₹1,299',
    permission: [2, 3]
  },
  {
    title: 'PRO',
    icon: <VerifiedUserIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    description: 'Ideal for businesses, NRIs, and multiple income heads.',
    price: '₹2,499',
    permission: [4, 5],
    active: true
  },
  {
    title: 'Entity',
    icon: <VerifiedUserIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    description: 'Ideal for companies, LLPs, firms, or trusts.',
    price: '₹4,999 – ₹9,999',
    permission: [0, 1, 2, 3, 4, 5, 6],
    active: true
  }
];
const planList = ['Form 16', 'Deductions', 'CA Review', 'CG Summary', 'Expert CA Support', 'F&O Reporting'];

const QuickQuestions = () => {
  const [answers, setAnswers] = useState({});
  const [showPlans, setShowPlans] = useState(true);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    setShowPlans(true);
  };

  return (
    <>
      <Box>
        <Typography variant="h1" fontWeight={700} gutterBottom>
          Help us refine your filing with 5 quick questions!
        </Typography>

        <Stack spacing={3} sx={{ mt: 5, mx: 'auto', maxWidth: 'md' }} alignItems="stretch">
          {questions.map((q) => (
            <Grid2 container key={q.key} alignItems="center" spacing={2}>
              {/* Question Column */}
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Typography variant="h5" sx={{ textAlign: 'left' }}>
                  {q.question}
                </Typography>
                {q.sub && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: 'left' }}>
                    {q.sub}
                  </Typography>
                )}
              </Grid2>

              {/* Radio Column */}
              <Grid2 size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <RadioGroup row value={answers[q.key] || ''} onChange={(e) => handleChange(q.key, e.target.value)}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Grid2>
            </Grid2>
          ))}
        </Stack>

        <Box textAlign="center" sx={{ mt: 6 }}>
          <Button variant="contained" color="primary" size="large" onClick={handleContinue}>
            Continue
          </Button>
        </Box>
      </Box>

      {showPlans && (
        <Box sx={{ my: 8 }}>
          <Typography variant="h1" fontWeight={700} gutterBottom>
            Here are your ideal plans based on your inputs
          </Typography>
          <PricingComponent plans={plans} planList={planList} />
        </Box>
      )}
    </>
  );
};

export default QuickQuestions;
