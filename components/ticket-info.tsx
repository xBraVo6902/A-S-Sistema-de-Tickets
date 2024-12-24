"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as Icons from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import TicketMessageButton from "./ticket-message-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  assignUserToTicket,
  updateTicketStatus,
  getTicketMetadata,
} from "@/lib/actions";
import { TicketPriority, TicketStatus, TicketType } from "@/lib/types";

export type TicketInfoProps = {
  data: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    status: TicketStatus;
    type: TicketType;
    priority: TicketPriority;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
      phone: string;
    } | null;
    client: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
      phone: string;
    };
  };
  role: "User" | "Client" | "Admin";
  users?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  }[];
};

export default function TicketInfo(props: TicketInfoProps) {
  console.log(props.data);

  const phone =
    props.role === "User" ? props.data.client.phone : props.data.user?.phone;

  const users = props.users?.map((user) => ({
    value: `${user.id}`,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const [statuses, setStatuses] = React.useState<TicketStatus[]>([]);

  React.useEffect(() => {
    async function fetchStatuses() {
      const metadata = await getTicketMetadata();
      setStatuses(metadata.statuses);
    }
    fetchStatuses();
  }, []);

  const [assignOpen, setAssignOpen] = React.useState(false);
  const [assignValue, setAssignValue] = React.useState("");

  const [statusOpen, setStatusOpen] = React.useState(false);
  const [statusValue, setStatusValue] = React.useState("");

  const handleAssignUser = async (currentValue: string) => {
    setAssignValue(currentValue === assignValue ? "" : currentValue);
    setAssignOpen(false);

    if (currentValue) {
      try {
        const result = await assignUserToTicket(props.data.id, currentValue);
        if (!result.success) {
          setAssignValue(assignValue);
        }
      } catch (error) {
        console.error("Error assigning user:", error);
        setAssignValue(assignValue);
      }
    }
  };

  const handleStatusChange = async (currentValue: string) => {
    setStatusValue(currentValue === statusValue ? "" : currentValue);
    setStatusOpen(false);

    if (currentValue) {
      try {
        const result = await updateTicketStatus(
          props.data.id,
          statuses
            .find((status) => status.name === currentValue)
            ?.id.toString() || ""
        );
        if (!result.success) {
          setStatusValue(statusValue);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        setStatusValue(statusValue);
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
                  style={{ backgroundColor: props.data.status.hexColor }}
                  className="text-white"
                >
                  {props.data.status.name}
                </Badge>
                <Badge
                  style={{ backgroundColor: props.data.type.hexColor }}
                  className="text-white"
                >
                  {props.data.type.name}
                </Badge>
                <Badge
                  style={{ backgroundColor: props.data.priority.hexColor }}
                  className="text-white"
                >
                  Prioridad {props.data.priority.name}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                ID: {props.data.id}
              </p>
              <p className="text-sm text-muted-foreground">
                Creado: {props.data.createdAt}
              </p>
              <p className="text-sm text-muted-foreground">
                Modificado: {props.data.updatedAt}
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
                <h3 className="text-lg font-semibold mb-2">Asignado a</h3>
                {props.data.user ? (
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={props.data.user.avatar}
                        alt={
                          props.data.user.firstName +
                          " " +
                          props.data.user.lastName
                        }
                      />
                      <AvatarFallback>
                        {props.data.user.firstName[0]}
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
              <div>
                <h3 className="text-lg font-semibold mb-2">Creado por</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={props.data.client.avatar}
                      alt={
                        props.data.client.firstName +
                        " " +
                        props.data.client.lastName
                      }
                    />
                    <AvatarFallback>
                      {props.data.client.firstName[0]}
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
                  <TicketMessageButton phone={phone} />
                </div>
              </>
            )}
            {(props.role === "Admin" || props.role === "User") && (
              <>
                <Separator />
                <div className="flex justify-start space-x-2">
                  <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={statusOpen}
                        className="w-[200px] justify-between"
                      >
                        <div className="flex items-center">
                          Actualizar estado...
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Sin resultados</CommandEmpty>
                          <CommandGroup>
                            {statuses.map((status) => (
                              <CommandItem
                                key={status.id}
                                value={status.name}
                                onSelect={handleStatusChange}
                              >
                                <div className="flex items-center">
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      statusValue === status.name
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {React.createElement(
                                    // @ts-expect-error - We know this is a valid icon name
                                    Icons[status.lucideIcon],
                                    {
                                      className: "h-4 w-4 mr-2",
                                      style: { color: status.hexColor },
                                    }
                                  )}
                                  {status.name}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {props.role === "Admin" && (
                    <Popover open={assignOpen} onOpenChange={setAssignOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={assignOpen}
                          className="w-[200px] justify-between"
                        >
                          {assignValue
                            ? users?.find((user) => user.value === assignValue)
                                ?.label
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
                                      assignValue === user.value
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
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
