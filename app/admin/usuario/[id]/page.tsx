import { BackButton } from "@/components/back-button";
import UserInfo from "@/components/user-info";

export default function UserPage() {
  const user = {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    rut: "12.345.678-9",
    email: "juan.perez@example.com",
    phone: "+56 9 1234 5678",
    avatar: null,
    assignedTickets: [
      {
        id: "T1",
        title: "Problema con la impresora",
        status: { text: "En progreso", color: "#FFA500" },
      },
      {
        id: "T2",
        title: "Actualización de software",
        status: { text: "Pendiente", color: "#FF0000" },
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 md:px-10 space-y-6">
      <BackButton href="/admin/usuarios" text="Volver a la lista" />
      <UserInfo user={user} />
    </div>
  );
}
