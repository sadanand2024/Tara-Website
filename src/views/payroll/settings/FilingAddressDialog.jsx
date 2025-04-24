import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography, Card, CardContent, Grid2 } from '@mui/material';
import CustomAutocomplete from '@/utils/CustomAutocomplete'; // Assuming CustomAutocomplete is a valid component
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import { useSearchParams } from 'next/navigation';
import Factory from '@/utils/Factory';
import Loader from '@/components/PageLoader';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useSnackbar } from '@/components/CustomSnackbar';

export default function FilingAddressDialog({ filingAddressDialog, setFilingAddressDialog, getOrgDetails }) {
  const { userData } = useCurrentUser();
  let businessId = userData.user_type === 'Business' ? userData.business_affiliated[0].id : userData.businesssDetails.business[0].id;
  const [selctedLocation, setSelctedLocation] = useState({});
  const [workLocations, setWorkLocations] = useState([]); // Stores the list of work locations
  const [loading, setLoading] = useState(false); // State for loader

  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const fetchWorkLocations = async () => {
    setLoading(true);
    const url = `/payroll/work-locations/?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setWorkLocations(res?.data); // Successfully set work locations
    } else {
      setWorkLocations([]);
      showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
    }
  };
  const saveFilingAddress = async () => {
    if (!selctedLocation.location_name) {
      showSnackbar('Please select a filing address before submitting.', 'error');
      return;
    }
    let postData = new FormData();
    postData.append('business', businessId);

    postData.append('filling_address_line1', selctedLocation.address_line1);
    postData.append('filling_address_line2', selctedLocation.address_line2);
    postData.append('filling_address_state', selctedLocation.address_state);
    postData.append('filling_address_city', selctedLocation.address_city);
    postData.append('filling_address_pincode', selctedLocation.address_pincode);

    const url = `/payroll/orgs/`;
    const { res, error } = await Factory('post', url, postData);
    setLoading(false);
    if (res.status_cd === 0) {
      showSnackbar('Data Saved Successfully', 'success');
      setFilingAddressDialog(false);
      getOrgDetails(payrollid);
    } else {
      showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
  useEffect(() => {
    if (payrollid !== null) fetchWorkLocations();
  }, [payrollid]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Modal
          open={filingAddressDialog}
          maxWidth={ModalSize.SM}
          header={{ title: 'Update Filing Address', subheader: '' }}
          modalContent={
            <>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Select Filing Address <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <CustomAutocomplete
                    value={selctedLocation}
                    name="filingAddress"
                    onChange={(e, newValue) => {
                      setSelctedLocation(newValue || {});
                    }}
                    options={workLocations}
                    getOptionLabel={(option) => option?.location_name || ''}
                    sx={{ width: '100%' }}
                  />
                </Grid2>
                <Card
                  sx={{
                    flex: 1,
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    maxWidth: 350
                  }}
                >
                  <CardContent>
                    {[
                      { label: 'Address Line 1', value: selctedLocation.address_line1 },
                      { label: 'Address Line 2', value: selctedLocation.address_line2 },
                      { label: 'Country', value: 'IN' },
                      { label: 'City', value: selctedLocation.address_city },
                      { label: 'State', value: selctedLocation.address_state },
                      { label: 'Pincode', value: selctedLocation.address_pincode }
                    ].map((item, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 0.5,
                          fontWeight: 500,
                          borderBottom: index !== 5 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <strong>{item.label}:</strong> {item.value}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>

                <Typography sx={{ mt: 1 }}>
                  <span style={{ fontWeight: 'bold' }}>Note :</span> Your filing address can only be one of your work locations
                </Typography>
              </Grid2>
              <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
                <Button
                  onClick={() => {
                    setFilingAddressDialog(false);
                  }}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    saveFilingAddress();
                  }}
                >
                  Save
                </Button>
              </Stack>
            </>
          }
        />
      )}
    </>
  );
}
