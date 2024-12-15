import { Button } from "./ui/button";

export type WhatsAppProps = {
  data: {
    name: string;
    phone: string | undefined;
    title: string;
    id: string;
  };
  role: "User" | "Client";
};

export default function TicketMessageButton(props: WhatsAppProps) {
  const { name, phone, title, id } = props.data;
  const message =
    props.role === "User"
      ? `Hola, soy ${name} y me comunico con usted respecto al ticket que ha creado: ${title} (ID: ${id}). ¿En qué lo puedo ayudar?`
      : `Hola, soy ${name} y me comunico con usted respecto al ticket: ${title} (ID: ${id}). Espero su respuesta.`;

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
