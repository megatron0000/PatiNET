import { Box, useTheme } from "@mui/material";
import { ComponentProps, useState } from "react";
import { plainToBinary } from "../utils/encoding";
import { HoverButtons, hoverSx } from "./HoverButtons";

type Props = {
  status: null | "connected" | "disconnected";
  data: string;
};

export function DataBox({ status, data }: Props) {
  const theme = useTheme();
  const [numberBase, setNumberBase] = useState<null | "10" | "16">(null);

  return (
    <Box
      sx={{
        ...hoverSx,
      }}
    >
      <BoxedText
        style={{
          background: status === "disconnected" ? theme.palette.grey[200] : "",
          ...(numberBase !== null
            ? {
                paddingRight: "40px",
                overflowX: "initial",
                whiteSpace: "initial",
              }
            : {}),
        }}
      >
        {numberBase === null ? data : plainToBinary(data, numberBase)}
      </BoxedText>

      <HoverButtons
        labels={["10", "16"]}
        onClick={setNumberBase}
        sx={{ right: "8px", top: "6px" }}
      />
    </Box>
  );
}

const BoxedText = ({
  children,
  style = {},
}: { children: string } & ComponentProps<"div">) => {
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
      style={style}
    >
      {children + "\n"}
    </Box>
  );
};
