import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Stack
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';

export default function RenderSalaryTemplateTable({ values, setFieldValue, setValues, enablePreviewButton, setEnablePreviewButton }) {
  const [searchParams] = useSearchParams();
  const payrollId = searchParams.get('payrollid');
  const template_id = searchParams.get('template_id');
  const [earningsData, setEarningsData] = useState([]);
  const [deductionsData, setDeductionsData] = useState([]);
  const [fixedAllowance, setFixedAllowance] = useState({ monthly: 0, annually: 0 });
  const [loading, setLoading] = useState(false);
  const [viewPreview, setViewPreview] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [deductionInputValues, setDeductionInputValues] = useState({});
  const dispatch = useDispatch();

  const get_individual_componnet_data = async (id) => {
    setLoading(true);
    const url = `/payroll/earnings/${id}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) return res.data;
  };

  const getDeductions_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/deductions/?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setDeductionsData(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const getEarnings_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/earnings?payroll_id=${id}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);

    if (res?.status_cd === 0) {
      setEarningsData(res.data); // 🔁 Always update dropdown options

      // ✅ Only auto-insert Basic if:
      // - it's a NEW template (no template_id)
      // - Basic not already present
      if (!template_id && !values.earnings?.some((e) => e.component_name === 'Basic')) {
        const basicComponent = res.data.find((item) => item.component_name === 'Basic');
        if (!basicComponent) return;

        const selectedItem = await get_individual_componnet_data(basicComponent.id);
        if (!selectedItem) return;

        const calcType = selectedItem.calculation_type?.type || 'Percentage of CTC';
        const calcValue = parseFloat(selectedItem.calculation_type?.value || 0);

        let monthly = 0,
          annually = 0;
        const annualCtc = parseFloat(values.annual_ctc || 0);

        if (annualCtc > 0 && calcType === 'Percentage of CTC') {
          annually = (annualCtc * calcValue) / 100;
          monthly = annually / 12;
        } else if (calcType === 'Flat Amount') {
          monthly = calcValue;
          annually = monthly * 12;
        }

        const newBasic = {
          component_name: 'Basic',
          calculation_type: calcType,
          calculation: calcValue,
          monthly: Math.round(monthly * 100) / 100,
          annually: Math.round(annually * 100)
        };

        const hasBlank = values.earnings.length === 1 && !values.earnings[0].component_name;

        setValues((prev) => ({
          ...prev,
          earnings: hasBlank ? [newBasic] : [newBasic, ...prev.earnings.filter((e) => e.component_name !== 'Basic')]
        }));
      }
    }
  };

  const calculateEarnings = (earning, annualCtc, basicAnnual) => {
    let monthlyAmount = 0;
    let annualAmount = 0;

    // Convert the entered calculation value (percentage or flat) to number
    const calcValue = parseFloat(earning.calculation || 0);

    // If the component is 'Basic'
    if (earning.component_name === 'Basic') {
      if (earning.calculation_type === 'Percentage of CTC') {
        annualAmount = (annualCtc * calcValue) / 100;
      } else if (earning.calculation_type === 'Flat Amount') {
        monthlyAmount = calcValue;
        annualAmount = monthlyAmount * 12;
      }
    }

    // If the component is 'HRA'
    else if (earning.component_name === 'HRA') {
      if (earning.calculation_type === 'Percentage of Basic') {
        annualAmount = (basicAnnual * calcValue) / 100;
      } else if (earning.calculation_type === 'Flat Amount') {
        monthlyAmount = calcValue;
        annualAmount = monthlyAmount * 12;
      }
    }

    // If the component is 'Fixed Allowance', it is calculated separately later
    else if (earning.component_name === 'Fixed Allowance') {
      return { monthly: 0, annually: 0 };
    }

    // For all other components
    else {
      if (earning.calculation_type === 'Percentage of CTC') {
        annualAmount = (annualCtc * calcValue) / 100;
      } else if (earning.calculation_type === 'Percentage of Basic') {
        annualAmount = (basicAnnual * calcValue) / 100;
      } else if (earning.calculation_type === 'Flat Amount') {
        monthlyAmount = calcValue;
        annualAmount = monthlyAmount * 12;
      }
    }

    // If annual is available but monthly is 0, derive it
    if (annualAmount && monthlyAmount === 0) {
      monthlyAmount = annualAmount / 12;
    }
    return {
      monthly: Math.round(monthlyAmount * 100) / 100,
      annually: Math.round(annualAmount * 100) / 100
    };
  };
  const fetch_individual_salary_templates = async (id) => {
    if (!id) return;

    const url = `/payroll/salary-templates/${id}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      const data = res.data;
      const annualCtc = parseFloat(data.annual_ctc || 0);

      // 1. Sort so 'Basic' is calculated first
      const earningsSorted = [...data.earnings].sort((a, b) => {
        if (a.component_name === 'Basic') return -1;
        if (b.component_name === 'Basic') return 1;
        return 0;
      });

      // 2. First pass: calculate Basic
      let basicAnnual = 0;
      const withBasic = earningsSorted.map((e) => {
        const result = calculateEarnings(e, annualCtc, 0);
        if (e.component_name === 'Basic') basicAnnual = result.annually;
        return { ...e, monthly: result.monthly, annually: result.annually };
      });

      // 3. Second pass: calculate rest using Basic
      const recalculated = withBasic.map((e) => {
        const result = calculateEarnings(e, annualCtc, basicAnnual);
        return { ...e, monthly: result.monthly, annually: result.annually };
      });

      // 4. Add Fixed Allowance
      const totalWithoutFA = recalculated.reduce((sum, e) => sum + parseFloat(e.annually || 0), 0);
      const benefitsTotal = data.benefits?.reduce((sum, b) => (b.annually !== 'NA' ? sum + parseFloat(b.annually || 0) : sum), 0) || 0;
      const faAnnual = annualCtc - totalWithoutFA - benefitsTotal;
      const faMonthly = faAnnual / 12;

      const fixedAllowance = {
        component_name: 'Fixed Allowance',
        calculation_type: 'Fixed',
        calculation: 0,
        monthly: Math.round(faMonthly * 100) / 100,
        annually: Math.round(faAnnual * 100) / 100
      };

      const finalEarnings = [...recalculated, fixedAllowance];

      // 5. Apply all values to Formik
      setValues({
        template_name: data.template_name || '',
        description: data.description || '',
        annual_ctc: data.annual_ctc || '',
        earnings: finalEarnings,
        gross_salary: data.gross_salary || { monthly: 0, annually: 0 },
        benefits: data.benefits || [],
        total_ctc: data.total_ctc || { monthly: 0, annually: 0 },
        deductions: data.deductions || [],
        net_salary: data.net_salary || { monthly: 0, annually: 0 },
        errorMessage: ''
      });

      // 7. Update Fixed Allowance UI state
      setFixedAllowance({
        monthly: fixedAllowance.monthly,
        annually: fixedAllowance.annually
      });

      // 8. Enable preview button always
      // setEnablePreviewButton(true);

      // 9. ✅ Show preview section *only* if benefits or deductions exist
      const hasPreview = (data.benefits?.length || 0) > 0 || (data.deductions?.length || 0) > 0;
      setViewPreview(hasPreview);
    }
  };

  const handleComponentChange = async (newValue, index) => {
    if (!newValue) return;

    const selected = earningsData.find((item) => item.component_name === newValue);
    if (!selected) return;

    const selectedItem = await get_individual_componnet_data(selected.id);
    if (!selectedItem) return;

    const annualCtc = parseFloat(values.annual_ctc || 0);
    const updated = [...values.earnings];
    const basicAnnual = parseFloat(updated.find((e) => e.component_name === 'Basic')?.annually || 0);

    // ✅ Recalculate only the selected row
    updated[index] = {
      ...updated[index],
      component_name: selectedItem.component_name,
      calculation_type: selectedItem.calculation_type?.type || '',
      calculation: selectedItem.calculation_type?.value || 0,
      ...calculateEarnings(
        {
          component_name: selectedItem.component_name,
          calculation_type: selectedItem.calculation_type?.type || '',
          calculation: selectedItem.calculation_type?.value || 0
        },
        annualCtc,
        basicAnnual
      )
    };

    // ✅ Remove accidental extra blank rows (if any)
    const cleaned = updated.filter((e, i) => e.component_name || i === index);

    setFieldValue('earnings', cleaned);
    // Update input value for the selected component
    setInputValues((prev) => ({
      ...prev,
      [index]: formatNumberForInput(selectedItem.calculation_type?.value || 0)
    }));
    setEnablePreviewButton(true);
  };

  const handleCalculationChange = (value, index) => {
    const annualCtc = parseFloat(values.annual_ctc || 0);

    // ✅ Step 1: update calculation and sort so Basic comes first
    const earningsClone = [...values.earnings]
      .map((earning, i) => (i === index ? { ...earning, calculation: value } : { ...earning }))
      .sort((a, b) => {
        if (a.component_name === 'Basic') return -1;
        if (b.component_name === 'Basic') return 1;
        return 0;
      });

    // ✅ Step 2: calculate Basic to get accurate basicAnnual
    let basicAnnual = 0;
    const firstPass = earningsClone.map((earning) => {
      const result = calculateEarnings(earning, annualCtc, 0);
      if (earning.component_name === 'Basic') {
        basicAnnual = result.annually;
      }
      return { ...earning, monthly: result.monthly, annually: result.annually };
    });

    // ✅ Step 3: second pass with basicAnnual
    const finalEarnings = firstPass.map((earning) => {
      const result = calculateEarnings(earning, annualCtc, basicAnnual);
      return { ...earning, monthly: result.monthly, annually: result.annually };
    });

    // ✅ Step 4: calculate Fixed Allowance
    const totalWithoutFA = finalEarnings
      .filter((e) => e.component_name !== 'Fixed Allowance')
      .reduce((sum, e) => sum + parseFloat(e.annually || 0), 0);

    const benefitsTotal = values.benefits?.reduce((sum, b) => (b.annually !== 'NA' ? sum + parseFloat(b.annually || 0) : sum), 0) || 0;

    const faAnnual = annualCtc - totalWithoutFA - benefitsTotal;
    const faMonthly = faAnnual / 12;

    const faIndex = finalEarnings.findIndex((e) => e.component_name === 'Fixed Allowance');
    if (faIndex >= 0) {
      finalEarnings[faIndex] = {
        ...finalEarnings[faIndex],
        monthly: Math.round(faMonthly * 100) / 100,
        annually: Math.round(faAnnual * 100) / 100
      };
    }

    setFieldValue('earnings', finalEarnings);
    setFieldValue('errorMessage', ''); // ✅ clear previous error
    setEnablePreviewButton(true);
  };

  const handleAddEarning = () => {
    const newComponent = {
      component_name: '',
      calculation_type: '',
      calculation: 0,
      monthly: 0,
      annually: 0
    };
    const updated = [...values.earnings, newComponent];
    setFieldValue('earnings', updated);

    // Initialize input value for the new component
    const newIndex = updated.length - 1;
    setInputValues((prev) => ({ ...prev, [newIndex]: '' }));

    setFieldValue('errorMessage', ''); // ✅ clear previous error
    setEnablePreviewButton(true);
  };

  const handleDeleteEarning = (index) => {
    const updated = values.earnings.filter((_, i) => i !== index);
    setFieldValue('earnings', updated);

    // Clean up input values for deleted component
    setInputValues((prev) => {
      const newInputValues = {};
      Object.keys(prev).forEach((key) => {
        const keyIndex = parseInt(key);
        if (keyIndex < index) {
          newInputValues[keyIndex] = prev[keyIndex];
        } else if (keyIndex > index) {
          newInputValues[keyIndex - 1] = prev[keyIndex];
        }
      });
      return newInputValues;
    });

    setFieldValue('errorMessage', ''); // ✅ clear previous error
    setEnablePreviewButton(true);
  };

  const handleDeductionComponentChange = async (newValue, index) => {
    if (!newValue) return;

    const selected = deductionsData.find((item) => item.deduction_name === newValue);
    if (!selected) return;

    console.log('Selected deduction:', selected);
    const updated = [...(values.deductions || [])];
    updated[index] = {
      ...updated[index],
      component_name: selected.deduction_name,
      calculation_type: selected.calculation_type?.type || '',
      calculation: selected.calculation_type?.value || 0,
      monthly: Number(selected.calculation_type?.value || 0),
      annually: Number(selected.calculation_type?.value || 0) * 12
    };

    console.log('Updated deduction at index', index, ':', updated[index]);
    setFieldValue('deductions', updated);
    setEnablePreviewButton(true);
  };

  const handleAddDeduction = () => {
    console.log('Current deductions:', values.deductions);
    const newComponent = {
      component_name: '',
      calculation_type: '',
      calculation: 0,
      monthly: 0,
      annually: 0
    };
    const updated = [...(values.deductions || []), newComponent];
    console.log('Updated deductions:', updated);
    setFieldValue('deductions', updated);
    setEnablePreviewButton(true);
  };

  const handleDeleteDeduction = (index) => {
    const updated = (values.deductions || []).filter((_, i) => i !== index);
    setFieldValue('deductions', updated);
    setEnablePreviewButton(true);
  };

  const fetch_preview = async () => {
    const annualCtc = parseFloat(values.annual_ctc || 0);

    // Step 1: Recalculate all rows with latest data
    let basicAnnual = 0;
    const tempWithBasic = values.earnings.map((earning) => {
      const result = calculateEarnings(earning, annualCtc, basicAnnual);
      if (earning.component_name === 'Basic') basicAnnual = result.annually;
      return {
        ...earning,
        monthly: result.monthly,
        annually: result.annually
      };
    });

    const updatedEarnings = tempWithBasic.map((earning) => {
      const result = calculateEarnings(earning, annualCtc, basicAnnual);
      return {
        ...earning,
        monthly: result.monthly,
        annually: result.annually
      };
    });

    const totalWithoutFA = updatedEarnings
      .filter((e) => e.component_name !== 'Fixed Allowance')
      .reduce((sum, e) => sum + parseFloat(e.annually || 0), 0);

    const benefitsTotal = values.benefits?.reduce((sum, b) => (b.annually !== 'NA' ? sum + parseFloat(b.annually || 0) : sum), 0) || 0;

    const faAnnual = annualCtc - totalWithoutFA - benefitsTotal;
    const faMonthly = faAnnual / 12;
    if (faAnnual < 0) {
      const error = 'The system calculated Fixed Allowance cannot be less than zero. Check and enter valid salary details.';
      setFieldValue('errorMessage', error);

      dispatch(
        openSnackbar({
          open: true,
          message: error,
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );

      return;
    }
    const finalPayload = {
      ...values,
      payroll: payrollId,
      earnings: [
        ...updatedEarnings.filter((e) => e.component_name !== 'Fixed Allowance'),
        {
          component_name: 'Fixed Allowance',
          calculation_type: 'Fixed',
          calculation: 0,
          monthly: Math.round(faMonthly * 100) / 100,
          annually: Math.round(faAnnual * 100) / 100
        }
      ],
      deductions: values.deductions || []
    };

    const { res } = await Factory('post', '/payroll/calculate-payroll', finalPayload);
    if (res?.status_cd === 0) {
      // Update Fixed Allowance from server response
      const fixed = res.data.earnings.find((e) => e.component_name === 'Fixed Allowance');
      if (fixed) {
        setFixedAllowance({
          monthly: parseFloat(fixed.monthly),
          annually: parseFloat(fixed.annually)
        });
      }

      // Update only preview-related values
      setValues((prev) => ({
        ...prev,
        gross_salary: res.data.gross_salary,
        total_ctc: res.data.total_ctc,
        net_salary: res.data.net_salary,
        benefits: res.data.benefits,
        deductions: res.data.deductions
      }));

      setEnablePreviewButton(false);
      setViewPreview(true);
    }
  };

  const setBasicFromMaster = async (payrollId) => {
    const url = `/payroll/earnings?payroll_id=${payrollId}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd !== 0) return;
    const basicComponent = res.data.find((item) => item.component_name === 'Basic');
    if (!basicComponent) return;

    const selectedItem = await get_individual_componnet_data(basicComponent.id);
    if (!selectedItem) return;
    const calcType = selectedItem.calculation_type?.type || 'Percentage of CTC';
    const calcValue = parseFloat(selectedItem.calculation_type?.value || 0);

    const annualCtc = parseFloat(values.annual_ctc || 0);
    let monthly = 0,
      annually = 0;

    if (annualCtc > 0 && calcType === 'Percentage of CTC') {
      annually = (annualCtc * calcValue) / 100;
      monthly = annually / 12;
    } else if (calcType === 'Flat Amount') {
      monthly = calcValue;
      annually = monthly * 12;
    }

    const newBasic = {
      component_name: 'Basic',
      calculation_type: calcType,
      calculation: calcValue,
      monthly: Math.round(monthly * 100) / 100,
      annually: Math.round(annually * 100)
    };
    const hasBlank = values.earnings.length === 1 && !values.earnings[0].component_name;
    setValues((prev) => ({
      ...prev,
      earnings: hasBlank ? [newBasic] : [newBasic, ...prev.earnings.filter((e) => e.component_name !== 'Basic')]
    }));
  };

  useEffect(() => {
    let fa = values.earnings.find((e) => e.component_name === 'Fixed Allowance');
    if (fa) {
      setFixedAllowance({
        monthly: fa.monthly,
        annually: fa.annually
      });
    }
  }, [values.earnings]);
  useEffect(() => {
    const annualCtc = parseFloat(values.annual_ctc || 0);

    if (!annualCtc || isNaN(annualCtc)) return;

    const basic = values.earnings.find((e) => e.component_name === 'Basic');
    const others = values.earnings.filter((e) => e.component_name !== 'Basic');
    const earningsClone = basic ? [basic, ...others] : [...values.earnings];

    let basicAnnual = 0;
    const withBasic = earningsClone.map((e) => {
      const result = calculateEarnings(e, annualCtc, 0);
      if (e.component_name === 'Basic') basicAnnual = result.annually;
      return { ...e, monthly: result.monthly, annually: result.annually };
    });

    const finalEarnings = withBasic.map((e) => {
      const result = calculateEarnings(e, annualCtc, basicAnnual);
      return { ...e, monthly: result.monthly, annually: result.annually };
    });

    const totalWithoutFA = finalEarnings
      .filter((e) => e.component_name !== 'Fixed Allowance')
      .reduce((sum, e) => sum + parseFloat(e.annually || 0), 0);

    const benefitsTotal = values.benefits?.reduce((sum, b) => (b.annually !== 'NA' ? sum + parseFloat(b.annually || 0) : sum), 0) || 0;

    const faAnnual = annualCtc - totalWithoutFA - benefitsTotal;
    const faMonthly = faAnnual / 12;

    const faIndex = finalEarnings.findIndex((e) => e.component_name === 'Fixed Allowance');
    if (faIndex >= 0) {
      finalEarnings[faIndex] = {
        ...finalEarnings[faIndex],
        monthly: Math.round(faMonthly * 100) / 100,
        annually: Math.round(faAnnual * 100) / 100
      };
    }

    setFieldValue('earnings', finalEarnings);
    setFieldValue('errorMessage', ''); // ✅ clear previous error
    setEnablePreviewButton(true);
  }, [values.annual_ctc]);

  useEffect(() => {
    if (!payrollId) return;

    getEarnings_Details(payrollId); // dropdown always
    getDeductions_Details(payrollId); // fetch deductions data

    // Initialize deductions array if it doesn't exist
    if (!values.deductions) {
      setFieldValue('deductions', []);
    }

    if (!template_id) {
      setBasicFromMaster(payrollId); // for new template
    } else {
      fetch_individual_salary_templates(template_id); // existing
    }
  }, [payrollId, template_id]);
  //////////////////
  useEffect(() => {
    const hasBenefits = values.benefits?.length > 0;
    const hasDeductions = values.deductions?.length > 0;
    if (hasBenefits || hasDeductions) {
      setViewPreview(true);
    }
  }, [values.benefits, values.deductions]);

  // Initialize input values when earnings change
  useEffect(() => {
    const newInputValues = {};
    values.earnings.forEach((earning, index) => {
      if (earning.calculation !== undefined && earning.calculation !== null) {
        newInputValues[index] = formatNumberForInput(earning.calculation);
      }
    });
    setInputValues(newInputValues);
  }, [values.earnings]);

  // Initialize input values when deductions change
  useEffect(() => {
    const newDeductionInputValues = {};
    (values.deductions || []).forEach((deduction, index) => {
      if (deduction.calculation !== undefined && deduction.calculation !== null) {
        newDeductionInputValues[index] = formatNumberForInput(deduction.calculation);
      }
    });
    setDeductionInputValues(newDeductionInputValues);
  }, [values.deductions]);
  const formatNumberIN = (value) => {
    if (value === '' || value === null || value === undefined || isNaN(value)) return '';
    return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  // Utility function to format numbers for input display (with commas)
  const formatNumberForInput = (value) => {
    if (value === '' || value === null || value === undefined || isNaN(value)) return '';
    return Number(value).toLocaleString('en-IN');
  };

  // Utility function to parse comma-separated numbers for calculations
  const parseCommaNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    // Remove all commas and convert to number
    const cleanValue = String(value).replace(/,/g, '');
    return isNaN(cleanValue) ? '' : cleanValue;
  };
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: 1,
        overflowX: 'auto',
        maxWidth: '100%'
      }}
    >
      <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead
          sx={{
            backgroundColor: 'primary.main',
            '& .MuiTableCell-root': {
              color: '#ffffff !important'
            }
          }}
        >
          <TableRow>
            <TableCell sx={{ width: '25%' }} align="left">
              Component
            </TableCell>
            <TableCell sx={{ width: '35%' }} align="left">
              Calculation
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="left">
              Monthly
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="left">
              Annually
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="left">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5}>
              <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                {' '}
                Earnings{' '}
              </Typography>
            </TableCell>
          </TableRow>
          {values.earnings
            .filter((e) => e.component_name !== 'Fixed Allowance')
            .map((earning, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    width: { xs: '25%', md: '20%' },
                    minWidth: 120,
                    wordBreak: 'break-word'
                  }}
                >
                  <CustomAutocomplete
                    options={earningsData
                      .map((item) => item.component_name)
                      .filter(
                        (name) => name !== 'Fixed Allowance' && !values.earnings.some((e) => e.component_name === name && e !== earning)
                      )}
                    value={earning.component_name}
                    onChange={(e, value) => handleComponentChange(value, index)}
                    disabled={earning.component_name === 'Basic'}
                    sx={{
                      '& .MuiInputBase-input': {
                        color: 'grey.600'
                      }
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    width: { xs: '35%', md: '40%' },
                    minWidth: 200,
                    wordBreak: 'break-word'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 2 }} sx={{ flexWrap: 'wrap' }}>
                    <CustomInput
                      value={inputValues[index] !== undefined ? inputValues[index] : formatNumberForInput(earning.calculation)}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow only numbers, commas, and decimal points
                        const cleanVal = val.replace(/[^\d,.]/g, '');
                        setInputValues((prev) => ({ ...prev, [index]: cleanVal }));
                      }}
                      onBlur={() => {
                        const parsedValue = parseCommaNumber(inputValues[index] || earning.calculation);
                        const updated = [...values.earnings];
                        updated[index].calculation = parsedValue;
                        setFieldValue('earnings', updated);
                        setInputValues((prev) => ({ ...prev, [index]: formatNumberForInput(parsedValue) }));
                        handleCalculationChange(parsedValue, index);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const parsedValue = parseCommaNumber(inputValues[index] || earning.calculation);
                          handleCalculationChange(parsedValue, index);
                        }
                      }}
                      type="text"
                      sx={{
                        width: { xs: 120, sm: 150, md: 200 },
                        minWidth: 100
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                        color: 'grey.700',
                        minWidth: { xs: '80px', md: '130px' },
                        fontSize: { xs: '0.75rem', md: '0.875rem' }
                      }}
                    >
                      {earning.component_name === 'Basic' && earning.calculation_type === 'Flat Amount'
                        ? 'Flat Amount of CTC'
                        : earning.component_name === 'Basic' && earning.calculation_type === 'Percentage of Basic'
                          ? 'Percentage of CTC'
                          : earning.calculation_type || '—'}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell
                  sx={{
                    width: { xs: '15%', md: '15%' },
                    minWidth: 100,
                    wordBreak: 'break-word'
                  }}
                >
                  {formatNumberIN(earning.monthly.toFixed(2))}
                </TableCell>
                <TableCell
                  sx={{
                    width: { xs: '15%', md: '15%' },
                    minWidth: 100,
                    wordBreak: 'break-word'
                  }}
                >
                  {formatNumberIN(earning.annually.toFixed(2))}
                </TableCell>
                <TableCell
                  sx={{
                    width: { xs: '10%', md: '10%' },
                    minWidth: 60,
                    textAlign: 'center'
                  }}
                >
                  {index !== 0 && (
                    <Button color="error" onClick={() => handleDeleteEarning(index)}>
                      <IconTrash size={16} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={5}>
              <Button onClick={handleAddEarning}>Add Component</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="h5" sx={{ whiteSpace: 'nowrap' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5">Fixed Allowance</Typography>
                  <Tooltip title="Monthly CTC - Sum of all other components - Benefits" placement="top" arrow>
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: 'gray', cursor: 'pointer' }} />
                  </Tooltip>
                </Stack>
              </Typography>
            </TableCell>
            <TableCell>Remaining Balance</TableCell>
            <TableCell>
              <Typography sx={{ color: fixedAllowance.monthly < 0 ? 'error.main' : 'inherit' }}>
                {formatNumberIN(fixedAllowance.monthly.toFixed(2))}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ color: fixedAllowance.annually < 0 ? 'error.main' : 'inherit' }}>
                {formatNumberIN(fixedAllowance.annually.toFixed(2))}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow sx={{ backgroundColor: '#ede7f6', borderRadius: 2 }}>
            <TableCell sx={{ padding: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {enablePreviewButton && (
                  <>
                    <Button
                      onClick={fetch_preview}
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                      disabled={!!values.errorMessage}
                    >
                      Preview
                    </Button>
                    <Tooltip title="System Calculated Components' Total" placement="right" arrow>
                      <InfoOutlinedIcon sx={{ fontSize: 18, color: 'gray', cursor: 'pointer' }} />
                    </Tooltip>
                  </>
                )}
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Gross Salary
                </Typography>
              </Stack>
            </TableCell>
            <TableCell sx={{ padding: 2 }}></TableCell>
            <TableCell>
              <Typography variant="h5">
                {typeof values.gross_salary?.monthly === 'number' ? formatNumberIN(values.gross_salary.monthly.toFixed(2)) : '-'}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h5">
                {typeof values.gross_salary?.annually === 'number' ? formatNumberIN(values.gross_salary.annually.toFixed(2)) : '-'}
              </Typography>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          {viewPreview && (
            <>
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                    Benefits
                  </Typography>
                </TableCell>
              </TableRow>
              {values?.benefits.map((item, index) => (
                <TableRow key={`benefit-${index}`}>
                  <TableCell>{item.component_name}</TableCell>
                  <TableCell>{item.calculation_type}</TableCell>
                  <TableCell>{item.monthly === 'NA' ? 'NA' : formatNumberIN(Number(item.monthly || 0).toFixed(2))}</TableCell>
                  <TableCell>{item.annually === 'NA' ? 'NA' : formatNumberIN(Number(item.annually || 0).toFixed(2))}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}

              <TableRow sx={{ backgroundColor: '#f6f2fc', margin: '20px' }}>
                <TableCell>
                  <Typography variant="h5">Total CTC</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Typography variant="h5">{formatNumberIN(Number(values.total_ctc?.monthly || 0).toFixed(2))}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">{formatNumberIN(Number(values.total_ctc?.annually || 0).toFixed(2))}</Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                    Deductions
                  </Typography>
                </TableCell>
              </TableRow>
              {(values?.deductions || []).map((item, index) => (
                <TableRow key={`deduction-${index}`}>
                  <TableCell>
                    <CustomAutocomplete
                      options={deductionsData
                        .map((item) => item.deduction_name)
                        .filter((name) => !(values.deductions || []).some((d) => d.component_name === name && d !== item))}
                      value={item.component_name}
                      onChange={(e, value) => handleDeductionComponentChange(value, index)}
                      getOptionKey={(option) => option}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CustomInput
                        value={
                          deductionInputValues[index] !== undefined ? deductionInputValues[index] : formatNumberForInput(item.calculation)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          // Allow only numbers, commas, and decimal points
                          const cleanVal = val.replace(/[^\d,.]/g, '');
                          setDeductionInputValues((prev) => ({ ...prev, [index]: cleanVal }));
                        }}
                        onBlur={() => {
                          const parsedValue = parseCommaNumber(deductionInputValues[index] || item.calculation);
                          const updated = [...(values.deductions || [])];
                          updated[index].calculation = parsedValue;
                          setFieldValue('deductions', updated);
                          setDeductionInputValues((prev) => ({ ...prev, [index]: formatNumberForInput(parsedValue) }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const parsedValue = parseCommaNumber(deductionInputValues[index] || item.calculation);
                            setDeductionInputValues((prev) => ({ ...prev, [index]: formatNumberForInput(parsedValue) }));
                          }
                        }}
                        type="text"
                        sx={{ width: '100%', maxWidth: 200 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                          color: 'grey.700',
                          minWidth: '130px'
                        }}
                      >
                        {item.calculation_type || '—'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell> {formatNumberIN(Number(item.monthly || 0).toFixed(2))}</TableCell>
                  <TableCell>{formatNumberIN(Number(item.annually || 0).toFixed(2))}</TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleDeleteDeduction(index)}>
                      <IconTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5}>
                  <Button onClick={handleAddDeduction}>Add Deduction Component</Button>
                </TableCell>
              </TableRow>

              <TableRow sx={{ backgroundColor: '#f6f2fc', margin: '20px' }}>
                <TableCell>
                  <Typography variant="h5">Net Salary (Take Home)</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Typography variant="h5">{formatNumberIN(Number(values.net_salary?.monthly || 0).toFixed(2))}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">{formatNumberIN(Number(values.net_salary?.annually || 0).toFixed(2))}</Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
