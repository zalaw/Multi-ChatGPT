export interface CodeContent {
  language: string;
  content: string;
}

export interface TextContent {
  fontWeight: number;
  content: string;
}

export interface SnippetItem {
  type: "text" | "code";
  data: TextContent[] | CodeContent;
}

export interface Message {
  code?: "CLIENT_JOINED" | "CLIENT_LEFT" | "HOST_LEFT" | "CLIENT_KICKED" | "OPENAI_ERROR";
  role: "system" | "assistant" | "client";
  clientId: string | null;
  content?: SnippetItem[] | string;
  color: "teal" | "blue" | "pink" | "yellow";
}
