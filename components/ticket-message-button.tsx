import { Button } from "./ui/button";

export type WhatsAppProps = {
  phone: string | undefined;
};

export default function TicketMessageButton(props: WhatsAppProps) {
  return (
    <Button className="bg-[#25D366] hover:bg-[#1ea952]">
      <a
        className="flex items-center gap-2"
        href={`https://wa.me/${props.phone}`}
        target="_blank"
      >
        <i className="ri-whatsapp-line text-2xl"></i>
        Enviar mensaje
      </a>
    </Button>
  );
}
