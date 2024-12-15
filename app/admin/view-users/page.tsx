"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketCount: number;
};

type Ticket = {
  id: string;
  userId: string | null; 
};

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

const fetchAssignedTickets = async (): Promise<Ticket[]> => {
  const response = await fetch("/api/tickets/assigned");
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return response.json();
};


  

export default function ViewUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const editUser = (user: User) => {
    setEditingUser(user);
  };

  const deleteUser = async (userId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`/api/users?id=${userId}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar el usuario");
        }
  
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("No se pudo eliminar el usuario. Revisa la consola para más detalles.");
      }
    }
  };
  
  

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, ticketsData] = await Promise.all([fetchUsers(), fetchAssignedTickets()]);

        // Calcular el número de tickets asignados a cada usuario
        const userTicketCount = ticketsData.reduce((acc: Record<string, number>, ticket: Ticket) => {
          if (ticket.userId) {
            acc[ticket.userId] = (acc[ticket.userId] || 0) + 1;
          }
          return acc;
        }, {});

        // Combinar usuarios con sus tickets asignados
        const updatedUsers = usersData.map((user) => ({
          ...user,
          ticketCount: userTicketCount[user.id] || 0, // Número de tickets asignados
        }));

        setUsers(updatedUsers);
      } catch {
        setError("Failed to load users or tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar usuarios con React.useMemo
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const searchTerm = search.toLowerCase();
      
      return (
        fullName.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        String(user.id).includes(searchTerm)
      );
    });
  }, [users, search]);

  // Columnas de la tabla
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "firstName",
      header: "Nombre",
      cell: ({ row }) => <div>{`${row.getValue("firstName")} ${row.original.lastName}`}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "ticketCount",
      header: "Tickets Asignados",
      cell: ({ row }) => <div>{row.getValue("ticketCount")}</div>,
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const user = row.original;
    
          return (
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => editUser(user)}
              >
                Editar
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => deleteUser(user.id)}
              >
                Eliminar
              </button>
            </div>
          );
        },
      },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto my-10 md:px-10">
      <h1 className="text-center md:text-left text-2xl font-semibold mb-5">
        Gestión de Usuarios
      </h1>
      <Input
        placeholder="Buscar usuarios por nombre, correo o ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded-md shadow-sm w-full max-w-md"
      />

      {loading ? (
        <div>Cargando usuarios...</div>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredUsers.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {/* Modal para editar usuario */}
    {editingUser && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
          <form
            onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await fetch(`/api/users`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: editingUser.id,
                      firstName: editingUser.firstName,
                      lastName: editingUser.lastName,
                      email: editingUser.email,
                    }),
                  });
              
                  // Recargar usuarios desde el servidor
                  const updatedUsers = await fetchUsers();
                  setUsers(updatedUsers);
              
                  setEditingUser(null); // Cierra el modal
                } catch {
                  alert("Error al actualizar el usuario.");
                }
              }}
              
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                value={editingUser.firstName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, firstName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                type="text"
                value={editingUser.lastName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, lastName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
      
    </div>
  );
}
