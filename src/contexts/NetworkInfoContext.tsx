"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface NetworkInfoContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NetworkInfoContext = createContext<NetworkInfoContextType | undefined>(
  undefined
);

export function NetworkInfoProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NetworkInfoContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </NetworkInfoContext.Provider>
  );
}

export function useNetworkInfo() {
  const context = useContext(NetworkInfoContext);
  if (context === undefined) {
    throw new Error("useNetworkInfo must be used within a NetworkInfoProvider");
  }
  return context;
}
