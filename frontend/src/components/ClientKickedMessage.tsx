import { ActionIcon, Flex, Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";
import { IconUser } from "@tabler/icons-react";
import { Message } from "../interfaces/Message";

function ClientKickedMessage({ message }: { message: Message }) {
  return (
    <SystemMessage>
      <Flex align={"center"} gap={10}>
        <ActionIcon size={30} radius="xl" variant={"filled"} color={message.color}>
          <IconUser size="1.25rem" />
        </ActionIcon>{" "}
        <Text>{(message.content as string) || "kicked 😮"}</Text>
      </Flex>
    </SystemMessage>
  );
}

export default ClientKickedMessage;
