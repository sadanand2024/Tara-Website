import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconPlus } from '@tabler/icons-react';
import AddCustomer from './AddCustomer'; // Import the AddCustomer component
import CustomerList from './CustomerList';
import Factory from 'utils/Factory';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

export default function TabTwo({ getCustomersData, customers, businessDetails, handleNext, handleBack }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Grid2 container spacing={2}>
        {' '}
        <Grid2 size={{ xs: 12 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6">Customers</Typography>
            <Button
              variant="contained"
              startIcon={<IconPlus size={16} />}
              onClick={() => {
                setType('add');
                handleOpen();
              }}
            >
              Add
            </Button>
            <AddCustomer businessDetailsData={businessDetails} open={open} handleClose={handleClose} getCustomersData={getCustomersData} />
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <CustomerList
            type={type}
            setType={setType}
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            businessDetailsData={businessDetails}
            customersListData={customers}
            getCustomersData={getCustomersData}
          />
        </Grid2>
      </Grid2>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            // router.back();
          }}
        >
          Back to Dashboard
        </Button>

        <Box>
          <Button
            variant="contained"
            // onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
}
