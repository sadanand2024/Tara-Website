import React from 'react';
import { Box, Typography, TextField, Button, Grid2 } from '@mui/material';
import IconSave from '@mui/icons-material/Save';

const StepTwo = ({ formik, setStep }) => {
  return (
    <form autoComplete="off">
      {/* Task 2: Business Registration Documents */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          Business Registration Documents
        </Typography>
        <Grid2 container spacing={2} alignItems="center">
          {/* 1. Incorporation certificate / Partnership deed */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>Incorporation certificate / Partnership deed</Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label=""
              name="incorporationCertificate"
              value={formik.values.incorporationCertificate ? formik.values.incorporationCertificate.name : ''}
              placeholder="Upload"
              InputProps={{ readOnly: true }}
              onClick={() => document.getElementById('incorporationCertificateInput').click()}
            />
            <input
              id="incorporationCertificateInput"
              type="file"
              hidden
              name="incorporationCertificate"
              onChange={(e) => formik.setFieldValue('incorporationCertificate', e.currentTarget.files[0])}
            />
          </Grid2>
          {/* 2. Letter of Authorisation / Board resolution */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>Letter of Authorisation / Board resolution</Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label=""
              name="authorisationLetter"
              value={formik.values.authorisationLetter ? formik.values.authorisationLetter.name : ''}
              placeholder="Upload"
              InputProps={{ readOnly: true }}
              onClick={() => document.getElementById('authorisationLetterInput').click()}
            />
            <input
              id="authorisationLetterInput"
              type="file"
              hidden
              name="authorisationLetter"
              onChange={(e) => formik.setFieldValue('authorisationLetter', e.currentTarget.files[0])}
            />
          </Grid2>
          {/* 3. Local language name board photo of business */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>Local language name board photo of business</Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label=""
              name="nameBoardPhoto"
              value={formik.values.nameBoardPhoto ? formik.values.nameBoardPhoto.name : ''}
              placeholder="Upload"
              InputProps={{ readOnly: true }}
              onClick={() => document.getElementById('nameBoardPhotoInput').click()}
            />
            <input
              id="nameBoardPhotoInput"
              type="file"
              hidden
              name="nameBoardPhoto"
              onChange={(e) => formik.setFieldValue('nameBoardPhoto', e.currentTarget.files[0])}
            />
          </Grid2>
          {/* 4. Memorandum of Articles (MOA) */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>
              Memorandum of Articles (MOA) <span style={{ fontSize: 12, color: '#888' }}>(in case of companies)</span>
            </Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label=""
              name="moa"
              value={formik.values.moa ? formik.values.moa.name : ''}
              placeholder="Upload"
              InputProps={{ readOnly: true }}
              onClick={() => document.getElementById('moaInput').click()}
            />
            <input id="moaInput" type="file" hidden name="moa" onChange={(e) => formik.setFieldValue('moa', e.currentTarget.files[0])} />
          </Grid2>
        </Grid2>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button size="medium" variant="contained" startIcon={<IconSave />} color="primary" onClick={() => setStep(2)}>
          Save & Continue
        </Button>
      </Box>
    </form>
  );
};

export default StepTwo;
