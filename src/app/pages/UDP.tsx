import { Container, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Socket } from "dgram";
import { useState } from "react";
import { PortBindForm } from "../components/PortBindForm";
import { SendMessageForm } from "../components/SendMessageForm";

export function UDP() {
  const theme = useTheme();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [receivedPackets, setReceivedPackets] = useState<ReceivedPacket[]>([]);

  return (
    <Container sx={{ p: 2 }}>
      <PortBindForm
        acceptEmptyPort={true}
        onBound={(socket) => setSocket(socket)}
        onUnbound={() => setSocket(null)}
        style={{ marginBottom: theme.spacing(10) }}
      />

      {socket !== null && (
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <DataGrid
            columns={[
              { field: "sender", headerName: "Remetente", width: 200 },
              { field: "message", headerName: "Mensagem" },
            ]}
            rows={receivedPackets}
          ></DataGrid>
          <SendMessageForm />
        </Container>
      )}
    </Container>
  );
}

interface ReceivedPacket {
  sender: string;
  message: string;
}
