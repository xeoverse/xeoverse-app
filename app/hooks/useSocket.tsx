import { useEffect, useState } from "react";

const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("wss://rust.xeoverse.io/ws")
        setSocket(socket)

        socket.addEventListener('open', () => {
            console.log("WS connected")
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
