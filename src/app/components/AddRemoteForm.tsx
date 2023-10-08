import { Button, TextField } from "@mui/material";
import { ComponentProps, useState } from "react";
import { dnsResolve } from "../utils/dns-resolve";
import { validateHostname } from "../utils/validate-host";
import { validatePort } from "../utils/validate-port";

type Props = {
  askLocalPort?: boolean;
  /**
   * @param localPort - only present if `askLocalPort` is true
   * @returns
   */
  onSubmit: (
    hostname: string | undefined,
    ip: string,
    port: string,
    localPort?: string
  ) => void;
};

export function AddRemoteForm({
  askLocalPort,
  onSubmit,
  style = {},
}: Props & Omit<ComponentProps<"form">, "onSubmit">) {
  const [localPortError, setLocalPortError] = useState<null | string>(null);
  const [hostError, setHostError] = useState<null | string>(null);
  const [portError, setPortError] = useState<null | string>(null);
  const [localPort, setLocalPort] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const localPortError = askLocalPort
      ? validatePort(localPort, { acceptEmpty: true, allowPrivileged: false })
      : null;
    setLocalPortError(localPortError);

    const portError = validatePort(port, {
      acceptEmpty: false,
      allowPrivileged: true,
    });
    setPortError(portError);

    const hostError = validateHostname(host);
    setHostError(hostError);

    if (localPortError || portError || hostError) {
      return;
    }

    try {
      const ip = await dnsResolve(host);
      onSubmit(
        host !== ip ? host : undefined,
        ip,
        port,
        askLocalPort ? localPort : undefined
      );
      setHost("");
      setPort("");
    } catch (err) {
      setHostError("DNS falhou. Erro original: " + err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        ...style,
      }}
    >
      <TextField
        label="Porta local (opcional)"
        placeholder="e.g. 8080"
        value={port}
        onChange={(e) => setLocalPort(e.target.value.trim())}
        error={localPortError !== null}
        helperText={localPortError}
        margin="none"
        size="small"
        sx={{ mr: 1, ...(askLocalPort ? {} : { display: "none" }) }}
      />
      <TextField
        label="Host"
        placeholder="e.g. 172.24.23.100"
        value={host}
        onChange={(e) => setHost(e.target.value.trim())}
        error={hostError !== null}
        helperText={hostError}
        margin="none"
        size="small"
        sx={{ mr: 1 }}
      />
      <TextField
        label="Porta"
        placeholder="e.g. 8080"
        value={port}
        onChange={(e) => setPort(e.target.value.trim())}
        error={portError !== null}
        helperText={portError}
        margin="none"
        size="small"
        sx={{ mr: 1 }}
      />

      <Button type="submit" variant="contained" color="primary">
        Adicionar
      </Button>
    </form>
  );
}
