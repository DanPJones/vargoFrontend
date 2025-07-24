import React, { createContext, useContext, useEffect, useMemo } from "react";

const SocketCtx = createContext<WebSocket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = useMemo(
    () => new WebSocket("ws://74.135.5.230:8080/ws"),
    []
  );
  useEffect(() => () => socket.close(), [socket]);

  return (
    <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>
  );
}

export const useSocket = () => useContext(SocketCtx)!;