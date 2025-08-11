import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';

export default function Exits({
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
    'Designations',
    'Exit Date',
    'Total Days',
    'Paid Days',
    'Settlement Date',
    'Actual CTC',
    'F & F'
  ];
  const body_keys = [
    'associate_id',
    'employee_name',
    'department',
    'designation',
    'exit_date',
    'total_days',
    'paid_days',
    'settlement_sdate',
    'annual_ctc',
    'final_settlement_amount'
  ];
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEdit = async (item) => {
    let url = `/payroll/employee-exit/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      // showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      setSelectedRecord(res.data);
      setOpenDialog(true);
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/employee-exit/${item.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
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
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={fetchData}
      />
    </>
  );
}
