import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from '@/utils/Factory';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/components/CustomSnackbar';
import RenderDialog from './RenderDialog';

export default function SalaryRevisions({ employeeMasterData, from, openDialog, fields, setOpenDialog }) {
  const headerData = ['Employee Name', 'Department', 'Designation', 'Current CTC', 'Last Revision', 'Revised CTC'];
  const body_keys = ['employee_name', 'department', 'designation', 'current_ctc', 'created_on', 'revised_ctc'];
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [month, setMonth] = useState(null);
  const [financialYear, setFinancialYear] = useState(null);
  const { showSnackbar } = useSnackbar();

  const searchParams = useSearchParams();
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
      setPayrollId(id);
    }
  }, [searchParams]);

  const getData = async () => {
    setLoading(true);
    const year = financialYear.split('-')[1];
    console.log(year);
    const url = `/payroll/employee-salaries?payroll_id=${payrollid}&month=${month}&year=${year}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setData(res.data || []);
    } else {
      showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
  const handleEdit = async (item) => {
    let url = `/payroll/bonus-incentives/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      setSelectedRecord(res.data);
      setOpenDialog(true);
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/bonus-incentives/${item.id}`;
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
        from={from}
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
