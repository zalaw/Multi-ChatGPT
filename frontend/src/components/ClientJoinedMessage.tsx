import { ActionIcon, Flex, Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";
import { IconUser } from "@tabler/icons-react";

function ClientJoinedMessage({ color }: { color: string }) {
  return (
    <SystemMessage>
      <Flex align={"center"} gap={10}>
        <ActionIcon size={30} radius="xl" variant={"filled"} color={color}>
          <IconUser size="1.25rem" />
        </ActionIcon>{" "}
        <Text>joined</Text>
      </Flex>
    </SystemMessage>
  );
}

export default ClientJoinedMessage;
