import { Flex } from "@mantine/core";
import Clients from "../components/Clients";
import MessagesList from "../components/MessagesList";
import FixedInput from "../components/FixedInput";

function Main() {
  return (
    <Flex h={"100%"} direction="column">
      <Clients />
      <MessagesList />
      <FixedInput />
    </Flex>
  );
}

export default Main;
