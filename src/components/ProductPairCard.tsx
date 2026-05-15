"use client";

import { Product } from "@/data/products";
import { calcPromo, formatCHF, translateSize } from "@/lib/utils";
import { T, Lang } from "@/lib/i18n";
import QuantitySelector from "./QuantitySelector";

interface Props {
  products: Product[];
  quantities: Record<string, number>;
  onChange: (ref: string, qty: number) => void;
  t: T;
  lang: Lang;
}

export default function ProductPairCard({ products, quantities, onChange, t, lang }: Props) {
  const revente = products.find((p) => p.type === "revente");
  const cabine = products.find((p) => p.type === "professionnel");
  const recharge = products.find((p) => p.type === "recharge");

  const name = lang === "de" ? products[0].nameDe : products[0].nameFr;
  const hasRevente = Boolean(revente);
  const hasCabine = Boolean(cabine || recharge);
  const isPair = hasRevente && hasCabine;

  const reventeQty = revente ? quantities[revente.ref] || 0 : 0;
  const cabineQty = cabine ? quantities[cabine.ref] || 0 : 0;
  const rechargeQty = recharge ? quantities[recharge.ref] || 0 : 0;
  const isActive = reventeQty > 0 || cabineQty > 0 || rechargeQty > 0;

  const { paid: reventePaid, free: reventeFree } = calcPromo(reventeQty);

  return (
    <div
      className={`rounded-xl border mb-2 overflow-hidden transition-shadow ${isActive ? "shadow-md" : "shadow-sm"}`}
      style={{ borderColor: isActive ? "#d598aa" : "#ded5d1", backgroundColor: "white" }}
    >
      {/* Nom du produit */}
      <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid #f0ebe9" }}>
        <p className="text-sm font-bold uppercase tracking-wide" style={{ color: "#2d2020" }}>
          {name}
        </p>
      </div>

      {/* Colonnes */}
      <div className="flex">
        {/* REVENTE */}
        {revente && (
          <div
            className="flex-1 px-3 py-3"
            style={isPair ? { borderRight: "1px solid #f0ebe9" } : {}}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white inline-block mb-2"
              style={{ backgroundColor: "#d598aa" }}
            >
              {t.revente}
            </span>
            <p className="text-xs" style={{ color: "#bba8a1" }}>
              {translateSize(revente.size, lang)}
            </p>
            <p className="text-base font-bold mt-1" style={{ color: "#2d2020" }}>
              {formatCHF(revente.price)}
            </p>
            {revente.retailPrice && (
              <p className="text-[10px] mb-2" style={{ color: "#bba8a1" }}>
                {t.prixVente} {formatCHF(revente.retailPrice)}
              </p>
            )}
            {!revente.retailPrice && <div className="mb-2 h-4" />}
            <QuantitySelector
              value={reventeQty}
              onChange={(v) => onChange(revente.ref, v)}
            />
            {reventeQty > 0 && (
              <div className="mt-1.5 space-y-0.5">
                <p className="text-xs font-semibold" style={{ color: "#d598aa" }}>
                  = {formatCHF(reventePaid * revente.price)}
                </p>
                {reventeFree > 0 && (
                  <p className="text-[10px]" style={{ color: "#d598aa" }}>
                    {t.promoLabel(reventeFree, reventeQty >= 10 ? "10+2" : "6+1")}
                  </p>
                )}
                {reventeQty < 3 && reventeQty > 0 && (
                  <p className="text-[10px]" style={{ color: "#bf7585" }}>
                    {t.minQtyWarning}
                  </p>
                )}
              </div>
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
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white inline-block mb-2"
                style={{ backgroundColor: bgColor }}
              >
                {typeLabel}
              </span>
              <p className="text-xs" style={{ color: "#bba8a1" }}>
                {translateSize(prod.size, lang)}
              </p>
              <p className="text-base font-bold mt-1" style={{ color: "#2d2020" }}>
                {formatCHF(prod.price)}
              </p>
              <div className="mb-2 h-4" /> {/* aligne avec revente */}
              <QuantitySelector
                value={qty}
                onChange={(v) => onChange(prod.ref, v)}
              />
              {qty > 0 && (
                <p className="text-xs font-semibold mt-1.5" style={{ color: "#bba8a1" }}>
                  = {formatCHF(qty * prod.price)}
                </p>
              )}
            </div>
          );
        })()}

        {/* Produit seul (ni revente ni cabine dans la paire) */}
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
  );
}
