/* Ya que la base de datos está en inglés, este archivo contiene los campos
traducidos al español. Estas traducciones se exportan y utilizan en todo el
proyecto, por lo que si se quiere cambiar algún campo de la base de datos
debe hacerse aquí (y obviamente en el archivo schema.prisma). */

export const translations = {
  status: {
    Open: "Abierto",
    Closed: "Cerrado",
    InProgress: "En progreso",
  },
  type: {
    Hardware: "Hardware",
    Software: "Software",
    Other: "Otro",
  },
  priority: {
    Low: "Baja",
    Medium: "Media",
    High: "Alta",
  },
};
