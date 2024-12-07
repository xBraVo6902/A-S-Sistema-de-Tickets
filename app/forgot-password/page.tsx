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

const formSchema = z.object({
  email: z.string().email({
    message: "Debe ser un email válido.",
  }),
})

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
        const response = await fetch("/api/forgot-password", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    
        if (response.ok) {
            alert("Correo de recuperación enviado")
        } else {
            alert("Error enviando el correo")
        }
        } catch (error) {
        console.error(error)
        alert("Error enviando el correo")
        }
    }

  return (
        <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto max-w-md py-10">
        <h1 className="text-2xl font-bold mb-5">Olvidé mi contraseña</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingresa el email asociado a tu cuenta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enviar instrucciones</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}