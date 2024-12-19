"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { UserPen, UserPlus, UserSearch } from "lucide-react";

export default function MainMenu() {
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    {
      title: "Ver usuarios (técnicos)",
      description: "Ve los usuarios técnicos del sistema",
      icon: UserPen,
      href: "/admin/usuarios",
    },
    {
      title: "Ver clientes",
      description: "Ve los clientes del sistema",
      icon: UserSearch,
      href: "/admin/clientes",
    },
    {
      title: "Crear usuario/cliente",
      description: "Crea un nuevo usuario o cliente",
      icon: UserPlus,
      href: "/admin/crear-usuario",
    },
  ];

  return (
    <div className="container mx-auto py-10 md:px-10">
      <h1 className="text-2xl font-semibold mb-5">
        Bienvenido, {session?.user.name}
      </h1>
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
