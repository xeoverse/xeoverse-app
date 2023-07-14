import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

export interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

export interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      grassMaterial: any;
    }
  }
}