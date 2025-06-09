import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';

export default function Tds({ employeeMasterData, from, openDialog, fields, setOpenDialog }) {
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

  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [month, setMonth] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  useEffect(() => {
    const month = searchParams.get('month');
    if (month) {
      setMonth(month);
    }
  }, [searchParams]);
  useEffect(() => {
    const financialYear = searchParams.get('financial_year');
    if (financialYear) {
      setFinancialYear(financialYear);
    }
  }, [searchParams]);

  const getData = async () => {
    setLoading(true);
    const url = `/payroll/employee-tds?payroll_id=${payrollid}&month=${month}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setData(res.data || []);
    } else {
      // showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
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

  useEffect(() => {
    if (payrollid) {
      getData();
    }
  }, [payrollid]);
  return (
    <>
      <RenderTable
        headerData={headerData}
        tableData={data}
        handleEdit={handleEdit}
        // handleDelete={handleDelete}
        body_keys={body_keys}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        from={from}
        loading={loading}
        setLoading={setLoading}
      />
      <RenderDialog
        from={from}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        fields={fields}
        selectedRecord={selectedRecord}
        setData={setData}
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={getData}
      />
    </>
  );
}
