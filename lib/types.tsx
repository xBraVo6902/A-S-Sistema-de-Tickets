export interface TicketMetadata {
  statuses: {
    id: number;
    name: string;
    lucideIcon: string;
    hexColor: string;
  }[];
  types: { id: number; name: string; lucideIcon: string; hexColor: string }[];
  priorities: {
    id: number;
    name: string;
    lucideIcon: string;
    hexColor: string;
  }[];
}
