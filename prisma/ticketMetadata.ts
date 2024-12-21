export const ticketMetadata = {
  status: {
    Open: {
      text: "Abierto",
      icon: "CircleDot",
      color: "#2471a3", // Azul más oscuro
    },
    Closed: {
      text: "Cerrado",
      icon: "CheckCircle2",
      color: "#27ae60", // Verde más oscuro
    },
    InProgress: {
      text: "En progreso",
      icon: "Timer",
      color: "#d4ac0d", // Amarillo más oscuro
    },
  },
  type: {
    Bug: {
      text: "Bug",
      icon: "Bug",
      color: "#c0392b", // Rojo más oscuro
    },
    Feature: {
      text: "Característica",
      icon: "Lightbulb",
      color: "#8e44ad", // Morado más oscuro
    },
    Question: {
      text: "Pregunta",
      icon: "HelpCircle",
      color: "#2471a3", // Azul más oscuro
    },
  },
  priority: {
    Low: {
      text: "Baja",
      icon: "ArrowDown",
      color: "#27ae60", // Verde más oscuro
    },
    Medium: {
      text: "Media",
      icon: "ArrowRight",
      color: "#d4ac0d", // Amarillo más oscuro
    },
    High: {
      text: "Alta",
      icon: "ArrowUp",
      color: "#c0392b", // Rojo más oscuro
    },
    Urgent: {
      text: "Urgente",
      icon: "ClockAlert",
      color: "#5c0099",
    },
  },
};
