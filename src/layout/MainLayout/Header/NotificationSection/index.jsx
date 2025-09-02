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

  const isTodayNotification = useCallback((it) => {
    const ca = it?.created_at || {};

    const dateLabel = typeof ca.date === 'string' ? ca.date.toLowerCase() : '';
    if (dateLabel === 'today') return true;

    if (!ca.date && ca.time) return true;

    if (!ca.date && typeof ca.display === 'string' && /^[0-9]{1,2}:[0-9]{2}\s?(am|pm)$/i.test(ca.display)) {
      return true;
    }
    return false;
  }, []);

  const isUnread = useCallback((it) => it.unread !== false, []);
  const isReadItem = useCallback((it) => it.unread === false, []);
  const getEpoch = useCallback((it) => {
    const ca = it?.created_at || {};
    const now = new Date();

    // quick helpers
    const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const parseClock = (s) => {
      const m = /(\d{1,2}):(\d{2})\s*(am|pm)/i.exec(String(s || ''));
      if (!m) return null;
      let h = parseInt(m[1], 10) % 12;
      if (/pm/i.test(m[3])) h += 12;
      return { h, m: parseInt(m[2], 10) };
    };

    if (typeof ca.epoch === 'number') return ca.epoch;
    if (typeof ca.ts === 'number') return ca.ts;

    if (typeof ca.iso === 'string') {
      const d = new Date(ca.iso);
      if (!Number.isNaN(d)) return d.getTime();
    }

    let base = null;
    if (typeof ca.date === 'string') {
      const d = ca.date.toLowerCase().trim();
      if (d === 'today') base = startOf(now);
      else if (d === 'yesterday') {
        const y = startOf(now);
        y.setDate(y.getDate() - 1);
        base = y;
      } else {
        const parsed = new Date(ca.date);
        if (!Number.isNaN(parsed)) base = startOf(parsed);
      }
    }

    const clock = parseClock(ca.time || ca.display);
    if (base && clock) {
      base.setHours(clock.h, clock.m, 0, 0);
      return base.getTime();
    }
    if (base) return base.getTime();

    if (clock) {
      const b = startOf(now);
      b.setHours(clock.h, clock.m, 0, 0);
      return b.getTime();
    }

    const any = it.created || it.timestamp || it.display;
    if (any) {
      const d = new Date(any);
      if (!Number.isNaN(d)) return d.getTime();
    }

    return 0;
  }, []);

  const filteredItems = useMemo(() => {
    const byCreatedDesc = (a, b) => getEpoch(b) - getEpoch(a);
    let list;

    switch (value) {
      case 'new':
        list = items.filter(isTodayNotification);
        break;
      case 'unread':
      list = items.filter(isUnread);
      
      if (expandedKey) {
        const sticky = items.find((it) => (it.notification_id ?? it.id) === expandedKey);
        if (sticky && !list.some((x) => (x.notification_id ?? x.id) === expandedKey)) {
          list = [sticky, ...list];
        }
      }
      break;
      case 'read':
        list = items.filter((it) => it.unread === false);
        break;
      case 'all':
      default:
        list = items;
    }
    return [...list].sort(byCreatedDesc);
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
  
    setItems((prev) => prev.map((it) => ((it.notification_id ?? it.id) === nidOrId ? { ...it, unread: false } : it)));

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
      const n = Number(d.unread_count ?? d.unread ?? d.count);
      if (!Number.isNaN(n)) setUnreadCount(n);
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
          const have = new Set(prev.map((x) => x.notification_id ?? x.id));
          const toAdd = normalized.filter((m) => !have.has(m.notification_id ?? m.id));

          return [...prev, ...toAdd].slice(0, 200);
        });
        return;
      }

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

        return [n, ...prev].slice(0, 200);
      });
    };

    window.addEventListener('leave_notification', onWs);
    return () => window.removeEventListener('leave_notification', onWs);
  }, [normalizeNotification]);

  useEffect(() => {
    if (!user?.employee) return;

    const fetchUnread = async () => {
      try {
        const res = await Factory('get', '/payroll/unread-notifications-count/', {}, {});
        const count = Number(res?.res?.data?.unread_count ?? res?.res?.data?.count ?? res?.res?.data ?? 0);
        if (!Number.isNaN(count)) setUnreadCount(count);
      } catch (e) {}
    };

    fetchUnread();
  }, [user?.employee]);

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

        const mapped = Array.isArray(list)
          ? list.map((n) => {
              const m = normalizeNotification(n);
              return m;
            })
          : [];

        setItems((prev) => {
          const have = new Set(prev.map((x) => x.notification_id ?? x.id));
          const toAdd = mapped.filter((m) => !have.has(m.notification_id ?? m.id));
          return [...prev, ...toAdd].slice(0, 200); // ✅ WS stays first
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
