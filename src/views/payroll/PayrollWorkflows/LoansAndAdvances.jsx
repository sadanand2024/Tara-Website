import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';

export default function LoansAndAdvances({
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
    'Type',
    'Amount',
    'EMI',
    'End Month',
    'Pending Balance',
    'Current Deduction'
  ];
  const body_keys = [
    'associate_id',
    'employee_name',
    'department',
    'designation',
    'loan_type',
    'amount',
    'emi_amount',
    'end_month',
    'pending_balance',
    'current_month_deduction'
  ];
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEdit = async (item) => {
    let url = `/payroll/advance-loans/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      // showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      setSelectedRecord(res.data);
      setOpenDialog(true);
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/advance-loans/${item.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      // showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      // showSnackbar('Record Deleted Successfully', 'success');
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
        setData={() => {}}
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={fetchData}
      />
    </>
  );
}
