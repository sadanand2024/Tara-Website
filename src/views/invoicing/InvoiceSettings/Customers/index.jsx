import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Box, Grid2 } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import AddCustomer from './AddCustomer';
import CustomerList from './CustomerList';
import { ConstructionOutlined } from '@mui/icons-material';

export default function CustomersComponent({ getCustomersData, customers, businessDetails, handleNext, handleBack }) {
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
  return (
    <>
      {/* Header Section */}
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Customers</Typography>
            <Button size="small" variant="contained" startIcon={<IconPlus size={16} />} onClick={handleOpen}>
              Add Customer
            </Button>
          </Stack>

          <AddCustomer
            type={type}
            setType={setType}
            open={open}
            handleClose={handleClose}
            getCustomersData={getCustomersData}
            businessDetailsData={businessDetails}
          />
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
            handleBack={handleBack}
            handleNext={handleNext}
          />
        </Grid2>
      </Grid2>

      {/* Footer Navigation Buttons */}
    </>
  );
}
