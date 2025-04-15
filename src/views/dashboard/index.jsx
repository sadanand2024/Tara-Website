import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Grid, Button, Paper } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useTheme } from '@mui/material/styles';

export default function Dashboard() {
  const [accDialog, setAccDialog] = useState(true);

  function onContinue(selected) {
    console.log(selected);
    closeDiag();
  }

  function closeDiag() {
    setAccDialog(() => false);
  }

  return (
    <>
      <h1>Dashboard</h1>
      <ChooseAccountDialog open={accDialog} onClose={closeDiag} onContinue={onContinue} />
    </>
  );
}

const ChooseAccountDialog = ({ open, onClose, onContinue }) => {
  const [selected, setSelected] = React.useState('personal');
  const theme = useTheme();

  const options = [
    {
      key: 'personal',
      title: 'Personal Account',
      icon: <PersonOutlineIcon fontSize="large" />,
      description: 'If you need more info, please check it out.'
    },
    {
      key: 'business',
      title: 'Business Account',
      icon: <BusinessCenterIcon fontSize="large" />,
      description: 'Create Business account to use services.'
    }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle textAlign="center">Choose Account Type</DialogTitle>
      <DialogContent>
        <Typography textAlign="center" mb={3} fontSize={14}>
          {/* If you need more info, please check out <a href="#">Help Page</a>. */}
          Tell us what kind of user you are to proceeds.
        </Typography>

        <Grid container spacing={2}>
          {options.map((opt) => (
            <Grid item xs={6} key={opt.key}>
              <Paper
                elevation={selected === opt.key ? 4 : 1}
                onClick={() => setSelected(opt.key)}
                sx={{
                  p: 2,
                  border: `2px solid ${selected === opt.key ? theme.palette.secondary['200'] : '#ddd'}`,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <Box color={selected === opt.key ? 'secondary.main' : 'text.primary'}>
                  {opt.icon}
                  <Typography fontWeight={600} mt={1} fontSize={14}>
                    {opt.title}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {opt.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Button fullWidth variant="contained" color="secondary" sx={{ mt: 3 }} onClick={() => onContinue(selected)}>
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};
