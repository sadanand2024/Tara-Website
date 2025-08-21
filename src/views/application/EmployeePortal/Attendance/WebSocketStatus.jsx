import React from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketStatus = () => {
  const socketUrl = 'ws://dev-backend.tarafirst.com:8000/ws/attendance/2/';
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (event) => console.log('message', event),
    onClose: () => console.log('closed'),
    onError: (error) => console.log('error', error),
    shouldReconnect: (closeEvent) => true,
  });

  const connectionStatus = {
    0: '🟡 Connecting',
    1: '🟢 Open',
    2: '🟠 Closing',
    3: '🔴 Closed'
  }[readyState];
  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Status</h2>
      <p>Status: {connectionStatus}</p>
    </div>
  );
};

export default WebSocketStatus;
