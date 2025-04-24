import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from '@/utils/Factory';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/components/CustomSnackbar';
import RenderDialog from './RenderDialog';

export default function LoansAndAdvances({ employeeMasterData, from, openDialog, fields, setOpenDialog }) {
  const headerData = [
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
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showSnackbar } = useSnackbar();

  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const getData = async () => {
    setLoading(true);
    const url = `/payroll/payroll-advance-summary?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setData(res.data || []);
    } else {
      showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
  const handleEdit = async (item) => {
    let url = `/payroll/advance-loans/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      setSelectedRecord(res.data);
      setOpenDialog(true);
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/advance-loans/${item.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      showSnackbar('Record Deleted Successfully', 'success');
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
