import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import { Button, TextField, Typography } from "@mui/material";
import { Socket as UDPSocket, createSocket } from "dgram";
import { Server as TCPServer, createServer } from "net";
import { ComponentProps, useState } from "react";
import { validatePort } from "../utils/validate-port";

type SocketClass = UDPSocket | TCPServer;
type SocketType = "UDP" | "TCP server";

type Props<T extends SocketType> = {
  socketType: T;
  acceptEmptyPort: boolean;
  onBound: (socket: T extends "UDP" ? UDPSocket : TCPServer) => void;
  onUnbound: () => void;
};

function create(socketType: "UDP"): UDPSocket;
function create(socketType: "TCP server"): TCPServer;
function create<T extends SocketType>(
  socketType: T
): T extends "UDP" ? UDPSocket : TCPServer;
function create(socketType: SocketType): UDPSocket | TCPServer {
  return socketType === "UDP" ? createSocket("udp4") : createServer();
}

function bind(socket: SocketClass, port?: number) {
  if (socket instanceof UDPSocket) {
    socket.bind(port);
  } else {
    socket.listen(port);
  }
}

export function PortBindForm<T extends SocketType>({
  socketType,
  acceptEmptyPort,
  onBound,
  onUnbound,
  style = {},
}: Props<T> & ComponentProps<"form">) {
  const [port, setPort] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<SocketClass | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (socket !== null) {
      try {
        socket.close();
      } catch (err) {
        console.error(err);
      }
      setSocket(null);
      onUnbound();
      return;
    }

    const error = validatePort(port, { acceptEmpty: acceptEmptyPort });

    if (error !== null) {
      setError(error);
      return;
    }

    setError(null);
    createAndBindSocket(port.trim());
  };

  function createAndBindSocket(port: string) {
    const newSocket = create(socketType);

    if (port !== "") {
      bind(newSocket, Number(port));
    } else {
      bind(newSocket);
    }

    const onListening = () => {
      newSocket.removeListener("listening", onListening);
      newSocket.removeListener("error", onError);
      setSocket(newSocket);
      // @ts-expect-error because the typing for the return of address()
      // is string | AddressInfo | null, but we assume it is AddressInfo
      setPort(newSocket.address().port.toString());
      onBound(newSocket);
    };

    const onError = (err: any) => {
      newSocket.removeListener("listening", onListening);
      newSocket.removeListener("error", onError);
      setError(`Erro na vinculação. Erro original: ${err}`);
    };

    newSocket.addListener("listening", onListening);
    newSocket.addListener("error", onError);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "flex-end", ...style }}
      >
        {socket === null ? (
          <TextField
            label="Porta (opcional)"
            value={port}
            onChange={handleInputChange}
            error={error !== null}
            helperText={error}
            placeholder="e.g. 8080"
            variant="standard"
            sx={{ mr: 2, width: "200px" }}
          />
        ) : (
          <Typography variant="body1" sx={{ mt: 2, width: "200px" }}>
            Porta {port} vinculada
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          endIcon={socket === null ? <PowerIcon /> : <PowerOffIcon />}
          color={socket === null ? "primary" : "secondary"}
          sx={{ mt: 1, alignSelf: "flex-start" }}
        >
          {socket === null ? "Vincular" : "Desvincular"}
        </Button>
      </form>
    </>
  );
}
