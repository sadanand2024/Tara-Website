'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Stepper, Step, StepLabel, Stack } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import BasicDetails from './BasicDetails';
import SalaryDetails from './SalaryDetails';
import PersonalDetails from './PersonalDetails';
import PaymentInformation from '../EmployeeMasterData/PaymentInformation';
import MainCard from 'ui-component/cards/MainCard';
import Loader from 'ui-component/Loader';
import Factory from 'utils/Factory';

function StepperComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [payrollId, setPayrollId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = ['Basic Details', 'Salary Details', 'Personal Details', 'Payment Information'];

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const handleReset = () => setActiveStep(0);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicDetails employeeData={employeeData} />;
      case 1:
        return <SalaryDetails employeeData={employeeData} />;
      case 2:
        return <PersonalDetails employeeData={employeeData} />;
      case 3:
        return <PaymentInformation employeeData={employeeData} />;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  const fetchEmployeeData = async (id) => {
    setLoading(true);
    const url = `/payroll/employees/${id}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    console.log(res);
    if (res?.status_cd === 0) {
      setEmployeeData(res.data);
    } else {
      setEmployeeData(null);
    }
  };

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    const tabValue = searchParams.get('tabValue');
    if (tabValue) setActiveStep(Number(tabValue));
  }, [searchParams]);

  useEffect(() => {
    const empId = searchParams.get('employee_id');
    if (empId) setEmployeeId(empId);
  }, [searchParams]);

  useEffect(() => {
    if (employeeId) fetchEmployeeData(employeeId);
  }, [employeeId]);
  console.log(employeeData);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <MainCard title="Employee Master Data" tagline="Manage employee profile details before processing payroll.">
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label, idx) => (
              <Step key={idx}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length ? (
            <Box textAlign="center" mt={4}>
              <Typography variant="h5" gutterBottom>
                All steps completed!
              </Typography>
              <Button variant="contained" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          ) : (
            <>
              {renderStepContent(activeStep)}

              <Stack direction="row" justifyContent="space-between" mt={4}>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                    Back to Dashboard
                  </Button>
                  <Button variant="contained" onClick={handleBack} disabled={activeStep === 0}>
                    Back
                  </Button>
                </Stack>

                <Button variant="contained" color="primary" onClick={handleNext} disabled={activeStep === steps.length - 1}>
                  Next
                </Button>
              </Stack>
            </>
          )}
        </MainCard>
      )}
    </>
  );
}

export default StepperComponent;
