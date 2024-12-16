"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { MoreHorizontal } from "lucide-react";

import { Status, Type, Priority } from "@prisma/client";
import { ticketMetadata } from "@/prisma/ticketMetadata";
import * as Icons from "lucide-react";

export type Ticket = {
  id: string;
  title: string;
  status: Status;
  type: Type;
  priority: Priority;
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
      const status = row.getValue("status") as Status & {
        icon: string;
        color: string;
        text: string;
      };
      // @ts-expect-error - We know this is a valid icon name
      const Icon = Icons[status.icon];

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: status.color }} />
          <span>{status.text}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as Type & {
        icon: string;
        color: string;
        text: string;
      };
      // @ts-expect-error - We know this is a valid icon name
      const Icon = Icons[type.icon];

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: type.color }} />
          <span>{type.text}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as Priority & {
        icon: string;
        color: string;
        text: string;
      };
      // @ts-expect-error - We know this is a valid icon name
      const Icon = Icons[priority.icon];

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: priority.color }} />
          <span>{priority.text}</span>
        </div>
      );
    },
  },
];
