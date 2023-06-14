import { Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";

function RoomIsFullMessage() {
  return (
    <SystemMessage>
      <Text>Room is full! Try again later.</Text>
    </SystemMessage>
  );
}

export default RoomIsFullMessage;
