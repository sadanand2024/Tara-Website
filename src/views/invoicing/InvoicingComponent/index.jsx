import React, { useState, useEffect } from 'react';
import AddInvoice from './AddInvoice';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';

import { IconDivide } from '@tabler/icons-react';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useSelector } from 'react-redux';
const Index = () => {
  const [invoicesList, setInvoicesList] = useState([]);
  const [businessDetails, setBusinessDetails] = useState({});
  const [customers, setCustomers] = useState([]);
  const [invoiceNumberFormat, setInvoiceNumberFormat] = useState('');
  const [itemsList, setItemsList] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const user = useSelector((state) => state.accountReducer.user);

  const [searchParams] = useSearchParams(); // ✅ destructure array
  const invoiceId = searchParams.get('id'); // ✅ now works

  const fetchBusinessDetails = async () => {
    let businessId = user.active_context.business_id;

    let url = `/invoicing/invoicing-profiles/?business_id=${businessId}`;
    const { res } = await Factory('get', url, {});
    if (res) {
      setBusinessDetails(res.data);
    }
  };

  // Fetch Invoices List
  const getInvoicesList = async () => {
    if (businessDetails?.id) {
      const { res } = await Factory('get', `/invoicing/invoice-retrieve/${businessDetails?.id}`, {});
      if (res.status_cd === 0) {
        setInvoicesList(res.data.invoices);
      }
    }
  };

  // Fetch Customers Data
  const getCustomersData = async (id) => {
    const { res } = await Factory('get', `/invoicing/customer_profiles/?invoicing_profile_id=${id}`, {});
    if (res.status_cd === 0) {
      setCustomers(res.data.customer_profiles);
    } else {
      showSnackbar(JSON.stringify(res.data.error), 'error');
    }
  };
  const get_Goods_and_Services_Data = async () => {
    let url = `/invoicing/goods-services/${businessDetails?.id}`;
    const { res } = await Factory('get', url, {});

    if (res.status_cd === 0) {
      setItemsList(res.data.goods_and_services);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.error) || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  // Fetch Invoice Number Format
  const getInvoiceFormat = async () => {
    const { res } = await Factory('get', `/invoicing/latest/${businessDetails?.id}/`, {});
    if (res.status_cd === 0) {
      setInvoiceNumberFormat(res.data.latest_invoice_number);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.error) || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const get_Individual_Invoice_Data = async () => {
    const { res } = await Factory('get', `/invoicing/individual-invoice/${invoiceId}/`, {});
    if (res.status_cd === 0) {
      setSelectedInvoice({ ...res.data });
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.error) || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  useEffect(() => {
    if (businessDetails?.id) {
      get_Goods_and_Services_Data();
      getCustomersData(businessDetails?.id);
    }
  }, [businessDetails]);
  // useEffect(() => {
  //   if (businessDetails?.id && !invoiceId) {
  //     //   getInvoicesList();
  //     getInvoiceFormat();
  //   }
  // }, [businessDetails]);

  useEffect(() => {
    if (invoiceId) {
      get_Individual_Invoice_Data();
    }
  }, [invoiceId]);

  return (
    <AddInvoice
      invoicesList={invoicesList}
      businessDetailsData={businessDetails}
      customers={customers}
      invoice_number_format={invoiceNumberFormat}
      itemsList={itemsList}
      selectedInvoice={selectedInvoice}
      getInvoiceFormat={getInvoiceFormat}
    />
  );
};

export default Index;
