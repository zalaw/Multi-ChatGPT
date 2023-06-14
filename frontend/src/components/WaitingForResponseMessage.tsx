import { ActionIcon, Box, Container, Divider, Flex, Text } from "@mantine/core";
import { IconBrandOpenai } from "@tabler/icons-react";

function WaitingForResponseMessage() {
  return (
    <>
      <Divider />
      <Box p={32} style={{ backgroundColor: "#444654" }}>
        <Container size={"sm"}>
          <Flex gap={25}>
            <ActionIcon color="" variant="filled" size={30}>
              <IconBrandOpenai stroke={1.25} size="1.5rem" />
            </ActionIcon>

            <Box>
              <div className="loading"></div>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

export default WaitingForResponseMessage;
