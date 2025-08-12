import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
export default function SalaryRevisions({
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
  const dispatch = useDispatch();
  const headerData = ['Employee ID', 'Employee Name', 'Department', 'Designation', 'Previous CTC', 'Last Revision', 'Revised CTC'];
  const body_keys = ['associate_id', 'employee_name', 'department', 'designation', 'previous_ctc', 'revision_date', 'current_ctc'];
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [month, setMonth] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);

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

  const handleEdit = async (item) => {
    let url = `/payroll/bonus-incentives/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.message),
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
          message: JSON.stringify(res?.data?.message),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } else {
      if (fetchData) fetchData();
    }
  };
  return (
    <>
      <RenderTable
        from={from}
        headerData={headerData}
        tableData={filteredData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        body_keys={body_keys}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        loading={loading}
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
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={fetchData}
      />
    </>
  );
}
