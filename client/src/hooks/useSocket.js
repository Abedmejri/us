import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (coupleId) => {
    const socketRef = useRef();

    useEffect(() => {
        if (!coupleId) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
        socketRef.current = io(socketUrl);

        socketRef.current.emit('join_couple', coupleId);

        socketRef.current.on('connect', () => {
            console.log('Connected to server');
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [coupleId]);

    const emit = (event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, { ...data, coupleId });
        }
    };

    const on = (event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    return { emit, on };
};

export default useSocket;
