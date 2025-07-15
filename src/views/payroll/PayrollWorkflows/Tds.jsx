import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';

export default function Tds({
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
    'Pan',
    'Regime',
    'Annual Est Income',
    // 'Annual Tax Libility',
    'TDS Month',
    'TDS YTD'
  ];

  const body_keys = [
    'associate_id',
    'employee_name',
    'pan',
    'regime',
    'annual_tds',
    // 'annual_tax_libility',
    'tds',
    'tds_ytd'
  ];

  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [month, setMonth] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);
  const handleEdit = async (item) => {
    let url = `/payroll/employee-tds/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      // showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      setSelectedRecord(res.data);
      setOpenDialog(true);
    }
  };

  return (
    <>
      <RenderTable
        headerData={headerData}
        tableData={filteredData}
        handleEdit={handleEdit}
        // handleDelete={handleDelete}
        body_keys={body_keys}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        from={from}
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
        setData={() => {}}
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={fetchData}
      />
    </>
  );
}
