import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid2,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  IconButton,
  Checkbox,
  InputAdornment,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import CustomUpload from '../../../../utils/CustomUpload';
import { CountriesList } from '../../../../utils/CountriesList';
import { __IndianStates } from '../../../../utils/indianStates';

const AddCandidateDialog = ({ openDialog, handleCloseDialog, handleSave }) => {
  // State for form data
  const [formData, setFormData] = useState({
    // Candidate Details
    emailId: '',
    firstName: '',
    phone: '',
    phoneCountryCode: '+91',
    lastName: '',
    uanNumber: '',
    officialEmail: '',
    aadharCard: '',
    panCard: '',
    photo: null,

    // Address Details - Present
    presentAddress1: '',
    presentAddress2: '',
    presentCity: '',
    presentCountry: 'India',
    presentState: '',
    presentPostalCode: '',

    // Address Details - Permanent
    permanentAddress1: '',
    permanentAddress2: '',
    permanentCity: '',
    permanentCountry: 'India',
    permanentState: '',
    permanentPostalCode: '',
    sameAsPresent: false,

    // Professional Details
    experience: '',
    location: '',
    sourceOfHire: '',
    title: 'Team Member',
    skillSet: '',
    currentSalary: '',
    highestQualification: '',
    department: '',
    additionalInformation: '',
    offerLetter: null,
    tentativeJoiningDate: ''
  });
  let candidatefields = [
    { name: 'emailId', label: 'Email ID', type: 'email' },
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'phone', label: 'Phone' },
    { name: 'phoneCountryCode', label: 'Phone Country Code' },
    { name: 'uanNumber', label: 'UAN Number' },
    { name: 'officialEmail', label: 'Official Email' },
    { name: 'aadharCard', label: 'Aadhar Card' },
    { name: 'panCard', label: 'PAN Card' },
    { name: 'photo', label: 'Photo' }
  ];
  const addressfields = [
    { name: 'presentAddress1', label: 'Present Address 1' },
    { name: 'presentAddress2', label: 'Present Address 2' },
    { name: 'presentCity', label: 'Present City' },
    { name: 'presentCountry', label: 'Present Country' },
    { name: 'presentState', label: 'Present State' },
    { name: 'presentPostalCode', label: 'Present Postal Code' }
  ];
  const permanentaddressfields = [
    { name: 'permanentAddress1', label: 'Permanent Address 1' },
    { name: 'permanentAddress2', label: 'Permanent Address 2' },
    { name: 'permanentCity', label: 'Permanent City' },
    { name: 'permanentCountry', label: 'Permanent Country' },
    { name: 'permanentState', label: 'Permanent State' },
    { name: 'permanentPostalCode', label: 'Permanent Postal Code' }
  ];
  const professionalfields = [
    { name: 'experience', label: 'Experience' },
    { name: 'location', label: 'Location' },
    { name: 'sourceOfHire', label: 'Source of Hire' },
    { name: 'title', label: 'Title' },
    { name: 'skillSet', label: 'Skill Set' }
  ];
  const educationfields = [
    { name: 'schoolName', label: 'School Name' },
    { name: 'degree', label: 'Degree/Diploma' },
    { name: 'fieldOfStudy', label: 'Field of Study' },
    { name: 'dateOfCompletion', label: 'Date of Completion' },
    { name: 'additionalNotes', label: 'Additional Notes' }
  ];
  const experiencefields = [
    { name: 'occupation', label: 'Occupation' },
    { name: 'company', label: 'Company' },
    { name: 'summary', label: 'Summary' },
    { name: 'duration', label: 'Duration' },
    { name: 'currentlyWorkHere', label: 'Currently Work Here' }
  ];
  const [educationRows, setEducationRows] = useState([
    { schoolName: '', degree: '', fieldOfStudy: '', dateOfCompletion: '', additionalNotes: '' }
  ]);
  const [experienceRows, setExperienceRows] = useState([
    { occupation: '', company: '', summary: '', duration: '', currentlyWorkHere: 'No' }
  ]);
  // State for dynamic sections

  // Handle form data changes
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });

    // If "same as present address" checkbox is checked, update permanent address
    if (formData.sameAsPresent && field.startsWith('present')) {
      const permanentField = field.replace('present', 'permanent');
      setFormData((prev) => ({ ...prev, [permanentField]: value }));
    }
  };

  // Handle checkbox for same as present address
  const handleSameAsPresent = (event) => {
    const checked = event.target.checked;
    setFormData({
      ...formData,
      sameAsPresent: checked,
      ...(checked && {
        permanentAddress1: formData.presentAddress1,
        permanentAddress2: formData.presentAddress2,
        permanentCity: formData.presentCity,
        permanentCountry: formData.presentCountry,
        permanentState: formData.presentState,
        permanentPostalCode: formData.presentPostalCode
      })
    });
  };

  // Education row handlers
  const handleAddEducationRow = () => {
    setEducationRows([...educationRows, { schoolName: '', degree: '', fieldOfStudy: '', dateOfCompletion: '', additionalNotes: '' }]);
  };

  const handleRemoveEducationRow = (index) => {
    const newRows = educationRows.filter((_, i) => i !== index);
    setEducationRows(newRows);
  };

  const handleEducationChange = (index, field, value) => {
    const newRows = [...educationRows];
    newRows[index][field] = value;
    setEducationRows(newRows);
  };

  // Experience row handlers
  const handleAddExperienceRow = () => {
    setExperienceRows([...experienceRows, { occupation: '', company: '', summary: '', duration: '', currentlyWorkHere: 'No' }]);
  };

  const handleRemoveExperienceRow = (index) => {
    const newRows = experienceRows.filter((_, i) => i !== index);
    setExperienceRows(newRows);
  };

  const handleExperienceChange = (index, field, value) => {
    const newRows = [...experienceRows];
    newRows[index][field] = value;
    setExperienceRows(newRows);
  };

  const handleSubmit = () => {
    const completeData = {
      ...formData,
      education: educationRows,
      experience: experienceRows
    };
    handleSave(completeData);
  };

  // Dropdown options
  const locationOptions = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
  const sourceOfHireOptions = ['Job Portal', 'Referral', 'LinkedIn', 'Walk-in', 'Campus', 'Consultancy'];
  const departmentOptions = ['HR', 'IT', 'Finance', 'Marketing', 'Sales', 'Operations', 'Administration'];
  const renderField = (field) => {
    return (
      <>
        <Typography variant="subtitle2" sx={{ color: 'grey.800' }}>
          {field.label}
        </Typography>
        <TextField
          key={field.name}
          field={field}
          value={formData[field.name]}
          onChange={handleInputChange(field.name)}
          fullWidth
          size="small"
        />
      </>
    );
  };
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#2c3e50', borderBottom: '2px solid #e0e0e0' }}>
        Add New Candidate
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ width: '100%' }}>
          {/* Candidate Details Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Candidate Details
              </Typography>
              <Grid2 container spacing={2}>
                {candidatefields.map((field) => (
                  <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
                    {renderField(field)}
                  </Grid2>
                ))}
              </Grid2>
            </CardContent>
          </Card>

          {/* Address Details Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Address Details
              </Typography>

              <Grid2 container spacing={3}>
                {/* Present Address - Left Column */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#424242' }}>
                      Present address
                    </Typography>
                    <Grid2 container spacing={2}>
                      {addressfields.map((field) => (
                        <Grid2 size={{ xs: 12 }} key={field.name}>
                          {renderField(field)}
                        </Grid2>
                      ))}
                    </Grid2>
                  </Box>
                </Grid2>

                {/* Permanent Address - Right Column */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#424242' }}>
                        Permanent address
                      </Typography>
                      <FormControlLabel
                        control={<Checkbox checked={formData.sameAsPresent} onChange={handleSameAsPresent} size="small" />}
                        label={<Typography variant="caption">Same as Present</Typography>}
                      />
                    </Box>
                    <Grid2 container spacing={2}>
                      {permanentaddressfields.map((field) => (
                        <Grid2 size={{ xs: 12 }} key={field.name}>
                          {renderField(field)}
                        </Grid2>
                      ))}
                    </Grid2>
                  </Box>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Professional Details Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Professional Details
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Experience"
                    value={formData.experience}
                    onChange={handleInputChange('experience')}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={locationOptions}
                    value={formData.location}
                    onChange={(e, value) => handleInputChange('location')({ target: { value } })}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={sourceOfHireOptions}
                    value={formData.sourceOfHire}
                    onChange={(e, value) => handleInputChange('sourceOfHire')({ target: { value } })}
                    renderInput={(params) => <TextField {...params} label="Source of Hire" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="Skill Set" value={formData.skillSet} onChange={handleInputChange('skillSet')} />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Title
                    </FormLabel>
                    <RadioGroup row value={formData.title} onChange={handleInputChange('title')}>
                      <FormControlLabel value="CEO" control={<Radio size="small" />} label="CEO" />
                      <FormControlLabel value="Administration" control={<Radio size="small" />} label="Administration" />
                      <FormControlLabel value="Manager" control={<Radio size="small" />} label="Manager" />
                      <FormControlLabel value="Assistant Manager" control={<Radio size="small" />} label="Assistant Manager" />
                      <FormControlLabel value="Team Member" control={<Radio size="small" />} label="Team Member" />
                    </RadioGroup>
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Highest Qualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange('highestQualification')}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Current Salary"
                    value={formData.currentSalary}
                    onChange={handleInputChange('currentSalary')}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={departmentOptions}
                    value={formData.department}
                    onChange={(e, value) => handleInputChange('department')({ target: { value } })}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Tentative Joining Date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.tentativeJoiningDate}
                    onChange={handleInputChange('tentativeJoiningDate')}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Additional Information"
                    multiline
                    rows={3}
                    value={formData.additionalInformation}
                    onChange={handleInputChange('additionalInformation')}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Offer Letter
                  </Typography>
                  <CustomUpload
                    title="Upload"
                    setData={(file) => setFormData({ ...formData, offerLetter: file })}
                    initialValue={formData.offerLetter}
                    acceptedFileTypes={['application/pdf', '.doc', '.docx']}
                    maxFileSize={5}
                  />
                  <Typography variant="caption" color="textSecondary">
                    Max. size: 5 MB
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Education
                </Typography>
                <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddEducationRow}>
                  Add Row
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>School Name</TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '150px' }}>
                        Degree/Diploma
                      </TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '150px' }}>
                        Field of Study
                      </TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '150px' }}>
                        Date of Completion
                      </TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '200px' }}>
                        Additional Notes
                      </TableCell>
                      <TableCell
                        style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, width: '60px' }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {educationRows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.schoolName}
                            onChange={(e) => handleEducationChange(index, 'schoolName', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.fieldOfStudy}
                            onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={row.dateOfCompletion}
                            onChange={(e) => handleEducationChange(index, 'dateOfCompletion', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.additionalNotes}
                            onChange={(e) => handleEducationChange(index, 'additionalNotes', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px', textAlign: 'center' }}>
                          <IconButton size="small" color="error" onClick={() => handleRemoveEducationRow(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Experience
                </Typography>
                <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddExperienceRow}>
                  Add Row
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '120px' }}>
                        Occupation
                      </TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '120px' }}>
                        Company
                      </TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '200px' }}>
                        Summary
                      </TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '100px' }}>
                        Duration
                      </TableCell>
                      <TableCell style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, minWidth: '150px' }}>
                        Currently Work Here
                      </TableCell>
                      <TableCell
                        style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, width: '60px' }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {experienceRows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.occupation}
                            onChange={(e) => handleExperienceChange(index, 'occupation', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.summary}
                            onChange={(e) => handleExperienceChange(index, 'summary', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row.duration}
                            onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ padding: '8px' }}>
                          <Select
                            fullWidth
                            size="small"
                            value={row.currentlyWorkHere}
                            onChange={(e) => handleExperienceChange(index, 'currentlyWorkHere', e.target.value)}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell style={{ padding: '8px', textAlign: 'center' }}>
                          <IconButton size="small" color="error" onClick={() => handleRemoveExperienceRow(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '2px solid #e0e0e0' }}>
        <Button onClick={handleCloseDialog} variant="outlined" size="large">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" size="large">
          Save Candidate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCandidateDialog;
