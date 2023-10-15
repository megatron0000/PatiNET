import { Box, Container, Typography, useTheme } from "@mui/material";
import { Server, Socket } from "net";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { HostCard } from "../components/HostCard";
import { PortBindForm } from "../components/PortBindForm";
import { bufferToPlain } from "../utils/encoding";

interface Remote {
  ip: string;
  port: string;
  socket: Socket;
  status: "disconnected" | "connected";
  inboundData: string;
  outboundData: string;
}

export function TCPServer() {
  const theme = useTheme();
  const [server, setServer] = useState<Server | null>(null);
  const [remotes, setRemotes] = useState<Remote[]>([]);
  const remotesRef = useRef<Remote[]>([]);

  remotesRef.current = remotes;

  useEffect(() => {
    if (!server) return;

    server.on("connection", (socket) => {
      const address = socket.remoteAddress!;
      const port = Number(socket.remotePort);

      const remote = handleConnect(socket, address, port.toString());

      socket.on("close", () => handleDisconnect(remote));

      socket.on("error", (err) => {
        enqueueSnackbar(err);
      });

      socket.on("data", (message) => {
        setRemotes((prev) => {
          const newRemotes = [...prev];
          remote.inboundData += bufferToPlain(message);
          return newRemotes;
        });
      });
    });

    server.on("error", (err) => {
      enqueueSnackbar(err);
    });

    return () => {
      try {
        server.close();
      } catch (err) {
        console.error(err);
      }
    };
  }, [server]);

  function handleConnect(socket: Socket, ip: string, port: string): Remote {
    const remotes = remotesRef.current;
    const remote = remotes.find((x) => x.ip === ip && x.port === port);

    if (remote) {
      remote.status = "connected";
      remote.socket = socket;
      remote.inboundData = "";
      remote.outboundData = "";
      setRemotes((prev) => [...prev]);
      return remote;
    }

    const newRemote = {
      ip,
      port,
      socket,
      status: "connected",
      inboundData: "",
      outboundData: "",
    } as const;

    setRemotes((prev) => [newRemote, ...prev]);

    return newRemote;
  }

  function handleDisconnect(remote: Remote) {
    setRemotes((prev) => {
      const newRemotes = [...prev];
      remote.socket.destroy();
      remote.status = "disconnected";
      return newRemotes;
    });
  }

  function handleMessageSubmit(remote: Remote, message: string) {
    remote.socket.write(message);

    setRemotes((prev) => {
      const newRemotes = [...prev];
      remote.outboundData += message;
      return newRemotes;
    });
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Vincular porta</Typography>
      <PortBindForm
        socketType="TCP server"
        acceptEmptyPort={true}
        onBound={(server) => {
          setServer(server);
          setRemotes([]);
        }}
        onUnbound={() => {
          setServer(null);
          setRemotes([]);
        }}
        style={{ marginBottom: theme.spacing(5) }}
      />

      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {remotes.map((remote) => (
          <HostCard
            key={remote.ip + remote.port}
            localAddress={`127.0.0.1:${remote.socket.localPort || "?"}`}
            remoteAddress={`${remote.ip}:${remote.port}`}
            status={remote.status}
            inboundData={remote.inboundData}
            outboundData={remote.outboundData}
            onSubmitMessage={(message) => handleMessageSubmit(remote, message)}
            onClickDisconnect={() => handleDisconnect(remote)}
            style={{ marginBottom: theme.spacing(2) }}
          />
        ))}
      </Container>
    </Box>
  );
}
