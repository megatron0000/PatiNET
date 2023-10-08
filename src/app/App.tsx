import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useState } from "react";

import { CenteredTabs } from "./components/CenteredTabs";
import { TCPClient } from "./pages/TCPClient";
import { TCPServer } from "./pages/TCPServer";
import { UDP } from "./pages/UDP";
import { ThemeProvider, createTheme } from "@mui/material";

export function App() {
  const [selected, setSelected] = useState("UDP");

  const theme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background-color: #f0f0f0;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
            &:hover {
              background-color: #555;
            }
          }
        `,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CenteredTabs
        options={["UDP", "Servidor TCP", "Cliente TCP"]}
        selected={selected}
        onChange={setSelected}
      />
      {selected === "UDP" ? (
        <UDP />
      ) : selected === "Servidor TCP" ? (
        <TCPServer />
      ) : (
        <TCPClient />
      )}
    </ThemeProvider>
  );
}
