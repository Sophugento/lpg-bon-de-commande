import { Product, Offer } from "@/data/products";
import { ProductInfo } from "@/data/productInfo";
import { PRODUCTS, OFFERS } from "@/data/products";
import { PRODUCT_INFO } from "@/data/productInfo";
import { NO_REF_PREFIX } from "@/lib/utils";

const SHEET_ID = "1Hi3Y28psXFNXvOeFaKqtxgATeC9bXVTk";
// Dossier Drive public "Images" — photos des goodies, matériel marketing, textiles, etc.
const DRIVE_IMAGES_FOLDER = "1r542Uo-xuOjHnNnHbp-G3kJZSRT4oNrQ";
// Ces catégories gardent les images du site LPG
const LPG_SITE_CATEGORIES = ["Corps", "Visage", "Nutricosmetics"];

interface DriveFile {
  id: string;
  tokens: string[];
}

function nameTokens(name: string): string[] {
  return name
    .replace(/\.(png|jpe?g|webp|gif)$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
    .map((t) => (t.length > 3 && t.endsWith("S") ? t.slice(0, -1) : t));
}

// Lists the public folder via the embedded view (no API key needed)
async function fetchDriveImages(): Promise<DriveFile[]> {
  try {
    const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${DRIVE_IMAGES_FOLDER}`, { cache: "no-store" });
    if (!res.ok) return [];
    const html = await res.text();
    const re = /id="entry-([\w-]+)"[\s\S]*?class="flip-entry-title">([^<]+)</g;
    const files: DriveFile[] = [];
    for (let m = re.exec(html); m; m = re.exec(html)) {
      files.push({ id: m[1], tokens: nameTokens(m[2]) });
    }
    return files;
  } catch {
    return [];
  }
}

// A file matches when every word of its name appears in the product name; most specific file wins
function matchDriveImage(productName: string, files: DriveFile[]): string | undefined {
  const productTokens = new Set(nameTokens(productName));
  let best: DriveFile | undefined;
  for (const f of files) {
    if (f.tokens.length === 0 || !f.tokens.every((t) => productTokens.has(t))) continue;
    if (!best || f.tokens.length > best.tokens.length) best = f;
  }
  return best ? `https://drive.google.com/thumbnail?id=${best.id}&sz=w400` : undefined;
}

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
  let labels = table.cols.map((c) => {
    const label = c.label.trim();
    const markerIdx = label.indexOf(" 📌");
    return markerIdx >= 0 ? label.slice(0, markerIdx) : label;
  });
  let dataRows = table.rows.filter((row) => row !== null && row.c !== null);
  // When gviz returns empty labels (no recognised header row), use first data row as headers
  if (labels.every((l) => l === "") && dataRows.length > 0) {
    labels = dataRows[0]!.c.map((cell) => (cell?.v != null ? String(cell.v).trim() : ""));
    dataRows = dataRows.slice(1);
  }
  return dataRows.map((row) => {
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
    const [prodRows, offerRows, descRows, driveFiles] = await Promise.all([
      fetchSheet("Produits"),
      fetchSheet("Offres spéciales"),
      fetchSheet("Descriptions & Images"),
      fetchDriveImages(),
    ]);

    // ── Produits ───────────────────────────────────────────────────────
    const products: Product[] = prodRows
      // Off-stock items (e.g. stickers) have no Winbiz ref: keep them, keyed by name/type/size
      .filter((r) => str(r["Nom FR"]).trim() && !str(r["Réf."]).startsWith("📌"))
      .map((r) => ({
        ref: str(r["Réf."]) || `${NO_REF_PREFIX}${str(r["Nom FR"]).trim()}|${str(r["Type"])}|${str(r["Contenant"])}`,
        nameFr: str(r["Nom FR"]),
        nameDe: str(r["Nom DE"]),
        type: str(r["Type"]) as Product["type"],
        size: str(r["Contenant"]),
        price: num(r["Prix CHF (HT)"]),
        retailPrice: r["Prix vente conseillé CHF"] ? num(r["Prix vente conseillé CHF"]) : undefined,
        category: str(r["Catégorie"]),
        subcategory: str(r["Sous-catégorie"]),
        promoEligible: bool(r["Promo éligible"]),
        status: (str(r["Statut"]).toLowerCase() || undefined) as Product["status"],
      }));

    // ── Offres ─────────────────────────────────────────────────────────
    const parsedOffers: Offer[] = offerRows
      .filter((r) => str(r["ID"]) && !str(r["ID"]).startsWith("📌"))
      .map((r) => ({
        id: str(r["ID"]),
        nameFr: str(r["Nom FR"]),
        nameDe: str(r["Nom DE"]),
        price: num(r["Prix CHF (HT)"]),
        description: str(r["Description (contenu)"]),
        gift: str(r["Cadeau inclus"]),
      }));
    // Fallback to static offers if sheet returned nothing (e.g. column name mismatch)
    const offers: Offer[] = parsedOffers.length > 0 ? parsedOffers : OFFERS;

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
    const mergedProductInfo: Record<string, ProductInfo> = { ...PRODUCT_INFO, ...productInfo };

    // Drive photos override (or fill in) images for non-cosmetic categories
    for (const p of products) {
      if (LPG_SITE_CATEGORIES.includes(p.category)) continue;
      const driveUrl = matchDriveImage(p.nameFr, driveFiles);
      if (!driveUrl) continue;
      const existing = mergedProductInfo[p.nameFr];
      mergedProductInfo[p.nameFr] = existing
        ? { ...existing, imageUrl: driveUrl }
        : { description: "", descriptionDe: "", benefits: [], benefitsDe: [], imageUrl: driveUrl };
    }

    return { products, offers, productInfo: mergedProductInfo };
  } catch (err) {
    // Fallback to static data if Google Sheets is unavailable
    console.error("Google Sheets unavailable, using static data:", err);
    return { products: PRODUCTS, offers: OFFERS, productInfo: PRODUCT_INFO };
  }
}
