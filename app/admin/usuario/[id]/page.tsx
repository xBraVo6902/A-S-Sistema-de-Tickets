import { BackButton } from "@/components/back-button";
import UserInfo from "@/components/user-info";
import { getUserById } from "@/lib/actions";
import { ticketMetadata } from "@/prisma/ticketMetadata";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const user = await getUserById(id);

  const formatPhone = (phone: string) => {
    const countryCode = phone.slice(0, 2);
    const areaCode = phone.slice(2, 3);
    const firstPart = phone.slice(3, 7);
    const secondPart = phone.slice(7, 11);
    return `+${countryCode} ${areaCode} ${firstPart} ${secondPart}`;
  };

  const userData = {
    id: user.id.toString(),
    name: user.firstName + " " + user.lastName,
    rut: user.rut,
    email: user.email,
    phone: formatPhone(user.phone),
    avatar: user.avatar,
    assigned: user.assigned.map((ticket) => ({
      id: ticket.id.toString(),
      title: ticket.title,
      status: {
        text: ticketMetadata.status[ticket.status].text,
        color: ticketMetadata.status[ticket.status].color,
      },
    })),
  };

  return (
    <div className="container mx-auto py-10 md:px-10 space-y-6">
      <BackButton href="/admin/usuarios" text="Volver a la lista" />
      <UserInfo user={userData} />
    </div>
  );
}
