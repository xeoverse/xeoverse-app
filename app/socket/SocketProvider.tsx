import React, { useEffect } from "react";
import { SocketContext, socket } from "./SocketContext";

export enum MessageType {
  UserInit,
  UserJoin,
  UserLeave,
  UserMove,
  UserRotate,
  UserShoot,
  WorldItem,
}

export type UserStates = Record<
  number,
  { position: number[]; rotation: number[] }
>;

export interface SocketMessage {
  type: MessageType;
  userId: number;
  position: number[];
  rotation: number[];
  data: string;
  userStates: UserStates;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  useEffect(() => {
    socket.addEventListener("open", () => {
      console.log("WS connected");
    });

    socket.addEventListener("close", () => {
      console.log("WS disconnected");
    });

    socket.addEventListener("error", (err) => {
      console.log(err);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
