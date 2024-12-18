"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";

export type UserInfoProps = {
  user: {
    id: string;
    name: string;
    rut: string;
    email: string;
    phone: string;
    avatar: string;
    assigned: {
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
              <AvatarImage src={user.avatar ?? ""} alt={`${user.name}`} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold mb-2">
                {user.name}
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
            <h3 className="text-lg font-semibold mb-4">
              Información de contacto
            </h3>
            <div className="space-y-3">
              <p className="flex items-center text-base">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{user.email}</span>
              </p>
              <p className="flex items-center text-base">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{user.phone}</span>
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Tickets asignados</h3>
            {user.assigned.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-5 text-sm text-muted-foreground font-normal">
                      ID
                    </th>
                    <th className="text-left py-2 text-sm text-muted-foreground font-normal">
                      Título
                    </th>
                    <th className="text-right py-2 text-sm text-muted-foreground font-normal">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.assigned.map((ticket) => (
                    <tr key={ticket.id} className="border-b">
                      <td className="py-4 text-sm">{ticket.id}</td>
                      <td className="py-4 text-sm">{ticket.title}</td>
                      <td className="text-right py-4 text-sm">
                        <Badge
                          style={{ backgroundColor: ticket.status.color }}
                          className="text-white"
                        >
                          {ticket.status.text}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
