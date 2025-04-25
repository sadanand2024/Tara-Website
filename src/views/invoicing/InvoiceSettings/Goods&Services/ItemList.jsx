import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Pagination, Typography } from '@mui/material';
import Factory from 'utils/Factory';
import AddItem from './AddItem';
import ActionCell from '../../../../ui-component/extended/ActionCell';

const ItemList = ({ type, setType, handleClose, handleOpen, open, businessDetailsData, itemsData, get_Goods_and_Services_Data }) => {
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

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
    const url = `/invoicing/goods-services/${item.id}/delete/`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 0) {
      get_Goods_and_Services_Data();
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 1 }}>
        <Table sx={{ minWidth: 750 }}>
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
            {paginatedData.length === 0 ? (
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
                    <ActionCell
                      row={item}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item)}
                      open={open}
                      onClose={handleClose}
                      deleteDialogData={{
                        title: 'Delete Item',
                        heading: 'Are you sure you want to delete this item?',
                        description: `This action will remove ${item.name} from the list.`,
                        successMessage: 'Item has been deleted.'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {itemsList.length > 0 && (
        <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
          <Pagination count={Math.ceil(itemsList.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
        </Stack>
      )}

      <AddItem
        businessDetailsData={businessDetailsData}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        get_Goods_and_Services_Data={get_Goods_and_Services_Data}
        selectedItem={selectedItem}
        type={type}
        setType={setType}
      />
    </>
  );
};

export default ItemList;
