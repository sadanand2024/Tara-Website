import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export default function BonusAndIncentives({
  employeeMasterData,
  from,
  openDialog,
  fields,
  setOpenDialog,
  handleBack,
  handleNext,
  filteredData,
  fetchData
}) {
  const headerData = [
    'Employee ID',
    'Employee Name',
    'Department',
    'Designation',
    'Bonus Type',
    'Amount',
    'Committed Bonus',
    'Ytd Bonus',
    'Remaining Balance'
    // 'Month',
    // 'Financial Year'
  ];

  const body_keys = [
    'associate_id',
    'employee_name',
    'department',
    'designation',
    'bonus_type',
    'amount',
    'committed_bonus',
    'ytd',
    'remaining_balance'
    // 'month',
    // 'financial_year'
  ];
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [month, setMonth] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let monthNumber = searchParams.get('month');
    if (monthNumber) {
      setMonth(monthNumber);
    }
  }, [searchParams]);
  useEffect(() => {
    const financial_year = searchParams.get('financial_year');
    if (financial_year) {
      setFinancialYear(financial_year);
    }
  }, [searchParams]);
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      // setPayrollId(id); // This line is removed as per the edit hint
    }
  }, [searchParams]);

  // const getData = async () => { // This function is removed as per the edit hint
  //   setLoading(true);
  //   const year = financialYear;
  //   const url = `/payroll/bonus-incentives/by-payroll-month?payroll_id=${payrollid}&month=${month}&financial_year=${year}`;
  //   const { res, error } = await Factory('get', url, {});
  //   setLoading(false);
  //   if (res.status_cd === 0) {
  //     setData(res.data || []);
  //   } else {
  //     dispatch(
  //       openSnackbar({
  //         open: true,
  //         message: JSON.stringify(res.data.message),
  //         variant: 'alert',
  //         alert: { color: 'error' },
  //         close: false
  //       })
  //     );
  //   }
  // };
  const handleEdit = async (item) => {
    let url = `/payroll/bonus-incentives/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } else {
      setSelectedRecord(res.data);
      setOpenDialog(true);
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/bonus-incentives/${item.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Record Deleted Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );

      if (fetchData) fetchData();
    }
  };
  // useEffect(() => { // This useEffect is removed as per the edit hint
  //   if (payrollid) {
  //     getData();
  //   }
  // }, [payrollid]);
  return (
    <>
      <RenderTable
        headerData={headerData}
        tableData={filteredData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        body_keys={body_keys}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        loading={loading}
        from={from}
        setLoading={setLoading}
        handleBack={handleBack}
        handleNext={handleNext}
      />
      <RenderDialog
        from={from}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        fields={fields}
        selectedRecord={selectedRecord}
        setData={() => {}}
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={fetchData}
      />
    </>
  );
}
