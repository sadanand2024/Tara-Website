import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Box, Grid2 } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AddCustomer from './AddCustomer';
import CustomerList from './CustomerList';
import { ConstructionOutlined } from '@mui/icons-material';

export default function TabTwo({ getCustomersData, customers, businessDetails, handleNext, handleBack }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('add');
  useEffect(() => {
    if (businessDetails?.invoicing_profile_id) {
      getCustomersData(businessDetails.invoicing_profile_id);
    }
  }, [businessDetails?.invoicing_profile_id]);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(businessDetails);
  return (
    <>
      {/* Header Section */}
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={handleOpen}>
              Add Customer
            </Button>
          </Stack>

          <AddCustomer open={open} handleClose={handleClose} getCustomersData={getCustomersData} businessDetailsData={businessDetails} />
        </Grid2>

        {/* Customer List Section */}
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

      {/* Footer Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            navigate('/app/invoice');
          }}
        >
          Back to Dashboard
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Stack>
      </Box>
    </>
  );
}
