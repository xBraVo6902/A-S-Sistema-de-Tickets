import LoginForm from "@/components/login-form";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Suspense>
        <div className="">
          <LoginForm />
          <p className="text-sm text-gray-600 mt-4">
            ¿Has olvidado tu contraseña?{" "}
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Recupérala aquí
            </Link>
          </p>
        </div>
      </Suspense>
    </div>
  );
}
