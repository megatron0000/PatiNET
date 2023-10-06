import { Button, TextField, Typography } from "@mui/material";
import { Socket, createSocket } from "dgram";
import { ComponentProps, useState } from "react";
import { validatePort } from "../utils/validate-port";

type Props = {
  acceptEmptyPort: boolean;
  onBound: (socket: Socket) => void;
  onUnbound: () => void;
};

export function PortBindForm({
  acceptEmptyPort,
  onBound,
  onUnbound,
  style = {},
}: Props & ComponentProps<"form">) {
  const [port, setPort] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (socket !== null) {
      socket.close();
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
    const newSocket = createSocket("udp4");

    if (port !== "") {
      newSocket.bind(Number(port));
    } else {
      newSocket.bind();
    }

    const onListening = () => {
      newSocket.removeListener("listening", onListening);
      newSocket.removeListener("error", onError);
      setSocket(newSocket);
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
          color="primary"
          sx={{ mt: 1, alignSelf: "flex-start" }}
        >
          {socket === null ? "Vincular" : "Desvincular"}
        </Button>
      </form>
    </>
  );
}
