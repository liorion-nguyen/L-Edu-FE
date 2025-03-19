import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

type CallbackFunction = (data: any) => void;

const useWebSocket = (eventName: string, callback?: CallbackFunction): Socket | null => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket: Socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"], 
            reconnection: true, 
            reconnectionAttempts: 5, 
            reconnectionDelay: 2000, 
        });

        setSocket(newSocket);

        if (eventName && callback) {
            newSocket.on(eventName, callback);
        }

        return () => {
            newSocket.disconnect();
        };
    }, [eventName, callback]);

    return socket;
};

export default useWebSocket;