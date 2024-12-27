"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const isFirstLogin = React.useMemo(() => {
    if (typeof window !== "undefined") {
      return (
        new URLSearchParams(window.location.search).get("firstLogin") === "true"
      );
    }
    return false;
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: new URLSearchParams(window.location.search).get("token"),
          newPassword: data.password,
        }),
      });
      if (response.ok) {
        setShouldRefresh(true);
        showAlert(
          `Contraseña ${isFirstLogin ? "creada" : "restablecida"} correctamente`
        );
      } else {
        showAlert(
          `Hubo un error al ${
            isFirstLogin ? "crear" : "restablecer"
          } la contraseña`
        );
      }
    } catch (error) {
      console.error(error);
      showAlert(
        `Hubo un error al ${
          isFirstLogin ? "crear" : "restablecer"
        } la contraseña`
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isFirstLogin ? "Crear contraseña" : "Restablecer contraseña"}
            </CardTitle>
            <CardDescription>Ingresa tu nueva contraseña</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        La contraseña debe tener al menos 8 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {isFirstLogin ? "Crear contraseña" : "Restablecer contraseña"}
                </Button>
              </CardFooter>
            </form>
            <AlertDialog open={isAlertOpen} onOpenChange={handleAlertClose}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Notificación</AlertDialogTitle>
                  <AlertDialogDescription>
                    {alertMessage}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={handleAlertClose}>
                    Aceptar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Form>
        </Card>
      </div>
    </>
  );
}
