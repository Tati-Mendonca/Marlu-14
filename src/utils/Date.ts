import { Timestamp } from "firebase/firestore";

export function normalizeDate(date: string | Timestamp | Date): Date {
  if (!date) return new Date("");

  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  if (date instanceof Timestamp) return date.toDate();
  if (date instanceof Date) return date;

  throw new Error("Formato de data inválido");
}
