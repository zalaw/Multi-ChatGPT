import { Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";

function ServerErrorMessage() {
  return (
    <SystemMessage>
      <Text>Server is not responding! Big 💩</Text>
    </SystemMessage>
  );
}

export default ServerErrorMessage;
