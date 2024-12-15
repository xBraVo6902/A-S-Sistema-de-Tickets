"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TicketIcon,
  RectangleStackIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function MainMenu() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Crear tickets",
      description: "Crea tickets de soporte para tus clientes",
      icon: TicketIcon,
      href: "/admin/create-ticket",
    },
    {
      title: "Ver tickets",
      description: "Obtén un resumen de los tickets creados",
      icon: RectangleStackIcon,
      href: "/admin/ver-ticket",
    },
    {
      title: "Asignar tickets",
      description: "Asigna tickets a los usuarios",
      icon: ClipboardDocumentCheckIcon,
      href: "/admin/assign-ticket",
    },
    {
      title: "Usuarios",
      description: "Gestiona los usuarios del sistema",
      icon: UserIcon,
      href: "/admin/view-users",
    },
    {
      title: "Preferencias de la cuenta",
      description: "Configura las preferencias de tu cuenta",
      icon: Cog6ToothIcon,
      href: "",
    },
    {
      title: "Dashboard",
      description: "Ver datos relevantes",
      icon: ChartBarIcon,
      href: "/admin/dashboard",
    },
  ];

  return (
    <div className="container mx-auto py-10 md:px-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="h-6 w-6 mr-2" />
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push(item.href)}>
                Acceder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
