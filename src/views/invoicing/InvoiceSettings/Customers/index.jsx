import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Box, Grid2 } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import AddCustomer from './AddCustomer';
import CustomerList from './CustomerList';
import { ConstructionOutlined } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';

export default function CustomersComponent({
  getCustomersData,
  customers,
  businessDetails,
  handleNext,
  handleBack,
  addDialogOpen,
  setAddDialogOpen
}) {
  const [type, setType] = useState('add');
  useEffect(() => {
    if (businessDetails?.invoicing_profile_id) {
      getCustomersData(businessDetails.invoicing_profile_id);
    }
  }, [businessDetails?.invoicing_profile_id]);

  const navigate = useNavigate();

  const handleOpen = () => setAddDialogOpen(true);
  const handleClose = () => setAddDialogOpen(false);
  return (
    <>
      {/* Header Section */}
      <MainCard
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<IconPlus />}
            onClick={handleOpen}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            Add Customer
          </Button>
        }
      >
        <AddCustomer
          type={type}
          setType={setType}
          open={addDialogOpen}
          handleClose={handleClose}
          getCustomersData={getCustomersData}
          businessDetailsData={businessDetails}
          addDialogOpen={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
        />

        {/* Customer List Section */}
        <CustomerList
          type={type}
          setType={setType}
          open={addDialogOpen}
          handleOpen={handleOpen}
          handleClose={handleClose}
          businessDetailsData={businessDetails}
          customersListData={customers}
          getCustomersData={getCustomersData}
          handleBack={handleBack}
          handleNext={handleNext}
        />
      </MainCard>
    </>
  );
}
