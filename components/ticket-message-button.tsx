import { Button } from "./ui/button";

export default function TicketMessageButton() {
  return (
    <Button className="bg-[#25D366] hover:bg-[#1ea952] flex items-center gap-2">
      <i className="ri-whatsapp-line text-2xl"></i>
      Enviar mensaje
    </Button>
  );
}
