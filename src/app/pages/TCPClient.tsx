import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { AddressInfo, Socket, createConnection } from "net";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { AddRemoteFormCard } from "../components/AddRemoteFormCard";
import { HostCard } from "../components/HostCard";

interface Remote {
  ip: string;
  port: string;
  hostname?: string;
  localPort: string;
  socket: null | Socket;
  status: "disconnected" | "connected";
  inboundData: string;
  outboundData: string;
}

export function TCPClient() {
  const theme = useTheme();
  const [remotes, setRemotes] = useState<Remote[]>([]);
  const [isAddingRemote, setIsAddingRemote] = useState(false);

  useEffect(() => {
    return () => {
      remotes.forEach((x) => handleDisconnect(x));
    };
  }, []);

  function handleDisconnect(remote: Remote) {
    setRemotes((prev) => {
      const newRemotes = [...prev];
      remote.socket?.destroy();
      remote.status = "disconnected";
      return newRemotes;
    });
  }

  function handleAddRemote(
    hostname: string | undefined,
    ip: string,
    port: string,
    localPort?: string
  ) {
    if (localPort === undefined) {
      throw new Error("assertion error: localPort is undefined");
    }

    if (
      remotes.find(
        (x) => x.ip === ip && x.port === port && x.localPort === localPort
      )
    ) {
      return;
    }

    setRemotes((prev) => [
      {
        ip,
        port,
        localPort,
        ...(hostname !== undefined ? { hostname } : {}),
        socket: null,
        status: "disconnected",
        inboundData: "",
        outboundData: "",
      },
      ...prev,
    ]);
  }

  function handleConnect(remote: Remote) {
    const socket = createConnection({
      localPort: Number(remote.localPort),
      port: Number(remote.port),
      host: remote.ip,
    });
    remote.inboundData = "";
    remote.outboundData = "";

    socket.on("error", (err) => {
      enqueueSnackbar(err);
    });

    socket.on("connect", () => {
      setRemotes((prev) => {
        const newRemotes = [...prev];
        remote.socket = socket;
        remote.status = "connected";

        if (remote.localPort === "") {
          remote.localPort = (socket.address() as AddressInfo).port.toString();
        }

        return newRemotes;
      });
    });

    socket.on("close", () => handleDisconnect(remote));

    socket.on("data", (message) => {
      setRemotes((prev) => {
        const newRemotes = [...prev];
        newRemotes.find((remote) => remote.socket === socket)!.inboundData +=
          message.toString();
        return newRemotes;
      });
    });
  }

  function handleMessageSubmit(remote: Remote, message: string) {
    console.log(remote, message);
    if (!remote.socket) return;

    remote.socket.write(message);

    setRemotes((prev) => {
      const newRemotes = [...prev];
      remote.outboundData += message;
      return newRemotes;
    });
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* <Typography variant="h6">Adicionar endereço</Typography>
      <AddRemoteForm askLocalPort onSubmit={handleAddRemote} /> */}

      <Typography variant="h6">Endereços</Typography>

      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Box display={"flex"} justifyContent={"center"} marginBottom={4}>
          <Button onClick={() => setIsAddingRemote(true)} variant="outlined">
            Adicionar
          </Button>
        </Box>
        {isAddingRemote && (
          <AddRemoteFormCard
            askLocalPort
            onSubmit={(hostname, ip, port, localPort) => {
              setIsAddingRemote(false);
              handleAddRemote(hostname, ip, port, localPort);
            }}
            onCancel={() => setIsAddingRemote(false)}
            style={{ marginBottom: theme.spacing(2) }}
          />
        )}
        {remotes.map((remote) => (
          <HostCard
            key={remote.localPort + "=>" + remote.ip + ":" + remote.port}
            localAddress={`127.0.0.1:${remote.localPort || "?"}`}
            remoteAddress={`${remote.ip}:${remote.port} ${
              remote.hostname ? ` (${remote.hostname})` : null
            }`}
            status={remote.status}
            inboundData={remote.inboundData}
            outboundData={remote.outboundData}
            onSubmitMessage={(message) => handleMessageSubmit(remote, message)}
            onClickConnect={() => handleConnect(remote)}
            onClickDisconnect={() => handleDisconnect(remote)}
            style={{ marginBottom: theme.spacing(2) }}
          />
        ))}
      </Container>
    </Box>
  );
}
