import { Button } from "./ui/button";

export type WhatsAppProps = {
  data: {
    name: string;
    phone: string;
    title: string;
    id: string;
  };
};

export default function TicketMessageButton(props: WhatsAppProps) {
  const { name, phone, title, id } = props.data;
  const message = `Hola, soy ${name} y me comunico contigo respecto al ticket: ${title} (ID: ${id})`;

  return (
    <Button className="bg-[#25D366] hover:bg-[#1ea952]">
      <a
        className="flex items-center gap-2"
        href={`https://wa.me/${phone}?text=${message}`}
        target="_blank"
      >
        <i className="ri-whatsapp-line text-2xl"></i>
        Enviar mensaje
      </a>
    </Button>
  );
}
