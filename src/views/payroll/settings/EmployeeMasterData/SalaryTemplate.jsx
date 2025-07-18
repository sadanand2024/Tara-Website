import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Tooltip, Stack } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';

// Constants
const CALCULATION_TYPES = {
  PERCENTAGE_CTC: 'Percentage of CTC',
  PERCENTAGE_BASIC: 'Percentage of Basic',
  FLAT_AMOUNT: 'Flat Amount'
};

// Helper functions
const calculateEarnings = (earning, annualCtc, basicAnnual) => {
  let monthlyAmount = 0;
  let annualAmount = 0;
  const calcValue = parseFloat(earning.calculation || 0);

  switch (earning.component_name) {
    case 'Basic':
      if (earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_CTC) {
        annualAmount = (annualCtc * calcValue) / 100;
      } else if (earning.calculation_type === CALCULATION_TYPES.FLAT_AMOUNT) {
        monthlyAmount = calcValue;
        annualAmount = monthlyAmount * 12;
      }
      break;

    case 'HRA':
      if (earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_BASIC) {
        annualAmount = (basicAnnual * calcValue) / 100;
      } else if (earning.calculation_type === CALCULATION_TYPES.FLAT_AMOUNT) {
        monthlyAmount = calcValue;
        annualAmount = monthlyAmount * 12;
      }
      break;

    case 'Fixed Allowance':
      return { monthly: 0, annually: 0 };

    default:
      if (earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_CTC) {
        annualAmount = (annualCtc * calcValue) / 100;
      } else if (earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_BASIC) {
        annualAmount = (basicAnnual * calcValue) / 100;
      } else if (earning.calculation_type === CALCULATION_TYPES.FLAT_AMOUNT) {
        monthlyAmount = calcValue;
        annualAmount = monthlyAmount * 12;
      }
  }

  if (annualAmount && monthlyAmount === 0) {
    monthlyAmount = annualAmount / 12;
  }

  return {
    monthly: Math.round(monthlyAmount * 100) / 100,
    annually: Math.round(annualAmount * 100) / 100
  };
};

const calculateFixedAllowance = (annualCtc, earnings, benefits) => {
  const totalWithoutFA = earnings
    .filter((e) => e.component_name !== 'Fixed Allowance')
    .reduce((sum, e) => sum + parseFloat(e.annually || 0), 0);

  const benefitsTotal = benefits?.reduce((sum, b) => (b.annually !== 'NA' ? sum + parseFloat(b.annually || 0) : sum), 0) || 0;

  const faAnnual = annualCtc - totalWithoutFA - benefitsTotal;
  const faMonthly = faAnnual / 12;

  return {
    monthly: Math.round(faMonthly * 100) / 100,
    annually: Math.round(faAnnual * 100) / 100
  };
};

export default function RenderSalaryTemplateTable({
  values,
  setFieldValue,
  setValues,
  enablePreviewButton,
  setEnablePreviewButton,
  createdEmployeeId
}) {
  const [searchParams] = useSearchParams();
  const payrollId = searchParams.get('payrollid');
  const template_id = searchParams.get('template_id');
  const [earningsData, setEarningsData] = useState([]);
  const [fixedAllowance, setFixedAllowance] = useState({ monthly: 0, annually: 0 });
  const [loading, setLoading] = useState(false);
  const [viewPreview, setViewPreview] = useState(false);
  const dispatch = useDispatch();

  const get_individual_componnet_data = async (id) => {
    setLoading(true);
    const url = `/payroll/earnings/${id}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) return res.data;
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
    const faIndex = finalEarnings.findIndex((e) => e.component_name === 'Fixed Allowance');
    if (faIndex >= 0) {
      const fa = calculateFixedAllowance(annualCtc, finalEarnings, values.benefits);
      finalEarnings[faIndex] = {
        ...finalEarnings[faIndex],
        monthly: fa.monthly,
        annually: fa.annually
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

    const fa = calculateFixedAllowance(annualCtc, updatedEarnings, values.benefits);
    if (fa.annually < 0) {
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
      employee: createdEmployeeId,
      earnings: [
        ...updatedEarnings.filter((e) => e.component_name !== 'Fixed Allowance'),
        {
          component_name: 'Fixed Allowance',
          calculation_type: 'Fixed',
          calculation: 0,
          monthly: fa.monthly,
          annually: fa.annually
        }
      ]
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
    console.log(res.data);
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

  // Effects
  useEffect(() => {
    const annualCtc = parseFloat(values.annual_ctc || 0);
    if (!annualCtc || isNaN(annualCtc) || values.earnings.length === 0) return;

    // Sort to ensure Basic is first
    const basic = values.earnings.find((e) => e.component_name === 'Basic');
    const others = values.earnings.filter((e) => e.component_name !== 'Basic');
    const earningsClone = basic ? [basic, ...others] : [...values.earnings];

    // First pass to calculate Basic
    let basicAnnual = 0;
    const withBasic = earningsClone.map((e) => {
      const result = calculateEarnings(e, annualCtc, 0);
      if (e.component_name === 'Basic') basicAnnual = result.annually;
      return { ...e, monthly: result.monthly, annually: result.annually };
    });

    // Second pass with Basic annual value
    const finalEarnings = withBasic.map((e) => {
      const result = calculateEarnings(e, annualCtc, basicAnnual);
      return { ...e, monthly: result.monthly, annually: result.annually };
    });

    // Calculate Fixed Allowance
    const fa = calculateFixedAllowance(annualCtc, finalEarnings, values.benefits);
    const faIndex = finalEarnings.findIndex((e) => e.component_name === 'Fixed Allowance');
    if (faIndex >= 0) {
      finalEarnings[faIndex] = {
        ...finalEarnings[faIndex],
        monthly: fa.monthly,
        annually: fa.annually
      };
    }

    setFieldValue('earnings', finalEarnings);
    setFieldValue('errorMessage', '');
    setEnablePreviewButton(true);
  }, [values.annual_ctc]);

  useEffect(() => {
    const annualCtc = parseFloat(values.annual_ctc || 0);
    if (!annualCtc || values.earnings.length === 0) return;

    const fa = calculateFixedAllowance(annualCtc, values.earnings, values.benefits);
    setFixedAllowance(fa);
  }, [values.annual_ctc, values.earnings, values.benefits]);

  useEffect(() => {
    if (!payrollId) return;
    // Always fetch earnings dropdown
    getEarnings_Details(payrollId);
    const timeout = setTimeout(() => {
      const hasCreatedEmployeeId = !!createdEmployeeId;
      const hasValuesId = !!values?.id;

      if (hasCreatedEmployeeId && !hasValuesId) {
        setBasicFromMaster(payrollId); // ✅ Only call in this case
      } else if (!hasCreatedEmployeeId && !hasValuesId) {
        setBasicFromMaster(payrollId); // ✅ Also call if neither exists yet
      }
    }, 200); // Wait 200ms to ensure async values are set

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [payrollId, template_id, createdEmployeeId, values?.id]);

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
  // Utility function to format numbers with Indian comma separators
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

  // State to track input values separately from calculation values
  const [inputValues, setInputValues] = useState({});
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
                <TableCell>
                  <CustomAutocomplete
                    options={earningsData
                      .map((item) => item.component_name)
                      .filter(
                        (name) => name !== 'Fixed Allowance' && !values.earnings.some((e) => e.component_name === name && e !== earning)
                      )}
                    value={earning.component_name}
                    onChange={(e, value) => handleComponentChange(value, index)}
                    disabled={index === 0}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
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
                      {earning.component_name === 'Basic' && earning.calculation_type === CALCULATION_TYPES.FLAT_AMOUNT
                        ? 'Flat Amount of CTC'
                        : earning.component_name === 'Basic' && earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_BASIC
                          ? 'Percentage of CTC'
                          : earning.calculation_type || '—'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell> {formatNumberIN(earning.monthly.toFixed(2))}</TableCell>
                <TableCell>{formatNumberIN(earning.annually.toFixed(2))}</TableCell>
                <TableCell>
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
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5">Fixed Allowance</Typography>
                <Tooltip title="Monthly CTC - Sum of all other components - Benefits" placement="top" arrow>
                  <InfoOutlinedIcon sx={{ fontSize: 18, color: 'gray', cursor: 'pointer' }} />
                </Tooltip>
              </Stack>
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
              {values?.deductions.map((item, index) => (
                <TableRow key={`deduction-${index}`}>
                  <TableCell>{item.component_name}</TableCell>
                  <TableCell>{item.calculation_type}</TableCell>
                  <TableCell>{item.monthly === 'NA' ? 'NA' : formatNumberIN(Number(item.monthly || 0).toFixed(2))}</TableCell>
                  <TableCell>{item.annually === 'NA' ? 'NA' : formatNumberIN(Number(item.annually || 0).toFixed(2))}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}

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
