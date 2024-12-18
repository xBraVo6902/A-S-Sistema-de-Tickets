"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";

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
import { searchClientByRut } from "@/lib/actions";

interface CreateTicketFormProps {
  role: "Client" | "Admin";
}

type FormInputs = {
  rut: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export default function CreateUserForm(props: CreateTicketFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<FormInputs>();

  const formatRut = (value: string) => {
    let rutClean = value.replace(/[^0-9kK]/g, "");

    rutClean = rutClean.replace(/k/g, "K");

    if (rutClean.length === 0) return "";

    const dv = rutClean.slice(-1);
    let rutBody = rutClean.slice(0, -1);

    rutBody = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/^\./, "");

    return rutBody ? `${rutBody}-${dv}` : dv;
  };

  const validateRut = (rut: string) => {
    const rutClean = rut.replace(/[.-]/g, "");

    if (rutClean.length < 2) return false;

    const body = rutClean.slice(0, -1);
    const dv = rutClean.slice(-1).toUpperCase();

    let suma = 0;
    let multiplicador = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      suma += parseInt(body.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

    return dv === dvCalculado;
  };

  const onSubmit = async (data: FormInputs) => {
    let response;

    if (props.role === "Admin") {
      const client = await searchClientByRut(data.rut);
      if (!client) {
        setError("rut", {
          type: "manual",
          message: "El cliente con el RUT ingresado no existe",
        });
        return;
      }

      response = await fetch(`/api/tickets?clientId=${client.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }

    const result = await response?.json();
    if (response?.ok) {
      alert(result.message);
      router.push("/");
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Registrar nuevo usuario</CardTitle>
          <CardDescription>
            Completa el siguiente formulario para registrar un nuevo usuario o
            cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {props.role === "Admin" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">RUT del cliente</Label>
                <Input
                  id="rut"
                  {...register("rut", {
                    required: "El RUT es requerido",
                    validate: {
                      validFormat: (value) =>
                        validateRut(value) || "RUT inválido",
                    },
                  })}
                  placeholder="Escribe el RUT del cliente"
                  onChange={(e) => {
                    const formattedRut = formatRut(e.target.value);
                    setValue("rut", formattedRut, { shouldValidate: true });
                  }}
                  maxLength={12}
                  className={errors.rut ? "border-red-500" : ""}
                />
                {errors.rut && (
                  <span className="text-sm text-red-500">
                    {errors.rut.message}
                  </span>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  {...register("firstName", {
                    required: "El nombre es requerido",
                  })}
                  placeholder="Nombre del usuario"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <span className="text-sm text-red-500">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  {...register("lastName", {
                    required: "El apellido es requerido",
                  })}
                  placeholder="Apellido del usuario"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <span className="text-sm text-red-500">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email", {
                  required: "El email es requerido",
                })}
                placeholder="Email del usuario"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Número de télefono</Label>
              <Input
                id="phone"
                {...register("phone", {
                  required: "El número de teléfono es requerido",
                })}
                placeholder="Número de teléfono del usuario"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <span className="text-sm text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="">
          <Button className="w-full" type="submit">
            Crear usuario
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
