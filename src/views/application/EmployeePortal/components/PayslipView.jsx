import { Box, Button, Card, CardContent, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { IconDownload } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import { generateFinancialYears } from 'utils/FinancialYearsList';
import { months } from 'utils/MonthsList';
import MainCard from '../../../../ui-component/cards/MainCard';
import axios from 'axios';
let baseURL = import.meta.env.VITE_APP_BASE_URL;


const PaySlips = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
   const [employeeId, setEmployeeId] = useState(null);
  const [month, setMonth] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);

  // State management
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [financialYear, setFinancialYear] = useState(null);
  const [paySlipData, setPaySlipData] = useState(null);
  const [loading, setLoading] = useState(false);

  const financialYearOptions = generateFinancialYears();

  if (!user?.employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
      </Box>
    );
  }

  //   const getPaySlipData = async (monthNumber, financialYear) => {
  //     if (!monthNumber || !financialYear) return;

  //     setLoading(true);
  //     // const url = `/payroll/payslip/?month=${monthNumber}&financial_year=${financialYear}`;
  //     const url = `/payroll/employee-payslip/?month=${monthNumber}&financial_year=${financialYear}`;

  //     const { res, error } = await Factory('get', url, {});
  //     setLoading(false);

  //     // if (res?.status_cd === 0) {
  //     if (res?.status_cd === 0 && res?.data && res?.status === 200) {
  //       const data = res.data;

  //       const transformed = {
  //         employeeDetails: {
  //           employeeNo: data.associate_id,
  //           name: data.employee_name,
  //           bank: data.bank_name,
  //           accountNo: data.bank_account_number,
  //           joiningDate: data.change_date,
  //           pfNo: data.pf_account_number
  //         },
  //         earnings: {
  //           basic: data.basic_salary,
  //           hra: data.hra,
  //           conveyance: data.conveyance_allowance,
  //           specialAllowance: data.special_allowance
  //         },
  //         deductions: {
  //           esi: data.esi,
  //           pf: data.epf,
  //           tds: data.tds,
  //           pt: data.pt,
  //           loanRepayment: data.loan_emi
  //         },
  //         gross_salary: data.gross_salary,
  //         total_deductions: data.total_deductions,
  //         netPay: data.net_salary,
  //         netPayInWords: data.net_pay_in_words
  //       };

  //       setPaySlipData(transformed);
  //     } else {
  //       setPaySlipData(null);
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: JSON.stringify(res?.data?.error) || 'Failed to fetch payslip data',
  //           variant: 'alert',
  //           alert: { color: 'error' },
  //           close: false
  //         })
  //       );
  //     }
  //   };
  //  const getPaySlipData = async (monthNumber, financialYear) => {
  //     if (!monthNumber || !financialYear) return;

  //     setLoading(true);
  //     const url = `/payroll/employee-payslip/?month=${monthNumber}&financial_year=${financialYear}`;

  //     const { res, error } = await Factory('get', url, {});
  //     setLoading(false);

  //     if (res?.status_cd === 0 && res?.data && res?.status === 200) {
  //       const data = res.data;
  //       const earnings = {};
  //       const deductions = {};

  //       Object.entries(data).forEach(([key, value]) => {
  //         if (typeof value === 'number' && value !== 0) {
  //           if (
  //             [
  //               'basic_salary',
  //               'hra',
  //               'conveyance_allowance',
  //               'special_allowance',
  //               'travelling_allowance',
  //               'commission',
  //               'children_education_allowance',
  //               'overtime_allowance',
  //               'transport_allowance',
  //               'bonus',
  //               'other_earnings'
  //             ].includes(key)
  //           ) {
  //             earnings[key] = value;
  //           } else if (
  //             [
  //               'esi',
  //               'epf',
  //               'tds',
  //               'pt',
  //               'loan_emi',
  //               'other_deductions',
  //               'monthly_fixed_tds'
  //             ].includes(key)
  //           ) {
  //             deductions[key] = value;
  //           }
  //         }
  //       });

  //       const transformed = {
  //         employeeDetails: {
  //           employeeNo: data.associate_id,
  //           name: data.employee_name,
  //           bank: data.bank_name,
  //           accountNo: data.bank_account_number,
  //           joiningDate: data.change_date,
  //           pfNo: data.pf_account_number
  //         },
  //         earnings,
  //         deductions,
  //         netPay: data.net_salary,
  //         netPayInWords: data.net_pay_in_words
  //       };

  //       setPaySlipData(transformed);
  //     } else {
  //       setPaySlipData(null);
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: JSON.stringify(res?.data?.error) || 'Failed to fetch payslip data',
  //           variant: 'alert',
  //           alert: { color: 'error' },
  //           close: false
  //         })
  //       );
  //     }
  //   };
  const getPaySlipData = async (monthNumber, financialYear) => {
    if (!monthNumber || !financialYear) return;

    setLoading(true);
    const url = `/payroll/employee-payslip/?month=${monthNumber}&financial_year=${financialYear}`;

    const { res, error } = await Factory('get', url, {});
    setLoading(false);

    if (res?.status_cd === 0 && res?.data && res?.status === 200) {
      const data = res.data;
      

      // Dynamically build non-zero earnings
      const earnings = [];

      const earningFields = {
        basic_salary: 'Basic',
        hra: 'HRA',
        conveyance_allowance: 'Conveyance Allowance',
        travelling_allowance: 'Travelling Allowance',
        commission: 'Commission',
        children_education_allowance: 'Children Education Allowance',
        overtime_allowance: 'Overtime Allowance',
        transport_allowance: 'Transport Allowance',
        special_allowance: 'Special Allowance',
        bonus: 'Bonus'
      };

      Object.entries(earningFields).forEach(([key, label]) => {
        const value = data[key];
        if (typeof value === 'number' && value !== 0) {
          earnings.push({ label, amount: value });
        }
      });

      if (Array.isArray(data.other_earnings_breakdown)) {
        data.other_earnings_breakdown.forEach((item) => {
          Object.entries(item).forEach(([key, value]) => {
            if (typeof value === 'number' && value !== 0) {
              earnings.push({ label: formatLabel(key), amount: value });
            }
          });
        });
      }

      const deductions = [];

      const deductionFields = {
        epf: 'PF',
        esi: 'ESI',
        tds: 'TDS',
        pt: 'PT',
        loan_emi: 'Loan Repayment'
      };

      Object.entries(deductionFields).forEach(([key, label]) => {
        const value = data[key];
        if (typeof value === 'number' && value !== 0) {
          deductions.push({ label, amount: value });
        }
      });

      // Handle other_deductions_breakdown if exists
      if (Array.isArray(data.other_deductions_breakdown)) {
        data.other_deductions_breakdown.forEach((item) => {
          Object.entries(item).forEach(([key, value]) => {
            if (typeof value === 'number' && value !== 0) {
              deductions.push({ label: formatLabel(key), amount: value });
            }
          });
        });
      }
      const transformed = {
        employeeId: data.employee,
        employeeDetails: {
          employeeNo: data.associate_id,
          name: data.employee_name,
          bank: data.bank_name,
          accountNo: data.bank_account_number,
          joiningDate: data.change_date,
          pfNo: data.pf_account_number
        },
        earnings,
        deductions,
        gross_salary: data.gross_salary,
        total_deductions: data.total_deductions,
        netPay: data.net_salary,
        netPayInWords: data.net_pay_in_words
      };

      setPaySlipData(transformed);
      setEmployeeId(data.employee);
    } else {
      setPaySlipData(null);
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.error) || 'Failed to fetch payslip data',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const formatLabel = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const handleMonthChange = (event, newValue) => {
    if (!newValue || newValue === 'Please select') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select a month',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    const monthIndex = months.indexOf(newValue);
    const newMonth = monthIndex + 1;
    setSelectedMonth(newMonth);

    const params = new URLSearchParams(searchParams);
    params.set('month', newMonth);
    if (financialYear) {
      params.set('financial_year', financialYear);
    }
    navigate({ search: params.toString() }, { replace: true });

    // getPaySlipData(newMonth, financialYear);
  };

  const handleFinancialYearChange = (event, newValue) => {
    setFinancialYear(newValue);

    const params = new URLSearchParams(searchParams);
    if (newValue) {
      params.set('financial_year', newValue);
    } else {
      params.delete('financial_year');
    }
    if (selectedMonth) {
      params.set('month', selectedMonth);
    }
    navigate({ search: params.toString() }, { replace: true });

    // if (selectedMonth && newValue) {
    //   getPaySlipData(selectedMonth, newValue);
    // }
  };
  const viewPayslip = async (employee_id, month, financial_year) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `${baseURL}/payroll/employee-monthly-salary-template?employee_id=${employeeId}&month=${month}&financial_year=${financial_year}&year=${new Date().getFullYear()}`,
        {
          responseType: 'arraybuffer'
        }
      );
      if (response.data.byteLength > 0) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        console.error('Empty PDF received.');
      }
    } catch (error) {
      console.error('Error fetching payslip:', error);
    }
  };

  useEffect(() => {
    const monthParam = searchParams.get('month');
    const yearParam = searchParams.get('financial_year');

    if (monthParam) {
      setSelectedMonth(Number(monthParam));
    }

    if (yearParam) {
      setFinancialYear(yearParam);
    } else {
      const getCurrentFinancialYear = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const fyStart = month >= 4 ? year : year - 1;
        const fyEnd = fyStart + 1;

        return `${fyStart}-${String(fyEnd).padStart(2, '0')}`;
      };
      setFinancialYear(getCurrentFinancialYear());
    }
  }, [searchParams]);
  useEffect(() => {
    if (financialYear && selectedMonth) {
      getPaySlipData(selectedMonth, financialYear);
    }
  }, [financialYear, selectedMonth]);

  const employeeFields = [
    { name: 'employeeNo', label: 'Employee No/ID' },
    { name: 'name', label: 'Name' },
    { name: 'bank', label: 'Bank' },
    { name: 'accountNo', label: 'A/C No' },
    { name: 'joiningDate', label: 'Joining Date' },
    { name: 'pfNo', label: 'PF No' }
  ];

  //   const earningsFields = [
  //     { name: 'basic', label: 'Basic' },
  //     { name: 'hra', label: 'HRA' },
  //     { name: 'conveyance', label: 'Conveyance' },
  //     { name: 'specialAllowance', label: 'Special Allowance' }
  //   ];

  //   const deductionsFields = [
  //     { name: 'esi', label: 'ESI' },
  //     { name: 'pf', label: 'PF' },
  //     { name: 'epf', label: 'EPF' },
  //     { name: 'tds', label: 'TDS' },
  //     { name: 'pt', label: 'PT' },
  //     { name: 'loanRepayment', label: 'Loan Repayment' }
  //   ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const renderReadOnlyFields = (fields, data) =>
    fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {field.label}
        </Typography>
        <TextField
          value={data?.[field.name] || ''}
          fullWidth
          size="small"
          InputProps={{ readOnly: true }}
          sx={{ '& .MuiInputBase-input': { bgcolor: 'grey.50' } }}
        />
      </Grid2>
    ));

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Loading payslip data...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
          Pay Slip
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <CustomAutocomplete
            options={financialYearOptions}
            value={financialYear}
            onChange={handleFinancialYearChange}
            sx={{
              minWidth: 200,
              maxWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }
            }}
            renderInput={(params) => <TextField {...params} placeholder="Select Financial Year" />}
          />
          <CustomAutocomplete
            value={months[selectedMonth - 1]}
            onChange={handleMonthChange}
            options={[...months]}
            label="Select Month"
            size="small"
            sx={{
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                backgroundColor: 'background.paper',
                fontWeight: 600
              }
            }}
          />
          <Button 
            variant="outlined" 
            startIcon={<IconDownload size={20} />} 
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Download
          </Button>
        </Box>
      </Box> */}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Stack spacing={1} sx={{ mb: 3 }}>
          {/* Title */}
          <Typography variant="h4" gutterBottom>
            PaySlips
          </Typography>

          <Typography variant="body1" color="textSecondary">
            View and download your monthly payslips with complete salary and tax details.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* <CustomAutocomplete
            options={financialYearOptions}
            value={financialYear}
            onChange={handleFinancialYearChange}
            sx={{
              minWidth: 200,
              maxWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }
            }}
            renderInput={(params) => <TextField {...params} placeholder="Select Financial Year" />}
          />
          <CustomAutocomplete
            value={months[selectedMonth - 1]}
            onChange={handleMonthChange}
            options={[...months]}
            label="Select Month"
            size="small"
            sx={{
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                backgroundColor: 'background.paper',
                fontWeight: 600
              }
            }}
          /> */}
          <Button variant="outlined" startIcon={<IconDownload size={20} />} sx={{ borderColor: 'primary.main', color: 'primary.main' }} onClick={() => viewPayslip(paySlipData?.employeeId, selectedMonth, financialYear)}>
            Download
          </Button>
         {/* <Typography
  variant="body2"
  sx={{
    cursor: 'pointer',
    color: 'primary.main',
    textDecoration: 'underline'
  }}
  onClick={() => viewPayslip(paySlipData?.employeeId, selectedMonth, financialYear)}
>
  Download
</Typography> */}
        </Stack>
      </Stack>

      {/* Content */}
      {paySlipData ? (
        <MainCard sx={{ p: 3, mt: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Employee Details */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                Employee Details
              </Typography>
              <Grid2 container spacing={2}>
                {renderReadOnlyFields(employeeFields, paySlipData.employeeDetails)}
              </Grid2>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Earnings and Deductions */}
            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                  Earnings
                </Typography>
                <Stack spacing={2}>
                  {/* {earningsFields.map((field) => (
                    <Box key={field.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{field.label}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(paySlipData.earnings?.[field.name] || 0)}
                      </Typography>
                    </Box> */}
                  {paySlipData.earnings.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(item.amount)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight={600}>
                      Total (Gross Salary)
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="primary.main">
                      {formatCurrency(paySlipData.gross_salary || 0)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
                  Deductions
                </Typography>
                <Stack spacing={2}>
                  {/* {deductionsFields.map((field) => (
                    <Box key={field.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{field.label}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(paySlipData.deductions?.[field.name] || 0)}
                      </Typography>
                    </Box> */}
                  {paySlipData.deductions.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(item.amount)}
                      </Typography>
                    </Box>
                  ))}

                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight={600}>
                      Total Deductions
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="primary.main">
                      {formatCurrency(paySlipData.total_deductions || 0)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>
            </Grid2>

            <Divider sx={{ my: 3 }} />

            {/* Net Pay */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Net Pay for {months[selectedMonth - 1]} {financialYear}
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>
                {formatCurrency(paySlipData.netPay)}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {paySlipData.netPayInWords}
              </Typography>
            </Box>
          </CardContent>
        </MainCard>
      ) : (
        <MainCard sx={{ p: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No payslip data available for the selected month and financial year.
            </Typography>
          </CardContent>
        </MainCard>
      )}
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/app/employee-portal/pay-slips')}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default PaySlips;
