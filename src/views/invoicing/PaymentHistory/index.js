'use client';

import { useState, useEffect } from 'react';
import Factory from '@/utils/Factory';
import { indianCurrency } from '../../../../utils/CurrencyToggle';
import { useSearchParams } from 'next/navigation';
import MainCard from '@/components/MainCard';
import ActionCell from '@/utils/ActionCell';
import { useSnackbar } from '@/components/CustomSnackbar';
import CustomInput from '@/utils/CustomInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  Button
} from '@mui/material';
import { Preview } from '@mui/icons-material';
import HomeCard from '@/components/cards/HomeCard';
import { useRouter } from 'next/navigation';

/***************************  ACCOUNT  ***************************/

export default function RecordPayment() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { showSnackbar } = useSnackbar();
  let [recordData, setRecordData] = useState({});
  let [open, setOpen] = useState(false);
  const router = useRouter();

  const get_Individual_Invoice_Data = async () => {
    const { res } = await Factory('get', `/invoicing/individual-invoice/${invoiceId}/`, {});
    if (res.status_cd === 0) {
      setSelectedInvoice(res.data);
    } else {
    }
  };
  const handleDelete = async (id) => {
    let url = `/invoicing/receipt-delete/${id}/`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      showSnackbar('Record Deleted Successfully', 'success');
      get_Individual_Invoice_Data();
    }
  };
  const handleSaveComment = async (id) => {
    let url = `/invoicing/receipt-update/${id}/`;
    const { res } = await Factory('put', url, recordData);
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      setOpen(false);
      showSnackbar('Record Updated Successfully', 'success');
      get_Individual_Invoice_Data();
    }
  };
  useEffect(() => {
    if (invoiceId) {
      get_Individual_Invoice_Data();
    }
  }, [invoiceId]);
  return (
    <HomeCard title="  Record of Payments Received" tagline=" View your payment history Here">
      <MainCard>
        <MainCard sx={{ p: 2 }}>
          <Grid2 container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="column">
                <Typography variant="subtitle1">Customer Name </Typography>
                <Typography color={'grey.700'} variant="subtitle1">
                  {selectedInvoice?.customer}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="column">
                <Typography variant="subtitle1">Invoice Number </Typography>
                <Typography color={'grey.700'} variant="subtitle1">
                  {selectedInvoice?.invoice_number}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="column">
                <Typography variant="subtitle1">Invoice Date </Typography>
                <Typography color={'grey.700'} variant="subtitle1">
                  {selectedInvoice?.invoice_date}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="column">
                <Typography variant="subtitle1">Invoice Amount</Typography>
                <Typography color={'grey.700'} variant="subtitle1">
                  {indianCurrency}&nbsp;{selectedInvoice?.amount_invoiced}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="column">
                <Typography variant="subtitle1">Total Amount paid </Typography>
                <Typography color={'grey.700'} variant="subtitle1">
                  {indianCurrency}&nbsp;{selectedInvoice?.amount_invoiced - selectedInvoice?.balance_due}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="column">
                <Typography variant="subtitle1">Due Amount </Typography>
                <Typography color={'grey.700'} variant="subtitle1">
                  {indianCurrency}&nbsp;{selectedInvoice?.balance_due}{' '}
                </Typography>
              </Stack>
            </Grid2>
          </Grid2>
        </MainCard>
        <Box sx={{ mt: 5 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedInvoice?.customer_invoice_receipts.length > 0 ? (
                  selectedInvoice?.customer_invoice_receipts?.map((receipt, index) => (
                    <TableRow key={index}>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>
                        {indianCurrency}&nbsp;
                        {receipt.amount}
                      </TableCell>
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
                      <TableCell>
                        <ActionCell
                          row={receipt} // Pass the customer row data
                          onEdit={() => {
                            setRecordData(receipt);
                            setOpen(true);
                          }}
                          onDelete={() => {
                            handleDelete(receipt.id);
                          }}
                          open={open}
                          onClose={() => {
                            setOpen(false);
                          }}
                          deleteDialogData={{
                            title: 'Delete record',
                            heading: 'Are you sure you want to delete this record?',
                            description: `This action will permanantely remove this record from the list.`,
                            successMessage: 'Record has been deleted.'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No customers available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
            <Box sx={{ m: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DialogTitle id="form-dialog-title" sx={{ fontWeight: 'bold' }}>
                  Edit Comment
                </DialogTitle>
              </Box>

              <Divider />
              <DialogContent sx={{ padding: '16px' }}>
                <CustomInput
                  multiline
                  minRows={8}
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
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              router.back();
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </MainCard>
    </HomeCard>
  );
}
