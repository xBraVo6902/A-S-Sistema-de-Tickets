'use client'

import * as React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import router from 'next/router'

const formSchema = z.object({
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

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
        })
    
        if (response.ok) {
            alert("Contraseña restablecida correctamente")
            router.push("/login")
        } else {
            alert("Error restableciendo la contraseña")
        }
        } catch (error) {
        console.error(error)
        alert("Error restableciendo la contraseña")
        }
    }

  return (
        <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto max-w-md py-10">
        <h1 className="text-2xl font-bold mb-5">Restablecer contraseña</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingresa tu nueva contraseña (mínimo 8 caracteres).
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
                  <FormDescription>
                    Vuelve a ingresar tu nueva contraseña.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Restablecer contraseña</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}