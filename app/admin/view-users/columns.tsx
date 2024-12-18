"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export type User = {
  id: string;
  name: string;
  rut: string;
  email: string;
  assignedTickets: number;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId));
      return (
        value.includes(filterValue) ||
        row
          .getValue("name")
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        row
          .getValue("email")
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        row.getValue("rut").toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "rut",
    header: "RUT",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "assignedTickets",
    header: "Tickets asignados",
  },
];
