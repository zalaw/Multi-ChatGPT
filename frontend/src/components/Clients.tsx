import React from "react";
import { Box, Center, Divider, Flex, ActionIcon, Stack, Menu } from "@mantine/core";
import { IconUser, IconMessageOff } from "@tabler/icons-react";
import { useRoom } from "../contexts/RoomContext";
import ClientMenu from "./ClientMenu";

function Clients() {
  const { socket, room } = useRoom();

  const isClientHost = socket?.id === room.clients[0]?.id;

  return (
    <Center p={10}>
      <Flex gap={20} align={"flex-startt"}>
        {room.clients.map((client, index) => (
          <Stack style={{ position: "relative" }} key={client.id || index} spacing={8}>
            {client.id !== "" && index > 0 && isClientHost ? (
              <ClientMenu client={client} />
            ) : (
              <ActionIcon
                size={40}
                radius="xl"
                variant={client.id === "" ? "subtle" : "filled"}
                color={client.id === "" ? "gray" : client.color}
              >
                <IconUser size="1.5rem" />
              </ActionIcon>
            )}

            {client.chatDisabled && (
              <ActionIcon
                variant="filled"
                radius="xl"
                color="red"
                size={"sm"}
                style={{ position: "absolute", bottom: 7, right: 0, pointerEvents: "none" }}
              >
                <IconMessageOff color="white" size={14} />
              </ActionIcon>
            )}

            {room.clientId === client.id && <Divider size="md" color={client.color} />}
          </Stack>
        ))}
      </Flex>
      <Divider />
    </Center>
  );
}

export default Clients;
