import React, { useState, useEffect } from 'react';
import RenderTable from './RenderTable';
import {} from '@mui/material';
import Factory from '@/utils/Factory';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/components/CustomSnackbar';
import RenderDialog from './RenderDialog';
import { months } from '@/utils/MonthsList';

export default function Attendance({ employeeMasterData, from, openDialog, fields, setOpenDialog, attendanceData, fetchAttendanceData }) {
  const headerData = [
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
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [month, setMonth] = useState(null);

  const { showSnackbar } = useSnackbar();

  const searchParams = useSearchParams();

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
  const getData = async () => {
    setLoading(true);
    const url = `/payroll/employee_attendance_filtered?payroll_id=${payrollid}&financial_year=2024-2025&month=${month}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setData(res.data || []);
    } else {
      showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
  const handleEdit = async (item) => {
    let url = `/payroll/employee-attendance/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
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
    let url = `/payroll/employee-exit/${item.id}`;
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
  }, [
    payrollid
    // fetchAttendanceData
  ]);

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
