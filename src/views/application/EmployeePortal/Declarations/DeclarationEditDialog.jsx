import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { Formik, Form } from 'formik';

const DeclarationEditDialog = ({ open, onClose, category, getFormFields, getValidationSchema, onSubmit }) => {
  if (!category) return null;

  const initialValues = (() => {
    const fields = getFormFields(category.id);
    const initial = {};
    fields.forEach((f) => {
      if (f.name === 'declaredAmount') {
        initial[f.name] = category.declaredAmount ?? '';
      } else {
        initial[f.name] = '';
      }
    });
    return initial;
  })();

  const calculateTotal = (values) => {
    const fields = getFormFields(category.id);
    return fields.reduce((total, field) => {
      const value = parseFloat(values[field.name]) || 0;
      return total + value;
    }, 0);
  };

  const getMaxLimit = () => {
    if (category.id === 'sec80c') return 150000;
    if (category.id === 'otherDeductions') return null; // No overall limit for other deductions
    return category.maxLimit;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{category.title}</DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(category.id)}
          onSubmit={async (values, helpers) => {
            try {
              await onSubmit(values, category);
              helpers.setSubmitting(false);
              onClose();
            } catch (e) {
              helpers.setSubmitting(false);
            }
          }}
        >
          {(formik) => {
            const { values, setValues, touched, errors, handleSubmit, setFieldValue, handleBlur, resetForm } = formik;
            const totalDeclared = calculateTotal(values);
            const maxLimit = getMaxLimit();

            return (
              <Form>
                {/* Total Declared and Max Limit Display */}
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Total declared in ₹
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color={maxLimit && totalDeclared > maxLimit ? 'error.main' : 'text.primary'}>
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 2
                      }).format(totalDeclared)}
                    </Typography>
                  </Box>
                  {maxLimit && (
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Max Limit in ₹
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 2
                        }).format(maxLimit)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Form Fields */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                  {getFormFields(category.id).map((field) => (
                    <FormControl key={field.name} fullWidth>
                      {field.type === 'select' ? (
                        <>
                          <InputLabel size="small">{field.label}</InputLabel>
                          <Select
                            name={field.name}
                            value={values[field.name] || ''}
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                            onBlur={handleBlur}
                            error={Boolean(touched[field.name] && errors[field.name])}
                            size="small"
                            label={field.label}
                          >
                            {field.options?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched[field.name] && errors[field.name] && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                              {errors[field.name]}
                            </Typography>
                          )}
                        </>
                      ) : field.hasAgeField ? (
                        <Box display="flex" gap={1} alignItems="flex-start">
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <InputLabel>Age</InputLabel>
                            <Select
                              name={field.ageFieldName}
                              value={values[field.ageFieldName] || '< 60'}
                              onChange={(e) => setFieldValue(field.ageFieldName, e.target.value)}
                              onBlur={handleBlur}
                              size="small"
                              label="Age"
                            >
                              <MenuItem value="< 60">&lt; 60</MenuItem>
                              <MenuItem value=">= 60">&gt;= 60</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            name={field.name}
                            type={field.type}
                            label={field.label}
                            value={values[field.name] || ''}
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                            onBlur={handleBlur}
                            error={Boolean(touched[field.name] && errors[field.name])}
                            helperText={
                              touched[field.name] && errors[field.name]
                                ? errors[field.name]
                                : field.maxLimit
                                  ? `Max limit: ₹${new Intl.NumberFormat('en-IN').format(field.maxLimit)}`
                                  : 'Enter Amount'
                            }
                            size="small"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>
                            }}
                            placeholder="Enter Amount"
                            sx={{ flex: 1 }}
                          />
                        </Box>
                      ) : (
                        <TextField
                          name={field.name}
                          type={field.type}
                          label={field.label}
                          value={values[field.name] || ''}
                          onChange={(e) => setFieldValue(field.name, e.target.value)}
                          onBlur={handleBlur}
                          error={Boolean(touched[field.name] && errors[field.name])}
                          helperText={
                            touched[field.name] && errors[field.name]
                              ? errors[field.name]
                              : field.maxLimit
                                ? `Max limit: ₹${new Intl.NumberFormat('en-IN').format(field.maxLimit)}`
                                : field.helperText || 'Enter Amount'
                          }
                          size="small"
                          InputProps={{
                            startAdornment: field.type === 'number' ? <InputAdornment position="start">₹</InputAdornment> : undefined
                          }}
                          placeholder={field.type === 'number' ? 'Enter Amount' : field.placeholder || ''}
                        />
                      )}
                    </FormControl>
                  ))}
                </Box>
                <DialogActions sx={{ mt: 2 }}>
                  <Button onClick={onClose} variant="outlined" size="small">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Clear all form values using resetForm
                      resetForm();
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Clear Form
                  </Button>
                  <Button type="submit" variant="contained" disabled={formik.isSubmitting} size="small">
                    Update
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default DeclarationEditDialog;
