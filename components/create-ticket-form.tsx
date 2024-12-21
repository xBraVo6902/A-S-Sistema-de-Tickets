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

import { searchClientByRut } from "@/lib/actions";
import { TicketMetadata } from "@/lib/types";

interface CreateTicketFormProps {
  ticketMetadata: TicketMetadata;
  role: "Client" | "Admin";
}

type FormInputs = {
  rut: string;
  title: string;
  type: string;
  priority: string;
  description: string;
};

export default function CreateTicketForm(props: CreateTicketFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      type: "",
      priority: "",
    },
  });

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
          <CardTitle className="text-xl">Crear ticket de soporte</CardTitle>
          <CardDescription>
            {props.role === "Admin"
              ? "Por favor, proporciona los detalles del problema del cliente."
              : "Por favor, proporciona los detalles de tu problema para que podamos ayudarte mejor."}
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
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...register("title", {
                  required: "El título es requerido",
                })}
                placeholder="Resumen breve del problema"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <span className="text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="type">Tipo de problema</Label>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Debes seleccionar un tipo de problema" }}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger
                      id="type"
                      className={errors.type ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecciona el tipo de problema" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(props.ticketMetadata.types).map(
                        ([key, value]) => {
                          const Icon = LucideIcons[
                            value.lucideIcon as keyof typeof LucideIcons
                          ] as LucideIcon;
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="h-4 w-4"
                                  style={{ color: value.hexColor }}
                                />
                                {value.name}
                              </div>
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <span className="text-sm text-red-500">
                  {errors.type.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="priority">Prioridad</Label>
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Debes seleccionar una prioridad" }}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger
                      id="priority"
                      className={errors.priority ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecciona la prioridad" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(props.ticketMetadata.priorities).map(
                        ([key, value]) => {
                          const Icon = LucideIcons[
                            value.lucideIcon as keyof typeof LucideIcons
                          ] as LucideIcon;
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="h-4 w-4"
                                  style={{ color: value.hexColor }}
                                />
                                {value.name}
                              </div>
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <span className="text-sm text-red-500">
                  {errors.priority.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Descripción del problema</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "La descripción es requerida",
                })}
                placeholder="Describe tu problema en detalle"
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
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
