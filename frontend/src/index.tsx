import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";

import { BrowserRouter } from "react-router-dom";
import { RoomProvider } from "./contexts/RoomContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        globalStyles: theme => ({
          ".mantine-Text-root": {
            lineHeight: "30px",
          },
        }),
        colorScheme: "dark",
        primaryColor: "brand",
        colors: {
          brand: [
            "#e6fcf5",
            "#c3fae8",
            "#96f2d7",
            "#63e6be",
            "#38d9a9",
            "#20c997",
            "#12b886",
            "#0ca678",
            "#099268",
            "#087f5b",
          ],
          // override dark colors to change them for all components
          dark: [
            "#d5d7e0",
            "#acaebf",
            "#8c8fa3",
            "#666980",
            "#4d4f66",
            "#34354a",
            "#40414f",
            "#353740",
            "#0c0d21",
            "#01010a",
          ],
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <BrowserRouter>
        <RoomProvider>
          <App />
        </RoomProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
