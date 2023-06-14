import { Box, Container, Divider, Flex } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box p={32} style={{ backgroundColor: "#444654" }}>
        <Container size={"sm"}>
          <Flex gap={25}>
            <IconSettings size={30} />

            <Box w={"100%"}>{children}</Box>
          </Flex>
        </Container>
      </Box>
      <Divider />
    </>
  );
}

export default SystemMessage;
