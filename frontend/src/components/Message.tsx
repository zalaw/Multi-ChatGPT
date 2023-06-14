import {
  ActionIcon,
  Box,
  Container,
  Divider,
  Flex,
  Text,
  Code,
  TypographyStylesProvider,
  CopyButton,
  Button,
} from "@mantine/core";
import { IconBrandOpenai, IconCheck, IconClipboard, IconUser } from "@tabler/icons-react";
import hljs from "highlight.js";
import { Message as IMessage, TextContent, CodeContent } from "../interfaces/Message";

function Message({ message }: { message: IMessage }) {
  return (
    <>
      <Divider />
      <Box p={32} style={{ backgroundColor: message.role === "assistant" ? "#444654" : "initial" }}>
        <Container size={"sm"}>
          <Flex gap={25}>
            <ActionIcon
              color={message.role === "assistant" ? "" : message.color}
              radius={message.role === "assistant" ? "" : "xl"}
              variant="filled"
              size={30}
            >
              {message.role === "assistant" ? (
                <IconBrandOpenai stroke={1.25} size="1.5rem" />
              ) : (
                <IconUser size="1.25rem" />
              )}
            </ActionIcon>

            <Box>
              {typeof message.content === "string" ? (
                <Text style={{ whiteSpace: "pre-wrap" }}>{message.content}</Text>
              ) : (
                message.content?.map((entry, index) => {
                  if (entry.type === "text") {
                    return (entry.data as TextContent[]).map((piece, index2) => (
                      <Text
                        key={`${index}-${index2}-text`}
                        style={{ whiteSpace: "pre-wrap" }}
                        span
                        fw={piece.fontWeight}
                        color={piece.fontWeight === 700 ? "white" : ""}
                      >
                        {piece.fontWeight === 700 ? `\`${piece.content}\`` : piece.content}
                      </Text>
                    ));
                  }

                  return (
                    <Code block key={`${index}-code`}>
                      <CopyButton value={(entry.data as CodeContent).content.trim()}>
                        {({ copied, copy }) => (
                          <Button
                            size="xs"
                            leftIcon={copied ? <IconCheck size="1rem" /> : <IconClipboard size="1rem" />}
                            variant="default"
                            color={copied ? "teal" : "blue"}
                            onClick={copy}
                          >
                            {copied ? "Copied!" : "Copy code"}
                          </Button>
                        )}
                      </CopyButton>

                      <TypographyStylesProvider>
                        <div
                          style={{ whiteSpace: "pre-wrap" }}
                          dangerouslySetInnerHTML={{
                            __html:
                              (entry.data as CodeContent).language !== ""
                                ? hljs.highlight((entry.data as CodeContent).content.trim(), {
                                    language: (entry.data as CodeContent).language,
                                  }).value
                                : hljs.highlightAuto((entry.data as CodeContent).content.trim()).value,
                          }}
                        />
                      </TypographyStylesProvider>
                    </Code>
                  );
                })
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

export default Message;
