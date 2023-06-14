import React, { useRef, useState } from "react";
import { Box, Textarea, ActionIcon, Text, Flex, Container } from "@mantine/core";
import { IconSend, IconUser } from "@tabler/icons-react";
import { useRoom } from "../contexts/RoomContext";

function FixedInput() {
  const { socket, room } = useRoom();

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDisabled =
    room.clients.filter(client => client.id !== "").length < 2 ||
    room.clients[0].id === "" ||
    !socket?.active ||
    room.typing ||
    room.waitingForResponse;

  const chatDisabledByHost = room.clients.find(client => client.id === socket?.id)?.chatDisabled;

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit("CLIENT_TYPING", { color: room.clients.find(client => client.id === socket.id)?.color });
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      socket?.emit("CLIENT_STOPPED_TYPING");
      setIsTyping(false);
    }, 3000);
  };

  const handleSendMessage = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    sendMessage();
    e.preventDefault();
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket?.emit("SEND_MESSAGE", message);
    setMessage("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsTyping(false);
  };

  return (
    <Box p={40}>
      <Container size="sm">
        {room.typing && (
          <Flex pb={10} gap={10} align={"center"}>
            <ActionIcon color={room.typingColor} radius="xl" variant="filled" size={30}>
              <IconUser size="1.25rem" />
            </ActionIcon>
            <Text fs="italic" size={"xs"}>
              is typing...
            </Text>
          </Flex>
        )}

        <Textarea
          disabled={isDisabled || room.typing || chatDisabledByHost}
          value={message}
          onChange={e => {
            setMessage(e.target.value);
            handleTyping();
          }}
          description={`${message.length} / 1000`}
          radius={"md"}
          size="md"
          placeholder={"Send a message."}
          mx="auto"
          minRows={1}
          maxRows={8}
          autosize
          onKeyDown={handleSendMessage}
          maxLength={1000}
          rightSection={
            <ActionIcon
              size={30}
              disabled={message === "" || isDisabled || chatDisabledByHost}
              color="teal"
              variant="filled"
              style={{ position: "absolute", right: 8, bottom: 8 }}
              onClick={sendMessage}
            >
              <IconSend size={20} />
            </ActionIcon>
          }
          error={chatDisabledByHost && "Chat disabled by host"}
        />
      </Container>
    </Box>
  );
}

export default FixedInput;
