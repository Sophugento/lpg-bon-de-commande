import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCHF(amount: number): string {
  return amount.toFixed(2).replace(".", ",") + " CHF";
}

export function calcPromo(qty: number): { paid: number; free: number } {
  if (qty >= 10) return { paid: qty, free: 2 };
  if (qty >= 6) return { paid: qty, free: 1 };
  return { paid: qty, free: 0 };
}

export type ChristmasOffer = 0 | 1 | 2;

export const CHRISTMAS_OFFER_LABELS: Record<1 | 2, string> = {
  1: "Offre de Noël 1 — -50% sur Yeux & Lèvres (revente)",
  2: "Offre de Noël 2 — Yeux & Lèvres (revente) à 10.- CHF",
};

export function isChristmasEligible(p: { category: string; subcategory: string; type: string }): boolean {
  return p.category === "Visage" && p.subcategory === "Yeux & Lèvres" && p.type === "revente";
}

export function christmasPrice(price: number, offer: 1 | 2): number {
  return offer === 1 ? Math.round(price * 50) / 100 : 10;
}

export function translateSize(size: string, lang: string): string {
  if (lang === "fr") return size;
  return size
    .replace(/gélules/gi, "Kapseln")
    .replace(/sachets/gi, "Beutel")
    .replace(/Beutel\/Beutel/g, "Beutel");
}
