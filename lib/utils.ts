import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const formattedDate = format(d, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
    locale: es,
  });
  const relativeTime = formatDistanceToNow(d, { 
    addSuffix: true,
    locale: es 
  });

  return `${formattedDate} (${relativeTime})`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
