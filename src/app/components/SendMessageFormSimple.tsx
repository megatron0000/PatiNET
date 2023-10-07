import { Button, TextField, useTheme } from "@mui/material";
import { ComponentProps, useState } from "react";
import { validateMessage } from "../utils/validate-message";

type Props = {
  onSubmit: (message: string) => void;
};

export function SendMessageFormSimple({
  onSubmit,
  style = {},
}: Props & Omit<ComponentProps<"form">, "onSubmit">) {
  const theme = useTheme();

  const [messageError, setMessageError] = useState<null | string>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const messageError = validateMessage(message);
    setMessageError(messageError);

    if (messageError) {
      return;
    }

    onSubmit(message);
    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        ...style,
      }}
    >
      <TextField
        label="Mensagem"
        multiline
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        error={messageError !== null}
        helperText={messageError}
        margin="none"
        size="small"
        style={{ width: "400px", marginRight: theme.spacing(2) }}
      />
      <Button type="submit" variant="contained" color="primary">
        Enviar
      </Button>
    </form>
  );
}
