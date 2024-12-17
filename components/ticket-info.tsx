"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Priority, Status, Type } from "@prisma/client";
import TicketMessageButton from "./ticket-message-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { assignUserToTicket } from "@/lib/actions";

export type TicketInfoProps = {
  data: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    status: Status & { text: string; icon: string; color: string };
    type: Type & { text: string; icon: string; color: string };
    priority: Priority & { text: string; icon: string; color: string };
    user: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
      phone: string;
    } | null;
    client: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
      phone: string;
    };
  };
  role: "User" | "Client" | "Admin";
  users:
    | {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
      }[]
    | null;
};

export default function TicketInfo(props: TicketInfoProps) {
  const whatsappData = {
    name:
      props.role === "User"
        ? props.data.user?.firstName + " " + props.data.user?.lastName
        : props.data.client.firstName + " " + props.data.client.lastName,
    phone:
      props.role === "User" ? props.data.client.phone : props.data.user?.phone,
    title: props.data.title,
    id: props.data.id,
  };

  const users = props.users?.map((user) => ({
    value: `${user.id}`,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleAssignUser = async (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);

    if (currentValue) {
      try {
        const result = await assignUserToTicket(props.data.id, currentValue);
        if (!result.success) {
          setValue(value);
        }
      } catch (error) {
        console.error("Error assigning user:", error);
        setValue(value);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">
                {props.data.title}
              </CardTitle>
              <div className="flex space-x-2 mb-2">
                <Badge
                  style={{ backgroundColor: props.data.status.color }}
                  className="text-white"
                >
                  {props.data.status.text}
                </Badge>
                <Badge
                  style={{ backgroundColor: props.data.type.color }}
                  className="text-white"
                >
                  {props.data.type.text}
                </Badge>
                <Badge
                  style={{ backgroundColor: props.data.priority.color }}
                  className="text-white"
                >
                  Prioridad {props.data.priority.text}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                ID: {props.data.id}
              </p>
              <p className="text-sm text-muted-foreground">
                Fecha de creación: {props.data.createdAt}
              </p>
              <p className="text-sm text-muted-foreground">
                Última modificación: {props.data.updatedAt}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p>{props.data.description}</p>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Creado por</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={props.data.client.avatar ?? ""}
                      alt={
                        props.data.client.firstName +
                        " " +
                        props.data.client.lastName
                      }
                    />
                    <AvatarFallback>
                      {props.data.client.firstName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {props.data.client.firstName +
                        " " +
                        props.data.client.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {props.data.client.email}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Asignado a</h3>
                {props.data.user ? (
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={props.data.user.avatar ?? ""}
                        alt={
                          props.data.user.firstName +
                          " " +
                          props.data.user.lastName
                        }
                      />
                      <AvatarFallback>
                        {props.data.user.firstName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {props.data.user.firstName +
                          " " +
                          props.data.user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {props.data.user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin asignar</p>
                )}
              </div>
            </div>
            {props.data.user && props.role !== "Admin" && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Contacta a{" "}
                    {props.role === "User"
                      ? props.data.client.firstName
                      : props.data.user.firstName}
                  </h3>
                  <TicketMessageButton data={whatsappData} role={props.role} />
                </div>
              </>
            )}
            {props.role === "Admin" && (
              <>
                <Separator />
                <div className="flex justify-end">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                      >
                        {value
                          ? users?.find((user) => user.value === value)?.label
                          : "Asignar usuario..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Sin resultados</CommandEmpty>
                          <CommandGroup>
                            {users?.map((user) => (
                              <CommandItem
                                key={user.value}
                                value={user.value}
                                onSelect={handleAssignUser}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value === user.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {user.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
