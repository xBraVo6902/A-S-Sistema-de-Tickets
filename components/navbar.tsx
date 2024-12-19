"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "/public/brand.png";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-5 md:px-10 flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={Logo} alt="Company Logo" width={150} height={40} />
          </Link>
          <div className="flex items-center gap-4">
            <Button
              className="hidden md:flex"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Cerrar sesión
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="max-w-sm mx-auto bg-white p-6 pr-4 shadow-lg rounded-lg"
              >
                <MobileNav
                  onLogout={() => signOut({ callbackUrl: "/login" })}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

interface MobileNavProps {
  onLogout: () => void;
}

function MobileNav({ onLogout }: MobileNavProps) {
  return (
    <div className="grid gap-6">
      <Link href="/" className="flex items-center space-x-2">
        <Image src={Logo} alt="Company Logo" width={100} height={40} />
      </Link>
      <Button
        onClick={onLogout}
        className="w-full bg-black text-white rounded-md mt-4"
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
