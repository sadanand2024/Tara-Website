
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

function UniversalDocument({
  documentType,
  formValues = {},
  fields = [],
  contextEventId,
  draftDetailId,
  template = {},
  onDraftDetailIdChange,
  onFileUrlChange
}) {
  const [editMode, setEditMode] = useState(false);
  const [editedHtml, setEditedHtml] = useState('');
  const [savedHtmlOverride, setSavedHtmlOverride] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const htmlEditRef = useRef(null);
  const previewRef = useRef(null);
  const dispatch = useDispatch();



  if (!template) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Document template not found: {documentType}</Typography>
      </Box>
    );
  }

  // Helper to get the base HTML template
  const getBaseHtmlTemplate = () => {
    return template.html;
  };

  // Convert tokens to readable field names for edit mode
  const convertTokensToReadableNames = (html) => {
    return html.replace(/\$\{token\('([^']+)'\)(?:,\s*([^)]+))?\}/g, (match, fieldName, displayValue) => {
      return `<span contenteditable="false" data-protected="true" style="color: #007bff; font-weight: bold; text-decoration: underline; cursor: default; user-select: none;">${fieldName}</span>`;
    });
  };

  // Convert readable field names back to tokens for saving
  const convertReadableNamesToTokens = (html) => {
    // Find all spans with readable field names and convert back to tokens
    return html.replace(/<span[^>]*data-protected="true"[^>]*>([^<]+)<\/span>/g, (match, fieldName) => {
      return `\${token('${fieldName.trim()}')}`;
    });
  };


  function buildSignatoriesRowsHtml(count, signatory_names = [], designations = [], signatures = []) {
    const n = parseInt(count || 2, 10);
    let html = "";
    for (let i = 0; i < n; i++) {
      html += `<tr>
      <td>${i + 1}</td>
      <td>${signatory_names[i] ?? ''}</td>
      <td>${designations[i] ?? ''}</td>
      <td>${signatures[i] ?? ''}</td>
    </tr>`;
    }
    return html;
  }
  function buildPartnersRowsHtml(count, names = []) {
    const n = parseInt(count || 1, 10);
    let html = "";
    for (let i = 0; i < n; i++) {
      html += `<tr>
      <td>${i + 1}</td>
      <td>${names[i] ?? ''}</td>
    </tr>`;
    }
    return html;
  }

  const renderPreviewHtml = () => {
    let html = savedHtmlOverride || getBaseHtmlTemplate();
    const values = { ...formValues };

    // helpers
    const collectIndexed = (obj, rx) => {
      const tuples = [];
      Object.keys(obj || {}).forEach((k) => {
        const m = k.match(rx);
        if (m) tuples.push([parseInt(m[1], 10), obj[k]]);
      });
      tuples.sort((a, b) => a[0] - b[0]);
      return tuples.map((t) => t[1]);
    };
    const firstArray = (...names) => {
      for (const n of names) {
        const v = values?.[n];
        if (Array.isArray(v)) return v;
      }
      return undefined;
    };
    const formatDateSafe = (v) => {
      try {
        return typeof formatDate === 'function' ? formatDate(v) : String(v ?? '');
      } catch {
        return String(v ?? '');
      }
    };
    const formatAmt = (a) => {
      if (a === null || a === undefined || a === '') return '';
      const raw = String(a).replace(/[, ]/g, '');
      const num = Number(raw);
      if (!isFinite(num)) return String(a);       // keep free text
      return num.toLocaleString('en-IN');         // 12,34,567
    };

    // Replace tokens with actual values
    html = html.replace(/\$\{token\('([^']+)'\)(?:,\s*([^)]+))?\}/g, (match, fieldName, displayValue) => {

      // -------- 1) Turnover rows --------
      if (fieldName === 'turnover_rows_html') {
        // YEARS from values, rows[], or indexed keys
        let years =
          firstArray('years', 'year', 'turnover_years') ||
          (Array.isArray(values?.rows) ? values.rows.map((r) => r?.year) : undefined) ||
          collectIndexed(values, /^years?\[?(\d+)\]?$/i) ||
          collectIndexed(values, /^year[_-]?(\d+)$/i) ||
          [];

        // AMOUNTS from values, rows[], or indexed keys  (✅ fixed names)
        let amounts =
          firstArray('turnover_amounts', 'turnover_amount', 'turn_overs', 'amounts', 'amount', 'turnoverAmounts') ||
          (Array.isArray(values?.rows)
            ? values.rows.map((r) => r?.turnover_amount ?? r?.turn_overs ?? r?.amount)
            : undefined) ||
          collectIndexed(values, /^turnover[_-]?amounts?\[?(\d+)\]?$/i) ||
          collectIndexed(values, /^turnover[_-]?amount[_-]?(\d+)$/i) ||
          collectIndexed(values, /^amounts?\[?(\d+)\]?$/i) ||
          [];

        const nRaw = values?.no_of_rows ?? values?.noOfRows ?? 2;
        const n = Number.isFinite(parseInt(nRaw, 10)) ? parseInt(nRaw, 10) : Math.max(years.length, amounts.length, 2);

        let tableRowsHtml = '';
        for (let i = 0; i < n; i++) {
          const y = years[i] ? formatDateSafe(years[i]) : '';
          const a = amounts[i] ?? '';
          tableRowsHtml += `
          <tr>
            <td style="border:1px solid #ddd; padding:8px; text-align:left;">${i + 1}</td>
            <td style="border:1px solid #ddd; padding:8px; text-align:left;">${y}</td>
            <td style="border:1px solid #ddd; padding:8px; text-align:right;">${formatAmt(a)}</td>
          </tr>`;
        }


        return tableRowsHtml;
      }

      // -------- 2) Partners table rows --------
      if (fieldName === 'partners_rows_html') {
        const count =
          values?.no_of_rows_partners ?? values?.noOfRowsPartners ?? values?.no_of_partners ?? values?.noOfPartners ?? 1;

        // names from arrays, rows[], or indexed keys
        let names =
          firstArray('authorized_persons', 'partners', 'partner_names', 'names') ||
          (Array.isArray(values?.rows) ? values.rows.map((r) => r?.authorized_person || r?.partner_name || r?.name) : undefined) ||
          collectIndexed(values, /^authorized[_-]?persons?\[?(\d+)\]?$/i) ||
          collectIndexed(values, /^partner[_-]?names?\[?(\d+)\]?$/i) ||
          collectIndexed(values, /^names?\[?(\d+)\]?$/i) ||
          [];

        const htmlRows = buildPartnersRowsHtml(parseInt(count || 1, 10), names);
        // debug (optional)

        return htmlRows;
      }

      // -------- 3) Signatories table rows --------
      if (fieldName === 'signatories_rows_html') {
        const count =
          values?.no_of_rows_signatories ?? values?.noOfRowsSignatories ?? values?.no_of_signatories ?? values?.noOfSignatories ?? 2;

        let signatory_names =
          firstArray('signatory_name', 'signatory_names', 'signatories', 'names_signatories') ||
          (Array.isArray(values?.rows)
            ? values.rows.map((r) => r?.signatory_name || r?.name)
            : undefined) ||
          collectIndexed(values, /^signatory[_-]?names?\[?(\d+)\]?$/i) ||
          collectIndexed(values, /^signatory[_-]?name[_-]?(\d+)$/i) ||
          [];

        let designations =
          firstArray('designation', 'designations') ||
          (Array.isArray(values?.rows) ? values.rows.map((r) => r?.designation) : undefined) ||
          collectIndexed(values, /^designations?\[?(\d+)\]?$/i) ||
          collectIndexed(values, /^designation[_-]?(\d+)$/i) ||
          [];

        let signatures =
          firstArray('signature', 'signatures') ||
          (Array.isArray(values?.rows) ? values.rows.map((r) => r?.signature) : undefined) ||
          collectIndexed(values, /^signatures?\[?(\d+)\]?$/i) ||
          collectIndexed(values, /^signature[_-]?(\d+)$/i) ||
          [];

        const htmlRows = buildSignatoriesRowsHtml(parseInt(count || 2, 10), signatory_names, designations, signatures);

        return htmlRows;
      }

      // -------- default token handling (kept like yours) --------
      let val = '';
      if (displayValue) {
        if (displayValue.includes('formatDate(values.')) {
          const dateField = displayValue.match(/values\.(\w+)/)?.[1];
          if (dateField && values[dateField]) {
            val = formatDate(values[dateField]);
          }
        } else {
          try {
            val = eval(displayValue);
          } catch (e) {
            val = values[fieldName] ?? '';
          }
        }
      } else {
        // If this is a date field, always format it
        if (fields.find(f => f.field_name === fieldName && f.field_type === 'date')) {
          val = formatDate(values[fieldName]);
        } else {
          val = values[fieldName] ?? '';
        }
      }

      const safeVal =
        val !== undefined && val !== null && String(val).trim() !== '' ? val : '_____________';
      return `<span id="preview-field-${fieldName}" style="background: transparent;">${safeVal}</span>`;
    });

    return `
    <div class="${documentType}-preview">${html}</div>
  `;
  };


  // Format date helper
  const formatDate = (d) => {
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, dd] = d.split('-');
      return `${dd}-${m}-${y}`;
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
      // Already in dd-mm-yyyy
      return d;
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      // Convert dd/mm/yyyy to dd-mm-yyyy
      const [dd, mm, yyyy] = d.split('/');
      return `${dd}-${mm}-${yyyy}`;
    }
    return d;
  };

  // Format date to DD/MM/YYYY for backend
  const formatDateToDDMMYYYY = (dateStr) => {
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [yyyy, mm, dd] = dateStr.split('-');
      return `${dd}/${mm}/${yyyy}`;
    }
    return dateStr;
  };

  // Handle edit mode
  const handleEdit = () => {
    const baseHtml = savedHtmlOverride || getBaseHtmlTemplate();
    const editableHtml = convertTokensToReadableNames(baseHtml);
    setEditedHtml(editableHtml);
    setEditMode(true);
  };

  // Initialize content when entering edit mode
  useEffect(() => {
    if (editMode && htmlEditRef.current) {
      // Only set content if it's empty to avoid cursor jumps
      if (!htmlEditRef.current.innerHTML || htmlEditRef.current.innerHTML.trim() === '') {
        const baseHtml = getBaseHtmlTemplate();
        const content = editedHtml || convertTokensToReadableNames(baseHtml);
        htmlEditRef.current.innerHTML = content;
      }
    }
  }, [editMode]); // Only depend on editMode, not editedHtml




  //   if (!contextEventId) {
  //     // If no context event ID, just save locally
  //     setSavedHtmlOverride(editedHtml);
  //     setEditMode(false);
  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     // Format all date fields before sending
  //     const formattedFormValues = { ...formValues };
  //     fields.forEach((field) => {
  //       if (field.field_type === 'date' && formattedFormValues[field.field_name]) {
  //         if (Array.isArray(formattedFormValues[field.field_name])) {
  //           // Handle date arrays (for table columns)
  //           formattedFormValues[field.field_name] = formattedFormValues[field.field_name].map((dateStr) => {
  //             return formatDateToDDMMYYYY(dateStr);
  //           });
  //         } else {
  //           // Handle single date fields
  //           formattedFormValues[field.field_name] = formatDateToDDMMYYYY(formattedFormValues[field.field_name]);
  //         }
  //       }
  //     });

  //     const payload = {
  //       draft: contextEventId,
  //       draft_data: formattedFormValues,
  //       file_name: formValues.file_name || `${documentType}_document`,
  //       status: "draft",
  //       // put template directly under template_key
  //       [documentType]: {
  //         name: template.name || documentType,
  //         html: editedHtml,
  //         css: template.css
  //       }
  //     };

  //     let result;
  //     if (draftDetailId) {
  //       // Update existing draft
  //       result = await Factory('put', `/documentdrafting/document-drafts-details/${draftDetailId}/`, payload);
  //     } else {
  //       // Create new draft
  //       result = await Factory('post', '/documentdrafting/document-drafts-details/', payload);
  //     }

  //     if (result?.res?.status_cd === 0) {
  //       // Update local state
  //       setSavedHtmlOverride(editedHtml);
  //       setEditMode(false);

  //       // Update parent component with new draft detail ID if it's a new draft
  //       if (!draftDetailId && result?.res?.id && onDraftDetailIdChange) {
  //         onDraftDetailIdChange(result.res.id);
  //       }

  //       // Update file URL if available
  //       if (result?.res?.file_url || result?.res?.file) {
  //         const fileUrl = result.res.file_url || result.res.file;
  //         if (onFileUrlChange) {
  //           onFileUrlChange(fileUrl);
  //         }
  //       }

  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: draftDetailId ? 'Document updated successfully' : 'Document saved successfully',
  //           variant: 'alert',
  //           alert: { color: 'success' },
  //           close: false
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: result?.message || 'Failed to save document',
  //           variant: 'alert',
  //           alert: { color: 'error' },
  //           close: false
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error saving document:', error);
  //     dispatch(
  //       openSnackbar({
  //         open: true,
  //         message: 'Failed to save document',
  //         variant: 'alert',
  //         alert: { color: 'error' },
  //         close: false
  //       })
  //     );
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSave = async () => {
    // Validate that all required placeholders are still present
    const originalTemplate = getBaseHtmlTemplate();
    const originalTokenMatches = originalTemplate.match(/\$\{token\('([^']+)'\)(?:,\s*([^)]+))?\}/g) || [];
    const originalFieldNames = originalTokenMatches.map(match => {
      const fieldMatch = match.match(/\$\{token\('([^']+)'\)/);
      return fieldMatch ? fieldMatch[1] : '';
    }).filter(name => name);

    const currentProtectedElements = htmlEditRef.current?.querySelectorAll('[data-protected="true"]') || [];
    const currentFieldNames = Array.from(currentProtectedElements).map(el => el.textContent.trim());

    // Check if any placeholders are missing
    const missingFields = originalFieldNames.filter(field => !currentFieldNames.includes(field));

    if (missingFields.length > 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: `Error: The following placeholder field names have been removed: ${missingFields.join(', ')}. Please do not delete the blue underlined field names.`,
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return; // Stay in edit mode
    }

    if (originalFieldNames.length !== currentFieldNames.length) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error: Some placeholder field names have been removed. Please do not delete the blue underlined field names.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return; // Stay in edit mode
    }

    // Convert readable field names back to tokens before saving
    const htmlWithTokens = convertReadableNamesToTokens(editedHtml);

    // --- determine a stable template id for the localStorage key ---
    const templateId =
      localStorage.getItem('selectedTemplateId') || template?.id || template?.key || documentType;
    const draftKey = 'tplDraft';

    // --- always snapshot locally first (ONLY css, html, name) ---
    try {
      const snapshot = {
        css: template?.css || '',
        html: htmlWithTokens || '',
        name: template?.name || documentType || 'Untitled'
      };
      localStorage.setItem(draftKey, JSON.stringify(snapshot));
    } catch (e) {
      // ignore storage quota errors
    }

    // --- if no context, do your local-only UI work and exit ---
    if (!contextEventId) {
      setSavedHtmlOverride(htmlWithTokens);
      setEditMode(false);
      return;
    }

    setSaving(true);

    try {
      // Format all date fields before sending (unchanged)
      const formattedFormValues = { ...formValues };
      fields.forEach((field) => {
        if (field.field_type === 'date' && formattedFormValues[field.field_name]) {
          if (Array.isArray(formattedFormValues[field.field_name])) {
            formattedFormValues[field.field_name] = formattedFormValues[field.field_name].map((dateStr) =>
              formatDateToDDMMYYYY(dateStr)
            );
          } else {
            formattedFormValues[field.field_name] = formatDateToDDMMYYYY(formattedFormValues[field.field_name]);
          }
        }
      });

      // payload (unchanged)
      const payload = {
        draft: contextEventId,
        draft_data: formattedFormValues,
        file_name: formValues.file_name || `${documentType}_document`,
        status: 'draft',
        [documentType]: {
          name: template.name || documentType,
          html: htmlWithTokens,
          css: template.css
        }
      };

      let result;
      if (draftDetailId) {
        result = await Factory('put', `/documentdrafting/document-drafts-details/${draftDetailId}/`, payload);
      } else {
        result = await Factory('post', '/documentdrafting/document-drafts-details/', payload);
      }

      if (result?.res?.status_cd === 0) {
        setSavedHtmlOverride(htmlWithTokens);
        setEditMode(false);

        if (!draftDetailId && result?.res?.id && onDraftDetailIdChange) {
          onDraftDetailIdChange(result.res.id);
        }

        if (result?.res?.file_url || result?.res?.file) {
          const fileUrl = result.res.file_url || result.res.file;
          onFileUrlChange?.(fileUrl);
        }

        dispatch(
          openSnackbar({
            open: true,
            message: draftDetailId ? 'Document updated successfully' : 'Document saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: result?.message || 'Failed to save document',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error saving document:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to save document',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setSaving(false);
    }
  };


  // Handle preview
  const handlePreview = () => {
    setEditMode(false);
  };

  return (
    <>
      <style>
        {template.css}
      </style>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
        {editMode ? (
          <>
            <button
              style={{
                background: '#fff',
                color: '#00329E',
                border: '1.5px solid #00329E',
                borderRadius: 4,
                padding: '6px 18px',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                marginRight: 8
              }}
              onClick={handlePreview}
            >
              Preview
            </button>
            <button
              style={{
                background: saving ? '#ccc' : '#00329E',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '6px 18px',
                fontWeight: 600,
                fontSize: 15,
                cursor: saving ? 'not-allowed' : 'pointer',
                marginRight: 8,
                opacity: saving ? 0.7 : 1
              }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <button
            style={{
              background: '#00329E',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 18px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              marginRight: 8
            }}
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
      </Box>

      <Typography variant="h5" fontWeight={700} mb={1} sx={{ pl: 3, pt: 2 }}>
        Document Preview
      </Typography>

      {editMode && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            pr: 3,
            mb: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#1565C0',
              fontWeight: 500,
              fontSize: '0.875rem',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <InfoOutlinedIcon
              sx={{
                fontSize: '16px',
                color: '#1565C0'
              }}
            />
            Note: Template variables are protected elements and cannot be modified
          </Typography>
        </Box>
      )}

      <Box
        ref={previewRef}
        sx={{
          flex: 1,
          p: 3,
          height: '100%',
          maxHeight: 530,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          position: 'relative',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {editMode ? (
          <div
            ref={htmlEditRef}
            className="html-editor"
            contentEditable
            suppressContentEditableWarning
            style={{
              minHeight: 400,
              fontFamily: 'Times New Roman, serif',
              background: '#fff',
              color: '#222',
              fontSize: 16,
              lineHeight: 1.6,
              padding: 16,
              border: '1px solid #cfd8dc',
              borderRadius: 4,
              width: '210mm',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
            onInput={e => {
              setEditedHtml(e.currentTarget.innerHTML);
            }}
            onKeyDown={e => {
              // Enhanced protection for placeholders
              if (e.key === 'Backspace' || e.key === 'Delete') {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);

                  // Get all protected elements in the editor
                  const allProtected = e.currentTarget.querySelectorAll('[data-protected="true"]');

                  // Check if cursor is adjacent to or inside any protected element
                  for (let protectedEl of allProtected) {
                    const protectedRange = document.createRange();
                    protectedRange.selectNode(protectedEl);

                    // Check if ranges intersect or are adjacent
                    if (range.intersectsNode(protectedEl) ||
                      (e.key === 'Backspace' && range.startContainer === protectedEl.nextSibling && range.startOffset === 0) ||
                      (e.key === 'Delete' && range.endContainer === protectedEl.previousSibling && range.endOffset === (protectedEl.previousSibling?.textContent?.length || 0))) {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                  }

                  // Additional check for selection that would affect protected elements
                  if (!range.collapsed) {
                    const fragment = range.cloneContents();
                    if (fragment.querySelectorAll('[data-protected="true"]').length > 0) {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                  }
                }
              }
            }}
            onBeforeInput={e => {
              // Additional protection for input events that could delete placeholders
              if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward' || e.inputType === 'deleteByCut') {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const fragment = range.cloneContents();
                  if (fragment.querySelectorAll('[data-protected="true"]').length > 0) {
                    e.preventDefault();
                    return false;
                  }
                }
              }
            }}
          />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: renderPreviewHtml() }} />


        )}
      </Box>
    </>
  );
}

export default UniversalDocument;
