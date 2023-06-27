import React, { createContext } from "react";
export const socket = new WebSocket("wss://rust.xeoverse.io/ws");
export const SocketContext = createContext<WebSocket | null>(null);