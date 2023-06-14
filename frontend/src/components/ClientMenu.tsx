import { useState } from "react";
import { Menu, ActionIcon, Flex, Checkbox, Group } from "@mantine/core";
import { IconX, IconMessageOff, IconUser } from "@tabler/icons-react";
import { useRoom } from "../contexts/RoomContext";

function ClientMenu({ client }: { client: any }) {
  const { socket } = useRoom();

  const [chatDisabled, setChatDisabled] = useState(client.chatDisabled);

  const handleToggleDisableChat = (e: React.MouseEvent) => {
    setChatDisabled(!chatDisabled);
    socket?.emit("TOGGLE_CHAT_DISABLED", client.id);
  };

  const handleKick = (e: React.MouseEvent) => {
    socket?.emit("KICK_CLIENT", client.id);
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          size={40}
          radius="xl"
          variant={client.id === "" ? "subtle" : "filled"}
          color={client.id === "" ? "gray" : client.color}
        >
          <IconUser size="1.5rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item closeMenuOnClick={false} icon={<IconMessageOff size={14} />} onClick={handleToggleDisableChat}>
          <Flex justify={"space-between"} align={"center"}>
            Disable chat
            <Checkbox
              checked={chatDisabled}
              onChange={e => setChatDisabled(e.currentTarget.checked)}
              labelPosition="left"
              value="disable"
            />
          </Flex>
        </Menu.Item>

        <Menu.Item icon={<IconX size={14} />} color="red" onClick={handleKick}>
          Kick client
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ClientMenu;
