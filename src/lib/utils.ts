import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCHF(amount: number): string {
  return amount.toFixed(2).replace(".", ",") + " CHF";
}

export function calcPromo(qty: number): { paid: number; free: number } {
  if (qty >= 10) return { paid: qty - 2, free: 2 };
  if (qty >= 6) return { paid: qty - 1, free: 1 };
  return { paid: qty, free: 0 };
}

export function translateSize(size: string, lang: string): string {
  if (lang === "fr") return size;
  return size
    .replace(/gélules/gi, "Kapseln")
    .replace(/sachets/gi, "Beutel")
    .replace(/Beutel\/Beutel/g, "Beutel");
}
