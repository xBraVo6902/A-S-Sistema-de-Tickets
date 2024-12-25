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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  createPerson,
  searchPersonByRut,
  emailExists,
  phoneExists,
} from "@/lib/actions";

import crypto from "crypto";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [userType, setUserType] = React.useState<"User" | "Client">("User");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormInputs>();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [shouldRefresh, setShouldRefresh] = React.useState(false);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    if (shouldRefresh) {
      router.push("/");
      setShouldRefresh(false);
    }
  };

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
    const [person, email, phone] = await Promise.all([
      searchPersonByRut(data.rut),
      emailExists(data.email),
      phoneExists(data.phone),
    ]);
    let error = false;

    if (person) {
      setError("rut", {
        type: "manual",
        message: "La persona con este RUT ya existe",
      });
      error = true;
    }
    if (email) {
      setError("email", {
        type: "manual",
        message: "Este email ya está registrado",
      });
      error = true;
    }
    if (phone) {
      setError("phone", {
        type: "manual",
        message: "Este número de teléfono ya está registrado",
      });
      error = true;
    }
    if (error) return;

    const temporaryToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    data.phone = "569" + data.phone.replace(/\s/g, "");
    const submitData = {
      ...data,
      role: userType,
      temporaryToken,
      tokenExpiry,
    };

    try {
      await createPerson(submitData);
      setShouldRefresh(true);
      showAlert(
        `${userType === "Client" ? "Cliente" : "Usuario"} creado exitosamente`
      );
    } catch (error) {
      console.error("Failed to create user:", error);
      showAlert("Hubo un error al crear el usuario");
    }
  };

  return (
    <>
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
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Dirección de email inválida",
                    },
                  })}
                  placeholder="user@example.com"
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
                <div className="flex">
                  <div className="flex items-center text-sm px-2 border rounded-l-md bg-muted w-16">
                    +56 9
                  </div>
                  <Input
                    id="phone"
                    {...register("phone", {
                      required: "El número de teléfono es requerido",
                      pattern: {
                        value: /^[0-9\s]{8}$/,
                        message: "Debe contener 8 números",
                      },
                      onChange: (e) => {
                        const cleaned = e.target.value.replace(/[^\d\s]/g, "");
                        const limited = cleaned.slice(0, 8);
                        e.target.value = limited;
                      },
                    })}
                    placeholder="12345678"
                    className={`rounded-l-none ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                </div>
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
      <AlertDialog open={isAlertOpen} onOpenChange={handleAlertClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notificación</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertClose}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
