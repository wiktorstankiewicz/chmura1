import { io } from "socket.io-client";

export const socket = io("/socket.io", {
    autoConnect: false,
});

const createSocket = (userId: string) => {
    socket.auth = { userId };
    socket.connect();
}