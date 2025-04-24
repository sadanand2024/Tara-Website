import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { IconPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Autocomplete,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material';
import { IconX } from '@tabler/icons-react';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import CustomDatePicker from 'utils/CustomDateInput';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
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
      { name: 'place_of_supply', label: 'Place of Supply' },
      { name: 'invoice_number', label: 'Invoice Number' },
      { name: 'invoice_date', label: 'Invoice Date' },
      { name: 'terms', label: 'Terms' },
      // { name: 'financial_year', label: 'Financial Year' },
      { name: 'due_date', label: 'Due Date' },
      { name: 'order_number', label: 'Order Number' },
      { name: 'sales_person', label: 'Sales Person' }
    ],
    billing: [
      { name: 'address_line1', label: 'Address Line 1' },
      { name: 'address_line2', label: 'Address Line 2' },
      { name: 'country', label: 'Country' },
      { name: 'state', label: 'State' },
      { name: 'postal_code', label: 'Pincode' }
    ],
    shipping: [
      { name: 'address_line1', label: 'Address Line 1' },
      { name: 'address_line2', label: 'Address Line 2' },
      { name: 'country', label: 'Country' },
      { name: 'state', label: 'State' },
      { name: 'postal_code', label: 'Pincode' }
    ]
  });
  // const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [saveButton, setSaveButton] = useState(true);
  const [selectedgstin, setSelectedgstin] = useState('');
  const [bulkItemsDialogue, setBulkItemsDialogue] = useState(false); // State for Apply Tax checkbox
  // const [invoice_number_format, set_Invoice_number_format] = useState('');
  let termsDropdown = ['NET 15', 'NET 30', 'NET 45', 'NET 60', 'Due end of the MONTH', 'Due end of next MONTH', 'Due on Receipt', 'Custom'];

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
    setFieldValue('applied_tax', e.target.checked);
    if (!e.target.checked) {
      formik.setFieldValue('shipping_tax', 0); // If tax is not applied, reset shipping tax
      setFieldValue('selected_gst_rate', 0);
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
    customer: Yup.string().required('Customer name is required'),
    terms: Yup.string().required('Terms are required'),
    invoice_number: Yup.string().required('Invoice number is required'),
    invoice_date: Yup.date().required('Invoice date is required'),
    place_of_supply: Yup.string().required('Place of supply is required'),
    due_date: Yup.date().required('Due date is required'),
    order_number: Yup.string().required('Order number is required'),
    sales_person: Yup.string().required('Sales Person is required')

    // not_applicablefor_shipping: Yup.boolean(),

    // billing_address: Yup.object({
    //   address_line1: Yup.string().required('Address Line 1 is required'),
    //   address_line2: Yup.string().required('Address Line 2 is required'),
    //   country: Yup.string().required('Country is required'),
    //   state: Yup.string().required('State is required'),
    //   postal_code: Yup.string().required('Postal Code is required')
    // }),
    // shipping_address: Yup.object({
    //   address_line1: Yup.string().required('Address Line 1 is required'),
    //   address_line2: Yup.string().required('Address Line 2 is required'),
    //   country: Yup.string().required('Country is required'),
    //   state: Yup.string().required('State is required'),

    //   postal_code: Yup.string().when('not_applicablefor_shipping', {
    //     is: false,
    //     then: () => Yup.string().required('Postal code is required'),

    //     otherwise: Yup.string().oneOf(['NA'], 'Postal code must be "NA" when shipping is not applicable') // Ensure "NA" for "No"
    //   })
    // })
  });
  const formik = useFormik({
    initialValues: {
      gstin: '',
      customer: '',
      place_of_supply: '',
      invoice_number: '',
      invoice_date: dayjs().format('YYYY-MM-DD'),
      terms: 'Due on Receipt',
      due_date: dayjs().format('YYYY-MM-DD'),
      sales_person: '',
      order_number: '',
      billing_address: {
        address_line1: '',
        address_line2: '',
        country: 'IN',
        state: '',
        postal_code: ''
      },
      shipping_address: {
        address_line1: '',
        address_line2: '',
        country: 'IN',
        state: '',
        postal_code: ''
      },
      item_details: [
        // {
        //   item: '',
        //   quantity: 1,
        //   rate: 0,
        //   discount_type: '%',
        //   discount: 0,
        //   amount: 0,
        //   tax: 0,
        //   taxamount: 0,
        //   total_amount: 0,
        //   cgst_amount: 0,
        //   sgst_amount: 0,
        //   igst_amount: 0
        // }
      ],
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
        navigate(`/invoicing/invoice?id=${invoice_id}`);
      }
    }
  });
  const sameAddressFunction = (e) => {
    setFieldValue('same_address', e.target.checked);
    if (e.target.checked === true) {
      setFieldValue('not_applicablefor_shipping', false);

      formik.setFieldValue('shipping_address.address_line1', values.billing_address.address_line1);
      formik.setFieldValue('shipping_address.address_line2', values.billing_address.address_line2);
      formik.setFieldValue('shipping_address.state', values.billing_address.state);
      formik.setFieldValue('shipping_address.country', values.billing_address.country);
      formik.setFieldValue('shipping_address.postal_code', values.billing_address.postal_code);
    } else {
      formik.setFieldValue('shipping_address.address_line1', '');
      formik.setFieldValue('shipping_address.address_line2', '');
      formik.setFieldValue('shipping_address.state', '');
      formik.setFieldValue('shipping_address.postal_code', '');
    }
  };
  const notApplicablefor_shippingFunction = (e) => {
    setFieldValue('not_applicablefor_shipping', e.target.checked);

    if (e.target.checked === true) {
      setFieldValue('same_address', false);
      formik.setFieldValue('shipping_address.address_line1', 'NA');
      formik.setFieldValue('shipping_address.address_line2', 'NA');
      formik.setFieldValue('shipping_address.state', 'NA');
      formik.setFieldValue('shipping_address.country', 'NA');
      formik.setFieldValue('shipping_address.postal_code', 'NA');
    } else {
      setFieldValue('same_address', false);
      formik.setFieldValue('shipping_address.address_line1', '');
      formik.setFieldValue('shipping_address.address_line2', '');
      formik.setFieldValue('shipping_address.state', '');
      formik.setFieldValue('shipping_address.country', 'IN');
      formik.setFieldValue('shipping_address.postal_code', '');
    }
  };

  const renderField = (item) => {
    const fieldName = `${item.name}`;
    if (item.name === 'place_of_supply' || item.name === 'state' || item.name === 'customer' || item.name === 'terms') {
      return (
        <CustomAutocomplete
          value={formik.values[fieldName] || null}
          onChange={(event, newValue) => {
            setSaveButton(false);

            if (newValue === null) return;

            if (item.name === 'customer') {
              setValues({
                ...values,
                invoice_date: dayjs().format('YYYY-MM-DD'),
                terms: 'Due on Receipt',
                due_date: dayjs().format('YYYY-MM-DD'),
                sales_person: '',
                order_number: '',
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
                same_address: false,
                not_applicablefor_shipping: false,
                applied_tax: false,
                shipping_address: {
                  address_line1: '',
                  address_line2: '',
                  country: 'IN',
                  state: '',
                  postal_code: ''
                }
              });
              const selectedCustomer = customers?.find((customer) => customer.name === newValue);
              formik.setFieldValue('customer', newValue);
              formik.setFieldValue('place_of_supply', selectedCustomer.state);

              if (formik.values.same_address) {
                formik.setFieldValue('shipping_address.address_line1', selectedCustomer.address_line1);
                formik.setFieldValue('shipping_address.address_line2', selectedCustomer.address_line2);
                formik.setFieldValue('shipping_address.state', selectedCustomer.state);
                formik.setFieldValue('shipping_address.country', selectedCustomer.country);
                formik.setFieldValue('shipping_address.postal_code', selectedCustomer.postal_code);

                formik.setFieldValue('billing_address.address_line1', selectedCustomer.address_line1);
                formik.setFieldValue('billing_address.address_line2', selectedCustomer.address_line2);
                formik.setFieldValue('billing_address.state', selectedCustomer.state);
                formik.setFieldValue('billing_address.country', selectedCustomer.country);
                formik.setFieldValue('billing_address.postal_code', selectedCustomer.postal_code);
              } else {
                formik.setFieldValue('billing_address.address_line1', selectedCustomer.address_line1);
                formik.setFieldValue('billing_address.address_line2', selectedCustomer.address_line2);
                formik.setFieldValue('billing_address.state', selectedCustomer.state);
                formik.setFieldValue('billing_address.country', selectedCustomer.country);
                formik.setFieldValue('billing_address.postal_code', selectedCustomer.postal_code);
              }
            }
            if (item.name === 'place_of_supply') {
              formik.setFieldValue('place_of_supply', newValue); // Update item details
            }
            if (item.name === 'terms') {
              // Calculate due_date based on selected terms
              let newDueDate = null;

              switch (newValue) {
                case 'NET 15':
                  newDueDate = dayjs(formik.values.invoice_date).add(15, 'days');
                  break;
                case 'NET 30':
                  newDueDate = dayjs(formik.values.invoice_date).add(30, 'days');
                  break;
                case 'NET 45':
                  newDueDate = dayjs(formik.values.invoice_date).add(45, 'days');
                  break;
                case 'NET 60':
                  newDueDate = dayjs(formik.values.invoice_date).add(60, 'days');
                  break;
                case 'Due end of the MONTH':
                  newDueDate = dayjs(formik.values.invoice_date).endOf('month');
                  break;
                case 'Due end of next MONTH':
                  newDueDate = dayjs(formik.values.invoice_date).add(1, 'month').endOf('month');
                  break;
                case 'Due on Receipt': // Added case for "Due on Receipt"
                  newDueDate = dayjs(formik.values.invoice_date); // Set due date as the invoice date
                  break;
                default:
                  break;
              }

              formik.setFieldValue('due_date', newDueDate ? newDueDate.format('YYYY-MM-DD') : '');
            }
            formik.setFieldValue(fieldName, newValue);
          }}
          options={
            item.name === 'customer'
              ? customers?.map((customer) => customer.name)
              : item.name === 'terms'
                ? termsDropdown
                : indian_States_And_UTs
          }
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
          name={fieldName}
        />
      );
    } else if (item.name === 'invoice_date' || item.name === 'due_date') {
      const dateValue = item.name === 'invoice_date' ? formik.values.invoice_date : formik.values.due_date;

      return (
        <CustomDatePicker
          views={['year', 'month', 'day']}
          value={dateValue ? dayjs(dateValue) : null} // If empty, it should be null
          onChange={(newDate) => {
            setSaveButton(false);

            const formattedDate = dayjs(newDate).format('YYYY-MM-DD');
            if (item.name === 'invoice_date') {
              formik.setFieldValue(fieldName, formattedDate); // Set invoice date in Formik
            } else if (item.name === 'due_date') {
              formik.setFieldValue('due_date', formattedDate); // Set due date in formik
              // If the user manually selects a due date, set terms to "custom"
              if (formik.values.terms !== 'Custom') {
                formik.setFieldValue('terms', 'Custom'); // Set terms to 'custom' if a manual due date is selected
              }
            }
          }}
          // minDate={  dayjs()}
          sx={{
            width: '100%',
            '& .MuiInputBase-root': {
              fontSize: '0.75rem',
              height: '40px'
            }
          }}
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])} // Show error if field touched and has error
          helperText={formik.touched[fieldName] && formik.errors[fieldName]} // Display error message if field touched
        />
      );
    } else {
      return (
        <CustomInput
          name={fieldName}
          value={formik.values[fieldName]}
          onChange={(e) => {
            setSaveButton(false);
            formik.setFieldValue(fieldName, e.target.value);
          }} // replaced handleChange with setFieldValue
          onBlur={formik.handleBlur}
          error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
          disabled={item.name === 'invoice_number' || item.name === 'country'}
        />
      );
    }
  };
  // Function to render fields for Billing or Shipping Address sections
  const renderField2 = (item, section) => {
    const fieldName = `${section}.${item.name}`; // Concatenate the section name with the field name

    if (item.name === 'place_of_supply' || item.name === 'state') {
      return (
        <CustomAutocomplete
          value={formik.values[section][item.name]}
          onChange={(_, newValue) => {
            setSaveButton(false);
            setFieldValue(fieldName, newValue);
          }}
          options={indian_States_And_UTs} // Example options
          onBlur={formik.handleBlur}
          error={formik.touched[section]?.[item.name] && Boolean(formik.errors[section]?.[item.name])}
          helperText={formik.touched[section]?.[item.name] && formik.errors[section]?.[item.name]}
          name={fieldName}
          disabled={formik.values.same_address || formik.values.not_applicablefor_shipping}
        />
      );
    } else {
      return (
        <CustomInput
          name={fieldName}
          value={formik.values[section][item.name]}
          onChange={(e) => {
            setSaveButton(false);
            setFieldValue(fieldName, e.target.value);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched[section]?.[item.name] && Boolean(formik.errors[section]?.[item.name])}
          helperText={formik.touched[section]?.[item.name] && formik.errors[section]?.[item.name]}
          // textColor={selectedInvoice && '#776080'}
          disabled={item.name === 'country' || formik.values.same_address || formik.values.not_applicablefor_shipping}
        />
      );
    }
  };
  const handleAddItemRow = () => {
    setSaveButton(false);
    const newItemDetails = [
      ...formik.values.item_details,
      {
        item: '',
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
    let subtotalAmount = 0;
    let totalCGSTAmount = 0;
    let totalSGSTAmount = 0;
    let totalIGSTAmount = 0;
    let totalAmount = 0;

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

      // Calculate amount after discount
      const amountAfterDiscount = taxableAmount - discountAmount;

      // Calculate tax amount based on the GST rate (assuming GST rate is available on the item)
      const taxAmount = (amountAfterDiscount * tax) / 100;

      // Update item details with recalculated values
      item.amount = amountAfterDiscount;
      item.taxamount = taxAmount;
      item.total_amount = amountAfterDiscount + taxAmount;

      // Update CGST, SGST, IGST amounts based on place of supply logic
      if (values.place_of_supply === businessDetailsData.state) {
        // If place of supply is same, CGST and SGST
        item.cgst_amount = taxAmount / 2;
        item.sgst_amount = taxAmount / 2;
        item.igst_amount = 0;
        totalCGSTAmount += item.cgst_amount;
        totalSGSTAmount += item.sgst_amount;
      } else {
        // If place of supply is different, IGST
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

    // formik.setFieldValue('item_details', newItemDetails);
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
    formik.values.place_of_supply
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
  // useEffect(() => {
  //   setSelectedgstin(businessDetailsData.gstin);
  // }, [businessDetailsData]);
  console.log(values);
  return (
    // <HomeCard title={selectedInvoice ? 'Edit Invoice' : 'Create Invoice'} tagline="Some text tagline regarding invoicing.">
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
            <Typography gutterBottom>Select GSTIN</Typography>
            <CustomAutocomplete
              // value={selectedgstin}
              value={values['gstin'] || ''}
              options={[]}
              // {
              //   businessDetailsData?.gst_details?.length > 0
              //     ? businessDetailsData.gst_details.map((item) => item.gstin || 'NA') // Show 'NA' if gstin is not available
              //     : ['NA'] // Show only 'NA' if no data
              // }
              onChange={async (event, newgstin) => {
                setSelectedgstin(newgstin || 'NA');
                setFieldValue('gstin', newgstin || 'NA');
                const url = `/invoicing/invoicing-profiles/${businessDetailsData.id}/update/`;
                const postData = {
                  gstin: newgstin
                };

                const { res } = await Factory('put', url, postData);
                if (res.status_cd === 0) {
                  getInvoiceFormat();
                } else {
                  showSnackbar(JSON.stringify(res.data.data), 'error');
                }
              }}
            />
          </Grid2>
          <br />
          {addInvoiceData.invoice_data.map((item) => (
            <Grid2 size={{ xs: 12, sm: 6 }} key={item.name}>
              <div style={{ paddingBottom: '5px' }}>
                <Typography>{item.label}</Typography>
              </div>
              {renderField(item)}
            </Grid2>
          ))}
        </Grid2>
        <Divider sx={{ mb: 4, mt: 4 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Billing & Shipping Information</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={<Checkbox checked={formik.values.same_address} onChange={sameAddressFunction} name="same_address" />}
              label="Same as Billing Address"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.not_applicablefor_shipping}
                  onChange={notApplicablefor_shippingFunction}
                  name="not_applicablefor_shipping"
                />
              }
              label="Not applicable for Shipping"
            />
          </Box>
        </Box>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Billing Information</Typography>
            </Box>
            {addInvoiceData.billing.map((item) => (
              <Grid2 size={{ xs: 12 }} key={item.name} style={{ paddingBottom: '10px' }}>
                <Typography sx={{ mb: 1 }}>{item.label}</Typography>
                {renderField2(item, 'billing_address')}
              </Grid2>
            ))}
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Shipping Information</Typography>
            </Box>

            {addInvoiceData.shipping.map((item) => (
              <Grid2 size={{ xs: 12 }} key={item.name} style={{ paddingBottom: '10px' }}>
                <Typography sx={{ mb: 1 }}>{item.label}</Typography>
                {renderField2(item, 'shipping_address')}
              </Grid2>
            ))}
          </Grid2>
        </Grid2>

        <Divider sx={{ mt: 4, mb: 4 }} />
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Item Details</Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Discount type</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Tax %</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Tax Amount</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Total Amount</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.item_details.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <CustomAutocomplete
                          size="small"
                          options={itemsList.map((item) => item.name)}
                          value={item.item || null}
                          onChange={(event, newValue) => handleItemChange(index, newValue)}
                          style={{ minWidth: 230, maxWidth: 230 }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </TableCell>

                      <TableCell>
                        <CustomInput
                          name={`item_details[${index}].quantity`}
                          value={item.quantity}
                          style={{ minWidth: 100, maxWidth: 100 }}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      </TableCell>

                      <TableCell>
                        <CustomInput
                          name={`item_details[${index}].rate`}
                          value={item.rate}
                          style={{ minWidth: 120, maxWidth: 120 }}
                          onChange={(e) => handleRateChange(index, e.target.value)}
                        />
                      </TableCell>

                      <TableCell>
                        <CustomAutocomplete
                          options={['%', '₹']}
                          value={item.discount_type || ''}
                          onChange={(event, newDiscountType) => handleDiscountTypeChange(index, newDiscountType)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </TableCell>

                      <TableCell>
                        <CustomInput
                          name={`item_details[${index}].discount`}
                          value={item.discount}
                          style={{ minWidth: 100, maxWidth: 100 }}
                          onChange={(e) => handleDiscountChange(index, e.target.value)}
                        />
                      </TableCell>

                      <TableCell>{item.amount.toFixed(2)}</TableCell>

                      <TableCell>{item.tax}</TableCell>

                      <TableCell>{item.taxamount.toFixed(2)}</TableCell>

                      <TableCell> {item.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <ListItemButton sx={{ color: '#d32f2f' }} onClick={() => handleDeleteItem(index)}>
                          {' '}
                          <ListItemIcon>
                            <IconTrash size={16} style={{ color: '#d32f2f' }} />
                          </ListItemIcon>
                        </ListItemButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={handleAddItemRow}>
                Add New Row
              </Button>
              <Button
                variant="contained"
                startIcon={<IconPlus size={16} />}
                onClick={() => {
                  setSaveButton(false);
                  setBulkItemsDialogue(true);
                }}
              >
                Add Items in Bulk
              </Button>
            </Box>
          </Box>
        </Grid2>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Typography gutterBottom>Customer Notes</Typography>
              <CustomInput
                multiline
                minRows={4}
                maxRows={6}
                name="notes" // Assuming 'notes' is the key in your initialValues
                value={formik.values.notes}
                onChange={(e) => {
                  setSaveButton(false);
                  formik.setFieldValue('notes', e.target.value);
                }}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Terms & Conditions</Typography>
              <CustomInput
                multiline
                minRows={4}
                maxRows={6}
                name="terms_and_conditions" // Assuming 'terms_and_conditions' is the key in your initialValues
                value={formik.values.terms_and_conditions}
                onChange={(e) => {
                  setSaveButton(false);
                  formik.setFieldValue('terms_and_conditions', e.target.value);
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Sub Total:</Typography>
              <Typography variant="body1">{formik.values.subtotal_amount.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                  Shipping Charges:
                </Typography>
                <CustomInput
                  name="shipping_amount"
                  x
                  value={formik.values.shipping_amount}
                  onChange={handleShippingAmountChange}
                  sx={{ minWidth: '200px', maxWidth: '200px', ml: 1, mt: -1, mr: 2 }}
                />
                <Typography variant="body1">{formik.values.shipping_amount.toFixed(2)}</Typography>
              </Box>

              <FormControlLabel
                control={<Checkbox checked={formik.values.applied_tax} onChange={handleApplyTaxChange} name="apply_tax_on_shipping" />}
                label="Apply Tax on Shipping Charge"
              />

              {formik.values.applied_tax && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <InputLabel>GST Rate</InputLabel>
                    <Select value={formik.values.selected_gst_rate} onChange={handleGSTRateChange} sx={{ minWidth: 120 }}>
                      {gstRates.map((rate) => (
                        <MenuItem key={rate} value={rate}>
                          {rate}%
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Shipping Amount (With Tax): {formik.values.shipping_amount_with_tax.toFixed(2)}
                  </Typography>
                </>
              )}
            </Box>

            {formik.values.total_cgst_amount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">CGST:</Typography>
                <Typography variant="body1">{formik.values.total_cgst_amount.toFixed(2)}</Typography>
              </Box>
            )}

            {formik.values.total_sgst_amount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">SGST:</Typography>
                <Typography variant="body1">{formik.values.total_sgst_amount.toFixed(2)}</Typography>
              </Box>
            )}

            {formik.values.total_igst_amount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">IGST:</Typography>
                <Typography variant="body1">{formik.values.total_igst_amount.toFixed(2)}</Typography>
              </Box>
            )}

            {formik.values.applied_tax && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Tax on Shipping:</Typography>
                <Typography variant="body1">{formik.values.shipping_tax.toFixed(2)}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formik.values.total_amount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 3, mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6, gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            type="button"
            onClick={() => {
              navigate(`/invoicing`);
            }}
          >
            Cancel
          </Button>
          {/* <Button
              variant="contained"
              type="button"
              onClick={() => {
                formik.setFieldValue('invoice_status', 'Draft'); // 'Draft' should be a string
                formik.handleSubmit();
              }}
              // disabled={formik.values.invoice_status === 'Draft'}
            >
              Save as Draft
            </Button> */}

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
    // </HomeCard>
  );
};

export default AddItem;
