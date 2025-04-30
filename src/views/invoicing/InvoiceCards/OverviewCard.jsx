import React from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FilterDialog from './FilterDialog';
import YearlyStats from './YearlyStats';
import OverallStats from './OverallStats';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Pagination, Grid2 } from '@mui/material';
import ActionCell from '../../../ui-component/extended/ActionCell';
import Factory from 'utils/Factory';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// @project
import MainCard from '../../../ui-component/cards/MainCard';
// @assets
import { IconArrowUp, IconFilter, IconReload, IconAlertCircle } from '@tabler/icons-react';
import { Autocomplete, Box, Button, FormHelperText, InputLabel, TextField, Avatar } from '@mui/material';
import { BASE_URL } from '../../../../constants';
import { indianCurrency } from 'utils/CurrencyToggle';
import { ThemeMode } from 'config';

const titles = {
  total_revenue: 'Total Revenue',
  today_revenue: "Today's Revenue",
  revenue_this_month: 'Revenue this month',
  revenue_last_month: 'Revenue last month',
  average_revenue_per_day: 'Average revenue per day',
  over_dues: 'Over due',
  due_today: 'Due today',
  due_within_30_days: 'Due with in 30 days',
  total_recievables: 'Total Receivable',
  bad_debt: 'Bad Debt'
};

export default function OverviewCard({ invoicing_profile_data, businessId, open, onClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const chipDefaultProps = { color: 'success', variant: 'text', size: 'small' };
  const [title, setTitle] = useState('Over All Financial Year Invoices');
  const [financialYear, setFinancialYear] = useState('2025-26');
  const [filterDialog, setFilterDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [invoicesList, setInvoicesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(invoicesList.length / rowsPerPage);
  const paginatedData = invoicesList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getStatsData = async (type) => {
    if (!invoicing_profile_data?.invoicing_profile_id) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Business data not found',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    setLoading(true);
    try {
      setTitle(titles[type]);
      const url = `/invoicing/detail-invoice?invoicing_profile_id=${invoicing_profile_data.invoicing_profile_id}&&filter_type=${type}&&financial_year=${financialYear}`;
      const { res } = await Factory('get', url, {});

      if (res.status_cd === 0) {
        setInvoicesList(res.data);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Data not found',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error fetching data',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const getDashboardData = async () => {
    if (!invoicing_profile_data?.invoicing_profile_id) return;

    setLoading(true);
    try {
      const url = `/invoicing/invoice-stats?invoicing_profile_id=${invoicing_profile_data.invoicing_profile_id}&financial_year=${financialYear}`;
      const { res } = await Factory('get', url, {});

      if (res.status_cd === 0) {
        setDashboardData(res.data);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error fetching dashboard data',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error fetching dashboard data',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const getInvoices = async () => {
    if (!invoicing_profile_data?.invoicing_profile_id) return;

    setLoading(true);
    try {
      const url = `/invoicing/invoice-retrieve?invoicing_profile_id=${invoicing_profile_data.invoicing_profile_id}&financial_year=${financialYear}`;
      const { res } = await Factory('get', url, {});

      if (res.status_cd === 0) {
        setInvoicesList(res.data.invoices);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error fetching invoices',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error fetching invoices',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const url = `/invoicing/invoice-delete/${id}/`;
      const { res } = await Factory('delete', url, {});

      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Invoice Deleted Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getInvoices();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error deleting invoice',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWriteOff = async (id) => {
    setLoading(true);
    try {
      const url = `/invoicing/invoice-wave-off/${id}`;
      const { res } = await Factory('put', url, {});

      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Successfully waved off',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getInvoices();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error waving off invoice',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const url = `/invoicing/invoice-update/${id}/`;
      const { res } = await Factory('put', url, { invoice_status: 'Approved' });

      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Invoice Approved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getInvoices();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error approving invoice',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${BASE_URL}/invoicing/create-pdf/${id}`, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      });

      if (response.data.byteLength > 0) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 10000);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Invalid response from server',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error downloading invoice',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (invoicing_profile_data?.invoicing_profile_id) {
      getInvoices();
      getDashboardData();
    }
  }, [invoicing_profile_data?.invoicing_profile_id]);

  // Fetch data when financial year changes
  useEffect(() => {
    if (invoicing_profile_data?.invoicing_profile_id && financialYear) {
      getInvoices();
      getDashboardData();
    }
  }, [financialYear, invoicing_profile_data?.invoicing_profile_id]);

  return (
    <Box>
      <YearlyStats
        theme={theme}
        title={title}
        setTitle={setTitle}
        financialYear={financialYear}
        setFinancialYear={setFinancialYear}
        dashboardData={dashboardData}
        getInvoices={getInvoices}
        getStatsData={getStatsData}
        businessId={businessId}
      />

      <OverallStats
        theme={theme}
        title={title}
        setTitle={setTitle}
        dashboardData={dashboardData}
        getInvoices={getInvoices}
        getStatsData={getStatsData}
        businessId={businessId}
      />

      <Box sx={{ mb: 1 }}>
        <Grid2 container>
          <Grid2 size={{ xs: 6 }}>
            <Typography variant="h4">{title}</Typography>
            {!['Over due', 'Due today', 'Due with in 30 days', 'Total Receivable', 'Bad Debt'].includes(title) && (
              <Typography variant="subtitle1" color="grey.700">
                FY: {financialYear}
              </Typography>
            )}
          </Grid2>
          <Grid2 size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<IconReload size={16} />}
              sx={{ minWidth: 78, mr: 1 }}
              onClick={() => {
                getInvoices();
                setTitle('Over All Financial Year Invoices');
              }}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<IconFilter size={16} />}
              sx={{ minWidth: 78 }}
              onClick={() => {
                setFilterDialog(true);
              }}
            >
              Filter
            </Button>
          </Grid2>
        </Grid2>
      </Box>
      <Grid2>
        <MainCard content={false} sx={{ mt: 3 }}>
          <TableContainer
            component={Paper}
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: 1,
              overflowX: 'auto'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Invoice Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Balance Due</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((invoice, index) => (
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
                      <TableCell>{invoice.invoice_date}</TableCell>
                      <TableCell>{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={invoice.payment_status}
                          color={invoice.payment_status === 'Pending' || invoice.payment_status === 'Overdue' ? 'warning' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={invoice.invoice_status}
                          color={invoice.invoice_status === 'Approved' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>{invoice.due_date}</TableCell>
                      <TableCell>
                        {indianCurrency}&nbsp;{invoice.total_amount}
                      </TableCell>
                      <TableCell>
                        {indianCurrency}&nbsp;{invoice.balance_due}
                      </TableCell>
                      <TableCell align="center">
                        {invoice?.id && (
                          <ActionCell
                            fromComponent="invoice"
                            row={invoice}
                            onEdit={() => navigate(`/app/invoice/editInvoice?id=${invoice.id}`)}
                            onDelete={() => handleDelete(invoice.id)}
                            onRecordPayment={() => navigate(`/app/invoice/recordpayment?id=${invoice.id}`)}
                            onPaymentHistory={() => navigate(`/app/invoice/paymenthistory?id=${invoice.id}`)}
                            onDownload={() => downloadInvoice(invoice.id)}
                            onApprove={() => handleApprove(invoice.id)}
                            onWriteOff={() => handleWriteOff(invoice.id)}
                            deleteDialogData={{
                              title: 'Delete record',
                              heading: 'Are you sure you want to delete this record?',
                              description: 'This action will permanently remove this record from the list.',
                              successMessage: 'Record has been deleted.'
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Stack alignItems="center" py={5}>
                        <IconAlertCircle color="warning" size={32} />
                        <Typography variant="subtitle1" color="text.secondary" mt={1}>
                          No invoices found for the selected filter
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {invoicesList.length > 0 && (
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ px: { xs: 0.5, sm: 2.5 }, py: 1.5 }}>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
            </Stack>
          )}
        </MainCard>
      </Grid2>
      <FilterDialog
        financialYear={financialYear}
        businessData={businessId}
        invoicing_profile_data={invoicing_profile_data}
        filterDialog={filterDialog}
        setFilterDialog={setFilterDialog}
        invoices={invoicesList}
        setInvoices={setInvoicesList}
        setTitle={setTitle}
      />
    </Box>
  );
}
