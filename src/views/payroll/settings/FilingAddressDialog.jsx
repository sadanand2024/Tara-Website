import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography, Card, CardContent, Grid2, Box } from '@mui/material';
import CustomAutocomplete from 'utils/CustomAutocomplete'; // Assuming CustomAutocomplete is a valid component
import Modal from 'ui-component/extended/Modal';
import { useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
export default function FilingAddressDialog({ filingAddressDialog, setFilingAddressDialog, getOrgDetails }) {
  const user = useSelector((state) => state).accountReducer.user;

  let businessId = user.active_context.business_id;
  const [selctedLocation, setSelctedLocation] = useState({});
  const [workLocations, setWorkLocations] = useState([]); // Stores the list of work locations
  const [loading, setLoading] = useState(false); // State for loader
  const dispatch = useDispatch();
  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL
  const [searchParams] = useSearchParams();

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
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const saveFilingAddress = async () => {
    if (!selctedLocation.location_name) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select a filing address before submitting.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
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
    console.log(res);
    if (res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Data Saved Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );

      setFilingAddressDialog(false);
      getOrgDetails(payrollid);
    } else {
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
    if (payrollid !== null) fetchWorkLocations();
  }, [payrollid]);
  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Modal
          open={filingAddressDialog}
          showClose={true}
          handleClose={() => {
            setFilingAddressDialog(false);
          }}
          maxWidth="sm"
          header={{ title: 'Update Filing Address', subheader: '' }}
        >
          <Box p={2}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Select Filing Address <span style={{ color: 'red' }}>*</span>
                </Typography>
                <CustomAutocomplete
                  value={selctedLocation}
                  name="filingAddress"
                  onChange={(e, newValue) => setSelctedLocation(newValue || {})}
                  options={workLocations}
                  getOptionLabel={(option) => option?.location_name || ''}
                  sx={{ width: '100%' }}
                />
              </Grid2>

              {/* Card Preview BELOW dropdown */}
              <Grid2 size={{ xs: 12 }}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper'
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
                          py: 0.5,
                          fontWeight: 500,
                          borderBottom: index !== 5 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <strong>{item.label}:</strong> {item.value || '-'}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid2>

              {/* Note Section */}
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Note: <span style={{ fontWeight: 400 }}>Your filing address can only be one of your work locations</span>
                </Typography>
              </Grid2>

              {/* Button Stack */}
              <Grid2 size={{ xs: 12 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button onClick={() => setFilingAddressDialog(false)} variant="outlined" color="error">
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
              </Grid2>
            </Grid2>
          </Box>
        </Modal>
      )}
    </>
  );
}
