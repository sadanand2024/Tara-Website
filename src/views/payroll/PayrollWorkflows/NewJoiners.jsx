import React, { useState, useEffect } from 'react';
import Factory from '@/utils/Factory';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSnackbar } from '@/components/CustomSnackbar';

import RenderTable from './RenderTable';
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
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newJoinersData, setNewJoinersData] = useState([]);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const handleEdit = async (item) => {
    router.push(`/payrollsetup/add-employee?employee_id=${encodeURIComponent(item.id)}&payrollid=${encodeURIComponent(payrollid)}`);
  };

  const fetch_newJoiners_Data = async () => {
    setLoading(true);
    const url = `/payroll/new-employees?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);

    if (res.status_cd === 0) {
      setNewJoinersData(res.data || []);
    } else {
      setNewJoinersData([]);

      showSnackbar(JSON.stringify(res.data.data), 'error');
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
