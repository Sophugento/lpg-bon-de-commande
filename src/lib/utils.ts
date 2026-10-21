import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product } from "@/data/products";

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

export const NIGHT_CARE_OFFER_LABEL = "Offre de Noël 3 — dès 5 soins nuit achetés, 1 recharge à 5.- CHF par soin nuit";
const NIGHT_CARE_MIN = 5;
const NIGHT_CARE_REFILL_PRICE = 5;

function isNightCare(p: Product): boolean {
  return p.category === "Visage" && p.nameFr.toUpperCase().startsWith("SOIN NUIT");
}

// Every night care bought (all scents mixed) unlocks one refill at 5.- once at least 5 are bought
export function applyNightCareOffer(products: Product[], quantities: Record<string, number>): Product[] {
  const bought = products
    .filter((p) => isNightCare(p) && p.type === "revente")
    .reduce((sum, p) => sum + (quantities[p.ref] || 0), 0);
  if (bought < NIGHT_CARE_MIN) return products;
  let remaining = bought;
  return products.map((p) => {
    if (!isNightCare(p) || p.type !== "recharge" || remaining <= 0) return p;
    const discounted = Math.min(quantities[p.ref] || 0, remaining);
    remaining -= discounted;
    return discounted > 0 ? { ...p, offerQty: discounted, offerPrice: NIGHT_CARE_REFILL_PRICE } : p;
  });
}

export function lineSegments(
  p: Pick<Product, "price" | "offerQty" | "offerPrice">,
  qty: number
): { qty: number; unitPrice: number }[] {
  const discounted = p.offerPrice !== undefined ? Math.min(qty, p.offerQty ?? 0) : 0;
  const segments: { qty: number; unitPrice: number }[] = [];
  if (discounted > 0) segments.push({ qty: discounted, unitPrice: p.offerPrice! });
  if (qty - discounted > 0) segments.push({ qty: qty - discounted, unitPrice: p.price });
  return segments;
}

export function lineAmount(p: Pick<Product, "price" | "offerQty" | "offerPrice">, qty: number): number {
  return lineSegments(p, qty).reduce((sum, s) => sum + s.qty * s.unitPrice, 0);
}

export function translateSize(size: string, lang: string): string {
  if (lang === "fr") return size;
  return size
    .replace(/gélules/gi, "Kapseln")
    .replace(/sachets/gi, "Beutel")
    .replace(/Beutel\/Beutel/g, "Beutel");
}
