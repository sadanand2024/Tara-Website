import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// project imports
import { ThemeMode } from 'config';

// assets
import User1 from 'assets/images/users/user-round.svg';

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.900' : alpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

export default function NotificationList({ items = [], onItemRead, expandedId, onToggleExpand }) {
  const theme = useTheme();
  // const [expandedId, setExpandedId] = React.useState(null);
  // const toggleExpanded = (id) => setExpandedId((p) => (p === id ? null : id));
  const [localExpanded, setLocalExpanded] = React.useState(null);
  const isControlled = typeof expandedId !== 'undefined' && typeof onToggleExpand === 'function';
  const currentExpanded = isControlled ? expandedId : localExpanded;
  const toggleExpanded = (id) => (isControlled ? onToggleExpand(id) : setLocalExpanded((p) => (p === id ? null : id)));

  return (
    <List sx={{ width: { xs: 300, md: 330 }, maxWidth: 520, py: 0 }}>
      {items.length === 0 && (
        <ListItemWrapper>
          <Typography variant="caption" sx={{ px: 2 }}>
            No notifications
          </Typography>
        </ListItemWrapper>
      )}
      {items.map((notification) => {
        const avatarSrc = notification.avatar || User1;

        const displayTime =
          notification.created_at?.display ||
          (notification.created_at?.date || notification.created_at?.time ? [notification.created_at?.date, notification.created_at?.time].filter(Boolean).join(' ') : '') ||
          notification.display ||
          '';
        const unread = notification.unread !== false;
        const id = notification.notification_id || notification.id;
        const isExpanded = expandedId === id;

        const markRead = () => {
          if (unread && typeof onItemRead === 'function' && notification.notification_id) {
            onItemRead(notification.notification_id);
          }
        };
        return (
          <ListItemWrapper
            key={id}
            onClick={() => {
              toggleExpanded(id);
              markRead();
            }}
          >
            <ListItem alignItems="flex-start" disablePadding>
              <ListItemAvatar>
                <Avatar alt={notification.title || 'Notification'} src={avatarSrc} sx={{ mt: 2 }} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack spacing={0.25}>
                    {displayTime && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 'auto', pl: 1, flexShrink: 0, whiteSpace: 'nowrap', textAlign: 'right' }}
                      >
                        {displayTime}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          pr: 1,
                          minWidth: 0,
                          cursor: 'pointer',
                          whiteSpace: isExpanded ? 'normal' : 'nowrap',
                          overflow: isExpanded ? 'visible' : 'hidden',
                          textOverflow: isExpanded ? 'unset' : 'ellipsis'
                        }}
                        onClick={() => {
                          toggleExpanded(id);
                          markRead();
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {unread && <Box sx={{ ml: 1, width: 8, height: 8, bgcolor: 'secondary.main', borderRadius: '50%', flexShrink: 0 }} />}
                    </Box>

                    {/* Right: time */}
                  </Stack>
                }
                secondary={
                  <Stack spacing={1} sx={{ pr: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={
                        isExpanded
                          ? { whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'visible', textOverflow: 'unset' }
                          : { display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
                      }
                      onClick={() => {
                        toggleExpanded(id);
                        markRead();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {notification.message}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          </ListItemWrapper>
        );
      })}
    </List>
  );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
NotificationList.propTypes = {
  items: PropTypes.array,
  onItemRead: PropTypes.func,
  expandedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onToggleExpand: PropTypes.func
};
