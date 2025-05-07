import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { IconTrash } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Factory from 'utils/Factory';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Constants
const CALCULATION_TYPES = {
  PERCENTAGE_CTC: 'Percentage of CTC',
  PERCENTAGE_BASIC: 'Percentage of Basic',
  FLAT_AMOUNT: 'Flat Amount',
  FIXED: 'Fixed'
};

export default function RenderSalaryTemplateTable({ values, setFieldValue, setValues, enablePreviewButton, setEnablePreviewButton }) {
  const [earningsData, setEarningsData] = useState([]);
  const [fixedAllowance, setFixedAllowance] = useState({ monthly: 0, annually: 0 });
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [template_id, setTemplate_id] = useState(null);
  const [viewPreview, setViewPreview] = useState(false);

  // Extract IDs from URL params using useMemo
  const { payrollId, templateId } = useMemo(
    () => ({
      payrollId: searchParams.get('payrollid'),
      templateId: searchParams.get('template_id')
    }),
    [searchParams]
  );

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  useEffect(() => {
    const id = searchParams.get('template_id');
    if (id) {
      setTemplate_id(id);
    }
  }, [searchParams]);

  // Memoize calculations
  const calculateEarnings = useCallback(
    (earning, annualCtc, basicSalary) => {
      if (isNaN(annualCtc) || annualCtc === '') {
        return { monthly: 0, annually: 0 };
      }

      const basicEarning = values.earnings.find((e) => e.component_name === 'Basic');
      const actualBasicSalary = basicEarning ? parseFloat(basicEarning.annually) : 0;
      let monthlyAmount = 0;
      let annualAmount = 0;

      switch (earning.component_name) {
        case 'Basic':
          if (earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_CTC) {
            const basicPercentage = parseFloat(earning.calculation);
            annualAmount = (annualCtc * basicPercentage) / 100;
          } else if (earning.calculation_type === CALCULATION_TYPES.FLAT_AMOUNT) {
            monthlyAmount = parseFloat(earning.calculation);
            annualAmount = monthlyAmount * 12;
          }
          break;

        case 'HRA':
          if (earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_BASIC) {
            const hraPercentage = parseFloat(earning.calculation);
            annualAmount = (actualBasicSalary * hraPercentage) / 100;
          } else if (earning.calculation_type === CALCULATION_TYPES.FLAT_AMOUNT) {
            monthlyAmount = parseFloat(earning.calculation);
            annualAmount = monthlyAmount * 12;
          }
          break;

        case 'Fixed Allowance':
          const earningsTotal = values.earnings.reduce((sum, e) => sum + parseFloat(e.annually || 0), 0);
          annualAmount = annualCtc - earningsTotal;
          break;

        default:
          if (earning.calculation_type === CALCULATION_TYPES.PERCENTAGE_BASIC) {
            const percentage = parseFloat(earning.calculation);
            annualAmount = (basicSalary * percentage) / 100;
          } else if (earning.calculation_type === CALCULATION_TYPES.FLAT_AMOUNT) {
            monthlyAmount = parseFloat(earning.calculation);
            annualAmount = monthlyAmount * 12;
          }
      }

      monthlyAmount = annualAmount ? annualAmount / 12 : monthlyAmount;
      return {
        monthly: Math.round(monthlyAmount * 100) / 100,
        annually: Math.round(annualAmount * 100) / 100
      };
    },
    [values.earnings]
  );

  // API calls using custom hook pattern
  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    try {
      const { res, error } = await Factory('get', url, options);
      if (res?.status_cd === 0) {
        return res.data;
      }
      throw error || new Error('API call failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEarningsChange = useCallback(
    async (selectedEarning, index, field, componentName) => {
      if (field === 'calculation') {
        setFieldValue(
          'earnings',
          values.earnings.map((e, i) => (i === index ? { ...e, calculation: componentName } : e))
        );
        return;
      }

      if (!selectedEarning?.id) return;

      const selectedItemData = await fetchData(`/payroll/earnings/${selectedEarning.id}`);
      const annualCtc = parseFloat(values.annual_ctc);

      const updatedEarnings = [...values.earnings];
      const calculatedValues = calculateEarnings(
        {
          ...updatedEarnings[index],
          calculation: selectedItemData.calculation_type.value,
          component_name: selectedItemData.component_name,
          calculation_type: selectedItemData.calculation_type.type
        },
        annualCtc,
        parseFloat(updatedEarnings.find((e) => e.component_name === 'Basic')?.annually || 0)
      );

      updatedEarnings[index] = {
        ...updatedEarnings[index],
        ...calculatedValues,
        calculation: selectedItemData.calculation_type.value,
        component_name: selectedItemData.component_name,
        calculation_type: selectedItemData.calculation_type.type
      };

      setFieldValue('earnings', updatedEarnings);
      setEnablePreviewButton(true);
    },
    [values.annual_ctc, calculateEarnings, setFieldValue]
  );

  // Memoize fixed allowance calculation
  const calculateFixedAllowance = useCallback(() => {
    const annualCtc = parseFloat(values.annual_ctc || 0);
    if (isNaN(annualCtc) || annualCtc === 0) {
      setFixedAllowance({ monthly: 0, annually: 0 });
      setFieldValue('errorMessage', '');
      return;
    }

    const totalEarnings = values.earnings.reduce(
      (sum, earning) => (earning.component_name !== 'Fixed Allowance' ? sum + parseFloat(earning.annually || 0) : sum),
      0
    );

    const annualFixedAllowance = annualCtc - totalEarnings;
    const monthlyFixedAllowance = annualFixedAllowance / 12;

    setFixedAllowance({
      monthly: Math.round(monthlyFixedAllowance * 100) / 100,
      annually: Math.round(annualFixedAllowance)
    });

    setFieldValue(
      'errorMessage',
      annualFixedAllowance <= 0
        ? 'The system calculated Fixed Allowance cannot be less than zero. Check and enter valid salary details.'
        : ''
    );
  }, [values.annual_ctc, values.earnings, setFieldValue]);

  // Effects
  useEffect(() => {
    if (payrollId) {
      fetchData(`/payroll/earnings?payroll_id=${payrollId}`).then(setEarningsData);
    }
  }, [payrollId, fetchData]);

  useEffect(() => {
    if (templateId) {
      fetchData(`/payroll/salary-templates/${templateId}`).then(setValues);
    } else if (payrollId) {
      fetchData(`/payroll/salary-benefits-details/${payrollId}`).then((data) => {
        setValues((prev) => ({
          ...prev,
          benefits: generateBenefitsArray(data),
          deductions: generateDeductionsArray(data)
        }));
      });
    }
  }, [templateId, payrollId, setValues]);

  useEffect(() => {
    calculateFixedAllowance();
  }, [values.earnings, values.annual_ctc, calculateFixedAllowance]);

  // Handlers
  const handleAddEarnings = () => {
    setFieldValue('earnings', [...values.earnings, { component_name: '', calculation: 0, monthly: 0, annually: 0 }]);
    setEnablePreviewButton(true);
  };

  const handleDeleteItem = (index) => {
    setFieldValue(
      'earnings',
      values.earnings.filter((_, i) => i !== index)
    );
    setEnablePreviewButton(true);
  };

  const getEarnings_Details = async (id) => {
    const url = `/payroll/earnings?payroll_id=${id}`;
    const data = await fetchData(url);
    if (data) {
      setEarningsData(data);

      const basicComponent = data.find((item) => item.component_name === 'Basic');

      const selectedItem = await fetchData(`/payroll/earnings/${basicComponent.id}`);
      const annualCtc = parseFloat(values.annual_ctc || 0);
      let monthlyAmount = 0;
      let annualAmount = 0;

      if (selectedItem.calculation_type.type === 'Percentage of CTC') {
        const basicPercentage = parseFloat(selectedItem.calculation_type.value);
        annualAmount = (annualCtc * basicPercentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (selectedItem.calculation_type.type === 'Flat Amount') {
        monthlyAmount = parseFloat(selectedItem.calculation_type.value);
        annualAmount = monthlyAmount * 12;
      }

      setValues((prev) => {
        return {
          ...prev,
          earnings: prev.earnings.map((earning, index) =>
            index === 0
              ? {
                  ...earning,
                  component_name: selectedItem.component_name,
                  calculation_type: selectedItem.calculation_type.type,
                  calculation: selectedItem?.calculation_type?.value,
                  monthly: monthlyAmount,
                  annually: annualAmount
                }
              : earning
          )
        };
      });
    }
  };

  const fetch_preview = async () => {
    // Calculate Fixed Allowance and validate
    const totalEarnings = values.earnings.reduce((sum, earning) => {
      if (earning.component_name !== 'Fixed Allowance') {
        return sum + parseFloat(earning.annually || 0);
      }
      return sum;
    }, 0);
    const annualCtc = parseFloat(values.annual_ctc || 0);
    const fixedAllowance = annualCtc - totalEarnings;

    // Validate Fixed Allowance
    if (fixedAllowance <= 0) {
      setFieldValue(
        'errorMessage',
        'The system calculated Fixed Allowance cannot be less than zero. Check and enter valid salary details.'
      );
      return;
    }

    let postData = { ...values };
    postData.payroll = payrollid;
    postData.earnings = postData.earnings.filter((item) => item.component_name !== 'Fixed Allowance');

    postData.earnings.push({
      component_name: 'Fixed Allowance',
      calculation_type: 'Fixed',
      monthly: fixedAllowance / 12,
      annually: fixedAllowance,
      calculation: 0
    });

    const url = `/payroll/calculate-payroll`;
    const { res, error } = await Factory('post', url, postData);
    if (values.errorMessage) {
      return;
    }
    if (res?.status_cd === 0) {
      // Store Fixed Allowance data from response
      const fixedAllowanceData = res.data.earnings.find((item) => item.component_name === 'Fixed Allowance');
      if (fixedAllowanceData) {
        setFixedAllowance({
          monthly: parseFloat(fixedAllowanceData.monthly),
          annually: parseFloat(fixedAllowanceData.annually)
        });
      }

      // Filter out Fixed Allowance from the response before setting values
      const filteredData = {
        ...res.data,
        earnings: res.data.earnings.filter((item) => item.component_name !== 'Fixed Allowance')
      };
      setValues(filteredData);
      setViewPreview(true);
    }
  };

  const fetch_individual_salary_templates = async (id) => {
    if (!id) return;

    const url = `/payroll/salary-templates/${id}`;
    const { res, error } = await Factory('get', url, {});

    if (res?.status_cd === 0) {
      setValues(res?.data);
    } else {
    }
  };

  const fetch_salary_template_data = async (id) => {
    if (!id) return;
    const url = `/payroll/salary-benefits-details/${id}`;
    const { res, error } = await Factory('get', url, {});

    if (res?.status_cd === 0) {
      setValues((prev) => {
        const benefits = [];
        const deductions = [];

        if (res.data.epf_details.is_disabled === false) {
          if (res.data.epf_details.include_employer_contribution_in_ctc === true) {
            benefits.push({
              component_name: 'EPF',
              calculation_type: res.data.epf_details.employer_contribution_rate,
              monthly: 0,
              annually: 0
            });
          }
          if (res.data.epf_details.employer_edil_contribution_in_ctc === true) {
            benefits.push({
              component_name: 'EDIL',
              calculation_type: '0.5% of Restricted wage',
              monthly: 0,
              annually: 0
            });
          }
          if (res.data.epf_details.admin_charge_in_ctc === true) {
            benefits.push({
              component_name: 'EPF admin charges	',
              calculation_type: '0.5% of Restricted wage',
              monthly: 0,
              annually: 0
            });
          }
          if (res.data.esi_details.is_disabled === false && res.data.esi_details.include_employer_contribution_in_ctc === true) {
            benefits.push({
              component_name: 'ESI',
              calculation_type: '3.25 % of Restricted wage',
              monthly: 0,
              annually: 0
            });
          }
          /// deductions
          if (res.data.epf_details.is_disabled === false) {
            deductions.push({
              component_name: 'EPF Employee Contribution',
              calculation_type: res.data.epf_details.employee_contribution_rate,
              monthly: 0,
              annually: 0
            });
          }
          if (res.data.esi_details.is_disabled === false) {
            deductions.push({
              component_name: 'ESI Employee contribution',
              calculation_type: '0.75 % of Restricted wage',
              monthly: 0,
              annually: 0
            });
          }
        }
        return { ...prev, benefits, deductions };
      });
    }
  };

  useEffect(() => {
    recalculate();
  }, [values.annual_ctc]);
  useEffect(() => {
    if (template_id) {
      fetch_individual_salary_templates(template_id);
    } else {
      fetch_salary_template_data(payrollid);
    }
  }, [template_id, payrollid]);
  useEffect(() => {
    if (payrollid) {
      getEarnings_Details(payrollid);
    }
  }, [payrollid]);

  const recalculate = () => {
    const annualCtc = parseFloat(values.annual_ctc);
    let updatedEarnings = [...values.earnings];

    updatedEarnings = updatedEarnings.map((earning) => {
      if (earning.component_name === 'Basic') {
        if (earning.calculation_type === 'Flat Amount') {
          const monthlyAmount = parseFloat(earning.calculation) || 0;
          return {
            ...earning,
            monthly: monthlyAmount,
            annually: monthlyAmount * 12
          };
        } else if (!isNaN(annualCtc) && annualCtc > 0) {
          const basicPercentage = parseFloat(earning.calculation) || 0;
          const annualAmount = (annualCtc * basicPercentage) / 100;
          return {
            ...earning,
            monthly: annualAmount / 12,
            annually: annualAmount
          };
        }
      }

      const calculatedValues = calculateEarnings(
        earning,
        annualCtc,
        parseFloat(updatedEarnings.find((e) => e.component_name === 'Basic')?.annually || 0)
      );
      return {
        ...earning,
        monthly: calculatedValues.monthly,
        annually: calculatedValues.annually
      };
    });

    setFieldValue('earnings', updatedEarnings);
    setEnablePreviewButton(true);
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
      <Table sx={{ fontSize: '0.875rem' }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell>
              <Typography>Salary Components</Typography>{' '}
            </TableCell>
            <TableCell>
              <Typography>Calculation Type</Typography>{' '}
            </TableCell>
            <TableCell>
              <Typography>Monthly</Typography>{' '}
            </TableCell>
            <TableCell>
              <Typography>Annually</Typography>{' '}
            </TableCell>
            <TableCell>
              <Typography>Action</Typography>{' '}
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
            .filter((earning) => earning.component_name !== 'Fixed Allowance')
            .map((earning, index) => (
              <TableRow key={index}>
                <TableCell>
                  {earning.component_name === 'Basic' ? (
                    <Typography>Basic</Typography>
                  ) : (
                    <CustomAutocomplete
                      options={earningsData
                        .map((item) => item.component_name)
                        .filter(
                          (name) =>
                            name !== 'Fixed Allowance' && // Exclude "Fixed Allowance"
                            !values.earnings.some((earning) => earning.component_name === name) // Remove already selected
                        )}
                      value={earning?.component_name || ''}
                      renderInput={(params) => <TextField {...params} placeholder="Select an option" />}
                      onChange={(e, newValue) => {
                        const selectedEarning = earningsData.find((item) => item.component_name === newValue) || {};
                        handleEarningsChange(selectedEarning, index, 'component_name', newValue);
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CustomInput
                      value={earning.calculation}
                      fullWidth
                      sx={{
                        maxWidth: 120,
                        textAlign: 'center',
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0
                        },
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield'
                        }
                      }}
                      type="text" // Switch to text to handle full control and avoid scientific notation like 'e'
                      inputProps={{
                        inputMode: 'decimal', // Use numeric keyboard on mobile
                        pattern: '[0-9]*[.,]?[0-9]*', // Allow decimals
                        step: '0.01',
                        min: '0'
                      }}
                      onChange={(e) => {
                        let inputValue = e.target.value;

                        // Prevent invalid characters (like 'e', '-', etc.)
                        if (!/^\d*\.?\d*$/.test(inputValue)) return;

                        // Normalize input: remove leading zeros
                        if (inputValue.includes('.')) {
                          const [whole, decimal] = inputValue.split('.');
                          const cleaned = (whole.replace(/^0+/, '') || '0') + '.' + decimal;
                          inputValue = cleaned;
                        } else {
                          inputValue = inputValue.replace(/^0+/, '') || '0';
                        }

                        // Update Formik field so UI reflects the cleaned value
                        setFieldValue(`earnings[${index}].calculation`, inputValue);

                        // Proceed with numeric logic only if valid number
                        const parsedValue = parseFloat(inputValue);
                        if (!isNaN(parsedValue)) {
                          handleEarningsChange(earning, index, 'calculation', parsedValue);
                        }

                        setEnablePreviewButton(true);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          recalculate();
                        }
                      }}
                      onBlur={() => {
                        recalculate();
                      }}
                    />

                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {earning.component_name === 'HRA'
                        ? earning.calculation_type
                        : earning.component_name === 'Fixed Allowance'
                          ? 'Remaining Balance'
                          : earning.component_name === 'Conveyance Allowance'
                            ? earning.calculation
                            : earning.calculation_type}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{earning.monthly.toFixed(2)}</TableCell>
                <TableCell>{earning.annually.toFixed(2)}</TableCell>
                <TableCell>
                  {index !== 0 && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={
                        <IconTrash
                          size={16}
                          onClick={() => {
                            handleDeleteItem(index);
                          }}
                        />
                      }
                    ></Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

          <TableRow>
            <TableCell>
              <Button variant="outlined" onClick={handleAddEarnings}>
                Add Component
              </Button>
            </TableCell>
            <TableCell colSpan={4}>
              {values.errorMessage && (
                <Typography color="error" variant="body2" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                  {values.errorMessage}
                </Typography>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography variant="h5"> Fixed Allowance (Monthly CTC - Sum of all other components) </Typography>
            </TableCell>
            <TableCell>
              <Typography>Remaining Balance</Typography>
            </TableCell>
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
            <TableCell></TableCell>
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
                {values.earnings.reduce((sum, earning) => sum + parseFloat(earning.monthly || 0), 0).toFixed(2)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h5">
                {values.earnings.reduce((sum, earning) => sum + parseFloat(earning.annually || 0), 0).toFixed(2)}
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
                <TableRow key={index}>
                  <TableCell>{item.component_name}</TableCell>
                  <TableCell>{item.calculation_type}</TableCell>
                  <TableCell>{Number(item?.monthly || 0).toFixed(2)}</TableCell>
                  <TableCell>{Number(item?.annually || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button size="small" color="error" startIcon={<IconTrash size={16} />}></Button>
                  </TableCell>
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
                <TableRow key={index}>
                  <TableCell>{item.component_name}</TableCell>
                  <TableCell>{item.calculation_type}</TableCell>
                  <TableCell>{Number(item?.monthly || 0).toFixed(2)}</TableCell>
                  <TableCell>{Number(item?.annually || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button size="small" color="error" startIcon={<IconTrash size={16} />}></Button>
                  </TableCell>
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

// Helper functions
function generateBenefitsArray(data) {
  const benefits = [];
  if (!data.epf_details.is_disabled) {
    if (data.epf_details.include_employer_contribution_in_ctc) {
      benefits.push({
        component_name: 'EPF',
        calculation_type: data.epf_details.employer_contribution_rate,
        monthly: 0,
        annually: 0
      });
    }
    // ... Add other benefits similarly
  }
  return benefits;
}

function generateDeductionsArray(data) {
  const deductions = [];
  if (!data.epf_details.is_disabled) {
    deductions.push({
      component_name: 'EPF Employee Contribution',
      calculation_type: data.epf_details.employee_contribution_rate,
      monthly: 0,
      annually: 0
    });
    // ... Add other deductions similarly
  }
  return deductions;
}
