import React, { createContext, useContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { SocketProviderProps } from "../types/SocketProviderType";

interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

//initialized a socket connection to listen to the server
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = io(
    "https://collaborative-editor-api-production.up.railway.app/"
  );

  //listen and notify when clients connected to server
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
    });

    //when the component unmounts the sockets disconnect
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  //by this we are making the socket to the child components through useSocket hook
  //ensures that components can access and use the socket safley
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
