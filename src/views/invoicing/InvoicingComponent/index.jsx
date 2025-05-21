import React from 'react';
import AddInvoice from './AddInvoice';
import MainCard from '../../../ui-component/cards/MainCard';
import { useInvoicingData } from './hooks/useInvoicingData';

const InvoicingComponent = () => {
  const {
    businessDetails,
    customers,
    itemsList,
    invoiceNumberFormat,
    selectedInvoice,
    getInvoiceFormat,
    getGoodsAndServicesData,
    branches,
    setInvoiceNumberFormat
  } = useInvoicingData();

  return (
    <MainCard title="Invoice Generation">
      <AddInvoice
        businessDetailsData={businessDetails}
        customers={customers}
        invoice_number_format={invoiceNumberFormat}
        itemsList={itemsList}
        selectedInvoice={selectedInvoice}
        getInvoiceFormat={getInvoiceFormat}
        getGoodsAndServicesData={getGoodsAndServicesData}
        branches={branches}
        setInvoiceNumberFormat={setInvoiceNumberFormat}
      />
    </MainCard>
  );
};

export default InvoicingComponent;
