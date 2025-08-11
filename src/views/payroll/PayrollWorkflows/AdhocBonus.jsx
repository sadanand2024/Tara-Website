import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export default function AdhocBonus({
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
  const headerData = ['Employee ID', 'Employee Name', 'Department', 'Designation', 'Bonus Type', 'Amount'];

  const body_keys = ['associate_id', 'employee_name', 'department', 'designation', 'bonus_type', 'amount'];

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
    let url = `/payroll/adhoc-bonus/${item.id}`;
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
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={fetchData}
      />
    </>
  );
}
