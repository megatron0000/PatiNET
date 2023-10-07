export function validatePort(
  inputPort: string,
  { acceptEmpty = true, allowPrivileged = false } = {}
) {
  if (!acceptEmpty && inputPort.trim() === "") {
    return "porta não pode ser vazia";
  }

  if (acceptEmpty && inputPort.trim() === "") {
    return null;
  }

  const port = Number(inputPort);

  if (isNaN(port) || !Number.isInteger(port) || port < 0) {
    return "porta deve ser um número inteiro positivo";
  }

  if (port < 1024 && !allowPrivileged) {
    return "portas menores que 1024 são privilegiadas e não podem ser usadas";
  }

  if (port > 65535) {
    return "porta deve ser no máximo 65535";
  }

  return null;
}
