"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

import { ticketMetadata } from "@/prisma/ticketMetadata";

interface CreateTicketFormProps {
  role: "Client" | "Admin";
}

export default function CreateTicketForm(props: CreateTicketFormProps) {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const ticketData = {
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      priority: formData.get("priority") as string,
      description: formData.get("description") as string,
    };

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.message);
    }
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Crear ticket de soporte</CardTitle>
          <CardDescription>
            Por favor, proporciona los detalles de tu problema para que podamos
            ayudarte mejor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Resumen breve del problema"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="type">Tipo de problema</Label>
              <Select name="type">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecciona el tipo de problema" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Object.entries(ticketMetadata.type).map(([key, value]) => {
                    const Icon = LucideIcons[
                      value.icon as keyof typeof LucideIcons
                    ] as LucideIcon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon
                            className="h-4 w-4"
                            style={{ color: value.color }}
                          />
                          {value.text}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="priority">Prioridad</Label>
              <Select name="priority">
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecciona la prioridad" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Object.entries(ticketMetadata.priority).map(
                    ([key, value]) => {
                      const Icon = LucideIcons[
                        value.icon as keyof typeof LucideIcons
                      ] as LucideIcon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon
                              className="h-4 w-4"
                              style={{ color: value.color }}
                            />
                            {value.text}
                          </div>
                        </SelectItem>
                      );
                    }
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Descripción del problema</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe tu problema en detalle"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="">
          <Button className="w-full" type="submit">
            Crear ticket
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
