import { useEffect, useRef } from "react";
import HostMessage from "./HostMessage";
import ClientJoinedMessage from "./ClientJoinedMessage";
import Message from "./Message";
import HostLeftMessage from "./HostLeftMessage";
import ClientLeftMessage from "./ClientLeftMessage";
import { useRoom } from "../contexts/RoomContext";
import RoomNotJoinableMessage from "./RoomNotJoinableMessage";
import ServerErrorMessage from "./ServerErrorMessage";
import WaitingForResponseMessage from "./WaitingForResponseMessage";
import ClientKickedMessage from "./ClientKickedMessage";
import OpenAIErrorMessage from "./OpenAIErrorMessage";

function MessagesList() {
  const { socket, room } = useRoom();
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [room.messages]);

  return (
    <div style={{ flex: "1 1 auto", overflow: "auto" }} ref={messagesRef}>
      {room.serverError ? (
        <ServerErrorMessage />
      ) : room.clients.length === 0 ? (
        <RoomNotJoinableMessage />
      ) : (
        <>
          {room.clients[0].id === room.clientId && <HostMessage />}

          {room.messages.map((message, index) => {
            if (message.code === "CLIENT_JOINED") {
              return <ClientJoinedMessage key={index} color={message.color} />;
            } else if (message.code === "HOST_LEFT") {
              return <HostLeftMessage key={index} />;
            } else if (message.code === "CLIENT_LEFT") {
              return <ClientLeftMessage key={index} color={message.color} />;
            } else if (message.code === "CLIENT_KICKED") {
              return <ClientKickedMessage key={index} message={message} />;
            } else if (message.code === "OPENAI_ERROR") {
              return <OpenAIErrorMessage message={message} />;
            }

            return <Message key={index} message={message} />;
          })}

          {room.waitingForResponse && socket?.active && <WaitingForResponseMessage />}
        </>
      )}
    </div>
  );
}

export default MessagesList;
