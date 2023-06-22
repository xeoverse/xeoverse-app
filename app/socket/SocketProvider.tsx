import React, { useEffect } from "react";
import { SocketContext, socket } from "./SocketContext";

interface SocketProviderProps {
    children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
    useEffect(() => {
        socket.addEventListener('open', () => {
            console.log("WS connected")
        })

        socket.addEventListener('close', () => {
            console.log("WS disconnected")
        })

        socket.addEventListener('error', (err) => {
            console.log(err)
        })

        return () => {
            socket.close();
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
};

export default SocketProvider;