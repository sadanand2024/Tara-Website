import React from 'react';
import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';

const WebSocketStatus = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const socketUrl = user?.id ? `ws://dev-backend.tarafirst.com:8000/ws/attendance/${user.id}/` : null;

  const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket opened for user:', user?.id),
    onMessage: (event) => {
      try {
        console.log('WebSocket message received:', JSON.parse(event.data));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    },
    onClose: (event) => console.log('WebSocket closed:', event.code, event.reason),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => user?.id && closeEvent.code !== 1000,
    reconnectAttempts: 5,
    reconnectInterval: 3000
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
