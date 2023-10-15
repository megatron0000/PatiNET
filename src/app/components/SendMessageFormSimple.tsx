import EmailIcon from "@mui/icons-material/Email";
import { Button, useTheme } from "@mui/material";
import { ComponentProps, useState } from "react";
import { validateMessage } from "../utils/validate-message";
import { BinaryTextField } from "./BinaryTextField";

type Props = {
  onSubmit: (message: string) => void;
};

export function SendMessageFormSimple({
  onSubmit,
  style = {},
}: Props & Omit<ComponentProps<"form">, "onSubmit">) {
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
      <BinaryTextField
        label="Mensagem"
        multiline
        value={message}
        onChange={(newValue) => setMessage(newValue)}
        error={messageError !== null}
        helperText={messageError}
        margin="none"
        size="small"
        sx={{ width: "400px", mr: 2, mb: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mb: 1 }}
        endIcon={<EmailIcon />}
      >
        Enviar
      </Button>
    </form>
  );
}
