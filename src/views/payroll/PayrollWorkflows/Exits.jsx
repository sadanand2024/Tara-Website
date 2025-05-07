import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';

export default function Exits({ employeeMasterData, from, openDialog, fields, setOpenDialog }) {
  const headerData = [
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
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const getData = async () => {
    setLoading(true);
    const url = `/payroll/payroll-exit-settlement?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setData(res.data || []);
    } else {
      // showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
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
      getData();
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
        handleDelete={handleDelete}
        body_keys={body_keys}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
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
