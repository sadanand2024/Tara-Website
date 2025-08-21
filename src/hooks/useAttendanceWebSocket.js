import { useState, useEffect, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';

const useAttendanceWebSocket = (employeeId, onAttendanceUpdate) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [error, setError] = useState(null);

    const socketUrl = `ws://dev-backend.tarafirst.com:8000/ws/attendance/${employeeId}/`;

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage: wsLastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log('Attendance WebSocket connected');
            setIsConnected(true);
            setError(null);
        },
        onMessage: (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Attendance WebSocket message:', data);
                setLastMessage(data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                setError('Failed to parse WebSocket message');
            }
        },
        onClose: () => {
            console.log('Attendance WebSocket disconnected');
            setIsConnected(false);
        },
        onError: (error) => {
            console.log('Attendance WebSocket error:', error);
            setIsConnected(false);
            setError('WebSocket connection error');
        },
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000,
        maxReconnectAttempts: 10,
    });

    const handleWebSocketMessage = useCallback((data) => {
        switch (data.type) {
            case 'ws_connected':
                console.log('WebSocket connected for employee:', data.employee_id);
                break;
            case 'attendance_update':
                if (onAttendanceUpdate) {
                    onAttendanceUpdate(data);
                }
                break;
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    }, [onAttendanceUpdate]);

    const sendAttendanceAction = useCallback((action, location, deviceInfo) => {
        if (isConnected && readyState === 1) {
            const message = {
                type: 'attendance_action',
                action,
                employee_id: employeeId,
                location,
                device_info: deviceInfo,
                timestamp: new Date().toISOString()
            };
            sendJsonMessage(message);
            return true;
        }
        return false;
    }, [isConnected, readyState, employeeId, sendJsonMessage]);

    const connectionStatus = {
        0: 'Connecting',
        1: 'Connected',
        2: 'Closing',
        3: 'Disconnected'
    }[readyState];

    return {
        isConnected,
        connectionStatus,
        lastMessage,
        error,
        sendAttendanceAction,
        readyState,
        getWebSocket
    };
};

export default useAttendanceWebSocket;
