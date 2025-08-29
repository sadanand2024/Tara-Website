import React from 'react';
import { useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function WebSocketStatus() {
  const user = useSelector((s) => s?.accountReducer?.user ?? null);
  const employeeId = user?.employee?.id ?? user?.id ?? null;

  const socketUrl = React.useMemo(() => {
    if (!employeeId) return null;
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const id = encodeURIComponent(String(employeeId).trim());
    // backend expects: /ws/leave_notification/<id>/
    const url = `${proto}://dev-backend.tarafirst.com:8000/ws/leave_notification/${employeeId}/`;
    console.log('WS URL ->', url);
    return url;
  }, [employeeId]);

  const { readyState, sendJsonMessage /*, lastMessage */ } = useWebSocket(socketUrl, {
    skip: !socketUrl,           // don't attempt until URL exists
    share: true,                // reuse socket if component remounts
    shouldReconnect: () => true,
    reconnectAttempts: 1,
    reconnectInterval: 2000,
    onOpen: () => console.log('WS opened:', socketUrl),
    // onMessage: (e) => {
    //   try {
    //     const data = JSON.parse(e.data);
    //     if (data && (data.title || data.message || data.unread_count)) {
    //       window.dispatchEvent(new CustomEvent('leave_notification', { detail: data }));
    //     }
    //   } catch { /* ignore non-JSON */ }
    // },
   onMessage: (e) => {
  try {
    const data = JSON.parse(e.data);
    if (!data) return;

    // Always forward unread_count so the badge updates
    if (typeof data.unread_count === 'number') {
      window.dispatchEvent(
        new CustomEvent('leave_notification', { detail: { unread_count: data.unread_count } })
      );
    }

    // If it's a batch, dispatch each notification as its own event
    if (Array.isArray(data.notifications)) {
      data.notifications.forEach((n) => {
        window.dispatchEvent(new CustomEvent('leave_notification', { detail: n }));
      });
      return;
    }

    // Fallback: single notification payloads still work
    if (data.title || data.message) {
      window.dispatchEvent(new CustomEvent('leave_notification', { detail: data }));
    }
  } catch {
    /* ignore non-JSON */
  }
},

    onClose: (e) => console.log('WS closed:', e.code, e.reason),
    onError: (err) => console.error('WS error:', err),
  });

  // expose a safe sender
  React.useEffect(() => {
    window.leaveSocketSend = (payload) => {
      try {
        if (payload && typeof payload === 'object') sendJsonMessage(payload);
      } catch (e) {
        console.error('WS send failed', e);
      }
    };
    return () => { delete window.leaveSocketSend; };
  }, [sendJsonMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: '🟡 Connecting',
    [ReadyState.OPEN]: '🟢 Open',
    [ReadyState.CLOSING]: '🟠 Closing',
    [ReadyState.CLOSED]: '🔴 Closed',
    [ReadyState.UNINSTANTIATED]: '⚪️ Idle'
  }[readyState];

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Status</h2>
      <p>Status: {connectionStatus}</p>
      {/* {lastMessage && <pre>{lastMessage.data}</pre>} */}
    </div>
  );
}
