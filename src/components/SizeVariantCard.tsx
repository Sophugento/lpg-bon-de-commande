"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { ProductInfo } from "@/data/productInfo";
import { formatCHF } from "@/lib/utils";
import { T, Lang } from "@/lib/i18n";
import QuantitySelector from "./QuantitySelector";
import ProductInfoModal from "./ProductInfoModal";

function StatusBadge({ status, t }: { status?: string; t: T }) {
  if (!status || status === "") return null;
  const config: Record<string, { label: string; bg: string; color: string }> = {
    "new":              { label: t.statusNew,    bg: "#2d2020", color: "#fff" },
    "indisponible":     { label: t.statusIndispo, bg: "#e0dbd8", color: "#7a6e6a" },
    "rupture de stock": { label: t.statusRupture, bg: "#f5e4c0", color: "#8a6000" },
  };
  const c = config[status];
  if (!c) return null;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ml-1"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

interface Props {
  baseName: string;
  baseNameDe: string;
  products: Product[];
  quantities: Record<string, number>;
  onChange: (ref: string, qty: number) => void;
  t: T;
  lang: Lang;
  productInfo: Record<string, ProductInfo>;
  isAdmin?: boolean;
  freeQuantities?: Record<string, number>;
  onFreeQtyChange?: (ref: string, qty: number) => void;
}

export default function SizeVariantCard({
  baseName,
  baseNameDe,
  products,
  quantities,
  onChange,
  t,
  lang,
  productInfo,
  isAdmin,
  freeQuantities,
  onFreeQtyChange,
}: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const name = lang === "de" ? baseNameDe : baseName;
  const info = productInfo[products[0].nameFr];
  const isActive = products.some((p) => (quantities[p.ref] || 0) > 0);

  return (
    <>
      <div
        className={`rounded-xl border mb-2 overflow-hidden transition-shadow ${isActive ? "shadow-md" : "shadow-sm"}`}
        style={{ borderColor: isActive ? "#d598aa" : "#ded5d1", backgroundColor: "white" }}
      >
        {/* Header */}
        <div
          className="px-4 pt-3 pb-2 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0ebe9" }}
        >
          <p className="text-sm font-bold uppercase tracking-wide flex-1 mr-2" style={{ color: "#2d2020" }}>
            {name}
          </p>
          {info && (
            <button
              onClick={() => setShowInfo(true)}
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors"
              style={{ borderColor: "#d598aa", color: "#d598aa" }}
              aria-label="Voir le produit"
            >
              i
            </button>
          )}
        </div>

        {/* Lignes par taille */}
        <div>
          {products.map((p, idx) => {
            const qty = quantities[p.ref] || 0;
            return (
              <div
                key={p.ref}
                className="px-4 py-2.5"
                style={idx < products.length - 1 ? { borderBottom: "1px solid #f0ebe9" } : {}}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold w-14 shrink-0" style={{ color: "#bba8a1" }}>
                    {p.size}
                  </span>
                  <span className="text-sm font-bold shrink-0 w-20 whitespace-nowrap" style={{ color: "#2d2020" }}>
                    {formatCHF(p.price)}
                  </span>
                  {isAdmin ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold w-12" style={{ color: "#bba8a1" }}>Payant</span>
                        <QuantitySelector
                          value={qty}
                          onChange={(v) => onChange(p.ref, v)}
                          disabled={p.status === "indisponible" || p.status === "rupture de stock"}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold w-12" style={{ color: "#d598aa" }}>Offert</span>
                        <QuantitySelector
                          value={freeQuantities?.[p.ref] || 0}
                          onChange={(v) => onFreeQtyChange?.(p.ref, v)}
                        />
                      </div>
                    </div>
                  ) : (
                    <QuantitySelector
                      value={qty}
                      onChange={(v) => onChange(p.ref, v)}
                      disabled={p.status === "indisponible" || p.status === "rupture de stock"}
                    />
                  )}
                  <StatusBadge status={p.status} t={t} />
                </div>
                {qty > 0 && (
                  <p className="text-xs font-semibold mt-1 pl-16" style={{ color: "#d598aa" }}>
                    = {formatCHF(qty * p.price)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showInfo && info && (
        <ProductInfoModal
          nameFr={baseName}
          nameDe={baseNameDe}
          info={info}
          lang={lang}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  );
}
