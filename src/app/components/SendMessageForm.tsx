import { Button, TextField } from "@mui/material";
import { ComponentProps, useState } from "react";
import { validatePort } from "../utils/validate-port";
import { validateHostname } from "../utils/validate-host";
import { validateMessage } from "../utils/validate-message";
import { dnsResolve } from "../utils/dns-resolve";

type Props = {
  onSubmit: (host: string, ip: string, port: string, message: string) => void;
};

export function SendMessageForm({
  onSubmit,
  style = {},
}: Props & Omit<ComponentProps<"div">, "onSubmit">) {
  const [hostError, setHostError] = useState<null | string>(null);
  const [portError, setPortError] = useState<null | string>(null);
  const [messageError, setMessageError] = useState<null | string>(null);
  const [message, setMessage] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const portError = validatePort(port, {
      acceptEmpty: false,
      allowPrivileged: true,
    });
    setPortError(portError);

    const hostError = validateHostname(host);
    setHostError(hostError);

    const messageError = validateMessage(message);
    setMessageError(messageError);

    if (portError || hostError || messageError) {
      return;
    }

    try {
      const ip = await dnsResolve(host);
      onSubmit(host, ip, port, message);
      setMessage("");
    } catch (err) {
      setHostError("DNS falhou. Erro original: " + err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        ...style,
      }}
    >
      <div>
        <TextField
          label="Host"
          placeholder="e.g. 172.24.23.100"
          value={host}
          onChange={(e) => setHost(e.target.value.trim())}
          error={hostError !== null}
          helperText={hostError}
          margin="normal"
          sx={{ mr: 1 }}
        />
        <TextField
          label="Porta"
          placeholder="e.g. 8080"
          value={port}
          onChange={(e) => setPort(e.target.value.trim())}
          error={portError !== null}
          helperText={portError}
          margin="normal"
        />
      </div>
      <TextField
        label="Mensagem"
        multiline
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        error={messageError !== null}
        helperText={messageError}
        margin="normal"
        style={{ width: "400px" }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 1, alignSelf: "flex-start" }}
      >
        Enviar
      </Button>
    </form>
  );
}
