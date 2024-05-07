import { io } from "socket.io-client";
import { User } from "../stores/user-store";

export const socket = io( "",{
    path: "/ws",
    autoConnect: false,
    transports: ["websocket"],
});

export const createSocket = (user: User) => {
    socket.auth = { accessToken: user.accessToken };
    return socket;
}