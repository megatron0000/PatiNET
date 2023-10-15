import { Box, BoxProps, IconButton } from "@mui/material";
import { useState } from "react";

export const hoverSx = {
  position: "relative",

  "&:hover > .buttonBox > *": {
    opacity: 1,
  },

  "&:hover > .buttonBox": {
    backgroundColor: "white",
  },

  ".iconButtonSelected": {
    opacity: 1,
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  },

  ".iconButtonSelected:hover": {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  },

  "&:not(:hover)  .iconButtonSelected": {
    position: "absolute",
    right: 0,
    top: 0,
  },
};

type Props<T extends string> = Omit<BoxProps, "onClick"> & {
  labels: T[];
  onClick: (label: T | null) => void;
};

export function HoverButtons<T extends string>({
  sx = {},
  labels,
  onClick,
}: Props<T>) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleClick(label: string) {
    if (selected === label) {
      setSelected(null);
      onClick(null);
    } else {
      setSelected(label);
      onClick(label as T);
    }
  }

  return (
    <Box
      className="buttonBox"
      sx={{
        position: "absolute",
        display: "flex",
        backgroundColor: "transparent",
        ...sx,
      }}
    >
      {labels.map((label) => (
        <IconButton
          key={label}
          onClick={() => handleClick(label)}
          className={selected === label ? "iconButtonSelected" : ""}
          size="small"
          sx={{
            opacity: 0,
            position: "relative",
            transition: "opacity 0.3s, right 0.3s",
            scale: "0.8",
          }}
        >
          {label}
        </IconButton>
      ))}
    </Box>
  );
}
