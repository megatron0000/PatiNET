import { Box, Typography, useTheme } from "@mui/material";
import { Socket } from "dgram";
import { useEffect, useState } from "react";
import { MessageTable } from "../components/MessageTable";
import { PortBindForm } from "../components/PortBindForm";
import { SendMessageForm } from "../components/SendMessageForm";

export function UDP() {
  const theme = useTheme();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [receivedPackets, setReceivedPackets] = useState<ReceivedPacket[]>([]);
  const [sentPackets, setSentPackets] = useState<SentPacket[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message, sender) => {
      setReceivedPackets((prev) => [
        ...prev,
        {
          sender: sender.address + ":" + sender.port,
          message: message.toString(),
        },
      ]);
    });
  }, [socket]);

  function handleMessageSubmit(
    host: string,
    ip: string,
    port: string,
    message: string
  ) {
    if (!socket) return;

    socket.send(message, Number(port), ip);

    setSentPackets((prev) => [
      ...prev,
      {
        host,
        ip,
        port,
        message,
      },
    ]);
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Vincular porta</Typography>
      <PortBindForm
        acceptEmptyPort={true}
        onBound={(socket) => setSocket(socket)}
        onUnbound={() => setSocket(null)}
        style={{ marginBottom: theme.spacing(5) }}
      />

      {socket !== null && (
        <>
          <Typography variant="h6">Enviar mensagem</Typography>
          <SendMessageForm
            onSubmit={handleMessageSubmit}
            style={{ marginBottom: theme.spacing(5) }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Box sx={{ width: "45%" }}>
              <Typography variant="h6">Mensagens recebidas</Typography>
              <MessageTable
                addressLabel="Remetente"
                messages={receivedPackets.map(({ message, sender }) => ({
                  message,
                  address: sender,
                }))}
              />
            </Box>
            <Box sx={{ width: "45%" }}>
              <Typography variant="h6">Mensagens enviadas</Typography>
              <MessageTable
                addressLabel="Destinatário"
                messages={sentPackets.map(({ host, ip, port, message }) => ({
                  message,
                  address: `${ip}:${port} ${host !== ip ? `(${host})` : ""}`,
                }))}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

interface ReceivedPacket {
  sender: string;
  message: string;
}

interface SentPacket {
  host: string;
  ip: string;
  port: string;
  message: string;
}
