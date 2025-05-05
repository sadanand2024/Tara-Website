import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialEPF = [
  {
    state: 'Maharashtra',
    branch: 'Mumbai',
    establishment_code: 'MH1234',
    login_id: 'epfadmin',
    epf_password: '',
    epf_number: 'EPF1234567',
    emp_cont_rate: '12%',
    employer_cont_rate: '12%',
    ctc_inclusion: true,
    allow_override: false,
    prorate_pf_wage: false
  }
];

const validationSchema = Yup.object({
  state: Yup.string().required('State is required'),
  branch: Yup.string().required('Branch is required'),
  establishment_code: Yup.string().required('Establishment Code is required'),
  login_id: Yup.string().required('Login ID is required'),
  epf_password: Yup.string().required('Password is required'),
  epf_number: Yup.string().required('EPF Number is required'),
  emp_cont_rate: Yup.string().required('Employee Cont. Rate is required'),
  employer_cont_rate: Yup.string().required('Employer Cont. Rate is required'),
  ctc_inclusion: Yup.boolean(),
  allow_override: Yup.boolean(),
  prorate_pf_wage: Yup.boolean()
});

const initialESI = [
  {
    state: 'Maharashtra',
    branch: 'Mumbai',
    establishment_code: 'MH5678',
    login_id: 'esiadmin',
    esi_password: '',
    esi_number: 'ESI9876543',
    emp_cont: '1.75%',
    employer_cont: '4.75%',
    ctc_inclusion: true
  }
];

const initialPT = [
  {
    ptin: 'PTIN1234',
    state: 'Maharashtra',
    location: 'Mumbai',
    pt_slabs: [
      { start: 0, end: 10000, amount: 0 },
      { start: 10001, end: 20000, amount: 200 }
    ]
  }
];

const esiValidationSchema = Yup.object({
  state: Yup.string().required('State is required'),
  branch: Yup.string().required('Branch is required'),
  establishment_code: Yup.string().required('Establishment Code is required'),
  login_id: Yup.string().required('Login ID is required'),
  esi_password: Yup.string().required('Password is required'),
  esi_number: Yup.string().required('ESI Number is required'),
  emp_cont: Yup.string().required('Employee Cont. is required'),
  employer_cont: Yup.string().required('Employer Cont. is required'),
  ctc_inclusion: Yup.boolean()
});

const ptValidationSchema = Yup.object({
  ptin: Yup.string().required('PTIN is required'),
  login_id: Yup.string().required('Login ID is required'),
  pt_password: Yup.string().required('Password is required'),
  state: Yup.string().required('State is required'),
  location: Yup.string().required('Location is required'),
  pt_slabs: Yup.array().of(
    Yup.object({
      start: Yup.number().required('Start range is required'),
      end: Yup.number().required('End range is required'),
      amount: Yup.number().required('Monthly tax amount is required')
    })
  )
});

const PayrollCompliance = () => {
  const [tab, setTab] = useState(0);
  const [epfList, setEpfList] = useState(initialEPF);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [esiList, setEsiList] = useState(initialESI);
  const [esiOpen, setEsiOpen] = useState(false);
  const [esiEditIndex, setEsiEditIndex] = useState(null);
  const [ptList, setPtList] = useState(initialPT);
  const [ptOpen, setPtOpen] = useState(false);
  const [ptEditIndex, setPtEditIndex] = useState(null);

  const handleTabChange = (_, newValue) => setTab(newValue);

  // EPF Dialog logic
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
    setEditIndex(null);
  };
  const handleEdit = (index) => {
    setEditIndex(index);
    formik.setValues({ ...epfList[index] });
    setOpen(true);
  };
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this EPF entry?')) {
      setEpfList(epfList.filter((_, i) => i !== index));
    }
  };
  const formik = useFormik({
    initialValues: {
      state: '',
      branch: '',
      establishment_code: '',
      login_id: '',
      epf_password: '',
      epf_number: '',
      emp_cont_rate: '',
      employer_cont_rate: '',
      ctc_inclusion: false,
      allow_override: false,
      prorate_pf_wage: false
    },
    validationSchema,
    onSubmit: (values) => {
      if (editIndex !== null) {
        const updated = [...epfList];
        updated[editIndex] = values;
        setEpfList(updated);
      } else {
        setEpfList([...epfList, values]);
      }
      handleClose();
    }
  });

  // ESI Dialog logic
  const handleEsiOpen = () => setEsiOpen(true);
  const handleEsiClose = () => {
    esiFormik.resetForm();
    setEsiOpen(false);
    setEsiEditIndex(null);
  };
  const handleEsiEdit = (index) => {
    setEsiEditIndex(index);
    esiFormik.setValues({ ...esiList[index] });
    setEsiOpen(true);
  };
  const handleEsiDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this ESI entry?')) {
      setEsiList(esiList.filter((_, i) => i !== index));
    }
  };
  const esiFormik = useFormik({
    initialValues: {
      state: '',
      branch: '',
      establishment_code: '',
      login_id: '',
      esi_password: '',
      esi_number: '',
      emp_cont: '',
      employer_cont: '',
      ctc_inclusion: false
    },
    validationSchema: esiValidationSchema,
    onSubmit: (values) => {
      if (esiEditIndex !== null) {
        const updated = [...esiList];
        updated[esiEditIndex] = values;
        setEsiList(updated);
      } else {
        setEsiList([...esiList, values]);
      }
      handleEsiClose();
    }
  });

  // PT Dialog logic
  const handlePtOpen = () => setPtOpen(true);
  const handlePtClose = () => {
    ptFormik.resetForm();
    setPtOpen(false);
    setPtEditIndex(null);
  };
  const handlePtEdit = (index) => {
    setPtEditIndex(index);
    ptFormik.setValues({ ...ptList[index] });
    setPtOpen(true);
  };
  const handlePtDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this PT entry?')) {
      setPtList(ptList.filter((_, i) => i !== index));
    }
  };
  const ptFormik = useFormik({
    initialValues: {
      ptin: '',
      login_id: '',
      pt_password: '',
      state: '',
      location: '',
      pt_slabs: []
    },
    validationSchema: ptValidationSchema,
    onSubmit: (values) => {
      if (ptEditIndex !== null) {
        const updated = [...ptList];
        updated[ptEditIndex] = values;
        setPtList(updated);
      } else {
        setPtList([...ptList, values]);
      }
      handlePtClose();
    }
  });

  // Add Slab logic for PT
  const handleAddSlab = () => {
    ptFormik.setFieldValue('pt_slabs', [...ptFormik.values.pt_slabs, { start: '', end: '', amount: '' }]);
  };
  const handleSlabChange = (idx, field, value) => {
    const slabs = ptFormik.values.pt_slabs.map((slab, i) => (i === idx ? { ...slab, [field]: value } : slab));
    ptFormik.setFieldValue('pt_slabs', slabs);
  };

  return (
    <>
      <Typography variant="h4" color="text.primary" gutterBottom sx={{ mb: 2 }}>
        Payroll Compliance
      </Typography>
      <Card elevation={2} sx={{ p: 0 }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="EPF" />
          <Tab label="ESI" />
          <Tab label="Professional Tax" />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" color="text.primary">
                Employee's Provident Fund
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
                Add EPF
              </Button>
            </Box>
            <Card
              elevation={2}
              sx={{
                mb: 2,
                '& .MuiTableContainer-root': { borderRadius: 0 },
                '& .MuiTableCell-root': { color: 'text.primary' },
                '& .MuiTableHead-root .MuiTableCell-root': { py: 1, backgroundColor: 'primary.dark', color: '#fff' }
              }}
            >
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>State</TableCell>
                      <TableCell>Branch</TableCell>
                      <TableCell>EPF Number</TableCell>
                      <TableCell>Employee Cont. Rate</TableCell>
                      <TableCell>Employer Cont. Rate</TableCell>
                      <TableCell>CTC Inclusion</TableCell>
                      <TableCell>Allow Employee Override</TableCell>
                      <TableCell>Pro-rate restricted PF wage</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {epfList.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{row.state}</TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>{row.epf_number}</TableCell>
                        <TableCell>{row.emp_cont_rate}</TableCell>
                        <TableCell>{row.employer_cont_rate}</TableCell>
                        <TableCell>{row.ctc_inclusion ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{row.allow_override ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{row.prorate_pf_wage ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View/Edit">
                              <IconButton size="small" color="primary" onClick={() => handleEdit(idx)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <IconButton size="small" color="error" onClick={() => handleDelete(idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {epfList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                          No EPF records added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Add/Edit EPF Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ color: 'text.primary' }}>
                {editIndex !== null ? 'Edit EPF' : 'Add EPF'}
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <form autoComplete="off" onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                  {/* Credentials Group */}
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                      Credentials
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="establishment_code"
                          name="establishment_code"
                          label="Establishment Code"
                          value={formik.values.establishment_code}
                          onChange={formik.handleChange}
                          error={formik.touched.establishment_code && Boolean(formik.errors.establishment_code)}
                          helperText={formik.touched.establishment_code && formik.errors.establishment_code}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="login_id"
                          name="login_id"
                          label="Login ID"
                          value={formik.values.login_id}
                          onChange={formik.handleChange}
                          error={formik.touched.login_id && Boolean(formik.errors.login_id)}
                          helperText={formik.touched.login_id && formik.errors.login_id}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="epf_password"
                          name="epf_password"
                          label="Password"
                          type="password"
                          value={formik.values.epf_password}
                          onChange={formik.handleChange}
                          error={formik.touched.epf_password && Boolean(formik.errors.epf_password)}
                          helperText={formik.touched.epf_password && formik.errors.epf_password}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="epf_number"
                          name="epf_number"
                          label="EPF Number"
                          value={formik.values.epf_number}
                          onChange={formik.handleChange}
                          error={formik.touched.epf_number && Boolean(formik.errors.epf_number)}
                          helperText={formik.touched.epf_number && formik.errors.epf_number}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {/* Payroll Configurations Group */}
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                      Payroll Configurations
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="emp_cont_rate"
                          name="emp_cont_rate"
                          label="Employee Cont. Rate"
                          value={formik.values.emp_cont_rate}
                          onChange={formik.handleChange}
                          error={formik.touched.emp_cont_rate && Boolean(formik.errors.emp_cont_rate)}
                          helperText={formik.touched.emp_cont_rate && formik.errors.emp_cont_rate}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="employer_cont_rate"
                          name="employer_cont_rate"
                          label="Employer Cont. Rate"
                          value={formik.values.employer_cont_rate}
                          onChange={formik.handleChange}
                          error={formik.touched.employer_cont_rate && Boolean(formik.errors.employer_cont_rate)}
                          helperText={formik.touched.employer_cont_rate && formik.errors.employer_cont_rate}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.ctc_inclusion}
                              onChange={(e) => formik.setFieldValue('ctc_inclusion', e.target.checked)}
                              name="ctc_inclusion"
                            />
                          }
                          label="CTC Inclusion"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.allow_override}
                              onChange={(e) => formik.setFieldValue('allow_override', e.target.checked)}
                              name="allow_override"
                            />
                          }
                          label="Allow employee override"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.prorate_pf_wage}
                              onChange={(e) => formik.setFieldValue('prorate_pf_wage', e.target.checked)}
                              name="prorate_pf_wage"
                            />
                          }
                          label="Pro-rate restricted PF wage"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} size="small" sx={{ color: 'text.primary' }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" size="small" color="primary">
                    Save
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" color="text.primary">
                Employee State Insurance
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleEsiOpen}>
                Add ESI
              </Button>
            </Box>
            <Card
              elevation={2}
              sx={{
                mb: 2,
                '& .MuiTableContainer-root': { borderRadius: 0 },
                '& .MuiTableCell-root': { color: 'text.primary' },
                '& .MuiTableHead-root .MuiTableCell-root': { py: 1, backgroundColor: 'primary.dark', color: '#fff' }
              }}
            >
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>State</TableCell>
                      <TableCell>Branch</TableCell>
                      <TableCell>ESI Number</TableCell>
                      <TableCell>Employee Cont.</TableCell>
                      <TableCell>Employer Cont.</TableCell>
                      <TableCell>CTC Inclusion</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {esiList.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{row.state}</TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>{row.esi_number}</TableCell>
                        <TableCell>{row.emp_cont}</TableCell>
                        <TableCell>{row.employer_cont}</TableCell>
                        <TableCell>{row.ctc_inclusion ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View/Edit">
                              <IconButton size="small" color="primary" onClick={() => handleEsiEdit(idx)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <IconButton size="small" color="error" onClick={() => handleEsiDelete(idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {esiList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          No ESI records added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            {/* Add/Edit ESI Dialog */}
            <Dialog open={esiOpen} onClose={handleEsiClose} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ color: 'text.primary' }}>
                {esiEditIndex !== null ? 'Edit ESI' : 'Add ESI'}
                <IconButton aria-label="close" onClick={handleEsiClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <form autoComplete="off" onSubmit={esiFormik.handleSubmit}>
                <DialogContent dividers>
                  {/* Credentials Group */}
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                      Credentials
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="establishment_code"
                          name="establishment_code"
                          label="Establishment Code"
                          value={esiFormik.values.establishment_code}
                          onChange={esiFormik.handleChange}
                          error={esiFormik.touched.establishment_code && Boolean(esiFormik.errors.establishment_code)}
                          helperText={esiFormik.touched.establishment_code && esiFormik.errors.establishment_code}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="login_id"
                          name="login_id"
                          label="Login ID"
                          value={esiFormik.values.login_id}
                          onChange={esiFormik.handleChange}
                          error={esiFormik.touched.login_id && Boolean(esiFormik.errors.login_id)}
                          helperText={esiFormik.touched.login_id && esiFormik.errors.login_id}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="esi_password"
                          name="esi_password"
                          label="Password"
                          type="password"
                          value={esiFormik.values.esi_password}
                          onChange={esiFormik.handleChange}
                          error={esiFormik.touched.esi_password && Boolean(esiFormik.errors.esi_password)}
                          helperText={esiFormik.touched.esi_password && esiFormik.errors.esi_password}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="esi_number"
                          name="esi_number"
                          label="ESI Number"
                          value={esiFormik.values.esi_number}
                          onChange={esiFormik.handleChange}
                          error={esiFormik.touched.esi_number && Boolean(esiFormik.errors.esi_number)}
                          helperText={esiFormik.touched.esi_number && esiFormik.errors.esi_number}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {/* Payroll Configurations Group */}
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                      Payroll Configurations
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="emp_cont"
                          name="emp_cont"
                          label="Employee Cont."
                          value={esiFormik.values.emp_cont}
                          onChange={esiFormik.handleChange}
                          error={esiFormik.touched.emp_cont && Boolean(esiFormik.errors.emp_cont)}
                          helperText={esiFormik.touched.emp_cont && esiFormik.errors.emp_cont}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="employer_cont"
                          name="employer_cont"
                          label="Employer Cont."
                          value={esiFormik.values.employer_cont}
                          onChange={esiFormik.handleChange}
                          error={esiFormik.touched.employer_cont && Boolean(esiFormik.errors.employer_cont)}
                          helperText={esiFormik.touched.employer_cont && esiFormik.errors.employer_cont}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={esiFormik.values.ctc_inclusion}
                              onChange={(e) => esiFormik.setFieldValue('ctc_inclusion', e.target.checked)}
                              name="ctc_inclusion"
                            />
                          }
                          label="CTC Inclusion"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleEsiClose} size="small" sx={{ color: 'text.primary' }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" size="small" color="primary">
                    Save
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        )}
        {tab === 2 && (
          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" color="text.primary">
                Professional Tax
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handlePtOpen}>
                Add PT
              </Button>
            </Box>
            <Card
              elevation={2}
              sx={{
                mb: 2,
                '& .MuiTableContainer-root': { borderRadius: 0 },
                '& .MuiTableCell-root': { color: 'text.primary' },
                '& .MuiTableHead-root .MuiTableCell-root': { py: 1, backgroundColor: 'primary.dark', color: '#fff' }
              }}
            >
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>PT Number</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>PT Slabs</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ptList.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{row.ptin}</TableCell>
                        <TableCell>{row.state}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>
                          {row.pt_slabs && row.pt_slabs.length > 0
                            ? row.pt_slabs.map((slab, i) => `${slab.start}-${slab.end}: ₹${slab.amount}`).join(', ')
                            : '—'}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View/Edit">
                              <IconButton size="small" color="primary" onClick={() => handlePtEdit(idx)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <IconButton size="small" color="error" onClick={() => handlePtDelete(idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {ptList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No PT records added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            {/* Add/Edit PT Dialog */}
            <Dialog open={ptOpen} onClose={handlePtClose} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ color: 'text.primary' }}>
                {ptEditIndex !== null ? 'Edit Professional Tax' : 'Add Professional Tax'}
                <IconButton aria-label="close" onClick={handlePtClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <form autoComplete="off" onSubmit={ptFormik.handleSubmit}>
                <DialogContent dividers>
                  {/* Credentials Group */}
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                      Credentials
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="ptin"
                          name="ptin"
                          label="PTIN"
                          value={ptFormik.values.ptin}
                          onChange={ptFormik.handleChange}
                          error={ptFormik.touched.ptin && Boolean(ptFormik.errors.ptin)}
                          helperText={ptFormik.touched.ptin && ptFormik.errors.ptin}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="login_id"
                          name="login_id"
                          label="Login ID"
                          value={ptFormik.values.login_id}
                          onChange={ptFormik.handleChange}
                          error={ptFormik.touched.login_id && Boolean(ptFormik.errors.login_id)}
                          helperText={ptFormik.touched.login_id && ptFormik.errors.login_id}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="pt_password"
                          name="pt_password"
                          label="Password"
                          type="password"
                          value={ptFormik.values.pt_password}
                          onChange={ptFormik.handleChange}
                          error={ptFormik.touched.pt_password && Boolean(ptFormik.errors.pt_password)}
                          helperText={ptFormik.touched.pt_password && ptFormik.errors.pt_password}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="state"
                          name="state"
                          label="State"
                          value={ptFormik.values.state}
                          onChange={ptFormik.handleChange}
                          error={ptFormik.touched.state && Boolean(ptFormik.errors.state)}
                          helperText={ptFormik.touched.state && ptFormik.errors.state}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {/* Configuration Group */}
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                      Configuration
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          id="location"
                          name="location"
                          label="Location"
                          value={ptFormik.values.location}
                          onChange={ptFormik.handleChange}
                          error={ptFormik.touched.location && Boolean(ptFormik.errors.location)}
                          helperText={ptFormik.touched.location && ptFormik.errors.location}
                        />
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Tax Slabs
                      </Typography>
                      {ptFormik.values.pt_slabs &&
                        ptFormik.values.pt_slabs.map((slab, idx) => (
                          <Grid container spacing={1} key={idx} sx={{ mb: 1 }}>
                            <Grid item xs={4}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Start Range"
                                value={slab.start}
                                onChange={(e) => handleSlabChange(idx, 'start', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                fullWidth
                                size="small"
                                label="End Range"
                                value={slab.end}
                                onChange={(e) => handleSlabChange(idx, 'end', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Monthly Tax Amount"
                                value={slab.amount}
                                onChange={(e) => handleSlabChange(idx, 'amount', e.target.value)}
                              />
                            </Grid>
                          </Grid>
                        ))}
                      <Button variant="outlined" size="small" onClick={handleAddSlab} sx={{ mt: 1 }}>
                        Add Slab
                      </Button>
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePtClose} size="small" sx={{ color: 'text.primary' }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" size="small" color="primary">
                    Save
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        )}
      </Card>
    </>
  );
};

export default PayrollCompliance;
