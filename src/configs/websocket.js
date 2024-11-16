// configs/websocket.js
import { Server } from 'socket.io';

let io; // Deklarasi variabel `io`

export const initializeWebSocket = (server) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Event 'disconnect'
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export const getIoInstance = () => io;
