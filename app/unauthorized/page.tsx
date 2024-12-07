import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <ShieldAlert className="mx-auto h-24 w-24 text-yellow-500 animate-pulse" />
          <h1 className="text-4xl font-extrabold text-gray-900">
            403 Forbidden
          </h1>
          <p className="text-lg text-gray-600">
            ¡Ups! Parece que no tienes acceso a esta página.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <p className="text-gray-700">
            Si crees que se trata de un error, por favor contáctate con el
            administrador del sitio.
          </p>
          <Button asChild className="w-full">
            <Link href="/" className="inline-flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la página de inicio
            </Link>
          </Button>
        </div>
        <p className="text-sm text-gray-500">Error: 403 | Acceso Denegado</p>
      </div>
    </div>
  );
}
