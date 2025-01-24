import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export const SocketContext = createContext();

const socket = io('http://localhost:5000'); // Replace with your server URL

const SocketProvider = ({ children }) => {
    useEffect(() => {
        // On successful connection, update socketId in the backend
        socket.on('connect', async () => {
            console.log('Connected to server, socketId:', socket.id);
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Send the updated socketId to your server
                    await axios.post(
                        'http://localhost:5000/api/users/update-socket-id',
                        { socketId: socket.id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (err) {
                    console.error('Failed to update socketId:', err.response?.data || err.message);
                }
            }
        });

        // On disconnection, notify the server
        socket.on('disconnect', async () => {
            console.log('Disconnected from server');
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Notify the server to remove the socketId
                    await axios.post(
                        'http://localhost:5000/api/users/remove-socket-id',
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (err) {
                    console.error('Failed to remove socketId:', err.response?.data || err.message);
                }
            }
        });

        // Clean up the event listeners on unmount
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
