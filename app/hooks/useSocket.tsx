import { useEffect, useState } from "react";

const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:8080/ws")

        socket.addEventListener('open', () => {
            console.log("WS connected")
            setSocket(socket)
        })

        socket.addEventListener('message', (data) => {
            // console.log(data)
        })

        socket.addEventListener('close', () => {
            console.log("WS disconnected")
        })

        socket.addEventListener('error', (err) => {
            console.log(err)
        })

        return () => {
            socket.close();
        };
    }, []);

    return socket;
}

export default useSocket;
