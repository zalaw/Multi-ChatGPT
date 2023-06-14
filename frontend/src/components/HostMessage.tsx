import { Button, CopyButton, Flex, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import SystemMessage from "./SystemMessage";
import { useRoom } from "../contexts/RoomContext";

function HostMessage() {
  const { room } = useRoom();

  return (
    <SystemMessage>
      <Stack>
        <Text>Hello and welcome to Multi ChatGPT!</Text>
        <Text>
          In order to use this app, at least two clients must be connected to the same room. Here's the link to your
          room:
        </Text>

        <Flex gap={10} justify={"center"} align={"flex-end"}>
          <TextInput
            value={`${new URL(window.location.href).origin}/${room.code}`}
            readOnly
            w="100%"
            placeholder="Room code"
          />

          <CopyButton value={`${new URL(window.location.href).origin}/${room.code}`} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                <Button w={80} onClick={copy} color={copied ? "blue" : ""}>
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </Button>
              </Tooltip>
            )}
          </CopyButton>
        </Flex>
      </Stack>
    </SystemMessage>
  );
}

export default HostMessage;
