import { Text } from "@mantine/core";
import SystemMessage from "./SystemMessage";
import { Message } from "../interfaces/Message";

function OpenAIErrorMessage({ message }: { message: Message }) {
  return (
    <SystemMessage>
      <Text>{(message.content as string) || "OpenAI error"}</Text>
    </SystemMessage>
  );
}

export default OpenAIErrorMessage;
