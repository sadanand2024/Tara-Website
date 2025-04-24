import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import Factory from 'utils/Factory';
import { useState, useEffect } from 'react';
import CustomAutocomplete from 'utils/CustomAutocomplete';
// import { useSelector } from 'store';

// @project
// import OverviewCard from './OverviewCard';
import PayrollStatusSummary from './PayrollStatusSummary';
import PayrollComplianceSummary from './PayrollComplianceSummary';

import PayrollMonthwise from './PayrollMonthwise';
import { Button, Stack, Typography, Grid2, TextField } from '@mui/material';
import { IconSparkles, IconSettings2 } from '@tabler/icons-react';
// import HomeCard from '@/components/cards/HomeCard';
// import Loader from '@/components/PageLoader';
// import useCurrentUser from '@/hooks/useCurrentUser';
import { generateFinancialYears } from 'utils/FinancialYearsList';
import MainCard from '../../ui-component/cards/MainCard';
/***************************  ANALYTICS - OVERVIEW  ***************************/

const PayrollDashboard = () => {
  // const { userData } = useCurrentUser();
  const navigate = useNavigate();
  const user = useSelector((state) => state).accountReducer.user;

  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({});
  const [financialYear, setFinancialYear] = useState(null);

  const financialYearOptions = generateFinancialYears();

  const getData = async (id) => {
    setLoading(true);
    const url = `/payroll/payroll-setup-status?business_id=${id}`;
    const { res, error } = await Factory('get', url, {});

    if (res?.status_cd === 0) {
      if (res.data.payroll_setup === false) {
        // router.push(`/payrollsetup`);
        navigate('/app/payroll/settings');

        setLoading(false);
      } else {
        setBusinessDetails(res?.data);
        // console.log('res.data', res.data);
        setLoading(false);
      }
    } else {
      setBusinessDetails({});
      setLoading(false);
      showSnackbar(JSON.stringify(res?.data?.error || 'Unknown error'), 'error');
    }
  };

  const get_business_details = async () => {
    setLoading(true);
    const userId = userData.dashboardChange ? userData.businesssDetails.id : userData.id;
    const url = `/user_management/businesses-by-client/?user_id=${userId}`;
    const { res, error } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      getData(res.data.id);
    } else {
      showSnackbar(JSON.stringify(res?.data?.data?.error || 'Unknown error'), 'error');
    }
    setLoading(false);
  };
  // useEffect(() => {
  //   if (userData.business_exists === false) {
  //     router.push('/payrollsetup/payroll_business_profileSetup');
  //   } else {
  //     get_business_details();
  //   }
  // }, [userData.id]);
  useEffect(() => {
    if (user?.business_exists === false) {
      navigate('/payrollsetup/payroll_business_profileSetup');
    } else {
      getData(user.id);
    }
  }, [user]);

  useEffect(() => {
    const getCurrentFinancialYear = () => {
      const today = new Date();
      const month = today.getMonth() + 1; // 1-based month
      const year = today.getFullYear();

      const fyStart = month >= 4 ? year : year - 1; // April is the cutoff
      const fyEnd = fyStart + 1; // last 2 digits of next year

      // % 100
      return `${fyStart}-${String(fyEnd).padStart(2, '0')}`;
    };
    setFinancialYear(getCurrentFinancialYear());
  }, []);

  return loading ? (
    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
      Loading Payroll Dashboard...
    </Typography>
  ) : (
    <MainCard
      title={`Payroll for ${businessDetails?.nameOfBusiness}`}
      secondary={
        <Stack direction="row" sx={{ gap: 2 }}>
          <CustomAutocomplete
            options={financialYearOptions}
            value={financialYear}
            onChange={(e, val) => {
              setFinancialYear(val);
            }}
            sx={{ minWidth: 200, maxWidth: 200 }}
            renderInput={(params) => <TextField {...params} placeholder="Select Financial Year" />}
          />

          <Button
            variant="contained"
            onClick={() => {
              navigate(`/payrollsetup/add-employee?payrollid=${businessDetails?.payroll_id}`);
            }}
            startIcon={<IconSparkles size={16} />}
          >
            Add Employee
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/payrollsetup`)} startIcon={<IconSettings2 size={18} />}>
            Payroll Settings
          </Button>
        </Stack>
      }
    >
      <Grid2 container spacing={{ xs: 2, md: 3 }}>
        <Grid2 size={{ xs: 12 }}>
          <PayrollMonthwise payrollId={businessDetails?.payroll_id} financialYear={financialYear} />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Payroll Status Summary
          </Typography>
          <PayrollStatusSummary payrollId={businessDetails?.payroll_id} financialYear={financialYear} />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Payroll Compliance Summary
          </Typography>
          <PayrollComplianceSummary payrollId={businessDetails?.payroll_id} financialYear={financialYear} />
        </Grid2>
        {/* <Grid2 size={{ xs: 12 }}>
          <OverviewCard payrollId={businessDetails?.payroll_id} financialYear={financialYear} />
        </Grid2> */}
      </Grid2>
    </MainCard>
  );
};
export default PayrollDashboard;
