import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Grid, Button, Paper } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';
import Personal from '../KYC/Personal';
import Business from '../KYC/Business';
import Factory from 'utils/Factory';
import { useSnackbar } from 'notistack';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { storeUser } from 'store/slices/account'; // redux slice

export default function Dashboard() {
  const reduxDispatch = useReduxDispatch(); // ✅ Redux dispatcher 
  const snackbar = useSnackbar();
  const user = useSelector((state) => state).accountReducer.user;
  const [accDialog, setAccDialog] = useState(false);
  const [personalKYCDialog, setPersonalKYCDialog] = useState(false);
  const [businessKYCDialog, setBusinessKYCDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();


  function onContinue(selected) {
    let user_id = user.user.id;
    if (selected === 'business') {
      setBusinessKYCDialog(true);
      setSelected('business');
    } else {
      setPersonalKYCDialog(true);
      setSelected('personal');
    }
    closeDiag();
  }

  function closeDiag() {
    setAccDialog(() => false);
  }

  const switchContext = async (context_id) => {
    const response = await Factory('post', '/user_management/switch-context/', { context_id: context_id, user_id: user.user.id });
    if (response.res.status_cd === 0) {
      let data = { ...user };
      data.active_context = response.res.data.active_context;
      data.module_subscriptions = response.res.data.module_subscriptions;
      data.user_role = response.res.data.user_role;
      localStorage.setItem('user', JSON.stringify(data));
      reduxDispatch(storeUser(data));
    }
  };

  const handleKYCSubmit = async (data) => {
    let kycData = {
      user_id: user.user.id,
      context_type: selected
    };
    if (selected === 'personal') {
      kycData.user_kyc = { ...data, have_firm: false };
    } else {
      kycData.business_details = { ...data };
    }

    const response = await Factory('post', '/user_management/select-context', kycData, {});
    if (response.res.status_cd === 0) {
      switchContext(response.res.context_id);
      if (selected === 'personal') {
        navigate('/dashboard/personal');
      } else {
        navigate('/dashboard/business');
      }
    } else {
      snackbar.error('Something went wrong');
    }
  };

  useEffect(() => {
    console.log(user);
    if (user.all_contexts.length === 0) {
      setAccDialog(true);
    } else if (user.active_context.context_type === 'business') {
      navigate('/dashboard/business');
    } else {
      navigate('/dashboard/personal');
    }
  }, [user]);

  return (
    <>
      <ChooseAccountDialog open={accDialog} onContinue={onContinue} />
      <Personal open={personalKYCDialog} onClose={() => setPersonalKYCDialog(false)} onSubmit={handleKYCSubmit} />
      <Business open={businessKYCDialog} onClose={() => setBusinessKYCDialog(false)} onSubmit={handleKYCSubmit} />
    </>
  );
}

const ChooseAccountDialog = ({ open, onContinue }) => {
  const [selected, setSelected] = React.useState('personal');
  const theme = useTheme();

  const options = [
    {
      key: 'personal',
      title: 'Personal Account',
      icon: <PersonOutlineIcon fontSize="large" />,
      description: 'For individual use. Simple and secure experience.'
    },
    {
      key: 'business',
      title: 'Business Account',
      icon: <BusinessCenterIcon fontSize="large" />,
      description: 'For companies and teams. Manage business tools..'
    }
  ];

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          width: { xs: '100%', md: '28vw' },
          maxWidth: { xs: '100%', md: '28vw' }
        }
      }}
      fullWidth
    >
      <DialogTitle textAlign="center" sx={{ color: theme.palette.secondary['800'], pb: 0.5 }}>
        Choose Account Type
      </DialogTitle>
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
