import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import { ThemeMode } from 'config';
import { useSelector } from 'store';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import Factory from 'utils/Factory';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons-react';

// notification status options
const status = [
  {
    value: 'all',
    label: 'All Notification'
  },
  {
    value: 'new',
    label: 'New'
  },
  {
    value: 'unread',
    label: 'Unread'
  },
  {
    value: 'other',
    label: 'read'
  }
];

// ==============================|| NOTIFICATION ||============================== //

export default function NotificationSection() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  // const [items, setItems] = useState([]);
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const user = useSelector((s) => s?.accountReducer?.user ?? null);
  const anchorRef = useRef(null);
  // const visibleItems = showAll ? items : items.slice(0, 5);
  // const canExpand = items.length > 5;
 
  const isTodayNotification = useCallback((it) => {
    const ca = it?.created_at || {};
    // Backend often sends: { date: "Today"|"Yesterday"|..., time: "1:47 PM" }
    const dateLabel = typeof ca.date === 'string' ? ca.date.toLowerCase() : '';
    if (dateLabel === 'today') return true;

    // Many "today" entries only include a time (no date) — treat those as today
    if (!ca.date && ca.time) return true;

    // If only a display time is present (e.g., "1:47 PM"), assume it's today
    if (!ca.date && typeof ca.display === 'string' && /^[0-9]{1,2}:[0-9]{2}\s?(am|pm)$/i.test(ca.display)) {
      return true;
    }
    return false;
  }, []);

  const isUnread = useCallback((it) => it.unread !== false, []);
   const filteredItems = useMemo(() => {
    switch (value) {
      case 'new':
        return items.filter(isTodayNotification);
      case 'unread':
        return items.filter(isUnread);
      case 'other':
        // anything not today and not unread
        return items.filter((it) => !isTodayNotification(it) && !isUnread(it));
      case 'all':
      default:
        return items;
    }
  }, [items, value, isTodayNotification, isUnread]);

  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, 5);
  const canExpand = filteredItems.length > 5;

  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };
  const handleToggle = () => {
    setOpen((prevOpen) => {
      const next = !prevOpen;
      if (next) setShowAll(false);
      return next;
    });
  };
  // const normalizeNotification = React.useCallback((src) => {
  const normalizeNotification = useCallback((src) => {
    const rawCreatedAt = src?.created_at ?? src?.data?.created_at ?? null;
    let display = '';
    if (rawCreatedAt?.display) display = rawCreatedAt.display;
    else if (rawCreatedAt && typeof rawCreatedAt === 'object' && (rawCreatedAt.date || rawCreatedAt.time))
      display = [rawCreatedAt.date, rawCreatedAt.time].filter(Boolean).join(' ');
    else display = src?.display || src?.created || src?.timestamp || '';

    const created_at = typeof rawCreatedAt === 'object' ? { ...rawCreatedAt, display } : { display };
    const id = src?.notification_id ?? src?.id ?? Date.now();
    const isRead = Boolean(src?.read ?? src?.is_read ?? false);

    return {
      id,
      notification_id: src?.notification_id ?? src?.id ?? id,
      title: src?.title || 'Notification',
      message: src?.message || '',
      display,
      created_at,
      unread: !isRead
    };
  }, []);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => {
    event?.target.value && setValue(event?.target.value);
  };
  useEffect(() => {
    const badgeHandler = (e) => {
      const d = e.detail || {};
      const n = Number(d.unread_count ?? d.unread ?? d.count);
      if (!Number.isNaN(n)) setUnreadCount(n);
    };
    window.addEventListener('leave_notification', badgeHandler);
    return () => window.removeEventListener('leave_notification', badgeHandler);
  }, []);

  // list: only while open
  // useEffect(() => {
  //   if (!open) {
  //     setItems([]);
  //     return;
  //   }
  //   const listHandler = (e) => {
  //     const d = e.detail || {};
  //     if (!d.title && !d.message) return;
  //     const rawCreatedAt = d.created_at;
  //     let display = '';
  //     if (rawCreatedAt?.display) {
  //       display = rawCreatedAt.display;
  //     } else if (rawCreatedAt && typeof rawCreatedAt === 'object' && (rawCreatedAt.date || rawCreatedAt.time)) {
  //       display = [rawCreatedAt.date, rawCreatedAt.time].filter(Boolean).join(' ');
  //     } else {
  //       display = d.display || d.created || d.timestamp || '';
  //     }
  //     const created_at = typeof rawCreatedAt === 'object' ? { ...rawCreatedAt, display } : { display };
  //     setItems((prev) =>
  //       [
  //         {
  //           id: d.notification_id || Date.now(),
  //           notification_id: d.notification_id,
  //           title: d.title,
  //           message: d.message,
  //           // display: d.created_at?.display || d.display || '',
  //           message: d.message || '',
  //           display, // handy top-level
  //           created_at, // keep {date,
  //           unread: true
  //         },
  //         ...prev
  //       ].slice(0, 50)
  //     );
  //   };
  //   window.addEventListener('leave_notification', listHandler);
  //   return () => window.removeEventListener('leave_notification', listHandler);
  // }, [open]);
  // useEffect(() => {
  //   const onWs = (e) => {
  //     const d = e.detail || {};
  //     if (!d.title && !d.message) return;
  //     const n = normalizeNotification(d);
  //     setItems((prev) => {
  //       const key = n.notification_id || n.id;
  //       const idx = prev.findIndex((x) => (x.notification_id || x.id) === key);
  //       if (idx >= 0) {
  //         const next = prev.slice();
  //         next[idx] = { ...prev[idx], ...n };
  //         return next;
  //       }
  //       return [n, ...prev].slice(0, 200);
  //     });
  //   };
  //   window.addEventListener('leave_notification', onWs);
  //   return () => window.removeEventListener('leave_notification', onWs);
  // }, [normalizeNotification]);
  useEffect(() => {
    const onWs = (e) => {
      const d = e.detail || {};

      // If a batch slipped through, normalize and merge all
      if (Array.isArray(d.notifications)) {
        const normalized = d.notifications.map(normalizeNotification);
        setItems((prev) => {
          const have = new Set(prev.map((x) => x.notification_id ?? x.id));
          const toAdd = normalized.filter((m) => !have.has(m.notification_id ?? m.id));
          // Keep WS items already in prev at the top, then add any new from batch after
          return [...prev, ...toAdd].slice(0, 200);
        });
        return;
      }

      // Single item path (must have title/message)
      if (!d.title && !d.message) return;

      const n = normalizeNotification(d);
      setItems((prev) => {
        const key = n.notification_id || n.id;
        const idx = prev.findIndex((x) => (x.notification_id || x.id) === key);
        if (idx >= 0) {
          const next = prev.slice();
          next[idx] = { ...prev[idx], ...n };
          return next;
        }
        // Prepend singles so the newest WS item appears as the first row
        return [n, ...prev].slice(0, 200);
      });
    };

    window.addEventListener('leave_notification', onWs);
    return () => window.removeEventListener('leave_notification', onWs);
  }, [normalizeNotification]);

  // Fetch unread count once for employee users on login/refresh
  useEffect(() => {
    if (!user?.employee) return;

    const fetchUnread = async () => {
      try {
        const res = await Factory('get', '/payroll/unread-notifications-count/', {}, {});
        const count = Number(res?.res?.data?.unread_count ?? res?.res?.data?.count ?? res?.res?.data ?? 0);
        if (!Number.isNaN(count)) setUnreadCount(count);
      } catch (e) {
        // ignore transient failures
      }
    };

    fetchUnread();
  }, [user?.employee]);

  // Fetch full list via REST when the notification box opens
  useEffect(() => {
    if (!open || !user?.employee) return;
    (async () => {
      try {
        const res = await Factory('get', '/payroll/leave-notifications/', {}, {});
        const payload = res?.res?.data;
        let list = [];
        if (Array.isArray(payload)) list = payload;
        else if (Array.isArray(payload?.results)) list = payload.results;
        else if (Array.isArray(payload?.data)) list = payload.data;
        else if (Array.isArray(payload?.notifications)) list = payload.notifications;
        else if (Array.isArray(payload?.items)) list = payload.items;

        // const mapped = Array.isArray(list)
        //   ? list.map((n) => {
        //       const id = n?.notification_id ?? n?.id ?? Date.now();
        //       const title = n?.title || n?.subject || 'Notification';
        //       const message = n?.message || n?.body || n?.text || '';
        //       // const display = n?.created_at?.display || n?.display || n?.created || n?.timestamp || '';
        //       const rawCreatedAt = n?.created_at ?? n?.data?.created_at ?? null;

        //       let display = '';
        //       if (rawCreatedAt?.display) {
        //         display = rawCreatedAt.display;
        //       } else if (rawCreatedAt && typeof rawCreatedAt === 'object' && (rawCreatedAt.date || rawCreatedAt.time)) {
        //         display = [rawCreatedAt.date, rawCreatedAt.time].filter(Boolean).join(' ');
        //       } else {
        //         display = n?.display || n?.created || n?.timestamp || '';
        //       }
        //       const created_at =
        //         typeof rawCreatedAt === 'object'
        //           ? { ...rawCreatedAt, display } // keep date/time AND add display
        //           : { display };
        //       const isRead = Boolean(n?.read ?? n?.is_read ?? false);
        //       return {
        //         id,
        //         notification_id: n?.notification_id ?? n?.id ?? id,
        //         title,
        //         message,
        //         display,
        //         created_at,
        //         unread: !isRead
        //       };
        //     })
        //   : [];
        // // setItems(mapped.slice(0, 200));
        // setItems(mapped); // store ALL messages
        const mapped = Array.isArray(list)
          ? list.map((n) => {
              const m = normalizeNotification(n);
              return m;
            })
          : [];
        // Merge: keep existing WS items; add any API items not already present
        // setItems((prev) => {
        //   const have = new Set(prev.map((x) => x.notification_id ?? x.id));
        //   const toAdd = mapped.filter((m) => !have.has(m.notification_id ?? m.id));
        //   return [...toAdd, ...prev].slice(0, 200);
        // });
        setItems((prev) => {
          const have = new Set(prev.map((x) => x.notification_id ?? x.id));
          const toAdd = mapped.filter((m) => !have.has(m.notification_id ?? m.id));
          return [...prev, ...toAdd].slice(0, 200); // ✅ WS stays first
        });
        setShowAll(false);
      } catch (e) {
        // ignore fetch errors on open
      }
    })();
  }, [open, user?.employee]);

  return (
    <>
      {user?.employee && (
        <Box sx={{ ml: 2, position: 'relative' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
              color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
              '&[aria-controls="menu-list-grow"],&:hover': {
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'secondary.light'
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
          {unreadCount > 0 && (
            <Chip
              size="small"
              label={unreadCount > 199 ? '199+' : String(unreadCount)}
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                height: 18,
                '& .MuiChip-label': { px: 0.5, lineHeight: '18px' }
              }}
              color="warning"
            />
          )}
        </Box>
      )}
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [downMD ? 5 : 0, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow={theme.shadows[16]}>
                    <Grid container direction="column" spacing={2}>
                      <Grid size={12}>
                        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 2, px: 2 }}>
                          <Grid>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">All Notification</Typography>
                              {/* <Chip size="small" label="01" sx={{ color: 'background.default', bgcolor: 'warning.dark' }} /> */}
                            </Stack>
                          </Grid>
                          <Grid>
                            <Typography component={Link} to="#" variant="subtitle2" color="primary">
                              Mark as all read
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={12}>
                        <Box
                          sx={{
                            height: '100%',
                            maxHeight: 'calc(100vh - 205px)',
                            overflowX: 'hidden',
                            '&::-webkit-scrollbar': { width: 5 }
                          }}
                        >
                          <Grid container direction="column" spacing={2}>
                            <Grid size={12}>
                              <Box sx={{ px: 2, pt: 0.25 }}>
                                <TextField
                                  id="outlined-select-currency-native"
                                  select
                                  fullWidth
                                  value={value}
                                  onChange={handleChange}
                                  slotProps={{ select: { native: true } }}
                                >
                                  {status.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </TextField>
                              </Box>
                            </Grid>
                            <Grid size={12} sx={{ p: 0 }}>
                              <Divider sx={{ my: 0 }} />
                            </Grid>
                          </Grid>
                          <NotificationList
                            // items={items}
                            items={visibleItems}
                            onItemRead={(nid) => {
                              // Remove blue dot in UI
                              setItems((prev) => prev.map((it) => (it.notification_id === nid ? { ...it, unread: false } : it)));
                              // Send mark_read to WS backend
                              if (typeof window.leaveSocketSend === 'function') {
                                window.leaveSocketSend({ type: 'mark_read', notification_id: nid });
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    {/* <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                      <Button size="small" disableElevation>
                        View All
                      </Button>
                    </CardActions> */}
                    <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                      {!showAll && canExpand && (
                        // <Button size="small" disableElevation onClick={() => setShowAll(true)}>
                        //   View All ({items.length})
                        // </Button>
                        <Button size="small" disableElevation onClick={() => setShowAll(true)}>
                          View All ({filteredItems.length})
                        </Button>
                      )}
                      {showAll && (
                        <Button size="small" disableElevation onClick={() => setShowAll(false)}>
                          Show Less
                        </Button>
                      )}
                    </CardActions>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
