import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RenderDialog from './RenderDialog';
import { months } from 'utils/MonthsList';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
export default function Attendance({ attendanceData, fetchAttendance, employeeMasterData, from, openDialog, fields, setOpenDialog }) {
  const headerData = [
    'Employee ID',
    'Employee Name',
    'LOP',
    // 'Absent',
    'Paid Leaves',
    'Week Offs',
    'Holidays',
    // 'OT',
    'Total Days',
    'Present Days',
    'Payable Days'
  ];

  const body_keys = [
    'id',
    'employee_name',
    'loss_of_pay',
    'earned_leaves',
    'week_offs',
    'holidays',
    'total_days_of_month',
    'present_days',
    'payable_days'
  ];
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [month, setMonth] = useState(null);
  const dispatch = useDispatch();
  const [financialYear, setFinancialYear] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  useEffect(() => {
    let monthNumber = searchParams.get('month');
    if (monthNumber) {
      setMonth(monthNumber);
    }
  }, [searchParams]);
  useEffect(() => {
    const financialYear = searchParams.get('financial_year');
    if (financialYear) setFinancialYear(financialYear);
  }, [searchParams]);

  useEffect(() => {
    if (payrollid && financialYear && month) {
      fetchAttendance(); // Use parent-controlled fetch function
    }
  }, [payrollid, financialYear, month]);

  const handleEdit = async (item) => {
    let url = `/payroll/employee-attendance/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } else {
      // Replace the month number with the month name
      if (res.data.month) {
        const monthNumber = parseInt(res.data.month, 10);
        if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
          res.data.month = months[monthNumber - 1];
        }
      }

      setSelectedRecord(res.data);
      setOpenDialog(true);
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/employee-attendance/${item.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data),
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
      fetchAttendance();
    }
  };

  return (
    <>
      <RenderTable
        headerData={headerData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        body_keys={body_keys}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        tableData={attendanceData}
      />
      <RenderDialog
        from={from}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        fields={fields}
        selectedRecord={selectedRecord}
        setLoading={setLoading}
        employeeMasterData={employeeMasterData}
        getData={fetchAttendance}
      />
    </>
  );
}
