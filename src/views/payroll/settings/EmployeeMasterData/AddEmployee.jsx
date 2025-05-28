import React, { useState, useEffect, useRef } from 'react';
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
  const [createdEmployeeId, setCreatedEmployeeId] = useState(null);
  const [from, setFrom] = useState(null);
  const steps = ['Basic Details', 'Salary Details', 'Personal Details', 'Payment Information'];

  const formRefs = useRef({});

  const handleNext = async () => {
    const submit = formRefs.current[activeStep];
    if (submit) await submit(); // trigger child form submit
  };

  const handleBack = async () => {
    const newStep = Math.max(activeStep - 1, 0);
    setActiveStep(newStep);
    if (employeeId) await fetchEmployeeData(employeeId); // ✅ refresh on back
  };

  const handleReset = () => setActiveStep(0);

  const renderStepContent = (step) => {
    const setSubmitRef = (submitFn) => {
      formRefs.current[step] = submitFn;
    };

    const commonProps = {
      employeeData,
      createdEmployeeId,
      fetchEmployeeData,
      onNext: () => setActiveStep((prev) => prev + 1),
      setSubmitRef // 👈 pass this to child
    };

    switch (step) {
      case 0:
        return <BasicDetails {...commonProps} setCreatedEmployeeId={setCreatedEmployeeId} />;
      case 1:
        return <SalaryDetails {...commonProps} from={from} />;
      case 2:
        return <PersonalDetails {...commonProps} />;
      case 3:
        return <PaymentInformation {...commonProps} />;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  const fetchEmployeeData = async (id) => {
    setLoading(true);
    const url = `/payroll/employees/${id}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      console.log(res.data);
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
    const from = searchParams.get('from');
    if (from) setFrom(from);
  }, [searchParams]);
  useEffect(() => {
    if (employeeId) fetchEmployeeData(employeeId);
  }, [employeeId]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <MainCard title="Employee Master Data">
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

                <Button variant="contained" color="primary" onClick={handleNext}>
                  Save & Continue
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
