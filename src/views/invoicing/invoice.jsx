import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// @project
import GraphicsCard from '@/components/cards/GraphicsCard';
import ContainerWrapper from '@/components/ContainerWrapper';
import GradientFab from '@/components/GradientFab';
import GraphicsImage from '@/components/GraphicsImage';
import LogoSection from '@/components/logo';
import Typeset from '@/components/Typeset';
import branding from '@/branding.json';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/components/CustomSnackbar';
import Factory from '@/utils/Factory';
import { ThemeDirection } from '@/config';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { BASE_URL } from 'constants';

/***************************  EARLY ACCESS  ***************************/

const data = {
  heading: 'Be the First to Try',
  caption: `Experience Website Publishing Directly from ${branding.brandName} before Anyone Else!`,
  image: { light: '/assets/images/graphics/ai/graphics6-light.svg', dark: '/assets/images/graphics/ai/graphics6-dark.svg' },
  primaryBtn: { children: 'Notify Me' }
};

export default function EarlyAccess() {
  const { showSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const invoice_id = searchParams.get('id');
  const router = useRouter();
  const [invoice, setInvoice] = useState({
    shipping_address: {
      ship_to_address: '',
      ship_to_state: '',
      ship_to_country: '',
      ship_to_pincode: ''
    },
    billing_address: {
      bill_to_address: '',
      bill_to_state: '',
      bill_to_country: '',
      bill_to_pincode: ''
    }
  });

  const getInvoice = async (invoice_id) => {
    const url = `/invoicing/individual-invoice/${invoice_id}/`;
    const { res, error } = await Factory('get', url, {});
    if (res.status_cd === 0) {
      console.log(res.data);
      setInvoice(res.data);
    } else {
      showSnackbar('Failed to fetch invoice', 'error');
    }
  };

  const updateStatus = async () => {
    const postData = {
      invoice_status: 'Approved'
    };
    let url = `/invoicing/invoice-update/${invoice_id}/`;
    const { res } = await Factory('put', url, postData);
    if (res.status_cd === 0) {
      // resetForm();
      router.push(`/invoicing`);
      showSnackbar('Approved', 'success');
    }
  };

  useEffect(() => {
    getInvoice(invoice_id);
  }, []);

  const theme = useTheme();
  const { heading, caption, primaryBtn, image } = data;
  const gc = theme.palette.grey[100];
  const gradient =
    theme.direction === ThemeDirection.RTL
      ? `radial-gradient(71.13% 28.87% at 50% 50.07%, ${alpha(gc, 0)} 0%, ${gc} 100%)`
      : `radial-gradient(71.13% 71.13% at 50% 50.07%, ${alpha(gc, 0)} 0%, ${gc} 100%)`;

  const InvoiceTemplate = ({
    company_name,
    gstin,
    email,
    invoice_number,
    invoice_date,
    terms,
    due_date,
    place_of_supply,
    customer_name,
    billing_address,
    shipping_address,
    item_details = [],
    total_amount,
    subtotal_amount,
    shipping_amount,
    total_cgst_amount,
    total_sgst_amount,
    total_igst_amount,
    total,
    bank_name,
    account_number,
    ifsc_code,
    swift_code,
    image_url,
    registration_number,
    notes,
    terms_and_conditions
  }) => {
    console.log(billing_address);
    return (
      <div
        id="INVOICE_TEMPLATE"
        style={{
          paddingTop: '1rem',
          paddingBottom: '1rem'
        }}
      >
        <div style={{ padding: '1.5rem 3.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}>
                    <h2 style={{ margin: '0 0 5px 0', whiteSpace: 'nowrap', color: '#006397' }}>{company_name}</h2>
                    <p style={{ margin: 0 }}>Telangana</p>
                    <p style={{ margin: 0 }}>{gstin}</p>
                    <p style={{ margin: 0 }}>{email}</p>
                    <p style={{ margin: 0 }}>Invoice No.: {invoice_number}</p>
                    <p style={{ margin: 0 }}>Invoice Date: {invoice_date}</p>
                    <p style={{ margin: 0 }}>Terms: {terms}</p>
                    <p style={{ margin: 0 }}>Due Date: {due_date}</p>
                  </div>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}>
                    <h1
                      style={{
                        margin: 0,
                        whiteSpace: 'nowrap',
                        color: '#006397',
                        textAlign: 'right'
                      }}
                    >
                      Tax Invoice
                    </h1>
                    <p style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Place of supply: {place_of_supply}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            backgroundColor: '#dae5f0',
            padding: '1.5rem 3.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#525252' }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>Bill to</p>
                    <p style={{ margin: 0 }}>{customer_name}</p>
                    <p style={{ margin: 0 }}>{billing_address['address_line1']}</p>
                    <p style={{ margin: 0 }}>{billing_address['country']}</p>
                    <p style={{ margin: 0 }}>{billing_address['state']}</p>
                    <p style={{ margin: 0 }}>{billing_address['postal_code']}</p>
                  </div>
                </td>
                <td
                  style={{
                    width: '50%',
                    verticalAlign: 'top',
                    textAlign: 'right'
                  }}
                >
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#525252' }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>Ship to</p>
                    <p style={{ margin: 0 }}>{shipping_address['address_line1']}</p>
                    <p style={{ margin: 0 }}>{shipping_address['state']}</p>
                    <p style={{ margin: 0 }}>{shipping_address['country']}</p>
                    <p style={{ margin: 0 }}>{shipping_address['postal_code']}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: '2.5rem 3.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: '#404040'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #006397' }}>
                {['Sno', 'Item', 'Qty.', 'Rate', 'Discount', 'Amount', 'TaxAmount', 'Tax', 'TotalAmount'].map((header) => (
                  <td key={header} style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#006397' }}>
                    {header}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {item_details.map((item, index) => (
                <tr key={index} style={{ borderBottom: '2px solid #e2e2e2' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{item.item}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{item.rate}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{item.discount}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{item.amount}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{item.taxamount}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{item.tax}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{item.total_amount}</td>
                </tr>
              ))}
              <tr
                style={{
                  marginTop: '20px'
                }}
              >
                <td colSpan="2">
                  <h3 style={{ margin: 0 }}>&nbsp;</h3>
                  <br />
                  &nbsp;
                </td>
                <td colSpan="7"></td>
              </tr>
            </tbody>
          </table>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              borderSpacing: 0
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: '100%' }}></td>
                <td>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      borderSpacing: 0
                    }}
                  >
                    <tbody>
                      <tr
                        style={{
                          marginTop: '0.5rem'
                        }}
                      >
                        <td
                          style={{
                            borderBottomWidth: '1px',
                            padding: '0.5rem'
                          }}
                        >
                          <div style={{ whiteSpace: 'nowrap', color: '#94a3b8' }}>SUB TOTAL (%):</div>
                        </td>
                        <td
                          style={{
                            borderBottomWidth: '1px',
                            padding: '0.5rem',
                            textAlign: 'right'
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 700,
                              color: '#006397'
                            }}
                          >
                            {subtotal_amount}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            borderBottomWidth: '1px',
                            padding: '0.5rem'
                          }}
                        >
                          <div style={{ whiteSpace: 'nowrap', color: '#94a3b8' }}>SHIPPING AMOUNT (%):</div>
                        </td>
                        <td
                          style={{
                            borderBottomWidth: '1px',
                            padding: '0.5rem',
                            textAlign: 'right'
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 700,
                              color: '#006397'
                            }}
                          >
                            {shipping_amount}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.5rem' }}>
                          <div style={{ whiteSpace: 'nowrap', color: '#94a3b8' }}>CGST (%):</div>
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 700,
                              color: '#006397'
                            }}
                          >
                            {total_cgst_amount}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.55rem' }}>
                          <div style={{ whiteSpace: 'nowrap', color: '#94a3b8' }}>SGST (%):</div>
                        </td>
                        <td style={{ padding: '0.55rem', textAlign: 'right' }}>
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 700,
                              color: '#006397'
                            }}
                          >
                            {total_sgst_amount}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            borderBottomWidth: '1px',
                            padding: '0.5rem'
                          }}
                        >
                          <div style={{ whiteSpace: 'nowrap', color: '#94a3b8' }}>IGST Amount (%):</div>
                        </td>
                        <td
                          style={{
                            borderBottomWidth: '1px',
                            padding: '0.55rem',
                            textAlign: 'right'
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 700,
                              color: '#006397'
                            }}
                          >
                            {total_igst_amount}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            backgroundColor: '#006397',
                            padding: '0.55rem'
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 700,
                              color: '#fff'
                            }}
                          >
                            Total:
                          </div>
                        </td>
                        <td
                          style={{
                            backgroundColor: '#006397',
                            padding: '0.5rem',
                            textAlign: 'right'
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 700,
                              color: '#fff'
                            }}
                          >
                            {total_amount}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
            gap: '2rem'
          }}
        >
          <div
            style={{
              paddingLeft: '3.5rem',
              paddingRight: '3.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              color: '#404040'
            }}
          >
            <p style={{ color: '#006397', fontWeight: 700 }}>PAYMENT DETAILS</p>
            <p style={{ margin: 0 }}>Bank Name: {bank_name}</p>
            <p style={{ margin: 0 }}>Account Number: {account_number}</p>
            <p style={{ margin: 0 }}>IFSC Code: {ifsc_code}</p>
            <p style={{ margin: 0 }}>Swift Code: {swift_code}</p>
          </div>

          <div
            style={{
              paddingLeft: '3.5rem',
              paddingRight: '3.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              color: '#404040',
              textAlign: 'right'
            }}
          >
            {image_url && (
              <img
                src={image_url}
                alt="Placeholder"
                style={{
                  width: '150px',
                  height: '100px',
                  paddingRight: '25px'
                }}
              />
            )}
            <p style={{ color: '#006397', fontWeight: 700 }}>Authorized Signature</p>
          </div>
        </div> */}

        <div
          style={{
            padding: '2rem 2.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: '#404040',
            textAlign: 'center',
            backgroundColor: '#dae5f0'
          }}
        >
          <p style={{ margin: 0, color: '#006397', fontWeight: 700 }}>{notes}</p>
          <p style={{ margin: 0, fontStyle: 'italic' }}>{terms_and_conditions}</p>
        </div>
      </div>
    );
  };
  const downloadInvoice = async (id) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('auth-user'));
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
        showSnackbar('Invalid response from server', 'error');
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
      showSnackbar('Invalid response from server', 'error');
    }
  };
  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Box
        sx={{
          width: 1,
          position: 'relative',
          height: { sm: 'calc(100vh - 80px)', md: 'calc(100vh - 96px)' },
          minHeight: { xs: 'calc(100vh - 64px)', sm: 500, md: 600 },
          p: 0,
          height: '100%'
        }}
      >
        {/* backgroundColor: '#f1f5f9', */}
        <Grid container sx={{ height: 1 }}>
          <Grid
            sx={{
              order: { xs: -1, sm: 0 },
              bgcolor: 'grey.100',
              borderRadius: { xs: 6, sm: 8, md: 10 },
              border: '1px solid rgb(0 99 151 / 16%)',
              overflow: 'hidden'
            }}
            size={{ xs: 12, sm: 8 }}
          >
            <InvoiceTemplate {...invoice} billing_address={invoice.billing_address} shipping_address={invoice.shipping_address} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ p: { xs: 3, sm: 7 }, height: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  mb: 10,
                  '& .gradient-fab': { display: 'contents', '& svg': { width: { xs: 89, sm: 100 }, height: { xs: 89, sm: 100 } } }
                }}
              >
                <GradientFab type="star" icon={<LogoSection isIcon={true} />} />
              </Box>
              <Stack direction="column" sx={{ gap: 0.5, mb: 10 }}>
                <Typography variant="h4" sx={{ fontWeight: 400 }}>
                  Invoice successfully created!
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.700' }}>
                  Now that you have created the invoice, choose your next step from the actions below
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 2, mb: 2 }}>
                <Button fullWidth onClick={updateStatus} disabled={invoice.invoice_status === 'Approved'} variant="contained">
                  Approve Invoice
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    downloadInvoice(invoice_id);
                    // showSnackbar('Coming soon', 'success');
                  }}
                >
                  View Invoice
                </Button>
              </Stack>
              <Stack direction="column">
                <Button fullWidth variant="outlined" onClick={() => router.push(`recordpayment?id=${invoice_id}`)}>
                  Update Payment Status
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ContainerWrapper>
  );
}

EarlyAccess.propTypes = { heading: PropTypes.string, caption: PropTypes.string, primaryBtn: PropTypes.any, image: PropTypes.any };
