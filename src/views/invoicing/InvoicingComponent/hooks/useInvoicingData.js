import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

export const useInvoicingData = () => {
  const [businessDetails, setBusinessDetails] = useState({});
  const [customers, setCustomers] = useState([]);
  const [invoiceNumberFormat, setInvoiceNumberFormat] = useState('');
  const [itemsList, setItemsList] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('id');

  const fetchBusinessDetails = async () => {
    const businessId = user.active_context.business_id;
    const url = `/invoicing/invoicing-profiles/?business_id=${businessId}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 0) {
      setBusinessDetails(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data.error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const getCustomersData = async (id) => {
    const { res } = await Factory('get', `/invoicing/customer_profiles/?invoicing_profile_id=${id}`, {});
    if (res.status_cd === 0) {
      setCustomers(res.data.customer_profiles);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data.error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const getGoodsAndServicesData = async () => {
    const url = `/invoicing/goods-services/${businessDetails?.id}`;
    const { res } = await Factory('get', url, {});

    if (res.status_cd === 0) {
      setItemsList(res.data.goods_and_services);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data.error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const getInvoiceFormat = async () => {
    const { res } = await Factory('get', `/invoicing/latest/${businessDetails?.id}/`, {});
    console.log(res);
    if (res.status_cd === 0) {
      setInvoiceNumberFormat(res.data.latest_invoice_number);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const getIndividualInvoiceData = async () => {
    const { res } = await Factory('get', `/invoicing/individual-invoice/${invoiceId}/`, {});
    if (res.status_cd === 0) {
      setSelectedInvoice({ ...res.data });
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.error),
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
      getGoodsAndServicesData();
      getCustomersData(businessDetails?.id);
    }
  }, [businessDetails]);

  useEffect(() => {
    if (invoiceId) {
      getIndividualInvoiceData();
    }
  }, [invoiceId]);

  return {
    businessDetails,
    customers,
    itemsList,
    invoiceNumberFormat,
    selectedInvoice,
    getInvoiceFormat
  };
};
