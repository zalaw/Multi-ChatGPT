import React, { useState, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";
import { io } from "socket.io-client";
import { Routes, Route, useLocation } from "react-router-dom";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import { useRoom } from "./contexts/RoomContext";
import { Client } from "./interfaces/Client";
import "highlight.js/styles/github-dark.css";

function App() {
  const location = useLocation();
  const roomCode = location.pathname.split("/").pop();

  const {
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
  } = useRoom();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    setSocket(socket);

    socket.on("error", error => {
      console.log("generic error");
    });

    socket.on("connect_error", error => {
      console.log("error!!!!");
      setServerError();
      setLoading(false);
    });

    if (roomCode) {
      socket.emit("JOIN_ROOM", roomCode, ({ typing, typingColor }: any) => {
        setTyping(typing, typingColor);
        setClientId(socket.id);
        setLoading(false);
      });
    } else {
      socket.emit("CREATE_ROOM", null, ({ roomCode, clients }: { roomCode: string; clients: Client[] }) => {
        setClientId(socket.id);
        setCode(roomCode);
        setClients(clients);
        setLoading(false);
      });
    }

    socket.on("CLIENT_JOINED", ({ clients, message }) => {
      setClients(clients);
      pushMessage(message);
    });

    socket.on("CLIENT_LEFT", ({ clients, message }) => {
      setClients(clients);
      pushMessage(message);
    });

    socket.on("HOST_LEFT", ({ clients, message }) => {
      setClients(clients);
      pushMessage(message);
    });

    socket.on("CLIENT_TYPING", color => {
      setTyping(true, color);
    });

    socket.on("CLIENT_STOPPED_TYPING", () => {
      setTyping(false, "teal");
    });

    socket.on("MESSAGE", message => {
      if (message.role === "client") {
        setWaitingForResponse(true);
      } else {
        setWaitingForResponse(false);
      }

      pushMessage(message);
      setTyping(false, "teal");
    });

    socket.on("TOGGLE_CHAT_DISABLED", ({ clients }) => {
      console.log(clients);
      setClients(clients);
    });

    socket.on("CLIENT_KICKED", ({ clientId, clients, color }) => {
      if (clientId === socket.id) {
        // setClientId("");
        pushMessage({ code: "CLIENT_KICKED", role: "system", color, clientId, content: "You got kicked!" });
        socket.disconnect();
        // setClients(room.clients);
      } else {
        pushMessage({ code: "CLIENT_KICKED", role: "system", color, clientId });
        setClients(clients);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return loading ? (
    <LoadingOverlay visible={true} />
  ) : (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/:roomCode" element={<Main />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
