// configs/websocket.js
import { Server } from 'socket.io';

let io; // Deklarasi variabel `io`

export const initializeWebSocket = (server) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Event 'chat message'
        socket.on('chat message', (msg) => {
            console.log('Received message:', msg);
            io.emit('chat message', msg); // Broadcast ke semua client
        });

        // Event 'disconnect'
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

// Fungsi untuk mendapatkan instance `io`
export const getIoInstance = () => io;
