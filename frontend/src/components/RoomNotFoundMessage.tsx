import { Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";

function RoomNotFoundMessage() {
  return (
    <SystemMessage>
      <Text>Ow snap! Room not found!</Text>
    </SystemMessage>
  );
}

export default RoomNotFoundMessage;
