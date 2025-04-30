import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Factory from 'utils/Factory';
import MainCard from '../../../ui-component/cards/MainCard';
import SubCard from '../../../ui-component/cards/SubCard';
import ActionCell from '../../../ui-component/extended/ActionCell';
import CustomInput from 'utils/CustomInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RiFileList3Line, RiAlertLine } from 'react-icons/ri';
import { IconCurrencyRupee } from '@tabler/icons-react';

import { AiOutlineCalendar, AiOutlineNumber } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';

import {
  Typography,
  Stack,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid2,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Button,
  useTheme,
  Pagination
} from '@mui/material';

export default function RecordPayment() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('id');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [recordData, setRecordData] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const paginatedReceipts = selectedInvoice?.customer_invoice_receipts?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const getInvoiceDetails = async () => {
    const { res } = await Factory('get', `/invoicing/individual-invoice/${invoiceId}/`, {});
    if (res.status_cd === 0) setSelectedInvoice(res.data);
  };

  const handleDelete = async (id) => {
    const { res } = await Factory('delete', `/invoicing/receipt-delete/${id}/`, {});
    if (res.status_cd === 0) getInvoiceDetails();
  };

  const handleSaveComment = async (id) => {
    const { res } = await Factory('put', `/invoicing/receipt-update/${id}/`, recordData);
    if (res.status_cd === 0) {
      setOpen(false);
      getInvoiceDetails();
    }
  };

  useEffect(() => {
    if (invoiceId) getInvoiceDetails();
  }, [invoiceId]);

  const invoiceInfo = [
    { label: 'Customer Name', value: selectedInvoice?.customer, icon: FiUser },
    { label: 'Invoice Number', value: selectedInvoice?.invoice_number, icon: AiOutlineNumber },
    { label: 'Invoice Date', value: selectedInvoice?.invoice_date, icon: AiOutlineCalendar },
    { label: 'Invoice Amount', value: selectedInvoice?.amount_invoiced, icon: RiFileList3Line },
    {
      label: 'Total Amount Paid',
      value: selectedInvoice?.amount_invoiced - selectedInvoice?.balance_due,
      icon: IconCurrencyRupee
    },
    { label: 'Due Amount', value: selectedInvoice?.balance_due, icon: RiAlertLine }
  ];

  return (
    <MainCard>
      {/* Invoice Summary Section */}
      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        {invoiceInfo.map((item, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2, xl: 2 }}>
            <SubCard
              content={false}
              sx={{
                p: 2,
                cursor: 'default',
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease-in-out',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customShadows.z4,
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    color:
                      index % 2 === 0
                        ? theme.palette.primary.main
                        : index % 3 === 0
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                    boxShadow: `0px 4px 10px ${theme.palette.mode === 'dark' ? theme.palette.grey[900] : 'rgba(0, 0, 0, 0.1)'}`
                  }}
                >
                  <item.icon size={25} />
                </Box>
                <Typography variant="h5" color="text.secondary" align="center" sx={{ fontSize: '14px' }}>
                  {item.label}
                </Typography>
                <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                  {item.value || '-'}
                </Typography>
              </Stack>
            </SubCard>
          </Grid2>
        ))}
      </Grid2>

      {/* Payment Table Section */}
      <MainCard content={false} sx={{ mt: 3 }}>
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
              borderCollapse: 'separate',
              borderSpacing: '0 8px'
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableCell>Payment Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedReceipts?.length > 0 ? (
                paginatedReceipts.map((receipt, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: theme.customShadows.z1,
                      '&:hover': {
                        boxShadow: theme.customShadows.z4
                      }
                    }}
                  >
                    <TableCell>{receipt.date}</TableCell>
                    <TableCell>{receipt.amount}</TableCell>
                    <TableCell>
                      {receipt.method === 'cash'
                        ? 'Cash'
                        : receipt.method === 'card'
                          ? 'Card'
                          : receipt.method === 'bank_transfer'
                            ? 'Bank Transfer'
                            : receipt.method}
                    </TableCell>
                    <TableCell>{receipt.comments}</TableCell>
                    <TableCell align="center">
                      <ActionCell
                        row={receipt}
                        onEdit={() => {
                          setRecordData(receipt);
                          setOpen(true);
                        }}
                        onDelete={() => handleDelete(receipt.id)}
                        deleteDialogData={{
                          title: 'Delete record',
                          heading: 'Are you sure you want to delete this record?',
                          description: 'This action will permanently remove this record from the list.',
                          successMessage: 'Record has been deleted.'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No payment records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedInvoice?.customer_invoice_receipts?.length > 0 && (
          <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
            <Pagination
              count={Math.ceil(selectedInvoice.customer_invoice_receipts.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        )}
      </MainCard>

      {/* Edit Comment Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <Box sx={{ m: 2 }}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Comment</DialogTitle>
          <Divider />
          <DialogContent sx={{ padding: '16px' }}>
            <CustomInput
              multiline
              minRows={6}
              fullWidth
              name="comment"
              value={recordData?.comments || ''}
              onChange={(e) => setRecordData((prev) => ({ ...prev, comments: e.target.value }))}
            />
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, padding: 2 }}>
            <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => handleSaveComment(recordData.id)}>
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Back Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>
      </Box>
    </MainCard>
  );
}
