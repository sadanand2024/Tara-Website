import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PayrollSettingsLayout from './PayrollSettingsLayout';
import PayrollSettingsCenterLayout from './PayrollSettingsCenterLayout';

const PayrollSettings = () => {
  const [searchParams] = useSearchParams();
  const payrollSetup = searchParams.get('payroll_setup');
  return payrollSetup === 'false' ? <PayrollSettingsCenterLayout /> : <PayrollSettingsLayout />;
};

export default PayrollSettings;
