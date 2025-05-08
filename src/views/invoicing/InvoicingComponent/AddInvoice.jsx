import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { IconPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
let baseURL = import.meta.env.VITE_APP_BASE_URL;

import InvoiceDetailsForm from './InvoiceDetailsForm';
import BillingShippingForm from './BillingShippingForm';
import ItemDetailsAndNotes from './ItemDetailsAndNotes';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { Typography, Stack } from '@mui/material';
import dayjs from 'dayjs';
import Factory from 'utils/Factory';
import BulkItems from './BulkItems';
// import { useSnackbar } from '@/components/CustomSnackbar';
import MainCard from '../../../ui-component/cards/MainCard';

const AddItem = ({
  type,
  invoice_number_format,
  getInvoiceFormat,
  selectedInvoice,
  businessDetailsData,
  customers,
  open,
  onClose,
  itemsList
}) => {
  const [addInvoiceData] = useState({
    invoice_data: [
      { name: 'customer', label: 'Customer Name' },
      { name: 'customer_gstin', label: 'Customer GSTIN' },
      { name: 'customer_pan', label: 'Customer PAN' },
      { name: 'place_of_supply', label: 'Place of Supply' },
      { name: 'invoice_number', label: 'Invoice Number' },
      { name: 'invoice_date', label: 'Invoice Date' },
      { name: 'terms', label: 'Terms' },
      // { name: 'financial_year', label: 'Financial Year' },
      { name: 'due_date', label: 'Due Date' },
      { name: 'order_number', label: 'Order Number' },
      { name: 'sales_person', label: 'Sales Person' }
    ]
  });
  // const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [saveButton, setSaveButton] = useState(true);
  const [selectedgstin, setSelectedgstin] = useState('');
  const [bulkItemsDialogue, setBulkItemsDialogue] = useState(false); // State for Apply Tax checkbox
  // const [invoice_number_format, set_Invoice_number_format] = useState('');
  const dispatch = useDispatch();
  const gstRates = [0, 5, 12, 18, 28]; // Example GST rates

  const handleShippingAmountChange = (e) => {
    const shippingCharges = parseFloat(e.target.value) || 0; // Ensure value is a number (default to 0 if invalid)
    formik.setFieldValue('shipping_amount', shippingCharges);

    // If Apply Tax checkbox is checked, calculate tax on shipping charges
    const taxOnShipping = (shippingCharges * formik.values.selected_gst_rate) / 100;
    let totalAmount = shippingCharges;

    if (formik.values.applied_tax && formik.values.selected_gst_rate > 0) {
      totalAmount += taxOnShipping;
      formik.setFieldValue('shipping_tax', taxOnShipping); // Store the calculated shipping tax
    }
    formik.setFieldValue('shipping_amount_with_tax', shippingCharges + taxOnShipping);
  };
  const handleApplyTaxChange = (e) => {
    formik.setFieldValue('applied_tax', e.target.checked);
    if (!e.target.checked) {
      formik.setFieldValue('shipping_tax', 0);
      formik.setFieldValue('selected_gst_rate', 0);
    }
  };

  const handleGSTRateChange = (e) => {
    const gstRate = e.target.value; // Get the newly selected GST rate
    setFieldValue('selected_gst_rate', gstRate);
    // Update the selected GST rate in state
    let shippingCharges = formik.values.shipping_amount;

    if (formik.values.applied_tax) {
      // If tax is applied, calculate tax on shipping charges
      const taxOnShipping = (shippingCharges * gstRate) / 100;
      formik.setFieldValue('shipping_tax', taxOnShipping);
      // Calculate total_amount shipping with tax
      const totalShippingWithTax = shippingCharges + taxOnShipping;
      formik.setFieldValue('shipping_amount_with_tax', totalShippingWithTax);
    } else {
      // If tax is not applied, set shipping amount without tax
      formik.setFieldValue('shipping_amount_with_tax', shippingCharges);
    }
  };
  const validationSchema = Yup.object({
    gstin: Yup.string().required('GSTIN is required'),
    customer: Yup.string().required('Customer name is required'),
    customer_gstin: Yup.string().required('Customer GSTIN is required'),
    customer_pan: Yup.string().required('Customer PAN is required'),
    terms: Yup.string().required('Terms are required'),
    invoice_number: Yup.string().required('Invoice number is required'),
    invoice_date: Yup.string().required('Invoice date is required'),
    place_of_supply: Yup.string().required('Place of supply is required'),
    due_date: Yup.date().required('Due date is required')
    // order_number: Yup.string().required('Order number is required'),
    // sales_person: Yup.string().required('Sales Person is required')
  });
  const formik = useFormik({
    initialValues: {
      gstin: '',
      customer: '',
      place_of_supply: '',
      invoice_number: '',
      invoice_date: '',
      terms: 'Due on Receipt',
      due_date: '',
      sales_person: '',
      order_number: '',
      billing_address: {
        address_line1: '',
        address_line2: '',
        country: 'India',
        state: '',
        postal_code: ''
      },
      shipping_address: {
        address_line1: '',
        address_line2: '',
        country: 'India',
        state: '',
        postal_code: ''
      },
      item_details: [],
      amount_invoiced: 0,
      total_cgst_amount: 0,
      total_sgst_amount: 0,
      total_igst_amount: 0,
      notes: '',
      pending_amount: 0,
      shipping_amount: 0,
      subtotal_amount: 0,
      terms_and_conditions: '',
      total_amount: 0,
      shipping_amount_with_tax: 0,
      shipping_tax: 0,
      applied_tax: false,
      invoice_status: 'Pending Approval',
      same_address: false,
      selected_gst_rate: 0,
      not_applicablefor_shipping: false
    },
    validationSchema,

    onSubmit: async (values) => {
      const currentDate = new Date();

      let financialYearStart = currentDate.getFullYear();
      let financialYearEnd = currentDate.getFullYear() + 1;

      if (currentDate.getMonth() < 3) {
        financialYearStart -= 1;
        financialYearEnd -= 1;
      }

      const financialYear = `${financialYearStart}-${financialYearEnd.toString().slice(2)}`;

      const postData = { ...values };
      postData.invoicing_profile = businessDetailsData?.id;
      postData.financial_year = financialYear;
      let selcted_gstin_format_version = businessDetailsData.invoice_format.find((item) => item.gstin === postData.gstin);
      postData.format_version = Number(selcted_gstin_format_version.invoice_format.format_version);
      if (postData.not_applicablefor_shipping === true) {
        postData.shipping_address = {};
      }
      let put_url = `/invoicing/invoice-update/${selectedInvoice?.id}/`;
      let post_url = '/invoicing/invoice-create';
      let method = selectedInvoice ? 'put' : 'post';
      let url = selectedInvoice ? put_url : post_url;
      const { res } = await Factory(method, url, postData);
      if (res.status_cd === 0) {
        resetForm();
        const invoice_id = selectedInvoice ? selectedInvoice?.id : res.id;
        // navigate(`/invoicing/invoice?id=${invoice_id}`);
        navigate(`/app/invoice`);
        // downloadInvoice(invoice_id);
      }
    }
  });
  const downloadInvoice = async (id) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${baseURL}/invoicing/create-pdf/${id}`, {
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
        // showSnackbar('Invalid response from server', 'error');
      }
    } catch (error) {
      // console.error('Error fetching PDF:', error);
      // showSnackbar('Invalid response from server', 'error');
    }
  };

  const handleAddItemRow = () => {
    setSaveButton(false);
    const newItemDetails = [
      ...formik.values.item_details,
      {
        item: '',
        note: '',
        quantity: 1,
        rate: 0,
        discount_type: '%',
        discount: 0,
        amount: 0,
        tax: 0,
        taxamount: 0,
        total_amount: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        units: ''
      }
    ];

    // Update Formik state with new item details
    formik.setFieldValue('item_details', newItemDetails);
  };

  const recalculateTotals = () => {
    const values = formik.values;

    if (!values.item_details.length) {
      formik.setFieldValue('subtotal_amount', 0);
      formik.setFieldValue('total_cgst_amount', 0);
      formik.setFieldValue('total_sgst_amount', 0);
      formik.setFieldValue('total_igst_amount', 0);
      formik.setFieldValue('shipping_tax', 0);
      formik.setFieldValue('shipping_amount', 0);
      formik.setFieldValue('shipping_amount_with_tax', 0);
      formik.setFieldValue('selected_gst_rate', 0);
      formik.setFieldValue('amount_invoiced', 0);
      formik.setFieldValue('total_amount', 0);
      formik.setFieldValue('applied_tax', false);
      formik.setFieldValue('total_discount', 0);

      return;
    }

    let subtotalAmount = 0;
    let totalCGSTAmount = 0;
    let totalSGSTAmount = 0;
    let totalIGSTAmount = 0;
    let totalAmount = 0;
    let totalDiscount = 0;

    formik.values.item_details.forEach((item) => {
      // Ensure all values are numbers before performing calculations
      const rate = Number(item.rate) || 0; // Default to 0 if invalid
      const quantity = Number(item.quantity) || 0; // Default to 0 if invalid
      const discount = Number(item.discount) || 0; // Default to 0 if invalid
      const tax = Number(item.tax) || 0; // Default to 0 if invalid
      const discountType = item.discount_type || ''; // Empty string if invalid

      // Calculate taxable amount: rate * quantity
      const taxableAmount = rate * quantity;

      // Calculate discount based on discount type
      let discountAmount = 0;
      if (discountType === '%') {
        discountAmount = (taxableAmount * discount) / 100;
      } else if (discountType === '₹') {
        discountAmount = discount;
      }
      totalDiscount += discountAmount;

      // Calculate amount after discount
      const amountAfterDiscount = taxableAmount - discountAmount;

      // Calculate tax amount based on the GST rate (assuming GST rate is available on the item)
      const taxAmount = (amountAfterDiscount * tax) / 100;

      // Update item details with recalculated values
      item.amount = amountAfterDiscount;
      item.taxamount = taxAmount;
      item.total_amount = amountAfterDiscount + taxAmount;

      // Update CGST, SGST, IGST amounts based on place of supply logic
      console.log('States comparison:', {
        place_of_supply: values.place_of_supply,
        billing_state: values.billing_address.state,
        shipping_state: values.shipping_address.state
      });

      // Normalize state values for comparison
      const normalizeState = (state) => (state ? state.toString().trim().toLowerCase() : '');

      const placeOfSupply = normalizeState(values.place_of_supply);
      const billingState = normalizeState(values.billing_address.state);
      const shippingState = values.shipping_address.state; // Don't normalize shipping state to check for exact "NA"

      // If shipping state is "NA" or empty string, consider it as same as billing state for GST calculation
      const effectiveShippingState = shippingState === 'NA' || shippingState === '' ? billingState : normalizeState(shippingState);

      const isIntraState = placeOfSupply === billingState && placeOfSupply === effectiveShippingState;

      console.log('Normalized States:', {
        placeOfSupply,
        billingState,
        shippingState,
        effectiveShippingState,
        isIntraState
      });

      if (isIntraState) {
        // If place of supply and both addresses are in same state, CGST and SGST
        item.cgst_amount = taxAmount / 2;
        item.sgst_amount = taxAmount / 2;
        item.igst_amount = 0;
        totalCGSTAmount += item.cgst_amount;
        totalSGSTAmount += item.sgst_amount;
      } else {
        // If any of the states are different, IGST
        item.cgst_amount = 0;
        item.sgst_amount = 0;
        item.igst_amount = taxAmount;
        totalIGSTAmount += item.igst_amount;
      }

      // Add to the overall totals
      subtotalAmount += amountAfterDiscount;
      totalAmount += item.total_amount;
    });
    // Update the Formik state with the calculated totals
    formik.setFieldValue('amount_invoiced', totalAmount);
    formik.setFieldValue('total_cgst_amount', totalCGSTAmount);
    formik.setFieldValue('total_sgst_amount', totalSGSTAmount);
    formik.setFieldValue('total_igst_amount', totalIGSTAmount);
    formik.setFieldValue('subtotal_amount', subtotalAmount);
    formik.setFieldValue('total_amount', totalAmount + (formik.values.shipping_amount_with_tax || 0)); // Include shipping if applicable
    formik.setFieldValue('total_discount', totalDiscount);
  };

  const handleDiscountTypeChange = (index, newDiscountType) => {
    setSaveButton(false);
    const newItemDetails = [...formik.values.item_details];
    newItemDetails[index].discount_type = newDiscountType;

    formik.setFieldValue('item_details', newItemDetails);
    recalculateTotals();
  };

  const handleQuantityChange = (index, value) => {
    setSaveButton(false);

    const newQuantity = Number(value) || 0;
    const newItemDetails = [...formik.values.item_details];
    newItemDetails[index].quantity = newQuantity;

    formik.setFieldValue('item_details', newItemDetails);
    recalculateTotals();
  };
  const handleRateChange = (index, value) => {
    setSaveButton(false);

    const newRate = Number(value) || 0;
    const newItemDetails = [...formik.values.item_details];
    newItemDetails[index].rate = newRate;

    formik.setFieldValue('item_details', newItemDetails); // ✅ missing line
    recalculateTotals();
  };

  const handleDiscountChange = (index, value) => {
    setSaveButton(false);

    const newDiscount = value;
    const newItemDetails = [...formik.values.item_details];
    newItemDetails[index].discount = newDiscount;

    formik.setFieldValue('item_details', newItemDetails);
  };
  const handleItemChange = (index, newValue) => {
    setSaveButton(false);
    const newItemDetails = [...formik.values.item_details];
    // Fetch the selected item from the items list
    const selectedItem = itemsList.find((i) => i.name === newValue) || {};
    const gstRate = selectedItem.gst_rate ? parseFloat(selectedItem.gst_rate) : 0;
    const rate = selectedItem.selling_price || 0; // Get rate from selected item
    const discount = newItemDetails[index].discount || 0; // Get discount (default to 0)
    const quantity = newItemDetails[index].quantity || 0; // Get quantity (default to 0)
    // Calculate taxable amount (rate * quantity)
    const taxableAmount = rate * quantity;

    // Calculate amount after discount
    let amount = taxableAmount * (1 - discount / 100);

    // Calculate tax amount based on the taxable amount and GST rate
    const taxAmount = (amount * gstRate) / 100;

    // Total amount (amount after discount + tax amount)
    const totalAmount = amount + taxAmount;

    // Update the current item's details
    newItemDetails[index] = {
      ...newItemDetails[index],
      item: newValue,
      unitPrice: rate,
      hsn_sac: selectedItem.hsn_sac,
      units: selectedItem.units,
      type: selectedItem.type,
      rate: rate,
      tax: gstRate,
      amount: amount,
      taxamount: taxAmount,
      total_amount: totalAmount
    };

    // Update Formik fields with new values
    formik.setFieldValue('item_details', newItemDetails); // Set the updated item details
  };
  useEffect(() => {
    recalculateTotals();
  }, [
    formik.values.item_details,
    formik.values.shipping_amount,
    formik.values.shipping_amount_with_tax,
    formik.values.applied_tax,
    formik.values.selected_gst_rate,
    formik.values.place_of_supply,
    formik.values.billing_address.state,
    formik.values.shipping_address.state
  ]);
  useEffect(() => {
    recalculateTotals();
  }, []);

  useEffect(() => {
    if (invoice_number_format) {
      formik.setFieldValue('invoice_number', invoice_number_format);
    }
  }, [invoice_number_format]);
  const bulkItemSave = (data) => {
    formik.setFieldValue('item_details', [...formik.values.item_details, ...data]);
    recalculateTotals();
  };
  const handleDeleteItem = (index) => {
    let newItemDetails = [...formik.values.item_details];

    newItemDetails.splice(index, 1);

    formik.setFieldValue('item_details', newItemDetails);
    recalculateTotals();
  };
  const handleNoteChange = (index, value) => {
    let newItemDetails = [...formik.values.item_details];
    newItemDetails[index].note = value;
    formik.setFieldValue('item_details', newItemDetails);
  };
  useEffect(() => {
    if (selectedInvoice) {
      formik.setValues({
        ...selectedInvoice,
        invoice_date: selectedInvoice.invoice_date,
        due_date: selectedInvoice.due_date,
        billing_address: selectedInvoice.billing_address ? { ...selectedInvoice.billing_address } : {},
        shipping_address:
          Object.keys(selectedInvoice.shipping_address).length === 0
            ? { address_line1: 'NA', address_line2: 'NA', country: 'NA', state: 'NA', postal_code: 'NA' }
            : { ...selectedInvoice.shipping_address },
        item_details: Array.isArray(selectedInvoice.item_details) ? [...selectedInvoice.item_details] : [],
        same_address:
          selectedInvoice.shipping_address &&
          selectedInvoice.billing_address &&
          selectedInvoice.shipping_address.address_line1 === selectedInvoice.billing_address.address_line1 &&
          selectedInvoice.shipping_address.address_line2 === selectedInvoice.billing_address.address_line2 &&
          selectedInvoice.shipping_address.country === selectedInvoice.billing_address.country &&
          selectedInvoice.shipping_address.state === selectedInvoice.billing_address.state &&
          selectedInvoice.shipping_address.postal_code === selectedInvoice.billing_address.postal_code
            ? true
            : false,
        customer_gstin: selectedInvoice.customer_gstin,
        customer_pan: selectedInvoice.customer_pan,
        // not_applicablefor_shipping:
        //   selectedInvoice.billing_address &&
        //   selectedInvoice.shipping_address.address_line1 === 'NA' &&
        //   selectedInvoice.shipping_address.address_line2 === 'NA' &&
        //   selectedInvoice.shipping_address.country === 'NA' &&
        //   selectedInvoice.shipping_address.state === 'NA' &&
        //   selectedInvoice.shipping_address.postal_code === 'NA'
        //     ? true
        //     : false,
        not_applicablefor_shipping: Object.keys(selectedInvoice.shipping_address).length === 0 ? true : false,
        invoice_status: selectedInvoice.invoice_status,
        gstin: selectedInvoice.gstin
      });
    }
  }, [selectedInvoice]);

  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;
  useEffect(() => {
    setSelectedgstin(businessDetailsData.gstin);
  }, [businessDetailsData]);
  return (
    <MainCard>
      <Stack direction="row" sx={{ alignItems: 'end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}></Stack>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.setFieldValue('invoice_status', 'Pending Approval');
          formik.handleSubmit(); // Calls Formik's submission logic
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6">Invoice Details</Typography>
        </Box>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography gutterBottom>Select Company GSTIN</Typography>
            <CustomAutocomplete
              name="gstin"
              value={values.gstin || ''}
              onChange={async (event, newgstin) => {
                setSelectedgstin(newgstin || 'NA');
                setFieldValue('gstin', newgstin || 'NA');
                const url = `/invoicing/invoicing-profiles/${businessDetailsData.id}/update/`;
                let formdata = new FormData();
                formdata.append('gstin', newgstin || 'NA');
                const { res } = await Factory('put', url, formdata);
                if (res.status_cd === 0) {
                  getInvoiceFormat();
                } else {
                  dispatch(openSnackbar({ message: JSON.stringify(res.data.data), variant: 'error' }));
                }
              }}
              options={
                businessDetailsData?.gst_details?.length > 0 ? businessDetailsData.gst_details.map((item) => item.gstin || 'NA') : ['NA']
              }
              error={touched.gstin && Boolean(errors.gstin)}
              helperText={touched.gstin && errors.gstin}
            />
          </Grid2>
          <br />
          <InvoiceDetailsForm
            formik={formik}
            invoiceData={addInvoiceData.invoice_data}
            businessDetailsData={businessDetailsData}
            customers={customers}
            getInvoiceFormat={getInvoiceFormat}
          />
        </Grid2>
        <Divider sx={{ mb: 4, mt: 4 }} />

        <BillingShippingForm
          formik={formik}
          onStateChange={(section, newState) => {
            // Update the state in formik
            formik.setFieldValue(`${section}.state`, newState);
            // Trigger GST recalculation
            recalculateTotals();
          }}
        />

        <Divider sx={{ mt: 4, mb: 4 }} />
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <ItemDetailsAndNotes
            formik={formik}
            itemsList={itemsList}
            handleItemChange={handleItemChange}
            handleQuantityChange={handleQuantityChange}
            handleRateChange={handleRateChange}
            handleDiscountTypeChange={handleDiscountTypeChange}
            handleDiscountChange={handleDiscountChange}
            handleDeleteItem={handleDeleteItem}
            handleAddItemRow={handleAddItemRow}
            openBulkItemsModal={() => setBulkItemsDialogue(true)}
            handleShippingAmountChange={handleShippingAmountChange}
            handleApplyTaxChange={handleApplyTaxChange}
            handleGSTRateChange={handleGSTRateChange}
            gstRates={gstRates}
            handleNoteChange={handleNoteChange}
            totalDiscount={formik.values.total_discount || 0}
          />
        </Grid2>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6, gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            type="button"
            onClick={() => {
              navigate(`/app/invoice`);
            }}
          >
            Cancel
          </Button>

          <Button variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </form>

      <BulkItems
        bulkItemsDialogue={bulkItemsDialogue}
        setBulkItemsDialogue={setBulkItemsDialogue}
        itemsList={itemsList}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="xl"
        bulkItemSave={bulkItemSave}
      />
    </MainCard>
  );
};

export default AddItem;
