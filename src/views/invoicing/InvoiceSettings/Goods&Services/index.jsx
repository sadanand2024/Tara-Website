// 📁 File: TabThree.jsx

import React, { useEffect, useState } from 'react';
import { Button, Box, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { IconPlus } from '@tabler/icons-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Factory from 'utils/Factory';
import AddItem from './AddItem';
import ItemList from './ItemList';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import MainCard from 'ui-component/cards/MainCard';

export default function GoodsServicesComponent({ businessDetails, handleNext, handleBack }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [type, setType] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchItems = async () => {
    const url = `/invoicing/goods-services/${businessDetails.invoicing_profile_id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 0) {
      setItems(res.data.goods_and_services);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: res.data.error || 'Failed to fetch items',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  useEffect(() => {
    if (businessDetails?.invoicing_profile_id) fetchItems();
  }, [businessDetails]);

  return (
    <MainCard
      title="Goods & Services"
      subtitle="Manage your business goods and services for invoice generation and business operations"
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
          Add Item
        </Button>
      }
    >
      <AddItem
        businessDetailsData={businessDetails}
        open={open}
        setType={setType}
        handleOpen={handleOpen}
        handleClose={handleClose}
        get_Goods_and_Services_Data={fetchItems}
      />
      <ItemList
        type={type}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        setType={setType}
        businessDetailsData={businessDetails}
        itemsData={items}
        get_Goods_and_Services_Data={fetchItems}
        handleBack={handleBack}
        handleNext={handleNext}
      />
    </MainCard>
  );
}
