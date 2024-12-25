"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import * as Icons from "lucide-react";
import { TicketPriority, TicketStatus, TicketType } from "@/lib/types";

export type Ticket = {
  id: string;
  title: string;
  status: TicketStatus;
  type: TicketType;
  priority: TicketPriority;
  user: { firstName: string; lastName: string; avatar: string } | null;
};

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId));
      return value === filterValue;
    },
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as TicketStatus & {
        lucideIcon: string;
        hexColor: string;
        name: string;
      };
      // @ts-expect-error - We know this is a valid icon name
      const Icon = Icons[status.lucideIcon];

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: status.hexColor }} />
          <span>{status.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as TicketType & {
        lucideIcon: string;
        hexColor: string;
        name: string;
      };
      // @ts-expect-error - We know this is a valid icon name
      const Icon = Icons[type.lucideIcon];

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: type.hexColor }} />
          <span>{type.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TicketPriority & {
        lucideIcon: string;
        hexColor: string;
        name: string;
      };
      // @ts-expect-error - We know this is a valid icon name
      const Icon = Icons[priority.lucideIcon];

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: priority.hexColor }} />
          <span>{priority.name}</span>
        </div>
      );
    },
  },
];
