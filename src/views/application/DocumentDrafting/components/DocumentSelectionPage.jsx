import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import CircularProgressComponent from 'utils/CircularProgressComponent';
import * as Yup from 'yup';
import EventTemplate from './EventTemplate';
import UniversalDocument from './UniversalDocument';
import Factory from '/src/utils/Factory.js';

export default function DocumentSelectionPage({ onBreadcrumbClick, onProceed, search = '' }) {
  const { contextId } = useParams();
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const baseURL = "http://dev-backend-docdraft.tarafirst.com/";

  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);
  const isLoggedIn = Boolean(user && user.id);
  const { contextEventId } = useParams();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [splitView, setSplitView] = useState(false);
  const [fields, setFields] = useState([]);
  const [draftStatus, setDraftStatus] = useState('');



  const [formValues, setFormValues] = useState({});
  const [draftDetailId, setDraftDetailId] = useState(null); // Store draft detail id after first save
  const [savingDraft, setSavingDraft] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [fileUrl, setFileUrl] = useState(null); // Store file URL for download
  const [favoriteStates, setFavoriteStates] = useState({});
  const [favouriteIdMap, setFavouriteIdMap] = useState({}); // Map documentId -> favouriteId
  // Add dialog state for table editing
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tableDialogData, setTableDialogData] = useState(null);
  const [tableDialogTableId, setTableDialogTableId] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState('');
  const downloadMenuOpen = Boolean(downloadAnchorEl);
  const { templateId } = useParams();
  const selectedTemplateId = templateId || localStorage.getItem('selectedTemplateId');
  const [templatefield, setTemplate] = useState({});
  const LS_KEYS = {
    pendingFinalize: 'pendingDraftFinalize',
    postLoginRedirect: 'postLoginRedirect'
  };

  // Add state for custom download menu
  const [customDownloadAnchorEl, setCustomDownloadAnchorEl] = useState(null);
  const customDownloadMenuOpen = Boolean(customDownloadAnchorEl);

  // Add: API call to add to favourites
  const handleToggleFavorite = async (id) => {
    // If already favorite, delete via API
    if (favoriteStates[id]) {
      const favId = favouriteIdMap[id];
      if (favId) {
        try {
          const result = await Factory('delete', `/documentdrafting/favourites/${favId}/`);
          if (result.res && result.res.status_cd === 0) {
            setFavoriteStates((prev) => ({ ...prev, [id]: false }));
            setFavouriteIdMap((prev) => {
              const newMap = { ...prev };
              delete newMap[id];
              return newMap;
            });
            dispatch(
              openSnackbar({
                open: true,
                message: 'Removed from favourites',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: result.message || 'Failed to remove from favourites',
                variant: 'alert',
                alert: { color: 'error' },
                close: false
              })
            );
          }
        } catch (err) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Failed to remove from favourites',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      }
      return;
    }
    // POST to /documentdrafting/favourites/
    try {
      const payload = { document: id, draft: contextId };
      const result = await Factory('post', '/documentdrafting/favourites/', payload);
      if (result.res && result.res.status_cd === 0) {
        setFavoriteStates((prev) => ({ ...prev, [id]: true }));
        setFavouriteIdMap((prev) => ({ ...prev, [id]: result.res.id }));
        dispatch(
          openSnackbar({
            open: true,
            message: 'Added to favourites',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: result.message || 'Failed to add to favourites',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to add to favourites',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const savePendingFinalize = (formattedFormValues) => {
    try {
      const minimal = {
        draft: contextEventId,
        draft_data: formattedFormValues,
        file_name: formattedFormValues.file_name || '',
        //  file_name: formattedFormValues.file_name || formik.values.file_name || '',
        draftDetailId: draftDetailId || null,
        ts: Date.now()
      };
      localStorage.setItem(LS_KEYS.pendingFinalize, JSON.stringify(minimal));
      localStorage.setItem(LS_KEYS.postLoginRedirect, '/document/drafting');
    } catch { }
  };

  const clearPendingFinalize = () => {
    try {
      localStorage.removeItem(LS_KEYS.pendingFinalize);
    } catch { }
  };


  // Fetch favorites on mount to make love symbol persistent
  useEffect(() => {
    if (!contextId) return;
    Factory('get', `/documentdrafting/favourites/by-draft/${contextId}/`, {}, {})
      .then((response) => {
        const data = response?.res?.data || response?.res || response;
        // Build a map of { [documentId]: true } and { [documentId]: favouriteId }
        const favMap = {};
        const favIdMap = {};
        (data || []).forEach((fav) => {
          const docId = typeof fav.document === 'object' ? fav.document.id : fav.document;
          favMap[docId] = true;
          favIdMap[docId] = fav.id;
        });
        setFavoriteStates(favMap);
        setFavouriteIdMap(favIdMap);
      })
      .catch(() => {
        setFavoriteStates({});
        setFavouriteIdMap({});
      });
  }, [contextId]);
  const formatDateToInput = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    // If already DD-MM-YYYY, return as is
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    // If DD/MM/YYYY, convert to DD-MM-YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split('-');
      return `${dd}-${mm}-${yyyy}`;
    }
    // If YYYY-MM-DD, convert to DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [yyyy, mm, dd] = dateStr.split('-');
      return `${dd}-${mm}-${yyyy}`;
    }
    return dateStr;
  };

  useEffect(() => {
    if (contextEventId) {


      Factory('get', `/documentdrafting/document-fields-and-template/${contextEventId}/`)
        .then((getResult) => {
          console.log('API Response:', getResult.res && getResult.res.data);

          if (getResult.res && getResult.res.status_cd === 0) {


            const { fields, draft_info } = getResult.res.data;
            const draft_data =
              draft_info && draft_info.length > 0
                ? draft_info[0].draft_data
                : undefined;
            const draftDetailIdFromApi =
              draft_info && draft_info.length > 0 ? draft_info[0].id : null;
            if (draft_info && draft_info.length > 0) {
              if (draft_info[0].status === 'completed') {
                setIsDownload(true);
              }
            }
            else {
              setIsDownload(false);
            }

            setDraftDetailId(draftDetailIdFromApi);
            setFields(fields || []);
            // ✅ setTemplate will schedule the update
            setTemplate((prev) => ({
              name: getResult.res.data.template.name,
              html: getResult.res.data.template.html,
              css: getResult.res.data.template.css,
            }));
            setSplitView(true);


            const formattedValues = {};
            formattedValues.file_name = draft_data?.file_name || '';
            formattedValues.status = draft_data?.status || 'draft';

            (fields || []).forEach((field) => {
              const rawValue = draft_data?.[field.field_name];
              if (field.field_type && field.field_type.trim().toLowerCase() === 'date') {
                if (Array.isArray(rawValue)) {
                  formattedValues[field.field_name] = rawValue.map(ddmmyyyyToYyyymmdd);
                } else {
                  formattedValues[field.field_name] = ddmmyyyyToYyyymmdd(rawValue);
                }
              } else {
                formattedValues[field.field_name] = rawValue ?? '';
              }
            });
            console.log('Final formattedValues:', formattedValues);



            setFormValues(formattedValues);
          }

        })

        .catch(() => {
          setFields([]);
        });
    }
    else if (contextId) {
      // No contextEventId, show document selection step
      setLoading(true);
      setError(null);

      Factory('get', `/documentdrafting/documents/?draft_id=${contextId}`)
        .then((result) => {
          if (result.res && result.res.status_cd === 0) {
            const docs = result.res.data?.results || result.res.data || [];
            setTemplates(docs);
          } else {
            setError(result.message || 'Failed to load templates');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load templates');
          setLoading(false);
        });
    } else if (selectedTemplateId) {
      setTemplateLoading(true);
      axios
        .get(`${baseURL}/documentdrafting/document-fields-template/${selectedTemplateId}/`)
        .then((result) => {
          if (result && result.status === 200) {


            // ✅ setTemplate will schedule the update
            setTemplate((prev) => ({
              ...prev,
              name: result.data.template.name,
              html: result.data.template.html,
              css: result.data.template.css,
            }));

            setFields(result.data.fields || []);
          }
          setSplitView(true);
          setTemplateLoading(false);
        })
        .catch(() => {
          setFields([]);
          setTemplate({});
          setTemplateLoading(false);
        });
    }
  }, [selectedTemplateId, contextEventId, contextId]);


  useEffect(() => {

  }, [templatefield]);


  const handleCardProceed = async (templateId) => {

    const payload = {
      context: contextId,
      document: templateId,
      status: 'yet_to_start',
      created_by: user.user.id
    };
    try {
      const result = await Factory('post', '/documentdrafting/context-wise-event-document-create/', payload);
      if (result.res && result.res.status_cd === 0 && result.res.id) {
        const contextEventId = result.res.id;
        // Navigate to split view route
        navigate(`/app/drafting/fill/${contextEventId}`);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Drafting context created',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: result.message || 'Failed to create document drafting context',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to create document drafting context',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const handleFormChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };



  // Helper to fetch latest draft details and update fileUrl
  const fetchAndSetFileUrl = async (id) => {
    try {
      const result = await Factory('get', `/documentdrafting/document-drafts-details/${id}/`);
      if (result.res && result.res.status_cd === 0 && result.res.data && (result.res.data.file_url || result.res.data.file)) {
        setFileUrl(result.res.data.file_url || result.res.data.file);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  // Utility to format date from YYYY-MM-DD to DD/MM/YYYY
  function formatDateToDDMMYYYY(dateStr) {
    if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  }

  // Save Draft handler
  const handleSaveDraft = async () => {
    // Build a validation schema that ignores is_required, only checks metadata validations
    const draftValidationShape = {};
    fields.forEach((field) => {
      // Handle table columns (arrays)
      if (field.metadata && field.metadata.type === 'table-column') {
        let validator = Yup.array().of(Yup.string());
        // If regex, apply to each element
        if (field.metadata.validations && field.metadata.validations.regex) {
          validator = Yup.array().of(
            Yup.string()
              .notRequired()
              .test('matches-regex-if-not-empty', field.metadata.validations.error_message || 'Invalid value', (value) => {
                if (!value) return true;
                return new RegExp(field.metadata.validations.regex).test(value);
              })
          );
        }
        draftValidationShape[field.field_name] = validator;
      } else {
        // Regular fields
        let validator = Yup.string();
        if (field.metadata && field.metadata.validations && field.metadata.validations.regex) {
          validator = validator
            .notRequired()
            .test('matches-regex-if-not-empty', field.metadata.validations.error_message || 'Invalid value', (value) => {
              if (!value) return true;
              return new RegExp(field.metadata.validations.regex).test(value);
            });
        }
        draftValidationShape[field.field_name] = validator;
      }
    });
    const draftValidationSchema = Yup.object().shape(draftValidationShape);
    try {
      await draftValidationSchema.validate(formik.values, { abortEarly: false });
    } catch (validationError) {
      // Only mark fields with metadata validations as touched and set errors
      const errors = {};
      const touched = {};
      validationError.inner.forEach((err) => {
        errors[err.path] = err.message;
        touched[err.path] = true;
      });
      formik.setTouched(touched);
      formik.setErrors(errors);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please fix the highlighted fields with format errors before saving draft.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return; // Do not save if not valid
    }
    if (!contextEventId) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Context event ID missing. Please try again.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }
    setSavingDraft(true);
    // Format all date fields before sending
    const formattedFormValues = { ...formik.values };
    fields.forEach((field) => {
      if (field.field_type === 'date' && formattedFormValues[field.field_name]) {
        if (Array.isArray(formattedFormValues[field.field_name])) {
          // Handle date arrays (for table columns)
          formattedFormValues[field.field_name] = formattedFormValues[field.field_name].map((dateStr) => {
            if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
              const [yyyy, mm, dd] = dateStr.split('-');
              return `${dd}/${mm}/${yyyy}`;
            }
            return dateStr;
          });
        } else {
          // Handle single date fields
          formattedFormValues[field.field_name] = formatDateToDDMMYYYY(formattedFormValues[field.field_name]);
        }
      }
    });
    const payload = {
      draft: contextEventId,
      draft_data: formattedFormValues,
      file_name: formik.values.file_name,
      status: 'draft'
    };
    try {
      if (!draftDetailId) {
        // First time: POST
        const result = await Factory('post', '/documentdrafting/document-drafts-details/', payload);
        if (result.res && result.res.status_cd === 0 && result.res.id) {
          setDraftDetailId(result.res.id);
          if (result.res.file_url || result.res.file) {
            setFileUrl(result.res.file_url || result.res.file);
          } else {
            fetchAndSetFileUrl(result.res.id);
          }
          dispatch(
            openSnackbar({
              open: true,
              message: 'Draft saved successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: result.message || 'Failed to save draft',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      } else {
        // Subsequent: PUT
        const result = await Factory('put', `/documentdrafting/document-drafts-details/${draftDetailId}/`, payload);
        if (result.res && result.res.status_cd === 0) {
          if (result.res.file_url || result.res.file) {
            setFileUrl(result.res.file_url || result.res.file);
          } else {
            fetchAndSetFileUrl(draftDetailId);
          }
          dispatch(
            openSnackbar({
              open: true,
              message: 'Draft updated successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: result.message || 'Failed to update draft',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to save draft',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setSavingDraft(false);
  };

  // Finalize handler
  const handleFinalize = async () => {
    // Build a validation schema that checks both is_required and metadata validations
    const finalizeValidationShape = {};
    fields.forEach((field) => {
      if (field.metadata && field.metadata.type === 'table-column') {
        // Get the number of rows required from the control field
        const tableGroup = tableGroups.find((g) => g.columns.some((c) => c.field_name === field.field_name));
        const noOfRows =
          tableGroup && tableGroup.control
            ? formik.values[tableGroup.control.field_name] || tableGroup.control.metadata.default_value || 1
            : 1;
        let validator = Yup.array().of(Yup.string());
        if (field.is_required) {
          validator = validator.min(noOfRows, `Please fill all ${noOfRows} rows`).of(Yup.string().required(`${field.label} is required`));
        }
        if (field.metadata.validations && field.metadata.validations.regex) {
          validator = validator.of(
            Yup.string()
              .required(`${field.label} is required`)
              .matches(new RegExp(field.metadata.validations.regex), field.metadata.validations.error_message || 'Invalid value')
          );
        }
        finalizeValidationShape[field.field_name] = validator;
      } else {
        // Regular fields
        let validator = Yup.string();
        if (field.is_required) {
          validator = validator.required(`${field.label || field.field_name} is required`);
        }
        if (field.metadata && field.metadata.validations && field.metadata.validations.regex) {
          validator = validator.matches(
            new RegExp(field.metadata.validations.regex),
            field.metadata.validations.error_message || 'Invalid value'
          );
        }
        finalizeValidationShape[field.field_name] = validator;
      }
    });
    const finalizeValidationSchema = Yup.object().shape(finalizeValidationShape);
    try {
      await finalizeValidationSchema.validate(formik.values, { abortEarly: false });
    } catch (validationError) {
      // Mark only relevant fields as touched and set errors
      const errors = {};
      const touched = {};
      validationError.inner.forEach((err) => {
        errors[err.path] = err.message;
        touched[err.path] = true;
      });
      formik.setTouched(touched);
      formik.setErrors(errors);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please fill all required fields and fix format errors before finalizing.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setFinalizing(false);
      return;
    }
    //
    const emptyFieldFinalize = (fields || []).find(
      (f) => f.is_required && (!formik.values[f.field_name] || String(formik.values[f.field_name]).trim() === '')
    );
    if (emptyFieldFinalize) {
      dispatch(
        openSnackbar({
          open: true,
          message: `Please fill all required fields before finalizing. Missing: ${emptyFieldFinalize.label || emptyFieldFinalize.field_name}`,
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }
    setFinalizing(true);
    // Format all date fields before sending
    const formattedFormValues = { ...formik.values };
    fields.forEach((field) => {
      if (field.field_type === 'date' && formattedFormValues[field.field_name]) {
        if (Array.isArray(formattedFormValues[field.field_name])) {
          // Handle date arrays (for table columns)
          formattedFormValues[field.field_name] = formattedFormValues[field.field_name].map((dateStr) => {
            if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
              const [yyyy, mm, dd] = dateStr.split('-');
              return `${dd}/${mm}/${yyyy}`;
            }
            return dateStr;
          });
        } else {
          // Handle single date fields
          formattedFormValues[field.field_name] = formatDateToDDMMYYYY(formattedFormValues[field.field_name]);
        }
      }
    });
    if (contextEventId) {
      const payload = {
        draft: contextEventId,
        draft_data: formattedFormValues,
        file_name: formik.values.file_name,
        status: 'completed'
      };
      try {
        if (!draftDetailId) {
          // First time: POST
          const result = await Factory('post', '/documentdrafting/document-drafts-details/', payload);
          if (result.res && result.res.status_cd === 0 && result.res.id) {
            setDraftDetailId(result.res.id);
            if (result.res.file_url || result.res.file) {
              setFileUrl(result.res.file_url || result.res.file);
            } else {
              fetchAndSetFileUrl(result.res.id);
            }
            setIsDownload(true);
            dispatch(
              openSnackbar({
                open: true,
                message: 'Document finalized successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: result.message || 'Failed to finalize',
                variant: 'alert',
                alert: { color: 'error' },
                close: false
              })
            );
          }
        } else {
          // Subsequent: PUT
          const result = await Factory('put', `/documentdrafting/document-drafts-details/${draftDetailId}/`, payload);
          if (result.res && result.res.status_cd === 0) {
            if (result.res.file_url || result.res.file) {
              setFileUrl(result.res.file_url || result.res.file);
            } else {
              fetchAndSetFileUrl(draftDetailId);
            }
            setIsDownload(true);
            dispatch(
              openSnackbar({
                open: true,
                message: 'Document finalized successfully',
                variant: 'alert',
                alert: { color: 'success' },
                close: false
              })
            );
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: result.message || 'Failed to finalize',
                variant: 'alert',
                alert: { color: 'error' },
                close: false
              })
            );
          }
        }
      } catch (err) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to finalize',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } else if (selectedTemplateId) {
      const keyFieldsData = formattedFormValues

      // ✅ Store in localStorage
      localStorage.setItem('pendingFinalizePayload', JSON.stringify(keyFieldsData));
      localStorage.setItem('file_name', formik.values.file_name); // Save file_name separately
      setIsDownload(true);

      // (optional) Remember redirect
      localStorage.setItem('postLoginRedirect', '/document/drafting');
    }
    setFinalizing(false);
  };




  const handleDownload = async () => {
    if (!isDownload) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No document selected for download.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      // Find the actual document content inside the preview container
      const previewElement =
        previewContainerRef.current?.querySelector('span') ||
        previewContainerRef.current?.querySelector('.html-editor') ||
        previewContainerRef.current;

      if (!previewElement) {
        throw new Error('Preview content not found');
      }

      if (!contextEventId) {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${previewElement.innerHTML}
          </body>
          </html>
        `;

        const opt = {
          filename: `${formik.values.file_name || selectedDocumentName}.pdf`,
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const worker = html2pdf()
          .set(opt)
          .from(htmlContent)
          .toPdf();

        worker.get('pdf').then(function (pdf) {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            // Set watermark style
            pdf.setTextColor(150, 150, 150);
            pdf.setFontSize(90);
            pdf.setFont('Times', 'bold');
            if (pdf.setGState) {
              pdf.setGState(new pdf.GState({ opacity: 0.15 }));
            }
            // Center of A4: 105mm x 148.5mm
            pdf.text('TaraFirst', 105, 148.5, {
              align: 'center',
              angle: 30
            });
            if (pdf.setGState) {
              pdf.setGState(new pdf.GState({ opacity: 1 }));
            }
          }
        }).then(function () {
          worker.save();
        });
      } else {
        await html2pdf()
          .set({
            filename: `${formik.values.file_name || selectedDocumentName}.pdf`,
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          })
          .from(previewElement)
          .save();
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'PDF downloaded successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to generate PDF',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      console.error('PDF generation error:', err);
    }
  };

  const generateWordDocument = async () => {
    if (!isDownload) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No document selected for download.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    try {
      // Get the document content
      const previewElement =
        previewContainerRef.current?.querySelector('span') ||
        previewContainerRef.current?.querySelector('.html-editor') ||
        previewContainerRef.current;

      if (!previewElement) {
        throw new Error('Preview content not found');
      }

      // Create a blob with HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${previewElement.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formik.values.file_name || selectedDocumentName}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Word document downloaded successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to generate Word document',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      console.error('Word generation error:', err);
    }
  };
  // Handle download dropdown
  const handleDownloadClick = (event) => {
    if (contextEventId) {
      setDownloadAnchorEl(event.currentTarget); // Show PDF/Word menu
    } else {
      setCustomDownloadAnchorEl(event.currentTarget); // Show Watermark/Login menu
    }
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const handleDownloadPDF = () => {
    handleDownloadClose();
    handleDownload();
  };

  const handleDownloadWordFromMenu = () => {
    handleDownloadClose();
    generateWordDocument();
  };

  const handleCustomDownloadClose = () => {
    setCustomDownloadAnchorEl(null);
  };

  const [showEventTemplateAfterDownload, setShowEventTemplateAfterDownload] = useState(false);

  // Add at the top with other hooks
  const eventTemplateRef = React.useRef(null);
  const [highlightEventTemplate, setHighlightEventTemplate] = useState(false);

  const handleDownloadWithWatermark = async () => {
    handleCustomDownloadClose();
    await handleDownload();
    setShowEventTemplateAfterDownload(true);
    setTimeout(() => {
      if (eventTemplateRef.current) {
        eventTemplateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightEventTemplate(true);
        setTimeout(() => setHighlightEventTemplate(false), 2000);
      }
    }, 100); // Delay to ensure EventTemplate is rendered
  };

  const handleLoginRedirect = () => {
    handleCustomDownloadClose();
    localStorage.setItem('download_login_hint', 'true');
    navigate('/register?id=1&context=business&type=product');
  };
  // Reset All handler
  const handleResetAll = () => {
    // Reset all form fields to empty using formik
    const resetValues = (fields || []).reduce(
      (acc, field) => {
        acc[field.field_name] = '';
        return acc;
      },
      { file_name: '' }
    );
    formik.resetForm({ values: resetValues });
    setFormValues(resetValues);
    dispatch(
      openSnackbar({
        open: true,
        message: 'All fields reset',
        variant: 'alert',
        alert: { color: 'success' },
        close: false
      })
    );
  };

  const handleDeleteDocument = async (row) => {
    if (!row?.id) return;
    try {
      const result = await Factory('delete', `/documentdrafting/context-wise-event-document/${row.id}/`);
      if (result.res && result.res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Document deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        // Refresh the list (implement as needed, e.g., re-fetch or filter out deleted row)
        if (typeof getDocuments === 'function') {
          getDocuments();
        } else {
          setTemplates((prev) => prev.filter((doc) => doc.id !== row.id));
        }
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: result.message || 'Failed to delete document',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete document',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  // Always build formik, but use empty fields/validation if not splitView
  const dynamicFields = splitView ? fields || [] : [];
  const initialValues = { file_name: '' };
  const validationShape = {};

  if (splitView) {
    initialValues.file_name = formValues.file_name || '';
  }

  // Group fields by table_identifier for dynamic table handling
  const tableGroups = React.useMemo(() => {
    if (!fields) return [];
    const groups = {};
    fields.forEach((f) => {
      if (f.metadata && f.metadata.table_identifier) {
        const id = f.metadata.table_identifier;
        if (!groups[id]) groups[id] = { control: null, columns: [] };
        if (f.metadata.type === 'table-control') groups[id].control = f;
        if (f.metadata.type === 'table-column') groups[id].columns.push(f);
      }
    });
    return Object.entries(groups).map(([id, group]) => ({ ...group, tableId: id }));
  }, [fields]);

  // Compute regularFields: all fields not in any table group
  const tableFieldNames = new Set(
    tableGroups.flatMap((g) => [g.control?.field_name, ...g.columns.map((c) => c.field_name)]).filter(Boolean)
  );
  const regularFields = fields.filter((f) => !tableFieldNames.has(f.field_name));

  // Process regular fields
  regularFields.forEach((field) => {
    let value = formValues[field.field_name] || '';
    if (field.field_type === 'date' && value) {
      // Convert DD-MM-YYYY to YYYY-MM-DD if needed
      if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        const [dd, mm, yyyy] = value.split('-');
        value = `${dd}-${mm}-${yyyy}`;
      }
      // If already YYYY-MM-DD, keep as is
    }
    initialValues[field.field_name] = value;
    let validator = Yup.string();
    if (field.is_required) {
      validator = validator.required(`${field.label || field.field_name} is required`);
    }
    if (field.metadata && field.metadata.validations && field.metadata.validations.regex) {
      validator = validator.matches(
        new RegExp(field.metadata.validations.regex),
        field.metadata.validations.error_message || 'Invalid value'
      );
    }
    validationShape[field.field_name] = validator;
  });

  // Process table fields
  Object.entries(tableGroups).forEach(([tableId, tableGroup]) => {
    if (tableGroup.control) {
      const controlField = tableGroup.control;
      const defaultValue = controlField.metadata.default_value || 1;
      const currentValue = formValues[controlField.field_name] || defaultValue;

      initialValues[controlField.field_name] = currentValue;
      validationShape[controlField.field_name] = Yup.number()
        .required(`${controlField.label} is required`)
        .min(1, 'At least 1 row is required')
        .max(50, 'Maximum 50 rows allowed');

      // Initialize arrays for table columns
      tableGroup.columns.forEach((columnField) => {
        const existingArray = formValues[columnField.field_name] || [];
        const newArray = Array(Math.max(currentValue, existingArray.length))
          .fill('')
          .map((_, index) => {
            const value = existingArray[index] || '';
            // Convert DD/MM/YYYY to YYYY-MM-DD for date fields
            if (columnField.field_type === 'date' && value && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
              const [dd, mm, yyyy] = value.split('/');
              return `${dd}-${mm}-${yyyy}`;
            }
            return value;
          });
        initialValues[columnField.field_name] = newArray;

        // Validation for array fields
        validationShape[columnField.field_name] = Yup.array()
          .of(Yup.string().required(`${columnField.label} is required`))
          .min(currentValue, `Please fill all ${currentValue} rows`);
      });
    }
  });
  // Do NOT add file_name to validationShape
  const validationSchema = Yup.object().shape(validationShape);
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      setFormValues(values);
    }
  });

  // Add the previewContainerRef hook at the top level
  const previewContainerRef = React.useRef(null);

  // Dynamic Table Component
  const DynamicTableInput = ({ tableGroup, formik, tableId, previewContainerRef }) => {
    const controlField = tableGroup.control;
    const columnFields = tableGroup.columns;
    const effectiveNoOfRows = Math.max(1, formik.values[controlField.field_name] || controlField.metadata.default_value || 1);
    const prevNoOfRowsRef = useRef(effectiveNoOfRows);
    const noOfColumns = controlField.metadata.no_of_columns || columnFields.length;

    // Local state for No. of Rows field - moved outside callback
    const [localNoOfRows, setLocalNoOfRows] = React.useState(formik.values[controlField.field_name] || '');

    React.useEffect(() => {
      setLocalNoOfRows(formik.values[controlField.field_name] || '');
      // eslint-disable-next-line
    }, [formik.values[controlField.field_name]]);

    const handleNoOfRowsChange = (e) => {
      // Allow empty input temporarily
      formik.setFieldValue(controlField.field_name, e.target.value);
    };

    const handleNoOfRowsBlur = () => {
      const value = formik.values[controlField.field_name];
      const numRows = Math.max(1, Math.min(50, parseInt(value) || 1));

      // Only update if the value needs to be clamped or defaulted
      if (parseInt(value) !== numRows) {
        formik.setFieldValue(controlField.field_name, numRows);
      }

      // Only update arrays if the number of rows actually changed
      if (numRows !== prevNoOfRowsRef.current) {
        columnFields.forEach((columnField) => {
          const currentArray = formik.values[columnField.field_name] || [];
          const newArray = Array(numRows)
            .fill('')
            .map((_, index) => currentArray[index] || '');
          formik.setFieldValue(columnField.field_name, newArray);
        });
        prevNoOfRowsRef.current = numRows;
      }
    };

    // --- New TableRowFields component for each row ---
    const TableRowFields = ({ rowIndex }) => {
      // Local state for each cell in this row
      const [cellValues, setCellValues] = React.useState(() =>
        Object.fromEntries(columnFields.map((cf) => [cf.field_name, formik.values[cf.field_name]?.[rowIndex] || '']))
      );
      // Ref to track input elements to prevent cursor jumping
      const inputRefs = React.useRef({});

      React.useEffect(() => {
        setCellValues(Object.fromEntries(columnFields.map((cf) => [cf.field_name, formik.values[cf.field_name]?.[rowIndex] || ''])));
        // eslint-disable-next-line
      }, [JSON.stringify(columnFields.map((cf) => formik.values[cf.field_name]?.[rowIndex]))]);

      return (
        <Grid2 container spacing={2} sx={{ mb: 2 }}>
          {columnFields.map((columnField) => (
            // <Grid2 size={{ xs: 12, sm: 6 }} key={columnField.field_name}>
            <Grid2
              size={{
                xs: 12,
                sm: noOfColumns === 1 ? 12 : 6
              }}
              key={columnField.field_name}
            >
              <TextField
                fullWidth
                size="small"
                label={columnField.label}
                name={`${columnField.field_name}[${rowIndex}]`}
                value={cellValues[columnField.field_name]}
                inputRef={(el) => (inputRefs.current[columnField.field_name] = el)}
                onChange={(e) => {
                  setCellValues((v) => ({ ...v, [columnField.field_name]: e.target.value }));



                  setTimeout(() => {
                    const el = document.getElementById(`preview-field-${columnField.field_name}-${rowIndex}`);
                    const container = previewContainerRef.current;
                    if (el && container) {
                      const elRect = el.getBoundingClientRect();
                      const containerRect = container.getBoundingClientRect();
                      const scrollTop =
                        container.scrollTop + (elRect.top - containerRect.top) - container.clientHeight / 2 + el.offsetHeight / 2;
                      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                onBlur={(e) => {
                  const arr = Array.isArray(formik.values[columnField.field_name]) ? [...formik.values[columnField.field_name]] : [];
                  arr[rowIndex] = cellValues[columnField.field_name];
                  formik.setFieldValue(columnField.field_name, arr, false);
                  formik.handleBlur(e);
                  // Scroll preview to this field
                  setTimeout(() => {
                    const el = document.getElementById(`preview-field-${columnField.field_name}-${rowIndex}`);
                    const container = previewContainerRef.current;
                    if (el && container) {
                      const elRect = el.getBoundingClientRect();
                      const containerRect = container.getBoundingClientRect();
                      const scrollTop =
                        container.scrollTop + (elRect.top - containerRect.top) - container.clientHeight / 2 + el.offsetHeight / 2;
                      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                error={
                  formik.touched[columnField.field_name] &&
                  formik.errors[columnField.field_name] &&
                  formik.errors[columnField.field_name][rowIndex]
                }
                helperText={
                  formik.touched[columnField.field_name] &&
                  formik.errors[columnField.field_name] &&
                  formik.errors[columnField.field_name][rowIndex]
                }
                type={columnField.field_type === 'date' ? 'date' : 'text'}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder={columnField.field_type === 'date' ? 'DD/MM/YYYY' : ''}
              />
            </Grid2>
          ))}
        </Grid2>
      );
    };

    if (noOfColumns <= 2) {
      // Render two fields per row directly below No. of Rows, side by side using TableRowFields
      return (
        <Box sx={{ mb: 3 }}>
          {/* No. of Rows Input */}
          <Grid2 size={{ xs: 12 }} sx={{ mb: 2 }}>

            <TextField
              fullWidth
              size="small"
              label={controlField.label}
              name={controlField.field_name}
              value={localNoOfRows}
              onChange={(e) => {
                // Update local state only — no formik.setFieldValue here
                const val = e.target.value;
                if (/^\d{0,2}$/.test(val)) {
                  setLocalNoOfRows(val); // max 2 digits (up to 50)
                }
              }}
              onBlur={(e) => {
                const value = parseInt(localNoOfRows);
                const clamped = Math.max(1, Math.min(50, value || 1));
                formik.setFieldValue(controlField.field_name, clamped);
                handleNoOfRowsBlur(); // Also update the dynamic array fields
                formik.handleBlur(e);
              }}
              error={formik.touched[controlField.field_name] && Boolean(formik.errors[controlField.field_name])}
              helperText={formik.touched[controlField.field_name] && formik.errors[controlField.field_name]}
              type="number"
              inputProps={{ min: 1, max: 50 }}
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid2>
          {/* Render rows of two fields each, side by side using TableRowFields */}
          {Array.from({ length: effectiveNoOfRows }).map((_, rowIndex) => (
            <TableRowFields key={rowIndex} rowIndex={rowIndex} />
          ))}
        </Box>
      );
    }

    // Memoized TableRow to prevent unnecessary re-renders and cursor loss
    const MemoizedTableRow = React.memo(({ rowIndex }) => {
      // Local state for each cell in this row
      const [cellValues, setCellValues] = React.useState(() =>
        Object.fromEntries(columnFields.map((cf) => [cf.field_name, formik.values[cf.field_name]?.[rowIndex] || '']))
      );

      React.useEffect(() => {
        // Sync local state if Formik values change (e.g., on reset)
        setCellValues(Object.fromEntries(columnFields.map((cf) => [cf.field_name, formik.values[cf.field_name]?.[rowIndex] || ''])));
        // eslint-disable-next-line
      }, [JSON.stringify(columnFields.map((cf) => formik.values[cf.field_name]?.[rowIndex]))]);

      return (
        <TableRow key={rowIndex}>
          <TableCell>{rowIndex + 1}</TableCell>
          {columnFields.map((columnField) => (
            <TableCell key={`${columnField.field_name}-${rowIndex}`}>

              <TextField
                fullWidth
                size="small"
                label={columnField.label}
                name={`${columnField.field_name}[${rowIndex}]`}
                value={cellValues[columnField.field_name]}
                inputRef={(el) => (inputRefs.current[columnField.field_name] = el)}
                onChange={(e) => {
                  setCellValues((v) => ({ ...v, [columnField.field_name]: e.target.value }));

                  setTimeout(() => {
                    const arr = Array.isArray(formik.values[columnField.field_name]) ? [...formik.values[columnField.field_name]] : [];
                    arr[rowIndex] = e.target.value;
                    formik.setFieldValue(columnField.field_name, arr, false);
                  }, 5);

                  // Auto-scroll to preview
                  setTimeout(() => {
                    const el = document.getElementById(`preview-field-${columnField.field_name}-${rowIndex}`);
                    const container = previewContainerRef.current;
                    if (el && container) {
                      const elRect = el.getBoundingClientRect();
                      const containerRect = container.getBoundingClientRect();
                      const scrollTop =
                        container.scrollTop + (elRect.top - containerRect.top) - container.clientHeight / 2 + el.offsetHeight / 2;
                      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                onBlur={(e) => {
                  const arr = Array.isArray(formik.values[columnField.field_name]) ? [...formik.values[columnField.field_name]] : [];
                  arr[rowIndex] = cellValues[columnField.field_name];
                  formik.setFieldValue(columnField.field_name, arr, false);

                  // ✅ Explicitly mark the field as touched
                  formik.setFieldTouched(`${columnField.field_name}[${rowIndex}]`, true, true);
                  formik.handleBlur(e);

                  setTimeout(() => {
                    const el = document.getElementById(`preview-field-${columnField.field_name}-${rowIndex}`);
                    const container = previewContainerRef.current;
                    if (el && container) {
                      const elRect = el.getBoundingClientRect();
                      const containerRect = container.getBoundingClientRect();
                      const scrollTop =
                        container.scrollTop + (elRect.top - containerRect.top) - container.clientHeight / 2 + el.offsetHeight / 2;
                      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                error={Boolean(formik.touched[columnField.field_name]?.[rowIndex] && formik.errors[columnField.field_name]?.[rowIndex])}
                helperText={formik.touched[columnField.field_name]?.[rowIndex] && formik.errors[columnField.field_name]?.[rowIndex]}
                type={columnField.field_type === 'date' ? 'date' : 'text'}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder={columnField.field_type === 'date' ? 'DD/MM/YYYY' : ''}
              />
            </TableCell>
          ))}
        </TableRow>
      );
    });

    return (
      <Box sx={{ mb: 3 }}>
        {/* No. of Rows Input */}
        <Grid2 size={{ xs: 12 }} sx={{ mb: 2 }}>


          <TextField
            fullWidth
            label={controlField.label}
            name={controlField.field_name}
            type="number"
            value={localNoOfRows}
            onChange={(e) => {
              const value = e.target.value;
              setLocalNoOfRows(value); // just update local state for typing
            }}
            onBlur={(e) => {
              const num = Math.max(1, Math.min(50, parseInt(localNoOfRows) || 1));
              formik.setFieldValue(controlField.field_name, num);
              formik.handleBlur(e);
            }}
            error={formik.touched[controlField.field_name] && Boolean(formik.errors[controlField.field_name])}
            helperText={formik.touched[controlField.field_name] && formik.errors[controlField.field_name]}
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            inputProps={{ min: 1, max: 50 }}
          />

          <Button
            variant="outlined"
            sx={{ mt: 2, width: '100%' }}
            onClick={() => {
              // Prepare dialog data
              const noOfRows = formik.values[controlField.field_name] || controlField.metadata.default_value || 1;
              const values = {};
              columnFields.forEach((col) => {
                values[col.field_name] = Array.from({ length: noOfRows }, (_, i) => formik.values[col.field_name]?.[i] || '');
              });
              setTableDialogData({
                columns: columnFields,
                values,
                noOfRows,
                controlField
              });
              setTableDialogTableId(tableId);
              setTableDialogOpen(true);
            }}
          >
            Edit Table Rows
          </Button>
        </Grid2>


      </Box>
    );
  };

  // Show loading screen while template is loading
  if (templateLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'white'
        }}
      >
        <CircularProgressComponent isLoading displayContent={'Loading template...'} />
      </Box>
    );
  }

  if (splitView) {
    // Only render the split view, no header/tabs, with a full white background
    return (
      <Box
        sx={{
          p: { xs: 2, sm: 2, md: 4 },
          mt: 4,
          minHeight: '100vh',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'white', // set app background
          borderRadius: '8px'
        }}
      >

        <Typography variant="h5" fontWeight={600} sx={{ mb: 2, fontSize: { xs: 18, sm: 22 } }}>
          Document Drafting
        </Typography>

        {/* Your inner content */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', md: 'nowrap' }, // Wrap on small screens, side-by-side on md+
            gap: 3, // space between the papers
            justifyContent: 'center', // center the row
            width: '100%'
          }}
        >
          {/* Left: Dynamic Form */}
          <Paper
            elevation={2}
            sx={{
              flex: 1,
              minWidth: { xs: '100%', sm: 320, md: 400 },
              maxWidth: 400,
              height: 620,
              maxHeight: 1000,
              display: 'flex',
              flexDirection: 'column',
              pb: 2,
              mr: { xs: 0, md: 3 },
              overflow: 'hidden'
            }}
          >
            {/* Progress Bar */}
            {fields.length > 0 && (
              <Box sx={{ width: '100%', mb: 2, position: 'relative' }}>
                {(() => {
                  const totalFields = fields.length;
                  const filledFields = fields.filter(
                    (f) => formik.values[f.field_name] && String(formik.values[f.field_name]).trim() !== ''
                  ).length;
                  const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
                  return (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E3EAFE',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#3650AE',
                            transition: 'none' // Remove animation
                          },
                          transition: 'none' // Remove animation
                        }}
                      />
                      <Typography variant="caption" sx={{ position: 'absolute', right: 16, top: 4, color: '#3650AE', fontWeight: 600 }}>
                        {/* {Math.round(progress)}% */}
                      </Typography>
                    </>
                  );
                })()}
              </Box>
            )}
            {/* Fixed Fill Details Heading */}
            <Typography variant="h5" fontWeight={700} mb={2} sx={{ p: 2, pb: 0 }}>
              Fill Details
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <ScrollableCard showArrows>
                <Box sx={{ p: 2.5, pb: 2 }}>
                  <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Enter document name"
                          name="file_name"
                          value={formik.values.file_name || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.file_name && Boolean(formik.errors.file_name)}
                          helperText={formik.touched.file_name && formik.errors.file_name}
                          variant="outlined"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Grid2>
                      {(fields || []).length > 0 ? (
                        <Grid2 container spacing={2}>

                          {regularFields.map((field, idx) => (
                            <Grid2 size={{ xs: 12 }} key={field.field_name}>

                              {field.field_type === 'select' && field.metadata && Array.isArray(field.metadata.options) ? (
                                <Autocomplete
                                  fullWidth
                                  options={field.metadata.options}
                                  value={formik.values[field.field_name] || ''}
                                  onChange={(_, value) => {
                                    formik.setFieldValue(field.field_name, value);
                                    // Scroll to preview field
                                    setTimeout(() => {
                                      const el = document.getElementById(`preview-field-${field.field_name}`);
                                      const container = previewContainerRef.current;
                                      if (el && container) {
                                        const elRect = el.getBoundingClientRect();
                                        const containerRect = container.getBoundingClientRect();
                                        const scrollTop =
                                          container.scrollTop +
                                          (elRect.top - containerRect.top) -
                                          container.clientHeight / 2 +
                                          el.offsetHeight / 2;
                                        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  onBlur={formik.handleBlur}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={field.label || field.field_name}
                                      name={field.field_name}
                                      error={formik.touched[field.field_name] && Boolean(formik.errors[field.field_name])}
                                      helperText={formik.touched[field.field_name] && formik.errors[field.field_name]}
                                      variant="outlined"
                                      slotProps={{ inputLabel: { shrink: true } }}
                                    />
                                  )}
                                />
                              ) : (
                                <TextField
                                  fullWidth
                                  label={field.label || field.field_name}
                                  name={field.field_name}
                                  value={formik.values[field.field_name] || ''}
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                    // Scroll to preview field
                                    setTimeout(() => {
                                      const el = document.getElementById(`preview-field-${field.field_name}`);
                                      const container = previewContainerRef.current;
                                      if (el && container) {
                                        const elRect = el.getBoundingClientRect();
                                        const containerRect = container.getBoundingClientRect();
                                        const scrollTop =
                                          container.scrollTop +
                                          (elRect.top - containerRect.top) -
                                          container.clientHeight / 2 +
                                          el.offsetHeight / 2;
                                        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched[field.field_name] && Boolean(formik.errors[field.field_name])}
                                  helperText={formik.touched[field.field_name] && formik.errors[field.field_name]}
                                  type={field.field_type && field.field_type.trim().toLowerCase() === 'date' ? 'date' : 'text'}
                                  variant="outlined"
                                  slotProps={{ inputLabel: { shrink: true } }}
                                  placeholder={field.field_type === 'date' ? 'dd-mm-yyyy' : field.placeholder || ''}
                                />
                              )}
                            </Grid2>
                          ))}

                          {/* Render dynamic tables */}
                          {Object.entries(tableGroups).map(([tableId, tableGroup]) => (
                            <Grid2 size={{ xs: 12 }} key={tableId}>
                              <DynamicTableInput
                                tableGroup={tableGroup}
                                formik={formik}
                                tableId={tableId}
                                previewContainerRef={previewContainerRef}
                              />
                            </Grid2>
                          ))}
                        </Grid2>
                      ) : (
                        <Typography>No fields to fill.</Typography>
                      )}
                    </Grid2>
                  </form>
                </Box>
              </ScrollableCard>
            </Box>
          </Paper>
          {/* Right: Live Template Preview */}
          <Paper
            elevation={2}
            sx={{
              position: 'relative',
              flex: 1,
              minWidth: { xs: '100%', sm: 320, md: 400 },
              maxWidth: 900,
              height: 620,
              maxHeight: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >

            {fields.length > 0 && (
              <Box sx={{ width: '100%', mb: 2, position: 'relative' }}>
                {(() => {
                  const totalFields = fields.length;
                  const filledFields = fields.filter(
                    (f) => formik.values[f.field_name] && String(formik.values[f.field_name]).trim() !== ''
                  ).length;
                  const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
                  return (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E3EAFE',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#3650AE'
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ position: 'absolute', right: 16, top: 4, color: '#3650AE', fontWeight: 600 }}>
                        {/* {Math.round(progress)}% */}
                      </Typography>
                    </>
                  );
                })()}
              </Box>
            )}
            <Box
              ref={previewContainerRef}
              sx={{
                flex: 1,
                p: 3,
                height: '100%',
                maxHeight: 530,
                overflow: 'auto',
                width: '100%',
                maxWidth: '100%',
                background: 'transparent',
                borderRadius: 0,
                boxSizing: 'border-box',
                // Custom scrollbar styles
                '&::-webkit-scrollbar': {
                  width: 8,
                  backgroundColor: '#E3EAFE',
                  borderRadius: 4
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#3650AE',
                  borderRadius: 4
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#00329E'
                },
                scrollbarWidth: 'thin',
                scrollbarColor: '#3650AE #E3EAFE',
                '& .offer-letter-preview': {
                  width: '100%',
                  marginBottom: 2,
                  padding: 2
                },
                '& *': {
                  maxWidth: '100%',
                  wordBreak: 'break-word'
                },
                '& p, & div': {
                  marginBottom: '16px',
                  lineHeight: '1.6'
                },
                '& table': {
                  marginBottom: '20px'
                }
              }}
            >


              {

                <UniversalDocument
                  documentType={selectedDocumentName}
                  formValues={formik.values}
                  fields={fields}
                  contextEventId={contextEventId}
                  draftDetailId={draftDetailId}
                  template={templatefield}
                  onDraftDetailIdChange={setDraftDetailId}
                  onFileUrlChange={setFileUrl}
                />}
            </Box>
          </Paper>
        </Box>

        {/* Action Buttons: Back at left, others at right */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 6,
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: { xs: 'stretch', sm: 'center' }
          }}
        >
          <Button
            variant="outlined"
            sx={{
              height: 40,
              minWidth: 120,
              fontSize: 16,
              px: 3,
              py: 0,
              borderColor: '#00329E',
              color: '#00329E',
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 1, sm: 0 },
              '&:hover': {
                borderColor: '#00329E',
                background: 'rgba(0,50,158,0.04)',
              },
            }}
            startIcon={<ArrowBackIcon />}
            onClick={() =>
              contextEventId
                ? navigate(`/app/drafting`)
                : navigate(`/document-drafting`)
            }
          >
            Back to Dashboard
          </Button>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                height: 40,
                minWidth: 120,
                fontSize: 16,
                px: 3,
                py: 0,
                background: '#00329E',
                color: '#fff',
                width: { xs: '100%', sm: 'auto' },
                mb: { xs: 1, sm: 0 },
                '&:hover': { background: '#002266' }
              }}
              onClick={handleSaveDraft}
              disabled={savingDraft}
            >
              {savingDraft ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                height: 40,
                minWidth: 120,
                fontSize: 16,
                px: 3,
                py: 0,
                background: '#00329E',
                color: '#fff',
                width: { xs: '100%', sm: 'auto' },
                mb: { xs: 1, sm: 0 },
                '&:hover': { background: '#002266' }
              }}
              onClick={handleFinalize}
              disabled={finalizing}
            >
              {finalizing ? 'Finalizing...' : 'Finalize'}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                height: 40,
                minWidth: 120,
                fontSize: 16,
                px: 3,
                py: 0,
                background: '#00329E',
                color: '#fff',
                width: { xs: '100%', sm: 'auto' },
                mb: { xs: 1, sm: 0 },
                '&:hover': { background: '#002266' },
                '&.Mui-disabled': {
                  backgroundColor: '#b0b8c4',
                  color: '#fff',
                  opacity: 1
                }
              }}
              onClick={handleDownloadClick}
              disabled={!isDownload}
            >
              Download
            </Button>
            <Menu
              anchorEl={downloadAnchorEl}
              open={downloadMenuOpen}
              onClose={handleDownloadClose}
              MenuListProps={{
                'aria-labelledby': 'download-button'
              }}
            >
              <MenuItem onClick={handleDownloadPDF}>Save as PDF</MenuItem>
              <MenuItem onClick={handleDownloadWordFromMenu}>Save as Word</MenuItem>
            </Menu>
            {/* Custom menu for not-logged-in users */}
            <Menu
              anchorEl={customDownloadAnchorEl}
              open={customDownloadMenuOpen}
              onClose={handleCustomDownloadClose}
              MenuListProps={{
                'aria-labelledby': 'download-button'
              }}
            >
              <MenuItem onClick={handleDownloadWithWatermark}>Download with Watermark</MenuItem>
              <MenuItem onClick={handleLoginRedirect}>Login to Download</MenuItem>
            </Menu>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                height: 40,
                minWidth: 120,
                fontSize: 16,
                px: 3,
                py: 0,
                borderColor: '#00329E',
                color: '#00329E',
                width: { xs: '100%', sm: 'auto' },
                mb: { xs: 1, sm: 0 },
                '&:hover': { borderColor: '#00329E', background: 'rgba(0,50,158,0.04)' }
              }}
              onClick={handleResetAll}
            >
              Reset All
            </Button>
          </Box>

        </Box>
        <Box>
          {/* {!contextEventId && <EventTemplate />}
        {console.log(contextEventId)} */}

        </Box>


        {/* Table Editing Dialog */}
        <Dialog open={tableDialogOpen} onClose={() => setTableDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Table Rows</DialogTitle>
          <DialogContent>
            {tableDialogData && (
              <Box sx={{ mt: 2 }}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Sr. No</TableCell>
                        {tableDialogData.columns.map((columnField) => (
                          <TableCell key={columnField.field_name} sx={{ fontWeight: 'bold', padding: '12px 16px' }}>
                            {columnField.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.from({ length: tableDialogData.noOfRows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell sx={{ padding: '12px 16px' }}>{rowIndex + 1}</TableCell>
                          {tableDialogData.columns.map((columnField) => (
                            <TableCell key={`${columnField.field_name}-${rowIndex}`} sx={{ padding: '12px 16px' }}>
                              <TextField
                                fullWidth
                                size="small"
                                label={columnField.label}
                                value={tableDialogData.values[columnField.field_name]?.[rowIndex] || ''}
                                onChange={(e) => {
                                  const newValues = { ...tableDialogData.values };
                                  if (!newValues[columnField.field_name]) {
                                    newValues[columnField.field_name] = [];
                                  }
                                  newValues[columnField.field_name][rowIndex] = e.target.value;
                                  setTableDialogData({ ...tableDialogData, values: newValues });

                                  formik.setFieldValue(columnField.field_name, newValues[columnField.field_name], false);

                                  setTimeout(() => {
                                    const el = document.getElementById(`preview-field-${columnField.field_name}-${rowIndex}`);
                                    const container = previewContainerRef.current;
                                    if (el && container) {
                                      const elRect = el.getBoundingClientRect();
                                      const containerRect = container.getBoundingClientRect();
                                      const scrollTop =
                                        container.scrollTop +
                                        (elRect.top - containerRect.top) -
                                        container.clientHeight / 2 +
                                        el.offsetHeight / 2;
                                      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
                                    }
                                  }, 100);
                                }}
                                type={columnField.field_type === 'date' ? 'date' : 'text'}
                                variant="outlined"
                                slotProps={{ inputLabel: { shrink: true } }}
                                placeholder={columnField.field_type === 'date' ? 'DD/MM/YYYY' : ''}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTableDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {

                if (tableDialogData) {
                  Object.entries(tableDialogData.values).forEach(([fieldName, values]) => {
                    formik.setFieldValue(fieldName, values);
                  });
                }
                setTableDialogOpen(false);
              }}
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {/* <Dialog
  open={showEventTemplateAfterDownload}
  onClose={() => setShowEventTemplateAfterDownload(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Event Template</DialogTitle>
  <DialogContent dividers>
    <EventTemplate
      setShowEventTemplateAfterDownload={setShowEventTemplateAfterDownload}
      setIsDownload={setIsDownload}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowEventTemplateAfterDownload(false)}>Close</Button>
  </DialogActions>
</Dialog> */}
        {showEventTemplateAfterDownload && (
          <Box
            ref={eventTemplateRef}
            sx={{
              mt: 1,
              // transition: 'background 0.5s',
              // background: highlightEventTemplate ? 'rgba(255, 255, 0, 0.15)' : 'transparent',
              borderRadius: 2,
              // boxShadow: highlightEventTemplate ? '0 0 0 2px #ffe066' : undefined,
            }}
          >
            <EventTemplate setShowEventTemplateAfterDownload={setShowEventTemplateAfterDownload} setIsDownload={setIsDownload} />
          </Box>
        )}
      </Box>
    );
  }


  const filteredTemplates = (templates || []).filter((template) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (template.document_name && template.document_name.toLowerCase().includes(s)) ||
      (template.title && template.title.toLowerCase().includes(s)) ||
      (template.file_name && template.file_name.toLowerCase().includes(s)) ||
      (template.description && template.description.toLowerCase().includes(s))
    );
  });



  return (
    <Box sx={{ p: { xs: 2, md: 2 } }}>

      {loading ? (
        <Box
          sx={{
            borderRadius: 3,
            p: 4,
            background: '#fff',
            height: '250px',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgressComponent isLoading displayContent={'Loading ...'} />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', color: 'red', my: 4 }}>{error}</Box>
      ) : (
        <>

          <Grid2
            container
            spacing={{ xs: 2, sm: 4, md: 6 }}
            sx={{ width: '100%', mx: 'auto' }}
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            {filteredTemplates.map((template) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={template.id} sx={{ mb: { xs: 2, md: 0 } }}>
                <Paper
                  sx={{
                    border: '1.5px solid #b0b8c4',
                    borderRadius: 3,
                    pl: { xs: 2, sm: 2.5 },
                    pr: { xs: 2, sm: 2.5 },
                    pt: { xs: 1, sm: 2.5 },
                    pb: { xs: 2, sm: 2.5 },

                    ml: { xs: 0, md: -2 },

                    width: { xs: '110%', sm: '100%', md: '110%' },

                    minWidth: { xs: '100%', sm: 220, md: '110%' },
                    maxWidth: { xs: '100%', sm: 400, md: '110%' },
                    minHeight: { xs: 120, sm: 180 },
                    maxHeight: { xs: 180, sm: 180 },
                    height: { xs: 140, sm: 180 },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    position: 'relative',
                    transition: 'border 0.2s, box-shadow 0.2s, transform 0.2s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    '&:hover': {
                      border: '1.5px solid #00329E',
                      boxShadow: '0 6px 24px rgba(2, 78, 153, 0.15)',
                      transform: 'scale(1.03)',
                      zIndex: 2
                    },
                    mr: { xs: 0, sm: 2, md: 3 }
                  }}
                >

                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 3,
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      color: favoriteStates[template.id] ? '#00329E' : '#b0b8c4'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(template.id);
                    }}
                  >
                    {favoriteStates[template.id] ? <FavoriteIcon sx={{ fontSize: 23 }} /> : <FavoriteBorderIcon sx={{ fontSize: 23 }} />}
                  </Box>
                  {/* Content (heading + paragraph) */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 0 }}>
                    <Box
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        width: '95%',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2,
                        minHeight: '2.6em'
                      }}
                      title={template.document_name || template.title || template.file_name}
                    >
                      {template.name || template.title || template.file_name}
                    </Box>
                    <Typography fontSize={13.2} color="text.secondary">
                      {template.description}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -1 }}>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        height: 30,
                        minWidth: 100,
                        fontSize: 14,
                        fontWeight: 600,
                        borderRadius: 2,

                        alignSelf: 'flex-end',
                        borderColor: '#00329E',
                        color: '#00329E',
                        // px: 2,
                        '&:hover': {
                          borderColor: '#00329E',
                          background: 'rgba(0,50,158,0.04)'
                        }
                      }}
                      onClick={() => handleCardProceed(template.id)}
                    >
                      Proceed
                    </Button>
                  </Box>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </>
      )}
    </Box>
  );
}

function ScrollableCard({ children, showArrows, containerRef: externalRef }) {
  const internalRef = React.useRef(null);
  const containerRef = externalRef || internalRef;
  const [showUp, setShowUp] = React.useState(false);
  const [showDown, setShowDown] = React.useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowUp(el.scrollTop > 0);
    setShowDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1); // -1 for rounding
  };

  React.useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, [children]); // re-check when children change

  const handleScroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    const amount = 100;
    if (direction === 'up') {
      el.scrollBy({ top: -amount, behavior: 'smooth' });
    } else if (direction === 'down') {
      el.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      {showArrows && showUp && (
        <Box sx={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <Box
            component="button"
            onClick={() => handleScroll('up')}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              p: 0,
              m: 0,
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowUpwardIcon fontSize="small" sx={{ bgcolor: '#fff', borderRadius: '50%', boxShadow: 1, p: 0.2 }} />
          </Box>
        </Box>
      )}

      {externalRef ? (
        children
      ) : (
        <Box
          ref={containerRef}
          sx={{
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            pr: 1,
            // Custom scrollbar styles
            '&::-webkit-scrollbar': {
              width: 8,
              backgroundColor: '#E3EAFE',
              borderRadius: 4
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#3650AE',
              borderRadius: 4
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#00329E'
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#3650AE #E3EAFE'
          }}
        >
          {children}
        </Box>
      )}
      {showArrows && showDown && (
        <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <Box
            component="button"
            onClick={() => handleScroll('down')}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              p: 0,
              m: 0,
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowDownwardIcon fontSize="small" sx={{ bgcolor: '#fff', borderRadius: '50%', boxShadow: 1, p: 0.2 }} />
          </Box>
        </Box>
      )}

    </Box>
  );
}

function ddmmyyyyToYyyymmdd(dateStr) {
  if (!dateStr || !/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return '';
  const [dd, mm, yyyy] = dateStr.split('-');
  return `${yyyy}-${mm}-${dd}`;
}
