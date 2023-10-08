import { Box, Container, Typography, useTheme } from "@mui/material";
import { Socket } from "dgram";
import { useEffect, useState } from "react";
import { AddRemoteForm } from "../components/AddRemoteForm";
import { HostCard } from "../components/HostCard";
import { PortBindForm } from "../components/PortBindForm";

interface Remote {
  ip: string;
  port: string;
  hostname?: string;
  inboundData: string;
  outboundData: string;
}

export function UDP() {
  const theme = useTheme();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [remotes, setRemotes] = useState<Remote[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message, { address, port }) => {
      setRemotes((prev) => {
        const newRemotes = [...prev];
        const remoteIndex = newRemotes.findIndex(
          (remote) => remote.ip === address && remote.port === port.toString()
        );
        if (remoteIndex === -1) {
          newRemotes.unshift({
            ip: address,
            port: port.toString(),
            inboundData: message.toString(),
            outboundData: "",
          });
        } else {
          newRemotes[remoteIndex].inboundData += message.toString();
        }
        return newRemotes;
      });
    });
  }, [socket]);

  function handleMessageSubmit(remote: Remote, message: string) {
    if (!socket) return;

    socket.send(message, Number(remote.port), remote.ip);

    setRemotes((prev) => {
      const newRemotes = [...prev];
      remote.outboundData += message;
      return newRemotes;
    });
  }

  function handleAddRemote(
    hostname: string | undefined,
    ip: string,
    port: string
  ) {
    if (remotes.find((remote) => remote.ip === ip && remote.port === port)) {
      return;
    }

    setRemotes((prev) => {
      return [
        {
          ip,
          port,
          ...(hostname !== undefined ? { hostname } : {}),
          inboundData: "",
          outboundData: "",
        },
        ...prev,
      ];
    });
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Vincular porta</Typography>
      <PortBindForm
        socketType="UDP"
        acceptEmptyPort={true}
        onBound={(socket) => {
          setSocket(socket);
          setRemotes([]);
        }}
        onUnbound={() => {
          setSocket(null);
          setRemotes([]);
        }}
        style={{ marginBottom: theme.spacing(5) }}
      />

      {socket !== null && (
        <>
          <Typography variant="h6">Adicionar endereço</Typography>
          <AddRemoteForm onSubmit={handleAddRemote} />
        </>
      )}

      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {remotes.map((remote) => (
          <HostCard
            key={remote.ip + remote.port}
            address={`${remote.ip}:${remote.port} ${
              remote.hostname ? `(${remote.hostname})` : ""
            }`}
            status={null}
            inboundData={remote.inboundData}
            outboundData={remote.outboundData}
            onSubmitMessage={(message) => handleMessageSubmit(remote, message)}
            style={{ marginBottom: theme.spacing(2) }}
          />
        ))}
      </Container>
    </Box>
  );
}
