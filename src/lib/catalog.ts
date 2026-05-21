import { Product, Offer } from "@/data/products";
import { ProductInfo } from "@/data/productInfo";
import { PRODUCTS, OFFERS } from "@/data/products";
import { PRODUCT_INFO } from "@/data/productInfo";

const SHEET_ID = "1Hi3Y28psXFNXvOeFaKqtxgATeC9bXVTk";

interface GvizTable {
  cols: { label: string; type: string }[];
  rows: ({ c: ({ v: unknown; f?: string } | null)[] } | null)[];
}

async function fetchSheet(sheetName: string): Promise<Record<string, unknown>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${sheetName}`);
  const text = await res.text();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}") + 1;
  const table: GvizTable = JSON.parse(text.slice(start, end)).table;
  // Trim labels and strip any 📌 section marker that got merged into the header cell during Excel import
  const labels = table.cols.map((c) => {
    const label = c.label.trim();
    const markerIdx = label.indexOf(" 📌");
    return markerIdx >= 0 ? label.slice(0, markerIdx) : label;
  });
  return table.rows
    .filter((row) => row !== null && row.c !== null)
    .map((row) => {
      const obj: Record<string, unknown> = {};
      row!.c.forEach((cell, i) => {
        obj[labels[i]] = cell?.v ?? "";
      });
      return obj;
    });
}

function str(v: unknown): string {
  return v == null ? "" : String(v);
}
function num(v: unknown): number {
  const n = parseFloat(String(v));
  return isNaN(n) ? 0 : n;
}
function bool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  return String(v).toLowerCase() === "true";
}

export interface Catalog {
  products: Product[];
  offers: Offer[];
  productInfo: Record<string, ProductInfo>;
}

export async function getCatalog(): Promise<Catalog> {
  try {
    const [prodRows, offerRows, descRows] = await Promise.all([
      fetchSheet("Produits"),
      fetchSheet("Offres spéciales"),
      fetchSheet("Descriptions & Images"),
    ]);

    // ── Produits ───────────────────────────────────────────────────────
    const products: Product[] = prodRows
      .filter((r) => str(r["Réf."]) && !str(r["Réf."]).startsWith("📌"))
      .map((r) => ({
        ref: str(r["Réf."]),
        nameFr: str(r["Nom FR"]),
        nameDe: str(r["Nom DE"]),
        type: str(r["Type"]) as Product["type"],
        size: str(r["Contenant"]),
        price: num(r["Prix CHF (HT)"]),
        retailPrice: r["Prix vente conseillé CHF"] ? num(r["Prix vente conseillé CHF"]) : undefined,
        category: str(r["Catégorie"]),
        subcategory: str(r["Sous-catégorie"]),
        promoEligible: bool(r["Promo éligible"]),
        status: (str(r["Statut"]) || undefined) as Product["status"],
      }));

    // ── Offres ─────────────────────────────────────────────────────────
    const offers: Offer[] = offerRows
      .filter((r) => str(r["ID"]) && !str(r["ID"]).startsWith("📌"))
      .map((r) => ({
        id: str(r["ID"]),
        nameFr: str(r["Nom FR"]),
        nameDe: str(r["Nom DE"]),
        price: num(r["Prix CHF (HT)"]),
        description: str(r["Description (contenu)"]),
        gift: str(r["Cadeau inclus"]),
      }));

    // ── Descriptions & images ──────────────────────────────────────────
    const productInfo: Record<string, ProductInfo> = {};
    descRows
      .filter((r) => str(r["Nom FR (clé)"]) && !str(r["Nom FR (clé)"]).startsWith("📌"))
      .forEach((r) => {
        const key = str(r["Nom FR (clé)"]);
        const benefits = [str(r["Bénéfice 1 FR"]), str(r["Bénéfice 2 FR"]), str(r["Bénéfice 3 FR"])].filter(Boolean);
        const benefitsDe = [str(r["Bénéfice 1 DE"]), str(r["Bénéfice 2 DE"]), str(r["Bénéfice 3 DE"])].filter(Boolean);
        productInfo[key] = {
          description: str(r["Description FR"]),
          descriptionDe: str(r["Description DE"]),
          benefits,
          benefitsDe,
          imageUrl: str(r["URL Image (lpg-group.com/media/wysiwyg/...)"]) || undefined,
        };
      });

    // Merge: static data is the base, Google Sheet entries override when present
    const mergedProductInfo = { ...PRODUCT_INFO, ...productInfo };

    return { products, offers, productInfo: mergedProductInfo };
  } catch (err) {
    // Fallback to static data if Google Sheets is unavailable
    console.error("Google Sheets unavailable, using static data:", err);
    return { products: PRODUCTS, offers: OFFERS, productInfo: PRODUCT_INFO };
  }
}
