import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import CustomInput from '@/utils/CustomInput';
import Factory from '@/utils/Factory';
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import CustomAutocomplete from '@/utils/CustomAutocomplete';
export default function FilterDialog({
  financialYear,
  setFinancialYear,
  workLocations,
  selectedWorkLoacation,
  setFilterDialog,
  setSelectedWorkLoacation,
  fetch_by_filter
}) {
  return (
    <Modal
      open={open}
      maxWidth={ModalSize.MD}
      header={{ title: 'Choose any Filter', subheader: '' }}
      modalContent={
        <Box sx={{ padding: 2 }}>
          <Grid2 container spacing={3}>
            <Box>
              <Typography sx={{ mb: 1 }}>Select Financial Year</Typography>
              <CustomAutocomplete
                options={['2021-22', '2022-23', '2023-24', '2024-25', '2025-26']}
                value={financialYear}
                onChange={(e, val) => setFinancialYear(val)}
                sx={{ minWidth: 200, maxWidth: 200 }}
              />
            </Box>
            <Box>
              <Typography sx={{ mb: 1 }}>Select Location</Typography>
              <CustomAutocomplete
                value={selectedWorkLoacation} // Find the full object based on location_name
                onChange={(e, newvalue) => {
                  setSelectedWorkLoacation(newvalue.location_name);
                }}
                options={workLocations || []}
                getOptionLabel={(option) => option?.location_name || ''} // Safely access location_name
                sx={{ minWidth: 200, maxWidth: 200 }}
                size="small"
              />
            </Box>
          </Grid2>
        </Box>
      }
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              setFilterDialog(false);
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {
              fetch_by_filter();
            }}
          >
            Search
          </Button>
        </Stack>
      }
    />
  );
}
