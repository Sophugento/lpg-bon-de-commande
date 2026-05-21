"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { ProductInfo } from "@/data/productInfo";
import { calcPromo, formatCHF, translateSize } from "@/lib/utils";
import { T, Lang } from "@/lib/i18n";
import QuantitySelector from "./QuantitySelector";
import ProductInfoModal from "./ProductInfoModal";

interface Props {
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

function StatusBadge({ status, t }: { status?: string; t: T }) {
  if (!status || status === "") return null;
  const config: Record<string, { label: string; bg: string; color: string }> = {
    "new":              { label: t.statusNew,     bg: "#2d2020", color: "#fff" },
    "indisponible":     { label: t.statusIndispo,  bg: "#e0dbd8", color: "#7a6e6a" },
    "rupture de stock": { label: t.statusRupture,  bg: "#f5e4c0", color: "#8a6000" },
  };
  const c = config[status];
  if (!c) return null;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

export default function ProductPairCard({ products, quantities, onChange, t, lang, productInfo, isAdmin, freeQuantities, onFreeQtyChange }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const revente = products.find((p) => p.type === "revente");
  const cabine = products.find((p) => p.type === "professionnel");
  const recharge = products.find((p) => p.type === "recharge");

  const nameFr = products[0].nameFr;
  const nameDe = products[0].nameDe;
  const name = lang === "de" ? nameDe : nameFr;
  const info = productInfo[nameFr];

  const hasRevente = Boolean(revente);
  const hasCabine = Boolean(cabine || recharge);
  const isPair = hasRevente && hasCabine;

  const reventeQty = revente ? quantities[revente.ref] || 0 : 0;
  const cabineQty = cabine ? quantities[cabine.ref] || 0 : 0;
  const rechargeQty = recharge ? quantities[recharge.ref] || 0 : 0;
  const isActive = reventeQty > 0 || cabineQty > 0 || rechargeQty > 0;

  const { paid: reventePaid, free: reventeFree } = calcPromo(reventeQty);

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

        {/* Colonnes */}
        <div className="flex">
          {/* REVENTE */}
          {revente && (
            <div
              className="flex-1 px-3 py-3"
              style={isPair ? { borderRight: "1px solid #f0ebe9" } : {}}
            >
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {(isPair || !hasCabine) && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white inline-block"
                    style={{ backgroundColor: "#d598aa" }}
                  >
                    {t.revente}
                  </span>
                )}
                <StatusBadge status={revente.status} t={t} />
              </div>
              <p className="text-xs" style={{ color: "#bba8a1" }}>
                {translateSize(revente.size, lang)}
              </p>
              <p className="text-base font-bold mt-1" style={{ color: "#2d2020" }}>
                {formatCHF(revente.price)}
              </p>
              {revente.retailPrice ? (
                <p className="text-[10px] mb-2" style={{ color: "#bba8a1" }}>
                  {t.prixVente} {formatCHF(revente.retailPrice)}
                </p>
              ) : (
                <div className="mb-2 h-4" />
              )}
              {isAdmin ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold w-12" style={{ color: "#bba8a1" }}>Payant</span>
                    <QuantitySelector value={reventeQty} onChange={(v) => onChange(revente.ref, v)} disabled={revente.status === "indisponible" || revente.status === "rupture de stock"} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold w-12" style={{ color: "#d598aa" }}>Offert</span>
                    <QuantitySelector value={freeQuantities?.[revente.ref] || 0} onChange={(v) => onFreeQtyChange?.(revente.ref, v)} />
                  </div>
                  {reventeQty > 0 && (
                    <p className="text-xs font-semibold" style={{ color: "#d598aa" }}>
                      = {formatCHF(reventeQty * revente.price)}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <QuantitySelector
                    value={reventeQty}
                    onChange={(v) => onChange(revente.ref, v)}
                    disabled={revente.status === "indisponible" || revente.status === "rupture de stock"}
                  />
                  {reventeQty > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-xs font-semibold" style={{ color: "#d598aa" }}>
                        = {formatCHF(reventePaid * revente.price)}
                      </p>
                      {revente.promoEligible && reventeFree > 0 && (
                        <p className="text-[10px]" style={{ color: "#d598aa" }}>
                          {t.promoLabel(reventeFree, reventeQty >= 10 ? "10+2" : "6+1")}
                        </p>
                      )}
                      {revente.promoEligible && reventeQty < 3 && reventeQty > 0 && (
                        <p className="text-[10px]" style={{ color: "#bf7585" }}>
                          {t.minQtyWarning}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* CABINE / RECHARGE */}
          {(cabine || recharge) && (() => {
            const prod = cabine || recharge!;
            const qty = cabine ? cabineQty : rechargeQty;
            const typeLabel = recharge ? t.recharge : t.cabine;
            const bgColor = recharge ? "#e8c0cc" : "#bba8a1";
            return (
              <div className="flex-1 px-3 py-3" style={{ backgroundColor: "#faf9f8" }}>
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  {(isPair || !hasRevente) && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white inline-block"
                      style={{ backgroundColor: bgColor }}
                    >
                      {typeLabel}
                    </span>
                  )}
                  <StatusBadge status={prod.status} t={t} />
                </div>
                <p className="text-xs" style={{ color: "#bba8a1" }}>
                  {translateSize(prod.size, lang)}
                </p>
                <p className="text-base font-bold mt-1" style={{ color: "#2d2020" }}>
                  {formatCHF(prod.price)}
                </p>
                {recharge && prod.retailPrice ? (
                  <p className="text-[10px] mb-2" style={{ color: "#bba8a1" }}>
                    {t.prixVente} {formatCHF(prod.retailPrice)}
                  </p>
                ) : (
                  <div className="mb-2 h-4" />
                )}
                <QuantitySelector
                  value={qty}
                  onChange={(v) => onChange(prod.ref, v)}
                  disabled={prod.status === "indisponible" || prod.status === "rupture de stock"}
                />
                {qty > 0 && (
                  <p className="text-xs font-semibold mt-1.5" style={{ color: "#bba8a1" }}>
                    = {formatCHF(qty * prod.price)}
                  </p>
                )}
              </div>
            );
          })()}

          {/* Produit seul */}
          {!hasRevente && !hasCabine && products[0] && (
            <div className="flex-1 px-3 py-3">
              <p className="text-xs mb-2" style={{ color: "#bba8a1" }}>
                {translateSize(products[0].size, lang)}
              </p>
              <p className="text-base font-bold mt-1">{formatCHF(products[0].price)}</p>
              <div className="mb-2 h-4" />
              <QuantitySelector
                value={quantities[products[0].ref] || 0}
                onChange={(v) => onChange(products[0].ref, v)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal info produit */}
      {showInfo && info && (
        <ProductInfoModal
          nameFr={nameFr}
          nameDe={nameDe}
          info={info}
          lang={lang}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  );
}
