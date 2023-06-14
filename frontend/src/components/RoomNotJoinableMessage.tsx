import { Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";

function RoomNotJoinableMessage() {
  return (
    <SystemMessage>
      <Text>Room does not exist or is full. Try again later.</Text>
    </SystemMessage>
  );
}

export default RoomNotJoinableMessage;
