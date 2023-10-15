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

export const isValidBinary = (binary: string, base: number | string) => {
  if (base === "16") {
    const hasForbiddenChars = binary.match(/[^0-9 a-fA-F]/);
    const hasMoreThanTwoCharsInAByte = binary.match(/[^ ]{3,}/);
    return !hasForbiddenChars && !hasMoreThanTwoCharsInAByte;
  }
  //
  else if (base === "10") {
    const hasForbiddenChars = binary.match(/[^0-9 ]/);
    const hasByteGreaterThan255 = binary
      .match(/[^ ]{3,}/g)
      ?.map(Number)
      .some((n) => n > 255);
    return !hasForbiddenChars && !hasByteGreaterThan255;
  }

  throw new Error("Invalid base");
};
