import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Stack
} from '@mui/material';

// assets
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import InfoIcon from '@mui/icons-material/Info';

const actionLabels = {
  create: 'Create',
  read: 'View',
  update: 'Update',
  delete: 'Delete',
  approve: 'Approve',
  send: 'Send',
  print: 'Print',
  export: 'Export',
  cancel: 'Cancel',
  void: 'Void',
  reconcile: 'Reconcile',
  generate_report: 'Generate Report'
};

const commonActions = ['create', 'read', 'update', 'delete'];
const extraActions = ['approve', 'send', 'print', 'export', 'cancel', 'void', 'reconcile', 'generate_report'];

const PermissionsDrawer = ({ open, onClose, selectedUser, selectedPermissions, onPermissionChange, onSave, masterPermissions = [] }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedModule, setExpandedModule] = React.useState(null);

  // Function to format permission key
  const getPermissionKey = (serviceKey, action) => `${serviceKey}.${action}`;

  const handleModuleChange = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  // Transform masterPermissions into the required format with null checks
  const transformedPermissions = React.useMemo(() => {
    if (!Array.isArray(masterPermissions)) return [];

    return masterPermissions
      .map((module) => {
        if (!module || !Array.isArray(module.features)) return null;

        // Group features by service
        const serviceGroups = module.features.reduce((acc, feature) => {
          if (!feature.service || !feature.action) return acc;

          const serviceKey = feature.service.replace(/\s+/g, ''); // Remove spaces from service name
          if (!acc[serviceKey]) {
            acc[serviceKey] = {
              name: feature.service.replace(/([A-Z])/g, ' $1').trim(), // Add spaces before capital letters
              actions: [],
              labels: {}
            };
          }
          acc[serviceKey].actions.push(feature.action.toLowerCase());
          acc[serviceKey].labels[feature.action.toLowerCase()] = feature.label;
          return acc;
        }, {});

        return {
          module: module.module_id,
          module_name: module.module_name || 'Unnamed Module',
          module_description: module.module_description,
          subscription_status: module.subscription_status,
          services: serviceGroups
        };
      })
      .filter(Boolean);
  }, [masterPermissions]);

  // Check if all permissions for a service are selected
  const isServiceAllSelected = (serviceKey, service) => {
    const servicePermissions = service.actions.map((action) => selectedPermissions[getPermissionKey(serviceKey, action)] || false);
    return servicePermissions.every(Boolean);
  };

  // Check if some permissions for a service are selected
  const isServiceIndeterminate = (serviceKey, service) => {
    const servicePermissions = service.actions.map((action) => selectedPermissions[getPermissionKey(serviceKey, action)] || false);
    return servicePermissions.some(Boolean) && !servicePermissions.every(Boolean);
  };

  // Check if all permissions for an action across all services are selected
  const isActionAllSelected = (moduleId, action) => {
    const module = transformedPermissions.find((p) => p?.module === moduleId);
    if (!module) return false;

    const actionPermissions = Object.entries(module.services)
      .filter(([_, service]) => service.actions.includes(action))
      .map(([serviceKey]) => selectedPermissions[getPermissionKey(serviceKey, action)] || false);

    return actionPermissions.length > 0 && actionPermissions.every(Boolean);
  };

  // Check if some permissions for an action across all services are selected
  const isActionIndeterminate = (moduleId, action) => {
    const module = transformedPermissions.find((p) => p?.module === moduleId);
    if (!module) return false;

    const actionPermissions = Object.entries(module.services)
      .filter(([_, service]) => service.actions.includes(action))
      .map(([serviceKey]) => selectedPermissions[getPermissionKey(serviceKey, action)] || false);

    return actionPermissions.some(Boolean) && !actionPermissions.every(Boolean);
  };

  // Select/Deselect all permissions for a service
  const handleSelectAllService = (moduleId, serviceKey, checked) => {
    const module = transformedPermissions.find((p) => p?.module === moduleId);
    if (!module || !module.services[serviceKey]) return;

    module.services[serviceKey].actions.forEach((action) => {
      onPermissionChange(getPermissionKey(serviceKey, action), checked);
    });
  };

  // Select/Deselect all permissions for an action
  const handleSelectAllAction = (moduleId, action, checked) => {
    const module = transformedPermissions.find((p) => p?.module === moduleId);
    if (!module) return;

    Object.entries(module.services).forEach(([serviceKey, service]) => {
      if (service.actions.includes(action)) {
        onPermissionChange(getPermissionKey(serviceKey, action), checked);
      }
    });
  };

  // Check if there are any permissions to display
  const hasPermissions = transformedPermissions.length > 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: fullScreen ? '100%' : '70%',
          bgcolor: 'background.default'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pl: 3,
          pr: 2,
          pt: 2,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2
        }}
      >
        <Typography variant="h4" sx={{ color: 'primary.dark' }}>
          Modify Permissions
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            '&:hover': {
              bgcolor: 'error.lighter'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          mx: 2,
          mb: 1,
          p: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
          display: 'flex',
          gap: 2,
          alignItems: 'center'
        }}
      >
        <Box sx={{ borderRight: '1px solid #d7d7d791', bgcolor: 'primary.lighter', p: 1, pr: 10, display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: 'primary.main',
              fontSize: '1.2rem',
              color: 'white',
              mr: 1
            }}
          >
            {selectedUser?.first_name?.[0] + selectedUser?.last_name?.[0] || 'TU'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'left', gap: 1, mb: 1 }}>
              <PersonIcon sx={{ fontSize: '1.2rem', color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                {selectedUser?.first_name + selectedUser?.last_name || 'TaraFirst User'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {selectedUser?.email && (
                <Box sx={{ display: 'flex', alignItems: 'left', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
                  <Typography variant="body1" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <InfoIcon sx={{ color: 'info.main', mt: 0.5 }} />
            <Typography variant="subtitle1" sx={{ color: 'info.dark', fontStyle: 'italic', fontWeight: 500, mb: 0.5 }}>
              Module Subscription Required
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color="info.dark"
            sx={{
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 0.5
            }}
          >
            Permission management is tied to your module subscriptions. You can only assign permissions for modules that your organization
            has subscribed to. Contact your account manager to add more modules to your subscription.
          </Typography>
        </Box>
      </Box>
      {!hasPermissions ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No permissions available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            There are no subscribed modules with permissions to display.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ overflow: 'auto', flex: 1, px: 2 }}>
          {transformedPermissions.map((module) => (
            <Accordion
              key={module.module}
              expanded={expandedModule === module.module}
              onChange={() => handleModuleChange(module.module)}
              sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderRadius: 1,
                mb: 1,
                border: 1,
                borderColor: 'divider'
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: 'primary.main',
                      transform: expandedModule === module.module ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  />
                }
                sx={{
                  bgcolor: expandedModule === module.module ? 'primary.lighter' : 'background.neutral',
                  transition: 'background-color 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  },
                  '& .MuiAccordionSummary-content': {
                    m: 0
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 2
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, py: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        color: 'primary.dark',
                        mb: 0.5
                      }}
                    >
                      {module.module_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4'
                      }}
                    >
                      {module.module_description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      minWidth: 100
                    }}
                  >
                    <Chip
                      label={module.subscription_status.toUpperCase()}
                      size="small"
                      color={module.subscription_status === 'trial' ? 'warning' : 'success'}
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {Object.keys(module.services).length} Services
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0.5 }}>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    '& .MuiTableCell-root': {
                      p: 0.5,
                      '&:first-of-type': {
                        pl: 1
                      }
                    }
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Services</TableCell>
                        <TableCell
                          colSpan={4}
                          align="center"
                          sx={{
                            fontWeight: 600,
                            bgcolor: 'primary.lighter',
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            py: 0.5
                          }}
                        >
                          Common Actions
                        </TableCell>
                        {Object.values(module.services).some((service) =>
                          service.actions.some((action) => !commonActions.includes(action))
                        ) && (
                          <TableCell
                            colSpan={extraActions.filter(action => 
                              Object.values(module.services).some(service => service.actions.includes(action))
                            ).length}
                            align="center"
                            sx={{
                              fontWeight: 600,
                              bgcolor: 'secondary.lighter',
                              borderBottom: '2px solid',
                              borderColor: 'secondary.main',
                              py: 0.5
                            }}
                          >
                            Additional Actions
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell />
                        {commonActions.map((action) => (
                          <TableCell
                            key={action}
                            align="center"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              py: 0.5,
                              px: 0.5
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.25
                              }}
                            >
                              <Checkbox
                                size="small"
                                onChange={(e) => handleSelectAllAction(module.module, action, e.target.checked)}
                                checked={isActionAllSelected(module.module, action)}
                                indeterminate={isActionIndeterminate(module.module, action)}
                                color="secondary"
                              />
                              {actionLabels[action]}
                            </Box>
                          </TableCell>
                        ))}
                        {extraActions
                          .filter(action => Object.values(module.services).some(service => service.actions.includes(action)))
                          .map((action) => (
                            <TableCell
                              key={action}
                              align="center"
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.8rem',
                                py: 0.5,
                                px: 0.5,
                                bgcolor: 'secondary.lighter'
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: 0.25
                                }}
                              >
                                <Checkbox
                                  size="small"
                                  onChange={(e) => handleSelectAllAction(module.module, action, e.target.checked)}
                                  checked={isActionAllSelected(module.module, action)}
                                  indeterminate={isActionIndeterminate(module.module, action)}
                                  color="secondary"
                                />
                                {actionLabels[action]}
                              </Box>
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(module.services).map(([serviceKey, service]) => (
                        <TableRow
                          key={serviceKey}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              bgcolor: 'background.paper',
                              fontSize: '0.9rem'
                            }}
                          >
                            <Checkbox
                              size="small"
                              onChange={(e) => handleSelectAllService(module.module, serviceKey, e.target.checked)}
                              checked={isServiceAllSelected(serviceKey, service)}
                              indeterminate={isServiceIndeterminate(serviceKey, service)}
                              color="secondary"
                            />
                            {service.name}
                          </TableCell>
                          {commonActions.map((action) => (
                            <TableCell key={action} align="center" sx={{ py: 0.25, px: 0.5 }}>
                              {service.actions.includes(action) ? (
                                <Checkbox
                                  size="small"
                                  checked={selectedPermissions[getPermissionKey(serviceKey, action)] || false}
                                  onChange={(e) => onPermissionChange(getPermissionKey(serviceKey, action), e.target.checked)}
                                  color="secondary"
                                />
                              ) : (
                                <Typography variant="body2" color="text.primary" sx={{ opacity: 0.7, fontSize: '1.75rem' }}>
                                  -
                                </Typography>
                              )}
                            </TableCell>
                          ))}
                          {extraActions
                            .filter(action => Object.values(module.services).some(s => s.actions.includes(action)))
                            .map((action) => (
                              <TableCell key={action} align="center" sx={{ py: 0.25, px: 0.5 }}>
                                {service.actions.includes(action) ? (
                                  <Checkbox
                                    size="small"
                                    checked={selectedPermissions[getPermissionKey(serviceKey, action)] || false}
                                    onChange={(e) => onPermissionChange(getPermissionKey(serviceKey, action), e.target.checked)}
                                    color="secondary"
                                  />
                                ) : (
                                  <Typography variant="h5" color="text.secondary" sx={{ opacity: 0.7, fontSize: '1.75rem' }}>
                                    -
                                  </Typography>
                                )}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Button
          onClick={onClose}
          color="error"
          variant="outlined"
          size="small"
          sx={{
            minWidth: 100,
            '&:hover': {
              bgcolor: 'error.lighter'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          size="small"
          sx={{
            minWidth: 100,
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Drawer>
  );
};

PermissionsDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  selectedPermissions: PropTypes.object.isRequired,
  onPermissionChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  masterPermissions: PropTypes.array
};

export default PermissionsDrawer;
