import TicketMessageButton from "./ticket-message-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export type TicketInfoProps = {
  data: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    type: string;
    priority: string;
    user: {
      name: string;
      email: string;
      avatar: string | null;
      phone: string;
    } | null;
    client: {
      name: string;
      email: string;
      avatar: string | null;
      phone: string;
    };
  };
};

export default function TicketInfo(props: TicketInfoProps) {
  const whatsappData = {
    name: props.data.client.name,
    phone: "56964141800",
    title: props.data.title,
    id: props.data.id,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              {props.data.title}
            </CardTitle>
            <div className="flex space-x-2 mb-2">
              <Badge variant="outline">{props.data.status}</Badge>
              <Badge variant="outline">{props.data.type}</Badge>
              <Badge variant="outline">Prioridad {props.data.priority}</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">ID: {props.data.id}</p>
            <p className="text-sm text-muted-foreground">
              Fecha de creación: {props.data.createdAt}
            </p>
            <p className="text-sm text-muted-foreground">
              Última modificación: {props.data.updatedAt}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p>{props.data.description}</p>
          </div>
          <Separator />
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Creado por</h3>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src={props.data.client.avatar ?? ""}
                    alt={props.data.client.name}
                  />
                  <AvatarFallback>
                    {props.data.client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{props.data.client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {props.data.client.email}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Asignado a</h3>
              {props.data.user ? (
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={props.data.user.avatar ?? ""}
                      alt={props.data.user.name}
                    />
                    <AvatarFallback>
                      {props.data.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{props.data.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {props.data.user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin asignar</p>
              )}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Contacta al técnico</h3>
            <TicketMessageButton data={whatsappData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
