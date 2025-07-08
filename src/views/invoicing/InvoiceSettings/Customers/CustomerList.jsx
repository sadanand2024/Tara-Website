import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Stack,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import Factory from 'utils/Factory';
import AddCustomer from './AddCustomer';
import ActionCell from '../../../../ui-component/extended/ActionCell';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import DeleteDialog from 'ui-component/extended/DeleteDialog'; // adjust path accordingly
import { IconButton, Tooltip } from '@mui/material'; // Add these if not already
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconPlus } from '@tabler/icons-react';
import BusinessIcon from '@mui/icons-material/Business';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const CustomerList = ({
  type,
  open,
  handleOpen,
  handleClose,
  setType,
  businessDetailsData,
  getCustomersData,
  customersListData,
  handleBack,
  handleNext
}) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    setLoading(true);
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 0) {
      getCustomersData(businessDetailsData?.invoicing_profile_id);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: res.data.error || 'Failed to delete customer',
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
          Loading Customers...
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
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Customers Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first customer for invoice generation
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleOpen}
                      startIcon={<IconPlus />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Add First Customer
                    </Button>
                  </Box>
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
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                      <IconButton color="primary" onClick={() => handleEdit(customer)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(customer)}>
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
        <AddCustomer
          type={type}
          setType={setType}
          open={open}
          handleClose={handleClose}
          getCustomersData={getCustomersData}
          businessDetailsData={businessDetailsData}
          selectedCustomer={selectedCustomer}
        />
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" size="small" onClick={handleBack}>
          Back
        </Button>
        {customers.length > 0 && (
          <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
            <Pagination count={Math.ceil(customers.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
          </Stack>
        )}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="small" onClick={handleNext}>
            Next
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default CustomerList;
