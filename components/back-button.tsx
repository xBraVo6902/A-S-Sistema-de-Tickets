import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  text: string;
}

export function BackButton(props: BackButtonProps) {
  return (
    <Link href={props.href}>
      <Button variant="outline" className="hover:bg-secondary">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        {props.text}
      </Button>
    </Link>
  );
}
