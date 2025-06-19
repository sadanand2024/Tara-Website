import React from 'react';
import AddInvoice from './AddInvoice';
import MainCard from '../../../ui-component/cards/MainCard';
import { useInvoicingData } from './hooks/useInvoicingData';
import { IconSettings2 } from '@tabler/icons-react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InvoicingComponent = () => {
  const navigate = useNavigate();
  const {
    businessDetails,
    customers,
    itemsList,
    invoiceNumberFormat,
    selectedInvoice,
    getInvoiceFormat,
    getGoodsAndServicesData,
    branches,
    setInvoiceNumberFormat,
    fetchBusinessDetails,
    getCustomersData,
    getBranchesData
  } = useInvoicingData();

  return (
    <MainCard
      title="Invoice Generation"
      secondary={
        <Button
          variant="outlined"
          onClick={() => navigate('/app/invoice/settings')}
          startIcon={<IconSettings2 size={18} />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Invoice Settings
        </Button>
      }
    >
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
        fetchBusinessDetails={fetchBusinessDetails}
        getCustomersData={getCustomersData}
        getBranchesData={getBranchesData}
      />
    </MainCard>
  );
};

export default InvoicingComponent;
