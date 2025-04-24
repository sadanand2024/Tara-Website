'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import {
  Button,
  Box,
  TextField,
  Typography,
  Grid2,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination
} from '@mui/material';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import { useRouter } from 'next/navigation';
import CustomAutocomplete from '@/utils/CustomAutocomplete';
import { indian_States_And_UTs } from '@/utils/indian_States_And_UT';
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/PageLoader';
import { useSnackbar } from '@/components/CustomSnackbar';
import Factory from '@/utils/Factory';
import ActionCell from '@/utils/ActionCell';
import ViewSlabsModel from './ViewSlabs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const details = [
  { name: 'work_location_name', label: 'Work Location' },
  { name: 'state', label: 'State' },
  { name: 'pt_number', label: 'PT Number' }
];

// Yup Validation Schema
const validationSchema = Yup.object({
  work_location_name: Yup.string().required('Work Location is required'),
  state: Yup.string().required('State is required'),
  pt_number: Yup.string().required('PT Number is required'),
  slab: Yup.array()
    .of(
      Yup.object({
        min_salary: Yup.number().required('Start range is required').min(0, 'Start range must be greater than or equal to 0'),
        max_salary: Yup.number()
          .required('End range is required')
          .min(Yup.ref('min_salary'), 'End range must be greater than or equal to start range'),
        pt_amount: Yup.number().required('Monthly tax amount is required').min(0, 'Monthly tax amount must be greater than or equal to 0')
      })
    )
    .min(1, 'At least one tax slab is required')
});

function ProfessionalTax({ handleBack, handleNext }) {
  const [open, setOpen] = useState(false);
  const [viewSlabsDialog, setViewSlabsDialog] = useState(false);
  const [ptData, setPtData] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState('');
  const [workLocations, setWorkLocations] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const paginatedData = ptData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  const formik = useFormik({
    initialValues: {
      work_location_name: '',
      state: '',
      pt_number: '',
      slab: [{ min_salary: '', max_salary: '', pt_amount: '' }]
    },

    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const selectedLocation = workLocations.find((item) => item.location_name === values.work_location_name);

      if (selectedLocation) {
        values.work_location = selectedLocation.id;
      }
      const postData = { ...values };
      postData.payroll = Number(payrollid);
      const url = postType === 'post' ? `/payroll/pt` : `/payroll/pt/${values.id}`;
      const { res, error } = await Factory(postType, url, postData);
      setLoading(false);
      if (res.status_cd === 0) {
        showSnackbar(postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully', 'success');
        handleClose();
        get_pt_Details(payrollid);
      } else {
        showSnackbar(JSON.stringify(res.data.data), 'error');
      }
    }
  });

  const get_pt_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/pt?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);

    if (res.status_cd === 0) {
      setPtData(res.data);
    } else {
    }
  };
  const fetchWorkLocations = async (id) => {
    if (!payrollid) return;

    const url = `/payroll/work-locations/?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});

    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setWorkLocations(res?.data); // Successfully set work locations
    } else {
      setWorkLocations([]);
      showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
    }
  };
  // Effect to trigger API call when either businessId or payrollid is set
  useEffect(() => {
    if (payrollid) {
      get_pt_Details(payrollid);
      fetchWorkLocations(payrollid);
    }
  }, [payrollid]);

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

  const handleEdit = (item) => {
    setPostType('put');
    setSelectedRecord(item);
    handleOpen();
  };
  const handleDelete = async (item) => {
    let url = `/payroll/pt/${item.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      showSnackbar('Record Deleted Successfully', 'success');
      get_pt_Details(payrollid);
    }
  };
  useEffect(() => {
    if (postType === 'put' && selectedRecord) {
      setValues(selectedRecord);
    }
  }, [postType, selectedRecord]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Grid2 container spacing={{ xs: 2, sm: 3 }}>
          <Grid2 size={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>S No</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Work Location</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>PT Number</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>State</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>PT Slabs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ height: 300 }}>
                        <EmptyTable msg="No Professional tax yet" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{item.work_location_name}</TableCell>
                        <TableCell>{item.pt_number}</TableCell>
                        <TableCell>{item.state}</TableCell>
                        <TableCell
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}
                          onClick={() => {
                            setSelectedRecord(item);
                            setViewSlabsDialog(true);
                          }}
                        >
                          View / Edit
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {ptData.length > 0 && (
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', px: { xs: 0.5, sm: 2.5 }, py: 1.5 }}>
                <Pagination count={Math.ceil(ptData.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
              </Stack>
            )}
          </Grid2>

          {viewSlabsDialog === true && (
            <ViewSlabsModel
              viewSlabsDialog={viewSlabsDialog}
              setViewSlabsDialog={setViewSlabsDialog}
              selectedRecord={selectedRecord}
              setSelectedRecord={setSelectedRecord}
              get_pt_Details={get_pt_Details}
              payrollid={payrollid}
            />
          )}
          <Grid2 size={12} textAlign="center" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  router.back();
                }}
              >
                Back to Dashboard
              </Button>
              <Button size="small" variant="contained" onClick={handleBack} sx={{ mr: 2 }}>
                Back
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      )}
    </>
  );
}

export default ProfessionalTax;
