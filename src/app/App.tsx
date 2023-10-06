import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useState } from "react";

import { CenteredTabs } from "./components/CenteredTabs";
import { TCPClient } from "./pages/TCPClient";
import { TCPServer } from "./pages/TCPServer";
import { UDP } from "./pages/UDP";

export function App() {
  const [selected, setSelected] = useState("UDP");

  return (
    <Fragment>
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
    </Fragment>
  );
}
