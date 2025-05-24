import React from 'react';
import { Box } from '@mui/material';
import BusinessIdentityStructureSection from './BusinessIdentityStructureSection';
import PromoterSignatorySection from './PromoterSignatorySection';
import BusinessPremisesSection from './BusinessPremisesSection';

const StepOne = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  handleBlur,
  setErrors,
  getBusinessIdentity,
  businessIdentityposttype
}) => {
  return (
    <Box>
      <BusinessIdentityStructureSection
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        setErrors={setErrors}
        getBusinessIdentity={getBusinessIdentity}
        businessIdentityposttype={businessIdentityposttype}
      />
      <PromoterSignatorySection
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        setErrors={setErrors}
        getBusinessIdentity={getBusinessIdentity}
        businessIdentityposttype={businessIdentityposttype}
      />
      <BusinessPremisesSection
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        setErrors={setErrors}
        getBusinessIdentity={getBusinessIdentity}
        businessIdentityposttype={businessIdentityposttype}
      />
    </Box>
  );
};

export default StepOne;
