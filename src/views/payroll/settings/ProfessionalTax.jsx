// 📁 File: ProfessionalTax.jsx (final clean Berry version)

'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Grid2
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';
import MainCard from '../../../ui-component/cards/MainCard';
import ViewSlabsModel from './ViewSlabs';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfessionalTax = ({ handleNext, handleBack }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [ptData, setPtData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [payrollid, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSlabsDialog, setViewSlabsDialog] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rowsPerPage = 8;
  const paginatedData = ptData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (_e, newPage) => setCurrentPage(newPage);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    if (payrollid) fetchPtData();
  }, [payrollid]);

  const fetchPtData = async () => {
    setLoading(true);
    const { res } = await Factory('get', `/payroll/pt?payroll_id=${payrollid}`, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setPtData(res.data);
    } else {
      setPtData([]);
      // showSnackbar('Failed to fetch PT data', 'error');
    }
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <MainCard title="Professional Tax Details">
          <Grid2 container spacing={2}>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    {['S No', 'Work Location', 'PT Number', 'State', 'PT Slabs'].map((col, idx) => (
                      <TableCell key={idx} sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ height: 300 }}>
                        no Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item, idx) => (
                      <TableRow key={item.id}>
                        <TableCell>{(currentPage - 1) * rowsPerPage + idx + 1}</TableCell>
                        <TableCell>{item.work_location_name}</TableCell>
                        <TableCell>{item.pt_number}</TableCell>
                        <TableCell>{item.state}</TableCell>
                        <TableCell
                          sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
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
            {ptData.length > rowsPerPage && (
              <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
                <Pagination count={Math.ceil(ptData.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
              </Stack>
            )}

            <Grid2 xs={12}>
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                  Back to Dashboard
                </Button>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                </Stack>
              </Box>
            </Grid2>
          </Grid2>

          {/* View Slabs Modal */}
          {viewSlabsDialog && selectedRecord && (
            <ViewSlabsModel
              viewSlabsDialog={viewSlabsDialog}
              setViewSlabsDialog={setViewSlabsDialog}
              selectedRecord={selectedRecord}
              setSelectedRecord={setSelectedRecord}
              get_pt_Details={fetchPtData}
              payrollid={payrollid}
            />
          )}
        </MainCard>
      )}
    </>
  );
};

export default ProfessionalTax;
