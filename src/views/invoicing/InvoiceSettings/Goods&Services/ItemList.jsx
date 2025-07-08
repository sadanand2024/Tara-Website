import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  Typography,
  CircularProgress,
  Box,
  Button,
  Card
} from '@mui/material';
import Factory from 'utils/Factory';
import AddItem from './AddItem';
import ActionCell from '../../../../ui-component/extended/ActionCell';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../../store/slices/snackbar';
import DeleteDialog from 'ui-component/extended/DeleteDialog'; // adjust path accordingly
import { IconButton, Tooltip } from '@mui/material'; // Add these if not already
import { Edit, Delete } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import { IconPlus } from '@tabler/icons-react';
const ItemList = ({
  type,
  setType,
  handleClose,
  handleOpen,
  open,
  businessDetailsData,
  itemsData,
  get_Goods_and_Services_Data,
  handleBack,
  handleNext
}) => {
  const dispatch = useDispatch();
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 8;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const handleOpenDeleteDialog = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedData = itemsList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setItemsList(itemsData || []);
  }, [itemsData]);

  const handleEdit = (item) => {
    console.log(item);
    setSelectedItem(item);
    setType('edit');
    handleOpen();
  };

  const handleDelete = async (item) => {
    setLoading(true);
    const url = `/invoicing/goods-services/${item.id}/delete/`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Item deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      await get_Goods_and_Services_Data();
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || 'Failed to delete item'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h5" color="text.secondary">
          Loading Items...
        </Typography>
      </Box>
    );
  }
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: 1,
          overflowX: 'auto'
        }}
      >
        <Table size="small">
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important'
              }
            }}
          >
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>GST%</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Items Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first item for invoice generation
                    </Typography>
                    <Button variant="outlined" size="small" onClick={handleOpen} startIcon={<IconPlus />}>
                      Add Item
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      boxShadow: 1
                    }
                  }}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.sku_value}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.gst_rate}</TableCell>
                  <TableCell>{item.selling_price}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                      <IconButton color="primary" onClick={() => handleEdit(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(item)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <DeleteDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          dialogData={{
            title: 'Delete Record',
            heading: 'Are you sure?',
            description: 'This action will permanently delete the record.'
          }}
        />
        <AddItem
          businessDetailsData={businessDetailsData}
          open={open}
          setType={setType}
          handleOpen={handleOpen}
          handleClose={handleClose}
          get_Goods_and_Services_Data={get_Goods_and_Services_Data}
          selectedItem={selectedItem}
        />
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" size="small" onClick={handleBack}>
          Back
        </Button>
        {itemsList.length > 0 && (
          <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
            <Pagination count={Math.ceil(itemsList.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
          </Stack>
        )}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleNext} size="small">
            Next
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ItemList;
