import ComputerIcon from "@mui/icons-material/Computer";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  useTheme,
} from "@mui/material";
import { ComponentProps, useState } from "react";
import { dnsResolve } from "../utils/dns-resolve";
import { validateHostname } from "../utils/validate-host";
import { validatePort } from "../utils/validate-port";

type Props = {
  askLocalPort?: boolean;
  localPort?: string;
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

  onCancel: () => void;
};

export function AddRemoteFormCard({
  askLocalPort,
  localPort: propsLocalPort,
  onSubmit,
  onCancel,
  style = {},
}: Props & Omit<ComponentProps<"form">, "onSubmit">) {
  const theme = useTheme();

  const [localPortError, setLocalPortError] = useState<null | string>(null);
  const [hostError, setHostError] = useState<null | string>(null);
  const [portError, setPortError] = useState<null | string>(null);
  const [localPort, setLocalPort] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");

  async function handleSubmit() {
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
    <Card
      elevation={4}
      sx={{
        ":hover": {
          boxShadow: theme.shadows[10],
        },
      }}
      style={style}
    >
      <CardContent>
        <Box
          marginBottom={2}
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          alignItems={"stretch"}
          justifyContent={"space-between"}
        >
          <Box fontWeight="bold" display={"flex"} alignItems={"flex-start"}>
            {askLocalPort ? (
              <TextField
                label="Porta local (opcional)"
                placeholder="e.g. 8080"
                value={localPort}
                onChange={(e) => setLocalPort(e.target.value.trim())}
                error={localPortError !== null}
                helperText={localPortError}
                margin="none"
                size="small"
                sx={{ mb: 1 }}
              />
            ) : (
              <Box sx={{ mt: 1 }}>127.0.0.1:{propsLocalPort || "?"}</Box>
            )}
            <ComputerIcon sx={{ mx: 2, mt: 1 }} />
          </Box>

          <Box fontWeight="bold" display={"flex"} alignItems={"flex-start"}>
            <ComputerIcon sx={{ mx: 2, mt: 1 }} />
            <TextField
              label="Host remoto"
              placeholder="e.g. 172.24.23.100"
              value={host}
              onChange={(e) => setHost(e.target.value.trim())}
              error={hostError !== null}
              helperText={hostError}
              margin="none"
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
            <TextField
              label="Porta remota"
              placeholder="e.g. 8080"
              value={port}
              onChange={(e) => setPort(e.target.value.trim())}
              error={portError !== null}
              helperText={portError}
              margin="none"
              size="small"
              sx={{ mb: 1, width: 150 }}
            />
          </Box>
        </Box>

        <Box display={"flex"} justifyContent={"center"}>
          <Button
            onClick={handleSubmit}
            variant="outlined"
            color="primary"
            sx={{ m: 2 }}
          >
            OK
          </Button>
          <Button
            onClick={onCancel}
            variant="outlined"
            color="secondary"
            sx={{ m: 2 }}
          >
            Cancelar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
