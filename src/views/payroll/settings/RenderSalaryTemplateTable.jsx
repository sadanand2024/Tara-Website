import React, { useState, useEffect } from 'react';
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
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import Factory from 'utils/Factory';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';

export default function RenderSalaryTemplateTable({ values, setFieldValue, setValues, enablePreviewButton, setEnablePreviewButton }) {
  const [earningsData, setEarningsData] = useState([]);
  const [fixedAllowance, setFixedAllowance] = useState({ monthly: 0, annually: 0 });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [template_id, setTemplate_id] = useState(null);
  const [viewPreview, setViewPreview] = useState(false);
  const [onBlurrRecalculate, setOnBlurrRecalculate] = useState(false);
  // const { showSnackbar } = useSnackbar();

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
  const get_individual_componnet_data = async (id) => {
    setLoading(true);
    const url = `/payroll/earnings/${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      return res.data;
    }
  };
  const handleEarningsChange = async (selectedEarning, index, field, componentName) => {
    let updatedEarnings = [...values.earnings];
    updatedEarnings[index][field] = componentName;

    if (!selectedEarning || !selectedEarning.id) return;

    const selectedItemData = await get_individual_componnet_data(selectedEarning.id);
    updatedEarnings[index] = {
      ...updatedEarnings[index],
      calculation: selectedItemData.calculation_type.value,
      component_name: selectedItemData.component_name,
      calculation_type: selectedItemData.calculation_type.type
    };

    // Get the updated CTC value
    const annualCtc = parseFloat(values.annual_ctc);

    // We calculate the basic salary based on the earnings array, where Basic Salary is always a part of it
    const basicSalary = parseFloat(updatedEarnings.find((earning) => earning.component_name === 'Basic')?.annually || 0);

    const calculatedValues = calculateEarnings(updatedEarnings[index], annualCtc, basicSalary);

    updatedEarnings[index].monthly = calculatedValues.monthly;
    updatedEarnings[index].annually = calculatedValues.annually;

    setFieldValue('earnings', updatedEarnings);
    setEnablePreviewButton(true);
  };

  const calculateEarnings = (earning, annualCtc, basicSalary) => {
    let monthlyAmount = 0;
    let annualAmount = 0;

    if (isNaN(annualCtc) || annualCtc === '') {
      return {
        monthly: 0,
        annually: 0
      };
    }

    // Get the basic salary from earnings array
    const basicEarning = values.earnings.find((e) => e.component_name === 'Basic');
    const actualBasicSalary = basicEarning ? parseFloat(basicEarning.annually) : 0;

    switch (earning.component_name) {
      case 'Basic':
        const basicPercentage = parseFloat(earning.calculation);
        annualAmount = (annualCtc * basicPercentage) / 100;
        monthlyAmount = annualAmount / 12;
        break;

      case 'HRA':
        if (earning.calculation_type === 'Percentage of Basic') {
          const hraPercentage = parseFloat(earning.calculation);
          // Calculate HRA based on actual basic salary
          annualAmount = (actualBasicSalary * hraPercentage) / 100;
          monthlyAmount = annualAmount / 12;
        } else if (earning.calculation_type === 'Flat Amount') {
          monthlyAmount = parseFloat(earning.calculation);
          annualAmount = monthlyAmount * 12;
        }
        break;

      case 'Fixed Allowance':
        // Ensure Fixed Allowance is recalculated as a residual component
        const earningsTotal = values.earnings.reduce((sum, earning) => sum + parseFloat(earning.annually || 0), 0);
        annualAmount = annualCtc - earningsTotal; // Subtract total of all earnings from CTC
        monthlyAmount = annualAmount / 12;
        break;
      case 'Conveyance Allowance':
        monthlyAmount = parseFloat(earning.calculation);
        annualAmount = monthlyAmount * 12;
        break;
      default:
        if (earning.calculation_type === 'Percentage of Basic') {
          const percentage = parseFloat(earning.calculation);
          annualAmount = (basicSalary * percentage) / 100;
          monthlyAmount = annualAmount / 12;
        } else if (earning.calculation_type === 'Flat Amount') {
          monthlyAmount = parseFloat(earning.calculation);
          annualAmount = monthlyAmount * 12;
        }
        break;
    }

    return {
      monthly: Math.round(monthlyAmount * 100) / 100, // Round to 2 decimal places
      annually: Math.round(annualAmount * 100) / 100 // Round to 2 decimal places
    };
  };
  const recalculate = () => {
    const annualCtc = parseFloat(values.annual_ctc);
    const basicSalary = parseFloat(values.earnings.find((earning) => earning.component_name === 'Basic')?.monthly || 0);

    const updatedEarnings = values.earnings.map((earning) => {
      const calculatedValues = calculateEarnings(earning, annualCtc, basicSalary);
      return {
        ...earning,
        monthly: calculatedValues.monthly,
        annually: calculatedValues.annually
      };
    });
    setFieldValue('earnings', updatedEarnings);
    setEnablePreviewButton(true);
  };

  const handleDeleteItem = (key, index) => {
    if (key === 'earnings') {
      const newEarnings = values.earnings.filter((_, i) => i !== index);
      setFieldValue('earnings', newEarnings);
      setEnablePreviewButton(true);
    }
  };
  const getEarnings_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/earnings?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setEarningsData(res.data);

      const basicComponent = res.data.find((item) => item.component_name === 'Basic');

      const selectedItem = await get_individual_componnet_data(basicComponent.id);
      setValues((prev) => {
        return {
          ...prev,
          earnings: prev.earnings.map((earning, index) =>
            index === 0
              ? {
                  ...earning,
                  component_name: selectedItem.component_name,
                  calculation_type: selectedItem.calculation_type.type,
                  calculation: selectedItem?.calculation_type?.value
                }
              : earning
          )
        };
      });
    }
  };
  const calculateFixedAllowance = () => {
    const totalEarnings = values.earnings.reduce((sum, earning) => {
      if (earning.component_name !== 'Fixed Allowance') {
        return sum + parseFloat(earning.annually || 0);
      }
      return sum;
    }, 0);

    const annualCtc = parseFloat(values.annual_ctc || 0);
    const annualFixedAllowance = annualCtc - totalEarnings;
    const monthlyFixedAllowance = annualFixedAllowance / 12;

    setFixedAllowance({
      monthly: Math.round(monthlyFixedAllowance * 100) / 100,
      annually: Math.round(annualFixedAllowance)
    });
  };

  const fetch_preview = async () => {
    let postData = { ...values };
    postData.payroll = payrollid;
    postData.earnings = postData.earnings.filter((item) => item.component_name !== 'Fixed Allowance');

    postData.earnings.push({
      component_name: 'Fixed Allowance',
      calculation_type: 'Fixed',
      monthly: 0,
      annually: 0,
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
  useEffect(() => {
    calculateFixedAllowance();
  }, [values.earnings, values.annual_ctc]);
  const handleAddEarnings = () => {
    setFieldValue('earnings', [
      ...values.earnings,
      { component_name: '', calculation: 0, monthly: 0, annually: 0 } // Default values
    ]);
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
                    {/* {(earning.component_name === 'HRA' || earning.component_name === 'Basic') && ( */}
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

                    {/* )} */}
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {earning.component_name === 'Basic'
                        ? '% of CTC'
                        : earning.component_name === 'HRA'
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
                            handleDeleteItem('earnings', index);
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
              <Typography>{fixedAllowance.monthly.toFixed(2)}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{fixedAllowance.annually.toFixed(2)}</Typography>
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
