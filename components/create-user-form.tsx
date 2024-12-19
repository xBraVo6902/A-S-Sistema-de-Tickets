"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

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
import { createUserOrClient, searchUserOrClientByRut } from "@/lib/actions";

import crypto from "crypto";

interface CreateTicketFormProps {
  role: "Client" | "Admin";
}

type FormInputs = {
  rut: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyRut?: string;
  userType: "User" | "Client";
};

export default function CreateUserForm(props: CreateTicketFormProps) {
  const [userType, setUserType] = React.useState<"User" | "Client">("User");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
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
    const person = await searchUserOrClientByRut(data.rut);
    if (person) {
      setError("rut", {
        type: "manual",
        message: "La persona con este RUT ya existe",
      });
      return;
    }

    const temporaryToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const submitData = {
      ...data,
      role: userType,
      temporaryToken,
      tokenExpiry,
    };

    await createUserOrClient(submitData);

    const resetLink = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/reset-password?token=${temporaryToken}`;
    console.log(resetLink);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Registrar nuevo usuario</CardTitle>
          <CardDescription>
            Selecciona el tipo de usuario y completa el formulario.
          </CardDescription>
          <div className="flex gap-4 mt-4">
            <Button
              type="button"
              variant={userType === "User" ? "default" : "outline"}
              onClick={() => setUserType("User")}
            >
              Usuario
            </Button>
            <Button
              type="button"
              variant={userType === "Client" ? "default" : "outline"}
              onClick={() => setUserType("Client")}
            >
              Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {userType === "Client" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="companyRut">RUT de la empresa</Label>
                <Input
                  id="companyRut"
                  {...register("companyRut", {
                    required:
                      userType === "Client"
                        ? "El RUT de la empresa es requerido"
                        : false,
                    validate: {
                      validFormat: (value) =>
                        !value || validateRut(value) || "RUT inválido",
                    },
                  })}
                  placeholder="Ingrese el RUT de la empresa"
                  onChange={(e) => {
                    const formattedRut = formatRut(e.target.value);
                    setValue("companyRut", formattedRut, {
                      shouldValidate: true,
                    });
                  }}
                  maxLength={12}
                  className={errors.companyRut ? "border-red-500" : ""}
                />
                {errors.companyRut && (
                  <span className="text-sm text-red-500">
                    {errors.companyRut.message}
                  </span>
                )}
              </div>
            )}
            {props.role === "Admin" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">
                  RUT del {userType === "User" ? "usuario" : "cliente"}
                </Label>
                <Input
                  id="rut"
                  {...register("rut", {
                    required: "El RUT es requerido",
                    validate: {
                      validFormat: (value) =>
                        validateRut(value) || "RUT inválido",
                    },
                  })}
                  placeholder={`Ingrese el RUT del ${
                    userType === "User" ? "usuario" : "cliente"
                  }`}
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
                  placeholder={`Nombre del ${
                    userType === "User" ? "usuario" : "cliente"
                  }`}
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
                  placeholder={`Apellido del ${
                    userType === "User" ? "usuario" : "cliente"
                  }`}
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
                placeholder={`Email del ${
                  userType === "User" ? "usuario" : "cliente"
                }`}
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
                placeholder={`Número de teléfono del ${
                  userType === "User" ? "usuario" : "cliente"
                }`}
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
            Crear {userType === "User" ? "usuario" : "cliente"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
