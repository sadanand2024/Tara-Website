// 📁 File: TabThree.jsx

import React, { useEffect, useState } from 'react';
import { Button, Box, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { IconPlus } from '@tabler/icons-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import Factory from 'utils/Factory';
import AddItem from './AddItem';
import ItemList from './ItemList';

export default function TabThree({ businessDetails, handleNext, handleBack }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [type, setType] = useState('');
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchItems = async () => {
    const url = `/invoicing/goods-services/${businessDetails.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 0) {
      setItems(res.data.goods_and_services);
    }
  };

  useEffect(() => {
    if (businessDetails?.id) fetchItems();
  }, [businessDetails]);

  return (
    <>
      <Grid2 container spacing={2}>
        {/* Header Section */}
        <Grid2 size={{ xs: 12 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={handleOpen}>
              Add Item
            </Button>
            <AddItem
              businessDetailsData={businessDetails}
              open={open}
              setType={setType}
              handleOpen={handleOpen}
              handleClose={handleClose}
              get_Goods_and_Services_Data={fetchItems}
            />
          </Stack>
        </Grid2>

        {/* Items List */}
        <Grid2 size={{ xs: 12 }}>
          <ItemList
            type={type}
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            setType={setType}
            businessDetailsData={businessDetails}
            itemsData={items}
            get_Goods_and_Services_Data={fetchItems}
          />
        </Grid2>
      </Grid2>

      {/* Footer Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            navigate('/app/invoice');
          }}
        >
          Back To Dashboard
        </Button>
        {/* <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Stack> */}
      </Box>
    </>
  );
}
