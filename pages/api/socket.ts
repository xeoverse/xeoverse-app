import { NextResponseWithSocket } from "../../custom";
import { NextApiRequest } from "next";
import { Server, Socket } from "socket.io";

export default async function handler(req: NextApiRequest, res: NextResponseWithSocket) {
    if (res.socket.server.io) {
        console.log("Server already started!");
        res.end();
        return;
    }

    const io = new Server(res.socket.server, {
        path: "/api/socket",
    });
    res.socket.server.io = io;

    const onConnection = (socket: Socket) => {
        console.log("New connection", socket.id);
        socket.send("Hello from server");
    };

    io.on("connection", onConnection);

    io.on("disconnect", (socket: Socket) => {
        console.log("Disconnected", socket.id);
    });

    io.on("error", (err: Error) => {
        console.log("Error", err);
    });

    io.on("message", (payload: any) => {
        console.log(payload)
    });

    console.log("Socket server started successfully!");
    res.end();
}
