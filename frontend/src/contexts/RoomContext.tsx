import { ReactNode, createContext, useContext, useState } from "react";
import { Client } from "../interfaces/Client";
import { Message } from "../interfaces/Message";
import { Socket } from "socket.io-client";

interface RoomContextInterface {
  socket: Socket | null;
  room: {
    waitingForResponse: boolean;
    typing: boolean;
    typingColor: "teal" | "blue" | "pink" | "yellow";
    serverError: boolean;
    clientId: string;
    code: string;
    clients: Client[];
    messages: Message[];
  };
  setWaitingForResponse: (val: boolean) => void;
  setTyping: (typing: boolean, color: "teal" | "blue" | "pink" | "yellow") => void;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  setServerError: () => void;
  setClientId: (clientId: string) => void;
  setCode: (code: string) => void;
  setClients: (clients: Client[]) => void;
  pushMessage: (message: Message) => void;
  toggleClientChatDisabled: (clientId: string, disabled: boolean) => void;
}

const defaultState = {
  socket: null,
  room: {
    waitingForResponse: false,
    typing: false,
    typingColor: "teal",
    serverError: false,
    clientId: "",
    code: "",
    clients: [],
    messages: [],
  },
  setWaitingForResponse: () => {},
  setTyping: () => {},
  setSocket: () => {},
  setServerError: () => {},
  setClientId: () => {},
  setCode: () => {},
  setClients: () => {},
  pushMessage: () => {},
  toggleClientChatDisabled: () => {},
} as RoomContextInterface;

const RoomContext = createContext<RoomContextInterface>(defaultState);

export function useRoom() {
  return useContext(RoomContext);
}

export function RoomProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState(defaultState.socket);
  const [room, setRoom] = useState(defaultState.room);

  const setWaitingForResponse = (val: boolean) => {
    setRoom(curr => ({ ...curr, waitingForResponse: val }));
  };

  const setTyping = (typing: boolean, color: "teal" | "blue" | "pink" | "yellow") => {
    setRoom(curr => ({ ...curr, typing, typingColor: color }));
  };

  const setServerError = () => {
    setRoom(curr => ({ ...curr, serverError: true }));
  };

  const setClientId = (clientId: string) => {
    setRoom(curr => ({ ...curr, clientId }));
  };

  const setCode = (code: string) => {
    setRoom(curr => ({ ...curr, code }));
  };

  const setClients = (clients: Client[]) => {
    setRoom(curr => ({ ...curr, clients }));
  };

  const pushMessage = (message: Message) => {
    setRoom(curr => ({ ...curr, messages: [...curr.messages, message] }));
  };

  const toggleClientChatDisabled = (clientId: string, disabled: boolean) => {
    console.log("toggleClientChatDisabled");
    console.log(room.clients);

    // setRoom(curr => ({
    //   ...curr,
    //   clients: room.clients.map(client => (client.id === clientId ? { ...client, chatDisabled: disabled } : client)),
    // }));
  };

  const value: RoomContextInterface = {
    socket,
    room,
    setWaitingForResponse,
    setTyping,
    setSocket,
    setServerError,
    setClientId,
    setCode,
    setClients,
    pushMessage,
    toggleClientChatDisabled,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
