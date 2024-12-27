"use client";

import * as React from "react";
import { Check, ChevronsUpDown, ChevronDown, ActivityIcon } from "lucide-react";
import * as Icons from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
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
  createMessage,
} from "@/lib/actions";
import { TicketPriority, TicketStatus, TicketType } from "@/lib/types";
import { Input } from "./ui/input";

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
      id: string;
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
    notes: {
      createdAt: string;
      content: string;
    }[];
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

  const [noteContent, setNoteContent] = React.useState("");

  const handleNoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      console.log(noteContent, props.data.id, props.data.user?.id);
      await createMessage(
        noteContent,
        props.data.id,
        props.data.user ? props.data.user.id : null
      );
      setNoteContent("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const [isHistoryExpanded, setIsHistoryExpanded] = React.useState(false);

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
            <div className="space-y-2">
              <div
                className="flex items-center cursor-pointer select-none"
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isHistoryExpanded
                      ? "transform rotate-0"
                      : "transform -rotate-90"
                  )}
                />
                <h3 className="text-lg font-semibold ml-2">
                  Historial de cambios
                </h3>
              </div>

              <div
                className={cn(
                  "transition-all duration-200 space-y-4 overflow-hidden",
                  isHistoryExpanded
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                {props.data.notes.map((note) => (
                  <div
                    key={note.createdAt}
                    className="flex items-start space-x-4 text-sm"
                  >
                    <div className="w-4 h-4 mt-0.5">
                      <ActivityIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-gray-700">{note.content}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <form onSubmit={handleNoteSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Agregar una nota..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!noteContent.trim()}>
              Agregar nota
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
