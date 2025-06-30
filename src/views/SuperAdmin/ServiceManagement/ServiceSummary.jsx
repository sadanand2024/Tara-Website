import React from 'react';
import ServiceRequests from './ServiceTable';
import MainCard from 'ui-component/cards/MainCard';

const ServiceSummary = () => {
  return (
    <MainCard title="Service Summary">
      <ServiceRequests />
    </MainCard>
  );
};

export default ServiceSummary;
