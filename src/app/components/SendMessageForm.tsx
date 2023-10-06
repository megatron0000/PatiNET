import { TextField } from "@mui/material";
import { StyledTextarea } from "./StyledTextarea";

export function SendMessageForm() {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div>
        <TextField
          label="Endereço"
          placeholder="e.g. 172.24.23.100"
          margin="normal"
          sx={{ mr: 1 }}
        />
        <TextField label="Porta" placeholder="e.g. 8080" margin="normal" />
      </div>
      <TextField
        label="Mensagem"
        multiline
        margin="normal"
        style={{ width: "400px" }}
      />
    </form>
  );
}
