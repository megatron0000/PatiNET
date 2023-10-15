export const bufferToPlain = (buffer: Buffer) => buffer.toString("binary");

export const bufferToBinary = (buffer: Buffer, base: number | string) => {
  switch (+base) {
    case 16:
      return (
        buffer
          .toString("hex")
          .match(/.{1,2}/g)
          ?.join(" ") || ""
      );

    case 10:
      return buffer.reduce(
        (acc, byte) =>
          acc === "" ? byte.toString(10) : `${acc} ${byte.toString(10)}`,
        ""
      );

    default:
      throw new Error("Invalid base");
  }
};

export const plainToBinary = (text: string, base: number | string) =>
  bufferToBinary(Buffer.from(text, "binary"), base);

export const binaryToBuffer = (binary: string, base: number | string) =>
  Buffer.from(
    binary
      .split(" ")
      .filter((x) => x !== "")
      .map((num) => parseInt(num, +base))
      .filter((n) => !isNaN(n))
  );

export const binaryToPlain = (binary: string, base: number | string) =>
  bufferToPlain(binaryToBuffer(binary, base));
