import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    value: 'read',
    label: 'read'
  }
];

export default function NotificationSection() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedKey, setExpandedKey] = useState(null);

  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const user = useSelector((s) => s?.accountReducer?.user ?? null);
  const anchorRef = useRef(null);

  const isTodayNotification = useCallback((notification) => {
    const createdAt = notification?.created_at || {};

    const dateLabel = typeof createdAt.date === 'string' ? createdAt.date.toLowerCase() : '';
    if (dateLabel === 'today') return true;

    if (!createdAt.date && createdAt.time) return true;

    if (!createdAt.date && typeof createdAt.display === 'string' && /^[0-9]{1,2}:[0-9]{2}\s?(am|pm)$/i.test(createdAt.display)) {
      return true;
    }
    return false;
  }, []);

  const isUnread = useCallback((notification) => notification.unread !== false, []);
  const isReadItem = useCallback((notification) => notification.unread === false, []);
  const getEpoch = useCallback((notification) => {
    const createdAt = notification?.created_at || {};
    const currentDate = new Date();

    // quick helpers
    const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const parseClock = (s) => {
      const match = /(\d{1,2}):(\d{2})\s*(am|pm)/i.exec(String(s || ''));
      if (!match) return null;
      let hour = parseInt(match[1], 10) % 12;
      if (/pm/i.test(match[3])) hour += 12;
      return { hour, minute: parseInt(match[2], 10) };
    };

    if (typeof createdAt.epoch === 'number') return createdAt.epoch;
    if (typeof createdAt.ts === 'number') return createdAt.ts;

    if (typeof createdAt.iso === 'string') {
      const dateObj = new Date(createdAt.iso);
      if (!Number.isNaN(dateObj)) return dateObj.getTime();
    }

    let baseDate = null;
    if (typeof createdAt.date === 'string') {
      const stringValue = createdAt.date.toLowerCase().trim();
      if (stringValue === 'today') baseDate = startOf(currentDate);
      else if (stringValue === 'yesterday') {
        const yesterdayDate = startOf(currentDate);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        baseDate = yesterdayDate;
      } else {
        const dateObj = new Date(createdAt.date);
        if (!Number.isNaN(dateObj)) baseDate = startOf(dateObj);
      }
    }

    const clockTime = parseClock(createdAt.time || createdAt.display);
    if (baseDate && clockTime) {
      baseDate.setHours(clockTime.hour, clockTime.minute, 0, 0);
      return baseDate.getTime();
    }
    if (baseDate) return baseDate.getTime();

    if (clockTime) {
      const baseDate = startOf(currentDate);
      baseDate.setHours(clockTime.hour, clockTime.minute, 0, 0);
      return baseDate.getTime();
    }

    const anyDate = notification.created || notification.timestamp || notification.display;
    if (anyDate) {
      const dateObj = new Date(anyDate);
      if (!Number.isNaN(dateObj)) return dateObj.getTime();
    }

    return 0;
  }, []);

  const filteredItems = useMemo(() => {
    const byCreatedDesc = (a, b) => getEpoch(b) - getEpoch(a);
    let notificationList;

    switch (value) {
      case 'new':
        notificationList = items.filter(isTodayNotification);
        break;
      case 'unread':
      notificationList = items.filter(isUnread);
      
      if (expandedKey) {
        const sticky = items.find((notification) => (notification.notification_id ?? notification.id) === expandedKey);
        if (sticky && !notificationList.some((notification) => (notification.notification_id ?? notification.id) === expandedKey)) {
          notificationList = [sticky, ...notificationList];
        }
      }
      break;
      case 'read':
        notificationList = items.filter((notification) => notification.unread === false);
        break;
      case 'all':
      default:
        notificationList = items;
    }
    return [...notificationList].sort(byCreatedDesc);
  }, [items, value, isTodayNotification, isUnread, getEpoch,expandedKey]);

  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, 5);
  const canExpand = filteredItems.length > 5;

  const handleToggle = () => {
    setOpen((prevOpen) => {
      const next = !prevOpen;
      if (next) setShowAll(false);
      return next;
    });
  };
  const handleItemRead = useCallback((nidOrId) => {
  
    setItems((prev) => prev.map((notification) => ((notification.notification_id ?? notification.id) === nidOrId ? { ...notification, unread: false } : notification)));

    setUnreadCount((c) => Math.max(0, c - 1));

    if (typeof window.leaveSocketSend === 'function') {
      window.leaveSocketSend({ type: 'mark_read', notification_id: nidOrId });
    }
  }, []);

  const normalizeNotification = useCallback((src) => {
    const rawCreatedAt = src?.created_at ?? src?.data?.created_at ?? null;
    let display = '';
    if (rawCreatedAt?.display) display = rawCreatedAt.display;
    else if (rawCreatedAt && typeof rawCreatedAt === 'object' && (rawCreatedAt.date || rawCreatedAt.time))
      display = [rawCreatedAt.date, rawCreatedAt.time].filter(Boolean).join(' ');
    else display = src?.display || src?.created || src?.timestamp || '';

    const created_at = typeof rawCreatedAt === 'object' ? { ...rawCreatedAt, display } : { display };
    const id = src?.notification_id ?? src?.id ?? Date.now();

    const rawIsRead = src?.is_read ?? src?.read ?? false;
    const isRead = rawIsRead === true || rawIsRead === 1 || rawIsRead === 'true' || rawIsRead === '1';

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
      const unreadCount = Number(d.unread_count ?? d.unread ?? d.count);
      if (!Number.isNaN(unreadCount)) setUnreadCount(unreadCount);
    };
    window.addEventListener('leave_notification', badgeHandler);
    return () => window.removeEventListener('leave_notification', badgeHandler);
  }, []);

  useEffect(() => {
    const onWs = (e) => {
      const d = e.detail || {};

      if (Array.isArray(d.notifications)) {
        const normalized = d.notifications.map(normalizeNotification);
        setItems((prev) => {
          const existingIds = new Set(prev.map((notification) => notification.notification_id ?? notification.id));
          const notificationsToAdd = normalized.filter((notification) => !existingIds.has(notification.notification_id ?? notification.id));

          return [...prev, ...notificationsToAdd].slice(0, 200);
        });
        return;
      }

      if (!d.title && !d.message) return;

      const notification = normalizeNotification(d);
      setItems((prev) => {
        const notificationKey = notification.notification_id || notification.id;
        const index = prev.findIndex((notification) => (notification.notification_id || notification.id) === notificationKey);
        if (index >= 0) {
          const next = prev.slice();
          next[index] = { ...prev[index], ...notification };
          return next;
        }

        return [notification, ...prev].slice(0, 200);
      });
    };

    window.addEventListener('leave_notification', onWs);
    return () => window.removeEventListener('leave_notification', onWs);
  }, [normalizeNotification]);

  useEffect(() => {
    if (!user?.employee) return;

    const fetchUnread = async () => {
      try {
        const response = await Factory('get', '/payroll/unread-notifications-count/', {}, {});
        const unreadCount = Number(response?.res?.data?.unread_count ?? response?.res?.data?.count ?? response?.res?.data ?? 0);
        if (!Number.isNaN(unreadCount)) setUnreadCount(unreadCount);
      } catch (e) {}
    };

    fetchUnread();
  }, [user?.employee]);

  useEffect(() => {
    if (!open || !user?.employee) return;
    (async () => {
      try {
        const response = await Factory('get', '/payroll/leave-notifications/', {}, {});
        const payload = response?.res?.data;
        let notificationList = [];
        if (Array.isArray(payload)) notificationList = payload;
        else if (Array.isArray(payload?.results)) notificationList = payload.results;
        else if (Array.isArray(payload?.data)) notificationList = payload.data;
        else if (Array.isArray(payload?.notifications)) notificationList = payload.notifications;
        else if (Array.isArray(payload?.items)) notificationList = payload.items;

        const mapped = Array.isArray(notificationList)
          ? notificationList.map((notification) => {
              const mappedNotification = normalizeNotification(notification);
              return mappedNotification;
            })
          : [];

        setItems((prev) => {
          const existingIds = new Set(prev.map((notification) => notification.notification_id ?? notification.id));
          const notificationsToAdd = mapped.filter((notification) => !existingIds.has(notification.notification_id ?? notification.id));
          return [...prev, ...notificationsToAdd].slice(0, 200); // ✅ WS stays first
        });
        setShowAll(false);
      } catch (e) {}
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
                            onItemRead={handleItemRead}
                            expandedId={expandedKey}
                            onToggleExpand={(id) => setExpandedKey((p) => (p === id ? null : id))}
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
