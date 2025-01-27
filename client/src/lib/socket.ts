import { io, Socket } from 'socket.io-client';
import { API_WS_URL } from '../utils/constants';

let socket: Socket | null = null;

export const initializeSocket = () => {
    
    const token = localStorage.getItem('access_token');

    if(!token) {
        console.log('User is not authenticated. Socket connection not established.')
        return null;
    }

    if(!socket) {
        socket = io(API_WS_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 5000,
            auth: {
                token
            }
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return socket;
    }
}

export const getSocket = () => {
    if (!socket) {
      throw new Error('Socket not initialized. Call initializeSocket first.');
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket disconnected');
    }
};