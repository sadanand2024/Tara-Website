import React from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketStatus = () => {

  const socketState = useWebSocket('ws://dev-backend.tarafirst.com:8000/ws/attendance/2/', {
    onOpen: (event) => {
      console.log('🔗 WebSocket connected:', event);
      // You can access event.target or other fields if needed
    },
    onMessage: (event) => {
      console.log('📩 Message received:', event);

      try {
        const parsedData = JSON.parse(event.data);
        console.log('✅ Parsed JSON:', parsedData);
      } catch (err) {
        console.warn('⚠️ Could not parse message as JSON:', event.data);
      }
    }
    ,
    onClose: (event) => {
      console.log('❌ WebSocket disconnected:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
    },
    onError: (e) => console.log('⚠️ WebSocket Error:', e),
    shouldReconnect: () => true // Auto-reconnect on close
  });
  console.log(socketState)

  const connectionStatus = {
    0: '🟡 Connecting',
    1: '🟢 Open',
    2: '🟠 Closing',
    3: '🔴 Closed'
  }[socketState.readyState];
  // console.log(socketState.readyState);
  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Status</h2>
      <p>Status: {connectionStatus}</p>
    </div>
  );
};

export default WebSocketStatus;
