import ComputerIcon from "@mui/icons-material/Computer";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { ComponentProps } from "react";
import { DataBox } from "./DataBox";
import { SendMessageFormSimple } from "./SendMessageFormSimple";

/**
 * null means there is no status (UDP)
 */
type Status = null | "connected" | "disconnected";

type Props = {
  localAddress: string;
  remoteAddress: string;

  status: Status;
  inboundData: string;
  outboundData: string;

  // will show buttons if these functions
  // are provided and `status` is appropriate
  onClickConnect?: () => void;
  onClickDisconnect?: () => void;
  onSubmitMessage?: (message: string) => void;
};

export function HostCard({
  localAddress,
  remoteAddress,
  status,
  inboundData,
  outboundData,
  onClickConnect,
  onClickDisconnect,
  onSubmitMessage,
  style = {},
}: Props & ComponentProps<"div">) {
  const theme = useTheme();

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
          marginBottom={3}
          paddingTop={1}
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            display={"flex"}
            alignItems={"center"}
          >
            {localAddress}
            <ComputerIcon sx={{ mx: 2 }} />
          </Typography>
          {status !== null && (
            <Chip
              color={status === "connected" ? "success" : "default"}
              label={status === "connected" ? "Conectado" : "Desconectado"}
            />
          )}
          <Typography
            variant="body1"
            fontWeight="bold"
            display={"flex"}
            alignItems={"center"}
          >
            <ComputerIcon sx={{ mx: 2 }} />
            {remoteAddress}
          </Typography>
        </Box>

        {status === "disconnected" && onClickConnect && (
          <Button
            onClick={onClickConnect}
            variant="contained"
            color="primary"
            sx={{ mb: 1 }}
            endIcon={<SensorsIcon />}
          >
            Conectar
          </Button>
        )}
        {(status === null || status === "connected") && onSubmitMessage && (
          <SendMessageFormSimple
            onSubmit={onSubmitMessage}
            style={{ display: "inline-block", marginRight: theme.spacing(2) }}
          />
        )}
        {status === "connected" && onClickDisconnect && (
          <Button
            onClick={onClickDisconnect}
            variant="contained"
            color="secondary"
            sx={{ mb: 1 }}
            endIcon={<SensorsOffIcon />}
          >
            Desconectar
          </Button>
        )}
        <Grid container spacing={2} marginBottom={2} marginTop={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Dados enviados
            </Typography>
            <DataBox status={status} data={outboundData} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Dados recebidos
            </Typography>
            <DataBox status={status} data={inboundData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
