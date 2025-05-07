import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export default function BonusAndIncentives({ employeeMasterData, from, openDialog, fields, setOpenDialog }) {
  const headerData = ['Employee Name', 'Department', 'Designation', 'Type', 'Amount', 'Month', 'Financial Year'];

  const body_keys = ['employee', 'department', 'designation', 'bonus_type', 'amount', 'month', 'financial_year'];
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
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
      setPayrollId(id);
    }
  }, [searchParams]);

  const getData = async () => {
    setLoading(true);
    const year = financialYear.split('-')[1];
    const url = `/payroll/bonus-incentives/by-payroll-month?payroll_id=${payrollid}&month=${month}&year=${year}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setData(res.data || []);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.message),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
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
