import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Theme,
  Typography,
  useTheme,
  useThemeProps,
} from "@mui/material";
import { DataGridSimple, GridSimpleColDef } from "./DataGridSimple";
import { SendMessageFormSimple } from "./SendMessageFormSimple";
import { ComponentProps } from "react";

type Props = {
  address: string;
  /**
   * null means there is no status (UDP)
   */
  status: null | "connected" | "disconnected";
  inboundData: string;
  outboundData: string;

  // will show buttons if these functions
  // are provided
  onClickConnect?: () => void;
  onClickDisconnect?: () => void;
  onSubmitMessage?: (message: string) => void;
};

type RowModel = {
  status?: string;
  inboundData: string;
  outboundData: string;
}[];

export function HostCard({
  address,
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
        <Typography variant="body1" marginBottom={2} fontWeight="bold">
          {address}
          {status !== null && (
            <Chip
              color={status === "connected" ? "success" : "default"}
              label={status === "connected" ? "Conectado" : "Desconectado"}
            />
          )}
        </Typography>
        {onClickConnect && (
          <Button onClick={onClickConnect} variant="contained" color="primary">
            Conectar
          </Button>
        )}
        {onSubmitMessage && (
          <SendMessageFormSimple onSubmit={onSubmitMessage} />
        )}
        {onClickDisconnect && (
          <Button
            onClick={onClickDisconnect}
            variant="contained"
            color="secondary"
          >
            Desconectar
          </Button>
        )}
        <Grid container spacing={2} marginBottom={2} marginTop={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Dados recebidos
            </Typography>
            <BoxedText>{inboundData}</BoxedText>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Dados enviados
            </Typography>
            <BoxedText>{outboundData}</BoxedText>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const BoxedText = ({ children }: { children: string }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: "5px",
        padding: theme.spacing(1),
        whiteSpace: "pre",
        overflowX: "auto",
      }}
    >
      {children + "\n"}
    </Box>
  );
};
