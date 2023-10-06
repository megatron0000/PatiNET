import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

type Props = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

export function CenteredTabs({ options, selected, onChange }: Props) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        boxShadow: 1,
      }}
    >
      <Tabs value={selected} onChange={handleChange} centered>
        {options.map((option) => (
          <Tab label={option} value={option} />
        ))}
      </Tabs>
    </Box>
  );
}
