import React from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketStatus = () => {
  const socketState = useWebSocket('ws://dev-backend.tarafirst.com:8001/ws/attendance/2/', {
    onOpen: () => console.log('✅ Connected to WebSocket'),
    onClose: () => console.log('❌ Disconnected from WebSocket'),
    onError: (e) => console.log('⚠️ WebSocket Error:', e),
    shouldReconnect: () => true // Auto-reconnect on close
  });
  console.log(socketState);

  const connectionStatus = {
    0: '🟡 Connecting',
    1: '🟢 Open',
    2: '🟠 Closing',
    3: '🔴 Closed'
  }[socketState.readyState];
  console.log(socketState.readyState);
  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Status</h2>
      <p>Status: {connectionStatus}</p>
    </div>
  );
};

export default WebSocketStatus;
