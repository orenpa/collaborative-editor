// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

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

// Define a type for the props
type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = io("http://localhost:5000");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
