import { DataGridSimple } from "./DataGridSimple";

type Props = {
  messages: { address: string; message: string }[];
  addressLabel: string;
};

export function MessageTable({ addressLabel, messages }: Props) {
  return (
    <DataGridSimple
      columns={[
        {
          field: "address",
          headerName: addressLabel,
          width: 200,
        },
        {
          field: "message",
          headerName: "Mensagem",
          flex: 1,
          multiline: true,
          allowOverflow: true,
        },
      ]}
      rows={messages}
      hideFooter
      autoHeight
      getRowHeight={() => "auto"}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
    />
  );
}
