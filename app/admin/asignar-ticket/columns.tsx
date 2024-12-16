"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Status, Type, Priority } from "@prisma/client";
import * as Icons from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type Ticket = {
  id: string;
  title: string;
  status: Status;
  type: Type;
  priority: Priority;
  user: { name: string } | null;
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
  {
    accessorKey: "user",
    header: "Encargado",
    cell: ({ row }) => {
      const user = row.getValue("user") as {
        firstName: string;
        lastName: string;
      } | null;

      if (!user)
        return <span className="text-muted-foreground">Sin asignar</span>;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image ?? ""}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>{user.firstName}</span>
        </div>
      );
    },
  },
];
