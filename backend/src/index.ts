import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import crypto from "crypto";
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import path from "path";

config();

interface CodeContent {
  language: string;
  content: string;
}

interface TextContent {
  fontWeight: number;
  content: string;
}

interface SnippetItem {
  type: "text" | "code";
  data: TextContent[] | CodeContent;
}

interface Message {
  code?: "CLIENT_JOINED" | "CLIENT_LEFT" | "HOST_LEFT" | "CLIENT_KICKED" | "OPENAI_ERROR";
  role: "system" | "assistant" | "client";
  clientId: string | null;
  content?: SnippetItem[] | string;
  color: "teal" | "blue" | "pink" | "yellow";
  raw: string;
}

interface Client {
  id: string;
  color: "teal" | "blue" | "pink" | "yellow";
  chatDisabled: boolean;
}

interface Room {
  waitingForResponse: boolean;
  typing: boolean;
  typingColor: "teal" | "blue" | "pink" | "yellow";
  messages: Message[];
  clients: Client[];
}

const app = express();
const PORT = process.env.PORT || 3001;

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

app.use(cors());
app.use(express.json());

const server = createServer(app);
const rooms = new Map<string, Room>();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", socket => {
  socket.on("CREATE_ROOM", (args, callback) => {
    const roomCode = crypto.randomUUID();

    const roomData: Room = {
      waitingForResponse: false,
      typing: false,
      typingColor: "teal",
      messages: [],
      clients: [
        {
          id: socket.id,
          color: "teal",
          chatDisabled: false,
        },
        {
          id: "",
          color: "blue",
          chatDisabled: false,
        },
        {
          id: "",
          color: "pink",
          chatDisabled: false,
        },
        {
          id: "",
          color: "yellow",
          chatDisabled: false,
        },
      ],
    };

    rooms.set(roomCode, roomData);

    socket.join(roomCode);

    callback({ roomCode, clients: roomData.clients });
  });

  socket.on("JOIN_ROOM", (roomCode, callback) => {
    if (!rooms.get(roomCode)) return callback({ errorCode: "ROOM_NOT_FOUND" });

    const room = rooms.get(roomCode)!;

    if (room.clients.find(client => client.id === socket.id)) return;
    if (room.clients.every(client => client.id !== "")) return callback({ typing: false, typingColor: "" });
    if (room.clients[0].id === "") return callback({ typing: false, typingColor: "" });

    const firstEmptySpotIndex = room.clients.findIndex(client => client.id === "");

    room.clients[firstEmptySpotIndex].id = socket.id;

    socket.join(roomCode);

    io.to(roomCode).emit("CLIENT_JOINED", {
      clients: room.clients,
      message: {
        code: "CLIENT_JOINED",
        role: "system",
        clientId: socket.id,
        color: room.clients[firstEmptySpotIndex].color,
      },
    });

    callback({ typing: room.typing, typingColor: room.typingColor });
  });

  socket.on("CLIENT_TYPING", ({ color }) => {
    const [_, roomCode] = Array.from(socket.rooms.values());

    const room = rooms.get(roomCode);
    if (!room) return;

    room.typing = true;
    room.typingColor = color;

    socket.broadcast.to(roomCode).emit("CLIENT_TYPING", room.typingColor);
  });

  socket.on("CLIENT_STOPPED_TYPING", () => {
    const [_, roomCode] = Array.from(socket.rooms.values());

    const room = rooms.get(roomCode);
    if (!room) return;

    room.typing = false;
    room.typingColor = "teal";

    socket.broadcast.to(roomCode).emit("CLIENT_STOPPED_TYPING");
  });

  socket.on("SEND_MESSAGE", async message => {
    if (message.length > 1000) return;

    const [_, roomCode] = Array.from(socket.rooms.values());

    const room = rooms.get(roomCode);

    if (!room) return;

    const messageToAdd: Message = {
      role: "client",
      clientId: socket.id,
      content: message,
      color: room!.clients.find(client => client.id === socket.id)!.color,
      raw: message,
    };

    room.typing = false;
    room.typingColor = "teal";
    room.messages.push(messageToAdd);

    io.to(roomCode).emit("MESSAGE", messageToAdd);

    try {
      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "If you are going to provide code examples please put them inside ``{code}`` double backticks and also specify the programming language.",
          },
          ...room.messages.map(message => ({
            role: message.role === "client" ? "user" : ("assistant" as ChatCompletionRequestMessageRoleEnum),
            content: message.raw,
          })),
          {
            role: "user",
            content: message,
          },
        ],
      });

      console.log(res.data, "\n\n");

      const messageFromOpenAI = res.data.choices[0]?.message?.content
        .split(/```([^`]+?)```/g)
        .map((part: string, index: number) => {
          if (index % 2 === 0) {
            const snippetItem: SnippetItem = {
              type: "text",
              data: part.split(/`([^`]+?)`/g).map<TextContent>((textPart: string, index2: number) => ({
                fontWeight: index2 % 2 === 0 ? 400 : 700,
                content: textPart,
              })),
            };

            return snippetItem;
          } else {
            const snippetItem: SnippetItem = {
              type: "code",
              data: {
                language: part.split("\n")[0] || "",
                content: part,
              },
            };

            return snippetItem;
          }
        });

      console.log("messageFromOpenAI", messageFromOpenAI);

      const messageToAdd: Message = {
        role: "assistant",
        clientId: "",
        content: messageFromOpenAI,
        color: "teal",
        raw: res.data.choices[0]?.message?.content || "",
      };

      room.messages.push(messageToAdd);

      io.to(roomCode).emit("MESSAGE", { role: "assistant", content: messageFromOpenAI });
    } catch (err) {
      console.log("openai error");
      console.log(err);
      io.to(roomCode).emit("MESSAGE", { code: "OPENAI_ERROR", role: "system", content: "" });
    }
  });

  socket.on("TOGGLE_CHAT_DISABLED", clientId => {
    console.log("TOGGLE_CHAT_DISABLED on SERVER");

    const [_, roomCode] = Array.from(socket.rooms.values());

    const room = rooms.get(roomCode);

    if (!room) return;

    const client = room.clients.find(client => client.id === clientId);

    if (!client) return;

    client.chatDisabled = !client.chatDisabled;

    io.to(roomCode).emit("TOGGLE_CHAT_DISABLED", { clients: room.clients });
  });

  socket.on("KICK_CLIENT", clientId => {
    const [_, roomCode] = Array.from(socket.rooms.values());

    const room = rooms.get(roomCode);

    if (!room) return;

    const client = room.clients.find(client => client.id === clientId);

    if (!client) return;

    client.id = "";
    client.chatDisabled = false;

    io.to(roomCode).emit("CLIENT_KICKED", { clientId, clients: room.clients, color: client.color });

    const s = io.sockets.sockets.get(clientId);
    s?.leave(roomCode);
  });

  socket.on("disconnecting", () => {
    const [_, roomCode] = Array.from(socket.rooms.values());

    const room = rooms.get(roomCode);

    if (!room) return;

    if (room.clients[0].id === socket.id) {
      room.clients[0].id = "";

      io.to(roomCode).emit("HOST_LEFT", {
        clients: room.clients,
        message: { code: "HOST_LEFT", role: "system", clientId: socket.id, color: room.clients[0].color },
      });
    } else {
      const clientSpotIndex = room.clients.findIndex(client => client.id === socket.id);

      if (clientSpotIndex === -1) return;

      room.clients[clientSpotIndex].id = "";
      room.clients[clientSpotIndex].chatDisabled = false;

      io.to(roomCode).emit("CLIENT_LEFT", {
        clients: room.clients,
        message: {
          code: "CLIENT_LEFT",
          role: "system",
          clientId: socket.id,
          color: room.clients[clientSpotIndex].color,
        },
      });
    }

    if (room.clients.every(client => client.id === "")) {
      console.log("room", roomCode, "deleted");
      rooms.delete(roomCode);
      console.log("rooms remaining", rooms.entries());
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  });
}

server.listen(PORT, () => {
  rooms.clear();
  console.log(`Server running at http://localhost:${PORT}`);
});
