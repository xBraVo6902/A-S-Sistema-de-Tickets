import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentTickets = [
  { id: 1, title: "Problema con impresora", status: "Pendiente", date: "2023-06-01" },
  { id: 2, title: "Error en software de contabilidad", status: "En progreso", date: "2023-05-31" },
  { id: 3, title: "Actualización de sistema operativo", status: "Completado", date: "2023-05-30" },
  { id: 4, title: "Configuración de nuevo router", status: "Pendiente", date: "2023-05-29" },
  { id: 5, title: "Recuperación de datos", status: "En progreso", date: "2023-05-28" },
]

export function RecentTickets() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentTickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.id}</TableCell>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>{ticket.status}</TableCell>
            <TableCell>{ticket.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}