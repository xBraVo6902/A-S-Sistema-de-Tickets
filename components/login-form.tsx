"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    setEmailError(null);
    setPasswordError(null);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res && res.ok) {
      router.push(callbackUrl || "/");
    } else if (res?.error === "USER_NOT_FOUND") {
      setEmailError("El usuario no existe");
    } else if (res?.error === "WRONG_PASSWORD") {
      setPasswordError("La contraseña es incorrecta");
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Image src="/brand.png" alt="Logo" width={548} height={200} />
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              type="email"
              placeholder="m@ejemplo.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "El correo electrónico es requerido",
                },
              })}
            />
            {(errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message?.toString()}
              </span>
            )) ||
              (emailError && (
                <span className="text-red-500 text-xs">{emailError}</span>
              ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "La contraseña es requerida",
                },
              })}
            />
            {(errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message?.toString()}
              </span>
            )) ||
              (passwordError && (
                <span className="text-red-500 text-xs">{passwordError}</span>
              ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full">Iniciar sesión</Button>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary self-start"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
