"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export type UserInfoProps = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    rut: string;
    email: string;
    phone: string;
    avatar: string | null;
    assignedTickets: {
      id: string;
      title: string;
      status: {
        text: string;
        color: string;
      };
    }[];
  };
};

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.avatar ?? ""}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
              <p className="text-sm text-muted-foreground">RUT: {user.rut}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Información de contacto
            </h3>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {user.phone}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Tickets asignados</h3>
            {user.assignedTickets.length > 0 ? (
              <div className="space-y-2">
                {user.assignedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex justify-between items-center"
                  >
                    <span>{ticket.title}</span>
                    <Badge
                      style={{ backgroundColor: ticket.status.color }}
                      className="text-white"
                    >
                      {ticket.status.text}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay tickets asignados
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
