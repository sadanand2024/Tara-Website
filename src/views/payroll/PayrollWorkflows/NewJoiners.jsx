import React, { useState, useEffect } from 'react';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import RenderTable from './RenderTable';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

function NewJoiners() {
  const headerData = ['Employee', 'Department', 'Designations', 'Joining', 'Total Days', 'Paid Days', 'Actual Gross', 'Actual CTC'];
  const body_keys = [
    'employee_name',
    'department_name',
    'designation_name',
    'doj',
    'total_days_in_month',
    'paid_days',
    'gross_salary',
    'annual_ctc'
  ];
  const [loading, setLoading] = useState(false);
  const [newJoinersData, setNewJoinersData] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const payrollid = searchParams.get('payrollid');
  const month = searchParams.get('month');
  const financialYear = searchParams.get('financial_year');

  const handleEdit = async (item) => {
    navigate(`/payroll/settings/add-employee?employee_id=${encodeURIComponent(item.id)}&payrollid=${encodeURIComponent(payrollid)}`);
  };

  const fetch_newJoiners_Data = async () => {
    setLoading(true);
    const url = `/payroll/new-employees?payroll_id=${payrollid}&month=${month}&financial_year=${financialYear}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setNewJoinersData(res.data || []);
    } else {
      setNewJoinersData([]);

      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  useEffect(() => {
    if (payrollid) {
      fetch_newJoiners_Data();
    }
  }, [payrollid]);

  return <RenderTable headerData={headerData} tableData={newJoinersData} loading={loading} body_keys={body_keys} handleEdit={handleEdit} />;
}

export default NewJoiners;
