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

export default function RenderSalaryTemplateTable({
  source,
  values,
  setFieldValue,
  setValues,
  enablePreviewButton,
  setEnablePreviewButton,
  createdEmployeeId
}) {
  // console.log(values);
  // console.log(createdEmployeeId);
  const [searchParams] = useSearchParams();
  const payrollId = searchParams.get('payrollid');
  const template_id = searchParams.get('template_id');
  const employee_id = searchParams.get('employee_id');
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
      const faAnnual = annualCtc - totalWithoutFA;
      const faMonthly = faAnnual / 12;

      const fixedAllowance = {
        component_name: 'Fixed Allowance',
        calculation_type: 'Fixed',
        calculation: 0,
        monthly: Math.round(faMonthly * 100) / 100,
        annually: Math.round(faAnnual * 100)
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

      // 6. Apply all values to Formik
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

    const faAnnual = annualCtc - totalWithoutFA;
    const faMonthly = faAnnual / 12;

    const faIndex = finalEarnings.findIndex((e) => e.component_name === 'Fixed Allowance');
    if (faIndex >= 0) {
      finalEarnings[faIndex] = {
        ...finalEarnings[faIndex],
        monthly: Math.round(faMonthly * 100) / 100,
        annually: Math.round(faAnnual * 100)
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

    setFieldValue('errorMessage', ''); // ✅ clear previous error
    setEnablePreviewButton(true);
  };

  const handleDeleteEarning = (index) => {
    const updated = values.earnings.filter((_, i) => i !== index);
    setFieldValue('earnings', updated);

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

    const totalWithoutFA = updatedEarnings
      .filter((e) => e.component_name !== 'Fixed Allowance')
      .reduce((sum, e) => sum + parseFloat(e.annually || 0), 0);

    const fixedAnnual = annualCtc - totalWithoutFA;
    const fixedMonthly = fixedAnnual / 12;
    if (fixedAnnual <= 0) {
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
          monthly: fixedMonthly,
          annually: fixedAnnual
        }
      ]
    };

    const { res } = await Factory('post', '/payroll/calculate-payroll', finalPayload);
    if (res?.status_cd === 0) {
      const fixed = res.data.earnings.find((e) => e.component_name === 'Fixed Allowance');
      if (fixed) {
        setFixedAllowance({
          monthly: parseFloat(fixed.monthly),
          annually: parseFloat(fixed.annually)
        });
      }

      const filtered = {
        ...res.data,
        earnings: res.data.earnings.filter((e) => e.component_name !== 'Fixed Allowance')
      };

      setValues(filtered);
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
    const annualCtc = parseFloat(values.annual_ctc || 0);
    const earningsTotal = values.earnings.reduce(
      (sum, e) => (e.component_name !== 'Fixed Allowance' ? sum + parseFloat(e.annually || 0) : sum),
      0
    );
    const annualFixed = annualCtc - earningsTotal;

    setFixedAllowance({
      monthly: Math.round((annualFixed / 12) * 100) / 100,
      annually: Math.round(annualFixed * 100) / 100
    });
  }, [values.earnings, values.annual_ctc]);
  useEffect(() => {
    const annualCtc = parseFloat(values.annual_ctc || 0);

    if (!annualCtc || isNaN(annualCtc)) return;

    const earningsClone = [...values.earnings].sort((a, b) => {
      if (a.component_name === 'Basic') return -1;
      if (b.component_name === 'Basic') return 1;
      return 0;
    });

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

    const faAnnual = annualCtc - totalWithoutFA;
    const faMonthly = faAnnual / 12;

    const faIndex = finalEarnings.findIndex((e) => e.component_name === 'Fixed Allowance');
    if (faIndex >= 0) {
      finalEarnings[faIndex] = {
        ...finalEarnings[faIndex],
        monthly: Math.round(faMonthly * 100) / 100,
        annually: Math.round(faAnnual * 100)
      };
    }

    setFieldValue('earnings', finalEarnings);
    setFieldValue('errorMessage', ''); // ✅ clear previous error
    setEnablePreviewButton(true);
  }, [values.annual_ctc]);
  ////////////////
  useEffect(() => {
    if (!payrollId) return;

    // Always fetch earnings dropdown
    getEarnings_Details(payrollId);

    const timeout = setTimeout(() => {
      const hasCreatedEmployeeId = !!createdEmployeeId;
      const hasValuesId = !!values?.id;

      if (!template_id) {
        // New template
        if (hasCreatedEmployeeId && !hasValuesId) {
          setBasicFromMaster(payrollId); // ✅ Only call in this case
        } else if (!hasCreatedEmployeeId && !hasValuesId) {
          setBasicFromMaster(payrollId); // ✅ Also call if neither exists yet
        }
        // ❌ Do not call if both exist
      } else {
        // Existing template
        fetch_individual_salary_templates(template_id);

        if (hasCreatedEmployeeId && !hasValuesId) {
          setBasicFromMaster(payrollId); // ✅ Only call here too
        }
      }
    }, 200); // Wait 200ms to ensure async values are set

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [payrollId, template_id, createdEmployeeId, values?.id]);

  // useEffect(() => {
  //   if (!payrollId) return;

  //   getEarnings_Details(payrollId); // dropdown always

  //   if (!template_id) {
  //     setBasicFromMaster(payrollId); // for new template
  //   } else {
  //     fetch_individual_salary_templates(template_id); // existing
  //   }
  // }, [payrollId, template_id]);
  //////////////////
  useEffect(() => {
    const hasBenefits = values.benefits?.length > 0;
    const hasDeductions = values.deductions?.length > 0;
    if (hasBenefits || hasDeductions) {
      setViewPreview(true);
    }
  }, [values.benefits, values.deductions]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: 1,
        overflowX: 'auto'
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell>Component</TableCell>
            <TableCell>Calculation</TableCell>
            <TableCell>Monthly</TableCell>
            <TableCell>Annually</TableCell>
            <TableCell>Action</TableCell>
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
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CustomInput
                      value={earning.calculation}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updated = [...values.earnings];
                        updated[index].calculation = val;
                        setFieldValue('earnings', updated);
                        setEnablePreviewButton(true);
                      }}
                      onBlur={() => {
                        handleCalculationChange(earning.calculation, index);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCalculationChange(earning.calculation, index);
                        }
                      }}
                      type="text"
                      sx={{ width: 250 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                        color: 'grey.700',
                        minWidth: '130px' // Keeps consistent spacing
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

                <TableCell>{earning.monthly.toFixed(2)}</TableCell>
                <TableCell>{earning.annually.toFixed(2)}</TableCell>
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
              <Typography variant="h5">Fixed Allowance (Monthly CTC - Sum of all other components)</Typography>
            </TableCell>
            <TableCell>Remaining Balance</TableCell>
            <TableCell>
              <Typography sx={{ color: fixedAllowance.monthly < 0 ? 'error.main' : 'inherit' }}>
                {fixedAllowance.monthly.toFixed(2)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ color: fixedAllowance.annually < 0 ? 'error.main' : 'inherit' }}>
                {fixedAllowance.annually.toFixed(2)}
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
                {typeof values.gross_salary?.monthly === 'number' ? values.gross_salary.monthly.toFixed(2) : '-'}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h5">
                {typeof values.gross_salary?.annually === 'number' ? values.gross_salary.annually.toFixed(2) : '-'}
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
                  <TableCell>{item.monthly === 'NA' ? 'NA' : Number(item.monthly || 0).toFixed(2)}</TableCell>
                  <TableCell>{item.annually === 'NA' ? 'NA' : Number(item.annually || 0).toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}

              <TableRow sx={{ backgroundColor: '#f6f2fc', margin: '20px' }}>
                <TableCell>
                  <Typography variant="h5">Total CTC</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Typography variant="h5">{Number(values.total_ctc?.monthly || 0).toFixed(2)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">{Number(values.total_ctc?.annually || 0).toFixed(2)}</Typography>
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
                  <TableCell>{item.monthly === 'NA' ? 'NA' : Number(item.monthly || 0).toFixed(2)}</TableCell>
                  <TableCell>{item.annually === 'NA' ? 'NA' : Number(item.annually || 0).toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}

              <TableRow sx={{ backgroundColor: '#f6f2fc', margin: '20px' }}>
                <TableCell>
                  <Typography variant="h5">Net Salary (Take Home)</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Typography variant="h5">{Number(values.net_salary?.monthly || 0).toFixed(2)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">{Number(values.net_salary?.annually || 0).toFixed(2)}</Typography>
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
