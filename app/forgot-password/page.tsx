"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import Link from "next/link";
import { sendResetEmail } from "@/lib/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Debe ser un email válido.",
  }),
});

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
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
      await sendResetEmail(data.email, "reset-password");
      setShouldRefresh(true);
      showAlert(
        "Si el email ingresado corresponde a una cuenta existente, se enviará un correo con instrucciones para recuperar tu contraseña."
      );
    } catch (error) {
      console.error("Failed to create user:", error);
      showAlert("Hubo un error al crear el usuario");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Recuperar contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu email para recuperar tu contraseña
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full">Enviar correo de recuperación</Button>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-primary self-start"
              >
                Volver al inicio de sesión
              </Link>
            </CardFooter>
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
        </Form>
      </Card>
    </div>
  );
}
