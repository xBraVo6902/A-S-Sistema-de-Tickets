"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";

type TicketMessageProps = {
  messages: {
    id: number;
    person: {
      name: string;
    };
    content: string;
    createdAt: string;
  }[];
};

export type TicketMessage = {
  id: number;
  person: {
    name: string;
  };
  content: string;
  createdAt: string;
};

export default function TicketMessages(props: TicketMessageProps) {
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!session) {
        throw new Error("Unauthorized");
      }

      const ticketId = window.location.pathname.split("/").pop();

      await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/messages/${ticketId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        }
      );
      setNewMessage("");
      window.location.reload();
    } catch (error) {
      console.error("Error sending message");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensajes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {props.messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <Avatar>
                <AvatarImage src={""} alt={message.person.name} />
                <AvatarFallback>
                  {message.person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold">
                    {message.person.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {message.createdAt}
                  </span>
                </div>
                <p className="mt-1 text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
          <Input
            placeholder="Escribe tu mensaje aquí..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit">Enviar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
