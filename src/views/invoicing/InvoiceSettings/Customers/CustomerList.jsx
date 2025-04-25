// 📁 File: CustomerList.jsx

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Stack, Typography, Box } from '@mui/material';
import Factory from 'utils/Factory';
import AddCustomer from './AddCustomer';
import ActionCell from '../../../../ui-component/extended/ActionCell';
const CustomerList = ({ type, open, handleOpen, handleClose, setType, businessDetailsData, getCustomersData, customersListData }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedData = customers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCustomers(customersListData || []);
  }, [customersListData]);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setType('edit');
    handleOpen();
  };

  const handleDelete = async (customer) => {
    const url = `/invoicing/customer_profiles/delete/${customer.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 0) {
      getCustomersData();
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 1 }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Name</TableCell>
              <TableCell>PAN</TableCell>
              <TableCell>GSTIN</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Receivables</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No customer records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((customer, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      boxShadow: 1
                    }
                  }}
                >
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.pan_number}</TableCell>
                  <TableCell>{customer.gstin || 'NA'}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.mobile_number}</TableCell>
                  <TableCell>{customer.opening_balance}</TableCell>
                  <TableCell align="center">
                    <ActionCell
                      row={customer}
                      onEdit={() => handleEdit(customer)}
                      onDelete={() => handleDelete(customer)}
                      open={open}
                      onClose={handleClose}
                      deleteDialogData={{
                        title: 'Delete Customer',
                        heading: 'Are you sure you want to delete this customer?',
                        description: `This action will remove ${customer.name} from the list.`,
                        successMessage: 'Customer has been deleted.'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {customers.length > 0 && (
        <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
          <Pagination count={Math.ceil(customers.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
        </Stack>
      )}

      <AddCustomer
        type={type}
        setType={setType}
        businessDetailsData={businessDetailsData}
        handleClose={handleClose}
        open={open}
        getCustomersData={getCustomersData}
        selectedCustomer={selectedCustomer}
      />
    </>
  );
};

export default CustomerList;
