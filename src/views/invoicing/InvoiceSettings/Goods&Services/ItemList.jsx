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
const ItemList = ({ type, setType, handleClose, handleOpen, open, businessDetailsData, itemsData, get_Goods_and_Services_Data }) => {
  const dispatch = useDispatch();
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 8;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const handleCloseModal = () => {
    setSelectedItem(null);
    handleClose();
  };

  return (
    <>
      <Card
        elevation={2}
        sx={{
          mb: 2,
          '& .MuiTableContainer-root': {
            borderRadius: 0
          },
          '& .MuiTableCell-root': {
            color: 'text.primary'
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            py: 1,
            backgroundColor: 'primary.main',
            color: '#fff'
          }
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
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
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No item records found.
                    </Typography>
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
        </TableContainer>
      </Card>

      {itemsList.length > 0 && (
        <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
          <Pagination count={Math.ceil(itemsList.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      )}

      <AddItem
        businessDetailsData={businessDetailsData}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleCloseModal}
        get_Goods_and_Services_Data={get_Goods_and_Services_Data}
        selectedItem={selectedItem}
        type={type}
        setType={setType}
      />
    </>
  );
};

export default ItemList;
