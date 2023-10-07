import "./MessageTable.css";
import { DataGrid } from "@mui/x-data-grid";

type Props = {
  messages: { address: string; message: string }[];
  addressLabel: string;
};

export function MessageTable({ addressLabel, messages }: Props) {
  return (
    <DataGrid
      columns={[
        {
          field: "address",
          headerName: addressLabel,
          width: 200,
          sortable: false,
        },
        {
          field: "message",
          headerName: "Mensagem",
          sortable: false,
          cellClassName: "message-cell",
          flex: 1,
        },
      ]}
      rows={messages.map(({ address, message }, i) => ({
        address,
        message: message.endsWith("\n") ? message + "\n" : message, // add another \n to show the line break visually
        id: i,
      }))}
      hideFooter
      autoHeight
      getRowHeight={() => "auto"}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
    ></DataGrid>
  );
}
