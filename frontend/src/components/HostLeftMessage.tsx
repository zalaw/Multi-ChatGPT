import { Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";

function HostLeftMessage() {
  return (
    <SystemMessage>
      <Text>Host left! This session is terminated.</Text>
    </SystemMessage>
  );
}

export default HostLeftMessage;
