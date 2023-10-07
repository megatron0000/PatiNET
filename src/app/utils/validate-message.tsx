export function validateMessage(message: string) {
  if (message === "") {
    return "Mensagem não pode ser vazia";
  }

  return null;
}
