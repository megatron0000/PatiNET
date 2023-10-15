import {
  Box,
  TextField,
  TextFieldProps,
  TextFieldVariants,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Rifm } from "rifm";
import { binaryToPlain, isValidBinary, plainToBinary } from "../utils/encoding";
import { HoverButtons, hoverSx } from "./HoverButtons";

type TextMode = "plain" | "binary";

type NumberBase = "10" | "16";

export function BinaryTextField<Variant extends TextFieldVariants>(
  props: {
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant?: Variant;
    onChange: (newValue: string) => void;
    value: string;
  } & Omit<TextFieldProps, "variant" | "onChange" | "value">
) {
  const [mode, setMode] = useState<TextMode>("plain");
  const [base, setBase] = useState<NumberBase>("16");
  const [internalValue, setInternalValue] = useState(
    plainToBinary(props.value, base)
  );

  useEffect(() => {
    if (props.value !== binaryToPlain(internalValue, base)) {
      setInternalValue(plainToBinary(props.value, base));
    }
  }, [props.value]);

  const format = (newValue: string) => {
    if (mode === "plain") {
      return newValue;
    }
    //
    else if (!isValidBinary(newValue, base)) {
      return internalValue; // old value
    }

    return newValue;
  };

  const toggleMode = (newMode: null | NumberBase) => {
    setMode(newMode === null ? "plain" : "binary");
    if (newMode !== null) {
      setBase(newMode);
      setInternalValue(
        plainToBinary(binaryToPlain(internalValue, base), newMode)
      );
    }
  };

  const handleChange = (newValue: string) => {
    const newBinaryValue =
      mode === "plain" ? plainToBinary(newValue, base) : newValue;
    setInternalValue(newBinaryValue);
    props.onChange(binaryToPlain(newBinaryValue, base));
  };

  return (
    <Rifm
      value={
        mode === "plain" ? binaryToPlain(internalValue, base) : internalValue
      }
      onChange={handleChange}
      accept={/.|\n/g}
      format={format}
    >
      {({ value, onChange }) => (
        <Box
          sx={{
            display: "inline-flex",
            ...hoverSx,
          }}
        >
          <TextField
            {...props}
            value={value}
            onChange={onChange}
            spellCheck={false}
            InputProps={{
              style: { paddingRight: "45px", ...(props.style || {}) },
            }}
          />
          <HoverButtons
            labels={["10", "16"]}
            onClick={toggleMode}
            sx={{ right: "28px", top: "4px" }}
          />
        </Box>
      )}
    </Rifm>
  );
}
