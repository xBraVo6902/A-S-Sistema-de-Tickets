import LoginForm from "@/components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Suspense>
        <div className="">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}
